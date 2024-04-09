import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../userContext';
import './SignIn.css'; // Your styles here
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
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            setUser({ username: data.username });
            // Handle login success, store the token, etc.
            // Redirect to a new route after login
            navigate('/profile')
        } else {
            const data = await response.json();
            setErrorMessage(data.message || 'Invalid username/password');
            console.log(data.message);
            // Handle errors, show an error message, etc.
        }
    };
    return (
        <div>
            <div className="logo-signIn">CINEVERSE</div>
            <div className="subtitle">Sign In</div>
            <div className="signin-container">
                {/* Display error message if it exists */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
                <form onSubmit= {handleSubmit} className="signin-form" method="post">
                    <label htmlFor="username">Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" id="username" name="username" />
                    <label htmlFor="password">Password </label>
                        {/* <a href="#" className="forgot-password-link">Forgot your password?</a> */}
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" id="password" name="password" />
                    <div className="checkbox-container">
                        <input type="checkbox" id="keep-signed-in" />
                        <label htmlFor="keep-signed-in">Keep me signed in</label>
                    </div>

                    <button className="signup-button" type="submit">Sign In</button>
                    <div className="terms">
                        By creating an account, you agree to the Cineverse Terms of Service and Privacy Policy
                    </div>
                </form>
            </div>

            <p className="footer">
                <Link to="#">Terms of Service</Link> | <Link to="#">Privacy</Link> | <Link to="#">Help</Link>
            </p>
            <p className="footer">
                © 2024 Cineverse, Inc.
            </p>
        </div>
    );
};

export default SignIn;
