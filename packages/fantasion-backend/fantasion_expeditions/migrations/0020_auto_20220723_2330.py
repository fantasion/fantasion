# Generated by Django 3.2.13 on 2022-07-23 21:30

from django.db import migrations
import fantasion_generics.models
import fantasion_generics.titles


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_expeditions', '0019_auto_20220723_2325'),
    ]

    operations = [
        migrations.AddField(
            model_name='transport',
            name='description_cs',
            field=fantasion_generics.models.DetailedDescriptionField(blank=True, help_text='Detailed verbose description formatted in Markdown. Thereis no text limit.', null=True, verbose_name='Detailed Description'),
        ),
        migrations.AddField(
            model_name='transport',
            name='description_en',
            field=fantasion_generics.models.DetailedDescriptionField(blank=True, help_text='Detailed verbose description formatted in Markdown. Thereis no text limit.', null=True, verbose_name='Detailed Description'),
        ),
        migrations.AddField(
            model_name='transportvehicle',
            name='description_cs',
            field=fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AddField(
            model_name='transportvehicle',
            name='description_en',
            field=fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AddField(
            model_name='transportvehicle',
            name='title_cs',
            field=fantasion_generics.models.DetailedDescriptionField(blank=True, help_text='Detailed verbose description formatted in Markdown. Thereis no text limit.', null=True, verbose_name='Detailed Description'),
        ),
        migrations.AddField(
            model_name='transportvehicle',
            name='title_en',
            field=fantasion_generics.models.DetailedDescriptionField(blank=True, help_text='Detailed verbose description formatted in Markdown. Thereis no text limit.', null=True, verbose_name='Detailed Description'),
        ),
        migrations.AddField(
            model_name='transportvehiclemedia',
            name='description_cs',
            field=fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AddField(
            model_name='transportvehiclemedia',
            name='description_en',
            field=fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
    ]
