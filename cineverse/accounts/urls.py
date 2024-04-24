from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import CreatePostView, UserPostsView, get_user_profile
from .views import follow_user, unfollow_user, check_follow_status

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
    path('user/follow_status/<str:user_follow>/<str:user_check>/', check_follow_status, name='check_follow_status'),
]
