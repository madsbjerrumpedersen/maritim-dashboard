import { useState } from 'react';
import './index.css';
import Map from './components/Map';
import RouteForm from './components/RouteForm';
import { getSeaRoute } from './data/seaRoutes';

function App() {
  const [route, setRoute] = useState<[number, number][]>([]);

  const handlePlanRoute = (start: string, destination: string) => {
    const seaRoute = getSeaRoute(start, destination);
    if (seaRoute) {
      setRoute(seaRoute);
    } else {
      setRoute([]); // Clear route if no path is found
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>Plan your route</h1>
        <RouteForm onPlanRoute={handlePlanRoute} />
      </div>
      <div className="map-container">
        <Map route={route} />
      </div>
    </div>
  );
}

export default App;