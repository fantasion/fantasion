# Generated by Django 3.2.13 on 2022-07-24 11:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_expeditions', '0025_auto_20220724_1228'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transport',
            name='arrived',
        ),
        migrations.RemoveField(
            model_name='transport',
            name='boarding',
        ),
        migrations.RemoveField(
            model_name='transport',
            name='departed',
        ),
        migrations.AddField(
            model_name='transport',
            name='status',
            field=models.PositiveIntegerField(choices=[(1, 'Planned'), (2, 'In Position'), (3, 'Boarding'), (4, 'Departed'), (5, 'Arrived')], default=1, verbose_name='Transport Status'),
        ),
    ]
