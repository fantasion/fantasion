# Generated by Django 3.2.11 on 2022-02-21 00:53

from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields
import fantasion_generics.media
import fantasion_generics.models
import fantasion_generics.photos
import fantasion_generics.titles
import fantasion_generics.upload_path
import fantasion_generics.videos


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_content', '0016_auto_20220205_1523'),
    ]

    operations = [
        migrations.CreateModel(
            name='Monster',
            fields=[
                ('id',
                 models.BigAutoField(auto_created=True,
                                     primary_key=True,
                                     serialize=False,
                                     verbose_name='ID')),
                ('created',
                 django_extensions.db.fields.CreationDateTimeField(
                     auto_now_add=True, verbose_name='created')),
                ('modified',
                 django_extensions.db.fields.ModificationDateTimeField(
                     auto_now=True, verbose_name='modified')),
                ('species',
                 models.CharField(help_text='Name of the monsters species.',
                                  max_length=255,
                                  verbose_name='Species')),
                ('description',
                 fantasion_generics.titles.DescriptionField(
                     help_text=
                     'Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results',
                     verbose_name='Short Description')),
                ('text',
                 fantasion_generics.models.MarkdownField(blank=True,
                                                         null=True,
                                                         verbose_name='Text')),
                ('importance',
                 fantasion_generics.models.ImportanceField(
                     default=0,
                     help_text=
                     'More important objects will appear on the top or sooner on the page',
                     verbose_name='Object Importance')),
                ('public',
                 fantasion_generics.visibility.VisibilityField(
                     default=True,
                     help_text='Public objects will be visible on the website',
                     verbose_name='Public')),
            ],
            options={
                'verbose_name': 'Monster',
                'verbose_name_plural': 'Monsters',
                'ordering': ['-importance'],
            },
        ),
        migrations.CreateModel(
            name='MonsterMedia',
            fields=[
                ('id',
                 models.BigAutoField(auto_created=True,
                                     primary_key=True,
                                     serialize=False,
                                     verbose_name='ID')),
                ('height',
                 models.PositiveBigIntegerField(blank=True,
                                                null=True,
                                                verbose_name='Height')),
                ('width',
                 models.PositiveBigIntegerField(blank=True,
                                                null=True,
                                                verbose_name='Width')),
                ('local_photo',
                 fantasion_generics.photos.LocalPhotoField(
                     blank=True,
                     height_field='height',
                     max_length=255,
                     null=True,
                     upload_to=fantasion_generics.upload_path.get_upload_path,
                     verbose_name='Image file',
                     width_field='width')),
                ('local_video',
                 fantasion_generics.videos.VideoField(
                     blank=True,
                     duration_field='duration',
                     height_field='height',
                     max_length=255,
                     null=True,
                     upload_to=fantasion_generics.upload_path.get_upload_path,
                     verbose_name='Video file',
                     width_field='width')),
                ('duration',
                 models.PositiveBigIntegerField(blank=True, null=True)),
                ('description',
                 fantasion_generics.titles.FacultativeDescriptionField(
                     blank=True,
                     help_text=
                     'Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results',
                     null=True,
                     verbose_name='Short Description')),
                ('parent',
                 fantasion_generics.media.MediaParentField(
                     on_delete=django.db.models.deletion.CASCADE,
                     related_name='media',
                     to='fantasion_content.monster',
                     verbose_name='Parent object')),
            ],
            options={
                'verbose_name': 'Media Object',
                'verbose_name_plural': 'Media Objects',
                'abstract': False,
            },
            bases=(models.Model, fantasion_generics.photos.WarmPhotoModel),
        ),
    ]
