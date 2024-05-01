from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import CreatePostView, UserPostsView, get_user_profile
from .views import follow_user, unfollow_user, check_follow_status, fetch_movies, fetch_movie_images, add_favorite, remove_favorite, search_movies, fetch_favorite_movies, get_movie_posts
from .views import add_watched_movie, remove_watched_movie, fetch_watched_movies, add_to_watchlist, remove_from_watchlist, fetch_watchlist_movies, add_like, add_comment, remove_like, list_users

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
    # path('user/list_favorites/', list_favorites, name='list_favorites'),
    path('api/search_movies/', search_movies, name='search_movies'),
    path('api/favorites/<str:user_name>', fetch_favorite_movies, name='fetch_favorites'),
    path('api/movie_posts/<int:tmdb_id>/', get_movie_posts, name='movie_posts'),
    
    # Watched Movie
    path('user/add_watched_movie/', add_watched_movie, name='add_watched_movie'),
    path('user/remove_watched_movie/<int:tmdb_id>/', remove_watched_movie, name='remove_watched_movie'),
    path('user/watched_movies/<str:user_name>/', fetch_watched_movies, name='fetch_watched_movies'),

    # Watchlist Movies
    path('user/add_to_watchlist/', add_to_watchlist, name='add_to_watchlist'),
    path('user/remove_from_watchlist/<int:tmdb_id>/', remove_from_watchlist, name='remove_from_watchlist'),
    path('user/watchlist_movies/<str:user_name>/', fetch_watchlist_movies, name='fetch_watchlist_movies'),


    path('api/users/', list_users, name='list_users'),

    #Like comments
    path('posts/<int:post_id>/like/', add_like, name='add-like'),
    path('posts/<int:post_id>/unlike/', remove_like, name='delete-like'),
    path('posts/<int:post_id>/comment/', add_comment, name='add-comment'),
]
