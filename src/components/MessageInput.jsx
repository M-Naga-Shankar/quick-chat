import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';

export const MessageInput = ({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  placeholder = "Type a message..."
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Handle input changes with typing indicators
  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Start typing indicator if not already typing
    if (!isTyping && value.trim()) {
      setIsTyping(true);
      onTypingStart(value.trim());
    } else if (value.trim()) {
      // Update typing content
      onTypingStart(value.trim());
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    if (value.trim()) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTypingStop();
      }, 1000);
    } else {
      // Stop typing immediately if input is empty
      setIsTyping(false);
      onTypingStop();
    }
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
      onTypingStop();
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center space-x-3">
      {/* Emoji Button */}
      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
        <Smile className="h-5 w-5" />
      </button>

      {/* Message Input */}
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-800 transition-all"
          maxLength={500}
        />
        {message.length > 400 && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
            {500 - message.length}
          </div>
        )}
      </div>

      {/* Send Button */}
      <button
        onClick={handleSendMessage}
        disabled={!message.trim()}
        className={`p-3 rounded-full transition-all transform ${
          message.trim()
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105 shadow-lg'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
};