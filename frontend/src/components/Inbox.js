import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Inbox.css';  // Correct path to the separate CSS file

const Inbox = () => {
    const [messages, setMessages] = useState([]);
    const [sentMessages, setSentMessages] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [editMessage, setEditMessage] = useState('');
    const [activeTab, setActiveTab] = useState('inbox');

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/messages/inbox', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages', error);
        }
    };

    const fetchSentMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/messages/sent', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSentMessages(response.data);
        } catch (error) {
            console.error('Error fetching sent messages', error);
        }
    };

    useEffect(() => {
        fetchMessages();
        fetchSentMessages();
    }, []);

    const handleEditMessage = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/messages/edit/${id}`, { message: editMessage }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert('Message edited successfully!');
            setEditMode(null);
            fetchMessages();
            fetchSentMessages();
        } catch (error) {
            console.error('Error editing message', error);
        }
    };

    const handleDeleteMessage = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/messages/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchMessages();
            fetchSentMessages();
        } catch (error) {
            console.error('Error deleting message', error);
        }
    };

    return (
        <div className="inbox-container">
            <h2>Messages</h2>
            <div className="tabs-container">
                <div className={`tab ${activeTab === 'inbox' ? 'active' : ''}`} onClick={() => setActiveTab('inbox')}>
                    Inbox
                </div>
                <div className={`tab ${activeTab === 'sent' ? 'active' : ''}`} onClick={() => setActiveTab('sent')}>
                    Sent
                </div>
            </div>

            {activeTab === 'inbox' ? (
                <ul className="message-list">
                    {messages.map(message => (
                        <li key={message.id}>
                            <div className={`message-bubble ${message.seen ? 'seen' : 'unseen'}`}>
                                <div className="message-header">
                                    <span className="sender">From: {message.sender_email}</span>
                                    <span className="timestamp">{new Date(message.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="message-content">
                                    {message.deleted ? '[Message deleted]' : message.message}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <ul className="message-list">
                    {sentMessages.map(message => (
                        <li key={message.id}>
                            <div className="message-bubble">
                                <div className="message-header">
                                    <span className="sender">To: {message.receiver_email}</span>
                                    <span className="timestamp">{new Date(message.timestamp).toLocaleString()}</span>
                                </div>
                                {editMode === message.id ? (
                                    <textarea
                                        value={editMessage}
                                        onChange={(e) => setEditMessage(e.target.value)}
                                    />
                                ) : (
                                    <div className="message-content">
                                        {message.deleted ? '[Message deleted]' : message.message}
                                    </div>
                                )}
                                <div className="message-actions">
                                    {editMode === message.id ? (
                                        <button onClick={() => handleEditMessage(message.id)}>Save</button>
                                    ) : (
                                        !message.deleted && (
                                            <>
                                                <button onClick={() => { setEditMode(message.id); setEditMessage(message.message); }}>Edit</button>
                                                <button onClick={() => handleDeleteMessage(message.id)}>Delete</button>
                                            </>
                                        )
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Inbox;
