// src/components/LiveChatUser.js

import React, { useState, useEffect, useRef } from 'react';
import '../css/LiveChatUser.css';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000'; // Replace with your server URL

const LiveChatUser = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState('issueSelection'); // 'issueSelection', 'waiting', 'chat'
    const [selectedIssue, setSelectedIssue] = useState('');
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [statusMessage, setStatusMessage] = useState('Waiting for an admin to join...');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (currentStep === 'chat') {
            const token = localStorage.getItem('token'); // JWT token for authentication

            // Initialize Socket.IO connection
            const newSocket = io(SOCKET_SERVER_URL, {
                query: { token },
            });

            setSocket(newSocket);

            // Listen for incoming messages
            newSocket.on('receive_message', (data) => {
                setMessages((prevMessages) => [...prevMessages, { sender: 'admin', content: data.message, timestamp: data.timestamp }]);
            });

            // Listen for admin joining the chat
            newSocket.on('admin_joined', () => {
                setStatusMessage('');
            });

            // Listen for admin disconnect
            newSocket.on('admin_disconnected', () => {
                setStatusMessage('Admin has disconnected.');
            });

            // Cleanup on component unmount
            return () => newSocket.disconnect();
        }
    }, [currentStep]);

    useEffect(() => {
        // Auto-scroll to the latest message
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const toggleChat = () => {
        if (!isOpen) {
            // Reset chat state when opening
            setCurrentStep('issueSelection');
            setSelectedIssue('');
            setMessages([]);
            setInputMessage('');
            setStatusMessage('Waiting for an admin to join...');
        }
        setIsOpen(!isOpen);
    };

    const handleIssueSelect = (issue) => {
        setSelectedIssue(issue);
        setCurrentStep('waiting');

        // Notify backend to initiate chat session
        if (socket) {
            socket.emit('initiate_chat', { issue });
        }
    };

    const handleStartChat = () => {
        setCurrentStep('chat');
        // Additional logic to notify backend to assign an admin
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() === '' || currentStep !== 'chat') return;

        const newMessage = {
            sender: 'user',
            content: inputMessage,
            timestamp: new Date(),
        };

        setMessages([...messages, newMessage]);
        setInputMessage('');

        // Emit message to backend
        if (socket) {
            socket.emit('send_message', { message: inputMessage });
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button className={`chat-button ${isOpen ? 'open' : ''}`} onClick={toggleChat}>
                {isOpen ? '×' : '💬'}
            </button>

            {/* Chat Window Modal */}
            {isOpen && (
                <div className="chat-modal">
                    <div className="chat-header">
                        <h3>Support Chat</h3>
                        <button className="close-button" onClick={toggleChat}>
                            ×
                        </button>
                    </div>

                    <div className="chat-body">
                        {currentStep === 'issueSelection' && (
                            <div className="issue-selection">
                                <h4>Select an Issue:</h4>
                                <ul>
                                    <li onClick={() => handleIssueSelect('Technical Support')}>Technical Support</li>
                                    <li onClick={() => handleIssueSelect('Billing')}>Billing</li>
                                    <li onClick={() => handleIssueSelect('General Inquiry')}>General Inquiry</li>
                                </ul>
                            </div>
                        )}

                        {currentStep === 'waiting' && (
                            <div className="waiting-status">
                                <p>Please wait while we connect you to an admin.</p>
                                <button onClick={handleStartChat}>Start Chat</button>
                            </div>
                        )}

                        {currentStep === 'chat' && (
                            <>
                                {statusMessage && <p className="status-message">{statusMessage}</p>}
                                <div className="messages-container">
                                    {messages.length === 0 ? (
                                        <p className="no-messages">No messages yet. Start the conversation!</p>
                                    ) : (
                                        messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`chat-message ${msg.sender === 'admin' ? 'admin' : 'user'}`}
                                            >
                                                <img
                                                    src={msg.sender === 'admin' ? '/admin-avatar.png' : '/user-avatar.png'}
                                                    alt={`${msg.sender} avatar`}
                                                    className="avatar"
                                                />
                                                <div className="message-content">{msg.content}</div>
                                                <div className="message-timestamp">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                                <form className="chat-input" onSubmit={sendMessage}>
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        required
                                    />
                                    <button type="submit">Send</button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default LiveChatUser;
