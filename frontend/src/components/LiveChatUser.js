// src/components/LiveChatUser.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../css/LiveChatUser.css';

const SOCKET_SERVER_URL = 'http://localhost:3000'; // Adjust as needed

const LiveChatUser = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL);
        setSocket(newSocket);

        // Join the chat room
        newSocket.emit('join', { room: 'support' });

        // Listen for messages
        newSocket.on('receive_message', (data) => {
            setMessages(prevMessages => [...prevMessages, data]);
        });

        return () => newSocket.disconnect();
    }, []);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const messageData = {
            room: 'support',
            message: inputMessage,
        };

        // Send the message
        socket.emit('send_message', messageData);

        // Add the message to the chat locally
        setMessages(prevMessages => [...prevMessages, { sender: 'user', content: inputMessage }]);
        setInputMessage('');
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <>
            <button onClick={toggleChat}>{isOpen ? 'Close Chat' : 'Get Support'}</button>

            {isOpen && (
                <div className="chat-modal">
                    <div className="chat-header">
                        <h3>Support Chat</h3>
                    </div>
                    <div className="chat-body">
                        <div className="messages-container">
                            {messages.map((msg, index) => (
                                <div key={index} className={`chat-message ${msg.sender === 'admin' ? 'admin' : 'user'}`}>
                                    <span>{msg.content}</span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={sendMessage}>
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                            />
                            <button type="submit">Send</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default LiveChatUser;
