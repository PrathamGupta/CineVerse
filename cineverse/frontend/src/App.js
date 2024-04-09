import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserContext from './userContext';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/profile';
// import Profile from './components/Profile';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/signin" Component={SignIn} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
