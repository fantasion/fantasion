# Generated by Django 3.2.11 on 2022-02-01 11:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_people', '0006_auto_20220131_2229'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='text',
            field=models.TextField(blank=True, help_text='Full text of the profile formatted in Markdown', null=True, verbose_name='Profile text'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='text_cs',
            field=models.TextField(blank=True, help_text='Full text of the profile formatted in Markdown', null=True, verbose_name='Profile text'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='text_en',
            field=models.TextField(blank=True, help_text='Full text of the profile formatted in Markdown', null=True, verbose_name='Profile text'),
        ),
    ]
