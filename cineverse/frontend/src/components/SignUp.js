import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classes from './SignUp.module.css'; // Your styles here
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('http://localhost:8000/accounts/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include CSRF token if needed
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password1: password1,
                password2: password2,
            }),
        });

        if (response.ok) {
            // Handle sign-up success
            navigate('/signin')
        } else {
            // Handle errors
        }
    };

    return (
        <div className = {classes.mainContainer}>
            <div className={classes["logo-sign"]}>CINEVERSE</div>
            <div className={classes["subtitle"]}>Create Account</div>
            <div className={classes["signup-container"]}>
                <form onSubmit= {handleSubmit} className="signup-form">
                    <label className={classes["form-label"]} htmlFor="name">Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} id="name" name="username" placeholder="Username" />
                    <label class="form-label" for="email">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="email" name="email" placeholder="Email" />
                    <label class="form-label" for="password">Password</label>
                    <input type="password" value={password1} onChange={(e) => setPassword1(e.target.value)} id="password" name="password1" placeholder="Password" />
                    <label class="form-label" for="confirm-password">Re-enter Password</label>
                    <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} id="confirm-password" name="password2" placeholder="Re-enter Password" />
                    <button className={classes["signup-button"]} type="submit">Create Account</button>
                </form>
                {/* <p className="or">OR</p> */}
                {/* ... social buttons */}
                <p className={classes["footer1"]}>
                    Already have an account? <Link to="/signin" className={classes["login-link"]}>Sign in</Link>
                </p>
                <div className={classes["terms"]}>
                    By creating an account, you agree to the Cineverse Terms of Service and Privacy Policy
                </div>
            </div>
            {/* <div> */}
                <p className={classes["footer"]}>
                    <Link to="#">Terms of Service</Link> | <Link to="#">Privacy</Link> | <Link to="#">Help</Link>
                </p>
                <p className={classes["footer"]}>© 2024 Cineverse, Inc.</p>
            {/* </div> */}
        </div>
    );
};

export default SignUp;
