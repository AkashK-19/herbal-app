// Home.jsx 
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import FavoriteButton from '../components/FavoriteButton'; 
import '../styles/home.css'; 
import '../styles/plants.css'; 
import { LoadingContext } from '../context/LoadingContext'; // Adjust path if needed

// Mock data (unchanged)
const mockFeaturedPlants = [
  {
    id: 3, 
    common_name: 'Aloe Vera',
    scientific_name: 'Aloe barbadensis miller',
    description: 'A succulent plant species known for its thick, fleshy leaves containing healing gel.',
    image: '/assets/aloe-vera.jpg',
    region: 'Tropical regions',
    season: 'Year-round',
    plant_type: 'Succulent',
    health_benefits: 'Skin healing, Digestive aid'
  },
  {
    id: 4,
    common_name: 'Lavender',
    scientific_name: 'Lavandula angustifolia',
    description: 'An aromatic flowering plant in the mint family, prized for its fragrance and calming properties.',
    image: '/assets/lavender.avif',
    region: 'Mediterranean',
    season: 'Summer',
    plant_type: 'Herb',
    health_benefits: 'Calming, Sleep aid'
  },
  {
    id: 2, 
    common_name: 'Turmeric',
    scientific_name: 'Curcuma longa',
    description: 'A flowering plant whose rhizome is used as a spice and has powerful anti-inflammatory properties.',
    image: '/assets/turmeric.jpg',
    region: 'India, Southeast Asia, Central America',
    season: 'Summer, Monsoon',
    plant_type: 'Rhizomatous Perennial',
    health_benefits: 'Anti-inflammatory, Antioxidant, Digestive aid, Wound healing'
  },
  {
    id: 5,
    common_name: 'Peppermint',
    scientific_name: 'Mentha × piperita',
    description: 'A fast-growing aromatic herb with cooling properties, excellent for digestive health.',
    image: '/assets/Peppermint.jpg',
    region: 'Europe, North America',
    season: 'Spring, Summer',
    plant_type: 'Herb',
    health_benefits: 'Digestive aid, Headache relief'
  },
  {
    id: 6,
    common_name: 'German Chamomile',
    scientific_name: 'Matricaria chamomilla',
    description: 'A gentle flowering herb with small daisy-like flowers, renowned for its calming properties.',
    image: '/assets/Chamomile.jpg',
    region: 'Europe',
    season: 'Spring, Summer',
    plant_type: 'Herb',
    health_benefits: 'Calming, Anti-inflammatory'
  },
  {
    id: 7,
    common_name: 'Purple Coneflower',
    scientific_name: 'Echinacea purpurea',
    description: 'A striking purple flowering plant native to North America, valued for immune system support.',
    image: '/assets/echinacae.jpg',
    region: 'North America',
    season: 'Summer',
    plant_type: 'Perennial',
    health_benefits: 'Immune booster'
  }
];

// Mock data for subscription plans (unchanged)
const mockSubscriptionPlans = [
  {
    id: 1,
    title: 'Weekly',
    price: '₹49',
    period: '/week',
    features: ['Access to all plant info', 'Basic growing tips', 'Email support']
  },
  {
    id: 2,
    title: 'Monthly',
    price: '₹149',
    period: '/month',
    features: ['Everything in Weekly', 'Exclusive expert guides', 'Priority support']
  },
  {
    id: 3,
    title: 'Yearly',
    price: '₹1499',
    period: '/year',
    features: ['Everything in Monthly', '1-on-1 plant consultation', 'Save 30% annually']
  }
];

// Mock sample reviews (unchanged)
const sampleReviews = [
  {
    name: "James Parker",
    message: "User-friendly interface with beautiful plant photos. The subscription plans are reasonable and the content quality is top-notch.",
    rating: "4",
    date: "11/25/2024"
  }
];

function Home() {
  const { isInitialLoading } = useContext(LoadingContext); 
  const [reviews, setReviews] = useState([]); 
  const [showSuccess, setShowSuccess] = useState(false); 
  const [name, setName] = useState('');
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // Dynamic stats calculation (unchanged)
  const totalPlants = mockFeaturedPlants.length;
  const uniqueBenefits = new Set(
    mockFeaturedPlants.flatMap(p => p.health_benefits.split(',').map(b => b.trim().toLowerCase()))
  ).size;

  useEffect(() => {
    // No timeout here anymore

    // Check if user is logged in (unchanged)
    const userData = sessionStorage.getItem('currentUser');
    const loginStatus = sessionStorage.getItem('isLoggedIn');
    
    if (userData && loginStatus === 'true') {
      setCurrentUser(JSON.parse(userData));
      setIsLoggedIn(true);
    }

    const savedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    setReviews(savedReviews.length > 0 ? savedReviews : sampleReviews);
  }, []);

  // Function to handle logout (unchanged)
  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('isLoggedIn');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  // Function to add review (unchanged)
  const addReview = (newReview) => {
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews); 
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Handle form submit (unchanged)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!rating) {
      alert("Please select a rating");
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      alert("Please write a detailed review (at least 10 characters)");
      return;
    }
    const newReview = {
      name,
      message,
      rating,
      date: new Date().toLocaleDateString()
    };
    addReview(newReview);
    setName('');
    setRating('');
    setMessage('');
  };

  // Plant card click 
  const handlePlantCardClick = (plantId) => {
    navigate(`/plants/${plantId}`);
  };

  // Subscription card click 
  const handleSubscriptionClick = (planId) => {
    navigate(`/subscribe/${planId}`);
  };

  if (isInitialLoading) {
    return (
      <div id="preloader">
        <img src="/assets/logo2.png" alt="Loading..." />
      </div>

    );
  }

  return (
    <div>
      <section className="hero">
        <h1>Discover the Power of Medicinal Plants</h1>
        <p>Explore the world of medicinal plants, learn their healing properties, and discover how to grow your own natural pharmacy.</p>
        <div className="hero-btns">
          {isLoggedIn ? (
            <div className="user-welcome">
              <span className="welcome-text">Hello, {currentUser?.name}!</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/account" className="cta-btn">Create Account</Link>
          )}
        </div>
      </section>

      <section className="section" id="home">
        <h2>EVERYTHING YOU NEED TO KNOW</h2>
        <p>From identification to cultivation, discover comprehensive information about medicinal plants and their healing properties.</p>
        <div className="info-grid">
          <div className="info-card">
            <h3>Plant Information</h3>
            <p>Comprehensive medicinal properties, uses, and benefits for each plant species.</p>
          </div>
          <div className="info-card">
            <h3>Growing Guide</h3>
            <p>Complete cultivation instructions, care tips, and seasonal guidance.</p>
          </div>
          <div className="info-card">
            <h3>Personal Collection</h3>
            <p>Bookmark your favorite plants and build your personal herbal library.</p>
          </div>
        </div>
      </section>

      <section className="featured-plants" id="plants">
        <h2>FEATURED PLANTS</h2>
        <div className="plant-grid">
          {mockFeaturedPlants.map(plant => (
            <div 
              key={plant.id} 
              className="plant-card clickable"
              onClick={() => handlePlantCardClick(plant.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handlePlantCardClick(plant.id);
                }
              }}
              aria-label={`View details for ${plant.common_name}`}
            >
              <img src={plant.image} alt={plant.common_name} />
              <h3>{plant.common_name}</h3>
              <h4>{plant.scientific_name}</h4>
              <p>{plant.description}</p>
              <div onClick={(e) => e.stopPropagation()}>
                <FavoriteButton plantName={plant.common_name} />
              </div>
            </div>
          ))}
        </div>
        <div className="view-all-btn">
          <Link to="/plants">
            <button>View All Plants</button>
          </Link>
        </div>
      </section>

      <section className="subscription" id="subscription">
        <h2>SUBSCRIPTION PLANS</h2>
        <p className="section-desc">Unlock full access to detailed plant guides, personalized tips, and exclusive content.</p>
        <div className="pricing-grid">
          {mockSubscriptionPlans.map((plan, index) => (
            <div 
              key={index} 
              className="pricing-card clickable"
              onClick={() => handleSubscriptionClick(plan.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSubscriptionClick(plan.id);
                }
              }}
              aria-label={`Subscribe to ${plan.title} plan`}
            >
              <h3>{plan.title}</h3>
              <div className="price">{plan.price}<span>{plan.period}</span></div>
              <ul>
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex}>{feature}</li>
                ))}
              </ul>
              <button>Subscribe</button>
            </div>
          ))}
        </div>
      </section>

      <section className="reviews" id="reviews">
        <h2>USER REVIEWS</h2>
        <p className="section-desc">Share your experience and see what others are saying about GreenGuide.</p>
        <div id="successMessage" className={`success-message ${showSuccess ? 'show' : ''}`}>
          ✓ Thank you! Your review has been submitted successfully.
        </div>
        <form id="reviewForm" className="review-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            id="name" 
            placeholder="Enter Your Full Name" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="rating">
            <label>Rating:</label>
            <select 
              id="rating" 
              required
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">Choose Rating</option>
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐☆ Very Good</option>
              <option value="3">⭐⭐⭐☆☆ Good</option>
              <option value="2">⭐⭐☆☆☆ Fair</option>
              <option value="1">⭐☆☆☆☆ Poor</option>
            </select>
          </div>
          <textarea 
            id="message" 
            placeholder="Share your detailed experience with GreenGuide..." 
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button type="submit">Submit My Review</button>
        </form>
        <div id="reviewList" className="review-grid">
          <div className="review-carousel">
            <div className="review-track">
              {reviews.concat(reviews).map((review, index) => ( 
                <div key={index} className="review-card">
                  <div className="review-rating">{'★'.repeat(parseInt(review.rating)) + '☆'.repeat(5 - parseInt(review.rating))}</div>
                  <h4>{review.name}</h4>
                  <p>"{review.message}"</p>
                  <div className="review-date">{review.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div>{totalPlants}+<br />Medicinal Plants</div>
        <div>{uniqueBenefits}+<br />Healing Properties</div>
        <div>100%<br />Natural Remedies</div>
      </section>
    </div>
  );
}

export default Home;