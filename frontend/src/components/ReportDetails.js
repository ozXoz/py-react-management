import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faExclamationCircle, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import '../css/ReportDetails.css'; // Import the CSS file

const ReportDetails = ({ reportId }) => {
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
        return <p className="loading-message">Loading report details...</p>;
    }

    return (
        <div className="report-details">
            <div className="report-section">
                <FontAwesomeIcon icon={faUser} className="icon" />
                <div className="report-info">
                    <h4>User Email</h4>
                    <p>{report.user_email}</p>
                </div>
            </div>

            <div className="report-section">
                <FontAwesomeIcon icon={faExclamationCircle} className="icon" />
                <div className="report-info">
                    <h4>Subject</h4>
                    <p>{report.subject}</p>
                </div>
            </div>

            <div className="report-section">
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                <div className="report-info">
                    <h4>Message</h4>
                    <p>{report.message}</p>
                </div>
            </div>

            <div className="report-section">
                <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
                <div className="report-info">
                    <h4>Submitted On</h4>
                    <p>{new Date(report.created_at).toLocaleString()}</p>
                </div>
            </div>

            <div className="report-section">
                <FontAwesomeIcon icon={faExclamationCircle} className="icon" />
                <div className="report-info">
                    <h4>Status</h4>
                    <p>{report.status}</p>
                </div>
            </div>
        </div>
    );
};

export default ReportDetails;
