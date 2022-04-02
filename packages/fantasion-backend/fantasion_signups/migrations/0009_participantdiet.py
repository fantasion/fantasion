# Generated by Django 3.2.12 on 2022-04-02 17:35

from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_people', '0013_diet'),
        ('fantasion_signups', '0008_participanthobby'),
    ]

    operations = [
        migrations.CreateModel(
            name='ParticipantDiet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('hobby', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='participant_diets', to='fantasion_people.diet')),
                ('participant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='participant_diets', to='fantasion_signups.participant')),
            ],
            options={
                'get_latest_by': 'modified',
                'abstract': False,
            },
        ),
    ]