import React, { createContext, useContext, useState } from 'react';

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
    const [selectedMovie, setSelectedMovie] = useState(null);

    const addSelectedMovie = (movie) => {
        setSelectedMovie(movie);
    };

    const clearSelectedMovie = () => {
        setSelectedMovie(null);
    };

    return (
        <MovieContext.Provider value={{ selectedMovie, addSelectedMovie, clearSelectedMovie }}>
            {children}
        </MovieContext.Provider>
    );
};

export const useMovie = () => useContext(MovieContext);