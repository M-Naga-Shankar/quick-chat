import React from 'react';

export const TypingIndicator = ({ typingUsers }) => {
  if (typingUsers.length === 0) {
    return <div className="h-8" />; // Maintain height for layout stability
  }

  return (
    <div className="px-4 py-2 bg-gray-50/80 border-t border-gray-200/50 max-h-32 overflow-y-auto">
      <div className="space-y-1">
        {typingUsers.map((user) => (
          <div key={user.username} className="flex items-start space-x-2 text-sm">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="font-medium text-blue-600 flex-shrink-0">{user.username}:</span>
            </div>
            <div className="text-gray-600 italic truncate min-w-0 flex-1">
              "{user.content}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};