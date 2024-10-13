// src/components/ReportForm.js

import React, { useState } from 'react';
import axios from 'axios';

const ReportForm = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [feedback, setFeedback] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/user/reports',
                { subject, message },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            setFeedback('Report submitted successfully!');
            setSubject('');
            setMessage('');
        } catch (error) {
            console.error('Error submitting report:', error);
            setFeedback('Failed to submit report.');
        }
    };

    return (
        <div className="report-form">
            <h2>Report an Issue</h2>
            {feedback && <p className="message">{feedback}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Subject:</label><br />
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Message:</label><br />
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit">Submit Report</button>
            </form>
        </div>
    );
};

export default ReportForm;
