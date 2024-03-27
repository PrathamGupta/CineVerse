from django.shortcuts import render

def home(request):
    return render(request, "cineverse/home.html")

def profile(request):
    return render(request, "cineverse/profile.html")
