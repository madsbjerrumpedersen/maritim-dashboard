import { useState, useEffect } from 'react';
import './index.css';
import Map from './components/Map';
import RouteForm from './components/RouteForm';
import NodeEditor from './components/NodeEditor';
import { getSeaRoute } from './data/seaRoutes';

function App() {
  const [route, setRoute] = useState<[number, number][]>([]);
  const [currentPath, setCurrentPath] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setCurrentPath(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handlePlanRoute = (start: string, destination: string) => {
    const seaRoute = getSeaRoute(start, destination);
    if (seaRoute) {
      setRoute(seaRoute);
    } else {
      setRoute([]); 
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
          <span className="logo-text">MaritimNav</span>
        </div>
        <div className="sidebar-content">
          <RouteForm onPlanRoute={handlePlanRoute} />
        </div>
      </aside>
      <main className="main-content">
        <div className="map-wrapper">
          <Map route={route} />
        </div>
      </main>
    </div>
  );
}

export default App;