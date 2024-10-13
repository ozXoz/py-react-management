// src/components/UserReports.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserReports = () => {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found, user not logged in.');
                    setError('User not logged in');
                    return;
                }

                // Log the token for debugging
                console.log('Token:', token);

                const response = await axios.get('http://localhost:5000/user/reports', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                // Log the response to see if reports are returned
                console.log('Reports fetched:', response.data);

                // Check if reports were returned and set them in state
                if (response.data && Array.isArray(response.data)) {
                    setReports(response.data);
                } else {
                    setError('No reports found');
                }
            } catch (error) {
                console.error('Error fetching reports:', error.response ? error.response.data : error.message);
                setError('Failed to fetch reports');
            }
        };

        fetchReports();
    }, []);

    return (
        <div className="user-reports">
            <h2>Your Reports</h2>
            {error && <p className="error">{error}</p>}
            {reports.length === 0 ? (
                <p>No reports submitted.</p>
            ) : (
                <ul>
                    {reports.map((report) => (
                        <li key={report.id}>
                            <h3>{report.subject}</h3>
                            <p>{report.message}</p>
                            <p>Status: {report.status}</p>
                            {report.reply && (
                                <div>
                                    <h4>Admin Reply:</h4>
                                    <p>{report.reply}</p>
                                </div>
                            )}
                            <p>
                                Submitted on: {new Date(report.created_at).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserReports;
