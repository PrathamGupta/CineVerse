import React,{ useEffect }  from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import duneImage from './images/dune1.jpg';

const Home = () => {
    useEffect(() => {
        // When the component mounts, add styles to the body
        const originalStyle = document.body.style.cssText;
        document.body.style.cssText = `
            background-image: url('${duneImage}'), 
            linear-gradient(90deg,#14181d 0,rgba(20,24,29,.986) .97%,rgba(20,24,29,.945) 2.07833333%,rgba(20,24,29,.883) 3.29666667%,rgba(20,24,29,.803) 4.60166667%,rgba(20,24,29,.711) 5.96666667%,rgba(20,24,29,.61) 7.365%,rgba(20,24,29,.504) 8.77166667%,rgba(20,24,29,.398) 10.16%,rgba(20,24,29,.296) 11.505%,rgba(20,24,29,.203) 12.78%,rgba(20,24,29,.122) 13.95833333%,rgba(20,24,29,.059) 15.01666667%,rgba(20,24,29,.016) 15.92833333%,rgba(20,24,29,0) 16.66666667%,rgba(20,24,29,0) 83.33333333%,rgba(20,24,29,.016) 84.07166667%,rgba(20,24,29,.059) 84.98333333%,rgba(20,24,29,.122) 86.04166667%,rgba(20,24,29,.203) 87.22%,rgba(20,24,29,.296) 88.495%,rgba(20,24,29,.398) 89.84%,rgba(20,24,29,.504) 91.22833333%,rgba(20,24,29,.61) 92.635%,rgba(20,24,29,.711) 94.03333333%,rgba(20,24,29,.803) 95.39833333%,rgba(20,24,29,.883) 96.70333333%,rgba(20,24,29,.945) 97.92166667%,rgba(20,24,29,.986) 99.03%,#14181d),linear-gradient(0deg,#14181d 0,#14181d 21.48148148%,rgba(20,24,29,.986) 23.63703704%,rgba(20,24,29,.945) 26.1%,rgba(20,24,29,.883) 28.80740741%,rgba(20,24,29,.803) 31.70740741%,rgba(20,24,29,.711) 34.74074074%,rgba(20,24,29,.61) 37.84814815%,rgba(20,24,29,.504) 40.97407407%,rgba(20,24,29,.398) 44.05925926%,rgba(20,24,29,.296) 47.04814815%,rgba(20,24,29,.203) 49.88148148%,rgba(20,24,29,.122) 52.5%,rgba(20,24,29,.059) 54.85185185%,rgba(20,24,29,.016) 56.87777778%,rgba(20,24,29,0) 58.51851852%);
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            background-attachment: fixed;
        `;
    
        // When the component unmounts, revert back to the original styles
        return () => {
            document.body.style.cssText = originalStyle;
        };
    }, []);
    return (
        <div className="container">
            <header>
                <div className="logo">CineVerse</div>
                <nav>
                    <Link to="/signin">Sign In</Link>
                    <a href="#">Films</a>
                    <a href="#">Lists</a>
                    <a href="#">Members</a>
                    <a href="#">Journal</a>
                    <Link to="/signup" className="cta">Create Account</Link>
                </nav>
            </header>
            <main>
            <div class="hero">
            <section>
                <h2 className="fonter">Watched Something? Let's talk about it.</h2>
                <p className="fontie"> Explore a world of movies,<br /> rate and review your favorites,<br /> and join discussions with other movie enthusiasts.
                </p>
                </section>
              
                
                <Link to="/signin" className="create-account-link flat-button -uppercase -action -large cboxElement"> Watch Now</Link>
                <Link to="/signup" className="create-account-link flat-button -uppercase -action -large cboxElement">Join Us</Link>
            </div>
            </main>
            <footer>
                <p>&copy; 2024 CineVerse. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
