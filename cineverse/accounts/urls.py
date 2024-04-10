from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import CreatePostView, UserPostsView

urlpatterns = [
    path("register/", views.signup, name="register"),
    path("login/", views.signin, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("signin/", views.signin, name="signin"),
    path("signup/", views.signup, name="signup"),
    path('create_post/', CreatePostView.as_view(), name='create_post'),
    path('user_posts/', UserPostsView.as_view(), name='user_posts'),
]
