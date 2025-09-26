import React from 'react';

const MessageInput = ({ value, onChange, onSend, isLoading }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !isLoading) {
      event.preventDefault(); // Prevent new line on enter
      onSend();
    }
  };

  return (
    <form className="message-input" onSubmit={(e) => { e.preventDefault(); onSend(); }}>
      <input
        type="text"
        placeholder="Ask about the weather..."
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        aria-label="Chat input"
      />
      <button type="submit" disabled={isLoading || !value.trim()} aria-label="Send message">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13"></path>
          <path d="M22 2L15 22L11 13L2 9L22 2z"></path>
        </svg>
      </button>
    </form>
  );
};

export default MessageInput;