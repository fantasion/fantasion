from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_content', '0022_alter_frequentlyaskedquestion_visibility_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='staticarticle',
            name='signup_form_url',
            field=models.URLField(
                blank=True,
                default='',
                help_text=(
                    'Google Form URL for /akce/<key>. Paste the form link '
                    '(edit or viewform); the site embeds it on the event page. '
                    'Leave empty to show only the article text.'
                ),
                max_length=500,
                verbose_name='Signup form URL',
            ),
        ),
    ]
