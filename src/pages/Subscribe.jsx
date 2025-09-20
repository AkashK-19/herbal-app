// src/pages/Subscribe.jsx
import React, { useState, useEffect } from 'react';
import '../styles/sub.css';

function Subscribe() {
  const [selectedPlan, setSelectedPlan] = useState({
    type: 'weekly',
    price: 49,
    period: 'week',
    description: 'Billed weekly',
    originalPrice: 299
  });

  const plans = [
    { 
      type: 'weekly', 
      price: 49, 
      originalPrice: 69,
      period: 'week', 
      description: 'Billed weekly',
      discount: 30,
      popular: false
    },
    { 
      type: 'monthly', 
      price: 149, 
      originalPrice: 299,
      period: 'month', 
      description: 'Billed monthly',
      discount: 50,
      popular: true
    },
    { 
      type: 'yearly', 
      price: 1499, 
      originalPrice: 3750,
      period: 'year', 
      description: 'Billed yearly',
      discount: 60,
      popular: false
    },
  ];

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [paymentStatus, setPaymentStatus] = useState('waiting');
  const [qrFilled, setQrFilled] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [priceAnimation, setPriceAnimation] = useState('');
  const [usageStats, setUsageStats] = useState({
    plantsViewed: 0,
    videosWatched: 0,
    questionsAsked: 0
  });

  const faqs = [
    {
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription at any time from your account settings. You\'ll continue to have access until the end of your current billing period.',
    },
    {
      question: 'Can I switch between billing cycles?',
      answer: 'Yes! You can change from weekly to monthly or yearly billing at any time. Changes will take effect at your next billing cycle.',
    },
    {
      question: 'Is there a refund policy?',
      answer: 'We offer a 7-day money-back guarantee for all new subscriptions. If you\'re not satisfied, contact us for a full refund.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept UPI, credit cards, debit cards, net banking, and digital wallets. You can pay via QR code or card details.',
    },
    {
      question: 'Do you offer student discounts?',
      answer: 'Yes! We offer a 20% student discount. Contact our support team with your valid student ID to apply the discount.',
    },
    {
      question: 'Can I share my account with family members?',
      answer: 'Each subscription is for individual use. We offer family plans at discounted rates for multiple users.',
    }
  ];

  // Animate usage stats on component mount
  useEffect(() => {
    const intervals = [
      setTimeout(() => setUsageStats(prev => ({ ...prev, plantsViewed: 47 })), 500),
      setTimeout(() => setUsageStats(prev => ({ ...prev, videosWatched: 12 })), 1000),
      setTimeout(() => setUsageStats(prev => ({ ...prev, questionsAsked: 8 })), 1500),
    ];
    return () => intervals.forEach(clearTimeout);
  }, []);

  // Handle plan selection with animation
  const handlePlanSelect = (plan) => {
    setPriceAnimation('greenguide-price-changing');
    setTimeout(() => {
      setSelectedPlan(plan);
      setPriceAnimation('');
    }, 150);
  };

  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const generateQRCode = () => {
    setQrFilled(Array.from({ length: 16 }, () => Math.random() > 0.4));
  };

  // Enhanced countdown timer with visual feedback
  useEffect(() => {
    let timer;
    if (paymentModalOpen && timeLeft > 0 && paymentStatus === 'waiting') {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      setPaymentStatus('timeout');
    }
    return () => clearInterval(timer);
  }, [paymentModalOpen, timeLeft, paymentStatus]);

  // Enhanced payment simulation
  useEffect(() => {
    if (paymentModalOpen) {
      generateQRCode();
      setTimeLeft(300);
      setPaymentStatus('waiting');

      const delays = [3000, 7000, 12000];
      delays.forEach((delay, index) => {
        setTimeout(() => {
          if (paymentStatus === 'waiting') {
            setPaymentStatus(`processing${index + 1}`);
          }
        }, delay);
      });

      const paymentTimer = setTimeout(() => {
        if (Math.random() > 0.15) {
          setPaymentStatus('success');
          setTimeout(() => {
            setPaymentModalOpen(false);
            setSuccessModalOpen(true);
          }, 1500);
        } else {
          setPaymentStatus('failed');
        }
      }, 15000);

      return () => clearTimeout(paymentTimer);
    }
  }, [paymentModalOpen]);

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
    return nextDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleSubscribe = () => {
    setPaymentModalOpen(true);
  };

  const refreshPayment = () => {
    setPaymentStatus('waiting');
    setTimeLeft(300);
    generateQRCode();
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="greenguide-subscription-wrapper">
      <div className="greenguide-hero-section">
        <div className="greenguide-hero-content">
          <h1>🌿 Premium Plant Care</h1>
          <p>Transform your gardening journey with expert guidance and AI-powered plant care</p>
          
          <div className="greenguide-usage-stats">
            <div className="greenguide-stat-item">
              <span className="greenguide-stat-number">{usageStats.plantsViewed}</span>
              <div className="greenguide-stat-label">Plants Discovered</div>
            </div>
            <div className="greenguide-stat-item">
              <span className="greenguide-stat-number">{usageStats.videosWatched}</span>
              <div className="greenguide-stat-label">Videos Watched</div>
            </div>
            <div className="greenguide-stat-item">
              <span className="greenguide-stat-number">{usageStats.questionsAsked}</span>
              <div className="greenguide-stat-label">Expert Answers</div>
            </div>
          </div>
        </div>
      </div>

      <div className="greenguide-main-content">
        <section className="greenguide-pricing-section">
          <h2 className="greenguide-section-title">Choose Your Growth Plan</h2>
          <p className="greenguide-section-subtitle">Unlock premium features and accelerate your plant care journey with our comprehensive subscription plans</p>

          <div className="greenguide-billing-toggle">
            <div className="greenguide-toggle-container">
              {plans.map((plan) => (
                <button
                  key={plan.type}
                  className={`greenguide-toggle-btn ${selectedPlan.type === plan.type ? 'greenguide-active' : ''}`}
                  onClick={() => handlePlanSelect(plan)}
                >
                  {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
                  {plan.type === 'yearly' && <span className="greenguide-save-badge">Save {plan.discount}%</span>}
                  {plan.popular && <span className="greenguide-popular-badge">Popular</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="greenguide-pricing-container">
            <div className="greenguide-pricing-card">
              {selectedPlan.popular && <div className="greenguide-most-popular-badge">🔥 Most Popular</div>}
              
              <div className="greenguide-plan-header">
                <div className="greenguide-plan-icon">🌱</div>
                <h3 className="greenguide-plan-name">GreenGuide Premium</h3>
              </div>
              
              <div className="greenguide-price-section">
                <div className={`greenguide-price-display ${priceAnimation}`}>
                  <span className="greenguide-price-original">₹{selectedPlan.originalPrice}</span>
                  <span className="greenguide-currency">₹</span>
                  <span className="greenguide-price-amount">{selectedPlan.price}</span>
                  <span className="greenguide-price-period">/{selectedPlan.period}</span>
                  <span className="greenguide-discount-badge">{selectedPlan.discount}% OFF</span>
                </div>
                <p className="greenguide-price-description">{selectedPlan.description}</p>
                <p className="greenguide-next-billing">
                  Next billing: {getNextBillingDate(selectedPlan.type)}
                </p>
              </div>
              
              <div className="greenguide-features-section">
                <h4>Everything you need to succeed:</h4>
                <ul className="greenguide-plan-features">
                  <li>🔓 Access to 500+ premium plant guides</li>
                  <li>📚 Detailed growing and care instructions</li>
                  <li>🎥 HD video tutorials and expert demonstrations</li>
                  <li>📅 AI-powered seasonal planting calendar</li>
                  <li>🔍 Plant disease diagnosis with photo recognition</li>
                  <li>👨‍🌾 Live expert Q&A sessions (2x/month)</li>
                  <li>⚡ Priority 24/7 customer support</li>
                  <li>📱 Full mobile app access with offline mode</li>
                  <li>🗂️ Personalized garden planning tools</li>
                  <li>💬 Exclusive community forum access</li>
                  <li>📊 Advanced plant health analytics</li>
                  <li>🎯 Custom care reminders and notifications</li>
                </ul>
              </div>
              
              <button className="greenguide-subscribe-btn" onClick={handleSubscribe}>
                Start Premium Journey
              </button>
            </div>
          </div>
        </section>

        <section className="greenguide-comparison-section">
          <h2 className="greenguide-section-title">Feature Comparison</h2>
          <p className="greenguide-section-subtitle">See what you unlock with Premium membership</p>
          
          <table className="greenguide-comparison-table">
            <thead>
              <tr>
                <th>Features</th>
                <th>Free Account</th>
                <th>Premium Account</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Plant database access</td>
                <td>50+ basic plants</td>
                <td>500+ detailed guides</td>
              </tr>
              <tr>
                <td>Growing instructions</td>
                <td>Basic info only</td>
                <td>✅ Comprehensive guides</td>
              </tr>
              <tr>
                <td>Video tutorials</td>
                <td>1 per month</td>
                <td>✅ Unlimited HD videos</td>
              </tr>
              <tr>
                <td>Expert consultations</td>
                <td>❌</td>
                <td>✅ Live sessions</td>
              </tr>
              <tr>
                <td>Disease diagnosis</td>
                <td>❌</td>
                <td>✅ AI-powered recognition</td>
              </tr>
              <tr>
                <td>Mobile app features</td>
                <td>Limited</td>
                <td>✅ Full access + offline</td>
              </tr>
              <tr>
                <td>Customer support</td>
                <td>Email only</td>
                <td>✅ Priority 24/7 support</td>
              </tr>
              <tr>
                <td>Garden planning tools</td>
                <td>❌</td>
                <td>✅ Advanced AI tools</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="greenguide-faq-section">
          <h2 className="greenguide-section-title">Frequently Asked Questions</h2>
          <p className="greenguide-section-subtitle">Everything you need to know about our Premium subscription</p>
          
          {faqs.map((faq, index) => (
            <div className={`greenguide-faq-item ${activeFaq === index ? 'greenguide-faq-active' : ''}`} key={index}>
              <div className="greenguide-faq-question" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                <h3>{faq.question}</h3>
                <span className="greenguide-faq-toggle">+</span>
              </div>
              <div className="greenguide-faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Enhanced Payment Modal */}
      {paymentModalOpen && (
        <div className="greenguide-modal greenguide-modal-show">
          <div className="greenguide-modal-content">
            <span className="greenguide-close" onClick={() => setPaymentModalOpen(false)}>×</span>
            <div className="greenguide-modal-header">
              <h2>Complete Your Subscription</h2>
            </div>
            <div className="greenguide-modal-body">
              <div className="greenguide-plan-details">
                <h3>📦 Subscription Summary</h3>
                <p><strong>Plan:</strong> Premium - {capitalizeFirst(selectedPlan.type)}</p>
                <p><strong>Amount:</strong> ₹{selectedPlan.price}/{selectedPlan.period}</p>
                <p><strong>You Save:</strong> ₹{selectedPlan.originalPrice - selectedPlan.price} ({selectedPlan.discount}% off)</p>
              </div>
              
              <div className="greenguide-payment-method">
                <h3>💳 Payment Method</h3>
                <button className="greenguide-payment-tab">UPI / QR Code Payment</button>
              </div>
              
              <div className="greenguide-payment-content">
                <div className="greenguide-qr-section">
                  <div className="greenguide-qr-placeholder">
                    <div className="greenguide-qr-grid">
                      {qrFilled.map((filled, i) => (
                        <div key={i} className={`greenguide-qr-square ${filled ? 'greenguide-qr-filled' : ''}`}></div>
                      ))}
                    </div>
                  </div>
                  <p><strong>Scan with any UPI app to pay</strong></p>
                  <p>💳 Supports: PhonePe • Google Pay • Paytm • BHIM • Amazon Pay</p>
                </div>
                
                <div className="greenguide-payment-status">
                  {paymentStatus === 'waiting' && (
                    <>
                      <div className="greenguide-status-icon">⏳</div>
                      <p>Waiting for payment confirmation...</p>
                      <div className={`greenguide-status-timer ${timeLeft < 60 ? 'greenguide-timer-urgent' : ''}`}>
                        ⏰ Time remaining: {formatTimer(timeLeft)}
                      </div>
                      <div className="greenguide-loading-bar">
                        <div 
                          className="greenguide-loading-progress" 
                          style={{width: `${((300 - timeLeft) / 300) * 100}%`}}
                        ></div>
                      </div>
                    </>
                  )}
                  {paymentStatus.startsWith('processing') && (
                    <>
                      <div className="greenguide-status-icon">🔄</div>
                      <p>Processing your payment securely...</p>
                      <div className="greenguide-loading-bar">
                        <div className="greenguide-loading-progress" style={{width: '75%'}}></div>
                      </div>
                    </>
                  )}
                  {paymentStatus === 'timeout' && (
                    <>
                      <div className="greenguide-status-icon">⏰</div>
                      <p>Payment session expired</p>
                      <button className="greenguide-subscribe-btn" onClick={refreshPayment}>
                        🔄 Generate New QR Code
                      </button>
                    </>
                  )}
                  {paymentStatus === 'failed' && (
                    <>
                      <div className="greenguide-status-icon">❌</div>
                      <p>Payment failed. Please try again.</p>
                      <button className="greenguide-subscribe-btn" onClick={refreshPayment}>
                        🔄 Retry Payment
                      </button>
                    </>
                  )}
                  {paymentStatus === 'success' && (
                    <>
                      <div className="greenguide-status-icon">✅</div>
                      <p>Payment successful! Setting up your account...</p>
                      <div className="greenguide-loading-bar">
                        <div className="greenguide-loading-progress" style={{width: '100%'}}></div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Success Modal */}
      {successModalOpen && (
        <div className="greenguide-modal greenguide-success-modal greenguide-modal-show">
          <div className="greenguide-modal-content">
            <span className="greenguide-close" onClick={() => setSuccessModalOpen(false)}>×</span>
            <div className="greenguide-success-header">
              <div className="greenguide-success-icon">🎉</div>
              <h3>Welcome to GreenGuide Premium!</h3>
              <p>Your {capitalizeFirst(selectedPlan.type)} subscription is now active</p>
            </div>
            <div className="greenguide-success-content">
              <div className="greenguide-subscription-details">
                <div className="greenguide-detail-row">
                  <span>📋 Plan:</span>
                  <span>Premium - {capitalizeFirst(selectedPlan.type)}</span>
                </div>
                <div className="greenguide-detail-row">
                  <span>💰 Amount Paid:</span>
                  <span>₹{selectedPlan.price}</span>
                </div>
                <div className="greenguide-detail-row">
                  <span>💾 You Saved:</span>
                  <span>₹{selectedPlan.originalPrice - selectedPlan.price}</span>
                </div>
                <div className="greenguide-detail-row">
                  <span>📅 Next Billing:</span>
                  <span>{getNextBillingDate(selectedPlan.type)}</span>
                </div>
              </div>
              
              <div className="greenguide-next-steps">
                <h4>🚀 What's Next?</h4>
                <ul>
                  <li>Explore 500+ premium plant guides instantly</li>
                  <li>Watch exclusive HD video tutorials</li>
                  <li>Join your first expert Q&A session</li>
                  <li>Download our mobile app for offline access</li>
                  <li>Set up your personalized garden planner</li>
                  <li>Connect with our premium community</li>
                </ul>
              </div>
              
              <button className="greenguide-modal-btn" onClick={() => setSuccessModalOpen(false)}>
                🌱 Start Exploring Premium
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button className="greenguide-back-to-top greenguide-back-visible" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
}

export default Subscribe;