import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import classes from './ProfilePosts.module.css';
import UserContext from '../userContext';
// import { useFavorites } from './FavoritesContext';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash, faHeart, faComment } from "@fortawesome/free-solid-svg-icons";

// Slider settings for react-slick
const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    centerMode: true, // Enables centered view where the active slide is in the center
    centerPadding: '60px',
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};


const ProfileLikes = () => {
    const { user, logout } = useContext(UserContext);
    const { username } = useParams();
    const [images, setImages] = useState([]); // State to store image URLs
    // const { favorites } = useFavorites(); // Use favorites from the context
    // const [favorites, setFavorites] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [profileData, setProfileData] = useState({
        watched_movies_count: 0,
        followers_count: 0,
        following_count: 0
    }); // State to store profile statistics
  const [posts, setPosts] = useState([]);
  const [currentComment, setCurrentComment] = useState("");
  const navigate = useNavigate();


    const API_KEY = '720e3633927ed61a55ede58d3a1b033d'; // Replace with your actual API key
    const baseUrl = 'https://image.tmdb.org/t/p/';
    const size = 'w500'; // Change this according to your requirement

    // Fetches images for movies when component mounts
    useEffect(() => {
        const fetchMoviesAndImages = async () => {
            const moviesUrl = `http://localhost:8000/accounts/api/movies/`;
            try {
                const moviesResponse = await fetch(moviesUrl);
                const moviesData = await moviesResponse.json();
                const movieIds = moviesData.results.map(movie => movie.id);
    
                // Fetch images for each movie ID
                movieIds.forEach(id => fetchImagesForMovie(id));
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        const fetchImagesForMovie = async (movieId) => {
            const imagesUrl = `http://localhost:8000/accounts/api/movies/${movieId}/images/`;
            try {
                const imagesResponse = await fetch(imagesUrl);
                const imagesData = await imagesResponse.json();
                const newImages = imagesData.backdrops.map(backdrop => baseUrl + size + backdrop.file_path);
                setImages(prevImages => [...prevImages, ...newImages]);
            } catch (error) {
                console.error(`Error fetching images for movie ID ${movieId}:`, error);
            }
        };

        fetchMoviesAndImages();
    }, []);
    
    const fetchProfileData = async () => {
        // Replace the URL with your actual endpoint that fetches profile stats
        const response = await fetch(`http://localhost:8000/accounts/user/${username}/profile/`, {
            method: 'GET',
            // body: JSON.stringify(fetchStatusData)
        });
        if (response.ok) {
            const data = await response.json();
            setProfileData({
                watched_movies_count: data.watched_movies_count,
                followers_count: data.followers_count,
                following_count: data.following_count
            });
        } else {
            console.error('Failed to fetch profile data');
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [username]);
    

    const handleLogout = (event) => {
        event.preventDefault();
        logout();
    };

    useEffect(() => {
        const fetchFollowStatus = async () => {
            let fetchStatusData = {user_following: user.username}
            if (user && username !== user.username) {
                const response = await fetch(`http://localhost:8000/accounts/user/follow_status/${username}/`, {
                    method: 'GET',
                    headers: {'Authorization': `Bearer ${localStorage.getItem('access')}`}
                    // body: JSON.stringify(fetchStatusData)
                });
                if (response.ok) {
                    const data = await response.json();
                    setIsFollowing(data.isFollowing);
                    console.log("user following:", data.isFollowing)
                }
            }
        };

        fetchFollowStatus();
    }, [username, user]);

    const toggleFollow = async () => {
        // let toggleFollowData = {user_following: user.username}
        const endpoint = isFollowing ? 'unfollow' : 'follow';
        const response = await fetch(`http://localhost:8000/accounts/user/${endpoint}/${username}/`, {
            method: isFollowing ? 'DELETE' : 'POST',  // Use POST for both follow and unfollow for simplicity
            headers: { 'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem('access')}` },
            // body: JSON.stringify(toggleFollowData)
        });
        if (response.ok) {
            setIsFollowing(!isFollowing);
            fetchProfileData();
        } else {
            console.error("Failed to toggle follow status.");
        }
    };

    const fetchPosts = async () => {
        const response = await fetch(
          `http://localhost:8000/accounts/user/get_liked_posts/?username=${username}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
          console.log("Post data: ", posts);
          console.log("User: ", user);
        } else {
          console.error("Failed to fetch posts");
        }
      };
    
      // Fetch posts when the component mounts
      useEffect(() => {
        fetchPosts();
      }, [user.username]);

      const handleLike = async (postId, isLiked) => {
        const method = isLiked ? 'DELETE' : 'POST'; // Determine method based on current like status
        const url = isLiked ? `http://localhost:8000/accounts/posts/${postId}/unlike/` : `http://localhost:8000/accounts/posts/${postId}/like/`
        try {
          const response = await fetch(url , {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("access")}`
            },
          });
      
          if (response.ok) {
            fetchPosts(); // Refresh posts to show updated like count and state
          } else {
            console.error("Failed to toggle like on post");
          }
        } catch (error) {
          console.error("Error toggling like on the post:", error);
        }
      };
    
      const handleAddComment = async (postId) => {
        if (!currentComment.trim()) return; // Prevent empty comments
      
        try {
          const response = await fetch(`http://localhost:8000/accounts/posts/${postId}/comment/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("access")}`
            },
            body: JSON.stringify({ content: currentComment })
          });
      
          if (response.ok) {
            setCurrentComment(""); // Reset comment input
            fetchPosts(); // Refresh posts to show new comment
          } else {
            console.error("Failed to add comment");
          }
        } catch (error) {
          console.error("Error adding the comment:", error);
        }
      };
       

    return (
      <div className={classes.bodyContainer}>
        <div className={classes["nav-container"]}>
          <header className={classes["profile-header"]}>
          <div onClick={() => navigate("/feed")} className={classes["logo"]}>CINEVERSE</div>
            <nav>
            <Link to={`/add-movie`}>Films</Link>
            <Link to={`/profile/${user.username}/watchlist`}>Lists</Link>
            <Link to="/members">Members</Link>
              {/* <Link to="/journal">Journal</Link> */}
              <Link to="/" onClick={handleLogout} className="cta">
                Logout
              </Link>
            </nav>
            {user && user.username !== username && (
              <button
                onClick={toggleFollow}
                className={classes["follow-button"]}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </header>
        </div>

        <main className={classes["main-container"]}>
          <div className={classes["main-sub-container"]}>
            <div className={classes["profile-info-container"]}>
              <div className={classes["user-image"]}></div>
              <div>
                <h2>{username}</h2>
              </div>
              {user && user.username === username && (
                <button>Edit Profile</button>
              )}
            </div>

            <div className={classes["stat-container"]}>
              <span className={classes["stat"]}>
                {profileData.watched_movies_count} <br />
                Films
              </span>
              <span className={classes["stat"]}>
                {profileData.following_count} <br />
                Following
              </span>
              <span className={classes["stat"]}>
                {profileData.followers_count} <br />
                Followers
              </span>
            </div>
          </div>

          <div className={classes["profile-nav-container"]}>
            <nav className={classes["profile-nav"]}>
              <ul className={classes["nav-list"]}>
                <li>
                  <Link to={`/profile/${username}`}>Overview</Link>
                </li>
                <li>
                  <Link to={`/profile/${username}/films`}>Films</Link>
                </li>
                <li>
                  <Link
                    to={`/profile/${username}/posts`}
                  >
                    Posts
                  </Link>
                </li>
                <li>
                  <Link to={`/profile/${username}/watchlist`}>Watchlist</Link>
                </li>
                <li>
                  <Link to={`/profile/${username}/likes`} className={classes.active}>Likes</Link>
                </li>
                {/* <li><Link to="/tags">tags</Link></li> */}
              </ul>
            </nav>
            <div className={classes["add-movie-link"]}>
              <Link to="/add-movie" className={classes["plus-icon"]}>
                +
              </Link>
            </div>
          </div>

          <div className={classes.feedMainContainer}>
            <div className={classes["feed-content"]}>
              {posts.map((post) => (
                <div key={post.id} className={classes["post"]}>
                  <div className={classes["post-header"]}>
                    <strong>
                      <Link
                        to={`/profile/${post.user__username}`}
                        className={classes.postLink}
                      >
                        {post.user__username}
                      </Link>
                    </strong>
                    <span className={classes.postDateTime}>
                      {new Date(post.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className={classes["post-content"]}>
                    {post.movie_poster && (
                      <div className={classes["film"]}>
                        <Link to={`/movie/${post.tmdb_id}`}>
                          {" "}
                          {/* Add Link component here */}
                          <img
                            src={`https://image.tmdb.org/t/p/w500${post.movie_poster}`}
                            alt={post.movie_title}
                            className={classes["movieImage"]}
                          />
                        </Link>
                      </div>
                    )}
                    <div className="content-like-comment">
                      <p>{post.content}</p>
                      <div className={classes.LikeCommentContainer}>
                        <button
                          onClick={() => handleLike(post.id, post.isLiked)}
                          className={`${classes.likeButton} ${
                            post.isLiked ? classes.active : ""
                          }`}
                        >
                          <FontAwesomeIcon icon={faHeart} />{" "}
                          {post.likes_count || 0}
                        </button>
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className={classes.commentButton}
                        >
                          <FontAwesomeIcon icon={faComment} />{" "}
                          {post.comments_count || 0}
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={currentComment}
                        onChange={(e) => setCurrentComment(e.target.value)}
                        className={classes.commentInput}
                      />
                      {post.comments &&
                        post.comments.map((comment) => (
                          <div key={comment.id} className={classes.comment}>
                            <strong>{comment.user__username}</strong>
                            <p>{comment.content}</p>
                          </div>
                        ))}
                    </div>
                    {/* {post.movie_title && <h3>{post.movie_title}</h3>} */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
};

export default ProfileLikes;
