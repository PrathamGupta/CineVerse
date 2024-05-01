from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # firebase_uid = models.CharField(max_length=255, unique=True)
    profile_info = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # class Meta:
    #     db_table = 'auth_user'

class Movie(models.Model):
    title = models.CharField(max_length=100)
    genre = models.CharField(max_length=50, blank=True)
    release_year = models.IntegerField(blank=True, null=True)
    director = models.CharField(max_length=100, blank=True)
    cast = models.TextField(blank=True)
    synopsis = models.TextField(blank=True)
    # watched_by = models.ManyToManyField(User, related_name='watched_movies') 

class TVShow(models.Model):
    title = models.CharField(max_length=100)
    genre = models.CharField(max_length=50, blank=True)
    release_year = models.IntegerField(blank=True, null=True)
    director = models.CharField(max_length=100, blank=True)
    cast = models.TextField(blank=True)
    synopsis = models.TextField(blank=True)

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, blank=True, null=True)
    tv_show = models.ForeignKey(TVShow, on_delete=models.CASCADE, blank=True, null=True)
    content = models.TextField()
    rating = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, blank=True, null=True)
    tv_show = models.ForeignKey(TVShow, on_delete=models.CASCADE, blank=True, null=True)
    rating = models.IntegerField()

class Group(models.Model):
    group_name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class GroupMember(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    class Meta:
        unique_together = ('group', 'user')

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, blank=True, null=True)
    content = models.TextField()
    tmdb_id = models.IntegerField(blank=True, null=True)  # Store the TMDB movie ID
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class Follow(models.Model):
    follower = models.ForeignKey(User, related_name='following', on_delete=models.CASCADE)
    followed = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'followed')  # Ensure unique follow relationships

class FavoriteMovie(models.Model):
    user = models.ForeignKey(User, related_name='favorite_movies', on_delete=models.CASCADE)
    tmdb_id = models.IntegerField()  # Store the TMDB movie ID
    added_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'tmdb_id')  # Prevent duplicate entries

class WatchedMovie(models.Model):
    user = models.ForeignKey(User, related_name='watched_movies', on_delete=models.CASCADE)
    tmdb_id = models.IntegerField()  # Store the TMDB movie ID
    watched_on = models.DateTimeField(auto_now_add=True)  # Date when the user watched the movie

    class Meta:
        unique_together = ('user', 'tmdb_id')

class WatchlistMovie(models.Model):
    user = models.ForeignKey(User, related_name='watchlist_movies', on_delete=models.CASCADE)
    tmdb_id = models.IntegerField()  # Store the TMDB movie ID
    added_on = models.DateTimeField(auto_now_add=True)  # Date when the movie was added to the watchlist

    class Meta:
        unique_together = ('user', 'tmdb_id')

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [('user', 'post')]

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
