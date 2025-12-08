import React, { useMemo, useState } from 'react';
import './DashboardGraphs.css';
import type { Node } from '../data/maritimeGraph';
import { type ShipProfile, DEFAULT_SHIP } from '../data/ships';
import { calculateVoyageProfile, type VoyagePoint } from '../utils/routePhysics';
import type { RouteForecast } from '../data/weatherService';

interface RouteGraphProps {
  nodes: Node[];
  shipProfile?: ShipProfile;
  weatherData?: RouteForecast;
  startTime?: number;
}

const OptimizedRouteGraph: React.FC<RouteGraphProps> = ({ nodes, shipProfile = DEFAULT_SHIP, weatherData = {}, startTime = Date.now() }) => {
  const [hoverPoint, setHoverPoint] = useState<VoyagePoint | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);
  const [optimization, setOptimization] = useState<number>(0.5); // 0 (Speed) to 1 (CO2)

  const voyage = useMemo(() => {
    return calculateVoyageProfile(nodes, shipProfile, weatherData, startTime, optimization);
  }, [nodes, shipProfile, weatherData, startTime, optimization]);

  if (!nodes || nodes.length < 2) {
    return (
      <div className="graph-card" style={{ height: '380px' }}>
        <h3>Optimeret Ruteanalyse</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
          Planlæg en rute for at se optimeringspotentiale
        </div>
      </div>
    );
  }

  // Chart Dimensions
  const width = 800;
  const height = 300;
  const padding = { top: 60, right: 40, bottom: 80, left: 50 }; // Increased top padding
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxSpeedY = Math.max(shipProfile.maxSpeed + 2, ...voyage.segments.map(s => s.speedKnots));
  const totalDist = voyage.totalDistanceKm;

  // Scales
  const getX = (dist: number) => padding.left + (dist / totalDist) * graphWidth;
  const getY = (speed: number) => (height - padding.bottom) - (speed / maxSpeedY) * graphHeight;

  // Generate Smooth Path (Cubic Bezier Spline)
  const getSplinePath = (points: number[][]) => {
      if (points.length === 0) return "";
      if (points.length === 1) return `M ${points[0][0]},${points[0][1]}`;

      // Helper to get control point
      const controlPoint = (current: number[], previous: number[], next: number[], reverse: boolean) => {
          const p = previous || current;
          const n = next || current;
          const smoothing = 0.15; // 0 to 1, higher is smoother/loopier
          
          // Properties of the opposed-line
          const oX = n[0] - p[0]; 
          const oY = n[1] - p[1];
          const length = Math.sqrt(Math.pow(oX, 2) + Math.pow(oY, 2));
          const angle = Math.atan2(oY, oX) + (reverse ? Math.PI : 0);
          
          const lengthC = length * smoothing;
          const x = current[0] + Math.cos(angle) * lengthC;
          const y = current[1] + Math.sin(angle) * lengthC;
          
          return [x, y];
      };

      let d = `M ${points[0][0]},${points[0][1]}`;
      
      for (let i = 0; i < points.length - 1; i++) {
          const p0 = points[i - 1]; // Previous (can be undefined)
          const p1 = points[i];     // Current
          const p2 = points[i + 1]; // Next
          const p3 = points[i + 2]; // Next Next (can be undefined)
          
          const cp1 = controlPoint(p1, p0, p2, false);
          const cp2 = controlPoint(p2, p1, p3, true);
          
          d += ` C ${cp1[0]},${cp1[1]} ${cp2[0]},${cp2[1]} ${p2[0]},${p2[1]}`;
      }
      return d;
  };

  const coordinatePoints = voyage.segments.map(s => [getX(s.distanceKm), getY(s.speedKnots)]);
  const pathData = getSplinePath(coordinatePoints);

  // Sampled Data for Wind Arrows & Interaction Overlay
  // We use the raw segments for interaction to be precise
  
  // Format Duration
  const days = Math.floor(voyage.totalTimeHours / 24);
  const hours = Math.round(voyage.totalTimeHours % 24);

  const stops = voyage.segments.filter(s => s.isStop);

  // Time Markers (Timeline at top)
  // Helper to format date
  const formatDate = (ms: number) => new Date(ms).toLocaleDateString('da-DK', { day: 'numeric', month: 'short' }).replace('.', '');

  // Helper to interpolate distance at a specific time
  const getDistanceAtTime = (targetHours: number, segments: VoyagePoint[]): number => {
      if (segments.length === 0) return 0;
      if (targetHours <= 0) return 0;
      if (targetHours >= segments[segments.length - 1].timeHours) return segments[segments.length - 1].distanceKm;

      const index = segments.findIndex(s => s.timeHours >= targetHours);
      if (index === -1) return segments[segments.length - 1].distanceKm;
      if (index === 0) return segments[0].distanceKm;

      const p1 = segments[index - 1];
      const p2 = segments[index];
      
      const fraction = (targetHours - p1.timeHours) / (p2.timeHours - p1.timeHours);
      return p1.distanceKm + fraction * (p2.distanceKm - p1.distanceKm);
  };

  const allMarkers: { distance: number; label: string }[] = [];
  const startMs = startTime;
  const totalHours = voyage.totalTimeHours;
  const totalDays = totalHours / 24;
  
  let stepDays = 1;
  while (totalDays / stepDays > 10) {
      stepDays++;
  }

  // Find first midnight
  const startDate = new Date(startMs);
  const firstMidnight = new Date(startDate);
  firstMidnight.setHours(24, 0, 0, 0); 

  let currentMarkerDate = firstMidnight;
  
  while (currentMarkerDate.getTime() < startMs + totalHours * 3600 * 1000) {
      const diffMs = currentMarkerDate.getTime() - startMs;
      const diffHours = diffMs / (1000 * 3600);
      
      const dist = getDistanceAtTime(diffHours, voyage.segments);
      
      allMarkers.push({
          distance: dist,
          label: formatDate(currentMarkerDate.getTime())
      });

      // Advance by stepDays
      currentMarkerDate = new Date(currentMarkerDate.getTime() + stepDays * 24 * 3600 * 1000);
  }

  const timeMarkers = allMarkers.map(m => ({
      x: getX(m.distance),
      label: m.label
  }));

  // Calculate Stop Layout (Collision Avoidance)
  const stopsWithLayout = stops.map(stop => ({
      ...stop,
      x: getX(stop.distanceKm),
      yOffset: 0
  }));

  // Simple collision detection for labels
  for (let i = 1; i < stopsWithLayout.length; i++) {
      const prev = stopsWithLayout[i-1];
      const curr = stopsWithLayout[i];
      
      if (curr.x - prev.x < 40) {
          if (prev.yOffset === 0) {
              curr.yOffset = 15;
          } else {
              curr.yOffset = 0;
          }
      }
  }

  return (
    <div className="graph-card" style={{ height: 'auto', minHeight: '420px', position: 'relative' }}>
      {/* Header Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
           <h3 style={{ marginBottom: '0.2rem' }}>Optimeret Ruteanalyse: {shipProfile.name}</h3>
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
      <div style={{ position: 'relative', width: '100%' }}>
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="line-chart-svg">
          
          {/* Wind Zones (Colored Backgrounds) */}
          {voyage.segments.map((seg, i) => {
             if (i === 0) return null;
             const prev = voyage.segments[i-1];
             const x1 = getX(prev.distanceKm);
             const x2 = getX(seg.distanceKm);
             const w = Math.max(1, x2 - x1);
             
             // Determine color based on windFactor
             // 1 = Headwind, -1 = Tailwind
             let fillColor = 'rgba(255, 212, 59, 0.1)'; // Sidewind (Yellow)
             if (seg.windFactor > 0.3) fillColor = 'rgba(255, 107, 107, 0.15)'; // Headwind (Red)
             else if (seg.windFactor < -0.3) fillColor = 'rgba(81, 207, 102, 0.15)'; // Tailwind (Green)

             return (
                <rect 
                    key={`zone-${i}`}
                    x={x1} 
                    y={padding.top} 
                    width={w} 
                    height={height - padding.bottom - padding.top} 
                    fill={fillColor} 
                />
             );
          })}

          {/* Grid */}
          <line x1={padding.left} y1={padding.top} x2={width - padding.right} y2={padding.top} stroke="var(--border-color)" strokeDasharray="4" />
          <line x1={padding.left} y1={height/2} x2={width - padding.right} y2={height/2} stroke="var(--border-color)" strokeDasharray="4" />
          <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="var(--border-color)" />

          {/* Time Axis (Top) */}
          <g>
             {/* Base line for time axis */}
             <line 
                x1={padding.left} 
                y1={padding.top - 15} 
                x2={width - padding.right} 
                y2={padding.top - 15} 
                stroke="var(--border-color)" 
                strokeWidth="1"
             />
             <text x={padding.left} y={padding.top - 25} fontSize="9" fill="var(--text-muted)" fontWeight="bold">Tidslinje</text>
             
             {/* Day Markers */}
             {timeMarkers.map((tm, i) => (
                 <g key={`tm-${i}`}>
                     <line x1={tm.x} y1={padding.top - 15} x2={tm.x} y2={padding.top - 10} stroke="var(--border-color)" />
                     <text x={tm.x} y={padding.top - 5} fontSize="9" fill="var(--text-muted)" textAnchor="middle">{tm.label}</text>
                 </g>
             ))}
          </g>

          {/* Stops Markers */}
          {stopsWithLayout.map((stop, i) => {
             const { x, yOffset } = stop;
             return (
               <g key={i}>
                 <line 
                    x1={x} 
                    y1={padding.top} 
                    x2={x} 
                    y2={height - padding.bottom + yOffset} // Extend line if label is lower
                    stroke="var(--text-muted)" 
                    strokeOpacity="0.2" 
                    strokeDasharray="2" 
                 />
                 <text 
                    x={x} 
                    y={height - padding.bottom + 20 + yOffset} 
                    textAnchor="middle" 
                    fill="var(--text-dark)" 
                    fontSize="10" 
                    fontWeight={i === 0 || i === stops.length - 1 ? 'bold' : 'normal'}
                 >
                   {stop.stopName}
                 </text>
                 <circle cx={x} cy={height - padding.bottom} r="4" fill="var(--text-dark)" />
               </g>
             );
          })}

          {/* Speed Line */}
          <path d={pathData} fill="none" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Interaction Overlay (Invisible Rects) */}
          {voyage.segments.map((seg, i) => {
             if (i === 0) return null;
             const prev = voyage.segments[i-1];
             const x1 = getX(prev.distanceKm);
             const x2 = getX(seg.distanceKm);
             const w = Math.max(1, x2 - x1);
             
             return (
               <rect
                 key={`interact-${i}`}
                 x={x1}
                 y={padding.top}
                 width={w}
                 height={height - padding.bottom - padding.top}
                 fill="transparent"
                 onMouseEnter={() => {
                     setHoverPoint(seg);
                     setHoverX(x2);
                 }}
                 onMouseLeave={() => setHoverPoint(null)}
               />
             );
          })}

          {/* Hover Indicator Line */}
          {hoverPoint && (
             <line 
                x1={hoverX} 
                y1={padding.top} 
                x2={hoverX} 
                y2={height - padding.bottom} 
                stroke="var(--accent-color)" 
                strokeWidth="1" 
                strokeDasharray="4"
             />
          )}

          {/* Y Axis Labels */}
          <text x={padding.left - 10} y={padding.top + 5} textAnchor="end" fontSize="10" fill="var(--text-muted)">{Math.round(maxSpeedY)} kn</text>
          <text x={padding.left - 10} y={height - padding.bottom} textAnchor="end" fontSize="10" fill="var(--text-muted)">0</text>

          {/* Wind Strip with Rotated Arrows */}
          <g transform={`translate(0, ${height - 25})`}>
              {voyage.segments.map((seg, i) => {
                 // Only draw every Nth arrow to avoid clutter
                 if (i % Math.ceil(voyage.segments.length / 15) !== 0) return null;
                 
                 const x = getX(seg.distanceKm);
                 // Relative 0 = Tailwind. Relative 180 = Headwind.
                 const relative = (seg.windDir - seg.segmentBearing + 360) % 360;
                 const rotation = relative + 90;
                 
                 return (
                  <g key={`wind-${i}`} transform={`translate(${x}, 0)`}>
                      <text textAnchor="middle" fontSize="8" fill="var(--text-muted)" y="15">{seg.windSpeed}</text>
                      {/* Arrow */}
                      <g transform={`translate(0, -10) rotate(${rotation})`}>
                         <path d="M0 -5 L3 3 L0 1 L-3 3 Z" fill="var(--text-muted)" />
                      </g>
                  </g>
                 );
              })}
          </g>

        </svg>
        
        {/* Tooltip (HTML Overlay) */}
        {hoverPoint && (
            <div style={{
                position: 'absolute',
                left: hoverX,
                top: 40,
                transform: hoverX > width * 0.6 ? 'translate(-100%, -110%)' : 'translate(0%, -110%)',
                marginLeft: hoverX > width * 0.6 ? '-10px' : '10px',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '8px',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                border: '1px solid var(--border-color)',
                fontSize: '0.75rem',
                pointerEvents: 'none',
                zIndex: 10,
                minWidth: '140px'
            }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {Math.round(hoverPoint.distanceKm)} km
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Fart:</span>
                    <span style={{ fontWeight: 600, color: hoverPoint.speedKnots < shipProfile.cruiseSpeed ? '#ff6b6b' : 'var(--text-dark)' }}>
                        {hoverPoint.speedKnots} kn
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Vind:</span>
                    <span>{hoverPoint.windSpeed} m/s</span>
                </div>
            </div>
        )}
      </div>

      {/* Optimization Control Slider */}
      <div style={{ padding: '0 2rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600 }}>
              <span style={{ color: '#228be6' }}>Prioritér Fart</span>
              <span style={{ color: '#82c91e' }}>Prioritér CO2 (Brændstof)</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={optimization} 
            onChange={(e) => setOptimization(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }} 
          />
          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Optimering: {Math.round(optimization * 100)}%
          </div>
      </div>
    </div>
  );
};

export default OptimizedRouteGraph;
