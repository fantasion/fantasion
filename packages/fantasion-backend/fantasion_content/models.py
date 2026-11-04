from django_extensions.db.models import TimeStampedModel
from django.utils.translation import gettext_lazy as _
from django.db.models import CharField, JSONField, TextField

from fantasion_generics.upload_path import kebab
from fantasion_generics.media import MediaParentField
from fantasion_generics.photos import LocalPhotoField, WarmPhotoModel

from fantasion_generics.models import (
    ImportanceField,
    MarkdownField,
    MediaObjectModel,
    VisibilityModel,
    WebsiteModel,
)

# Default event signup form when StaticArticle.signup_fields is empty.
DEFAULT_SIGNUP_FIELDS = [
    {
        'key': 'name',
        'label': 'Jméno a příjmení',
        'required': True,
        'type': 'text',
    },
    {
        'key': 'email',
        'label': 'E-mail',
        'required': True,
        'type': 'email',
    },
    {
        'key': 'phone',
        'label': 'Telefon',
        'required': False,
        'type': 'tel',
    },
    {
        'key': 'note',
        'label': 'Poznámka',
        'required': False,
        'type': 'textarea',
    },
]

SIGNUP_FIELD_TYPES = ('text', 'email', 'tel', 'textarea')


def normalize_signup_fields(raw):
    """Return a cleaned list of signup field dicts, or the default set."""
    if not raw:
        return [dict(field) for field in DEFAULT_SIGNUP_FIELDS]

    normalized = []
    seen_keys = set()
    for item in raw:
        if not isinstance(item, dict):
            continue
        key = str(item.get('key') or '').strip()
        label = str(item.get('label') or '').strip()
        if not key or not label or key in seen_keys:
            continue
        field_type = str(item.get('type') or 'text').strip().lower()
        if field_type not in SIGNUP_FIELD_TYPES:
            field_type = 'text'
        normalized.append({
            'key': key[:64],
            'label': label[:120],
            'required': bool(item.get('required')),
            'type': field_type,
        })
        seen_keys.add(key)

    return normalized or [dict(field) for field in DEFAULT_SIGNUP_FIELDS]


class FlavourText(TimeStampedModel):

    class Meta:
        ordering = ["-importance"]
        verbose_name = _("Flavour Text")
        verbose_name_plural = _("Flavour Texts")

    text = TextField(
        verbose_name=_("Flavour Text"),
        help_text=_(
            "Write down a short quote displayed on the web for fun and to"
            "promote the atmosphere on the summer camp"),
    )
    quote_owner = CharField(
        max_length=63,
        verbose_name=_("Quote Owner"),
        help_text=_(
            "A name that will be displayed as the original author of the quote"
        ),
    )
    importance = ImportanceField()


class FrequentlyAskedQuestion(VisibilityModel, TimeStampedModel):

    class Meta:
        ordering = ["-importance"]
        verbose_name = _("Frequently Asked Question")
        verbose_name_plural = _("Frequently Asked Questions")

    question = TextField(
        verbose_name=_("Question"),
        help_text=_(
            "Write the question from perspective of the person asking it."),
    )
    short_answer = MarkdownField(
        verbose_name=_("Answer"),
        help_text=_(
            "Write a quick summarizing positive answer that resolves the "
            "question"),
    )
    detailed_answer = MarkdownField(
        verbose_name=_("Detailed Answer"),
        help_text=_("Write all the details, do not spare the letters"),
        blank=True,
        null=True,
    )
    importance = ImportanceField()


class FrequentlyAskedQuestionMedia(MediaObjectModel):
    parent = MediaParentField(FrequentlyAskedQuestion)


class StaticArticle(WebsiteModel):

    class Meta:
        verbose_name = _("Static Articles")
        verbose_name_plural = _("Static Articles")

    key = CharField(
        max_length=32,
        unique=True,
        verbose_name=_("Article key"),
        help_text=_(
            "Unique key used on the API and for event pages at "
            "/akce/<key>. Signups from that page are appended to the "
            "configured Google Sheet (e.g. halloween → /akce/halloween)."),
    )
    text = MarkdownField(
        verbose_name=_("Article text"),
        help_text=_("Your article content formatted in Markdown"),
    )
    signup_fields = JSONField(
        blank=True,
        default=list,
        verbose_name=_("Signup form fields"),
        help_text=_(
            "JSON list of form fields for /akce/<key>. Each item: "
            '{"key": "email", "label": "E-mail", "required": true, '
            '"type": "email"}. Types: text, email, tel, textarea. '
            "Empty list uses the default name/email/phone/note fields."
        ),
    )

    def get_signup_fields(self):
        return normalize_signup_fields(self.signup_fields)


class StaticArticleMedia(MediaObjectModel):
    parent = MediaParentField(StaticArticle)


class Monster(WebsiteModel, WarmPhotoModel):

    class Meta:
        ordering = ["-importance"]
        verbose_name = _("Monster")
        verbose_name_plural = _("Monsters")

    species = CharField(
        help_text=_("Name of the monster species."),
        max_length=30,
        verbose_name=_("Species"),
    )
    description = CharField(
        help_text=_("Short (max 5 words) description of monster."),
        max_length=30,
        verbose_name=_("Description"),
    )
    avatar = LocalPhotoField()
    text = MarkdownField(
        blank=True,
        null=True,
        verbose_name=_("Text"),
    )
    importance = ImportanceField()

    @property
    def upload_dir(self):
        return "{0}/{1}".format(
            kebab(self.__class__.__name__),
            self.id,
        )


class MonsterMedia(MediaObjectModel):
    parent = MediaParentField(Monster)
