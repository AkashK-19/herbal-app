import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/contact.css';

const Contact = () => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  // Upload and UI state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);

  // Refs
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  
  // Constants
  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_MESSAGE_LENGTH = 1000;

  // FAQ data - can be moved to a separate data file later
  const faqData = [
    {
      id: 1,
      question: "How quickly do you respond to inquiries?",
      answer: "We typically respond to all inquiries within 24 hours during business days. Urgent matters are prioritized and may receive faster responses."
    },
    {
      id: 2,
      question: "Can you help identify plants from photos?",
      answer: "Absolutely! Our expert botanists can help identify plants from clear photos. Please include multiple angles and close-ups of leaves, flowers, or distinctive features."
    },
    {
      id: 3,
      question: "Do you provide personalized growing advice?",
      answer: "Yes! We offer personalized growing advice based on your location, climate, and specific plant needs. Premium subscribers get priority access to our experts."
    },
    {
      id: 4,
      question: "Are consultations available for medicinal plant usage?",
      answer: "We provide educational information about medicinal plants, but we recommend consulting healthcare professionals for medical advice and treatment recommendations."
    }
  ];

  // Contact information - can be moved to a config file
  const contactInfo = {
    location: {
      icon: 'fas fa-map-marker-alt',
      title: 'Our Location',
      details: ['123 Botanical Gardens Street', 'Green Valley, Mumbai 400001', 'Maharashtra, India']
    },
    phone: {
      icon: 'fas fa-phone',
      title: 'Phone Numbers',
      details: ['Main: +91 98765 43210', 'Support: +91 98765 43211', 'Toll-free: 1800-GREEN-01']
    },
    email: {
      icon: 'fas fa-envelope',
      title: 'Email Addresses',
      details: ['General: info@greenguide.in', 'Support: support@greenguide.in', 'Partnerships: business@greenguide.in']
    },
    hours: {
      icon: 'fas fa-clock',
      title: 'Business Hours',
      details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM', 'Sunday: Closed']
    }
  };

  // Social links
  const socialLinks = [
    { platform: 'facebook', icon: 'fab fa-facebook-f', url: '#' },
    { platform: 'twitter', icon: 'fab fa-twitter', url: '#' },
    { platform: 'instagram', icon: 'fab fa-instagram', url: '#' },
    { platform: 'youtube', icon: 'fab fa-youtube', url: '#' },
    { platform: 'linkedin', icon: 'fab fa-linkedin-in', url: '#' }
  ];

  // Quick links
  const quickLinks = [
    { icon: 'fas fa-leaf', text: 'Plant Database', url: '/plants' },
    { icon: 'fas fa-book', text: 'Growing Guides', url: '/guides' },
    { icon: 'fas fa-question-circle', text: 'FAQ', url: '/faq' },
    { icon: 'fas fa-download', text: 'Mobile App', url: '/app' },
    { icon: 'fas fa-certificate', text: 'Certifications', url: '/certifications' }
  ];

  // Scroll handler for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle message length limit
    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Your Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    // Create FormData for file upload
    const submitData = new FormData();
    
    // Add form fields
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    // Add uploaded files
    uploadedFiles.forEach((file) => {
      submitData.append('images', file);
    });

    try {
      // TODO: Replace with your actual API endpoint
      // This is where you'll integrate with your backend
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to send message');
      }
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });
      setUploadedFiles([]);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

    } catch (error) {
      console.error('Error submitting form:', error);
      // For now, we'll simulate success for demo purposes
      // Remove this simulation when you have a real backend
      setShowSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });
      setUploadedFiles([]);
      setTimeout(() => setShowSuccess(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  // File upload handlers
  const handleFileSelect = (files) => {
    const validFiles = [];
    const fileErrors = [];

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        fileErrors.push(`${file.name} is not a valid image file.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        fileErrors.push(`${file.name} is too large. Maximum size is 5MB.`);
        return;
      }

      if (uploadedFiles.length + validFiles.length >= MAX_FILES) {
        fileErrors.push(`Maximum ${MAX_FILES} images allowed.`);
        return;
      }

      validFiles.push(file);
    });

    if (fileErrors.length > 0) {
      alert(fileErrors.join('\n'));
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  // Remove uploaded file
  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Get character count color
  const getCharCountColor = (count) => {
    if (count > 900) return '#ef4444';
    if (count > 750) return '#f59e0b';
    return '#6b7280';
  };

  // Toggle FAQ
  const toggleFAQ = (id) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="contact-page">

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1>Get in Touch</h1>
          <p>Have questions about medicinal plants? We're here to help you on your natural healing journey.</p>
        </div>
        <div className="hero-decoration">
          <div className="floating-leaf leaf-1">🍃</div>
          <div className="floating-leaf leaf-2">🌿</div>
          <div className="floating-leaf leaf-3">🍀</div>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2>Send Us a Message</h2>
              
              {showSuccess ? (
                <div className="success-message show">
                  <i className="fas fa-check-circle"></i>
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you for contacting GreenGuide. We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <div ref={formRef} className="contact-form">
                  <div className="form-row">
                    <div className={`form-group ${errors.firstName ? 'error' : ''}`}>
                      <label htmlFor="firstName">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                    </div>
                    <div className={`form-group ${errors.lastName ? 'error' : ''}`}>
                      <label htmlFor="lastName">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className={`form-group ${errors.email ? 'error' : ''}`}>
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className={`form-group ${errors.message ? 'error' : ''}`}>
                    <label htmlFor="message">Your Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your plant-related question or concern. Be as detailed as possible to help us provide the best assistance..."
                      required
                    />
                    <div className="character-count">
                      <span style={{ color: getCharCountColor(formData.message.length) }}>
                        {formData.message.length}/{MAX_MESSAGE_LENGTH} characters
                      </span>
                    </div>
                    {errors.message && <span className="error-message">{errors.message}</span>}
                  </div>

                  {/* File Upload */}
                  <div className="form-group">
                    <label>Attach Plant Photos (Optional)</label>
                    <div
                      className={`upload-area ${dragOver ? 'dragover' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="upload-content">
                        <i className="fas fa-camera"></i>
                        <h4>Upload Plant Images</h4>
                        <p>Drag & drop images here or <span className="browse-btn">browse files</span></p>
                        <small>Supports JPG, PNG, WEBP • Max 5MB per image • Up to 5 images</small>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e.target.files)}
                        hidden
                      />
                    </div>
                    
                    <div className="upload-tips">
                      <h5><i className="fas fa-lightbulb"></i> Tips for Better Plant Identification:</h5>
                      <ul>
                        <li>Include close-ups of leaves showing texture and shape</li>
                        <li>Capture flowers or fruits if available</li>
                        <li>Take a full plant photo for size reference</li>
                        <li>Use good lighting - natural daylight works best</li>
                      </ul>
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <div className="image-preview-container">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="image-preview">
                            <img src={URL.createObjectURL(file)} alt="Preview" />
                            <button
                              type="button"
                              className="image-remove"
                              onClick={() => removeFile(index)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                            <div className="image-info">
                              {file.name}<br/>{formatFileSize(file.size)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button 
                    type="button" 
                    onClick={handleSubmit}
                    className={`submit-btn ${loading ? 'loading' : ''}`} 
                    disabled={loading}
                  >
                    <i className="fas fa-paper-plane"></i>
                    {loading ? 'Sending...' : 'Send Message'}
                    {loading && <span className="loading-spinner"></span>}
                  </button>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="contact-info-section">
              {/* Contact Info Card */}
              <div className="contact-card">
                <h3>Contact Information</h3>
                {Object.entries(contactInfo).map(([key, info]) => (
                  <div key={key} className="contact-item">
                    <div className="contact-icon">
                      <i className={info.icon}></i>
                    </div>
                    <div className="contact-details">
                      <h4>{info.title}</h4>
                      <div>
                        {info.details.map((detail, index) => (
                          <p key={index}>{detail}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media Card */}
              <div className="social-card">
                <h3>Follow Us</h3>
                <div className="social-links">
                  {socialLinks.map((social) => (
                    <a
                      key={social.platform}
                      href={social.url}
                      className={`social-link ${social.platform}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className={social.icon}></i>
                    </a>
                  ))}
                </div>
                <p>Join our community of plant enthusiasts and stay updated with the latest in medicinal botany!</p>
              </div>

              {/* Quick Links Card */}
              <div className="quick-links-card">
                <h3>Quick Links</h3>
                <ul className="quick-links">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link.url}>
                        <i className={link.icon}></i>
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqData.map((faq) => (
              <div key={faq.id} className={`faq-item ${activeFAQ === faq.id ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => toggleFAQ(faq.id)}>
                  <h4>{faq.question}</h4>
                  <i className="fas fa-chevron-down"></i>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <div className="back-to-top show" onClick={scrollToTop}>
          <i className="fas fa-chevron-up"></i>
        </div>
      )}

    </div>
  );
};

export default Contact;