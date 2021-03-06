# Generated by Django 3.2.12 on 2022-04-03 13:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_signups', '0013_alter_signup_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='signup',
            name='status',
            field=models.PositiveIntegerField(choices=[(1, 'New'), (2, 'Confirmed'), (3, 'Active'), (5, 'Cancelled')], default=1, verbose_name='Signup Status'),
        ),
    ]
