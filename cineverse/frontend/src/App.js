import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './userContext'; // Import UserProvider
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/profile';

function App() {
  return (
    <Router>
      <UserProvider> {/* Use UserProvider instead of UserContext.Provider */}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} /> {/* Fix: Use element instead of Component */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
