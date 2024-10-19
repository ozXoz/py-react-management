import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/SendMessage.css';

const SendMessage = () => {
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/users/emails', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setEmails(response.data);
            } catch (error) {
                console.error('Error fetching emails', error);
            }
        };
        fetchEmails();
    }, []);

    const handleSendMessage = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/messages/send', {
                receiver_email: selectedEmail,
                message: message
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert('Message sent!');
            setMessage('');
        } catch (error) {
            console.error('Error sending message', error);
        }
    };

    return (
        <div className="send-message-container">
            <h2>Send a Message</h2>
            <select value={selectedEmail} onChange={(e) => setSelectedEmail(e.target.value)}>
                <option value="" disabled>Select recipient email</option>
                {emails.map(email => (
                    <option key={email} value={email}>{email}</option>
                ))}
            </select>
            <textarea
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default SendMessage;
