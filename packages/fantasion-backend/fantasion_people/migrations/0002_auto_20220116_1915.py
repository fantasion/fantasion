# Generated by Django 3.2.11 on 2022-01-16 18:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import fantasion_generics.media
import fantasion_generics.models
import fantasion_generics.upload_path
import versatileimagefield.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('fantasion_people', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='allergy',
            options={'verbose_name': 'Allergy', 'verbose_name_plural': 'Allergies'},
        ),
        migrations.AlterModelOptions(
            name='family',
            options={'verbose_name': 'Family', 'verbose_name_plural': 'Families'},
        ),
        migrations.AlterModelOptions(
            name='familymember',
            options={'verbose_name': 'Family member', 'verbose_name_plural': 'Family members'},
        ),
        migrations.AlterModelOptions(
            name='hobby',
            options={'verbose_name': 'Hobby', 'verbose_name_plural': 'Hobbies'},
        ),
        migrations.AlterModelOptions(
            name='profile',
            options={'verbose_name': 'Profile', 'verbose_name_plural': 'Profiles'},
        ),
        migrations.AlterModelOptions(
            name='profilemedia',
            options={'verbose_name': 'Media Object', 'verbose_name_plural': 'Media Objects'},
        ),
        migrations.AlterField(
            model_name='familymember',
            name='family',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='members', to='fantasion_people.family', verbose_name='Family'),
        ),
        migrations.AlterField(
            model_name='familymember',
            name='role',
            field=models.PositiveIntegerField(choices=[(1, 'Administrator'), (2, 'Legal representative'), (3, 'Spectator')], default=3, verbose_name='Family Role'),
        ),
        migrations.AlterField(
            model_name='familymember',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='family_members', to=settings.AUTH_USER_MODEL, verbose_name='User'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='public',
            field=fantasion_generics.models.VisibilityField(default=True, help_text='Public objects will be visible on the website', verbose_name='Public'),
        ),
        migrations.AlterField(
            model_name='profilemedia',
            name='height',
            field=models.PositiveBigIntegerField(blank=True, null=True, verbose_name='Height'),
        ),
        migrations.AlterField(
            model_name='profilemedia',
            name='local_photo',
            field=versatileimagefield.fields.VersatileImageField(blank=True, height_field='height', max_length=255, null=True, upload_to=fantasion_generics.upload_path.get_upload_path, verbose_name='Image file', width_field='width'),
        ),
        migrations.AlterField(
            model_name='profilemedia',
            name='parent',
            field=fantasion_generics.media.MediaParentField(on_delete=django.db.models.deletion.CASCADE, related_name='media', to='fantasion_people.profile', verbose_name='Parent object'),
        ),
        migrations.AlterField(
            model_name='profilemedia',
            name='width',
            field=models.PositiveBigIntegerField(blank=True, null=True, verbose_name='Width'),
        ),
    ]