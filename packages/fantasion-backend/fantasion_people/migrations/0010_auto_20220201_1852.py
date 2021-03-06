# Generated by Django 3.2.11 on 2022-02-01 17:52

from django.db import migrations
import fantasion_generics.photos
import fantasion_generics.upload_path


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_people', '0009_profile_importance'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='profile',
            options={'ordering': ['-importance'], 'verbose_name': 'Profile', 'verbose_name_plural': 'Profiles'},
        ),
        migrations.AddField(
            model_name='profile',
            name='avatar',
            field=fantasion_generics.photos.LocalPhotoField(blank=True, max_length=255, null=True, upload_to=fantasion_generics.upload_path.get_upload_path, verbose_name='Image file'),
        ),
        migrations.AlterField(
            model_name='profilemedia',
            name='local_photo',
            field=fantasion_generics.photos.LocalPhotoField(blank=True, height_field='height', max_length=255, null=True, upload_to=fantasion_generics.upload_path.get_upload_path, verbose_name='Image file', width_field='width'),
        ),
    ]
