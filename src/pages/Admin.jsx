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

// API base URL - adjust this to your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
    siteTitle: '',
    metaDescription: '',
    adminEmail: '',
    maintenanceMode: false
  });

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadPlants(),
        loadContactInfo(),
        loadPricing(),
        loadSettings()
      ]);
    } catch (error) {
      showMessage('error', 'Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  // API helper function
  const apiCall = async (endpoint, method = 'GET', data = null) => {
    try {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if you have authentication
          // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Data loading functions
  const loadPlants = async () => {
    try {
      const data = await apiCall('/plants');
      setPlants(data.plants || []);
    } catch (error) {
      console.error('Failed to load plants:', error);
      setPlants([]);
    }
  };

  const loadContactInfo = async () => {
    try {
      const data = await apiCall('/contact');
      setContactInfo(data.contactInfo || {
        location: { title: 'Our Location', details: [] },
        phone: { title: 'Phone Numbers', details: [] },
        email: { title: 'Email Addresses', details: [] },
        hours: { title: 'Business Hours', details: [] }
      });
    } catch (error) {
      console.error('Failed to load contact info:', error);
    }
  };

  const loadPricing = async () => {
    try {
      const data = await apiCall('/pricing');
      setPricing(data.pricing || {
        weekly: { price: 0, originalPrice: 0, discount: 0 },
        monthly: { price: 0, originalPrice: 0, discount: 0 },
        yearly: { price: 0, originalPrice: 0, discount: 0 }
      });
    } catch (error) {
      console.error('Failed to load pricing:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await apiCall('/settings');
      setWebsiteSettings(data.settings || {
        siteTitle: 'GreenGuide',
        metaDescription: 'Your complete guide to medicinal plants and herbal remedies',
        adminEmail: 'admin@greenguide.in',
        maintenanceMode: false
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  // Plant Management Functions
  const handleAddPlant = () => {
    setEditingPlant({
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
      let savedPlant;
      
      if (editingPlant.id) {
        // Update existing plant
        savedPlant = await apiCall(`/plants/${editingPlant.id}`, 'PUT', editingPlant);
        showMessage('success', 'Plant updated successfully');
      } else {
        // Create new plant
        savedPlant = await apiCall('/plants', 'POST', editingPlant);
        showMessage('success', 'Plant added successfully');
      }
      
      // Refresh plants list
      await loadPlants();
      
      setShowPlantModal(false);
      setEditingPlant(null);
      
    } catch (error) {
      showMessage('error', 'Failed to save plant. Please try again.');
      console.error('Save plant error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlant = async (plantId) => {
    if (window.confirm('Are you sure you want to delete this plant? This action cannot be undone.')) {
      setLoading(true);
      try {
        await apiCall(`/plants/${plantId}`, 'DELETE');
        showMessage('success', 'Plant deleted successfully');
        
        // Refresh plants list
        await loadPlants();
        
      } catch (error) {
        showMessage('error', 'Failed to delete plant. Please try again.');
        console.error('Delete plant error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;
    
    setLoading(true);
    const uploadedImages = [];
    
    try {
      for (const file of files) {
        if (file && file.type.startsWith('image/')) {
          const formData = new FormData();
          formData.append('image', file);
          
          // Upload image to server
          const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
          });
          
          if (response.ok) {
            const data = await response.json();
            uploadedImages.push(data.imageUrl);
          }
        }
      }
      
      // Update editing plant with new image URLs
      const newImages = [...(editingPlant.images || []), ...uploadedImages];
      setEditingPlant({ ...editingPlant, images: newImages });
      
      if (uploadedImages.length > 0) {
        showMessage('success', `${uploadedImages.length} image(s) uploaded successfully`);
      }
      
    } catch (error) {
      showMessage('error', 'Failed to upload images');
      console.error('Image upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = async (index) => {
    const imageUrl = editingPlant.images[index];
    
    try {
      // Delete image from server
      await apiCall('/upload', 'DELETE', { imageUrl });
      
      const newImages = editingPlant.images.filter((_, i) => i !== index);
      setEditingPlant({ ...editingPlant, images: newImages });
      
    } catch (error) {
      console.error('Failed to delete image:', error);
      // Still remove from UI even if server deletion fails
      const newImages = editingPlant.images.filter((_, i) => i !== index);
      setEditingPlant({ ...editingPlant, images: newImages });
    }
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
      await apiCall('/contact', 'PUT', { contactInfo });
      showMessage('success', 'Contact information updated successfully');
    } catch (error) {
      showMessage('error', 'Failed to update contact information');
      console.error('Save contact info error:', error);
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
      await apiCall('/pricing', 'PUT', { pricing });
      showMessage('success', 'Pricing updated successfully');
    } catch (error) {
      showMessage('error', 'Failed to update pricing');
      console.error('Save pricing error:', error);
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
      await apiCall('/settings', 'PUT', { settings: websiteSettings });
      showMessage('success', 'Settings updated successfully');
    } catch (error) {
      showMessage('error', 'Failed to update settings');
      console.error('Save settings error:', error);
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
                      {info.title || key.charAt(0).toUpperCase() + key.slice(1)}
                    </h3>
                    {info.details && info.details.length > 0 ? info.details.map((detail, index) => (
                      <div key={index} className="admin-contact-item">
                        <input
                          type={key === 'email' ? 'email' : 'text'}
                          value={detail}
                          onChange={(e) => handleContactInfoChange(key, index, e.target.value)}
                          className="admin-input"
                          placeholder={`Enter ${key} detail`}
                        />
                        <button
                          className="admin-btn admin-btn-danger admin-btn-small"
                          onClick={() => removeContactDetail(key, index)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )) : (
                      <p className="admin-no-data">No {key} details added yet</p>
                    )}
                    <button
                      className="admin-btn admin-btn-secondary admin-btn-small"
                      onClick={() => addContactDetail(key)}
                    >
                      <Plus size={16} />
                      Add {key === 'location' ? 'Address' : key === 'phone' ? 'Phone' : key === 'email' ? 'Email' : 'Hours'} Detail
                    </button>
                  </div>
                ))}
                
                {/* Add new contact section if no data exists */}
                {Object.keys(contactInfo).length === 0 && (
                  <div className="admin-empty-state">
                    <p>No contact information found. The system will create default sections when you save.</p>
                    <button
                      className="admin-btn admin-btn-primary"
                      onClick={() => {
                        setContactInfo({
                          location: { title: 'Our Location', details: [''] },
                          phone: { title: 'Phone Numbers', details: [''] },
                          email: { title: 'Email Addresses', details: [''] },
                          hours: { title: 'Business Hours', details: [''] }
                        });
                      }}
                    >
                      <Plus size={16} />
                      Initialize Contact Sections
                    </button>
                  </div>
                )}
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
                {Object.keys(pricing).length > 0 ? Object.entries(pricing).map(([plan, details]) => (
                  <div key={plan} className="admin-pricing-card">
                    <h3>{plan.charAt(0).toUpperCase() + plan.slice(1)} Plan</h3>
                    <div className="admin-pricing-fields">
                      <div className="admin-field">
                        <label>Current Price (₹)</label>
                        <input
                          type="number"
                          value={details.price || 0}
                          onChange={(e) => handlePricingChange(plan, 'price', e.target.value)}
                          className="admin-input"
                          placeholder="Enter current price"
                          min="0"
                          step="1"
                        />
                      </div>
                      <div className="admin-field">
                        <label>Original Price (₹)</label>
                        <input
                          type="number"
                          value={details.originalPrice || 0}
                          onChange={(e) => handlePricingChange(plan, 'originalPrice', e.target.value)}
                          className="admin-input"
                          placeholder="Enter original price"
                          min="0"
                          step="1"
                        />
                      </div>
                      <div className="admin-field">
                        <label>Discount (%)</label>
                        <input
                          type="number"
                          value={details.discount || 0}
                          readOnly
                          className="admin-input admin-input-readonly"
                        />
                        <small>Auto-calculated based on price difference</small>
                      </div>
                    </div>
                    <div className="admin-pricing-preview">
                      <span className="admin-price-current">₹{details.price || 0}</span>
                      <span className="admin-price-original">₹{details.originalPrice || 0}</span>
                      <span className="admin-discount">{details.discount || 0}% OFF</span>
                    </div>
                  </div>
                )) : (
                  <div className="admin-empty-state">
                    <p>No pricing plans found. Click below to create default pricing structure.</p>
                    <button
                      className="admin-btn admin-btn-primary"
                      onClick={() => {
                        setPricing({
                          weekly: { price: 0, originalPrice: 0, discount: 0 },
                          monthly: { price: 0, originalPrice: 0, discount: 0 },
                          yearly: { price: 0, originalPrice: 0, discount: 0 }
                        });
                      }}
                    >
                      <Plus size={16} />
                      Create Pricing Plans
                    </button>
                  </div>
                )}
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
              <h2>{editingPlant.id ? 'Edit Plant' : 'Add New Plant'}</h2>
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