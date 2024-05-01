from django.contrib import admin
from .models import User, Movie, TVShow, Review, Rating, Group, GroupMember, Post, Message, Follow, FavoriteMovie, WatchedMovie, WatchlistMovie, Like, Comment


# Register your models here.
admin.site.register(User)
admin.site.register(Movie)
admin.site.register(TVShow)
admin.site.register(Review)
admin.site.register(Rating)
admin.site.register(Group)
admin.site.register(GroupMember)
admin.site.register(Post)
admin.site.register(Message)
admin.site.register(Follow)
admin.site.register(FavoriteMovie)
admin.site.register(WatchedMovie)
admin.site.register(WatchlistMovie)
admin.site.register(Like)
admin.site.register(Comment)

