import React, { useMemo } from 'react';
import './DashboardGraphs.css';

interface SpeedGraphProps {
  route: [number, number][];
}

const SpeedGraph: React.FC<SpeedGraphProps> = ({ route }) => {
  const speedProfile = useMemo(() => {
    if (!route || route.length === 0) return [];

    // Simulate speed based on route segments
    const points = [];
    const totalPoints = 20; 
    const cruiseSpeed = 18; 

    for (let i = 0; i < totalPoints; i++) {
      let speed = cruiseSpeed;
      if (i < 3) speed = cruiseSpeed * (i + 1) / 4;
      if (i > totalPoints - 4) speed = cruiseSpeed * (totalPoints - i) / 4;
      speed += (Math.random() * 4 - 2);

      points.push({
        distance: Math.round((i / (totalPoints - 1)) * 100), 
        speed: Math.max(0, parseFloat(speed.toFixed(1)))
      });
    }
    return points;
  }, [route]);

  if (!route || route.length === 0) {
    return (
      <div className="graph-card">
        <h3>Hastighedsanalyse for turen</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
          Planlæg en rute for at se hastighedsanalyse
        </div>
      </div>
    );
  }

  // Generate SVG Path
  const width = 100;
  const height = 100;
  const maxSpeed = 25;
  
  const pointsString = speedProfile.map((p, i) => {
    const x = (i / (speedProfile.length - 1)) * width;
    const y = height - (p.speed / maxSpeed) * height;
    return `${x},${y}`;
  }).join(' ');

  const areaString = `0,${height} ${pointsString} ${width},${height}`;

  return (
    <div className="graph-card">
      <h3>
        Estimeret rejsehastighed
        <span className="graph-subtitle">Gns: {speedProfile.reduce((a, b) => a + b.speed, 0) / speedProfile.length | 0} knob</span>
      </h3>
      <div className="chart-container" style={{ paddingBottom: '30px' }}>
        {/* Y-Axis: Speed */}
        <div className="y-axis">
          <span>{maxSpeed} knob</span>
          <span>{Math.round(maxSpeed * 0.75)}</span>
          <span>{Math.round(maxSpeed * 0.5)}</span>
          <span>{Math.round(maxSpeed * 0.25)}</span>
          <span>0</span>
        </div>

        <div className="chart-content" style={{ display: 'flex', flexDirection: 'column', paddingBottom: 0, borderBottom: 'none' }}>
           <div style={{ flex: 1, width: '100%', position: 'relative', borderBottom: '1px solid var(--border-color)' }}>
             <svg className="line-chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
               {/* Grid lines */}
               <line x1="0" y1="25" x2="100" y2="25" className="chart-grid-line" />
               <line x1="0" y1="50" x2="100" y2="50" className="chart-grid-line" />
               <line x1="0" y1="75" x2="100" y2="75" className="chart-grid-line" />

               <path d={areaString} className="area-path" />
               <path d={`M ${pointsString}`} className="line-path" />
            </svg>
           </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', width: '100%' }}>
            <span className="x-axis-label" style={{ position: 'relative', width: 'auto', bottom: 'auto' }}>Start</span>
            <span className="x-axis-label" style={{ position: 'relative', width: 'auto', bottom: 'auto' }}>50%</span>
            <span className="x-axis-label" style={{ position: 'relative', width: 'auto', bottom: 'auto' }}>Slut</span>
          </div>
          <div className="x-axis-label" style={{ bottom: '-25px' }}>Rejsens længde</div>
        </div>
      </div>
    </div>
  );
};

export default SpeedGraph;