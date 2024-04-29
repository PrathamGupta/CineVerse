from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import CreatePostView, UserPostsView, get_user_profile
from .views import follow_user, unfollow_user, check_follow_status, fetch_movies, fetch_movie_images, add_favorite, remove_favorite, list_favorites, search_movies, fetch_favorite_movies

urlpatterns = [
    path("register/", views.signup, name="register"),
    path("login/", views.signin, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("signin/", views.signin, name="signin"),
    path("signup/", views.signup, name="signup"),
    path('create_post/', CreatePostView.as_view(), name='create_post'),
    path('user_posts/', UserPostsView.as_view(), name='user_posts'),
    path('update_post/<int:post_id>/', views.update_post, name='update_post'),
    path('delete_post/<int:post_id>/', views.delete_post, name='delete_post'),
    path('user/<str:user_name>/profile/', get_user_profile, name='user_profile'),
    path('user/follow/<str:user_name>/', follow_user, name='follow_user'),
    path('user/unfollow/<str:user_name>/', unfollow_user, name='unfollow_user'),
    path('user/follow_status/<str:user_check>/', check_follow_status, name='check_follow_status'),
    path('api/movies/', fetch_movies, name='fetch_movies'),
    path('api/movies/<int:movie_id>/images/', fetch_movie_images, name='fetch_movie_images'),
    path('user/add_favorite/', add_favorite, name='add_favorite'),
    path('user/remove_favorite/<int:tmdb_id>/', remove_favorite, name='remove_favorite'),
    path('user/list_favorites/', list_favorites, name='list_favorites'),
    path('api/search_movies/', search_movies, name='search_movies'),
    path('api/favorites/', fetch_favorite_movies, name='fetch_favorites'),
]
