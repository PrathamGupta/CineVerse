import React, { useState } from 'react';
import styles from './PostMovie.module.css';  // Make sure the path is correct
import { useMovie } from '../MovieContext';
import { Navigate, useNavigate } from 'react-router-dom';


const PostMovie = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { addSelectedMovie } = useMovie(); 

    const navigate = useNavigate();

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

    const handleAddToPost = (movie) => {
        try {
            // const response = await fetch('http://localhost:8000/accounts/user/add_favorite/', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${localStorage.getItem('access')}`  // Ensure the token is sent
            //     },
            //     body: JSON.stringify({ tmdb_id: movie.id })
            // });
            // if (response.ok) {
                // alert('Added to favorites!');
            addSelectedMovie(movie);
            navigate("/feed") // Optionally update local state/context
            // } else {
            //     alert('Failed to add to post');
            // }
        } catch (error) {
            console.error('Error adding to post:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Select Movie</h1>
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
                        <button onClick={() => handleAddToPost(movie)} className={styles.addButton}>Post Movie</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostMovie;
