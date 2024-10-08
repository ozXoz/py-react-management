// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import UserPage from './components/UserPage';
import AdminPage from './components/AdminPage';
import Register from './components/Register';
import './css/App.css'; // Import the global CSS


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/user" element={<UserPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/register" element={<Register />} />


                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};

export default App;
