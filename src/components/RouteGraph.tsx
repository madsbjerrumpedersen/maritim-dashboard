import React, { useMemo } from 'react';
import './DashboardGraphs.css';
import type { Node } from '../data/maritimeGraph';

interface RouteGraphProps {
  nodes: Node[];
}

const RouteGraph: React.FC<RouteGraphProps> = ({ nodes }) => {
  const { totalDistanceKm, stops, profile, maxSpeed } = useMemo(() => {
    if (!nodes || nodes.length < 2) {
      return { totalDistanceKm: 0, stops: [], profile: [], maxSpeed: 0 };
    }

    // 1. Calculate cumulative distances for each node (in NM initially)
    const nodeDistances: { id: string; distKm: number; isCity: boolean }[] = [];
    let currentDistNm = 0;
    nodeDistances.push({ id: nodes[0].id, distKm: 0, isCity: nodes[0].isCity });

    for (let i = 0; i < nodes.length - 1; i++) {
      const current = nodes[i];
      const next = nodes[i + 1];
      const neighbor = current.neighbors.find(n => n.nodeId === next.id);
      // Fallback distance calculation if neighbor link missing
      const distNm = neighbor ? neighbor.distance : Math.sqrt(Math.pow(current.lat - next.lat, 2) + Math.pow(current.lng - next.lng, 2)) * 60; 
      currentDistNm += distNm;
      nodeDistances.push({ id: next.id, distKm: currentDistNm * 1.852, isCity: next.isCity });
    }

    const totalDistKm = currentDistNm * 1.852;
    const cityStops = nodeDistances.filter(n => n.isCity);

    // 2. Generate Profile Data (Interpolated points)
    const pointsCount = 100;
    const profileData = [];
    let maxS = 0;

    for (let i = 0; i <= pointsCount; i++) {
      const dKm = (i / pointsCount) * totalDistKm;
      
      // Simulate Speed: Base 18 knots, slow down near start/end, random noise
      let speed = 18;
      // Acceleration phase (first 10%)
      if (dKm < totalDistKm * 0.1) speed = 18 * (dKm / (totalDistKm * 0.1));
      // Deceleration phase (last 10%)
      if (dKm > totalDistKm * 0.9) speed = 18 * ((totalDistKm - dKm) / (totalDistKm * 0.1));
      
      speed += (Math.random() * 2 - 1); // Noise
      if (speed < 0) speed = 0;
      
      profileData.push({ distKm: dKm, speed });
      if (speed > maxS) maxS = speed;
    }

    return {
      totalDistanceKm: totalDistKm,
      stops: cityStops,
      profile: profileData,
      maxSpeed: Math.ceil(maxS * 1.1) // Add padding
    };
  }, [nodes]);

  if (!nodes || nodes.length < 2) {
    return (
      <div className="graph-card" style={{ height: '380px' }}>
        <h3>Ruteanalyse</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
          Planlæg en rute for at se hastighedsanalyse
        </div>
      </div>
    );
  }

  // Chart Dimensions
  const width = 800;
  const height = 280; // Slightly increased height
  const padding = { top: 20, right: 40, bottom: 60, left: 40 }; // Increased bottom padding for staggered labels
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Helper to scale values
  const getX = (distKm: number) => padding.left + (distKm / totalDistanceKm) * graphWidth;
  const getY_Speed = (s: number) => (height - padding.bottom) - (s / maxSpeed) * graphHeight;

  // Generate SVG Paths
  const speedPoints = profile.map(p => `${getX(p.distKm)},${getY_Speed(p.speed)}`).join(' ');

  // Colors
  const speedColor = 'var(--accent-color)';
  const routeLineColor = 'var(--secondary-color)';

  // Calculate Label Positions (Staggering Logic)
  const labeledStops = stops.map((stop, index) => {
    const x = getX(stop.distKm);
    let level = 0;
    
    // Simple staggering: if close to previous, bump level
    if (index > 0) {
      const prevX = getX(stops[index - 1].distKm);
      if (x - prevX < 80) { // 80px threshold
        level = 1;
      }
    }
    
    // Check if level 1 is also crowded? (Optional: simplistic 2-level toggle for now)
    // For strictly alternating to avoid overlap, we might need more complex logic, 
    // but a 2-level stagger covers most "Copenhagen -> Rotterdam" style overlaps.
    
    return { ...stop, x, level };
  });

  return (
    <div className="graph-card" style={{ height: 'auto', minHeight: '380px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3>Ruteanalyse</h3>
        <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '12px', height: '3px', background: speedColor }}></div>
            <span>Hastighed (knob)</span>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="line-chart-svg">
          {/* Grid Lines (Horizontal) */}
          <line x1={padding.left} y1={padding.top} x2={width - padding.right} y2={padding.top} stroke="var(--border-color)" strokeDasharray="4" />
          <line x1={padding.left} y1={height / 2} x2={width - padding.right} y2={height / 2} stroke="var(--border-color)" strokeDasharray="4" />
          
          {/* Route Base Line (The "Straight Line") */}
          <line 
            x1={padding.left} 
            y1={height - padding.bottom} 
            x2={width - padding.right} 
            y2={height - padding.bottom} 
            stroke={routeLineColor} 
            strokeWidth="6" 
            strokeLinecap="round" 
            opacity="0.3"
          />

          {/* Stops / Vertical Lines & Dots */}
          {labeledStops.map((stop, i) => {
             const labelY = height - padding.bottom + 20 + (stop.level * 15); // Stagger by 15px
             
             return (
               <g key={stop.id}>
                 <line 
                    x1={stop.x} 
                    y1={padding.top} 
                    x2={stop.x} 
                    y2={height - padding.bottom - 5} 
                    stroke="var(--text-muted)" 
                    strokeOpacity="0.2" 
                    strokeDasharray="2" 
                 />
                 
                 {/* Extend line for staggered labels */}
                 {stop.level > 0 && (
                   <line 
                      x1={stop.x} 
                      y1={height - padding.bottom} 
                      x2={stop.x} 
                      y2={labelY - 10} 
                      stroke="var(--text-muted)" 
                      strokeOpacity="0.2" 
                   />
                 )}

                 <text 
                    x={stop.x} 
                    y={labelY} 
                    textAnchor="middle" 
                    fill="var(--text-dark)" 
                    fontSize="10"
                    fontWeight={i === 0 || i === labeledStops.length - 1 ? 'bold' : 'normal'}
                 >
                   {stop.id}
                 </text>
                 
                 {/* Dock/Stop Marker */}
                 <circle 
                    cx={stop.x} 
                    cy={height - padding.bottom} 
                    r="6" 
                    fill="white" 
                    stroke={routeLineColor}
                    strokeWidth="3"
                 />
               </g>
             );
          })}

          {/* Data Lines */}
          <polyline points={speedPoints} fill="none" stroke={speedColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Axes Labels */}
          {/* Left Y-Axis (Speed) */}
          <text x={padding.left - 5} y={padding.top + 10} textAnchor="end" fontSize="10" fill={speedColor}>{maxSpeed}</text>
          <text x={padding.left - 5} y={height - padding.bottom - 10} textAnchor="end" fontSize="10" fill={speedColor}>0</text>
          
        </svg>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Total Distance: {Math.round(totalDistanceKm).toLocaleString()} km
      </div>
    </div>
  );
};

export default RouteGraph;
