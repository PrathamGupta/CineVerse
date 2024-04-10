import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classes from './Feed.module.css'; // You should create this CSS module file
import UserContext from '../userContext';

const Feed = () => {
  const { user } = useContext(UserContext);
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  // Fetch posts when the component mounts
  useEffect(() => {
      const fetchPosts = async () => {
        const response = await fetch(`http://localhost:8000/accounts/user_posts/?username=${user.username}`);
          if (response.ok) {
              const data = await response.json();
              setPosts(data);
          } else {
              // Handle error
              console.error('Failed to fetch posts');
          }
      };
      
      fetchPosts();
  }, []);

  // Handle post creation
  const handlePostSubmit = async (e) => {
      e.preventDefault();
      const response = await fetch('http://localhost:8000/accounts/create_post/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          // credentials: 'include',
          body: JSON.stringify({ content: postContent , user: user.username}),
      });

      if (response.ok) {
          const newPost = await response.json();
          // Add the new post to the existing posts array
          setPosts(prevPosts => [newPost, ...prevPosts]);
          setPostContent('');
      } else {
          // Handle error
          console.error('Failed to create post');
      }
  };

    return (
        <div className={classes.bodyContainer}>
            <div className={classes["nav-container"]}>
                <header className={classes["profile-header"]}>
                    <div className={classes["logo"]}>CINEVERSE</div>
                    <nav>
                        {/* Adjust the href attributes as needed */}
                        <Link to="/films">Films</Link>
                        <Link to="/lists">Lists</Link>
                        <Link to="/members">Members</Link>
                        <Link to="/journal">Journal</Link>
                        {/* Placeholder for profile icon */}
                        <Link to="/profile" className={classes.profileIcon}>
                        <img src={user?.profilePicture || require('../components/images/Default_pfp.svg.png')} alt="Profile" />
                        </Link>
                    </nav>
                </header>
            </div>

            <main className={classes["main-container"]}>
            <form className={classes.postCreationForm} onSubmit={handlePostSubmit}>
                    <textarea
                        className={classes.postTextArea}
                        placeholder="What's happening?"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                    />
                    <button type="submit" className={classes.postSubmitButton}>
                        Post
                    </button>
                </form>
                <div className={classes["feed-content"]}>
                  {posts.map((post) => (
                    <div key={post.id} className={classes["post"]}>
                      <div className={classes["post-header"]}>
                        <strong>{post.user__username}</strong> {/* assuming 'user' is just a username */}
                        <span className={classes.postDateTime}>{new Date(post.created_at).toLocaleString()}</span>
                      </div>
                      <p>{post.content}</p>
                      {/* Add other post details or actions here */}
                    </div>
                  ))}
                </div>
            </main>
        </div>
    );
};

export default Feed;
