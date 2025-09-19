import React from 'react';
import FavoriteButton from './FavoriteButton'; 
import '../styles/plants.css'; 
function PlantCard({ plant, onClick }) {
  return (
    <div
      className="plant-card" 
      style={{ position: 'relative' }} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick();
      }}
      aria-label={`View details for ${plant.common_name || plant.scientific_name}`}
    >
      <div className="plant-image">
        <div className="image-overlay"></div>
        <img
          src={plant.image || plant.image_url || '../assets/default-plant.jpg'}
          alt={plant.common_name || plant.scientific_name}
          loading="lazy"
          onError={(e) => {
            e.target.src = '../assets/default-plant.jpg';
          }}
        />
      </div>

      <div className="plant-content">
        <h3 className="plant-name">{plant.common_name || 'Unknown Plant'}</h3>
        <h4 className="plant-scientific">{plant.scientific_name || 'Scientific name unavailable'}</h4>
      </div>
      
      <div onClick={(e) => e.stopPropagation()}>
        <FavoriteButton plantName={plant.common_name} />
      </div>
      
    </div>
  );
}

export default PlantCard;