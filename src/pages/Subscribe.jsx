// src/pages/Subscribe.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Users, Shield, Globe, Headphones, MessageCircle, 
  Bell, Smartphone, ArrowUp, X, Clock, QrCode, ChevronDown, 
  ChevronUp, Loader, CheckCircle, XCircle, CreditCard
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

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [orderId, setOrderId] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentTimer, setPaymentTimer] = useState(600);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  
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

  // Timer for payment
  useEffect(() => {
    let timerInterval;
    if (paymentModalOpen && paymentStatus === 'pending' && paymentTimer > 0) {
      timerInterval = setInterval(() => {
        setPaymentTimer(prev => {
          if (prev <= 1) {
            setPaymentStatus('timeout');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [paymentModalOpen, paymentStatus, paymentTimer]);

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

  // Payment status polling
  useEffect(() => {
    let statusInterval;
    if (orderId && paymentStatus === 'pending') {
      statusInterval = setInterval(async () => {
        try {
          // Simulate payment verification - replace with actual API call
          const response = await fetch(`/api/payment-status/${orderId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to check payment status');
          }

          const data = await response.json();
          
          if (data.status === 'success') {
            setPaymentStatus('success');
            setPaymentModalOpen(false);
            setSuccessModalOpen(true);
            updateSubscriptionStatus(data.paymentId);
            clearInterval(statusInterval);
          } else if (data.status === 'failed') {
            setPaymentStatus('failed');
            clearInterval(statusInterval);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
          // Simulate success for demo after 10 seconds
          if (Math.random() > 0.8) {
            setPaymentStatus('success');
            setPaymentModalOpen(false);
            setSuccessModalOpen(true);
            updateSubscriptionStatus(`pay_${Date.now()}`);
            clearInterval(statusInterval);
          }
        }
      }, 3000);
    }

    return () => {
      if (statusInterval) clearInterval(statusInterval);
    };
  }, [orderId, paymentStatus]);

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

  const createRazorpayOrder = async () => {
    try {
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          amount: selectedPlan.price * 100,
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
      // Fallback for demo
      return { 
        id: `order_${Math.random().toString(36).substr(2, 9)}`,
        amount: selectedPlan.price * 100,
        currency: 'INR',
        key: 'rzp_test_1234567890' // Replace with your test key
      };
    }
  };

  const generateUPIQRCode = async (orderId, amount) => {
    try {
      const response = await fetch('/api/generate-upi-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          orderId,
          amount,
          currency: 'INR'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const qrData = await response.json();
      return qrData.qrCodeUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      // Fallback QR code for demo
      const upiString = `upi://pay?pa=merchant@paytm&pn=GreenGuide&am=${amount/100}&cu=INR&tn=Premium Subscription Payment&tr=${orderId}`;
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
    }
  };

  const handleSubscribe = async () => {
    if (!razorpayLoaded) {
      alert('Payment gateway is still loading. Please wait a moment and try again.');
      return;
    }

    setPaymentLoading(true);

    try {
      const orderData = await createRazorpayOrder();
      setOrderId(orderData.id);
      
      if (selectedPaymentMethod === 'upi') {
        const qrCodeUrl = await generateUPIQRCode(orderData.id, orderData.amount);
        setQrCode(qrCodeUrl);
        setPaymentTimer(600);
        setPaymentStatus('pending');
        setPaymentModalOpen(true);
      } else {
        // Handle card/net banking through Razorpay
        handleRazorpayPayment(orderData);
      }

    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleRazorpayPayment = (orderData) => {
    const razorpayOptions = {
      key: orderData.key || 'rzp_test_1234567890', // Replace with your Razorpay key
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.id,
      name: 'GreenGuide Premium',
      description: `${selectedPlan.type.charAt(0).toUpperCase() + selectedPlan.type.slice(1)} Subscription`,
      image: '/logo192.png',
      handler: function (response) {
        setPaymentStatus('success');
        setPaymentModalOpen(false);
        setSuccessModalOpen(true);
        updateSubscriptionStatus(response.razorpay_payment_id);
        
        // Verify payment on backend
        verifyPayment(response);
      },
      prefill: {
        name: localStorage.getItem('userName') || 'User',
        email: localStorage.getItem('userEmail') || 'user@example.com',
        contact: localStorage.getItem('userPhone') || '9999999999'
      },
      theme: {
        color: '#22c55e'
      },
      modal: {
        ondismiss: function() {
          setPaymentLoading(false);
        }
      }
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  };

  const verifyPayment = async (paymentResponse) => {
    try {
      await fetch('/api/verify-payment', {
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
    } catch (error) {
      console.error('Payment verification error:', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
    <div className="subscription-page">
      {/* Hero Section */}
      <section className="sub-hero-section">
        <div className="sub-hero-overlay"></div>
        <div className="sub-hero-content">
          <h1 className="sub-hero-title">Subscription Plans</h1>
          <p className="sub-hero-subtitle">Unlock Premium Herbal Knowledge and Grow Your Virtual Garden</p>
        </div>
        <div className="sub-hero-shimmer"></div>
      </section>

      <main className="sub-main-content">
        {/* Pricing Section */}
        <section className="sub-pricing-section">
          <div className="sub-section-header">
            <h2 className="sub-section-title">Choose Your Plan</h2>
            <p className="sub-section-subtitle">
              Select your preferred billing cycle and unlock all premium features
            </p>
          </div>

          {/* Enhanced Billing Toggle */}
          <div className="sub-billing-toggle">
            <div 
              ref={toggleContainerRef}
              className="sub-toggle-container"
              data-plan={selectedPlan.type}
            >
              <div className="sub-toggle-slider"></div>
              {plans.map((plan, index) => (
                <button
                  key={plan.type}
                  className={`sub-toggle-btn ${selectedPlan.type === plan.type ? 'active' : ''} ${isAnimating ? 'animating' : ''}`}
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isAnimating}
                >
                  <span className="sub-toggle-label">
                    {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
                  </span>
                  {(plan.type === 'yearly' || plan.type === 'monthly') && (
                    <span className="sub-save-badge">
                      Save {plan.type === 'yearly' ? '33%' : '25%'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Card */}
          <div className="sub-pricing-container">
            <div className="sub-pricing-card">
              <div className="sub-card-header">
                <h3 className="sub-plan-name">Premium Plan</h3>
              </div>

              <div className="sub-price-section">
                <div className="sub-price-display">
                  <span className="sub-currency">₹</span>
                  <span className="sub-price-amount">{selectedPlan.price}</span>
                  <span className="sub-price-period">/{selectedPlan.period}</span>
                </div>
                <p className="sub-price-description">{selectedPlan.description}</p>
                {selectedPlan.originalPrice > selectedPlan.price && (
                  <div className="sub-savings-info">
                    <span className="sub-original-price">₹{selectedPlan.originalPrice}</span>
                    <span className="sub-savings-badge">
                      {getSavingsText()}
                    </span>
                  </div>
                )}
              </div>

              <div className="sub-features-section">
                <h4 className="sub-features-title">Premium Features:</h4>
                <ul className="sub-features-list">
                  {featureCategories[0].features.map((feature, index) => (
                    <li key={index} className="sub-features-item">
                      <CheckCircle className="sub-feature-icon" />
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                className="sub-subscribe-btn"
                onClick={handleSubscribe}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <>
                    <Loader className="sub-loading-spinner" />
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
        <section className="sub-comparison-section">
          <h2 className="sub-section-title">Free vs Premium Features</h2>
          <div className="sub-comparison-container">
            <table className="sub-comparison-table">
              <thead>
                <tr>
                  <th className="sub-comparison-header">Features</th>
                  <th className="sub-comparison-header">Free Account</th>
                  <th className="sub-comparison-header">Premium Account</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Basic plant information', '✓', '✓'],
                  ['Plant database access', '50+ plants', '500+ plants'],
                  ['Detailed growing guides', '✗', '✓'],
                  ['Priority support', '✗', '✓']
                ].map((row, index) => (
                  <tr key={index} className="sub-comparison-row">
                    <td className="sub-comparison-cell">{row[0]}</td>
                    <td className={`sub-comparison-cell ${row[1] === '✓' ? 'sub-check-mark' : row[1] === '✗' ? 'sub-cross-mark' : 'sub-free-feature'}`}>{row[1]}</td>
                    <td className={`sub-comparison-cell ${row[2] === '✓' ? 'sub-check-mark' : 'sub-premium-feature'}`}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Enhanced FAQ Section */}
        <section className="sub-faq-section">
          <h2 className="sub-section-title">Frequently Asked Questions</h2>
          <div className="sub-faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className={`sub-faq-item ${activeFaq === index ? 'active' : ''}`}>
                <button
                  className="sub-faq-question"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <h3 className="sub-faq-title">{faq.question}</h3>
                  <div className="sub-faq-icon">
                    {activeFaq === index ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </button>
                <div className="sub-faq-answer">
                  <div className="sub-faq-content">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Payment Modal */}
      {paymentModalOpen && (
        <div className="sub-modal-overlay">
          <div className="sub-modal-content">
            <button 
              className="sub-modal-close"
              onClick={() => setPaymentModalOpen(false)}
            >
              <X />
            </button>
            
            <div className="sub-modal-body">
              <h2 className="sub-modal-title">Complete Your Payment</h2>

              <div className="sub-plan-summary">
                <h3>Premium Plan - {selectedPlan.type.charAt(0).toUpperCase() + selectedPlan.type.slice(1)}</h3>
                <p className="sub-plan-price">₹{selectedPlan.price}/{selectedPlan.period}</p>
              </div>

              <div className="sub-payment-methods">
                <h4>Choose Payment Method</h4>
                <div className="sub-method-options">
                  <button
                    className={`sub-method-option ${selectedPaymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setSelectedPaymentMethod('upi')}
                  >
                    <QrCode />
                    UPI/QR
                  </button>
                  <button
                    className={`sub-method-option ${selectedPaymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setSelectedPaymentMethod('card')}
                  >
                    <CreditCard />
                    Cards
                  </button>
                </div>
              </div>

              {selectedPaymentMethod === 'upi' && (
                <div className="sub-upi-section">
                  <div className="sub-qr-container">
                    {qrCode ? (
                      <div className="sub-qr-wrapper">
                        <img src={qrCode} alt="UPI QR Code" className="sub-qr-code" />
                      </div>
                    ) : (
                      <div className="sub-qr-placeholder">
                        <Loader className="sub-qr-loader" />
                        <p>Generating QR...</p>
                      </div>
                    )}
                  </div>
                  <p className="sub-qr-instruction">Scan with any UPI app</p>
                  <p className="sub-upi-apps">PhonePe • Google Pay • Paytm • BHIM</p>
                  
                  <div className="sub-payment-status">
                    {paymentStatus === 'pending' && (
                      <>
                        <Clock className="sub-status-icon" />
                        <div className="sub-status-text">
                          <p>Waiting for payment...</p>
                          <p className="sub-timer">Time: {formatTime(paymentTimer)}</p>
                        </div>
                      </>
                    )}
                    {paymentStatus === 'timeout' && (
                      <>
                        <XCircle className="sub-status-icon error" />
                        <p>Payment timeout. Please try again.</p>
                      </>
                    )}
                    {paymentStatus === 'failed' && (
                      <>
                        <XCircle className="sub-status-icon error" />
                        <p>Payment failed. Please try again.</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'card' && (
                <div className="sub-card-section">
                  <button
                    className="sub-card-payment-btn"
                    onClick={() => handleRazorpayPayment({ 
                      id: orderId, 
                      amount: selectedPlan.price * 100, 
                      currency: 'INR',
                      key: 'rzp_test_1234567890'
                    })}
                  >
                    Pay with Card/NetBanking
                  </button>
                  <p className="sub-secure-note">Secure payment powered by Razorpay</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModalOpen && (
        <div className="sub-modal-overlay">
          <div className="sub-modal-content">
            <button 
              className="sub-modal-close"
              onClick={() => setSuccessModalOpen(false)}
            >
              <X />
            </button>
            
            <div className="sub-modal-body">
              <div className="sub-success-icon">
                <CheckCircle />
              </div>
              
              <h2 className="sub-modal-title">Welcome to GreenGuide Premium!</h2>
              <p className="sub-success-message">Your {selectedPlan.type} subscription is now active.</p>

              <div className="sub-subscription-details">
                <div className="sub-detail-row">
                  <span>Plan:</span>
                  <span>Premium - {selectedPlan.type.charAt(0).toUpperCase() + selectedPlan.type.slice(1)}</span>
                </div>
                <div className="sub-detail-row">
                  <span>Amount Paid:</span>
                  <span className="amount">₹{selectedPlan.price}</span>
                </div>
                <div className="sub-detail-row">
                  <span>Next Billing:</span>
                  <span>{getNextBillingDate(selectedPlan.type)}</span>
                </div>
              </div>

              <div className="sub-next-steps">
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
                className="sub-start-exploring-btn"
                onClick={() => setSuccessModalOpen(false)}
              >
                Start Exploring
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        className={`sub-back-to-top ${showBackToTop ? 'show' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <ArrowUp />
      </button>
    </div>
  );
}

export default Subscribe;