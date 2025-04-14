import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherForecast = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "fc5c9d953413413ab6a154537251404"; // Replace with your actual key

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=3&aqi=no&alerts=no`
          );
          setWeather(response.data);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch weather data.");
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setError("Location access denied.");
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <div>Loading weather...</div>;
  if (error) return <div>{error}</div>;

  const current = weather.current;
  const forecast = weather.forecast.forecastday;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Weather Forecast</h2>
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <img className="h-10 w-10" src={current.condition.icon} alt={current.condition.text} />
          <span className="text-2xl font-bold ml-2">{current.temp_c}°C</span>
        </div>
        <p className="text-gray-600">{current.condition.text}</p>
        <div className="flex justify-between mt-4 text-sm">
          {forecast.map((day, index) => (
            <div key={index} className="text-center">
              <p>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
              <img className="h-6 w-6 mx-auto" src={day.day.condition.icon} alt={day.day.condition.text} />
              <p>{day.day.avgtemp_c}°C</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;
