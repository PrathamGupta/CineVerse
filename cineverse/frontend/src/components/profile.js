import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classes from './Profile.module.css';
import UserContext from '../userContext';
import { useFavorites } from './FavoritesContext';
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


const Profile = () => {
    const { user, logout } = useContext(UserContext);
    const [images, setImages] = useState([]); // State to store image URLs
    const { favorites } = useFavorites(); // Use favorites from the context

    const API_KEY = '720e3633927ed61a55ede58d3a1b033d'; // Replace with your actual API key
    const baseUrl = 'https://image.tmdb.org/t/p/';
    const size = 'w500'; // Change this according to your requirement

    // Fetches images for movies when component mounts
    useEffect(() => {
        const fetchMoviesAndImages = async () => {
            const moviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`;
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
            const imagesUrl = `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${API_KEY}`;
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

    const handleLogout = (event) => {
        event.preventDefault();
        logout();
    };
    

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
                        <Link to="/" onClick={handleLogout} className="cta">Logout</Link>
                    </nav>
                </header>
            </div>

            <main className={classes["main-container"]}>
                <div className={classes["main-sub-container"]}>
                    <div className={classes["profile-info-container"]}>
                        <div className={classes["user-image"]}></div>
                        <div>
                            <h2>{user ? user.username : 'Loading...'}</h2>
                        </div>
                        <button>Edit Profile</button>
                    </div>

                    <div className={classes["stat-container"]}>
                        <span className={classes["stat"]}>0 <br />Films</span>
                        <span className={classes["stat"]}>0 <br />Following</span>
                        <span className={classes["stat"]}>0 <br />Followers</span>
                    </div>
                </div>

                <div className={classes["profile-nav-container"]}>
                    <nav className={classes["profile-nav"]}>
                        <ul className={classes["nav-list"]}>
                            <li><Link to="/overview">Overview</Link></li>
                            <li><Link to="/films">Films</Link></li>
                            <li><Link to="/reviews">Reviews</Link></li>
                            <li><Link to="/watchlist">Watchlist</Link></li>
                            <li><Link to="/likes">likes</Link></li>
                            <li><Link to="/tags">tags</Link></li>
                        </ul>
                    </nav>
                    <div className={classes["add-movie-link"]}>
                    <Link to="/add-movie" className={classes["plus-icon"]}>+</Link>
                </div>
                </div>

                <div className={classes["content-container"]}>
                    <section className={classes["favorite-films"]}>
                        <h2>Favorite Films</h2>
                        {favorites.length > 0 ? (
                            
                            
                                <Slider {...settings}>
                                {favorites.map((movie, index) => (
                                    <div key={index} className={classes["film"]}>
                                        <Link to={`/movie/${movie.id}`}> {/* Add Link component here */}
                                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className={classes["movieImage"]}/>
                                        <h3>{movie.title}</h3>
                                        </Link>
                                    </div>
                                ))}
                              </Slider>  
                            
                            
                        ) : <p>Don't forget to select your favorite films!</p>}
                    </section>

                    <section className={classes["recent-activity"]}>
                        <h2>Recent Activity</h2>
                        <div className={classes["activity-list"]}>
                            <div className={classes["activity"]}></div>
                            <div className={classes["activity"]}></div>
                            <div className={classes["activity"]}></div>
                        </div>
                        <Link to="#" className={classes["all-activity"]}>ALL</Link>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Profile;
