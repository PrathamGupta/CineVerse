import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserContext = React.createContext(null);

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();

    // Initialize user state from local storage
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Whenever the user changes, update the local storage
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setUser(null);  // This will also trigger useEffect to remove 'user' from localStorage
        navigate('/');  // Navigate to the home page
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
