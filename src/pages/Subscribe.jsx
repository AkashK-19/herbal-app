import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Users, Shield, Globe, 
  Bell, Smartphone, ArrowUp, X, Clock, QrCode, ChevronDown, 
  ChevronUp, Loader, CheckCircle, XCircle
} from 'lucide-react';
import '../styles/sub.css';

function Subscribe() {
  const [selectedPlan, setSelectedPlan] = useState({
    type: 'weekly',
    price: 49,
    period: 'week',
    description: 'Billed weekly',
    originalPrice: 299,
    discount: 33,
    popular: false,
    savings: 100
  });

  const plans = [
    { 
      type: 'weekly', 
      price: 49, 
      originalPrice: 299,
      period: 'week', 
      description: 'Billed weekly',
      discount: 33,
      popular: false,
      savings: 100
    },
    { 
      type: 'monthly', 
      price: 149, 
      originalPrice: 899,
      period: 'month', 
      description: 'Billed monthly',
      discount: 33,
      popular: true,
      savings: 300
    },
    { 
      type: 'yearly', 
      price: 1499, 
      originalPrice: 8999,
      period: 'year', 
      description: 'Billed yearly',
      discount: 33,
      popular: false,
      savings: 3000
    },
  ];

  const [activeFaq, setActiveFaq] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  
  const toggleContainerRef = useRef(null);

  const featureCategories = [
    {
      features: [
        { icon: FileText, text: "Access to 500+ premium plant guides", color: "text-blue-600" },
        { icon: Users, text: "Detailed growing and care instructions", color: "text-pink-600" },
        { icon: Globe, text: "Seasonal planting calendar", color: "text-violet-600" },
        { icon: Bell, text: "Priority customer support", color: "text-pink-600" },
      ]
    }
  ];

  const faqs = [
    {
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription at any time from your account settings. You\'ll continue to have access until the end of your current billing period. No cancellation fees apply.'
    },
    {
      question: 'Can I switch between billing cycles?',
      answer: 'Yes! You can upgrade or downgrade your billing cycle at any time. When upgrading, you\'ll be charged the prorated difference immediately. When downgrading, the change takes effect at your next billing cycle.'
    },
    {
      question: 'Is there a refund policy?',
      answer: 'We offer a 7-day money-back guarantee for all new subscriptions. If you\'re not satisfied within the first week, contact our support team for a full refund, no questions asked.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods including UPI (PhonePe, Google Pay, Paytm, BHIM), credit cards, debit cards, net banking, and digital wallets. All payments are processed securely through Razorpay.'
    },
    {
      question: 'Do I get access to all features immediately?',
      answer: 'Yes! Once your payment is confirmed, you get instant access to all premium features including the complete plant database, video tutorials, expert consultations, and mobile app.'
    },
    {
      question: 'Can I use my subscription on multiple devices?',
      answer: 'Absolutely! Your premium subscription works across all your devices - desktop, mobile, and tablet. Simply log in with your account credentials to access your subscription anywhere.'
    }
  ];

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          setRazorpayLoaded(true);
          resolve(true);
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => resolve(false);
        document.head.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  // Scroll tracking for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update toggle container data attribute for animations
  useEffect(() => {
    if (toggleContainerRef.current) {
      toggleContainerRef.current.setAttribute('data-plan', selectedPlan.type);
    }
  }, [selectedPlan.type]);

  const updateSubscriptionStatus = (paymentId) => {
    const subscriptionData = {
      isActive: true,
      plan: selectedPlan.type,
      expiryDate: getExpiryDate(selectedPlan.type),
      paymentId: paymentId,
      subscribedAt: new Date().toISOString(),
      amount: selectedPlan.price
    };
    
    localStorage.setItem('subscriptionStatus', JSON.stringify(subscriptionData));
  };

  const handlePlanSelect = (plan) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    setTimeout(() => {
      setSelectedPlan(plan);
      setIsAnimating(false);
    }, 300);
  };

  // ==================== RAZORPAY INTEGRATION AREA ====================
  
  // Step 1: Create Razorpay Order on your backend
  const createRazorpayOrder = async () => {
    try {
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          amount: selectedPlan.price * 100, // Amount in paise
          currency: 'INR',
          plan: selectedPlan.type,
          userId: localStorage.getItem('userId') || 'user123'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await response.json();
      return orderData;
    } catch (error) {
      console.error('Error creating order:', error);
      
      // Fallback for demo purposes - REMOVE THIS IN PRODUCTION
      return { 
        id: `order_${Math.random().toString(36).substr(2, 9)}`,
        amount: selectedPlan.price * 100,
        currency: 'INR',
        key: 'YOUR_RAZORPAY_KEY_HERE' // Replace with your actual key
      };
    }
  };

  // Step 2: Handle Razorpay Payment
  const handleRazorpayPayment = (orderData) => {
    const razorpayOptions = {
      key: orderData.key || 'YOUR_RAZORPAY_KEY_HERE', // Replace with your Razorpay key ID
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.id,
      name: 'GreenGuide Premium',
      description: `${selectedPlan.type.charAt(0).toUpperCase() + selectedPlan.type.slice(1)} Subscription`,
      image: '/logo192.png', // Your app logo
      handler: function (response) {
        // Payment successful
        console.log('Payment successful:', response);
        updateSubscriptionStatus(response.razorpay_payment_id);
        setSuccessModalOpen(true);
        
        // Step 3: Verify payment on backend (important for security)
        verifyPayment(response);
      },
      prefill: {
        name: localStorage.getItem('userName') || 'User',
        email: localStorage.getItem('userEmail') || 'user@example.com',
        contact: localStorage.getItem('userPhone') || '9999999999'
      },
      theme: {
        color: '#22c55e' // Your brand color
      },
      modal: {
        ondismiss: function() {
          // Payment cancelled by user
          console.log('Payment cancelled by user');
          setPaymentLoading(false);
        }
      },
      retry: {
        enabled: true,
        max_count: 3
      }
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    
    // Handle payment failure
    razorpay.on('payment.failed', function (response){
      console.log('Payment failed:', response.error);
      alert('Payment failed: ' + response.error.description);
      setPaymentLoading(false);
    });

    razorpay.open();
  };

  // Step 4: Verify payment on backend (CRITICAL for security)
  const verifyPayment = async (paymentResponse) => {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          plan: selectedPlan.type
        })
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const data = await response.json();
      console.log('Payment verified:', data);
      
    } catch (error) {
      console.error('Payment verification error:', error);
      // Handle verification failure - you might want to show a warning
      // but don't revoke access immediately as payment might still be valid
    }
  };

  // Main subscribe handler
  const handleSubscribe = async () => {
    if (!razorpayLoaded) {
      alert('Payment gateway is still loading. Please wait a moment and try again.');
      return;
    }

    setPaymentLoading(true);

    try {
      // Step 1: Create order on backend
      const orderData = await createRazorpayOrder();
      
      // Step 2: Open Razorpay checkout
      handleRazorpayPayment(orderData);

    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Failed to initiate payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  // ==================== END RAZORPAY INTEGRATION AREA ====================

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getNextBillingDate = (planType) => {
    const now = new Date();
    let nextDate;
    switch (planType) {
      case 'weekly':
        nextDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        nextDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        break;
      case 'yearly':
        nextDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        break;
      default:
        nextDate = now;
    }
    return nextDate.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getExpiryDate = (planType) => {
    const now = new Date();
    let expiryDate;
    switch (planType) {
      case 'weekly':
        expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        expiryDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        break;
      case 'yearly':
        expiryDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        break;
      default:
        expiryDate = now;
    }
    return expiryDate.toISOString();
  };

  const getSavingsText = () => {
    if (selectedPlan.type === 'yearly') return 'Save 33%';
    if (selectedPlan.type === 'monthly') return 'Save 25%';
    return '';
  };

  return (
    <div className="subscription-page-wrapper">
      {/* Hero Section */}
      <section className="subscription-hero-section">
        <div className="subscription-hero-overlay"></div>
        <div className="subscription-hero-content">
          <h1 className="subscription-hero-title">Subscription Plans</h1>
          <p className="subscription-hero-subtitle">Unlock Premium Herbal Knowledge and Grow Your Virtual Garden</p>
        </div>
        <div className="subscription-hero-shimmer"></div>
      </section>

      <main className="subscription-main-content">
        {/* Pricing Section */}
        <section className="subscription-pricing-section">
          <div className="subscription-section-header">
            <h2 className="subscription-section-title">Choose Your Plan</h2>
            <p className="subscription-section-subtitle">
              Select your preferred billing cycle and unlock all premium features
            </p>
          </div>

          {/* Enhanced Billing Toggle */}
          <div className="subscription-billing-toggle">
            <div 
              ref={toggleContainerRef}
              className="subscription-toggle-container"
              data-plan={selectedPlan.type}
            >
              <div className="subscription-toggle-slider"></div>
              {plans.map((plan, index) => (
                <button
                  key={plan.type}
                  className={`subscription-toggle-btn ${selectedPlan.type === plan.type ? 'active' : ''} ${isAnimating ? 'animating' : ''}`}
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isAnimating}
                >
                  <span className="subscription-toggle-label">
                    {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
                  </span>
                  {(plan.type === 'yearly' || plan.type === 'monthly') && (
                    <span className="subscription-save-badge">
                      Save {plan.type === 'yearly' ? '33%' : '25%'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Card */}
          <div className="subscription-pricing-container">
            <div className="subscription-pricing-card">
              <div className="subscription-card-header">
                <h3 className="subscription-plan-name">Premium Plan</h3>
              </div>

              <div className="subscription-price-section">
                <div className="subscription-price-display">
                  <span className="subscription-currency">₹</span>
                  <span className="subscription-price-amount">{selectedPlan.price}</span>
                  <span className="subscription-price-period">/{selectedPlan.period}</span>
                </div>
                <p className="subscription-price-description">{selectedPlan.description}</p>
                {selectedPlan.originalPrice > selectedPlan.price && (
                  <div className="subscription-savings-info">
                    <span className="subscription-original-price">₹{selectedPlan.originalPrice}</span>
                    <span className="subscription-savings-badge">
                      {getSavingsText()}
                    </span>
                  </div>
                )}
              </div>

              <div className="subscription-features-section">
                <h4 className="subscription-features-title">Premium Features:</h4>
                <ul className="subscription-features-list">
                  {featureCategories[0].features.map((feature, index) => (
                    <li key={index} className="subscription-features-item">
                      <CheckCircle className="subscription-feature-icon" />
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                className="subscription-subscribe-btn"
                onClick={handleSubscribe}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <>
                    <Loader className="subscription-loading-spinner" />
                    Processing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="subscription-comparison-section">
          <h2 className="subscription-section-title">Free vs Premium Features</h2>
          <div className="subscription-comparison-container">
            <table className="subscription-comparison-table">
              <thead>
                <tr>
                  <th className="subscription-comparison-header">Features</th>
                  <th className="subscription-comparison-header">Free Account</th>
                  <th className="subscription-comparison-header">Premium Account</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Basic plant information', '✓', '✓'],
                  ['Plant database access', '50+ plants', '500+ plants'],
                  ['Detailed growing guides', '✗', '✓'],
                  ['Priority support', '✗', '✓']
                ].map((row, index) => (
                  <tr key={index} className="subscription-comparison-row">
                    <td className="subscription-comparison-cell">{row[0]}</td>
                    <td className={`subscription-comparison-cell ${row[1] === '✓' ? 'subscription-check-mark' : row[1] === '✗' ? 'subscription-cross-mark' : 'subscription-free-feature'}`}>{row[1]}</td>
                    <td className={`subscription-comparison-cell ${row[2] === '✓' ? 'subscription-check-mark' : 'subscription-premium-feature'}`}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Enhanced FAQ Section */}
        <section className="subscription-faq-section">
          <h2 className="subscription-section-title">Frequently Asked Questions</h2>
          <div className="subscription-faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className={`subscription-faq-item ${activeFaq === index ? 'active' : ''}`}>
                <div
                  className="subscription-faq-question"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <h4 className="subscription-faq-title">{faq.question}</h4>
                  <div className="subscription-faq-icon">
                    {activeFaq === index ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>
                <div className="subscription-faq-answer">
                  <p className="subscription-faq-content">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Success Modal - Only shown after successful payment */}
      {successModalOpen && (
        <div className="subscription-modal-overlay">
          <div className="subscription-modal-content">
            <button 
              className="subscription-modal-close"
              onClick={() => setSuccessModalOpen(false)}
            >
              <X />
            </button>
            
            <div className="subscription-modal-body">
              <div className="subscription-success-icon">
                <CheckCircle />
              </div>
              
              <h2 className="subscription-modal-title">Welcome to GreenGuide Premium!</h2>
              <p className="subscription-success-message">Your {selectedPlan.type} subscription is now active.</p>

              <div className="subscription-subscription-details">
                <div className="subscription-detail-row">
                  <span>Plan:</span>
                  <span>Premium - {selectedPlan.type.charAt(0).toUpperCase() + selectedPlan.type.slice(1)}</span>
                </div>
                <div className="subscription-detail-row">
                  <span>Amount Paid:</span>
                  <span className="amount">₹{selectedPlan.price}</span>
                </div>
                <div className="subscription-detail-row">
                  <span>Next Billing:</span>
                  <span>{getNextBillingDate(selectedPlan.type)}</span>
                </div>
              </div>

              <div className="subscription-next-steps">
                <h4>What's Next?</h4>
                <ul>
                  <li>
                    <CheckCircle />
                    Access all 500+ premium plant guides
                  </li>
                  <li>
                    <CheckCircle />
                    Join expert Q&A sessions
                  </li>
                  <li>
                    <CheckCircle />
                    Download our mobile app
                  </li>
                </ul>
              </div>

              <button 
                className="subscription-start-exploring-btn"
                onClick={() => setSuccessModalOpen(false)}
              >
                Start Exploring
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <div className="back-to-top show" onClick={scrollToTop}>
          <i className="fas fa-chevron-up"></i>
        </div>
      )}
  
    </div>
  );
}

export default Subscribe;