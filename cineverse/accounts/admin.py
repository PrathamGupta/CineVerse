from django.contrib import admin
from .models import User, Movie, TVShow, Review, Rating, Group, GroupMember, Post, Message


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