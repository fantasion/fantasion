# Generated by Django 3.2.12 on 2022-04-02 12:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_eshop', '0013_alter_order_owner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='orderitem',
            name='product_price',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='order_items', to='fantasion_eshop.productprice', verbose_name='Product Price'),
        ),
        migrations.CreateModel(
            name='OrderPromotionCode',
            fields=[
                ('orderitem_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='fantasion_eshop.orderitem')),
                ('promotion_code', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='fantasion_eshop.promotioncode', verbose_name='Promotion Code')),
            ],
            options={
                'get_latest_by': 'modified',
                'abstract': False,
            },
            bases=('fantasion_eshop.orderitem',),
        ),
    ]
