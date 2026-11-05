from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_content', '0022_alter_frequentlyaskedquestion_visibility_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='staticarticle',
            name='key',
            field=models.CharField(
                help_text=(
                    'Unique key used on the API and for event pages at '
                    '/akce/<key> (e.g. halloween → /akce/halloween).'
                ),
                max_length=32,
                unique=True,
                verbose_name='Article key',
            ),
        ),
        migrations.AddField(
            model_name='staticarticle',
            name='signup_form_url',
            field=models.URLField(
                blank=True,
                default='',
                help_text=(
                    'Google Form URL embedded on /akce/<key>. Paste the share or '
                    'edit link; leave empty to show only the article.'
                ),
                max_length=500,
                verbose_name='Signup form URL',
            ),
        ),
    ]
