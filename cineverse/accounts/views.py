from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from .forms import RegisterForm, LoginForm
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
from django.utils.decorators import method_decorator
from .models import Post, User, Follow, FavoriteMovie, WatchedMovie, WatchlistMovie, Like, Comment
from django.contrib.auth.decorators import login_required
from django.views import View
from django.forms.models import model_to_dict
from django.views.decorators.http import require_POST, require_http_methods
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.edit import UpdateView, DeleteView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.core import serializers
from django.db.models import Count, Prefetch, Exists, OuterRef

API_KEY='720e3633927ed61a55ede58d3a1b033d'

@csrf_exempt
def fetch_movies(request):
    url = f"https://api.themoviedb.org/3/discover/movie?api_key={API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raises a HTTPError for bad requests
        movies_data = response.json()
        return JsonResponse(movies_data)
    except requests.RequestException as e:
        return JsonResponse({'error': str(e)}, status=502)  # Bad gateway error

@csrf_exempt
def fetch_movie_images(request, movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}/images?api_key={API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        images_data = response.json()
        return JsonResponse(images_data)
    except requests.RequestException as e:
        return JsonResponse({'error': str(e)}, status=502)
    


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def list_favorites(request, user_name):
#     user = user_name
#     favorites = FavoriteMovie.objects.filter(user=user).values_list('tmdb_id', flat=True)
#     return Response(favorites, status=200)

@require_http_methods(["GET"])
def search_movies(request):
    search_term = request.GET.get('query', '').strip()
    if not search_term:
        return JsonResponse({'error': 'Search term is required'}, status=400)
    
    # api_key = 'your_tmdb_api_key_here'  # Replace this with your actual TMDB API key
    url = f'https://api.themoviedb.org/3/search/movie?api_key={API_KEY}&query={requests.utils.quote(search_term)}'
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Will raise an HTTPError for bad requests (400 or 500)
        data = response.json()
        return JsonResponse(data['results'], safe=False)  # Return only the results array
    except requests.RequestException as e:
        return JsonResponse({'error': str(e)}, status=500)
    

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def logout_view(request):
    logout(request)
    return redirect('home')

@csrf_exempt  # Note: This is not recommended for production - see below for CSRF handling
def signin(request):
    if request.method == "POST":
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            print(user.id)

            if user is not None:
                login(request, user)  # Log the user in
                token = get_tokens_for_user(user)  # Assuming this function returns a dict with tokens
                return JsonResponse({
                    "status": "success",
                    "message": "Logged in successfully.",
                    "id": user.id,
                    "username": user.username,
                    "token": token
                }, status=200)
            else:
                return JsonResponse({"status": "error", "message": "Invalid username or password"}, status=401)
        else:
            return JsonResponse({"status": "error", "errors": form.errors}, status=400)
    else:
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
# @permission_classes([IsAuthenticated])
class CreatePostView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            data = json.loads(request.body)
            content = data.get('content')
            user = User.objects.get(username=request.user)
            tmdb_id = data.get('tmdb_id', None)
            print(request.user)
            if content:
                post = Post.objects.create(user=user, content=content, tmdb_id=tmdb_id)
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
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        username = request.GET.get('username')
        user = User.objects.get(username=username)
        posts = Post.objects.filter().annotate(
            # likes_count=Count('like'),  # Ensure this 'likes' is the related_name in your Like model
            # comments_count=Count('comment'),  # Ensure this 'comments' is the related_name in your Comment model
            isLiked= Exists(Like.objects.filter(post=OuterRef('pk'), user=user.id))
        ).order_by('-created_at').values(
            'id', 'user__username', 'content', 'tmdb_id', 'created_at',  'isLiked'
        )

        enriched_posts = []
        for post in posts:
            post_data = dict(post)
            # Fetch comments separately since post_data is now a dict and does not support direct query manipulations like 'comment_set'
            comments = Comment.objects.filter(post_id=post_data['id']).order_by('-created_at').values(
                'id', 'user__username', 'content', 'created_at'
            )
            post_data['comments'] = list(comments)
            post_data['likes_count'] = Like.objects.filter(post=post_data['id']).count()
            post_data['comments_count'] = Comment.objects.filter(post=post_data['id']).count()

            if post_data['tmdb_id']:
                response = requests.get(f'https://api.themoviedb.org/3/movie/{post_data["tmdb_id"]}?api_key={API_KEY}')
                if response.status_code == 200:
                    movie_details = response.json()
                    post_data['movie_title'] = movie_details.get('title')
                    post_data['movie_poster'] = f"https://image.tmdb.org/t/p/w500{movie_details.get('poster_path', '')}"
            enriched_posts.append(post_data)

        print(enriched_posts)
        # return JsonResponse(list(posts), safe=False)
        return JsonResponse(enriched_posts, safe=False)


# @login_required
@csrf_exempt
# @require_http_methods(["PUT"])
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_post(request, post_id):
    try:
        data = json.loads(request.body)
        print(post_id)
        content = data.get('content')
        # postId = data.get('postId')
        user = User.objects.get(username=request.user)
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
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_post(request, post_id):
    try:
        # data = json.loads(request.body)
        print(post_id)
        user = User.objects.get(username=request.user)
        post = Post.objects.get(id=post_id, user=user)
        post.delete()
        return JsonResponse({'status': 'success', 'message': 'Post deleted successfully.'}, status=200)
    except Post.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Post not found.'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)



# @login_required
@require_http_methods(["GET"])
@csrf_exempt
def get_user_profile(request, user_name):
    try:
        user = User.objects.get(username=user_name)
        watched_movies_count = user.watched_movies.count()
        followers_count = user.followers.count()  # Assuming 'followers' is the related name for followers in Follow model
        following_count = user.following.count()  # Assuming 'following' is the related name for whom the user is following
        print(followers_count, following_count)
        return JsonResponse({
            'username': user.username,
            'watched_movies_count': watched_movies_count,
            'followers_count': followers_count,
            'following_count': following_count,
        }, safe=False)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    
# @login_required
@api_view(["POST"])
@csrf_exempt
@permission_classes([IsAuthenticated])
def follow_user(request, user_name):
    try:
        # data = json.loads(request.body)
        user_to_follow = User.objects.get(username=user_name)
        user_following = User.objects.get(username = request.user)
        if request.user == user_to_follow:
            return JsonResponse({'status': 'error', 'message': "You cannot follow yourself."}, status=400)
        
        Follow.objects.get_or_create(follower=user_following, followed=user_to_follow)
        return JsonResponse({'status': 'success', 'message': 'Successfully followed the user.'})

    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found.'}, status=404)
    
@api_view(["DELETE"])
@csrf_exempt
@permission_classes([IsAuthenticated])
def unfollow_user(request, user_name):
    try:
        # data = json.loads(request.body)
        user_to_unfollow = User.objects.get(username=user_name)
        user_unfollowing = User.objects.get(username = request.user)
        follow_relationship = Follow.objects.filter(follower=user_unfollowing, followed=user_to_unfollow)
        follow_relationship.delete()
        return JsonResponse({'status': 'success', 'message': 'Successfully unfollowed the user.'})

    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found.'}, status=404)
    
# @login_required
@api_view(["GET"])
@csrf_exempt
@permission_classes([IsAuthenticated])
def check_follow_status(request, user_check):
    try:
        # print(request.user)
        # data = json.loads(request.body)
        user_to_check = User.objects.get(username=user_check)
        user_following = User.objects.get(username=request.user)
        is_following = Follow.objects.filter(follower=user_following, followed=user_to_check).exists()
        return JsonResponse({'status': 'success', 'isFollowing': is_following})

    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found.'}, status=404)
    
@csrf_exempt
def get_movie_posts(request, tmdb_id):
    # posts = Post.objects.filter(tmdb_id=tmdb_id).values()
    posts = Post.objects.select_related('user').filter(tmdb_id=tmdb_id).values(
            'id', 'user__username', 'content', 'tmdb_id', 'created_at'
        ).order_by('-created_at')
    print(posts)
    return JsonResponse(list(posts), safe=False)

# Favorite Movies
@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def add_favorite(request):
    tmdb_id = request.data.get('tmdb_id')
    user = request.user
    FavoriteMovie.objects.get_or_create(user=user, tmdb_id=tmdb_id)
    WatchedMovie.objects.get_or_create(user=user, tmdb_id=tmdb_id)
    return JsonResponse({'status': 'success'}, status=201)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_favorite(request, tmdb_id):
    user = request.user
    FavoriteMovie.objects.filter(user=user, tmdb_id=tmdb_id).delete()
    return Response({'status': 'removed'}, status=204)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_favorite_movies(request, user_name):
    user = User.objects.get(username=user_name)
    # user = request.user
    favorite_movies = FavoriteMovie.objects.filter(user=user)
    tmdb_ids = [movie.tmdb_id for movie in favorite_movies]
    
    movies_details = []
    for tmdb_id in tmdb_ids:
        url = f'https://api.themoviedb.org/3/movie/{tmdb_id}?api_key={API_KEY}'
        response = requests.get(url)
        if response.status_code == 200:
            movies_details.append(response.json())
    
    return JsonResponse(movies_details, safe=False)

#Watched Movies

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_watched_movie(request):
    tmdb_id = request.data.get('tmdb_id')
    user = request.user
    WatchedMovie.objects.get_or_create(user=user, tmdb_id=tmdb_id)
    return JsonResponse({'status': 'success'}, status=201)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_watched_movie(request, tmdb_id):
    user = request.user
    WatchedMovie.objects.filter(user=user, tmdb_id=tmdb_id).delete()
    return JsonResponse({'status': 'removed'}, status=204)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_watched_movies(request, user_name):
    user = User.objects.get(username=user_name)
    watched_movies = WatchedMovie.objects.filter(user=user)
    tmdb_ids = [movie.tmdb_id for movie in watched_movies]
    
    movies_details = []
    for tmdb_id in tmdb_ids:
        url = f'https://api.themoviedb.org/3/movie/{tmdb_id}?api_key={API_KEY}'
        response = requests.get(url)
        if response.status_code == 200:
            movies_details.append(response.json())
    
    return JsonResponse(movies_details, safe=False)

#Watchlist Movies

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_watchlist(request):
    tmdb_id = request.data.get('tmdb_id')
    user = request.user
    WatchlistMovie.objects.get_or_create(user=user, tmdb_id=tmdb_id)
    return JsonResponse({'status': 'success'}, status=201)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_watchlist(request, tmdb_id):
    user = request.user
    WatchlistMovie.objects.filter(user=user, tmdb_id=tmdb_id).delete()
    return JsonResponse({'status': 'removed'}, status=204)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_watchlist_movies(request, user_name):
    user = User.objects.get(username=user_name)
    watchlist_movies = WatchlistMovie.objects.filter(user=user)
    tmdb_ids = [movie.tmdb_id for movie in watchlist_movies]
    
    movies_details = []
    for tmdb_id in tmdb_ids:
        url = f'https://api.themoviedb.org/3/movie/{tmdb_id}?api_key={API_KEY}'
        response = requests.get(url)
        if response.status_code == 200:
            movies_details.append(response.json())
    
    return JsonResponse(movies_details, safe=False)

@api_view(['GET'])
def list_users(request):
    # Fetching only specific fields for serialization
    users = User.objects.all().values('id', 'username', 'email')  # Adjust the fields as needed
    user_list = list(users)  # Convert QuerySet to a list of dictionaries
    return JsonResponse(user_list, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_like(request, post_id):
    # user = request.user
    user = request.user
    post = Post.objects.get(id=post_id)
    like= Like.objects.get_or_create(user=user, post=post)
    # if created:
    return JsonResponse({'status': 'like added'}, status=201)
    # else:
        # return JsonResponse({'status': 'like already exists'}, status=200)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_like(request, post_id):
    try:
        user = request.user
        like = Like.objects.get(post_id=post_id, user=user)
        like.delete()
        return JsonResponse({'status': 'success', 'message': 'Like removed successfully.'}, status=200)
    except Like.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Like not found.'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_comment(request, post_id):
    try:
        user = request.user
        post = Post.objects.get(id=post_id)  # Ensure the post exists
        content = request.data.get('content', '').strip()  # Get the comment content and strip any excess whitespace
        
        if not content:  # Check if the content is empty
            return JsonResponse({'status': 'error', 'message': 'Comment content cannot be empty'}, status=400)
        
        # Create a new comment
        comment = Comment.objects.create(user=user, post=post, content=content)
        return JsonResponse({'status': 'success', 'message': 'Comment added successfully', 'comment_id': comment.id}, status=201)
    
    except Post.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Post not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_comments(request, post_id):
    comments = Comment.objects.filter(post_id=post_id).values('id', 'content', 'user__username', 'created_at')
    if comments:
        return JsonResponse(list(comments), safe=False, status=200)
    else:
        return JsonResponse({'status': 'no comments found'}, status=404)
