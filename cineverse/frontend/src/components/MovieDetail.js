import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import classes from './MovieDetail.module.css'; // Assuming you have CSS for styling

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [posts, setPosts] = useState([]);
  const API_KEY = '720e3633927ed61a55ede58d3a1b033d'; // Replace with your actual TMDB API key

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);
  // Fetch movie reviews
  useEffect(() => {
    const fetchMovieReviews = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${API_KEY}`);
        const data = await response.json();
        setReviews(data.results); // Assuming 'results' is the array of reviews
      } catch (error) {
        console.error('Error fetching movie reviews:', error);
      }
    };

    fetchMovieReviews();
  }, [id]);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:8000/accounts/api/movie_posts/${id}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [id]);

  if (!movie) {
    return <div className={classes.loading}>Loading...</div>;
  }

  return (
    <div className={classes.detailContainer}>
      <h1 className={classes.title}>{movie.title}</h1>
      <div className={classes.mainInfo}>
        <img className={classes.poster} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`Poster of ${movie.title}`} />
        <div className={classes.summary}>
          <p>{movie.overview}</p>
          <p><strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(', ')}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          {/* Include more details as you like */}
        </div>
      </div>
      <div className={classes.additionalInfo}>
        <h2>Cast</h2>
        <ul>
          {movie.credits.cast.slice(0, 5).map((member, index) => (
            <li key={index}>{member.name} as {member.character}</li>
          ))}
        </ul>
        {/* Add the Reviews section here */}
      {/* <div className={classes.reviewsSection}> */}
        {/* <h2>Reviews</h2> */}
        {/* {reviews.length > 0 ? ( */}
          {/* reviews.map(review => ( */}
            {/* <div key={review.id} className={classes.review}> */}
              {/* <h3>{review.author}</h3> */}
              {/* <p>{review.content}</p> */}
              {/* Add more details as you prefer */}
            {/* </div> */}
          {/* )) */}
        {/* ) : ( */}
          {/* <p>No reviews available.</p> */}
        {/* )} */}
      {/* </div> */}

      <div className={classes.postsSection}>
        <h2>User Posts About This Movie</h2>
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className={classes.post}>
              <strong>
                <Link to={`/profile/${post.user__username}`} className={classes.postLink}>
                  {post.user__username}
                </Link>
              </strong>
              <span className={classes.postDateTime}>
                {new Date(post.created_at).toLocaleString()}
              </span>
              <p>{post.content}</p>
            </div>
          ))
        ) : (
          <p>No posts available for this movie.</p>
        )}
      </div>
    </div>
  </div>
);
        };

export default MovieDetail;
