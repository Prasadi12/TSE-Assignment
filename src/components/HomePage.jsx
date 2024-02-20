import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios'

const HomePage = () => {
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [weatherInfo, setWeatherInfo] = useState({});

    const getFormattedDate = (timestamp) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', options);
      };

      const getFormattedTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-US', { hour12: false });
      };

    useEffect(() => {
        if (weatherInfo && weatherInfo.dt) {
          const formattedDate = getFormattedDate(weatherInfo.dt);
          console.log('Formatted Date:', formattedDate);
          setDate(formattedDate)
        }
        if (weatherInfo && weatherInfo.sys?.sunrise && weatherInfo.sys?.sunset) {
            const formattedTime = getFormattedTime(weatherInfo.sys?.sunrise && weatherInfo.sys?.sunset);
          console.log('Formatted Time:', formattedTime);
          setTime(formattedTime)
        }
      }, [weatherInfo]);
  
    const handleKeyPress = async (e) => {
        if (e.key === 'Enter' && lat.trim() !== '' && lon.trim() !== '') {
          try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=33c92b0552e0eea71460739025382726`, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            console.log(response);
    
            const data = response.data;
            setWeatherInfo(data);
          } catch (error) {
            console.error('Error fetching weather data:', error.message);
          }
        }
      };

    return (
      <div className="weather-app">
        <div className="input-section">
          <input
            type="text"
            placeholder="Enter Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Longitude"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <hr />
        <div className="weather-info">
        <h2>{weatherInfo.name}{weatherInfo.sys?.country}</h2>
        <p>{date}</p>
        
        <table className='table'> 
            <tbody>
                <tr>
                    <td rowSpan={2}><img src={`https://openweathermap.org/img/wn/${weatherInfo.weather?.[0].icon}@2x.png`} alt='cloud' className='image'/></td>
                    <td rowSpan={2} className='border'><h1>{weatherInfo.main?.temp}&nbsp;<sup>o</sup></h1><h3>{weatherInfo.weather?.[0].main}</h3></td>
                    <td className='pl-2'>{weatherInfo.main?.temp_max}&nbsp;<sup>o</sup><br/>High</td>
                    <td>{weatherInfo.wind?.speed} mph<br/>Wind</td>
                    <td>{time}<br/>Sunrise</td>
                </tr>
                <tr>
                    <td className='pl-2'>{weatherInfo.main?.temp_min}&nbsp;<sup>o</sup><br/>Low</td>
                    <td>{weatherInfo.clouds?.all}%<br/>Rain</td>
                    <td>{time}<br/>Sunset</td>
                </tr>
            </tbody>
        </table>
        </div>
      </div>
    );
};

export default HomePage;
