# Generated by Django 3.2.12 on 2022-04-07 01:07

from django.db import migrations, models
import djmoney.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_banking', '0005_debt_debt_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='ballance_currency',
            field=djmoney.models.fields.CurrencyField(choices=[('CZK', 'Kč')], default='CZK', editable=False, max_length=3),
        ),
        migrations.AlterField(
            model_name='debt',
            name='amount_currency',
            field=djmoney.models.fields.CurrencyField(choices=[('CZK', 'Kč')], default='CZK', editable=False, max_length=3),
        ),
        migrations.AlterField(
            model_name='debt',
            name='debt_type',
            field=models.PositiveIntegerField(blank=True, choices=[(1, 'Deposit'), (2, 'Surcharge'), (3, 'Full Payment')], default=None, null=True),
        ),
        migrations.AlterField(
            model_name='debt',
            name='source',
            field=models.PositiveIntegerField(choices=[(1, 'Manually created'), (2, 'Initial debt'), (3, 'Recurring generated'), (4, 'Created from order')], default=1),
        ),
        migrations.AlterField(
            model_name='promise',
            name='amount_currency',
            field=djmoney.models.fields.CurrencyField(choices=[('CZK', 'Kč')], default='CZK', editable=False, max_length=3),
        ),
        migrations.AlterField(
            model_name='promise',
            name='initial_amount_currency',
            field=djmoney.models.fields.CurrencyField(choices=[('CZK', 'Kč')], default='CZK', editable=False, max_length=3),
        ),
        migrations.AlterField(
            model_name='promise',
            name='status',
            field=models.PositiveIntegerField(choices=[(1, 'Expected'), (5, 'Deposit Paid'), (2, 'Paid'), (3, 'Underpaid'), (4, 'Overpaid')], default=1, verbose_name='Status'),
        ),
        migrations.AlterField(
            model_name='statement',
            name='amount_currency',
            field=djmoney.models.fields.CurrencyField(choices=[('CZK', 'Kč')], default='CZK', editable=False, max_length=3),
        ),
    ]
