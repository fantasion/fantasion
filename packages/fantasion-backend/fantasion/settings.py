"""
Generated by 'django-admin startproject' using Django 3.2.9.
"""

import os
from pathlib import Path
from socket import gethostname, gethostbyname
from urllib.parse import urlparse


def get_schemed_netloc(url):
    parsed = urlparse(url)
    return "%s://%s" % (parsed.scheme, parsed.netloc)


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ENVIRONMENT = os.environ.get('PROJECT_ENVIRONMENT', None)

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost').split(',') + [
    gethostname(),
    gethostbyname(gethostname()),
]

APPEND_SLASH = False
DEBUG = PROJECT_ENVIRONMENT != 'production'
SECRET_KEY = os.environ.get(
    'SECRET_KEY',
    'django-insecure-dkr_br-ulm(j+9f%g39_!4ux%y@3zpi^_km0c%o0+(mogvceq=')

INSTALLED_APPS = [
    'modeltranslation',
    'fantasion_generics',
    'fantasion_locations',
    'fantasion_eshop',
    'fantasion_people',
    'fantasion_expeditions',
    'fantasion_signups',
    "corsheaders",
    'django.contrib.admin',
    'nested_admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'fantasion.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'fantasion.wsgi.application'

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': ('django.contrib.auth.password_validation.'
                 'UserAttributeSimilarityValidator'),
    },
    {
        'NAME': ('django.contrib.auth.password_validation.'
                 'MinimumLengthValidator'),
    },
    {
        'NAME': ('django.contrib.auth.password_validation.'
                 'CommonPasswordValidator'),
    },
    {
        'NAME': ('django.contrib.auth.password_validation.'
                 'NumericPasswordValidator'),
    },
]

PRIVATE_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/


def gettext(s):
    return s


LANGUAGE_CODE = 'cs-cz'
LANGUAGES = (
    ('cs', gettext('Czech')),
    ('en', gettext('English')),
)

TIME_ZONE = 'Europe/Prague'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
DJANGO_ADMIN_SSO = False

APP_WEBSITE_URL = os.environ.get('APP_WEBSITE_URL', "http://localhost:3000")

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS':
    ('rest_framework.pagination.PageNumberPagination'),
    'DEFAULT_PERMISSION_CLASSES':
    ['rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'],
    'PAGE_SIZE':
    20
}

CORS_ORIGIN_WHITELIST = (
    "http://127.0.0.1",
    get_schemed_netloc(APP_WEBSITE_URL),
)

if DEBUG:
    MEDIA_ROOT = BASE_DIR
    MEDIA_URL = "/media/"
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    CORS_ORIGIN_WHITELIST += (
        "http://localhost",
        "http://localhost:8000",
        "http://localhost:8080",
    )

DB_NAME = os.environ.get('DB_NAME', None)

if DB_NAME:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'HOST': os.environ.get('DB_HOST'),
            'NAME': DB_NAME,
            'PASSWORD': os.environ.get('DB_PASSWORD'),
            'USER': os.environ.get('DB_USER'),
        },
    }
