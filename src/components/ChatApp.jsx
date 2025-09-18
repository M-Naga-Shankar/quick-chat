import React, { useState, useEffect, useCallback } from 'react';
import { ChatWindow } from './ChatWindow';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { UserLogin } from './UserLogin';
import { mockWebSocket } from '../services/mockWebSocket';
import { Users, MessageCircle } from 'lucide-react';

export const ChatApp = () => {
  const [currentUser, setCurrentUser] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle new messages
  const handleNewMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // Handle typing events
  const handleTyping = useCallback((data) => {
    if (data.username !== currentUser) {
      setTypingUsers(prev => {
        const filtered = prev.filter(user => user.username !== data.username);
        return [...filtered, { username: data.username, content: data.content }];
      });
    }
  }, [currentUser]);

  // Handle stop typing events
  const handleStopTyping = useCallback((data) => {
    setTypingUsers(prev => prev.filter(user => user.username !== data.username));
  }, []);

  // Handle user joined
  const handleUserJoined = useCallback((data) => {
    setConnectedUsers(prev => {
      if (!prev.includes(data.username)) {
        return [...prev, data.username];
      }
      return prev;
    });
  }, []);

  // Handle user left
  const handleUserLeft = useCallback((data) => {
    setConnectedUsers(prev => prev.filter(user => user !== data.username));
    setTypingUsers(prev => prev.filter(user => user.username !== data.username));
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!isLoggedIn) return;

    mockWebSocket.on('message', handleNewMessage);
    mockWebSocket.on('typing', handleTyping);
    mockWebSocket.on('stop-typing', handleStopTyping);
    mockWebSocket.on('user-joined', handleUserJoined);
    mockWebSocket.on('user-left', handleUserLeft);

    // Load existing messages
    setMessages(mockWebSocket.getMessages());
    setConnectedUsers(mockWebSocket.getConnectedUsers());

    return () => {
      mockWebSocket.off('message', handleNewMessage);
      mockWebSocket.off('typing', handleTyping);
      mockWebSocket.off('stop-typing', handleStopTyping);
      mockWebSocket.off('user-joined', handleUserJoined);
      mockWebSocket.off('user-left', handleUserLeft);
    };
  }, [isLoggedIn, handleNewMessage, handleTyping, handleStopTyping, handleUserJoined, handleUserLeft]);

  // Handle user login
  const handleLogin = (username) => {
    setCurrentUser(username);
    setIsLoggedIn(true);
    mockWebSocket.joinChat(username);
  };

  // Handle sending message
  const handleSendMessage = (message) => {
    mockWebSocket.sendMessage(currentUser, message);
  };

  // Handle typing start with content
  const handleTypingStart = (content) => {
    mockWebSocket.startTyping(currentUser, content);
  };

  // Handle typing stop
  const handleTypingStop = () => {
    mockWebSocket.stopTyping(currentUser);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (currentUser) {
        mockWebSocket.leaveChat(currentUser);
      }
    };
  }, [currentUser]);

  if (!isLoggedIn) {
    return <UserLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 h-screen flex flex-col max-w-4xl">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-t-xl shadow-lg border border-white/20 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Quick Chat</h1>
              <p className="text-sm text-gray-600">Welcome, {currentUser}!</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{connectedUsers.length} online</span>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white/60 backdrop-blur-sm border-l border-r border-white/20 flex flex-col overflow-hidden">
          <ChatWindow 
            messages={messages} 
            currentUser={currentUser}
            connectedUsers={connectedUsers}
          />
          <TypingIndicator typingUsers={typingUsers} />
        </div>

        {/* Message Input */}
        <div className="bg-white/80 backdrop-blur-sm rounded-b-xl shadow-lg border border-white/20 p-4">
          <MessageInput
            onSendMessage={handleSendMessage}
            onTypingStart={handleTypingStart}
            onTypingStop={handleTypingStop}
            placeholder={`Message as ${currentUser}...`}
          />
        </div>
      </div>
    </div>
  );
};