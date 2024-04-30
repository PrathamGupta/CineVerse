import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import classes from './Profile.module.css';
import UserContext from '../userContext';
// import { useFavorites } from './FavoritesContext';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

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


const ProfileMovies = () => {
    const { user, logout } = useContext(UserContext);
    const { username } = useParams();
    const [images, setImages] = useState([]); // State to store image URLs
    // const { favorites } = useFavorites(); // Use favorites from the context
    // const [favorites, setFavorites] = useState([]);
    const [watched, setWatched] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [profileData, setProfileData] = useState({
        watched_movies_count: 0,
        followers_count: 0,
        following_count: 0
    }); // State to store profile statistics

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

    useEffect(() => {
        const fetchWatchedMovies = async () => {
            const url = `http://localhost:8000/accounts/user/watched_movies/${username}`;
            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch favorite movies');
                const moviesData = await response.json();
                setWatched(moviesData);
            } catch (error) {
                console.error('Error fetching favorite movies:', error);
            }
        };
    
        fetchWatchedMovies();
    }, [user]);
       

    return (
      <div className={classes.bodyContainer}>
        <div className={classes["nav-container"]}>
          <header className={classes["profile-header"]}>
            <div className={classes["logo"]}>CINEVERSE</div>
            <nav>
              <Link to="/films">Films</Link>
              <Link to="/lists">Lists</Link>
              <Link to="/members">Members</Link>
              <Link to="/journal">Journal</Link>
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
                  <Link to={`/profile/${username}`} >
                    Overview
                  </Link>
                </li>
                <li>
                  <Link to={`/profile/${username}/films`} className={classes.active}>Films</Link>
                </li>
                <li>
                  <Link to={`/profile/${username}/posts`}>Posts</Link>
                </li>
                <li>
                  <Link to={`/profile/${username}/watchlist`}>Watchlist</Link>
                </li>
                <li>
                  <Link to={`/profile/${username}/likes`}>Likes</Link>
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

          <div className={classes["content-container"]}>
            <section className={classes["favorite-films"]}>
              <h2>Watched Films</h2>
              {watched.length > 0 ? (
                <Slider {...settings}>
                  {watched.map((movie, index) => (
                    <div key={index} className={classes["film"]}>
                      <Link to={`/movie/${movie.id}`}>
                        {" "}
                        {/* Add Link component here */}
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className={classes["movieImage"]}
                        />
                        {/* <h3>{movie.title}</h3> */}
                      </Link>
                    </div>
                  ))}
                </Slider>
              ) : (
                <p>Don't forget to select your favorite films!</p>
              )}
            </section>

            {/* <section className={classes["recent-activity"]}>
              <h2>Recent Activity</h2>
              <div className={classes["activity-list"]}>
                <div className={classes["activity"]}></div>
                <div className={classes["activity"]}></div>
                <div className={classes["activity"]}></div>
              </div>
              <Link to="#" className={classes["all-activity"]}>
                ALL
              </Link>
            </section> */}
          </div>
        </main>
      </div>
    );
};

export default ProfileMovies;
