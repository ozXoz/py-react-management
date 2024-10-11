import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Updated to use Link
import '../css/Login.css'; // Import the CSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(
                'http://localhost:5000/login',
                { email, password },
                { headers: { 'Content-Type': 'application/json' } }
            );
            const { access_token, role } = response.data;
            localStorage.setItem('token', access_token);
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/user');
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Login failed');
            } else {
                setError('An unexpected error occurred');
            }
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

            {/* Login Form Section */}
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Login to Your Account</h2>
                    {error && <div className="error-message">{error}</div>}
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
                    <button type="submit" disabled={loading} className="login-btn">
                        {loading ? 'Logging in...' : 'Login'}
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

export default Login;
