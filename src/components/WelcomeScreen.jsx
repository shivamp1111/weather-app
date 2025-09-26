import React from 'react';

const WelcomeScreen = ({ onPromptClick }) => {
  const prompts = [
    "What's the weather like today?",
    "Will it rain tomorrow?",
    "Show me the forecast for this week",
    "What's the temperature in New York?"
  ];

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-icon">☁️</div>
        <h1>Welcome to Weather Agent</h1>
        <p>Ask me about current weather conditions, forecasts, or any weather-related questions. I'm here to help!</p>
        <div className="prompt-suggestions">
          {prompts.map((prompt, index) => (
            <button key={index} onClick={() => onPromptClick(prompt)} className="prompt-button">
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;