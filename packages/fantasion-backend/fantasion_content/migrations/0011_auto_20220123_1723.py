# Generated by Django 3.2.11 on 2022-01-23 16:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_content', '0010_frequentlyaskedquestion_frequentlyaskedquestionmedia'),
    ]

    operations = [
        migrations.RenameField(
            model_name='frequentlyaskedquestion',
            old_name='answer',
            new_name='short_answer',
        ),
        migrations.RenameField(
            model_name='frequentlyaskedquestion',
            old_name='answer_cs',
            new_name='short_answer_cs',
        ),
        migrations.RenameField(
            model_name='frequentlyaskedquestion',
            old_name='answer_en',
            new_name='short_answer_en',
        ),
    ]
