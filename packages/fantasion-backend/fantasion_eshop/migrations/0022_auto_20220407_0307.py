# Generated by Django 3.2.12 on 2022-04-07 01:07

from django.db import migrations, models
import django.db.models.deletion
import fantasion_eshop.models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_eshop', '0021_order_status'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='productprice',
            options={'ordering': ('available_since', 'available_until'), 'verbose_name': 'E-shop Product Price', 'verbose_name_plural': 'E-shop Product Prices'},
        ),
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.PositiveIntegerField(choices=[(1, 'New'), (2, 'Confirmed'), (3, 'Deposit Paid'), (4, 'Paid'), (5, 'Dispatched'), (6, 'Resolved'), (7, 'Cancelled'), (8, 'Refunded')], default=1, verbose_name='Order Status'),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='product_price',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='order_items', to='fantasion_eshop.productprice', validators=[fantasion_eshop.models.product_price_available], verbose_name='Product Price'),
        ),
    ]
