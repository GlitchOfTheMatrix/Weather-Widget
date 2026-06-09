import React, { useState } from "react";
import "./App.css";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const formatTemperature = (temp) =>
  typeof temp === "number" ? `${Math.round(temp)}°C` : "--°C";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCityChange = (event) => {
    setCity(event.target.value);
    if (error) {
      setError("");
    }
  };

  const fetchWeather = async () => {
    const query = city.trim();
    if (!query) {
      setError("Please enter a city name.");
      return;
    }

    if (!API_KEY) {
      setError(
        "Missing weather API key. Add REACT_APP_WEATHER_API_KEY to .env.",
      );
      return;
    }

    setIsLoading(true);
    setWeather(null);
    setError("");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          query,
        )}&appid=${API_KEY}&units=metric`,
      );
      const data = await response.json();

      if (!response.ok || data.cod !== 200) {
        setError(data?.message || "Unable to fetch weather data.");
        return;
      }

      setWeather(data);
    } catch (fetchError) {
      console.error("Weather fetch failed:", fetchError);
      setError(
        "Unable to fetch weather data. Check your network and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchWeather();
    }
  };

  const weatherInfo = weather?.weather?.[0];
  const iconUrl = weatherInfo?.icon
    ? `https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`
    : "";

  return (
    <div className="container">
      <h1>Weather Forecast Widget</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={handleCityChange}
          onKeyDown={handleKeyDown}
          aria-label="City name"
        />
        <button
          type="button"
          onClick={fetchWeather}
          disabled={isLoading || !city.trim()}
        >
          {isLoading ? "Loading..." : "Get Weather"}
        </button>
      </div>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {weather && (
        <div className="weather-card">
          {iconUrl && (
            <img
              className="weather-icon"
              src={iconUrl}
              alt={weatherInfo?.description || "Weather icon"}
            />
          )}
          <h2>{weather?.name || "Unknown location"}</h2>
          <p className="weather-description">
            {weatherInfo?.main || "Weather"}
            {weatherInfo?.description ? ` — ${weatherInfo.description}` : ""}
          </p>
          <p className="weather-temp">
            {formatTemperature(weather?.main?.temp)}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
