import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './profile.css';
import UserContext from '../userContext';

const Profile = () => {
    const user = useContext(UserContext)
    console.log(user.user.username)
    return (
        <div>
            <div className="nav-container">
                <header className="profile-header">
                    <div className="logo">CINEVERSE</div>
                    <nav>
                        {/* Adjust the href attributes as needed */}
                        <Link to="/films">Films</Link>
                        <Link to="/lists">Lists</Link>
                        <Link to="/members">Members</Link>
                        <Link to="/journal">Journal</Link>
                        <Link to="/logout" className="cta">Logout</Link>
                    </nav>
                </header>
            </div>

            <main className="main-container">
                <div className="main-sub-container">
                    <div className="profile-info-container">
                        <div className="user-image"></div>
                        <div>
                            <h2>{user.user.username}</h2>
                        </div>
                        <button>Edit Profile</button>
                    </div>

                    <div className="stat-container">
                        <span className="stat">0 <br />Films</span>
                        <span className="stat">0 <br />Following</span>
                        <span className="stat">0 <br />Followers</span>
                    </div>
                </div>

                <div className="profile-nav-container">
                    <nav className="profile-nav">
                        <ul className="nav-list">
                            {/* Add "active" class based on the current view */}
                            <li><Link to="/overview">Overview</Link></li>
                            <li><Link to="/films">Films</Link></li>
                            <li><Link to="/reviews">Reviews</Link></li>
                            <li><Link to="/watchlist">Watchlist</Link></li>
                            <li><Link to="/likes">likes</Link></li>
                            <li><Link to="/tags">tags</Link></li>
                            {/* ... other list items ... */}
                        </ul>
                    </nav>
                </div>

                <div className="content-container">
                    {/* Example sections - you can add more as needed */}
                    <section className="favorite-films">
                        <h2>Favorite Films</h2>
                        <p>Don't forget to select your favorite films!</p>
                        <div className="film-list">
                            <div className="film"></div>
                            <div className="film"></div>
                            <div className="film"></div>
                        </div>
                    </section>

                    <section className="recent-activity">
                        <h2>Recent Activity</h2>
                        <div className="activity-list">
                            <div className="activity"></div>
                            <div className="activity"></div>
                            <div className="activity"></div>
                        </div>
                        <Link to="#" className="all-activity">ALL</Link>
                    </section>
                </div>
            </main>

            <footer className="profile-footer">
                {/* Footer content */}
            </footer>
        </div>
    );
};

export default Profile;
