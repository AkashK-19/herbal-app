import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { X, Clock, Loader, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import '../styles/sub.css'; // Reusing the same CSS for styling

// Utility to calculate expiry date
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

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  // Get the selected plan details passed from the Subscribe page
  const selectedPlan = location.state?.selectedPlan;

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const RAZORPAY_CONFIG = {
    
    key: "rzp_test_RLS7TfoeJxs46K", 
    name: "GreenGuide Premium",
    description: "Premium Plant Care Subscription",
    image: "/logo192.png", 
    theme: {
      color: "#22c55e"
    }
  };

  // Redirect if no plan is selected
  useEffect(() => {
    if (!selectedPlan) {
      navigate('/subscribe', { replace: true });
    }
  }, [selectedPlan, navigate]);

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
        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          setPaymentError('Failed to load payment gateway. Please refresh and try again.');
          resolve(false);
        };
        document.head.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  const updateSubscriptionStatus = (paymentDetails) => {
    const subscriptionData = {
      isActive: true,
      plan: selectedPlan.type,
      expiryDate: getExpiryDate(selectedPlan.type),
      paymentId: paymentDetails.razorpay_payment_id,
      orderId: paymentDetails.razorpay_order_id || `order_${Date.now()}`,
      subscribedAt: new Date().toISOString(),
      amount: selectedPlan.price,
      nextBilling: getNextBillingDate(selectedPlan.type)
    };
    
    // Store subscription data in localStorage for demo
    localStorage.setItem('subscriptionStatus', JSON.stringify(subscriptionData));
    
    // Also store user premium status
    localStorage.setItem('isPremiumUser', 'true');
    
    console.log('Subscription updated:', subscriptionData);
  };

  // Generate a unique order ID for demo purposes
  const generateOrderId = () => {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Handle Razorpay Payment
  const handleRazorpayPayment = () => {
    const orderId = generateOrderId();
    
    const razorpayOptions = {
      key: RAZORPAY_CONFIG.key,
      amount: selectedPlan.price * 100, // Amount in paise
      currency: 'INR',
      name: RAZORPAY_CONFIG.name,
      description: `${selectedPlan.type.charAt(0).toUpperCase() + selectedPlan.type.slice(1)} Subscription - ${RAZORPAY_CONFIG.description}`,
      image: RAZORPAY_CONFIG.image,
      order_id: orderId, // This would typically come from your backend
      handler: function (response) {
        // Payment successful
        console.log('Payment successful:', response);
        
        // Add our generated order ID to the response
        response.razorpay_order_id = orderId;
        
        updateSubscriptionStatus(response);
        setSuccessModalOpen(true);
        setPaymentLoading(false);
        
        // In production, you should verify this payment on your backend
        console.log('Payment completed. In production, verify this payment on your backend.');
      },
      prefill: {
        name: localStorage.getItem('userName') || 'Akash kapare',
        email: localStorage.getItem('userEmail') || 'akashkapare2005@gmail.com',
        contact: localStorage.getItem('userPhone') || '9403400841'
      },
      theme: RAZORPAY_CONFIG.theme,
      modal: {
        ondismiss: function() {
          // Payment cancelled by user
          console.log('Payment cancelled by user');
          setPaymentLoading(false);
          setPaymentError('Payment was cancelled. Please try again if you want to subscribe.');
        }
      },
      retry: {
        enabled: true,
        max_count: 3
      },
      // Additional options for better UX
      remember_customer: false,
      timeout: 900, // 15 minutes
      readonly: {
        email: false,
        contact: false,
        name: false
      },
      hidden: {
        email: false,
        contact: false,
        name: false
      }
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    
    // Handle payment failure
    razorpay.on('payment.failed', function (response) {
      console.log('Payment failed:', response.error);
      setPaymentError(`Payment failed: ${response.error.description || 'Unknown error occurred'}`);
      setPaymentLoading(false);
    });

    // Open Razorpay checkout
    razorpay.open();
  };

  // Main payment handler
  const handlePaymentStart = async () => {
    if (!razorpayLoaded) {
      setPaymentError('Payment gateway is still loading. Please wait a moment and try again.');
      return;
    }
    
    if (!selectedPlan) {
      setPaymentError('No plan selected. Please go back and select a plan.');
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);

    try {
      // For demo purposes, we'll directly open Razorpay
      // In production, you should first create an order on your backend
      handleRazorpayPayment();
      
    } catch (error) {
      console.error('Payment initiation error:', error);
      setPaymentError('Failed to initiate payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  // Demo payment handler (for testing without actual payment)
  const handleDemoPayment = () => {
    setPaymentLoading(true);
    setPaymentError(null);

    // Simulate payment processing
    setTimeout(() => {
      const mockPaymentResponse = {
        razorpay_payment_id: `pay_${Date.now()}_demo`,
        razorpay_order_id: `order_${Date.now()}_demo`,
        razorpay_signature: 'demo_signature'
      };
      
      updateSubscriptionStatus(mockPaymentResponse);
      setSuccessModalOpen(true);
      setPaymentLoading(false);
    }, 2000);
  };

  if (!selectedPlan) {
    return (
      <div className="subscription-page-wrapper py-20 text-center">
        <h2 className="text-xl font-semibold mb-4">Redirecting to subscription page...</h2>
        <Loader className="subscription-loading-spinner mx-auto" size={48} />
      </div>
    );
  }

  return (
    <div className="subscription-page-wrapper min-h-screen pt-20">
      <div className="subscription-main-content max-w-lg mx-auto p-4 md:p-8">
        <Link to="/subscribe" className="flex items-center text-green-600 hover:text-green-800 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Plans
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Confirm & Pay</h1>
        
        {/* Payment Summary Card */}
        <div className="bg-white shadow-xl rounded-lg p-6 mb-8 border border-gray-200">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-700">GreenGuide Premium</h2>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${selectedPlan.popular ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {selectedPlan.type.charAt(0).toUpperCase() + selectedPlan.type.slice(1)}
            </span>
          </div>

          <div className="py-4 space-y-2">
            <div className="flex justify-between text-lg font-medium">
              <span>Subscription Price:</span>
              <span className="text-green-600">₹{selectedPlan.price}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Billed:</span>
              <span>{selectedPlan.description}</span>
            </div>
            {selectedPlan.savings && (
              <div className="flex justify-between text-sm text-green-600">
                <span>You Save:</span>
                <span className="font-semibold">₹{selectedPlan.savings}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-500 border-t pt-2">
              <span>Total Payable:</span>
              <span className="font-semibold text-gray-700">₹{selectedPlan.price}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            Next Billing Date: {getNextBillingDate(selectedPlan.type)}
          </div>
        </div>

        {paymentError && (
          <div className="flex items-center bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-sm" role="alert">
            <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{paymentError}</span>
          </div>
        )}

        {/* Payment Buttons */}
        <div className="space-y-3">
          <button 
            className="subscription-subscribe-btn w-full !text-xl !py-3"
            onClick={handlePaymentStart}
            disabled={paymentLoading || !razorpayLoaded}
          >
            {paymentLoading ? (
              <>
                <Loader className="subscription-loading-spinner" />
                Processing Payment...
              </>
            ) : razorpayLoaded ? (
              `Pay ₹${selectedPlan.price} with Razorpay`
            ) : (
              <>
                <Loader className="subscription-loading-spinner" />
                Loading Payment Gateway...
              </>
            )}
          </button>

          {/* Demo Payment Button for Testing */}
          <button 
            className="w-full py-3 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            onClick={handleDemoPayment}
            disabled={paymentLoading}
          >
            Demo Payment (For Testing)
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-center text-xs text-gray-500 flex items-center justify-center">
            <CheckCircle className="w-3 h-3 mr-1 text-green-500" /> 
            All payments secured by Razorpay
          </p>
          <p className="text-center text-xs text-gray-400">
            Secure • Encrypted • PCI DSS Compliant
          </p>
        </div>
      </div>

      {/* Success Modal */}
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
              <p className="subscription-success-message">
                Your {selectedPlan.type} subscription is now active and ready to use.
              </p>

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
                <div className="subscription-detail-row">
                  <span>Status:</span>
                  <span className="text-green-600 font-semibold">Active</span>
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
                    Get detailed growing instructions
                  </li>
                  <li>
                    <CheckCircle />
                    Use seasonal planting calendar
                  </li>
                  <li>
                    <CheckCircle />
                    Enjoy priority customer support
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  className="subscription-start-exploring-btn flex-1"
                  onClick={() => navigate('/')}
                >
                  Start Exploring
                </button>
                <button 
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => navigate('/account')}
                >
                  View Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;