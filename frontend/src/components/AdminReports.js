import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReportDetails from './ReportDetails';  // Import the ReportDetails component

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [selectedReportId, setSelectedReportId] = useState(null); // Track selected report

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
            }
        };
        fetchReports();
    }, []);

    return (
        <div className="admin-reports">
            <h2>User Reports</h2>
            {reports.length === 0 ? (
                <p>No reports submitted.</p>
            ) : (
                <>
                    <table>
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
                                    <td>{report.user_email}</td>
                                    <td>{report.subject}</td>
                                    <td>{report.status}</td>
                                    <td>{new Date(report.created_at).toLocaleString()}</td>
                                    <td>
                                        <button onClick={() => setSelectedReportId(report.id)}>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Conditionally render the report details below the table */}
                    {selectedReportId && (
                        <div className="report-details-section">
                            <h3>Report Details</h3>
                            <ReportDetails reportId={selectedReportId} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminReports;
