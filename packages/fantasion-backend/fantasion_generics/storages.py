from django.conf import settings
from django.utils.functional import LazyObject
from django.utils.module_loading import import_string
from storages.backends.gcloud import GoogleCloudStorage


def MediaStorage():
    return GoogleCloudStorage(location='media', querystring_auth=False)


def StaticStorage():
    return GoogleCloudStorage(location='static', querystring_auth=False)


def get_private_storage_class(import_path=None):
    return import_string(import_path or settings.PRIVATE_FILE_STORAGE)


class PrivateStorage(LazyObject):
    def _setup(self):
        self._wrapped = get_private_storage_class()()


private_storage = PrivateStorage()
