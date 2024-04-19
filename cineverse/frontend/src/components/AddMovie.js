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
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setSearchResults(data.results);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();  // Prevent the form from causing a page reload
        fetchSearchResults();
    };

    const handleAddToFavorites = (movie) => {
        addFavorite(movie);  // Use the context's addFavorite function
        alert('Added to favorites!');
    };

    return (
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
                <button type="submit" className={styles.searchButton}>Search</button>
            </form>
            <div className={styles.results}>
                {searchResults.map(movie => (
                    <div key={movie.id} className={styles.resultItem}>
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className={styles.movieImage} />
                        <h4 className={styles.movieTitle}>{movie.title}</h4>
                        <p className={styles.movieOverview}>{movie.overview}</p>
                        <button onClick={() => handleAddToFavorites(movie)} className={styles.addButton}>Add to Favorites</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddMovie;
