# Generated by Django 4.2.11 on 2024-03-26 21:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_alter_user_options_alter_user_table'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='firebase_uid',
        ),
    ]
