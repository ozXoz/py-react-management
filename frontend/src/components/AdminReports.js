import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReportDetails from './ReportDetails';  // Import the ReportDetails component
import '../css/AdminReports.css'; // Import the CSS file

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [selectedReportId, setSelectedReportId] = useState(null); // Track selected report
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/admin/reports', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setReports(response.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
                setError('Failed to fetch reports.');
            }
        };
        fetchReports();
    }, []);

    const handleCloseDrawer = () => {
        setSelectedReportId(null);
    };

    return (
        <div className="admin-reports">
            <h2>User Reports</h2>
            {error && <p className="error-message">{error}</p>}
            {reports.length === 0 ? (
                <p className="no-reports-message">No reports submitted.</p>
            ) : (
                <>
                    <table className="reports-table">
                        <thead>
                            <tr>
                                <th>User Email</th>
                                <th>Subject</th>
                                <th>Status</th>
                                <th>Submitted On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report.id}>
                                    <td data-label="User Email">{report.user_email}</td>
                                    <td data-label="Subject">{report.subject}</td>
                                    <td data-label="Status">{report.status}</td>
                                    <td data-label="Submitted On">{new Date(report.created_at).toLocaleString()}</td>
                                    <td data-label="Actions">
                                        <button
                                            className="view-button"
                                            onClick={() => setSelectedReportId(report.id)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Sliding Drawer for Report Details */}
                    <div className={`drawer ${selectedReportId ? 'open' : ''}`}>
                        {selectedReportId && (
                            <div className="drawer-content">
                                <h3>Report Details</h3>
                                <ReportDetails reportId={selectedReportId} />
                                <button
                                    className="close-drawer-button"
                                    onClick={handleCloseDrawer}
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminReports;
