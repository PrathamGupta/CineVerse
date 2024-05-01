import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import classes from "./Feed.module.css";
import UserContext from "../userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash, faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { useFavorites } from "./FavoritesContext";
import { useMovie } from "../MovieContext";

const Feed = () => {
  const { user } = useContext(UserContext);
  const [postContent, setPostContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [posts, setPosts] = useState([]);
  const { selectedMovie } = useMovie();
  const { clearSelectedMovie } = useMovie();
  const [currentComment, setCurrentComment] = useState("");

  const fetchPosts = async () => {
    const response = await fetch(
      `http://localhost:8000/accounts/get_posts/?username=${user.username}`
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

  // Handle post creation or update
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting for post ID: ", editPostId);
    let url = "http://localhost:8000/accounts/create_post/";
    let method = "POST";
    let postData = { content: postContent, user: user.username, tmdb_id: selectedMovie?.id };

    if (editing) {
      url = `http://localhost:8000/accounts/update_post/${editPostId}/`;
      method = "PUT";
      postData = { content: postContent };
    }

    // console.log("accessToken:", localStorage.getItem('access'))

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      await fetchPosts(); // Refresh posts
      setPostContent("");
      setEditing(false);
      setEditPostId(null);
      clearSelectedMovie();
    } else {
      console.error("Failed to save post");
    }
  };

  const handleEdit = (post) => {
    console.log("Editing post ID: ", post.id);
    setEditing(true);
    setEditPostId(post.id);
    setPostContent(post.content);
  };

  const handleDelete = async (postId) => {
    // let deletePostData = {user: user.username}
    const response = await fetch(
      `http://localhost:8000/accounts/delete_post/${postId}/`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
        // body: JSON.stringify(deletePostData)
      }
    );

    if (response.ok) {
      await fetchPosts(); // Refresh posts
    } else {
      console.error("Failed to delete post");
    }
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
            <Link
              to={`/profile/${user.username}`}
              className={classes.profileIcon}
            >
              <img
                src={
                  user?.profilePicture ||
                  require("../components/images/Default_pfp.svg.png")
                }
                alt="Profile"
              />
            </Link>
          </nav>
        </header>
      </div>
      <main className={classes["main-container"]}>
        <form className={classes.postCreationForm} onSubmit={handlePostSubmit}>
          <div className={classes.formSubContainer}>
            <div className={classes.moviePreview}>
              {selectedMovie && (
                <div className={classes.film}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                  />
                  {/* <p>{selectedMovie.title}</p> */}
                </div>
              )}
              <textarea
                className={classes.postTextArea}
                placeholder="What's happening?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>
            <div className={classes["add-movie-link"]}>
              <Link to="/post-movie" className={classes["plus-icon"]}>
                +
              </Link>
            </div>
          </div>
          <button type="submit" className={classes.postSubmitButton}>
            {editing ? "Update" : "Post"}
          </button>
        </form>

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
                {post.user__username === user.username && (
                  <>
                    <button
                      onClick={() => handleEdit(post)}
                      className={classes.editButton}
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className={classes.deleteButton}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </>
                )}
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
                      <FontAwesomeIcon icon={faHeart} /> {post.likes_count || 0}
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
      </main>
    </div>
  );
};

export default Feed;
