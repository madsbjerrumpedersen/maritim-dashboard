import React, { useState, useEffect } from 'react';
import './DashboardGraphs.css';
import { portCoordinates } from '../data/ports';

interface WeatherData {
  time: string;
  temp: number; // Celsius
  windSpeed: number; // m/s
  windDir: number; // Degrees
  condition: string;
}

interface WeatherGraphProps {
  locationName: string;
}

const WeatherGraph: React.FC<WeatherGraphProps> = ({ locationName }) => {
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!locationName || !portCoordinates[locationName]) return;

    const fetchWeather = async () => {
      setLoading(true);
      const [lat, lng] = portCoordinates[locationName];
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m&wind_speed_unit=ms&forecast_days=2&timezone=auto&models=best_match`
        );
        const data = await response.json();
        
        if (data.hourly) {
          const currentHour = new Date().getHours();
          // Find the index of the current hour in the response
          const startIndex = data.hourly.time.findIndex((t: string) => {
            const date = new Date(t);
            return date.getHours() === currentHour && date.getDate() === new Date().getDate();
          });

          // Fallback to 0 if not found (shouldn't happen with correct forecast_days)
          const validStartIndex = startIndex !== -1 ? startIndex : 0;

          const mappedData: WeatherData[] = data.hourly.time
            .slice(validStartIndex) // Start from current time
            .map((t: string, index: number) => {
              // Adjust index to match the original data arrays which weren't sliced
              const originalIndex = validStartIndex + index; 
              return {
                time: t.slice(11, 16),
                temp: Math.round(data.hourly.temperature_2m[originalIndex]),
                windSpeed: Math.round(data.hourly.wind_speed_10m[originalIndex]),
                windDir: data.hourly.wind_direction_10m[originalIndex],
                condition: data.hourly.weather_code[originalIndex] <= 1 ? 'Solrigt' : 'Skyet'
              };
            })
            .filter((_: any, i: number) => i % 3 === 0) 
            .slice(0, 8); 

          setForecast(mappedData);
        }
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [locationName]);

  if (!locationName) {
    return (
      <div className="graph-card">
        <h3>Vejrudsigt</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
          Vælg en rute for at se vejret
        </div>
      </div>
    );
  }

  if (loading) {
     return (
      <div className="graph-card">
        <h3>Vejret i {locationName}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
          Indhenter vejrudsigt...
        </div>
      </div>
    );
  }

  if (forecast.length === 0) {
     return (
      <div className="graph-card">
        <h3>Vejret i {locationName}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
          Ingen data tilgængelig
        </div>
      </div>
    );
  }

  const maxTemp = Math.max(...forecast.map(d => d.temp)) + 2;
  const minTemp = Math.min(...forecast.map(d => d.temp)) - 2;
  const tempRange = maxTemp - minTemp;

  // Generate Temperature Line Path (Bezier-like smoothing)
  // For simplicity and robustness, we use a simple polyline, but with circle points
  const width = 100;
  const height = 100;
  
  const getTempY = (t: number) => {
    if (tempRange === 0) return height / 2;
    return height - ((t - minTemp) / tempRange) * height;
  };

  const pointsString = forecast.map((d, i) => {
    const x = (i / (forecast.length - 1)) * width;
    const y = getTempY(d.temp);
    return `${x},${y}`;
  }).join(' ');

  // Icons
  const SunIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="weather-icon sunny">
      <circle cx="12" cy="12" r="5" fill="#FFD700" stroke="#FFD700" strokeWidth="2"/>
      <path d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const CloudIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="weather-icon cloudy">
      <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.132 20.177 10.244 17.86 10.019C17.565 6.42 14.582 3.5 11 3.5C7.306 3.5 4.3 6.634 4.024 10.355C1.69 11.082 0 13.313 0 16C0 19.314 2.686 22 6 22H17.5V19Z" fill="#B0C4DE"/>
    </svg>
  );

  return (
    <div className="graph-card weather-yr-style">
      <h3>
        Vejret i {locationName}
        <span className="graph-subtitle">Næste 24 timer</span>
      </h3>
      
      {/* Main Layout Grid */}
      <div className="yr-grid-container">
        
        {/* Y-Axis Labels (Temperature) */}
        <div className="yr-y-axis">
          <span>{Math.round(maxTemp)}°</span>
          <span>{Math.round((maxTemp + minTemp)/2)}°</span>
          <span>{Math.round(minTemp)}°</span>
        </div>

        {/* Chart Area */}
        <div className="yr-chart-area">
          {/* Horizontal Grid Lines */}
          <div className="grid-lines">
            <div className="grid-line top"></div>
            <div className="grid-line middle"></div>
            <div className="grid-line bottom"></div>
          </div>

          {/* Temperature Line */}
          <svg className="line-chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
             {/* Use a slight gradient fill below the line for effect? Yr uses solid line usually. Let's stick to solid line for clarity. */}
             <defs>
               <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.5"/>
                 <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0"/>
               </linearGradient>
             </defs>
             {/* Area fill */}
             <path d={`0,${height} ${pointsString} 100,${height}`} fill="url(#tempGradient)" style={{opacity: 0.2}} />
             {/* The Line */}
             <path d={`M ${pointsString}`} className="line-path" style={{ stroke: 'var(--accent-color)', strokeWidth: 3 }} />
          </svg>

          {/* Weather Conditions (Sky) - Positioned at top of columns */}
          <div className="yr-columns-overlay">
            {forecast.map((item, i) => (
              <div key={i} className="yr-column-top">
                {item.condition === 'Solrigt' ? <SunIcon /> : <CloudIcon />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* X-Axis (Time) */}
      <div className="yr-row yr-time-row">
        <div className="yr-row-label"></div> {/* Spacer for Y-axis alignment */}
        <div className="yr-row-content">
          {forecast.map((item, i) => (
            <div key={i} className="yr-cell">
              {item.time}
            </div>
          ))}
        </div>
      </div>

      {/* Wind Row */}
      <div className="yr-row yr-wind-row">
        <div className="yr-row-label">Vind (m/s)</div>
        <div className="yr-row-content">
          {forecast.map((item, i) => (
            <div key={i} className="yr-cell wind-cell">
              {/* Rotate by windDir + 180 to show direction FROM, or ensure arrow points WITH the wind. 
                  Standard meteorological arrows often point INTO the wind or WITH the wind depending on style.
                  Yr.no arrows point in the direction the wind is blowing TO. 
                  OpenMeteo gives direction wind is coming FROM (meteorological standard).
                  So if wind is from North (0 deg), it blows TO South (180 deg).
                  The SVG arrow points UP (North) by default.
                  So to show "blowing TO", we rotate by `windDir + 180`.
              */}
              <div className="wind-arrow-container" style={{ transform: `rotate(${item.windDir + 180}deg)` }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              </div>
              <span className="wind-speed">{item.windSpeed}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default WeatherGraph;
