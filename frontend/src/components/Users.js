import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/admin/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (error) {
                if (error.response) {
                    console.error('Error response:', error.response);
                    setError(error.response.data.message || 'Failed to fetch users');
                } else {
                    console.error('Error:', error);
                    setError('An unexpected error occurred');
                }
            }
        };

        fetchUsers();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'; // Handle missing dates
        const date = new Date(dateString);
        return isNaN(date) ? 'Invalid Date' : date.toLocaleString(); // Use toLocaleString for formatting
    };

    return (
        <div className="users-container">
            <h2>User Information</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Registration Time</th>
                        <th>Last Seen</th>
                        <th>Online Duration (Seconds)</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{formatDate(user.registration_time)}</td>
                            <td>{formatDate(user.last_seen)}</td>
                            <td>{user.online_duration}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
