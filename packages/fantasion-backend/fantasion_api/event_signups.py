import json
import logging
import os
from datetime import datetime, timezone

from django.conf import settings
from django.core.cache import cache
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import validate_email
from django.urls import path
from django.utils.translation import gettext_lazy as _
from google.auth.transport.requests import AuthorizedSession
from google.oauth2 import service_account
from rest_framework import status
from rest_framework.response import Response
from rest_framework.serializers import (
    CharField,
    DictField,
    Serializer,
    ValidationError,
)

from fantasion_content.models import StaticArticle

from .decorators import public_endpoint, with_serializer

logger = logging.getLogger(__name__)

SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'
RATE_LIMIT_IP = 5
RATE_LIMIT_EMAIL = 3
RATE_LIMIT_WINDOW = 3600
MIN_FORM_SECONDS = 2
MAX_FORM_SECONDS = 60 * 60 * 24


class EventSignupSerializer(Serializer):
    article_key = CharField(max_length=64)
    answers = DictField(
        child=CharField(allow_blank=True, max_length=2000),
        allow_empty=True,
    )
    # Honeypot — must stay empty. Bots often fill every field.
    website = CharField(required=False, allow_blank=True, max_length=200)
    form_started = CharField(required=False, allow_blank=True, max_length=32)


def _client_ip(request):
    forwarded = request.META.get('HTTP_X_FORWARDED_FOR', '')
    if forwarded:
        return forwarded.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR') or 'unknown'


def _rate_limited(key, limit):
    count = cache.get(key, 0)
    if count >= limit:
        return True
    cache.set(key, count + 1, RATE_LIMIT_WINDOW)
    return False


def _timing_ok(form_started):
    if not form_started:
        return False
    try:
        started = int(form_started)
    except (TypeError, ValueError):
        return False
    now_ms = int(datetime.now(timezone.utc).timestamp() * 1000)
    elapsed = (now_ms - started) / 1000
    return MIN_FORM_SECONDS <= elapsed <= MAX_FORM_SECONDS


def _get_article(article_key):
    try:
        return StaticArticle.objects.get(key=article_key)
    except StaticArticle.DoesNotExist:
        raise ValidationError({
            'article_key': [str(_('Článek pro přihlášku nebyl nalezen.'))],
        })


def _validate_answers(fields, answers):
    cleaned = {}
    errors = {}
    allowed_keys = {field['key'] for field in fields}

    for key in answers:
        if key not in allowed_keys:
            errors[key] = [str(_('Neznámé pole formuláře.'))]

    for field in fields:
        key = field['key']
        raw = answers.get(key, '')
        value = (raw if isinstance(raw, str) else str(raw or '')).strip()
        if field['required'] and not value:
            errors[key] = [str(_('Toto pole je povinné.'))]
            continue
        if value and field['type'] == 'email':
            try:
                validate_email(value)
            except DjangoValidationError:
                errors[key] = [str(_('Zadej platný e-mail.'))]
                continue
        cleaned[key] = value

    if errors:
        raise ValidationError(errors)
    return cleaned


def _email_for_rate_limit(fields, answers):
    for field in fields:
        if field['type'] == 'email' or field['key'] == 'email':
            value = (answers.get(field['key']) or '').strip().lower()
            if value:
                return value
    return None


def _get_sheets_session():
    raw = os.environ.get('GS_CREDENTIALS')
    if not raw:
        return None
    credentials = service_account.Credentials.from_service_account_info(
        json.loads(raw),
        scopes=[SHEETS_SCOPE],
    )
    return AuthorizedSession(credentials)


def append_signup_row_local(header, values):
    """Local DEBUG fallback when Google Sheet is not configured."""
    import csv
    from pathlib import Path

    path = Path(settings.BASE_DIR) / 'event_signups_local.csv'
    write_header = not path.exists()
    with path.open('a', newline='', encoding='utf-8') as handle:
        writer = csv.writer(handle)
        if write_header:
            writer.writerow(header)
        writer.writerow(values)
    logger.info('Stored event signup locally in %s', path)
    return {'local': str(path)}


def append_signup_row(header, values):
    sheet_id = getattr(settings, 'EVENT_SIGNUP_SHEET_ID', None) or os.environ.get(
        'EVENT_SIGNUP_SHEET_ID'
    )
    sheet_tab = getattr(settings, 'EVENT_SIGNUP_SHEET_TAB', None) or os.environ.get(
        'EVENT_SIGNUP_SHEET_TAB', 'Sheet1'
    )
    if not sheet_id:
        if settings.DEBUG:
            return append_signup_row_local(header, values)
        raise RuntimeError('EVENT_SIGNUP_SHEET_ID is not configured')

    session = _get_sheets_session()
    if session is None:
        if settings.DEBUG:
            return append_signup_row_local(header, values)
        raise RuntimeError('GS_CREDENTIALS is not configured')

    range_name = f'{sheet_tab}!A:ZZ'
    url = (
        f'https://sheets.googleapis.com/v4/spreadsheets/{sheet_id}'
        f'/values/{range_name}:append'
    )
    response = session.post(
        url,
        params={'valueInputOption': 'USER_ENTERED', 'insertDataOption': 'INSERT_ROWS'},
        json={'values': [values]},
        timeout=20,
    )
    if response.status_code >= 400:
        logger.error('Sheets append failed: %s %s', response.status_code, response.text)
        response.raise_for_status()
    return response.json()


def _build_row(article_key, fields, answers):
    timestamp = datetime.now(timezone.utc).isoformat(timespec='seconds')
    header = ['timestamp', 'article_key'] + [field['key'] for field in fields]
    values = [timestamp, article_key] + [
        answers.get(field['key'], '') for field in fields
    ]
    return header, values


@public_endpoint(['POST'])
@with_serializer(EventSignupSerializer)
def create_event_signup(request, serializer):
    data = serializer.validated_data

    # Silent reject for honeypot hits — look like success to bots.
    if (data.get('website') or '').strip():
        logger.warning('Event signup honeypot triggered from %s', _client_ip(request))
        return Response({'ok': True}, status=status.HTTP_201_CREATED)

    if not _timing_ok(data.get('form_started')):
        return Response(
            {
                'nonFieldErrors': [
                    str(_('Formulář byl odeslán příliš rychle. Zkus to prosím znovu.')),
                ],
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    article = _get_article(data['article_key'])
    fields = article.get_signup_fields()
    try:
        answers = _validate_answers(fields, data.get('answers') or {})
    except ValidationError as exc:
        return Response(exc.detail, status=status.HTTP_400_BAD_REQUEST)

    ip = _client_ip(request)
    if _rate_limited(f'event-signup:ip:{ip}', RATE_LIMIT_IP):
        return Response(
            {
                'nonFieldErrors': [
                    str(_('Z této sítě už bylo odesláno moc přihlášek. Zkus to později.')),
                ],
            },
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )

    email = _email_for_rate_limit(fields, answers)
    if email and _rate_limited(f'event-signup:email:{email}', RATE_LIMIT_EMAIL):
        return Response(
            {
                'nonFieldErrors': [
                    str(_('Tento e-mail už byl použit příliš krátce po sobě.')),
                ],
            },
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )

    header, row = _build_row(data['article_key'], fields, answers)
    try:
        append_signup_row(header, row)
    except Exception:
        logger.exception('Failed to store event signup in Google Sheet')
        return Response(
            {
                'nonFieldErrors': [
                    str(_('Odeslání se nepovedlo. Zkus to prosím znovu později.')),
                ],
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    return Response({'ok': True}, status=status.HTTP_201_CREATED)


urlpatterns = [
    path('event-signups', create_event_signup),
]
