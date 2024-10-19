import React, { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';  // Import Routes and Route
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBox, faUsers, faTags, faKey, faFileAlt, faHeadset,faClipboardList,faWarehouse,faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Users from './Users';            // Import the Users component
import Categories from './Categories';  // Import the Categories component
import Products from './Products';      // Import the Products component
import Permissions from './Permissions'; // Import the Permissions component
import '../css/AdminPage.css';
import AdminReports from './AdminReports';
import ReportDetails from './ReportDetails';
import AdminSupportPanel from './AdminSupportPanel'; // Import the Support Panel
import Dashboard from './Dashboard'; // Import the Dashboard component
import Orders from './Orders';  // Import Orders component
import InventoryCheck from './InventoryCheck'; // Import InventoryCheck component
import Inbox from './Inbox';  // Import Inbox component
import SendMessage from './SendMessage'; // Import SendMessage component

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
                    <li onClick={() => setView('dashboard')}>
                        <Link to="#">
                            <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
                        </Link>
                    </li>
                    <li onClick={() => setView('products')}>
                        <Link to="#">
                            <FontAwesomeIcon icon={faBox} /> Products
                        </Link>
                    </li>
                    <li onClick={() => setView('users')}>
                        <Link to="#">
                            <FontAwesomeIcon icon={faUsers} /> Users
                        </Link>
                    </li>
                    <li onClick={() => setView('categories')}>
                        <Link to="#">
                            <FontAwesomeIcon icon={faTags} /> Categories
                        </Link>
                    </li>
                    <li onClick={() => setView('permissions')}>
                        <Link to="#">
                            <FontAwesomeIcon icon={faKey} /> Permissions
                        </Link>
                    </li>
                    <li onClick={() => setView('reports')}>
                        <Link to="#">
                            <FontAwesomeIcon icon={faFileAlt} /> Reports
                        </Link>
                    </li>
                    <li onClick={() => setView('support')}>
                        <Link to="#">
                            <FontAwesomeIcon icon={faHeadset} /> Support
                        </Link>
                    </li>
                    <li onClick={() => setView('orders')}>
                        <Link to="#">
                            <FontAwesomeIcon icon={faClipboardList} /> Orders
                        </Link>
                    </li>
                    <li onClick={() => setView('inventory')}>
                        <Link to="#">
                            <FontAwesomeIcon icon={faWarehouse} /> Inventory Check
                        </Link>
                    </li>
                    <li onClick={() => setView('messages')}>
                        <Link to="#"><FontAwesomeIcon icon={faEnvelope} /> Messages</Link>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="header">
                    <h1>Admin Dashboard</h1>
                </div>

                {/* Conditionally render the content based on the view */}
                {view === 'dashboard' && <Dashboard />}
                                {view === 'products' && <Products users={users} />}
                {view === 'users' && <Users />}
                {view === 'categories' && <Categories />}
                {view === 'permissions' && (
                    <Permissions users={users} updateUserPermissions={updateUserPermissions} />
                )}
                {view === 'reports' && <AdminReports />}
                {view === 'support' && <AdminSupportPanel />} {/* Render Support Panel */}

                {/* Routes setup */}
                <Routes>
                    <Route path="report/:id" element={<ReportDetails />} />
                </Routes>
                {view === 'orders' && <Orders />} {/* Render Orders section */}
                {view === 'inventory' && <InventoryCheck />} {/* Render Inventory Check section */}
                {view === 'messages' && (
                    <div>
                        <Inbox /> {/* Admin's inbox */}
                        <SendMessage /> {/* Admin can send messages */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
