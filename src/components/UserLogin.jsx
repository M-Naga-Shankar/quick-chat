import React, { useState } from 'react';
import { MessageCircle, User, ArrowRight } from 'lucide-react';

export const UserLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      setError('Please enter a username');
      return;
    }
    
    if (trimmedUsername.length < 2) {
      setError('Username must be at least 2 characters long');
      return;
    }
    
    if (trimmedUsername.length > 20) {
      setError('Username must be less than 20 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_\s]+$/.test(trimmedUsername)) {
      setError('Username can only contain letters, numbers, spaces, and underscores');
      return;
    }

    setError('');
    onLogin(trimmedUsername);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quick Chat</h1>
          <p className="text-gray-600">Enter your username to join the conversation</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your username"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    error 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  maxLength={20}
                  autoComplete="off"
                  autoFocus
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 animate-fadeIn">
                  {error}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                2-20 characters, letters, numbers, spaces, and underscores only
              </p>
            </div>

            <button
              type="submit"
              disabled={!username.trim()}
              className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all transform ${
                username.trim()
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Join Chat</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-blue-500 font-semibold text-lg">Real-time</div>
            <div className="text-sm text-gray-600">Instant messaging</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-green-500 font-semibold text-lg">No Tracking</div>
            <div className="text-sm text-gray-600">Secure Chat</div>
          </div>
        </div>
      </div>
    </div>
  );
};