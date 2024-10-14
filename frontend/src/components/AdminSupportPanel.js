// src/components/AdminSupportPanel.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../css/AdminSupportPanel.css';

const SOCKET_SERVER_URL = 'http://localhost:3000'; // Adjust the URL if needed

const AdminSupportPanel = () => {
    const [chatRequests, setChatRequests] = useState([]); // To hold incoming chat requests
    const [currentChat, setCurrentChat] = useState(null);  // To keep track of the current chat
    const [messages, setMessages] = useState([]);          // To store the chat messages
    const [message, setMessage] = useState('');            // Current message to send

    const socket = io(SOCKET_SERVER_URL, { withCredentials: true });

    useEffect(() => {
        // Listen for chat requests
        socket.on('support_request', (data) => {
            setChatRequests(prevRequests => [...prevRequests, data]);
        });

        // Listen for chat messages
        socket.on('receive_message', (data) => {
            setMessages(prevMessages => [...prevMessages, data]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const acceptChat = (userId) => {
        setCurrentChat(userId);  // Set current chat session
        socket.emit('accept_chat', { user_id: userId });

        // Listen for messages after chat is accepted
        socket.on('chat_accepted', () => {
            console.log("Chat accepted with user:", userId);
        });
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        socket.emit('admin_message', { room: currentChat, message });
        setMessages(prevMessages => [...prevMessages, { sender: 'admin', content: message }]);
        setMessage('');
    };

    return (
        <div className="admin-support-panel">
            <h2>Support Requests</h2>

            {/* Pending Chat Requests */}
            <ul>
                {chatRequests.map((request, index) => (
                    <li key={index}>
                        <p>Issue: {request.issue}</p>
                        <button onClick={() => acceptChat(request.user_id)}>Accept Chat</button>
                    </li>
                ))}
            </ul>

            {/* Chat Window */}
            {currentChat && (
                <div className="chat-window">
                    <h3>Chat with User {currentChat}</h3>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.sender}`}>
                                <strong>{msg.sender === 'admin' ? 'Admin' : 'User'}:</strong> {msg.content}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={sendMessage}>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminSupportPanel;
