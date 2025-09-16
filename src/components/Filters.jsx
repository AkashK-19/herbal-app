import React from 'react';
import '../styles/filters.css'; // Move filter styles here

function Filters({ filters, filterOptions, handleFilterChange, clearFilters, hasActiveFilters }) {
  return (
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
  );
}

export default Filters;