import React, { useState } from 'react';
import classes from './SignIn.module.css';
import { Link } from 'react-router-dom';
import UserContext from '../userContext';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

const SignIn = () => {
    const { setUser } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        
        const response = await fetch('http://localhost:8000/accounts/login/', {
            method: 'POST',
            body: formData,
            // credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            setUser({ username: data.username });
            // Handle login success, store the token, etc.
            // Redirect to a new route after login
            navigate('/feed')
        } else {
            const data = await response.json();
            setErrorMessage(data.message || 'Invalid username/password');
            console.log(data.message);
            // Handle errors, show an error message, etc.
        }
    };
    return (
        <div className={classes.mainContainer}>
            <div className={classes["logo-signIn"]}>CINEVERSE</div>
            <div className={classes["subtitle"]}>Sign In</div>
            <div className={classes["signin-container"]}>
                {/* Display error message if it exists */}
            {errorMessage && <div className={classes["error-message"]}>{errorMessage}</div>}
                <form onSubmit= {handleSubmit} className={classes["signin-form"]} method="post">
                    <label htmlFor="username">Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" id="username" name="username" />
                    <label htmlFor="password">Password </label>
                        {/* <a href="#" className="forgot-password-link">Forgot your password?</a> */}
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" id="password" name="password" />
                    <div className={classes["checkbox-container"]}>
                        <input type="checkbox" id="keep-signed-in" />
                        <label htmlFor="keep-signed-in">Keep me signed in</label>
                    </div>

                    <button className={classes["signup-button"]} type="submit">Sign In</button>
                    <div className={classes["terms"]}>
                        By creating an account, you agree to the Cineverse Terms of Service and Privacy Policy
                    </div>
                </form>
            </div>

            <p className={classes["footer"]}>
                <Link to="#">Terms of Service</Link> | <Link to="#">Privacy</Link> | <Link to="#">Help</Link>
            </p>
            <p className={classes["footer"]}>
                © 2024 Cineverse, Inc.
            </p>
        </div>
    );
};

export default SignIn;
