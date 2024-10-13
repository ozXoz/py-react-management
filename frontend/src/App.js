// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import UserPage from './components/UserPage';
import AdminPage from './components/AdminPage';
import Register from './components/Register';
import './css/App.css'; // Import the global CSS
import Users from './components/Users';  // Import the Users component
import Categories from './components/Categories';  // Import the Categories component
import ReportDetails from './components/ReportDetails';  // Import ReportDetails component



const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/user" element={<UserPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/users" element={<Users />} />  {/* Add a route for Users component */}
                <Route path="/categories" element={<Categories />} />  {/* Categories Route */}
                <Route path="/admin/report/:id" element={<ReportDetails />} />


                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};

export default App;
