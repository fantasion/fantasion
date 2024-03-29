# Generated by Django 4.1.10 on 2023-07-30 03:51

from django.db import migrations
import fantasion_generics.visibility


class Migration(migrations.Migration):
    dependencies = [
        ("fantasion_expeditions", "0032_alter_expedition_visibility_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="expedition",
            name="visibility",
            field=fantasion_generics.visibility.VisibilityField(
                choices=[(1, "🌏 Public"), (2, "🔒 Private"), (3, "🚫 Hidden")],
                default=1,
                help_text="Public objects will be visible on the website",
                verbose_name="👁 Visibility",
            ),
        ),
        migrations.AlterField(
            model_name="expeditionbatch",
            name="visibility",
            field=fantasion_generics.visibility.VisibilityField(
                choices=[(1, "🌏 Public"), (2, "🔒 Private"), (3, "🚫 Hidden")],
                default=1,
                help_text="Public objects will be visible on the website",
                verbose_name="👁 Visibility",
            ),
        ),
        migrations.AlterField(
            model_name="expeditionlogarticle",
            name="visibility",
            field=fantasion_generics.visibility.VisibilityField(
                choices=[(1, "🌏 Public"), (2, "🔒 Private"), (3, "🚫 Hidden")],
                default=1,
                help_text="Public objects will be visible on the website",
                verbose_name="👁 Visibility",
            ),
        ),
        migrations.AlterField(
            model_name="expeditionprogram",
            name="visibility",
            field=fantasion_generics.visibility.VisibilityField(
                choices=[(1, "🌏 Public"), (2, "🔒 Private"), (3, "🚫 Hidden")],
                default=1,
                help_text="Public objects will be visible on the website",
                verbose_name="👁 Visibility",
            ),
        ),
        migrations.AlterField(
            model_name="expeditiontheme",
            name="visibility",
            field=fantasion_generics.visibility.VisibilityField(
                choices=[(1, "🌏 Public"), (2, "🔒 Private"), (3, "🚫 Hidden")],
                default=1,
                help_text="Public objects will be visible on the website",
                verbose_name="👁 Visibility",
            ),
        ),
        migrations.AlterField(
            model_name="leisurecentre",
            name="visibility",
            field=fantasion_generics.visibility.VisibilityField(
                choices=[(1, "🌏 Public"), (2, "🔒 Private"), (3, "🚫 Hidden")],
                default=1,
                help_text="Public objects will be visible on the website",
                verbose_name="👁 Visibility",
            ),
        ),
        migrations.AlterField(
            model_name="transport",
            name="visibility",
            field=fantasion_generics.visibility.VisibilityField(
                choices=[(1, "🌏 Public"), (2, "🔒 Private"), (3, "🚫 Hidden")],
                default=1,
                help_text="Public objects will be visible on the website",
                verbose_name="👁 Visibility",
            ),
        ),
        migrations.AlterField(
            model_name="transportvehicle",
            name="visibility",
            field=fantasion_generics.visibility.VisibilityField(
                choices=[(1, "🌏 Public"), (2, "🔒 Private"), (3, "🚫 Hidden")],
                default=1,
                help_text="Public objects will be visible on the website",
                verbose_name="👁 Visibility",
            ),
        ),
    ]
