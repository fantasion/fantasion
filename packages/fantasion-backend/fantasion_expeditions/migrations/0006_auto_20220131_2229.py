# Generated by Django 3.2.11 on 2022-01-31 21:29

from django.db import migrations
import fantasion_generics.models
import fantasion_generics.titles


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_expeditions', '0005_auto_20220120_2355'),
    ]

    operations = [
        migrations.AddField(
            model_name='leisurecentre',
            name='detailed_description',
            field=fantasion_generics.models.DetailedDescriptionField(blank=True, help_text='Detailed verbose description formatted in Markdown. Thereis no text limit.', null=True, verbose_name='Detailed Description'),
        ),
        migrations.AlterField(
            model_name='expedition',
            name='description',
            field=fantasion_generics.titles.DescriptionField(help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='expedition',
            name='description_cs',
            field=fantasion_generics.titles.DescriptionField(help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='expedition',
            name='description_en',
            field=fantasion_generics.titles.DescriptionField(help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='expeditionmedia',
            name='description',
            field=fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='expeditionmedia',
            name='description_cs',
            field=fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='expeditionmedia',
            name='description_en',
            field=fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='expeditionprogram',
            name='description',
            field=fantasion_generics.titles.DescriptionField(help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='expeditionprogram',
            name='description_cs',
            field=fantasion_generics.titles.DescriptionField(help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='expeditionprogram',
            name='description_en',
            field=fantasion_generics.titles.DescriptionField(help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='expeditionprogrammedia',
            name='description',
            field=fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='expeditionprogrammedia',
            name='description_cs',
            field=fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='expeditionprogrammedia',
            name='description_en',
            field=fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='leisurecentre',
            name='description',
            field=fantasion_generics.titles.DescriptionField(help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='leisurecentre',
            name='description_cs',
            field=fantasion_generics.titles.DescriptionField(help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='leisurecentre',
            name='description_en',
            field=fantasion_generics.titles.DescriptionField(help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='leisurecentremedia',
            name='description',
            field=fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='leisurecentremedia',
            name='description_cs',
            field=fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='leisurecentremedia',
            name='description_en',
            field=fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='staffrole',
            name='description',
            field=fantasion_generics.titles.DescriptionField(help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='staffrole',
            name='description_cs',
            field=fantasion_generics.titles.DescriptionField(help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='staffrole',
            name='description_en',
            field=fantasion_generics.titles.DescriptionField(help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='staffrolemedia',
            name='description',
            field=fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='staffrolemedia',
            name='description_cs',
            field=fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='staffrolemedia',
            name='description_en',
            field=fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
    ]
