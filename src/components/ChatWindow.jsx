import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import WelcomeScreen from './WelcomeScreen';
import ThemeToggle from './ThemeToggle';
import { streamWeatherAgentResponse } from '../api/weatherService';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) {
      return messages;
    }
    return messages.filter(msg =>
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [messages, searchQuery]);

  useEffect(() => {
    if (fetchTrigger === 0) {
      return;
    }

    const abortController = new AbortController();
    const agentMessageIndex = messages.length - 1;

    const fetchStream = async () => {
      setIsLoading(true);
      
      const userMessage = messages[messages.length - 2];
      
      const apiMessage = {
        role: userMessage.role,
        content: userMessage.content,
      };

      const onChunk = (chunk) => {
        try {
            const contentRegex = /0:"((?:[^"\\]|\\.)*)"/g;
            let match;
            let extractedContent = '';

            while ((match = contentRegex.exec(chunk)) !== null) {
                extractedContent += JSON.parse(`"${match[1]}"`);
            }
        
            if (extractedContent) {
                setMessages(prev => {
                    const updated = [...prev];
                    if (updated[agentMessageIndex]) {
                        updated[agentMessageIndex].content += extractedContent;
                    }
                    return updated;
                });
            }
        } catch (parseError) {
          // Prevents crash on malformed chunk
        }
      };

      const onError = (errorMessage) => {
        if (errorMessage.name === 'AbortError') return;
        toast.error('Something went wrong. Please try again.');
        setIsLoading(false);
        setMessages(prev => prev.slice(0, agentMessageIndex));
      };

      const onDone = () => {
        setMessages(prev => {
          const updated = [...prev];
          if (updated[agentMessageIndex]) {
            updated[agentMessageIndex].timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          return updated;
        });
        setIsLoading(false);
      };
      
      await streamWeatherAgentResponse([apiMessage], onChunk, onError, onDone, abortController.signal);
    };

    fetchStream();

    return () => {
      abortController.abort();
    };

  }, [fetchTrigger]);

  const handleSendMessage = (messageContent) => {
    if (!messageContent.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    const agentPlaceholder = {
      role: 'agent',
      content: '',
      timestamp: ''
    };
    
    setMessages(prev => [...prev, userMessage, agentPlaceholder]);
    setInputValue('');
    setFetchTrigger(c => c + 1);
  };
  
  const handleFormSubmit = () => {
    handleSendMessage(inputValue);
  };

  const handleClearChat = () => {
    setMessages([]);
    setSearchQuery('');
    toast.success('Chat cleared!');
    setIsMenuOpen(false);
  };

  const handleExportChat = () => {
    if (messages.length === 0) {
      toast.error('There is nothing to export.');
      return;
    }

    const formattedChat = messages.map(msg =>
      `[${msg.timestamp}] ${msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}: ${msg.content}`
    ).join('\n\n');

    const blob = new Blob([formattedChat], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `weather-chat-history-${new Date().toISOString()}.txt`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Chat history exported!');
    setIsMenuOpen(false);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h1>Weather Agent</h1>
        <div className="header-controls">
          {/* Desktop Controls */}
          <div className="desktop-controls">
            <input
              type="search"
              placeholder="Search messages..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search messages"
            />
            <button 
              onClick={handleExportChat} 
              className="header-button" 
              aria-label="Export chat history"
            >
              Export
            </button>
            <button 
              onClick={handleClearChat} 
              className="header-button" 
              aria-label="Clear chat history"
            >
              Clear Chat
            </button>
          </div>
          <ThemeToggle />
          {/* Mobile Menu Button */}
          <div className="mobile-menu-container">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="mobile-menu-button" 
              aria-label="Open menu"
            >
              ⋮
            </button>
            {isMenuOpen && (
              <div className="mobile-menu">
                <input
                  type="search"
                  placeholder="Search..."
                  className="search-input-mobile"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search messages"
                />
                <button onClick={handleExportChat}>Export Chat</button>
                <button onClick={handleClearChat}>Clear Chat</button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {messages.length === 0 ? (
        <WelcomeScreen onPromptClick={handleSendMessage} />
      ) : (
        <MessageList 
          messages={filteredMessages} 
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      )}
      
      <MessageInput
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onSend={handleFormSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatWindow;