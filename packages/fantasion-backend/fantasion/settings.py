"""
Generated by 'django-admin startproject' using Django 3.2.9.
"""

import math
import os

from pathlib import Path
from socket import gethostname, gethostbyname
from urllib.parse import urlparse


def get_schemed_netloc(url):
    parsed = urlparse(url)
    return f"{parsed.scheme}://{parsed.netloc}"


# Build paths inside the project like this: BASE_DIR / 'subdir'.
CONFIG_DIR = Path(__file__).resolve().parent
BASE_DIR = CONFIG_DIR.parent
PROJECT_ENVIRONMENT = os.environ.get("PROJECT_ENVIRONMENT", None)

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "localhost").split(",") + [
    gethostname(),
    gethostbyname(gethostname()),
]

AUTH_USER_MODEL = "fantasion.User"
APPEND_SLASH = False
DEBUG = PROJECT_ENVIRONMENT != "production"
SECRET_KEY = os.environ.get(
    "SECRET_KEY",
    "django-insecure-dkr_br-ulm(j+9f%g39_!4ux%y@3zpi^_km0c%o0+(mogvceq=",
)
SESSION_COOKIE_SECURE = True

INSTALLED_APPS = [
    "modeltranslation",
    "simplemde",
    "fantasion",
    "fantasion_generics",
    "fantasion_locations",
    "fantasion_eshop",
    "fantasion_people",
    "fantasion_expeditions",
    "fantasion_signups",
    "fantasion_content",
    "phonenumber_field",
    "corsheaders",
    "django.contrib.admin",
    "nested_admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "djmoney",
    "admin_sso",
    "versatileimagefield",
    "rest_framework",
    "rest_framework.authtoken",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

LOCALE_PATHS = [
    os.path.join(CONFIG_DIR, "locale"),
]

ROOT_URLCONF = "fantasion.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "fantasion.wsgi.application"

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": ("django.contrib.auth.password_validation."
                 "UserAttributeSimilarityValidator"),
    },
    {
        "NAME": ("django.contrib.auth.password_validation."
                 "MinimumLengthValidator"),
    },
    {
        "NAME": ("django.contrib.auth.password_validation."
                 "CommonPasswordValidator"),
    },
    {
        "NAME": ("django.contrib.auth.password_validation."
                 "NumericPasswordValidator"),
    },
]

PRIVATE_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/


def gettext(string):
    return string


LANGUAGE_CODE = "cs-cz"
LANGUAGES = (
    ("cs", gettext("Czech")),
    ("en", gettext("English")),
)

TIME_ZONE = "Europe/Prague"
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = "/static/"

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
DJANGO_ADMIN_SSO = False
DJANGO_ADMIN_SSO_DOMAIN = "fantasion.cz"
DJANGO_ADMIN_SSO_OAUTH_CLIENT_ID = os.environ.get("ADMIN_SSO_CLIENT_ID", None)
DJANGO_ADMIN_SSO_OAUTH_CLIENT_SECRET = os.environ.get("ADMIN_SSO_SECRET", None)
DJANGO_ADMIN_SSO_SUPERUSER = os.environ.get("ADMIN_SSO_SUPERUSER", None)

APP_WEBSITE_URL = os.environ.get("APP_WEBSITE_URL", "http://localhost:3000")

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "fantasion_api.auth.CsrfExemptAuth",
        "rest_framework.authentication.TokenAuthentication",
    ),
    "DEFAULT_PAGINATION_CLASS":
    ("rest_framework.pagination.PageNumberPagination"),
    "DEFAULT_PERMISSION_CLASSES":
    ["rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly"],
    "PAGE_SIZE":
    20,
    "DEFAULT_RENDERER_CLASSES": (
        "djangorestframework_camel_case.render.CamelCaseJSONRenderer",
        "djangorestframework_camel_case.render.CamelCaseBrowsableAPIRenderer",
    ),
    "DEFAULT_PARSER_CLASSES": (
        "djangorestframework_camel_case.parser.CamelCaseFormParser",
        "djangorestframework_camel_case.parser.CamelCaseMultiPartParser",
        "djangorestframework_camel_case.parser.CamelCaseJSONParser",
    ),
}

CORS_ORIGIN_WHITELIST = (
    "http://127.0.0.1",
    get_schemed_netloc(APP_WEBSITE_URL),
)

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

LOG_LEVEL = "INFO"
EMAIL_ROBOT_ADDR = "ciri@fantasion.cz"
EMAIL_ROBOT_NAME = "Ciri"
EMAIL_ROBOT_HOST = os.environ.get("EMAIL_ROBOT_HOST", None)

# E-mail host is defined, let's define e-mail backend properly
if EMAIL_ROBOT_HOST:
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_HOST = EMAIL_ROBOT_HOST
    EMAIL_USE_TLS = True
    EMAIL_PORT = os.environ.get("EMAIL_ROBOT_HOST_PORT", 587)
    EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_ROBOT_HOST_PASS", None)
    EMAIL_HOST_USER = os.environ.get("EMAIL_ROBOT_HOST_USER", None)

if DEBUG:
    MEDIA_ROOT = os.path.join(BASE_DIR, "media")
    MEDIA_URL = "/"
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
    CORS_ORIGIN_WHITELIST += (
        "http://localhost",
        "http://localhost:8000",
        "http://localhost:8080",
    )

DB_NAME = os.environ.get("DB_NAME", None)

if DB_NAME:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "HOST": os.environ.get("DB_HOST"),
            "NAME": DB_NAME,
            "PASSWORD": os.environ.get("DB_PASS"),
            "USER": os.environ.get("DB_USER"),
        },
    }

BUCKET_PUBLIC = os.environ.get("BUCKET_PUBLIC", None)

if BUCKET_PUBLIC:
    from google.oauth2 import service_account
    import json

    DEFAULT_FILE_STORAGE = "fantasion_generics.storages.MediaStorage"
    STATICFILES_STORAGE = "fantasion_generics.storages.StaticStorage"
    GS_BUCKET_NAME = BUCKET_PUBLIC
    GS_PROJECT_ID = os.environ.get("GCP_PROJECT")
    GS_CREDENTIALS = service_account.Credentials.from_service_account_info(
        json.loads(os.environ.get("GS_CREDENTIALS")))

LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
    "handlers": {
        "default": {
            "level": LOG_LEVEL,
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["default"],
            "level": LOG_LEVEL,
            "propagate": True,
        },
        "django.request": {
            "handlers": ["default"],
            "level": LOG_LEVEL,
            "propagate": False,
        },
        "django.server": {
            "handlers": ["default"],
            "level": LOG_LEVEL,
            "propagate": True,
        },
        "django.template": {
            "handlers": ["default"],
            "level": LOG_LEVEL,
            "propagate": True,
        },
        "django.db.backends": {
            "handlers": ["default"],
            "level": LOG_LEVEL,
            "propagate": True,
        },
        "django.db.backends.schema": {
            "handlers": ["default"],
            "level": LOG_LEVEL,
            "propagate": True,
        },
        "django.security.*": {
            "handlers": ["default"],
            "level": LOG_LEVEL,
            "propagate": True,
        },
    },
}

VERSATILEIMAGEFIELD_SETTINGS = {
    "cache_length": math.inf,
    "create_images_on_demand": False,
    "jpeg_resize_quality": 95,
}

VERSATILEIMAGEFIELD_RENDITION_KEY_SETS = {
    "gallery": [
        ("thumb", "crop__256x256"),
        ("preview", "crop__512x512"),
        ("decoration", "crop__640x640"),
        ("detail", "thumbnail__1920x800"),
    ],
    "profile": [
        ("avatar", "crop__128x128"),
    ],
}

CURRENCIES = ('CZK',)

if DJANGO_ADMIN_SSO_OAUTH_CLIENT_ID and DJANGO_ADMIN_SSO_OAUTH_CLIENT_SECRET:
    DJANGO_ADMIN_SSO = True
    AUTHENTICATION_BACKENDS = (
        "fantasion_domain.auth.SSOAuthBackend",
        "django.contrib.auth.backends.ModelBackend",
    )
