import React, { useState } from 'react';
import styles from './AddMovie.module.css';  // Make sure the path is correct
import { useFavorites } from './FavoritesContext';


const AddMovie = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { addFavorite } = useFavorites(); 
    const API_KEY = '720e3633927ed61a55ede58d3a1b033d';  // Replace this with your actual TMDB API key

    const fetchSearchResults = async () => {
        if (searchTerm.trim() === '') {
            alert('Please enter a search term.');
            return;
        }
        const url = `http://localhost:8000/accounts/api/search_movies/?query=${encodeURIComponent(searchTerm)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                setSearchResults(data);  // Assuming the backend sends back just the array of results
            } else {
                throw new Error(data.error || 'Failed to fetch search results');
            }
        } catch (error) {
            console.error('Error fetching search results:', error.message);
        }
    };
    
    const handleSearchSubmit = (event) => {
        event.preventDefault();  // Prevent the form from causing a page reload
        fetchSearchResults();
    };

    const handleAddToFavorites = async (movie) => {
        try {
            const response = await fetch('http://localhost:8000/accounts/user/add_favorite/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`  // Ensure the token is sent
                },
                body: JSON.stringify({ tmdb_id: movie.id })
            });
            if (response.ok) {
                alert('Added to favorites!');
                addFavorite(movie);  // Optionally update local state/context
            } else {
                alert('Failed to add to favorites');
            }
        } catch (error) {
            console.error('Error adding favorite:', error);
        }
    };

    const handleAddToWatched = async (movie) => {
        try {
            const response = await fetch('http://localhost:8000/accounts/user/add_watched_movie/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`  // Ensure the token is sent
                },
                body: JSON.stringify({ tmdb_id: movie.id })
            });
            if (response.ok) {
                alert('Added to Watched movies!');
                // addFavorite(movie);  // Optionally update local state/context
            } else {
                alert('Failed to add to Watched movies');
            }
        } catch (error) {
            console.error('Error adding watched movie:', error);
        }
    };

    const handleAddToWatchlist = async (movie) => {
        try {
            const response = await fetch('http://localhost:8000/accounts/user/add_to_watchlist/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`  // Ensure the token is sent
                },
                body: JSON.stringify({ tmdb_id: movie.id })
            });
            if (response.ok) {
                alert('Added to Watchlist!');
                // addFavorite(movie);  // Optionally update local state/context
            } else {
                alert('Failed to add to Watchlist');
            }
        } catch (error) {
            console.error('Error adding to Watchlist:', error);
        }
    };

    return (
      <div className={styles.bodyContainer}>
        <div className={styles.container}>
          <h1 className={styles.title}>Add Movie</h1>
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for movies..."
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>
          <div className={styles.results}>
            {searchResults.map((movie) => (
              <div key={movie.id} className={styles.resultItem}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className={styles.movieImage}
                />
                <h4 className={styles.movieTitle}>{movie.title}</h4>
                <p className={styles.movieOverview}>{movie.overview}</p>
                <button
                  onClick={() => handleAddToFavorites(movie)}
                  className={styles.addButton}
                >
                  Add to Favorites
                </button>
                <button
                  onClick={() => handleAddToWatched(movie)}
                  className={styles.addButton}
                >
                  Add to Watched movies
                </button>
                <button
                  onClick={() => handleAddToWatchlist(movie)}
                  className={styles.addButton}
                >
                  Add to Watchlist
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

export default AddMovie;
