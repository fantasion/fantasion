# Generated by Django 3.2.12 on 2022-04-02 13:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_eshop', '0015_alter_orderpromotioncode_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitem',
            name='product_type',
            field=models.CharField(default='fantasion_signups.Signup', max_length=63, verbose_name='Product Type'),
            preserve_default=False,
        ),
    ]
