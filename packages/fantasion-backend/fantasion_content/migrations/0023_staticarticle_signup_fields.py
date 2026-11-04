from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_content', '0022_alter_frequentlyaskedquestion_visibility_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='staticarticle',
            name='signup_fields',
            field=models.JSONField(
                blank=True,
                default=list,
                help_text=(
                    'JSON list of form fields for /akce/<key>. Each item: '
                    '{"key": "email", "label": "E-mail", "required": true, '
                    '"type": "email"}. Types: text, email, tel, textarea. '
                    'Empty list uses the default name/email/phone/note fields.'
                ),
                verbose_name='Signup form fields',
            ),
        ),
    ]
