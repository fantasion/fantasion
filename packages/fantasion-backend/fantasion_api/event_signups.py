import json
import logging
import os
from datetime import datetime, timezone

from django.conf import settings
from django.urls import path
from django.utils.translation import gettext_lazy as _
from google.auth.transport.requests import AuthorizedSession
from google.oauth2 import service_account
from rest_framework import status
from rest_framework.response import Response
from rest_framework.serializers import CharField, EmailField, Serializer

from .decorators import public_endpoint, with_serializer

logger = logging.getLogger(__name__)

SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'


class EventSignupSerializer(Serializer):
    article_key = CharField(max_length=64)
    name = CharField(max_length=120)
    email = EmailField()
    phone = CharField(max_length=40, required=False, allow_blank=True)
    note = CharField(max_length=2000, required=False, allow_blank=True)


def _get_sheets_session():
    raw = os.environ.get('GS_CREDENTIALS')
    if not raw:
        return None
    credentials = service_account.Credentials.from_service_account_info(
        json.loads(raw),
        scopes=[SHEETS_SCOPE],
    )
    return AuthorizedSession(credentials)


def append_signup_row(values):
    sheet_id = getattr(settings, 'EVENT_SIGNUP_SHEET_ID', None) or os.environ.get(
        'EVENT_SIGNUP_SHEET_ID'
    )
    sheet_tab = getattr(settings, 'EVENT_SIGNUP_SHEET_TAB', None) or os.environ.get(
        'EVENT_SIGNUP_SHEET_TAB', 'Sheet1'
    )
    if not sheet_id:
        raise RuntimeError('EVENT_SIGNUP_SHEET_ID is not configured')

    session = _get_sheets_session()
    if session is None:
        raise RuntimeError('GS_CREDENTIALS is not configured')

    range_name = f"{sheet_tab}!A:F"
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


@public_endpoint(['POST'])
@with_serializer(EventSignupSerializer)
def create_event_signup(request, serializer):
    data = serializer.validated_data
    row = [
        datetime.now(timezone.utc).isoformat(timespec='seconds'),
        data['article_key'],
        data['name'],
        data['email'],
        data.get('phone') or '',
        data.get('note') or '',
    ]
    try:
        append_signup_row(row)
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
