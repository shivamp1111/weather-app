import React from 'react';
import ChatMessage from './ChatMessage';
import { useChatScroll } from '../hooks/useChatScroll';

const MessageList = ({ messages, isLoading }) => {
  const scrollRef = useChatScroll(messages); // Hook for auto-scrolling

  return (
    <div className="message-list" ref={scrollRef}>
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} />
      ))}
      {isLoading && messages.length > 0 && (
        <div className="status-message">Agent is typing...</div>
      )}
    </div>
  );
};

export default MessageList;