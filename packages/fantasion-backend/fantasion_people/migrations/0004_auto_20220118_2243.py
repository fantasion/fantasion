# Generated by Django 3.2.11 on 2022-01-18 21:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_people', '0003_profile_text'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='text_cs',
            field=models.TextField(help_text='Full text of the profile formatted in Markdown', null=True, verbose_name='Profile text'),
        ),
        migrations.AddField(
            model_name='profile',
            name='text_en',
            field=models.TextField(help_text='Full text of the profile formatted in Markdown', null=True, verbose_name='Profile text'),
        ),
    ]