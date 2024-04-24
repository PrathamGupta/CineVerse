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
    watched_by = models.ManyToManyField(User, related_name='watched_movies') 

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

