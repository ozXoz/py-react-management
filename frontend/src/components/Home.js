import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css'; // Import the CSS

const Home = () => {
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate('/register'); // Navigate to the register page
    };

    const handleLogin = () => {
        navigate('/login'); // Navigate to the login page
    };

    return (
        <div>
            {/* Header */}
            <header className="header">
                <div className="logo">SaaS Business</div>
                <nav>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#pricing">Pricing</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
                <div className="cta-buttons">
                    <button onClick={handleRegister}>Get Started</button>
                    <button onClick={handleLogin}>Login</button>
                </div>
            </header>

            {/* Hero Section */}
            <div className="hero-section">
                <h1>Empower Your Business</h1>
                <p>Optimize inventory, increase efficiency, and grow your business with our SaaS management system.</p>
                <button className="hero-btn" onClick={handleRegister}>Start Free Trial</button>
            </div>

            {/* Features Section */}
            <div id="features" className="features-section">
                <h2>Our Features</h2>
                <div className="features-grid">
                    <div className="feature">
                        <h3>Stock Management</h3>
                        <p>Keep track of your inventory with ease.</p>
                    </div>
                    <div className="feature">
                        <h3>Real-time Analytics</h3>
                        <p>Access powerful insights into your business.</p>
                    </div>
                    <div className="feature">
                        <h3>Custom Reports</h3>
                        <p>Generate reports that suit your business needs.</p>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div id="pricing" className="pricing-section">
                <h2>Choose Your Plan</h2>
                <div className="pricing-grid">
                    <div className="pricing-card">
                        <h3>Basic</h3>
                        <p className="price">$20/month</p>
                        <ul>
                            <li>5 Users</li>
                            <li>Basic Stock Management</li>
                            <li>Limited Reports</li>
                        </ul>
                        <button onClick={handleRegister}>Get Started</button>
                    </div>
                    <div className="pricing-card featured">
                        <h3>Pro</h3>
                        <p className="price">$35/month</p>
                        <ul>
                            <li>15 Users</li>
                            <li>Advanced Stock Management</li>
                            <li>Custom Reports</li>
                            <li>Real-time Analytics</li>
                        </ul>
                        <button onClick={handleRegister}>Get Started</button>
                    </div>
                    <div className="pricing-card">
                        <h3>Enterprise</h3>
                        <p className="price">$45/month</p>
                        <ul>
                            <li>Unlimited Users</li>
                            <li>Full Stock & Sales Management</li>
                            <li>Priority Support</li>
                            <li>Custom Reports & Analytics</li>
                        </ul>
                        <button onClick={handleRegister}>Get Started</button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <p>© 2024 SaaS Business. All rights reserved.</p>
                <div className="social-icons">
                    <a href="#">LinkedIn</a> |
                    <a href="#">Twitter</a>
                </div>
            </footer>
        </div>
    );
};

export default Home;
