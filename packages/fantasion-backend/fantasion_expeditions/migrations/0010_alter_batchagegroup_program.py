# Generated by Django 3.2.11 on 2022-02-01 11:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_expeditions', '0009_auto_20220201_0052'),
    ]

    operations = [
        migrations.AlterField(
            model_name='batchagegroup',
            name='program',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='age_group_batches', to='fantasion_expeditions.expeditionprogram', verbose_name='Expedition Program'),
        ),
    ]
