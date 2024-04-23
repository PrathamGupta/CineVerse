from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from .forms import RegisterForm, LoginForm
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.utils.decorators import method_decorator
from .models import Post, User
from django.contrib.auth.decorators import login_required
from django.views import View
from django.forms.models import model_to_dict
from django.views.decorators.http import require_POST, require_http_methods
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.edit import UpdateView, DeleteView

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

@method_decorator(csrf_exempt, name='dispatch')
class CreatePostView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            content = data.get('content')
            user = User.objects.get(username=data.get('user'))
            if content:
                post = Post.objects.create(user=user, content=content)
                # Use model_to_dict to convert the post object to a dictionary
                post_dict = model_to_dict(post)
                # Add the username to the dictionary
                post_dict['user__username'] = user.username
                # Format the created_at field to a string
                post_dict['created_at'] = post.created_at.isoformat()
                return JsonResponse(post_dict, status=201)
            else:
                return JsonResponse({'error': 'Empty content'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class UserPostsView(View):
    # @method_decorator(login_required)
    def get(self, request):
        username = request.GET.get('username')
        user = User.objects.get(username=username)
        posts = Post.objects.select_related('user').filter().values(
            'id', 'user__username', 'content', 'created_at'
        ).order_by('-created_at')
        print(posts)
        return JsonResponse(list(posts), safe=False)


# @login_required
@csrf_exempt
@require_http_methods(["PUT"])
def update_post(request, post_id):
    try:
        data = json.loads(request.body)
        print(post_id)
        content = data.get('content')
        # postId = data.get('postId')
        user = User.objects.get(username=data.get('user'))
        post = Post.objects.get(id=post_id, user=user)
        post.content = content
        post.save()
        return JsonResponse({'status': 'success', 'message': 'Post updated successfully.'}, status=200)
    except Post.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Post not found.'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

# @login_required
@csrf_exempt
@require_http_methods(["DELETE"])
def delete_post(request, post_id):
    try:
        data = json.loads(request.body)
        print(post_id)
        user = User.objects.get(username=data.get('user'))
        post = Post.objects.get(id=post_id, user=user)
        post.delete()
        return JsonResponse({'status': 'success', 'message': 'Post deleted successfully.'}, status=200)
    except Post.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Post not found.'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)