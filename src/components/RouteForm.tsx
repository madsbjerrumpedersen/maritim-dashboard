import React, { useState } from 'react';
import './RouteForm.css';
import { allRoutes } from '../data/seaRoutes';

// Extract unique port names from the routes you defined
const uniquePorts = [...new Set(Object.keys(allRoutes).flatMap(key => key.split('-')))];

const RouteForm: React.FC<{ onPlanRoute: (start: string, destination: string) => void }> = ({ onPlanRoute }) => {
  const [start, setStart] = useState(uniquePorts[0]);
  const [destination, setDestination] = useState(uniquePorts[1]);
  const [transportType, setTransportType] = useState('container-ship');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onPlanRoute(start, destination);
  };

  return (
    <form onSubmit={handleSubmit} className="route-form">
      <div className="form-group-inline">
        <div className="location-select">
          <label htmlFor="start">Start</label>
          <select id="start" value={start} onChange={(e) => setStart(e.target.value)}>
            {uniquePorts.map(port => <option key={port} value={port}>{port}</option>)}
          </select>
        </div>
        <span className="arrow">→</span>
        <div className="location-select">
          <label htmlFor="destination">Destination</label>
          <select id="destination" value={destination} onChange={(e) => setDestination(e.target.value)}>
            {uniquePorts.map(port => <option key={port} value={port}>{port}</option>)}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="transportType">Transport Type</label>
        <select
          id="transportType"
          value={transportType}
          onChange={(e) => setTransportType(e.target.value)}
        >
          <option value="container-ship">Container Ship</option>
          <option value="tanker">Tanker</option>
          <option value="bulk-carrier">Bulk Carrier</option>
          <option value="ro-ro-ship">Ro-Ro Ship</option>
        </select>
      </div>
      <button type="submit" className="submit-btn">
        Plan Route
      </button>
    </form>
  );
};

export default RouteForm;