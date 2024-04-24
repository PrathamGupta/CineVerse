import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classes from './Feed.module.css';
import UserContext from '../userContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';


const Feed = () => {
    const { user } = useContext(UserContext);
    const [postContent, setPostContent] = useState('');
    const [editing, setEditing] = useState(false);
    const [editPostId, setEditPostId] = useState(null);
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        const response = await fetch(`http://localhost:8000/accounts/user_posts/?username=${user.username}`);
        if (response.ok) {
            const data = await response.json();
            setPosts(data);
            console.log("Post data: ", posts)
        } else {
            console.error('Failed to fetch posts');
        }
    };

    // Fetch posts when the component mounts
    useEffect(() => {
        fetchPosts();
    }, [user.username]);

    // Handle post creation or update
    const handlePostSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting for post ID: ", editPostId); 
        let url = 'http://localhost:8000/accounts/create_post/';
        let method = 'POST';
        let postData = { content: postContent, user: user.username };

        if (editing) {
            url = `http://localhost:8000/accounts/update_post/${editPostId}/`;
            method = 'PUT';
            postData = { content: postContent, user: user.username };
        }

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });

        if (response.ok) {
            await fetchPosts(); // Refresh posts
            setPostContent('');
            setEditing(false);
            setEditPostId(null);
        } else {
            console.error('Failed to save post');
        }
    };

    const handleEdit = (post) => {
        console.log("Editing post ID: ", post.id);
        setEditing(true);
        setEditPostId(post.id);
        setPostContent(post.content);
    };

    const handleDelete = async (postId) => {
        let deletePostData = {user: user.username}
        const response = await fetch(`http://localhost:8000/accounts/delete_post/${postId}/`, {
            method: 'DELETE',
            body: JSON.stringify(deletePostData)
        });

        if (response.ok) {
           await fetchPosts(); // Refresh posts
        } else {
            console.error('Failed to delete post');
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
            <Link to={`/profile/${user.username}`}  className={classes.profileIcon}>
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
            {editing ? 'Update' : 'Post'}
          </button>
        </form>
        <div className={classes["feed-content"]}>
          {posts.map((post) => (
            <div key={post.id} className={classes["post"]}>
              <div className={classes["post-header"]}>
                <strong><Link to={`/profile/${post.user__username}`} className = {classes.postLink}>{post.user__username}</Link></strong>
                <span className={classes.postDateTime}>{new Date(post.created_at).toLocaleString()}</span>
                {post.user__username === user.username && (
                <>
                    <button onClick={() => handleEdit(post)} className={classes.editButton}>
                    <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button onClick={() => handleDelete(post.id)} className={classes.deleteButton}>
                    <FontAwesomeIcon icon={faTrash} />
                    </button>

                </>
                )}
              </div>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Feed;
