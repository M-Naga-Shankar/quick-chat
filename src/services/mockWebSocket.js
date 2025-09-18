// Mock WebSocket service with BroadcastChannel
export class MockWebSocketService {
  constructor() {
    this.listeners = [];
    this.connectedUsers = new Set();
    this.messages = [];
    this.typingUsers = new Map();

    // Shared channel across tabs
    this.channel = new BroadcastChannel("chat-app");

    // Listen to broadcasted events
    this.channel.onmessage = (event) => {
      const { type, data } = event.data;
      this.emit(type, data, false); // false = don't rebroadcast
    };
  }

  simulateDelay = (callback, delay = 100) => {
    setTimeout(callback, delay);
  };

  on(type, callback) {
    this.listeners.push({ type, callback });
  }

  off(type, callback) {
    this.listeners = this.listeners.filter(
      (l) => !(l.type === type && l.callback === callback)
    );
  }

  emit(type, data, broadcast = true) {
    this.listeners
      .filter((l) => l.type === type)
      .forEach((l) => this.simulateDelay(() => l.callback(data)));

    if (broadcast) {
      this.channel.postMessage({ type, data });
    }
  }

  joinChat(username) {
    if (!this.connectedUsers.has(username)) {
      this.connectedUsers.add(username);
      this.emit("user-joined", { username, timestamp: Date.now() });
    }
  }

  leaveChat(username) {
    if (this.connectedUsers.has(username)) {
      this.connectedUsers.delete(username);
      this.typingUsers.delete(username);
      this.emit("user-left", { username, timestamp: Date.now() });
    }
  }

  sendMessage(username, message) {
    const chatMessage = {
      id: Date.now().toString() + Math.random(),
      username,
      message,
      timestamp: Date.now(),
    };

    this.messages.push(chatMessage);
    this.emit("message", chatMessage);

    this.stopTyping(username);
  }

  startTyping(username, content) {
    this.typingUsers.set(username, { content, timestamp: Date.now() });
    this.emit("typing", { username, content, timestamp: Date.now() });
  }

  stopTyping(username) {
    if (this.typingUsers.has(username)) {
      this.typingUsers.delete(username);
      this.emit("stop-typing", { username, timestamp: Date.now() });
    }
  }

  getMessages() {
    return [...this.messages];
  }

  getTypingUsers() {
    return Array.from(this.typingUsers.entries()).map(([username, data]) => ({
      username,
      content: data.content,
    }));
  }

  getConnectedUsers() {
    return Array.from(this.connectedUsers);
  }
}

export const mockWebSocket = new MockWebSocketService();