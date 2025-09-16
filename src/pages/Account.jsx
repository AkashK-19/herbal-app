import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/account.css';

const Account = () => {
    const [activeTab, setActiveTab] = useState('signin');
    const [formData, setFormData] = useState({
        signin: { email: '', password: '' },
        signup: { name: '', email: '', password: '', confirmPassword: '' }
    });
    const [messages, setMessages] = useState({
        signin: { error: '', success: '' },
        signup: { error: '', success: '' }
    });
    const [loading, setLoading] = useState({ signin: false, signup: false });
    const [passwordStrength, setPasswordStrength] = useState(0);

    const navigate = useNavigate();

    // Mock user database
    const mockUsers = [
        {
            id: 1,
            name: "Akash Kapare",
            email: "akashkapare2005@gmail.com",
            password: "Akash@123",
            createdAt: "2024-01-15T10:30:00Z",
            profile: {
                bio: "Environmental enthusiast and sustainable living advocate",
                location: "Mumbai, Maharashtra",
                joinedCommunities: ["Zero Waste Living", "Urban Gardening", "Renewable Energy"],
                badgesEarned: ["Green Warrior", "Eco Educator", "Carbon Saver"],
                carbonOffset: 250,
                treesPlanted: 12
            }
        }
    ];

    // Check if user is already logged in
    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            navigate('/');
        }
    }, [navigate]);

    // Simulate API delay
    const apiDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

    // Mock API functions
    const mockAPI = {
        async authenticateUser(email, password) {
            await apiDelay(600);
            
            const user = mockUsers.find(u => u.email === email);
            if (!user) {
                throw new Error('User not found');
            }
            
            if (user.password !== password) {
                throw new Error('Invalid password');
            }
            
            const { password: _, ...userData } = user;
            return {
                success: true,
                user: userData,
                token: `mock_token_${Date.now()}`,
                message: 'Authentication successful'
            };
        },

        async registerUser(userData) {
            await apiDelay(1000);
            
            const existingUser = mockUsers.find(u => u.email === userData.email);
            if (existingUser) {
                throw new Error('Email already registered');
            }
            
            const newUser = {
                id: mockUsers.length + 1,
                name: userData.name,
                email: userData.email,
                password: userData.password,
                createdAt: new Date().toISOString(),
                profile: {
                    bio: "",
                    location: "",
                    joinedCommunities: [],
                    badgesEarned: ["New Member"],
                    carbonOffset: 0,
                    treesPlanted: 0
                }
            };
            
            mockUsers.push(newUser);
            
            const { password: _, ...userResponse } = newUser;
            return {
                success: true,
                user: userResponse,
                token: `mock_token_${Date.now()}`,
                message: 'Registration successful'
            };
        }
    };

    // Password strength checker
    const checkPasswordStrength = (password) => {
        if (!password || password.length === 0) return 0; 
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    // Handle tab switching
    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        setMessages({ signin: { error: '', success: '' }, signup: { error: '', success: '' } });
        setPasswordStrength(0);
    };

    const handleInputChange = (tab, field, value) => {
        setFormData(prev => ({
            ...prev,
            [tab]: { ...prev[tab], [field]: value }
        }));

        if (tab === 'signup' && field === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    // Show message
    const showMessage = (tab, type, message) => {
        setMessages(prev => ({
            ...prev,
            [tab]: { ...prev[tab], [type]: message }
        }));

        setTimeout(() => {
            setMessages(prev => ({
                ...prev,
                [tab]: { ...prev[tab], [type]: '' }
            }));
        }, 6000);
    };

    // Navigate to home page
    const navigateToHome = (user) => {
        // Store user session
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        sessionStorage.setItem('isLoggedIn', 'true');
        
        navigate('/');
    };

    // Handle sign in
    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, signin: true }));

        const { email, password } = formData.signin;

        if (!email || !password) {
            setLoading(prev => ({ ...prev, signin: false }));
            showMessage('signin', 'error', 'Please enter both email and password.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setLoading(prev => ({ ...prev, signin: false }));
            showMessage('signin', 'error', 'Please enter a valid email address.');
            return;
        }

        try {
            const response = await mockAPI.authenticateUser(email, password);
            
            setLoading(prev => ({ ...prev, signin: false }));
            showMessage('signin', 'success', `Welcome back, ${response.user.name}! Redirecting to home...`);
            
            setTimeout(() => {
                navigateToHome(response.user);
            }, 1500);
            
        } catch (error) {
            setLoading(prev => ({ ...prev, signin: false }));
            let errorMessage = 'Sign in failed. Please try again.';
            
            if (error.message === 'User not found') {
                errorMessage = 'No account found with this email. Please sign up first.';
            } else if (error.message === 'Invalid password') {
                errorMessage = 'Incorrect password. Please try again.';
            }
            
            showMessage('signin', 'error', errorMessage);
        }
    };

    // Handle sign up
    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, signup: true }));

        const { name, email, password, confirmPassword } = formData.signup;

        if (!name || !email || !password || !confirmPassword) {
            setLoading(prev => ({ ...prev, signup: false }));
            showMessage('signup', 'error', 'All fields are required.');
            return;
        }

        if (name.length < 2) {
            setLoading(prev => ({ ...prev, signup: false }));
            showMessage('signup', 'error', 'Name must be at least 2 characters long.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setLoading(prev => ({ ...prev, signup: false }));
            showMessage('signup', 'error', 'Please enter a valid email address.');
            return;
        }

        if (password.length < 8) {
            setLoading(prev => ({ ...prev, signup: false }));
            showMessage('signup', 'error', 'Password must be at least 8 characters long.');
            return;
        }

        if (checkPasswordStrength(password) < 3) {
            setLoading(prev => ({ ...prev, signup: false }));
            showMessage('signup', 'error', 'Password is too weak. Include uppercase, lowercase, numbers, and special characters.');
            return;
        }

        if (password !== confirmPassword) {
            setLoading(prev => ({ ...prev, signup: false }));
            showMessage('signup', 'error', 'Passwords do not match.');
            return;
        }

        try {
            const response = await mockAPI.registerUser({ name, email, password });
            
            setLoading(prev => ({ ...prev, signup: false }));
            showMessage('signup', 'success', `Account created successfully! Welcome, ${response.user.name}!`);
            
            // Clear form
            setFormData(prev => ({
                ...prev,
                signup: { name: '', email: '', password: '', confirmPassword: '' }
            }));
            setPasswordStrength(0);
            
            setTimeout(() => {
                navigateToHome(response.user);
            }, 2000);
            
        } catch (error) {
            setLoading(prev => ({ ...prev, signup: false }));
            let errorMessage = 'Registration failed. Please try again.';
            
            if (error.message === 'Email already registered') {
                errorMessage = 'This email is already registered. Please sign in instead.';
            }
            
            showMessage('signup', 'error', errorMessage);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                const activeForm = activeTab === 'signin' ? handleSignIn : handleSignUp;
                if (document.activeElement.tagName === 'INPUT') {
                    activeForm(e);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [activeTab, formData]);

    return (
        <div className="account-page">
            <div className="leaves-container">
                <div className="leaf"></div>
                <div className="leaf"></div>
                <div className="leaf"></div>
                <div className="leaf"></div>
                <div className="leaf"></div>
                <div className="leaf"></div>
            </div>

            <section className="account-section">
                <h2>Create Account</h2>
                <div className="account-container">
                    <div className={`toggle-tabs ${activeTab === 'signup' ? 'signup' : ''}`}>
                        <button 
                            className={`tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
                            onClick={() => handleTabSwitch('signin')}
                        >
                            Sign In
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                            onClick={() => handleTabSwitch('signup')}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Sign In Form */}
                    <div className={`form-container ${activeTab === 'signin' ? 'active' : ''}`}>
                        {messages.signin.error && (
                            <p className="error-message">{messages.signin.error}</p>
                        )}
                        {messages.signin.success && (
                            <p className="success-message">{messages.signin.success}</p>
                        )}
                        <form onSubmit={handleSignIn}>
                            <div className="input-group">
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    value={formData.signin.email}
                                    onChange={(e) => handleInputChange('signin', 'email', e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="input-group">
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    value={formData.signin.password}
                                    onChange={(e) => handleInputChange('signin', 'password', e.target.value)}
                                    required 
                                />
                            </div>
                            <button 
                                type="submit"
                                className={loading.signin ? 'loading' : ''}
                                disabled={loading.signin}
                            >
                                {loading.signin ? '' : 'Sign In'}
                            </button>
                        </form>
                    </div>

                    {/* Sign Up Form */}
                    <div className={`form-container ${activeTab === 'signup' ? 'active' : ''}`}>
                        {messages.signup.error && (
                            <p className="error-message">{messages.signup.error}</p>
                        )}
                        {messages.signup.success && (
                            <p className="success-message">{messages.signup.success}</p>
                        )}
                        <form onSubmit={handleSignUp}>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    placeholder="Full Name" 
                                    value={formData.signup.name}
                                    onChange={(e) => handleInputChange('signup', 'name', e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="input-group">
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    value={formData.signup.email}
                                    onChange={(e) => handleInputChange('signup', 'email', e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="input-group">
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    value={formData.signup.password}
                                    onChange={(e) => handleInputChange('signup', 'password', e.target.value)}
                                    required 
                                />
                                {/* Only show password strength if there's actually a password */}
                                {formData.signup.password && formData.signup.password.length > 0 && (
                                    <div className="password-strength">
                                        <div className={`password-strength-bar ${
                                            passwordStrength <= 2 ? 'strength-weak' : 
                                            passwordStrength <= 3 ? 'strength-medium' : 'strength-strong'
                                        }`}></div>
                                    </div>
                                )}
                            </div>
                            <div className="input-group">
                                <input 
                                    type="password" 
                                    placeholder="Confirm Password" 
                                    value={formData.signup.confirmPassword}
                                    onChange={(e) => handleInputChange('signup', 'confirmPassword', e.target.value)}
                                    required 
                                />
                            </div>
                            <button 
                                type="submit"
                                className={loading.signup ? 'loading' : ''}
                                disabled={loading.signup}
                            >
                                {loading.signup ? '' : 'Sign Up'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Account;