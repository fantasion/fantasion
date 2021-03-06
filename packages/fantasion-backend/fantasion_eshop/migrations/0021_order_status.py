# Generated by Django 3.2.12 on 2022-04-03 13:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_eshop', '0020_order_promise'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='status',
            field=models.PositiveIntegerField(choices=[(1, 'New'), (2, 'Confirmed'), (3, 'Dispatched'), (4, 'Resolved'), (5, 'Cancelled')], default=1, verbose_name='Order Status'),
        ),
    ]
