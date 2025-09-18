export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // If within the last minute, show "Just now"
  if (seconds < 60) {
    return 'Just now';
  }
  
  // If within the last hour, show minutes ago
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  
  // If within the last 24 hours, show hours ago
  if (hours < 24) {
    return `${hours}h ago`;
  }
  
  // If within the last week, show days ago
  if (days < 7) {
    return `${days}d ago`;
  }
  
  // Otherwise, show the actual date
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};