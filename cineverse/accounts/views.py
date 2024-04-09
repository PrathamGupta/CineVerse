from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from .forms import RegisterForm, LoginForm
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


def logout_view(request):
    logout(request)
    return redirect('home')

@csrf_exempt  # Note: This is not recommended for production - see below for CSRF handling
def signin(request):
    if request.method == "POST":
        # Parse the incoming JSON data
        form = LoginForm(request, data=request.POST)
        print(request.POST)

        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return JsonResponse({"status": "success", "message": "Logged in successfully.", "username": user.username}, status=200)

        else:
            # Return form errors if the form is not valid
            return JsonResponse({"status": "error", "errors": form.errors}, status=400)

    else:
        # Only allow POST requests; reject other methods
        return JsonResponse({"status": "error", "message": "GET request not allowed"}, status=405)

@csrf_exempt  # Temporarily disable CSRF protection for this view for simplicity
def signup(request):
    if request.method == "POST":
        # Load data from the incoming request
        data = json.loads(request.body)
        form = RegisterForm(data)
        
        if form.is_valid():
            user = form.save()
            login(request, user)
            
            # Instead of redirecting, send a JSON response
            return JsonResponse({"status": "success", "message": "User created successfully."}, status=201)
        else:
            # Send a JSON response with the error information
            return JsonResponse({"status": "error", "errors": form.errors}, status=400)
    
    # If it's a GET request, you might want to return an empty form or disallow the GET request
    return JsonResponse({"status": "error", "message": "GET request not allowed"}, status=405)