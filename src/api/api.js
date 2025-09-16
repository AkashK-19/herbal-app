// src/api/api.js

const API_BASE_URL = 'http://your-backend-url.com/api'; // Replace with your actual backend URL

export async function fetchPlantById(plantId) {
  const response = await fetch(`${API_BASE_URL}/plants/${plantId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch plant data');
  }
  return response.json();
}

/**
 * Mock data for plants list (temporary until backend is ready)
 */
const mockPlants = [
  {
    id: '1',
    name: 'Aloe Vera',
    scientific: 'Aloe barbadensis',
    description: 'Aloe Vera is a succulent plant species known for its medicinal properties.',
    image: '/assets/images/aloe-vera.jpg', // Place this image in public/assets/images/
    season: ['summer', 'spring'],
    region: ['tropical'],
    type: ['succulent', 'herb'],
    benefits: ['skin', 'digestive', 'calming'],
    popularity: 85,
    rarity: 'common',
    growthRate: 'fast',
  },
  // Add more mock plants here if needed
];

/**
 * Fetch list of plants (mock implementation)
 * Replace with real API call when backend is ready.
 */
export async function fetchPlants() {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPlants);
    }, 500);
  });

  // Uncomment below to use real backend when ready:
  /*
  const response = await fetch(`${API_BASE_URL}/plants`);
  if (!response.ok) {
    throw new Error('Failed to fetch plants list');
  }
  return response.json();
  */
}