import React from 'react';
import { getWeatherIcon } from '../utils/weatherUtils';

const HighlightedText = ({ text, highlight }) => {
  if (!highlight || !highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i}>{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

const TypingIndicator = () => (
  <div className="typing-indicator">
    <span></span>
    <span></span>
    <span></span>
  </div>
);

const ChatMessage = ({ message, searchQuery }) => {
  const { role, content, timestamp } = message;
  const isUser = role === 'user';
  const messageClass = isUser ? 'user' : 'agent';
  
  // Show typing indicator if agent message has no content and no timestamp
  const isLoading = role === 'agent' && content === '' && timestamp === '';
  const weatherIcon = isUser || isLoading ? null : getWeatherIcon(content);

  return (
    <div className={`chat-message ${messageClass}`}>
      <div className="message-content">
        {weatherIcon && <span className="weather-icon">{weatherIcon}</span>}
        <div className="message-bubble">
          {isLoading ? <TypingIndicator /> : <HighlightedText text={content} highlight={searchQuery} />}
        </div>
      </div>
      {timestamp && <span className="message-timestamp">{timestamp}</span>}
    </div>
  );
};

export default ChatMessage;