import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './userContext'; // Import UserProvider
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/profile';
import Feed from './components/Feed';
import AddMovie from './components/AddMovie';
import { FavoritesProvider } from './components/FavoritesContext';
import MovieDetail from './components/MovieDetail'; 

function App() {
  return (
    <Router>
      <UserProvider> {/* UserProvider provides user context to all routes */}
        <FavoritesProvider> {/* FavoritesProvider provides favorites context to all routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/add-movie" element={<AddMovie />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
          </Routes>
        </FavoritesProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
