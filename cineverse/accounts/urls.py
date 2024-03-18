from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("register/", views.signup, name="register"),
    path("login/", views.signin, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("signin/", views.signin, name="signin"),
    path("signup/", views.signup, name="signup"),
]
