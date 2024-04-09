import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import classes from './Profile.module.css';
import UserContext from '../userContext';

const Profile = () => {
    const user = useContext(UserContext)
    console.log(user.user.username)
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
                        <Link to="/logout" className="cta">Logout</Link>
                    </nav>
                </header>
            </div>

            <main className={classes["main-container"]}>
                <div className={classes["main-sub-container"]}>
                    <div className={classes["profile-info-container"]}>
                        <div className={classes["user-image"]}></div>
                        <div>
                            <h2>{user.user.username}</h2>
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

                <div className={classes["content-container"]}>
                    {/* Example sections - you can add more as needed */}
                    <section className={classes["favorite-films"]}>
                        <h2>Favorite Films</h2>
                        <p>Don't forget to select your favorite films!</p>
                        <div className={classes["film-list"]}>
                            <div className={classes["film"]}></div>
                            <div className={classes["film"]}></div>
                            <div className={classes["film"]}></div>
                        </div>
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

            {/* <footer className={classes["profile-footer"]}>
            </footer> */}
        </div>
    );
};

export default Profile;
