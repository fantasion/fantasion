# Generated by Django 3.2.11 on 2022-01-22 22:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_content', '0007_rename_shortpromotiontext_flavourtext'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='flavourtext',
            options={'verbose_name': 'Flavour Text', 'verbose_name_plural': 'Flavour Texts'},
        ),
        migrations.AlterField(
            model_name='flavourtext',
            name='text',
            field=models.TextField(help_text='Write down a short quote displayed on the web for fun and topromote the atmosphere on the summer camp', verbose_name='Flavour Text'),
        ),
        migrations.AlterField(
            model_name='flavourtext',
            name='text_cs',
            field=models.TextField(help_text='Write down a short quote displayed on the web for fun and topromote the atmosphere on the summer camp', null=True, verbose_name='Flavour Text'),
        ),
        migrations.AlterField(
            model_name='flavourtext',
            name='text_en',
            field=models.TextField(help_text='Write down a short quote displayed on the web for fun and topromote the atmosphere on the summer camp', null=True, verbose_name='Flavour Text'),
        ),
    ]