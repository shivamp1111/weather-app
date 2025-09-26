// src/utils/weatherUtils.js

export const getWeatherIcon = (text) => {
  const lowerCaseText = text.toLowerCase();

  if (lowerCaseText.includes('rain') || lowerCaseText.includes('drizzle')) {
    return '🌧️';
  }
  if (lowerCaseText.includes('cloudy') || lowerCaseText.includes('overcast')) {
    return '☁️';
  }
  if (lowerCaseText.includes('sun') || lowerCaseText.includes('clear')) {
    return '☀️';
  }
  if (lowerCaseText.includes('snow')) {
    return '❄️';
  }
  if (lowerCaseText.includes('thunder') || lowerCaseText.includes('storm')) {
    return '⛈️';
  }
  if (lowerCaseText.includes('mist') || lowerCaseText.includes('fog')) {
    return '🌫️';
  }

  return null; // Return null if no specific weather is mentioned
};