import React, { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';  // Import Routes and Route
import Users from './Users';            // Import the Users component
import Categories from './Categories';  // Import the Categories component
import Products from './Products';      // Import the Products component
import Permissions from './Permissions'; // Import the Permissions component
import '../css/AdminPage.css';
import AdminReports from './AdminReports';
import ReportDetails from './ReportDetails';

const AdminPage = () => {
    const [view, setView] = useState('dashboard');
    const [users, setUsers] = useState([
        { id: 1, name: 'User1', permissions: { add: true, delete: true, update: true } },
        { id: 2, name: 'User2', permissions: { add: false, delete: false, update: false } },
        // ...other users
    ]);

    // Function to update user permissions
    const updateUserPermissions = (userId, newPermissions) => {
        setUsers(users.map(user => user.id === userId ? { ...user, permissions: newPermissions } : user));
    };

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
                    <li onClick={() => setView('permissions')}><Link to="#">Permissions</Link></li>
                    <li onClick={() => setView('reports')}><Link to="#">Reports</Link></li>
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
                {view === 'products' && <Products users={users} />}
                {view === 'users' && <Users />}
                {view === 'categories' && <Categories />}
                {view === 'permissions' && (
                    <Permissions users={users} updateUserPermissions={updateUserPermissions} />
                )}
                {view === 'reports' && <AdminReports />}

                {/* Routes setup */}
                <Routes>
                <Route path="report/:id" element={<ReportDetails />} />       
                         </Routes>
            </div>
        </div>
    );
};

export default AdminPage;
