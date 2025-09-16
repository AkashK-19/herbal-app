import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/plantDetails.css';

function PlantDetails() {
  const { plantId } = useParams();
  const navigate = useNavigate();

  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('medicinal');

  // Mock data for plants 
  const mockPlantsData = {
    1: {
      id: 1,
      title: 'Tulsi',
      scientific: 'Ocimum sanctum',
      category: 'Sacred Herb',
      description: 'Tulsi, also known as Holy Basil, is considered the most sacred plant in Hindu tradition. This aromatic herb has been revered for over 3,000 years for its remarkable healing properties and spiritual significance.',
      region: 'India, Southeast Asia',
      season: 'Spring, Summer, Monsoon',
      plantType: 'Perennial Herb',
      healthBenefits: ['Immunity booster', 'Anti-stress', 'Respiratory health', 'Anti-inflammatory'],
      images: [
        { src: '/api/placeholder/500/400', alt: 'Fresh Tulsi leaves' },
        { src: '/api/placeholder/500/400', alt: 'Tulsi plant in garden' },
        { src: '/api/placeholder/500/400', alt: 'Tulsi flowers' }
      ],
      medicinalUses: [
        {
          icon: 'fas fa-shield-alt',
          title: 'Immune System Booster',
          description: 'Rich in antioxidants and essential oils that strengthen the body\'s natural defense mechanisms.'
        },
        {
          icon: 'fas fa-brain',
          title: 'Stress & Anxiety Relief',
          description: 'Acts as an adaptogen, helping the body cope with physical and mental stress naturally.'
        },
        {
          icon: 'fas fa-lungs',
          title: 'Respiratory Health',
          description: 'Effective in treating coughs, colds, bronchitis, and other respiratory ailments.'
        },
        {
          icon: 'fas fa-heart',
          title: 'Cardiovascular Support',
          description: 'Helps regulate blood pressure and cholesterol levels for better heart health.'
        }
      ],
      ayurvedicProperties: {
        rasa: 'Pungent, Bitter',
        virya: 'Hot',
        vipaka: 'Pungent',
        dosha: 'Balances Kapha and Vata'
      },
      growingSteps: [
        {
          title: 'Seed Preparation',
          description: 'Soak seeds in lukewarm water for 12-24 hours to improve germination rates.',
          tips: 'Use filtered water for best results',
          icon: 'fas fa-seedling'
        },
        {
          title: 'Soil Preparation',
          description: 'Prepare well-draining soil with pH 6.0-7.5. Mix compost for rich nutrients.',
          tips: 'Avoid waterlogged soil to prevent root rot',
          icon: 'fas fa-mountain'
        },
        {
          title: 'Planting',
          description: 'Sow seeds 1/4 inch deep in seed trays or directly in garden beds.',
          tips: 'Space plants 12-18 inches apart for proper growth',
          icon: 'fas fa-hand-holding-heart'
        },
        {
          title: 'Care & Maintenance',
          description: 'Water regularly but avoid overwatering. Provide 6-8 hours of sunlight daily.',
          tips: 'Pinch flowers to encourage leaf growth',
          icon: 'fas fa-leaf'
        }
      ],
      traditionalUses: [
        'Preparation of herbal teas for daily wellness',
        'Religious ceremonies and worship rituals',
        'Natural remedy for fever and common cold',
        'Ayurvedic formulations for respiratory health',
        'Essential oil extraction for aromatherapy'
      ],
      seasonalCare: {
        spring: ['Start new plantings', 'Prepare soil', 'Begin regular watering'],
        summer: ['Provide shade during extreme heat', 'Increase watering frequency', 'Harvest leaves regularly'],
        monsoon: ['Ensure proper drainage', 'Watch for fungal diseases', 'Reduce watering'],
        winter: ['Protect from frost', 'Reduce watering', 'Prune dead branches']
      },
      quickFacts: {
        family: 'Lamiaceae',
        nativeRegion: 'Indian Subcontinent',
        lifespan: '2-3 years',
        harvestTime: '60-90 days',
        sunRequirement: 'Full sun to partial shade',
        waterNeeds: 'Moderate',
        soilType: 'Well-draining, fertile soil',
        propagation: 'Seeds, Cuttings'
      }
    },
    2: {
      id: 2,
      title: 'Turmeric',
      scientific: 'Curcuma longa',
      category: 'Root Spice',
      description: 'Turmeric is a golden-yellow rhizome that has been used for over 4,000 years in traditional medicine. Known as the "Golden Spice of Life," it contains powerful anti-inflammatory compounds.',
      region: 'India, Southeast Asia, Central America',
      season: 'Summer, Monsoon',
      plantType: 'Rhizomatous Perennial',
      healthBenefits: ['Anti-inflammatory', 'Antioxidant', 'Digestive aid', 'Wound healing'],
      images: [
        { src: '/api/placeholder/500/400', alt: 'Fresh turmeric roots' },
        { src: '/api/placeholder/500/400', alt: 'Turmeric plant' },
        { src: '/api/placeholder/500/400', alt: 'Turmeric powder' }
      ],
      medicinalUses: [
        {
          icon: 'fas fa-fire',
          title: 'Anti-inflammatory Power',
          description: 'Contains curcumin, a powerful compound that reduces inflammation throughout the body.'
        },
        {
          icon: 'fas fa-shield-virus',
          title: 'Antioxidant Protection',
          description: 'Neutralizes free radicals and boosts the body\'s own antioxidant enzymes.'
        },
        {
          icon: 'fas fa-stomach',
          title: 'Digestive Health',
          description: 'Stimulates bile production and supports healthy digestion and metabolism.'
        },
        {
          icon: 'fas fa-band-aid',
          title: 'Wound Healing',
          description: 'Promotes faster healing of cuts, burns, and other skin conditions.'
        }
      ],
      ayurvedicProperties: {
        rasa: 'Bitter, Pungent',
        virya: 'Hot',
        vipaka: 'Pungent',
        dosha: 'Balances all three doshas'
      },
      growingSteps: [
        {
          title: 'Rhizome Selection',
          description: 'Choose healthy, disease-free rhizomes with visible growth buds.',
          tips: 'Soak rhizomes overnight before planting',
          icon: 'fas fa-seedling'
        },
        {
          title: 'Soil Preparation',
          description: 'Prepare loose, well-draining soil rich in organic matter with pH 6.0-7.5.',
          tips: 'Add compost and ensure good drainage',
          icon: 'fas fa-mountain'
        },
        {
          title: 'Planting Process',
          description: 'Plant rhizomes 2 inches deep with buds facing up, spacing 12 inches apart.',
          tips: 'Plant after last frost in warm weather',
          icon: 'fas fa-hand-holding-heart'
        },
        {
          title: 'Growth Care',
          description: 'Maintain consistent moisture and provide filtered sunlight for 8-10 months.',
          tips: 'Harvest when leaves turn yellow and dry',
          icon: 'fas fa-leaf'
        }
      ],
      traditionalUses: [
        'Culinary spice in curries and traditional dishes',
        'Natural food coloring and preservative',
        'Traditional medicine for inflammation and pain',
        'Cosmetic applications for skin health',
        'Religious and ceremonial purposes'
      ],
      seasonalCare: {
        spring: ['Plant rhizomes', 'Prepare growing beds', 'Begin watering schedule'],
        summer: ['Maintain consistent moisture', 'Provide partial shade', 'Monitor growth'],
        monsoon: ['Ensure drainage', 'Watch for waterlogging', 'Support tall stems'],
        winter: ['Reduce watering', 'Prepare for harvest', 'Cure harvested rhizomes']
      },
      quickFacts: {
        family: 'Zingiberaceae',
        nativeRegion: 'Southeast Asia',
        lifespan: '8-12 months',
        harvestTime: '8-10 months',
        sunRequirement: 'Partial shade',
        waterNeeds: 'High during growing season',
        soilType: 'Rich, well-draining loam',
        propagation: 'Rhizome division'
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Simulate API call with setTimeout
    setTimeout(() => {
      const plantData = mockPlantsData[plantId];
      if (plantData) {
        setPlant(plantData);
        setCurrentSlide(0);
        setLoading(false);
      } else {
        setError('Plant not found');
        setLoading(false);
      }
    }, 1000);
  }, [plantId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading plant details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>Plant Not Found</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/plants')}>
            Back to Plants
          </button>
        </div>
      </div>
    );
  }

  if (!plant) {
    return null;
  }

  // Slider controls
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % plant.images.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + plant.images.length) % plant.images.length);
  };
  
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="plant-details-page">
      <div className="sp"></div>
      <main className="main">
        <div className="container">
          {/* Back Button */}
          <button
            onClick={() => navigate('/plants')}
            className="btn btn-secondary back-btn"
            aria-label="Back to plants list"
          >
            <i className="fas fa-arrow-left"></i> Back to Plants
          </button>

          {/* Plant Hero Section */}
          <section className="plant-hero">
            <div className="hero-content">
              <div className="hero-text">
                <div className="plant-category-badge">
                  <span>{plant.category}</span>
                </div>
                <h1 className="plant-title">{plant.title}</h1>
                <p className="plant-scientific"><em>{plant.scientific}</em></p>
                <p className="plant-description">{plant.description}</p>
                
                {/* Quick Info */}
                <div className="quick-info-pills">
                  <div className="info-pill">
                    <i className="fas fa-globe"></i>
                    <span>{plant.region}</span>
                  </div>
                  <div className="info-pill">
                    <i className="fas fa-calendar"></i>
                    <span>{plant.season}</span>
                  </div>
                  <div className="info-pill">
                    <i className="fas fa-leaf"></i>
                    <span>{plant.plantType}</span>
                  </div>
                </div>
              </div>

              <div className="hero-image">
                <div className="image-slider">
                  <div className="slider-container">
                    {plant.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`slide${idx === currentSlide ? ' active' : ''}`}
                      >
                        <img src={img.src} alt={img.alt} loading="lazy" />
                      </div>
                    ))}
                    {plant.images.length > 1 && (
                      <>
                        <button
                          className="slider-btn prev"
                          aria-label="Previous image"
                          onClick={prevSlide}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                        <button
                          className="slider-btn next"
                          aria-label="Next image"
                          onClick={nextSlide}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </>
                    )}
                  </div>
                  {plant.images.length > 1 && (
                    <div className="slider-indicators">
                      {plant.images.map((_, idx) => (
                        <button
                          key={idx}
                          className={`indicator${idx === currentSlide ? ' active' : ''}`}
                          aria-label={`View image ${idx + 1}`}
                          onClick={() => goToSlide(idx)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Quick Facts Section */}
          <section className="quick-facts">
            <div className="facts-container">
              <h2>
                <i className="fas fa-info-circle"></i>
                Quick Facts
              </h2>
              <div className="facts-grid">
                {Object.entries(plant.quickFacts).map(([key, value]) => (
                  <div key={key} className="fact-item">
                    <div className="fact-icon">
                      <i className={getFactIcon(key)}></i>
                    </div>
                    <div className="fact-content">
                      <h4>{formatFactKey(key)}</h4>
                      <p>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Health Benefits */}
          <section className="health-benefits-section">
            <h2>
              Key Health Benefits
            </h2>
            <div className="benefits-pills">
              {plant.healthBenefits.map((benefit, idx) => (
                <div key={idx} className="benefit-pill">
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Tabbed Information Section */}
          <section className="plant-info">
            <div className="info-card">
              <div className="tabs-container">
                <div className="tabs">
                  <button
                    className={`tab ${activeTab === 'medicinal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('medicinal')}
                  >
                    Medicinal Uses
                  </button>
                  <button 
                    className={`tab ${activeTab === 'growing' ? 'active' : ''}`}
                    onClick={() => setActiveTab('growing')}
                  >
                    Growing Guide
                  </button>
                  <button
                    className={`tab ${activeTab === 'ayurvedic' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ayurvedic')}
                  >
                    Ayurvedic Properties
                  </button>
                  <button
                    className={`tab ${activeTab === 'traditional' ? 'active' : ''}`}
                    onClick={() => setActiveTab('traditional')}
                  >
                    Traditional Uses
                  </button>
                </div>

                {/* Medicinal Uses Tab */}
                {activeTab === 'medicinal' && (
                  <div className="tab-content active">
                    <div className="tab-header">
                      <h2>Therapeutic Uses & Benefits</h2>
                      <p>
                        Discover the amazing healing properties of {plant.title} that have made it a cornerstone of natural medicine.
                      </p>
                    </div>
                    <div className="benefits-grid">
                      {plant.medicinalUses.map((benefit, idx) => (
                        <div key={idx} className="benefit-card">
                          <div className="benefit-icon">
                            <i className={benefit.icon}></i>
                          </div>
                          <h3>{benefit.title}</h3>
                          <p>{benefit.description}</p>
                        </div>
                      ))}
                    </div>
                    <div className="usage-warning">
                      <i className="fas fa-exclamation-triangle"></i>
                      <p>
                        <strong>Important:</strong> This information is for educational purposes only. 
                        Always consult with a healthcare professional before using medicinal plants for treatment.
                      </p>
                    </div>
                  </div>
                )}

                {/* Growing Guide Tab */}
                {activeTab === 'growing' && (
                  <div className="tab-content active">
                    <div className="tab-header">
                      <h2>Complete Growing Guide</h2>
                      <p>Learn how to successfully grow {plant.title} in your garden or home.</p>
                    </div>
                    <div className="growing-steps">
                      {plant.growingSteps.map((step, idx) => (
                        <div key={idx} className="step">
                          <div className="step-number">{idx + 1}</div>
                          <div className="step-content">
                            <h3>
                              <i className={step.icon}></i>
                              {step.title}
                            </h3>
                            <p>{step.description}</p>
                            <div className="step-tips">
                              <strong>Pro Tip:</strong> {step.tips}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="care-calendar">
                      <h3>
                        <i className="fas fa-calendar-alt"></i>
                        Seasonal Care Calendar
                      </h3>
                      <div className="seasons-grid">
                        {Object.entries(plant.seasonalCare).map(([season, tasks]) => (
                          <div key={season} className={`season-card ${season}`}>
                            <h4>
                              <i className={getSeasonIcon(season)}></i>
                              {season.charAt(0).toUpperCase() + season.slice(1)}
                            </h4>
                            <ul>
                              {tasks.map((task, idx) => (
                                <li key={idx}>{task}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Ayurvedic Properties Tab */}
                {activeTab === 'ayurvedic' && (
                  <div className="tab-content active">
                    <div className="tab-header">
                      <h2>Ayurvedic Properties</h2>
                      <p>Understanding {plant.title} through the ancient wisdom of Ayurveda.</p>
                    </div>
                    <div className="ayurvedic-grid">
                      {Object.entries(plant.ayurvedicProperties).map(([property, value]) => (
                        <div key={property} className="property-card">
                          <div className="property-icon">
                            <i className={getAyurvedicIcon(property)}></i>
                          </div>
                          <h3>{formatAyurvedicProperty(property)}</h3>
                          <div className="property-value">{value}</div>
                          <p>{getAyurvedicDescription(property)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="ayurvedic-warning">
                      <i className="fas fa-info-circle"></i>
                      <p>
                        Ayurvedic properties are based on traditional knowledge systems. 
                        Individual constitution and current health status should be considered before use.
                      </p>
                    </div>
                  </div>
                )}

                {/* Traditional Uses Tab */}
                {activeTab === 'traditional' && (
                  <div className="tab-content active">
                    <div className="tab-header">
                      <h2>Traditional Applications</h2>
                      <p>Explore how {plant.title} has been traditionally used across cultures and generations.</p>
                    </div>
                    <div className="traditional-uses">
                      <h3>
                        <i className="fas fa-history"></i>
                        Historical Uses
                      </h3>
                      <div className="uses-list">
                        {plant.traditionalUses.map((use, idx) => (
                          <div key={idx} className="use-item">
                            <i className="fas fa-leaf"></i>
                            <span>{use}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Back to Top Button */}
      <button
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </div>
  );
}

// Helper functions
function getFactIcon(key) {
  const icons = {
    family: 'fas fa-sitemap',
    nativeRegion: 'fas fa-map-marker-alt',
    lifespan: 'fas fa-clock',
    harvestTime: 'fas fa-calendar-check',
    sunRequirement: 'fas fa-sun',
    waterNeeds: 'fas fa-tint',
    soilType: 'fas fa-mountain',
    propagation: 'fas fa-seedling'
  };
  return icons[key] || 'fas fa-info';
}

function formatFactKey(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

function getSeasonIcon(season) {
  const icons = {
    spring: 'fas fa-seedling',
    summer: 'fas fa-sun',
    monsoon: 'fas fa-cloud-rain',
    winter: 'fas fa-snowflake'
  };
  return icons[season] || 'fas fa-calendar';
}

function getAyurvedicIcon(property) {
  const icons = {
    rasa: 'fas fa-tongue',
    virya: 'fas fa-thermometer-half',
    vipaka: 'fas fa-stomach',
    dosha: 'fas fa-balance-scale'
  };
  return icons[property] || 'fas fa-om';
}

function formatAyurvedicProperty(property) {
  const labels = {
    rasa: 'Rasa (Taste)',
    virya: 'Virya (Potency)',
    vipaka: 'Vipaka (Post-digestive effect)',
    dosha: 'Dosha Effect'
  };
  return labels[property] || property;
}

function getAyurvedicDescription(property) {
  const descriptions = {
    rasa: 'The immediate taste experienced on the tongue',
    virya: 'The heating or cooling effect on the body',
    vipaka: 'The taste that emerges after digestion',
    dosha: 'Effect on the three constitutional types'
  };
  return descriptions[property] || '';
}

export default PlantDetails;