// Plants.jsx 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantCard from '../components/PlantCard';
import '../styles/plants.css';

function Plants() {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('alphabetical');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    region: '',
    season: '',
    plantType: '',
    healthBenefit: ''
  });
  const plantsPerPage = 50;
  const navigate = useNavigate();

  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    seasons: [],
    plantTypes: [],
    healthBenefits: []
  });

  useEffect(() => {
    setLoading(true);

    // mock plants
    const mockPlants = [
      {
        id: 1,
        common_name: 'Tulsi',
        scientific_name: 'Ocimum sanctum',
        region: 'India, Southeast Asia',
        season: 'Spring, Summer, Monsoon',
        plant_type: 'Herb',
        health_benefits: 'Immunity booster, Anti-stress, Respiratory health, Anti-inflammatory',
        description: 'Sacred basil, revered in Hindu tradition for its medicinal properties',
        uses: 'Tea preparation, Religious ceremonies, Traditional medicine',
        image: '/assets/tulsi.jpg'
      },
      {
        id: 2,
        common_name: 'Turmeric',
        scientific_name: 'Curcuma longa',
        region: 'India, Southeast Asia, Central America',
        season: 'Summer, Monsoon',
        plant_type: 'Rhizomatous Perennial',
        health_benefits: 'Anti-inflammatory, Antioxidant, Digestive aid, Wound healing',
        description: 'Golden-yellow rhizome used for powerful anti-inflammatory properties',
        uses: 'Culinary spice, Traditional medicine',
        image: '/assets/turmeric.jpg'
      },
      {
        id: 3,
        common_name: 'Aloe Vera',
        scientific_name: 'Aloe barbadensis miller',
        region: 'Tropical regions',
        season: 'Year-round',
        plant_type: 'Succulent',
        health_benefits: 'Skin healing, Digestive aid',
        description: 'A succulent plant species known for its thick, fleshy leaves containing healing gel.',
        uses: 'Skin care, Internal consumption',
        image: '/assets/aloe-vera.jpg'
      },
      {
        id: 4,
        common_name: 'Lavender',
        scientific_name: 'Lavandula angustifolia',
        region: 'Mediterranean',
        season: 'Summer',
        plant_type: 'Herb',
        health_benefits: 'Calming, Sleep aid',
        description: 'An aromatic flowering plant in the mint family, prized for its fragrance and calming properties.',
        uses: 'Aromatherapy, Tea',
        image: '/assets/lavender.avif'
      },
      {
        id: 5,
        common_name: 'Peppermint',
        scientific_name: 'Mentha × piperita',
        region: 'Europe, North America',
        season: 'Spring, Summer',
        plant_type: 'Herb',
        health_benefits: 'Digestive aid, Headache relief',
        description: 'A fast-growing aromatic herb with cooling properties, excellent for digestive health.',
        uses: 'Tea, Essential oil',
        image: '/assets/Peppermint.jpg'
      },
      {
        id: 6,
        common_name: 'German Chamomile',
        scientific_name: 'Matricaria chamomilla',
        region: 'Europe',
        season: 'Spring, Summer',
        plant_type: 'Herb',
        health_benefits: 'Calming, Anti-inflammatory',
        description: 'A gentle flowering herb with small daisy-like flowers, renowned for its calming properties.',
        uses: 'Tea, Skin care',
        image: '/assets/Chamomile.jpg'
      },
      {
        id: 7,
        common_name: 'Purple Coneflower',
        scientific_name: 'Echinacea purpurea',
        region: 'North America',
        season: 'Summer',
        plant_type: 'Perennial',
        health_benefits: 'Immune booster',
        description: 'A striking purple flowering plant native to North America, valued for immune system support.',
        uses: 'Supplements, Tea',
        image: '/assets/echinacae.jpg'
      }
    ];

    // TODO: Backend integration - Replace mock with API fetch
    // fetch('/api/plants').then(res => res.json()).then(data => {
    //   setPlants(data);
    //   // Extract filter options...
    // }).catch(err => setError(err));

  
      setPlants(mockPlants);
      setFilteredPlants(mockPlants);

      // Extract unique filter options 
      const regions = [...new Set(mockPlants.map(p => p.region).filter(Boolean))];
      const seasons = [...new Set(mockPlants.flatMap(p => p.season ? p.season.split(',').map(s => s.trim()) : []))];
      const plantTypes = [...new Set(mockPlants.map(p => p.plant_type).filter(Boolean))];
      const healthBenefits = [...new Set(mockPlants.flatMap(p => p.health_benefits ? p.health_benefits.split(',').map(b => b.trim()) : []))];

      setFilterOptions({
        regions: regions.sort(),
        seasons: seasons.sort(),
        plantTypes: plantTypes.sort(),
        healthBenefits: healthBenefits.sort()
      });

      setLoading(false);

  }, []);

  useEffect(() => {
    let filtered = [...plants];

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(plant => {
        const fields = [
          plant.common_name,
          plant.scientific_name,
          plant.region,
          plant.season,
          plant.plant_type,
          plant.health_benefits,
          plant.description,
          plant.uses
        ];
        return fields.some(field => field && field.toLowerCase().includes(term));
      });
    }

    if (filters.region) {
      filtered = filtered.filter(p => p.region && p.region.toLowerCase().includes(filters.region.toLowerCase()));
    }
    if (filters.season) {
      filtered = filtered.filter(p => p.season && p.season.toLowerCase().includes(filters.season.toLowerCase()));
    }
    if (filters.plantType) {
      filtered = filtered.filter(p => p.plant_type && p.plant_type.toLowerCase().includes(filters.plantType.toLowerCase()));
    }
    if (filters.healthBenefit) {
      filtered = filtered.filter(p => p.health_benefits && p.health_benefits.toLowerCase().includes(filters.healthBenefit.toLowerCase()));
    }

    switch (sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => (a.common_name || '').localeCompare(b.common_name || ''));
        break;
      case 'scientific':
        filtered.sort((a, b) => (a.scientific_name || '').localeCompare(b.scientific_name || ''));
        break;
      case 'region':
        filtered.sort((a, b) => (a.region || '').localeCompare(b.region || ''));
        break;
      default:
        break;
    }

    setFilteredPlants(filtered);
    setCurrentPage(1);
  }, [searchTerm, filters, sortBy, plants]);

  const totalPages = Math.ceil(filteredPlants.length / plantsPerPage);
  const paginatedPlants = filteredPlants.slice(
    (currentPage - 1) * plantsPerPage,
    currentPage * plantsPerPage
  );

  const goToDetails = (id) => {
    navigate(`/plants/${id}`);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({
      region: '',
      season: '',
      plantType: '',
      healthBenefit: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  if (loading) return <div>Loading plants...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="plants-page">
      <div className="hero-search">
        <div className="hero-overlay"></div>
        <div className="search-container">
          <h1>Discover Medicinal Plants</h1>
          <div className="search-box">
            <input
              type="search"
              placeholder="Search by plant name, scientific name, benefits, or uses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn" aria-label="Search">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="regionFilter">Region:</label>
            <select
              id="regionFilter"
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
            >
              <option value="">All Regions</option>
              {filterOptions.regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="seasonFilter">Season:</label>
            <select
              id="seasonFilter"
              value={filters.season}
              onChange={(e) => handleFilterChange('season', e.target.value)}
            >
              <option value="">All Seasons</option>
              {filterOptions.seasons.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="plantTypeFilter">Plant Type:</label>
            <select
              id="plantTypeFilter"
              value={filters.plantType}
              onChange={(e) => handleFilterChange('plantType', e.target.value)}
            >
              <option value="">All Types</option>
              {filterOptions.plantTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="healthBenefitFilter">Health Benefit:</label>
            <select
              id="healthBenefitFilter"
              value={filters.healthBenefit}
              onChange={(e) => handleFilterChange('healthBenefit', e.target.value)}
            >
              <option value="">All Benefits</option>
              {filterOptions.healthBenefits.map(benefit => (
                <option key={benefit} value={benefit}>{benefit}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      <div className="plants-header">
        <h2>
          Browse Plants <span className="plant-count">({filteredPlants.length} plants)</span>
        </h2>

        <div className="sort-options">
          <label htmlFor="sortSelect">Sort by:</label>
          <select
            id="sortSelect"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="alphabetical">Common Name (A-Z)</option>
            <option value="scientific">Scientific Name (A-Z)</option>
            <option value="region">Region (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="plant-grid">
        {paginatedPlants.length === 0 ? (
          <div className="no-results">
            <h3>🌱 No plants found</h3>
            <p>Try adjusting your search criteria or filters to discover more plants.</p>
          </div>
        ) : (
          paginatedPlants.map(plant => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onClick={() => goToDetails(plant.id)}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn prev-btn"
            aria-label="Previous page"
          >
            ‹
          </button>

          <div className="page-numbers">
            {[...Array(Math.min(totalPages, 10))].map((_, i) => {
              let pageNum;
              if (totalPages <= 10) {
                pageNum = i + 1;
              } else {
                const start = Math.max(1, currentPage - 4);
                const end = Math.min(totalPages, start + 9);
                pageNum = start + i;
                if (pageNum > end) return null;
              }
              return (
                <button
                  key={pageNum}
                  className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                  aria-label={`Page ${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn next-btn"
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default Plants;