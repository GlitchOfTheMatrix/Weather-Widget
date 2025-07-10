import React, { useState } from "react";
import "./App.css";

const API_KEY = "ac84f44c2848e86e0b3ebb3366c86bcd";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  // const fetchWeather = async () => {
  //   if (!city) return;
  //   try {
  //     const res = await fetch(
  //       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  //     );
  //     const data = await res.json();
  //     setWeather(data);
  //   } catch (error) {
  //     console.error("Error fetching weather:", error);
  //   }
  // };

  const fetchWeather = async () => {
    if (!city) return;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      console.log("API response:", data);

      if (data.cod !== 200) {
        alert(`API Error: ${data.message}`);
        return;
      }

      setWeather(data);
    } catch (error) {
      alert("Error fetching weather.");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Weather Forecast Widget</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>

      {weather && weather.main && (
        <div className="weather-card">
          <img
            className="weather-icon"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather Icon"
          />
          <h2>{weather.name}</h2>
          <p>
            {weather.weather[0].main}
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
              style={{ verticalAlign: "middle" }}
            />
          </p>
          <p>{weather.main.temp}°C</p>
        </div>
      )}
    </div>
  );
}

export default App;
