# Generated by Django 3.2.12 on 2022-04-07 01:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_signups', '0014_alter_signup_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='signup',
            name='note',
            field=models.TextField(blank=True, help_text='Extra information that does not fit in any of the fields', null=True, verbose_name='Note'),
        ),
    ]
