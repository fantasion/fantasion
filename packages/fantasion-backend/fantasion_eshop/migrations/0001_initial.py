# Generated by Django 3.2.10 on 2021-12-30 23:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields
import fantasion_generics.titles


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Currency',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('code', models.CharField(max_length=15)),
                ('title', fantasion_generics.titles.TitleField(help_text='Object name', max_length=255)),
                ('title_cs', fantasion_generics.titles.TitleField(help_text='Object name', max_length=255, null=True)),
                ('title_en', fantasion_generics.titles.TitleField(help_text='Object name', max_length=255, null=True)),
                ('exchange_rate', models.DecimalField(decimal_places=6, max_digits=9)),
                ('enabled', models.BooleanField(default=True)),
            ],
            options={
                'get_latest_by': 'modified',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='EshopProduct',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('description', models.CharField(help_text='Description is automatically generatedsummary of the product', max_length=255)),
            ],
            options={
                'get_latest_by': 'modified',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='orders', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'get_latest_by': 'modified',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PriceLevel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('title', fantasion_generics.titles.TitleField(help_text='Object name', max_length=255)),
                ('title_cs', fantasion_generics.titles.TitleField(help_text='Object name', max_length=255, null=True)),
                ('title_en', fantasion_generics.titles.TitleField(help_text='Object name', max_length=255, null=True)),
                ('description', fantasion_generics.titles.DescriptionField(help_text='Object description')),
                ('description_cs', fantasion_generics.titles.DescriptionField(help_text='Object description', null=True)),
                ('description_en', fantasion_generics.titles.DescriptionField(help_text='Object description', null=True)),
                ('slug', django_extensions.db.fields.AutoSlugField(blank=True, editable=False, populate_from=('title',))),
                ('slug_cs', django_extensions.db.fields.AutoSlugField(blank=True, editable=False, null=True, populate_from=('title',))),
                ('slug_en', django_extensions.db.fields.AutoSlugField(blank=True, editable=False, null=True, populate_from=('title',))),
                ('enabled', models.BooleanField(default=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ProductPrice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=15, verbose_name='Amount')),
                ('available_since', models.DateTimeField(blank=True, null=True)),
                ('available_until', models.DateTimeField(blank=True, null=True)),
                ('currency', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='prices', to='fantasion_eshop.currency')),
                ('price_level', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='prices', to='fantasion_eshop.pricelevel')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prices', to='fantasion_eshop.eshopproduct')),
            ],
            options={
                'unique_together': {('product', 'price_level', 'currency')},
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('price', models.DecimalField(decimal_places=2, max_digits=9, verbose_name='Price')),
                ('currency', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='order_items', to='fantasion_eshop.currency')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_items', to='fantasion_eshop.order')),
                ('product_price', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='order_items', to='fantasion_eshop.productprice')),
            ],
            options={
                'get_latest_by': 'modified',
                'abstract': False,
            },
        ),
    ]
