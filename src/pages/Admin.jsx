import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, Save, X, Upload, Eye, 
  Settings, Users, FileText, DollarSign, 
  Search, Filter, ChevronDown, ChevronUp,
  AlertCircle, CheckCircle, Image as ImageIcon,
  Globe, Phone, Mail, MapPin, Clock,
  IndianRupeeIcon
} from 'lucide-react';
import '../styles/admin.css';

function AdminDashboard() {
  // State management
  const [activeTab, setActiveTab] = useState('plants');
  const [plants, setPlants] = useState([]);
  const [contactInfo, setContactInfo] = useState({});
  const [pricing, setPricing] = useState({});
  const [editingPlant, setEditingPlant] = useState(null);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [websiteSettings, setWebsiteSettings] = useState({
    siteTitle: 'GreenGuide',
    metaDescription: 'Your complete guide to medicinal plants and herbal remedies',
    adminEmail: 'admin@greenguide.in',
    maintenanceMode: false
  });

  // Mock data initialization
  useEffect(() => {
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    const mockPlants = [
      {
        id: 1,
        title: 'Tulsi',
        scientific: 'Ocimum sanctum',
        category: 'Sacred Herb',
        description: 'Tulsi, also known as Holy Basil, is considered the most sacred plant in Hindu tradition. This aromatic herb has been revered for over 3,000 years for its remarkable healing properties and spiritual significance.',
        region: 'India, Southeast Asia',
        season: 'Spring, Summer, Monsoon',
        plantType: 'Perennial Herb',
        healthBenefits: ['Immunity booster', 'Anti-stress', 'Respiratory health', 'Anti-inflammatory'],
        images: ['./public/assets/tulsi3.jpg'],
        status: 'published',
        medicinalUses: [
          {
            title: 'Immune System Booster',
            description: 'Rich in antioxidants and essential oils that strengthen the body\'s natural defense mechanisms.'
          },
          {
            title: 'Stress & Anxiety Relief',
            description: 'Acts as an adaptogen, helping the body cope with physical and mental stress naturally.'
          }
        ],
        growingGuide: 'Soak seeds for 12-24 hours, plant in well-draining soil with pH 6.0-7.5, provide 6-8 hours sunlight daily.',
        traditionalUses: ['Herbal teas for wellness', 'Religious ceremonies', 'Natural remedy for fever'],
        translations: {
          mr: {
            title: 'तुळस',
            description: 'तुळस ही हिंदू परंपरेत सर्वात पवित्र वनस्पती मानली जाते.'
          }
        }
      },
      {
        id: 2,
        title: 'Turmeric',
        scientific: 'Curcuma longa',
        category: 'Root Spice',
        description: 'Turmeric is a golden-yellow rhizome that has been used for over 4,000 years in traditional medicine. Known as the "Golden Spice of Life," it contains powerful anti-inflammatory compounds.',
        region: 'India, Southeast Asia, Central America',
        season: 'Summer, Monsoon',
        plantType: 'Rhizomatous Perennial',
        healthBenefits: ['Anti-inflammatory', 'Antioxidant', 'Digestive aid', 'Wound healing'],
        images: ['/api/placeholder/300/200'],
        status: 'published',
        medicinalUses: [
          {
            title: 'Anti-inflammatory Power',
            description: 'Contains curcumin, a powerful compound that reduces inflammation throughout the body.'
          }
        ],
        growingGuide: 'Plant rhizomes 2 inches deep, maintain consistent moisture, harvest after 8-10 months.',
        traditionalUses: ['Culinary spice', 'Natural food coloring', 'Traditional medicine'],
        translations: {
          mr: {
            title: 'हळद',
            description: 'हळद ही सोनेरी-पिवळी rhizome आहे जी 4,000 वर्षांहून अधिक काळ पारंपारिक औषधांमध्ये वापरली जात आहे.'
          }
        }
      }
    ];

    const mockContactInfo = {
      location: {
        title: 'Our Location',
        details: ['123 Botanical Gardens Street', 'Green Valley, Mumbai 400001', 'Maharashtra, India']
      },
      phone: {
        title: 'Phone Numbers',
        details: ['Main: +91 94034 00841', 'Support: +91 90211 65398', 'Toll-free: 1800-GREEN-01']
      },
      email: {
        title: 'Email Addresses',
        details: ['General: info@greenguide.in', 'Support: support@greenguide.in', 'Partnerships: business@greenguide.in']
      },
      hours: {
        title: 'Business Hours',
        details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM', 'Sunday: Closed']
      }
    };

    const mockPricing = {
      weekly: { price: 49, originalPrice: 299, discount: 33 },
      monthly: { price: 149, originalPrice: 899, discount: 33 },
      yearly: { price: 1499, originalPrice: 8999, discount: 33 }
    };

    setPlants(mockPlants);
    setContactInfo(mockContactInfo);
    setPricing(mockPricing);
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Plant Management Functions
  const handleAddPlant = () => {
    setEditingPlant({
      id: Date.now(),
      title: '',
      scientific: '',
      category: '',
      description: '',
      region: '',
      season: '',
      plantType: '',
      healthBenefits: [],
      images: [],
      status: 'draft',
      medicinalUses: [],
      growingGuide: '',
      traditionalUses: [],
      translations: { mr: { title: '', description: '' } }
    });
    setShowPlantModal(true);
  };

  const handleEditPlant = (plant) => {
    setEditingPlant({ ...plant });
    setShowPlantModal(true);
  };

  const handleSavePlant = async () => {
    if (!editingPlant.title || !editingPlant.scientific || !editingPlant.description) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const existingIndex = plants.findIndex(p => p.id === editingPlant.id);
      
      if (existingIndex >= 0) {
        const updatedPlants = [...plants];
        updatedPlants[existingIndex] = editingPlant;
        setPlants(updatedPlants);
        showMessage('success', 'Plant updated successfully');
      } else {
        setPlants([...plants, editingPlant]);
        showMessage('success', 'Plant added successfully');
      }
      
      setShowPlantModal(false);
      setEditingPlant(null);
      
      // Here you would make actual API calls to your backend
      // await fetch('/api/plants', { method: 'POST', body: JSON.stringify(editingPlant) });
      
    } catch (error) {
      showMessage('error', 'Failed to save plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlant = async (plantId) => {
    if (window.confirm('Are you sure you want to delete this plant? This action cannot be undone.')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setPlants(plants.filter(p => p.id !== plantId));
        showMessage('success', 'Plant deleted successfully');
        
        // Here you would make actual API call to your backend
        // await fetch(`/api/plants/${plantId}`, { method: 'DELETE' });
        
      } catch (error) {
        showMessage('error', 'Failed to delete plant. Please try again.');
      }
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImages = [...(editingPlant.images || []), e.target.result];
          setEditingPlant({ ...editingPlant, images: newImages });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    const newImages = editingPlant.images.filter((_, i) => i !== index);
    setEditingPlant({ ...editingPlant, images: newImages });
  };

  // Contact Info Management
  const handleContactInfoChange = (section, index, value) => {
    const updatedContactInfo = { ...contactInfo };
    updatedContactInfo[section].details[index] = value;
    setContactInfo(updatedContactInfo);
  };

  const addContactDetail = (section) => {
    const updatedContactInfo = { ...contactInfo };
    updatedContactInfo[section].details.push('');
    setContactInfo(updatedContactInfo);
  };

  const removeContactDetail = (section, index) => {
    const updatedContactInfo = { ...contactInfo };
    updatedContactInfo[section].details.splice(index, 1);
    setContactInfo(updatedContactInfo);
  };

  const saveContactInfo = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showMessage('success', 'Contact information updated successfully');
      
      // Here you would make actual API call to your backend
      // await fetch('/api/contact', { method: 'PUT', body: JSON.stringify(contactInfo) });
      
    } catch (error) {
      showMessage('error', 'Failed to update contact information');
    } finally {
      setLoading(false);
    }
  };

  // Pricing Management
  const handlePricingChange = (plan, field, value) => {
    const updatedPricing = {
      ...pricing,
      [plan]: {
        ...pricing[plan],
        [field]: parseFloat(value) || 0
      }
    };
    
    // Auto-calculate discount
    if (field === 'price' || field === 'originalPrice') {
      const discount = Math.round((1 - updatedPricing[plan].price / updatedPricing[plan].originalPrice) * 100);
      updatedPricing[plan].discount = discount;
    }
    
    setPricing(updatedPricing);
  };

  const savePricing = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showMessage('success', 'Pricing updated successfully');
      
      // Here you would make actual API call to your backend
      // await fetch('/api/pricing', { method: 'PUT', body: JSON.stringify(pricing) });
      
    } catch (error) {
      showMessage('error', 'Failed to update pricing');
    } finally {
      setLoading(false);
    }
  };

  // Website Settings Management
  const handleSettingsChange = (field, value) => {
    setWebsiteSettings({ ...websiteSettings, [field]: value });
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showMessage('success', 'Settings updated successfully');
      
      // Here you would make actual API call to your backend
      // await fetch('/api/settings', { method: 'PUT', body: JSON.stringify(websiteSettings) });
      
    } catch (error) {
      showMessage('error', 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search functions
  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.scientific.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || plant.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(plants.map(p => p.category))];

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>GreenGuide Admin Dashboard</h1>
          <div className="admin-user-info">
            <span>Welcome, Admin</span>
            <div className="admin-avatar">A</div>
          </div>
        </div>
      </header>

      {/* Message Toast */}
      {message.text && (
        <div className={`admin-message ${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <button 
              className={`admin-nav-btn ${activeTab === 'plants' ? 'active' : ''}`}
              onClick={() => setActiveTab('plants')}
            >
              <FileText size={20} />
              <span>Plant Management</span>
            </button>
            <button 
              className={`admin-nav-btn ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              <Phone size={20} />
              <span>Contact Info</span>
            </button>
            <button 
              className={`admin-nav-btn ${activeTab === 'pricing' ? 'active' : ''}`}
              onClick={() => setActiveTab('pricing')}
            >
              <IndianRupeeIcon size={20} />
              <span>Pricing</span>
            </button>
            <button 
              className={`admin-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {/* Plants Tab */}
          {activeTab === 'plants' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>Plant Management</h2>
                <button className="admin-btn admin-btn-primary" onClick={handleAddPlant}>
                  <Plus size={20} />
                  Add New Plant
                </button>
              </div>

              {/* Search and Filter */}
              <div className="admin-filters">
                <div className="admin-search">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search plants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="admin-filter">
                  <Filter size={20} />
                  <select 
                    value={filterCategory} 
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Plants Grid */}
              <div className="admin-plants-grid">
                {filteredPlants.map(plant => (
                  <div key={plant.id} className="admin-plant-card">
                    <div className="admin-plant-image">
                      {plant.images && plant.images[0] ? (
                        <img src={plant.images[0]} alt={plant.title} />
                      ) : (
                        <div className="admin-no-image">
                          <ImageIcon size={40} />
                        </div>
                      )}
                      <div className={`admin-status-badge ${plant.status}`}>
                        {plant.status}
                      </div>
                    </div>
                    <div className="admin-plant-info">
                      <h3>{plant.title}</h3>
                      <p><em>{plant.scientific}</em></p>
                      <div className="admin-plant-meta">
                        <span className="admin-category">{plant.category}</span>
                        <span className="admin-region">{plant.region}</span>
                      </div>
                      <div className="admin-plant-actions">
                        <button 
                          className="admin-btn admin-btn-secondary"
                          onClick={() => handleEditPlant(plant)}
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button 
                          className="admin-btn admin-btn-danger"
                          onClick={() => handleDeletePlant(plant.id)}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Info Tab */}
          {activeTab === 'contact' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>Contact Information</h2>
                <button 
                  className="admin-btn admin-btn-primary"
                  onClick={saveContactInfo}
                  disabled={loading}
                >
                  <Save size={20} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="admin-contact-grid">
                {Object.entries(contactInfo).map(([key, info]) => (
                  <div key={key} className="admin-contact-section">
                    <h3>
                      {key === 'location' && <MapPin size={20} />}
                      {key === 'phone' && <Phone size={20} />}
                      {key === 'email' && <Mail size={20} />}
                      {key === 'hours' && <Clock size={20} />}
                      {info.title}
                    </h3>
                    {info.details.map((detail, index) => (
                      <div key={index} className="admin-contact-item">
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) => handleContactInfoChange(key, index, e.target.value)}
                          className="admin-input"
                        />
                        <button
                          className="admin-btn admin-btn-danger admin-btn-small"
                          onClick={() => removeContactDetail(key, index)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      className="admin-btn admin-btn-secondary admin-btn-small"
                      onClick={() => addContactDetail(key)}
                    >
                      <Plus size={16} />
                      Add Detail
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>Subscription Pricing</h2>
                <button 
                  className="admin-btn admin-btn-primary"
                  onClick={savePricing}
                  disabled={loading}
                >
                  <Save size={20} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="admin-pricing-grid">
                {Object.entries(pricing).map(([plan, details]) => (
                  <div key={plan} className="admin-pricing-card">
                    <h3>{plan.charAt(0).toUpperCase() + plan.slice(1)} Plan</h3>
                    <div className="admin-pricing-fields">
                      <div className="admin-field">
                        <label>Current Price (₹)</label>
                        <input
                          type="number"
                          value={details.price}
                          onChange={(e) => handlePricingChange(plan, 'price', e.target.value)}
                          className="admin-input"
                        />
                      </div>
                      <div className="admin-field">
                        <label>Original Price (₹)</label>
                        <input
                          type="number"
                          value={details.originalPrice}
                          onChange={(e) => handlePricingChange(plan, 'originalPrice', e.target.value)}
                          className="admin-input"
                        />
                      </div>
                      <div className="admin-field">
                        <label>Discount (%)</label>
                        <input
                          type="number"
                          value={details.discount}
                          readOnly
                          className="admin-input admin-input-readonly"
                        />
                        <small>Auto-calculated based on price difference</small>
                      </div>
                    </div>
                    <div className="admin-pricing-preview">
                      <span className="admin-price-current">₹{details.price}</span>
                      <span className="admin-price-original">₹{details.originalPrice}</span>
                      <span className="admin-discount">{details.discount}% OFF</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2>Website Settings</h2>
                <button 
                  className="admin-btn admin-btn-primary"
                  onClick={saveSettings}
                  disabled={loading}
                >
                  <Save size={20} />
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
              
              <div className="admin-settings-card">
                <h3>General Settings</h3>
                <div className="admin-setting-item">
                  <label>Site Title</label>
                  <input 
                    type="text" 
                    value={websiteSettings.siteTitle}
                    onChange={(e) => handleSettingsChange('siteTitle', e.target.value)}
                    className="admin-input" 
                  />
                </div>
                <div className="admin-setting-item">
                  <label>Meta Description</label>
                  <textarea 
                    value={websiteSettings.metaDescription}
                    onChange={(e) => handleSettingsChange('metaDescription', e.target.value)}
                    className="admin-input"
                    rows="3"
                  />
                </div>
                <div className="admin-setting-item">
                  <label>Admin Email</label>
                  <input 
                    type="email" 
                    value={websiteSettings.adminEmail}
                    onChange={(e) => handleSettingsChange('adminEmail', e.target.value)}
                    className="admin-input" 
                  />
                </div>
                <div className="admin-setting-item">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={websiteSettings.maintenanceMode}
                      onChange={(e) => handleSettingsChange('maintenanceMode', e.target.checked)}
                    />
                    Maintenance Mode
                  </label>
                  <small>Enable this to show a maintenance page to users</small>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Plant Modal */}
      {showPlantModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{editingPlant.title ? 'Edit Plant' : 'Add New Plant'}</h2>
              <button 
                className="admin-modal-close"
                onClick={() => setShowPlantModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-content">
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Plant Name *</label>
                  <input
                    type="text"
                    value={editingPlant.title}
                    onChange={(e) => setEditingPlant({...editingPlant, title: e.target.value})}
                    className="admin-input"
                    placeholder="Enter plant name"
                  />
                </div>
                
                <div className="admin-field">
                  <label>Scientific Name *</label>
                  <input
                    type="text"
                    value={editingPlant.scientific}
                    onChange={(e) => setEditingPlant({...editingPlant, scientific: e.target.value})}
                    className="admin-input"
                    placeholder="Enter scientific name"
                  />
                </div>

                <div className="admin-field">
                  <label>Category</label>
                  <select
                    value={editingPlant.category}
                    onChange={(e) => setEditingPlant({...editingPlant, category: e.target.value})}
                    className="admin-input"
                  >
                    <option value="">Select category</option>
                    <option value="Sacred Herb">Sacred Herb</option>
                    <option value="Root Spice">Root Spice</option>
                    <option value="Medicinal Leaf">Medicinal Leaf</option>
                    <option value="Flowering Plant">Flowering Plant</option>
                    <option value="Tree">Tree</option>
                    <option value="Shrub">Shrub</option>
                  </select>
                </div>

                <div className="admin-field">
                  <label>Plant Type</label>
                  <input
                    type="text"
                    value={editingPlant.plantType}
                    onChange={(e) => setEditingPlant({...editingPlant, plantType: e.target.value})}
                    className="admin-input"
                    placeholder="e.g., Perennial Herb"
                  />
                </div>

                <div className="admin-field admin-field-full">
                  <label>Description *</label>
                  <textarea
                    value={editingPlant.description}
                    onChange={(e) => setEditingPlant({...editingPlant, description: e.target.value})}
                    className="admin-input"
                    rows="4"
                    placeholder="Enter plant description"
                  />
                </div>

                <div className="admin-field">
                  <label>Region</label>
                  <input
                    type="text"
                    value={editingPlant.region}
                    onChange={(e) => setEditingPlant({...editingPlant, region: e.target.value})}
                    className="admin-input"
                    placeholder="e.g., India, Southeast Asia"
                  />
                </div>

                <div className="admin-field">
                  <label>Season</label>
                  <input
                    type="text"
                    value={editingPlant.season}
                    onChange={(e) => setEditingPlant({...editingPlant, season: e.target.value})}
                    className="admin-input"
                    placeholder="e.g., Spring, Summer"
                  />
                </div>

                <div className="admin-field admin-field-full">
                  <label>Health Benefits</label>
                  <input
                    type="text"
                    value={editingPlant.healthBenefits ? editingPlant.healthBenefits.join(', ') : ''}
                    onChange={(e) => setEditingPlant({...editingPlant, healthBenefits: e.target.value.split(', ').filter(b => b.trim())})}
                    className="admin-input"
                    placeholder="Enter benefits separated by commas"
                  />
                </div>

                <div className="admin-field admin-field-full">
                  <label>Growing Guide</label>
                  <textarea
                    value={editingPlant.growingGuide}
                    onChange={(e) => setEditingPlant({...editingPlant, growingGuide: e.target.value})}
                    className="admin-input"
                    rows="3"
                    placeholder="Enter growing instructions"
                  />
                </div>

                <div className="admin-field admin-field-full">
                  <label>Traditional Uses</label>
                  <input
                    type="text"
                    value={editingPlant.traditionalUses ? editingPlant.traditionalUses.join(', ') : ''}
                    onChange={(e) => setEditingPlant({...editingPlant, traditionalUses: e.target.value.split(', ').filter(u => u.trim())})}
                    className="admin-input"
                    placeholder="Enter traditional uses separated by commas"
                  />
                </div>

                <div className="admin-field admin-field-full">
                  <label>Plant Images</label>
                  <div className="admin-image-upload">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="admin-file-input"
                      id="plant-image"
                    />
                    <label htmlFor="plant-image" className="admin-upload-btn">
                      <Upload size={20} />
                      Upload Images
                    </label>
                  </div>
                  {editingPlant.images && editingPlant.images.length > 0 && (
                    <div className="admin-image-preview">
                      {editingPlant.images.map((img, index) => (
                        <div key={index} className="admin-preview-item">
                          <img src={img} alt={`Preview ${index + 1}`} />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="admin-remove-image"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="admin-field">
                  <label>Status</label>
                  <select
                    value={editingPlant.status}
                    onChange={(e) => setEditingPlant({...editingPlant, status: e.target.value})}
                    className="admin-input"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Marathi Translation Fields */}
                <div className="admin-field admin-field-full">
                  <h4>Marathi Translation</h4>
                  <div className="admin-translation-fields">
                    <div className="admin-field">
                      <label>Marathi Title</label>
                      <input
                        type="text"
                        value={editingPlant.translations?.mr?.title || ''}
                        onChange={(e) => setEditingPlant({
                          ...editingPlant, 
                          translations: {
                            ...editingPlant.translations,
                            mr: {
                              ...editingPlant.translations?.mr,
                              title: e.target.value
                            }
                          }
                        })}
                        className="admin-input"
                        placeholder="Enter Marathi name"
                      />
                    </div>
                    <div className="admin-field">
                      <label>Marathi Description</label>
                      <textarea
                        value={editingPlant.translations?.mr?.description || ''}
                        onChange={(e) => setEditingPlant({
                          ...editingPlant, 
                          translations: {
                            ...editingPlant.translations,
                            mr: {
                              ...editingPlant.translations?.mr,
                              description: e.target.value
                            }
                          }
                        })}
                        className="admin-input"
                        rows="3"
                        placeholder="Enter Marathi description"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button 
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowPlantModal(false)}
              >
                Cancel
              </button>
              <button 
                className="admin-btn admin-btn-primary"
                onClick={handleSavePlant}
                disabled={loading}
              >
                <Save size={20} />
                {loading ? 'Saving...' : 'Save Plant'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;