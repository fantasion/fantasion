# Generated by Django 3.2.12 on 2022-04-11 22:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_eshop', '0025_auto_20220411_1225'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='request_insurance',
            field=models.BooleanField(default=False, help_text='The Order Owner requested assistance with getting insurance and expects to be contacted by Fantasion staff.', verbose_name='Insurance Request'),
        ),
    ]