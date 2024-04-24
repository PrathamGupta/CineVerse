from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import CreatePostView, UserPostsView, get_user_profile

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
    path('user/<int:user_id>/profile/', get_user_profile, name='user_profile'),
]
