import React, { useMemo } from 'react';
import './DashboardGraphs.css';
import type { Node } from '../data/maritimeGraph';
import { type ShipProfile, DEFAULT_SHIP } from '../data/ships';
import { calculateVoyageProfile } from '../utils/routePhysics';

interface RouteGraphProps {
  nodes: Node[];
  shipProfile?: ShipProfile;
  weatherData?: Record<string, { windSpeed: number; windDir: number }>;
}

const RouteGraph: React.FC<RouteGraphProps> = ({ nodes, shipProfile = DEFAULT_SHIP, weatherData = {} }) => {
  const voyage = useMemo(() => {
    return calculateVoyageProfile(nodes, shipProfile, weatherData);
  }, [nodes, shipProfile, weatherData]);

  if (!nodes || nodes.length < 2) {
    return (
      <div className="graph-card" style={{ height: '380px' }}>
        <h3>Ruteanalyse</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
          Planlæg en rute for at se detaljeret analyse
        </div>
      </div>
    );
  }

  // Chart Dimensions
  const width = 800;
  const height = 300;
  const padding = { top: 40, right: 40, bottom: 80, left: 50 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxSpeedY = Math.max(shipProfile.maxSpeed + 2, ...voyage.segments.map(s => s.speedKnots));
  const totalDist = voyage.totalDistanceKm;

  // Scales
  const getX = (dist: number) => padding.left + (dist / totalDist) * graphWidth;
  const getY = (speed: number) => (height - padding.bottom) - (speed / maxSpeedY) * graphHeight;

  // Generate Path
  const points = voyage.segments.map(s => `${getX(s.distanceKm)},${getY(s.speedKnots)}`).join(' ');

  // Wind Vectors (Sampled)
  // We can't show every single segment arrow if there are too many. Sample every N pixels.
  const windArrows = [];
  const minArrowSpacing = 40; // px
  let lastArrowX = -100;

  for (const seg of voyage.segments) {
    const x = getX(seg.distanceKm);
    if (x - lastArrowX > minArrowSpacing) {
       // Determine visual representation
       // For simplicity in this view, we just show the wind speed as color intensity or length
       // Ideally we need the Segment Bearing to calculate relative wind rotation for the arrow.
       // Since we don't have segment bearing easily here (it's inside physics), 
       // let's just show absolute Wind Direction for now, or simplify.
       
       // Simplified: Red/Green dot based on speed?
       // Let's rely on the speed graph dipping to show headwind.
       // Here we just show the Wind Speed bar.
       
       windArrows.push({
           x,
           speed: seg.windSpeed,
           dir: seg.windDir
       });
       lastArrowX = x;
    }
  }

  // Format Duration
  const days = Math.floor(voyage.totalTimeHours / 24);
  const hours = Math.round(voyage.totalTimeHours % 24);

  return (
    <div className="graph-card" style={{ height: 'auto', minHeight: '420px' }}>
      {/* Header Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
           <h3 style={{ marginBottom: '0.2rem' }}>Ruteanalyse: {shipProfile.name}</h3>
           <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Total Distance: {Math.round(voyage.totalDistanceKm).toLocaleString()} km
           </div>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem' }}>
            <div className="stat-box">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Est. Rejsetid</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                    {days}d {hours}t
                </div>
            </div>
            <div className="stat-box">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total CO2</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ff9800' }}>
                    {(voyage.totalCo2Kg / 1000).toFixed(1)} tons
                </div>
            </div>
             <div className="stat-box">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gns. Fart</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                    {voyage.avgSpeedKnots.toFixed(1)} knob
                </div>
            </div>
        </div>
      </div>

      {/* Main Chart */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="line-chart-svg">
          
          {/* Grid */}
          <line x1={padding.left} y1={padding.top} x2={width - padding.right} y2={padding.top} stroke="var(--border-color)" strokeDasharray="4" />
          <line x1={padding.left} y1={height/2} x2={width - padding.right} y2={height/2} stroke="var(--border-color)" strokeDasharray="4" />
          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="var(--border-color)" />

          {/* Stops Markers */}
          {voyage.segments.filter(s => s.isStop).map((stop, i) => {
             const x = getX(stop.distanceKm);
             return (
               <g key={i}>
                 <line 
                    x1={x} 
                    y1={padding.top} 
                    x2={x} 
                    y2={height - padding.bottom} 
                    stroke="var(--text-muted)" 
                    strokeOpacity="0.2" 
                    strokeDasharray="2" 
                 />
                 <text 
                    x={x} 
                    y={height - padding.bottom + 20} 
                    textAnchor="middle" 
                    fill="var(--text-dark)" 
                    fontSize="10" 
                    fontWeight="bold"
                 >
                   {stop.stopName}
                 </text>
                 <circle cx={x} cy={height - padding.bottom} r="4" fill="var(--text-dark)" />
               </g>
             );
          })}

          {/* Speed Line */}
          <path d={`M ${points}`} fill="none" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Y Axis Labels */}
          <text x={padding.left - 10} y={padding.top + 5} textAnchor="end" fontSize="10" fill="var(--text-muted)">{Math.round(maxSpeedY)} kn</text>
          <text x={padding.left - 10} y={height - padding.bottom} textAnchor="end" fontSize="10" fill="var(--text-muted)">0</text>

          {/* Wind Strip (Simplified) */}
          <g transform={`translate(0, ${height - 40})`}>
              {windArrows.map((arrow, i) => (
                  <g key={i} transform={`translate(${arrow.x}, 0)`}>
                      <text textAnchor="middle" fontSize="8" fill="var(--text-muted)" y="10">{arrow.speed} m/s</text>
                      <line x1="0" y1="-5" x2="0" y2="-15" stroke="var(--text-muted)" strokeWidth="1" />
                  </g>
              ))}
              <text x={padding.left} y="25" fontSize="10" fill="var(--text-muted)" fontStyle="italic">Vindstyrke langs ruten (m/s)</text>
          </g>

        </svg>
      </div>
    </div>
  );
};

export default RouteGraph;
