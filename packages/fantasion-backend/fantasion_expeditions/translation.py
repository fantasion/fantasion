from modeltranslation.translator import register, TranslationOptions

from . import models


@register(models.AgeGroup)
class AgeGroupTranslationOptions(TranslationOptions):
    fields = ('title', )


@register(models.StaffRoleMedia)
class StaffRoleMediaTranslationOptions(TranslationOptions):
    fields = ('description', )


@register(models.StaffRole)
class StaffRoleTranslationOptions(TranslationOptions):
    fields = (
        'title',
        'description',
    )


@register(models.LeisureCentre)
class LeisureCentreTranslationOptions(TranslationOptions):
    fields = ('title', 'description', 'detailed_description')


@register(models.LeisureCentreMedia)
class LeisureCentreMediaTranslationOptions(TranslationOptions):
    fields = ('description', )


@register(models.ExpeditionTheme)
class ExpeditionThemeTranslationOptions(TranslationOptions):
    fields = (
        'title',
        'description',
        'detailed_description',
    )


@register(models.ExpeditionThemeMedia)
class ExpeditionThemeMediaOptions(TranslationOptions):
    fields = ('description', )


@register(models.Expedition)
class ExpeditionTranslationOptions(TranslationOptions):
    fields = (
        'title',
        'description',
        'detailed_description',
    )


@register(models.ExpeditionMedia)
class ExpeditionMediaOptions(TranslationOptions):
    fields = ('description', )


@register(models.ExpeditionProgram)
class ExpeditionProgramTranslationOptions(TranslationOptions):
    fields = (
        'title',
        'description',
        'detailed_description',
    )


@register(models.ExpeditionProgramMedia)
class ExpeditionProgramMediaOptions(TranslationOptions):
    fields = ('description', )


@register(models.Transport)
class TransportOptions(TranslationOptions):
    fields = ('description', )


@register(models.TransportVehicle)
class TransportVehicleOptions(TranslationOptions):
    fields = (
        'title',
        'description',
    )


@register(models.TransportVehicleMedia)
class TransportVehicleMediaOptions(TranslationOptions):
    fields = ('description', )


@register(models.ExpeditionLogArticle)
class ExpeditionLogArticleOptions(TranslationOptions):
    fields = (
        'title',
        'text',
    )


@register(models.ExpeditionLogArticleMedia)
class ExpeditionLogArticleMediaOptions(TranslationOptions):
    fields = ('description', )
