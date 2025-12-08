import { useState, useEffect } from 'react';
import './index.css';
import Map from './components/Map';
import RouteForm from './components/RouteForm';
import NodeEditor from './components/NodeEditor';
import WeatherGraph from './components/WeatherGraph';
import RouteGraph from './components/RouteGraph';
import { getSeaRoute } from './data/seaRoutes';
import { type Node } from './data/maritimeGraph';
import { type ShipProfile, DEFAULT_SHIP } from './data/ships';
import { fetchRouteWeather, type RouteForecast } from './data/weatherService';

function App() {
  const [route, setRoute] = useState<[number, number][]>([]);
  const [routeNodes, setRouteNodes] = useState<Node[]>([]);
  const [selectedShip, setSelectedShip] = useState<ShipProfile>(DEFAULT_SHIP);
  const [weatherData, setWeatherData] = useState<RouteForecast>({});
  const [startPort, setStartPort] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [currentPath, setCurrentPath] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setCurrentPath(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handlePlanRoute = async (start: string, destination: string, date: string) => {
    setStartPort(start);
    setWeatherData({}); // Reset weather
    
    // Parse date string (YYYY-MM-DD) to timestamp
    // Default to noon on that day to be safe/middle of day
    const startTimestamp = new Date(date + 'T12:00:00').getTime();
    setStartTime(startTimestamp);

    const result = getSeaRoute(start, destination);
    if (result) {
      setRoute(result.coordinates);
      setRouteNodes(result.nodes);
      
      // Fetch weather for the route
      try {
        const weather = await fetchRouteWeather(result.nodes);
        setWeatherData(weather);
      } catch (err) {
        console.error("Failed to fetch route weather", err);
      }
    } else {
      setRoute([]); 
      setRouteNodes([]);
    }
  };

  if (currentPath === '#/update') {
    return <NodeEditor />;
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 11L12 2L21 11M5 22H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="logo-text">GreenSeaOptima</span>
        </div>
        <div className="sidebar-content">
          <RouteForm onPlanRoute={handlePlanRoute} onShipChange={setSelectedShip} />
        </div>
      </aside>
      <main className="main-content">
        <div className="map-wrapper">
          <Map route={route} />
        </div>
        <div className="dashboard-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <WeatherGraph locationName={startPort} />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <RouteGraph 
              nodes={routeNodes} 
              shipProfile={selectedShip} 
              weatherData={weatherData} 
              startTime={startTime}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;