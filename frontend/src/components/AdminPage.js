import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Users from './Users';         // Import the Users component
import Categories from './Categories';  // Import the Categories component
import '../css/AdminPage.css';

const AdminPage = () => {
    const [view, setView] = useState('dashboard');

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <div className="sidebar">
                <h2>ProdoCo</h2>
                <ul className="sidebar-menu">
                    <li onClick={() => setView('dashboard')}><Link to="#">Dashboard</Link></li>
                    <li onClick={() => setView('ecommerce')}><Link to="#">Ecommerce</Link></li>
                    <li onClick={() => setView('products')}><Link to="#">Products</Link></li>
                    <li onClick={() => setView('users')}><Link to="#">Users</Link></li>
                    <li onClick={() => setView('categories')}><Link to="#">Categories</Link></li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="header">
                    <h1>Admin Dashboard</h1>
                </div>

                {/* Conditionally render the content based on the view */}
                {view === 'dashboard' && <p>Welcome to the admin dashboard!</p>}
                {view === 'ecommerce' && <p>Ecommerce section</p>}
                {view === 'products' && <p>Products section</p>}
                {view === 'users' && <Users />}           {/* Display the Users component */}
                {view === 'categories' && <Categories />}  {/* Display the Categories component */}
            </div>
        </div>
    );
};

export default AdminPage;
