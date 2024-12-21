// ChatBot.jsx
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(''); // Added state for name
  const [isNameSet, setIsNameSet] = useState(false); // Track if name is set

  const handleSetName = () => {
    if (name.trim()) {
      setIsNameSet(true);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      sender: name,
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/chat', {
        messages: [...messages, userMessage]
      });

      const botResponse = {
        ...response.data.response,
        sender: 'AI Assistant'
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isNameSet) {
    return (
      <div className="max-w-2xl mx-auto p-4 h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Enter Your Name</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSetName()}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name..."
            />
            <button
              onClick={handleSetName}
              className="w-full px-6 py-2 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700"
            >
              Start Chatting
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 h-screen flex flex-col">
      <div className="bg-white rounded-lg shadow-lg flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg">
          <h1 className="text-xl font-semibold">AI Chat Bot</h1>
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex flex-col">
                <span className={`text-xs mb-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.sender}
                </span>
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-600 rounded-lg px-4 py-2 italic">
                Bot is typing...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-colors
                ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;