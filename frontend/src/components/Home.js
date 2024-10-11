import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Home.css'; // Import the updated CSS

const Home = () => {
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate('/register'); // Navigate to the register page
    };

    const handleLogin = () => {
        navigate('/login'); // Navigate to the login page
    };

    const scrollToSection = (sectionId) => {
        document.getElementById(sectionId).scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    return (
        <div>
            {/* Header */}
            <header className="header">
                <div className="logo">SaaS Business</div>
                <nav>
                    <ul>
                        <li><Link to="#" onClick={() => scrollToSection('home')}>Home</Link></li>
                        <li><Link to="#" onClick={() => scrollToSection('features')}>Features</Link></li>
                        <li><Link to="#" onClick={() => scrollToSection('benefits')}>Benefits</Link></li>
                        <li><Link to="#" onClick={() => scrollToSection('testimonials')}>Testimonials</Link></li>
                        <li><Link to="#" onClick={() => scrollToSection('pricing')}>Pricing</Link></li>
                        <li><Link to="#" onClick={() => scrollToSection('contact')}>Contact</Link></li>
                    </ul>
                </nav>
                <div className="cta-buttons">
                    <button onClick={handleRegister}>Get Started</button>
                    <button onClick={handleLogin}>Login</button>
                </div>
            </header>

            {/* Hero Section */}
            <div className="hero-section" id="home">
                <h1>Launch Your SaaS Management System in Days, Not Weeks.</h1>
                <p>Manage your business with our comprehensive system designed to handle everything from stock to analytics.</p>
                <div className="hero-buttons">
                    <button className="hero-btn" onClick={handleRegister}>Get Started for Free</button>
                    <button className="hero-btn-outline" onClick={handleLogin}>Explore All Features</button>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="features-section">
                <h2>Our Features</h2>
                <div className="features-grid">
                    <div className="feature">
                        <h3>Inventory Management</h3>
                        <p>Track stock levels in real time and stay ahead of demand.</p>
                    </div>
                    <div className="feature">
                        <h3>Sales & Order Management</h3>
                        <p>Automate your sales and orders to focus on what really matters.</p>
                    </div>
                    <div className="feature">
                        <h3>Advanced Reporting</h3>
                        <p>Get detailed reports on your sales, stock, and finances.</p>
                    </div>
                    <div className="feature">
                        <h3>Cloud-Based Solution</h3>
                        <p>Access your business data from anywhere in the world.</p>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div id="benefits" className="benefits-section">
                <h2>Why Choose Us?</h2>
                <div className="benefits-grid">
                    <div className="benefit">
                        <h3>Increase Efficiency</h3>
                        <p>Our tools help you streamline operations, saving you time and money.</p>
                    </div>
                    <div className="benefit">
                        <h3>Data-Driven Decisions</h3>
                        <p>Our analytics empower you to make smarter business decisions.</p>
                    </div>
                    <div className="benefit">
                        <h3>Customizable Solutions</h3>
                        <p>We tailor our services to meet the specific needs of your business.</p>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div id="testimonials" className="testimonials-section">
                <h2>What Our Clients Say</h2>
                <div className="testimonials-grid">
                    <div className="testimonial">
                        <p>"This system completely transformed how we manage our inventory!"</p>
                        <h4>- Sarah J., CEO of Retail Corp</h4>
                    </div>
                    <div className="testimonial">
                        <p>"We saved 30% on operational costs thanks to the automation tools."</p>
                        <h4>- Mark L., COO of Supply Chain Inc.</h4>
                    </div>
                    <div className="testimonial">
                        <p>"The best decision we made was to switch to this SaaS platform. Highly recommend!"</p>
                        <h4>- Emily R., Founder of Tech Innovators</h4>
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
                            <li>Basic Inventory Management</li>
                            <li>Standard Reports</li>
                        </ul>
                        <button onClick={handleRegister}>Get Started</button>
                    </div>
                    <div className="pricing-card featured">
                        <h3>Pro</h3>
                        <p className="price">$35/month</p>
                        <ul>
                            <li>15 Users</li>
                            <li>Advanced Inventory & Sales</li>
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
                            <li>Full Business Management</li>
                            <li>Priority Support</li>
                            <li>Custom Integrations</li>
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
