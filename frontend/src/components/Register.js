import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Use Link for navigation
import '../css/Register.css'; // Import the updated CSS file

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await axios.post('http://localhost:5000/register', { email, password });
            setSuccess(response.data.message);
            setTimeout(() => {
                navigate('/login'); // Redirect to login after successful registration
            }, 2000);
        } catch (error) {
            setError(error.response.data.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            {/* Header Section */}
            <header className="header">
                <div className="logo">SaaS Business</div>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/#features">Features</Link></li>
                        <li><Link to="/#benefits">Benefits</Link></li>
                        <li><Link to="/#testimonials">Testimonials</Link></li>
                        <li><Link to="/#pricing">Pricing</Link></li>
                        <li><Link to="/#contact">Contact</Link></li>
                    </ul>
                </nav>
                <div className="cta-buttons">
                    <button onClick={() => navigate('/register')}>Get Started</button>
                    <button onClick={() => navigate('/login')}>Login</button>
                </div>
            </header>

            {/* Register Form Section */}
            <div className="register-container">
                <form className="register-form" onSubmit={handleSubmit}>
                    <h2>Create an Account</h2>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="register-btn">
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>

            {/* Footer Section */}
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

export default Register;
