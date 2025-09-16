import React, { useState, useEffect } from 'react';

function FavoriteButton({ plantName }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(favorites.includes(plantName));
  }, [plantName]);

  const toggleFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.includes(plantName)) {
      favorites = favorites.filter(fav => fav !== plantName);
      setIsFavorite(false);
    } else {
      favorites.push(plantName);
      setIsFavorite(true);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  return (
    <button
      className={`fav-btn ${isFavorite ? 'active' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite();
      }}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      ❤
    </button>
  );
}

export default FavoriteButton;