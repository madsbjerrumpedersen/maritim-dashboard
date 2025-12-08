import React, { useState, useMemo, useEffect } from 'react';
import './RouteForm.css';
import { allRoutes } from '../data/seaRoutes';
import { portRegions } from '../data/ports';
import { SHIPS, type ShipProfile } from '../data/ships';

// Extract unique port names from the routes you defined
const uniquePorts = [...new Set(Object.keys(allRoutes).flatMap(key => key.split('-')))];

const RouteForm: React.FC<{ 
  onPlanRoute: (start: string, destination: string) => void;
  onShipChange: (ship: ShipProfile) => void;
}> = ({ onPlanRoute, onShipChange }) => {
  const [start, setStart] = useState(uniquePorts[0]);
  const [destination, setDestination] = useState(uniquePorts[1]);
  
  // Default to first ship
  const defaultShipId = Object.keys(SHIPS)[0];
  const [selectedShipId, setSelectedShipId] = useState(defaultShipId);

  // Notify parent of initial ship selection
  useEffect(() => {
    if (SHIPS[defaultShipId]) {
      onShipChange(SHIPS[defaultShipId]);
    }
  }, []);

  // Group and sort ports
  const groupedPorts = useMemo(() => {
    const groups: Record<string, string[]> = {};
    
    uniquePorts.forEach(port => {
      const region = portRegions[port] || 'Andet';
      if (!groups[region]) groups[region] = [];
      groups[region].push(port);
    });

    // Sort ports within groups
    Object.keys(groups).forEach(region => {
      groups[region].sort();
    });

    return groups;
  }, []);

  const sortedRegions = useMemo(() => Object.keys(groupedPorts).sort(), [groupedPorts]);

  const renderPortOptions = (excludePort?: string) => {
    return sortedRegions.map(region => {
      const portsInRegion = groupedPorts[region].filter(port => port !== excludePort);
      
      if (portsInRegion.length === 0) return null;

      return (
        <optgroup key={region} label={region}>
          {portsInRegion.map(port => (
            <option key={port} value={port}>{port}</option>
          ))}
        </optgroup>
      );
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onPlanRoute(start, destination);
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStart = e.target.value;
    setStart(newStart);
    
    // Prevent start and destination from being the same
    if (newStart === destination) {
      const newDest = uniquePorts.find(p => p !== newStart);
      if (newDest) setDestination(newDest);
    }
  };

  const handleShipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newShipId = e.target.value;
    setSelectedShipId(newShipId);
    if (SHIPS[newShipId]) {
      onShipChange(SHIPS[newShipId]);
    }
  };

  const ChevronDown = () => (
    <svg className="select-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <form onSubmit={handleSubmit} className="route-form">
      
      <div className="form-section">
        <div className="section-title">Ruteoplysninger</div>
        
        <div className="route-timeline">
          <div className="form-group timeline-point">
            <label htmlFor="start">Afgangshavn</label>
            <div className="custom-select-wrapper">
              <select 
                id="start" 
                value={start} 
                onChange={handleStartChange}
                className="form-control"
              >
                {renderPortOptions()}
              </select>
              <ChevronDown />
            </div>
          </div>

          <div className="form-group timeline-point">
            <label htmlFor="destination">Destinationshavn</label>
            <div className="custom-select-wrapper">
              <select 
                id="destination" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
                className="form-control"
              >
                {renderPortOptions(start)}
              </select>
              <ChevronDown />
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-title">Fartøjskonfiguration</div>
        <div className="form-group">
          <label htmlFor="transportType">Skibstype</label>
          <div className="custom-select-wrapper">
            <select
              id="transportType"
              value={selectedShipId}
              onChange={handleShipChange}
              className="form-control"
            >
              {Object.values(SHIPS).map(ship => (
                <option key={ship.id} value={ship.id}>{ship.name}</option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>
      </div>

      <button type="submit" className="submit-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 16L16 12L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Beregn rute
      </button>
    </form>
  );
};

export default RouteForm;