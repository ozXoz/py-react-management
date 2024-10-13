// src/components/ReportDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/ReportDetails.css'; // Import the CSS file


const ReportDetails = ({ reportId }) => {  // Accept reportId as a prop
    const [report, setReport] = useState(null);

    useEffect(() => {
        const fetchReportDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/admin/reports/${reportId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setReport(response.data);
            } catch (error) {
                console.error('Error fetching report details:', error);
            }
        };

        if (reportId) {
            fetchReportDetails();  // Fetch the report details when reportId changes
        }
    }, [reportId]);

    if (!report) {
        return <p>Loading report details...</p>;
    }

    return (
        <div className="report-details">
            <p><strong>User Email:</strong> {report.user_email}</p>
            <p><strong>Subject:</strong> {report.subject}</p>
            <p><strong>Message:</strong> {report.message}</p>
            <p><strong>Status:</strong> {report.status}</p>
            <p><strong>Submitted On:</strong> {new Date(report.created_at).toLocaleString()}</p>
            {/* Add more details as needed */}
        </div>
    );
};

export default ReportDetails;
