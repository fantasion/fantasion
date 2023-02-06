# Generated by Django 4.1.5 on 2023-01-21 15:17

from django.db import migrations
import fantasion_generics.visibility


class Migration(migrations.Migration):

    dependencies = [
        ("fantasion_people", "0017_remove_profile_public_profile_visibility"),
    ]

    operations = [
        migrations.AlterField(
            model_name="profile",
            name="visibility",
            field=fantasion_generics.visibility.VisibilityField(
                choices=[(1, "🌏 Public"), (2, "🔒 Private"), (3, "🚫 Hidden")],
                default=1,
                help_text="Public objects will be visible on the website",
                verbose_name="Visibility",
            ),
        ),
    ]