# Generated by Django 4.2.11 on 2024-04-30 08:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_post_tmdb_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='WatchlistMovie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tmdb_id', models.IntegerField()),
                ('added_on', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='watchlist_movies', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'tmdb_id')},
            },
        ),
        migrations.CreateModel(
            name='WatchedMovie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tmdb_id', models.IntegerField()),
                ('watched_on', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='watched_movies', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'tmdb_id')},
            },
        ),
    ]
