# Generated by Django 3.2.12 on 2022-04-08 08:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_eshop', '0022_auto_20220407_0307'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='submitted_at',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Submitted at'),
        ),
    ]
