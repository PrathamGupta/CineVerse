import React, { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    const addFavorite = movie => {
        setFavorites(currentFavorites => {
            // Avoid adding duplicates
            const isExisting = currentFavorites.some(fav => fav.id === movie.id);
            if (!isExisting) {
                return [...currentFavorites, movie];
            }
            return currentFavorites;
        });
    };

    const removeFavorite = movieId => {
        setFavorites(currentFavorites =>
            currentFavorites.filter(movie => movie.id !== movieId)
        );
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};
