from django_extensions.db.models import TimeStampedModel
from django.utils.translation import gettext_lazy as _
from django.forms import widgets
from django import forms
from django.contrib.admin import widgets as admin_widgets
from django.utils.safestring import mark_safe
from django.db.models import IntegerField, TextField

from .media import MediaModelMixin
from .photos import LocalPhotoModel
from .upload_path import kebab
from .videos import LocalVideoModel
from .visibility import VisibilityModel
from .titles import (
    DescriptionField,
    FacultativeDescriptionField,
    FacultativeTitleField,
    TitleField,
)


class NamedModel(TimeStampedModel):

    class Meta:
        abstract = True

    title = FacultativeTitleField()
    description = FacultativeDescriptionField()

    def __str__(self):
        return self.title


class MediaObjectModel(
        MediaModelMixin,
        LocalPhotoModel,
        LocalVideoModel,
):

    class Meta:
        abstract = True
        verbose_name = _("Media Object")
        verbose_name_plural = _("Media Objects")

    description = FacultativeDescriptionField()

    @property
    def upload_dir(self):
        return "{0}/{1}".format(
            kebab(self.__class__.parent.field.remote_field.model.__name__),
            self.parent_id,
        )


class PublicModel(NamedModel):

    class Meta:
        abstract = True

    title = TitleField()
    description = DescriptionField()

    def __str__(self):
        return self.title


class ImportanceField(IntegerField):

    def __init__(self, *args, **kwargs):
        kwargs.setdefault("default", 0)
        kwargs.setdefault("verbose_name", _("Object Importance"))
        kwargs.setdefault(
            "help_text",
            _("More important objects will appear on the top or sooner on "
              "the page"),
        )
        super().__init__(*args, **kwargs)


class MarkdownWidget(widgets.Textarea):

    def render(self, name, value, attrs=None, renderer=None):
        if "class" not in attrs.keys():
            attrs["class"] = ""
        attrs["class"] += " mt mt-default simplemde-box"
        split = name.split("_")
        lang = split.pop()
        rest = "_".join(split)
        attrs["class"] += " mt-field-{}-{}".format(rest, lang)
        html = super().render(name, value, attrs, renderer=renderer)
        return mark_safe(html)

    def _media(self):
        scripts = ("simplemde/simplemde.min.js", "js/mde.init.js")
        css = {"all": ("simplemde/simplemde.min.css", )}
        return forms.Media(css=css, js=scripts)

    media = property(_media)


class MarkdownField(TextField):

    def __init__(self, *args, **kwargs):
        self.widget = MarkdownWidget()
        super().__init__(*args, **kwargs)

    def formfield(self, **kwargs):
        defaults = {"widget": self.widget}
        defaults.update(kwargs)

        if defaults["widget"] == admin_widgets.AdminTextareaWidget:
            defaults["widget"] = self.widget
        return super().formfield(**defaults)


class DetailedDescriptionField(MarkdownField):

    def __init__(self, *args, **kwargs):
        kwargs.setdefault("verbose_name", _("Detailed Description"))
        kwargs.setdefault(
            "help_text",
            _("Detailed verbose description formatted in Markdown. There"
              "is no text limit."),
        )
        kwargs.setdefault("null", True)
        kwargs.setdefault("blank", True)
        super().__init__(*args, **kwargs)


class WebsiteModel(VisibilityModel, PublicModel):

    class Meta:
        abstract = True

    description = DetailedDescriptionField(blank=True, null=True)
