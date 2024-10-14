import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesome for icons
import { faChartLine, faUsers, faWarehouse, faShoppingCart, faCogs, faFileAlt } from '@fortawesome/free-solid-svg-icons'; // Icons
import { Link } from 'react-router-dom'; // Link for navigation
import '../css/Home.css';

const Home = () => {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Section Animations
        gsap.fromTo('.hero-section h1, .hero-section p', {
            opacity: 0,
            y: 100,
        }, {
            opacity: 1,
            y: 0,
            duration: 1.5,
            stagger: 0.3,
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top center',
                end: 'bottom top',
                toggleActions: 'play none none reverse',
            }
        });

        // Features Section Animation
        gsap.fromTo('.features-section', {
            opacity: 0,
            y: 100,
            scale: 0.9,
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            scrollTrigger: {
                trigger: '.features-section',
                start: 'top 80%',
                end: 'top center',
                scrub: true,
                toggleActions: 'play none none reverse',
            }
        });

        // Feature Items Animation
        gsap.fromTo('.feature', {
            opacity: 0,
            y: 100,
        }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.features-section',
                start: 'top 90%',
                end: 'bottom top',
                scrub: true,
            }
        });

        // Pricing Section Animation
        gsap.fromTo('.pricing-section', {
            opacity: 0,
            y: 100,
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: '.pricing-section',
                start: 'top 80%',
                end: 'top center',
                scrub: true,
            }
        });

        // Contact Section Animation
        gsap.fromTo('.contact-section', {
            opacity: 0,
            y: 100,
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: '.contact-section',
                start: 'top 80%',
                end: 'top center',
                scrub: true,
            }
        });
    }, []);

    return (
        <div>
            <header className="header">
                <div className="logo">SaaS Business</div>
                <nav>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#pricing">Pricing</a></li>
                        <li><a href="#benefits">Benefits</a></li>
                        <li><a href="#how-it-works">How It Works</a></li>
                        <li><a href="#reviews">Customer Reviews</a></li>
                        <li><a href="#team">Team</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>

                {/* Login and Register buttons */}
                <div className="auth-buttons">
                    <Link to="/login" className="auth-link">Login</Link>
                    <Link to="/register" className="auth-link">Register</Link>
                </div>
            </header>

            <div className="hero-section" id="home">
                <h1>Launch Your SaaS Business Today</h1>
                <p>Manage your business with our comprehensive tools designed for growth and efficiency.</p>
                <div className="parallax-layer layer-1"></div>
                <div className="parallax-layer layer-2"></div>
            </div>

            {/* Features Section */}
            <div className="features-section" id="features">
                <h2>Our Features</h2>
                <div className="features-grid">
                    <div className="feature">
                        <FontAwesomeIcon icon={faWarehouse} className="feature-icon" />
                        <h3>Inventory Management</h3>
                        <p>Track stock levels in real time and stay ahead of demand.</p>
                    </div>
                    <div className="feature">
                        <FontAwesomeIcon icon={faShoppingCart} className="feature-icon" />
                        <h3>Sales & Order Management</h3>
                        <p>Automate your sales and orders to focus on what really matters.</p>
                    </div>
                    <div className="feature">
                        <FontAwesomeIcon icon={faFileAlt} className="feature-icon" />
                        <h3>Advanced Reporting</h3>
                        <p>Get detailed reports on your sales, stock, and finances.</p>
                    </div>
                    <div className="feature">
                        <FontAwesomeIcon icon={faUsers} className="feature-icon" />
                        <h3>Customer Management</h3>
                        <p>Keep track of customer data and interactions in one place.</p>
                    </div>
                    <div className="feature">
                        <FontAwesomeIcon icon={faChartLine} className="feature-icon" />
                        <h3>Analytics Dashboard</h3>
                        <p>Gain insights into your business performance at a glance.</p>
                    </div>
                    <div className="feature">
                        <FontAwesomeIcon icon={faCogs} className="feature-icon" />
                        <h3>Marketing Automation</h3>
                        <p>Automate your marketing campaigns to reach more customers.</p>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="pricing-section" id="pricing">
                <h2>Pricing Plans</h2>
                <div className="pricing-grid">
                    <div className="pricing-card">
                        <h3>Basic</h3>
                        <p>$19/month</p>
                        <ul>
                            <li>10 Projects</li>
                            <li>5 GB Storage</li>
                            <li>Email Support</li>
                        </ul>
                        <button>Get Started</button>
                    </div>
                    <div className="pricing-card">
                        <h3>Pro</h3>
                        <p>$49/month</p>
                        <ul>
                            <li>Unlimited Projects</li>
                            <li>50 GB Storage</li>
                            <li>Priority Support</li>
                        </ul>
                        <button>Get Started</button>
                    </div>
                    <div className="pricing-card">
                        <h3>Enterprise</h3>
                        <p>Contact Us</p>
                        <ul>
                            <li>Custom Projects</li>
                            <li>Unlimited Storage</li>
                            <li>Dedicated Support</li>
                        </ul>
                        <button>Contact Sales</button>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="benefits-section" id="benefits">
                <h2>Benefits of Our SaaS</h2>
                <ul className="benefits-list">
                    <li>Seamless Integration with Existing Systems</li>
                    <li>Real-time Analytics and Reporting</li>
                    <li>Scalable for Businesses of Any Size</li>
                    <li>Cost-effective Subscription Plans</li>
                </ul>
            </div>

            {/* How It Works Section */}
            <div className="how-it-works-section" id="how-it-works">
                <h2>How It Works</h2>
                <div className="steps-grid">
                    <div className="step">
                        <h3>1. Sign Up</h3>
                        <p>Create an account and get access to all our tools.</p>
                    </div>
                    <div className="step">
                        <h3>2. Set Up</h3>
                        <p>Configure your dashboard, add team members, and start tracking.</p>
                    </div>
                    <div className="step">
                        <h3>3. Optimize</h3>
                        <p>Analyze data and optimize your processes for better results.</p>
                    </div>
                </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="reviews-section" id="reviews">
                <h2>Customer Reviews</h2>
                <div className="reviews-grid">
                    <div className="review">
                        <img src="https://img.freepik.com/free-photo/handsome-confident-smiling-man-with-hands-crossed-chest_176420-18743.jpg?size=626&ext=jpg&ga=GA1.1.1369675164.1728864000&semt=ais_hybrid-rr-similar" alt="Customer 1" />
                        <p>"This SaaS transformed our business operations. Highly recommended!"</p>
                        <h4>- Jane Doe, CEO at TechCorp</h4>
                    </div>
                    <div className="review">
                        <img src="https://images.inc.com/uploaded_files/image/1920x1080/getty_481292845_77896.jpg" alt="Customer 2" />
                        <p>"Fantastic service and support. Our team productivity increased by 40%."</p>
                        <h4>- John Smith, Founder of Innovate Solutions</h4>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="team-section" id="team">
                <h2>Meet Our Team</h2>
                <div className="team-grid">
                    <div className="team-member">
                        <img src="https://www.shutterstock.com/image-photo/handsome-happy-african-american-bearded-260nw-2460702995.jpg" alt="CEO" />
                        <h4>Jane Doe</h4>
                        <p>CEO</p>
                    </div>
                    <div className="team-member">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO2vBQ1vOla9pPM6M0ZsYZb7OckCS21cgN_Q&s" alt="CTO" />
                        <h4>John Smith</h4>
                        <p>CTO</p>
                    </div>
                    <div className="team-member">
                        <img src="https://images.healthshots.com/healthshots/en/uploads/2020/12/08182549/positive-person.jpg" alt="Designer" />
                        <h4>Emily Clark</h4>
                        <p>Lead Designer</p>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="contact-section" id="contact">
                <h2>Contact Us</h2>
                <form className="contact-form">
                    <input type="text" placeholder="Your Name" required />
                    <input type="email" placeholder="Your Email" required />
                    <textarea placeholder="Your Message" rows="5" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </div>

            <footer className="footer">
                <p>© 2024 SaaS Business. All rights reserved.</p>
                <div className="social-icons">
                    <a href="#">LinkedIn</a>
                    <a href="#">Twitter</a>
                </div>
            </footer>
        </div>
    );
};

export default Home;
