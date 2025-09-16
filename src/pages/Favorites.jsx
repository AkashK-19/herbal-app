// Favorites.jsx 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import PlantCard from '../components/PlantCard';
import '../styles/favorites.css';

const allPlants = {
  "Tulsi": {
    id: 1,
    image: '/assets/tulsi.jpg',
    common_name: 'Tulsi',
    scientific_name: 'Ocimum sanctum',
    description: 'Sacred basil, revered in Hindu tradition for its medicinal properties'
  },
  "Turmeric": {
    id: 2,
    image: '/assets/turmeric.jpg',
    common_name: 'Turmeric',
    scientific_name: 'Curcuma longa',
    description: 'Golden-yellow rhizome used for powerful anti-inflammatory properties'
  },
  "Aloe Vera": {
    id: 3,
    image: '/assets/aloe-vera.jpg',
    common_name: 'Aloe Vera',
    scientific_name: 'Aloe barbadensis miller',
    description: 'A succulent plant species known for its thick, fleshy leaves containing healing gel.'
  },
  "Lavender": {
    id: 4,
    image: '/assets/lavender.avif',
    common_name: 'Lavender',
    scientific_name: 'Lavandula angustifolia',
    description: 'An aromatic flowering plant in the mint family, prized for its fragrance and calming properties.'
  },
  "Peppermint": {
    id: 5,
    image: '/assets/Peppermint.jpg',
    common_name: 'Peppermint',
    scientific_name: 'Mentha × piperita',
    description: 'A fast-growing aromatic herb with cooling properties, excellent for digestive health.'
  },
  "German Chamomile": {
    id: 6,
    image: '/assets/Chamomile.jpg',
    common_name: 'German Chamomile',
    scientific_name: 'Matricaria chamomilla',
    description: 'A gentle flowering herb with small daisy-like flowers, renowned for its calming properties.'
  },
  "Purple Coneflower": {
    id: 7,
    image: '/assets/echinacae.jpg',
    common_name: 'Purple Coneflower',
    scientific_name: 'Echinacea purpurea',
    description: 'A striking purple flowering plant native to North America, valued for immune system support.'
  }
};

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(favs);
  }, []);

  if (favorites.length === 0) {
    return <span className='fav'><p> You have no favorite plants yet </p></span>;
  }

  return (
    <div className="favorites-page">
      <h2>Your Favorite Plants</h2>
      <div className="plant-grid">
        {favorites.map(name => {
          const plant = allPlants[name];
          if (!plant) return null;
          return (
            <PlantCard
              key={plant.id}
              plant={plant}
              onClick={() => navigate(`/plants/${plant.id}`)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Favorites;