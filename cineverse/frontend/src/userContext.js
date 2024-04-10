import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserContext = React.createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const logout = () => {
        setUser(null);
        navigate('/');  // Navigate to the home page
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
