import React, { useEffect, useState } from 'react';


function Weather() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('Guntur'); // default fallback

  // Get user's geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeather(`${latitude},${longitude}`);
      },
      () => fetchWeather(location) // fallback if permission denied
    );
  }, []);

  const fetchWeather = async (loc) => {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${loc}&days=3&aqi=no&alerts=no`;
    const res = await fetch(url);
    const data = await res.json();
    setWeather(data);
  };

  if (!weather) return <p>Loading weather...</p>;

  return (
    <div className="weather-widget">
      <h2>Weather in {weather.location.name}, {weather.location.country}</h2>
      <p>
        <strong>{weather.current.condition.text}</strong> | {weather.current.temp_c}°C / {weather.current.temp_f}°F
      </p>
      <h4>3-Day Forecast:</h4>
      <ul>
        {weather.forecast.forecastday.map((day) => (
          <li key={day.date}>
            {day.date}: {day.day.condition.text}, High: {day.day.maxtemp_c}°C, Low: {day.day.mintemp_c}°C
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Weather;
