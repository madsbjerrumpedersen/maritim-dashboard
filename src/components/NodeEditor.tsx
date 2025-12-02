import { useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MARITIME_NODES, MARITIME_EDGES, type Node, type NodeId, type Edge } from '../data/maritimeGraph';
import 'leaflet/dist/leaflet.css';

// Fix for default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icon for Waypoints (Yellow)
const waypointIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DraggableMarker = ({ 
  id, 
  lat,
  lng, 
  onMove,
  icon
}: { 
  id: string; 
  lat: number;
  lng: number;
  onMove: (id: string, lat: number, lng: number) => void;
  icon?: L.Icon;
}) => {
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          onMove(id, lat, lng);
        }
      },
    }),
    [id, onMove],
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={[lat, lng]}
      ref={markerRef}
      icon={icon || new L.Icon.Default()}
    >
      <Popup minWidth={90}>
        <span style={{ fontWeight: 'bold' }}>{id}</span>
        <br />
        {lat.toFixed(4)}, {lng.toFixed(4)}
      </Popup>
    </Marker>
  );
};

export default function NodeEditor() {
  const [nodes, setNodes] = useState<Record<NodeId, Node>>({ ...MARITIME_NODES });
  const [edges, setEdges] = useState<Edge[]>([...MARITIME_EDGES]);

  const handleNodeMove = (id: string, lat: number, lng: number) => {
    setNodes((prev) => ({
      ...prev,
      [id]: { ...prev[id], lat, lng },
    }));
  };

  const handleWaypointMove = (id: string, lat: number, lng: number) => {
    const [edgeIndexStr, wpIndexStr] = id.split('_wp_');
    const edgeIndex = parseInt(edgeIndexStr.replace('edge_', ''));
    const wpIndex = parseInt(wpIndexStr);

    setEdges((prev) => {
      const newEdges = [...prev];
      const edge = { ...newEdges[edgeIndex] };
      if (edge.waypoints) {
        const newWaypoints = [...edge.waypoints];
        newWaypoints[wpIndex] = [lat, lng];
        edge.waypoints = newWaypoints;
        newEdges[edgeIndex] = edge;
      }
      return newEdges;
    });
  };

  const handleExport = () => {
    let output = `// Define the graph structure types
export type NodeId = string;

export interface Node {
  id: NodeId;
  lat: number;
  lng: number;
}

export interface Edge {
  from: NodeId;
  to: NodeId;
  distance: number; // Approximate nautical distance or cost
  waypoints?: [number, number][]; // Detailed path for this edge (curved lines)
}

export const MARITIME_NODES: Record<NodeId, Node> = {\n`;
    
    const keys = Object.keys(nodes).sort();
    keys.forEach(key => {
      const n = nodes[key];
      output += `  "${key}": { id: "${key}", lat: ${n.lat.toFixed(4)}, lng: ${n.lng.toFixed(4)} },\n`;
    });
    output += `};\n\n`;

    output += `export const MARITIME_EDGES: Edge[] = [\n`;
    edges.forEach(edge => {
      const waypointsStr = edge.waypoints 
        ? `, waypoints: [${edge.waypoints.map(wp => `[${wp[0].toFixed(4)}, ${wp[1].toFixed(4)}]`).join(', ')}]` 
        : '';
      output += `  { from: "${edge.from}", to: "${edge.to}", distance: ${edge.distance}${waypointsStr} },\n`;
    });
    output += `];`;

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'maritimeGraph.ts';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderedEdges = useMemo(() => {
    return edges.map((edge, index) => {
      const fromNode = nodes[edge.from];
      const toNode = nodes[edge.to];
      
      if (!fromNode || !toNode) return null;

      const positions: [number, number][] = [
        [fromNode.lat, fromNode.lng],
        ...(edge.waypoints || []),
        [toNode.lat, toNode.lng]
      ];

      return <Polyline key={index} positions={positions} color="red" weight={2} opacity={0.5} />;
    });
  }, [nodes, edges]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <div style={{ 
        padding: '1rem', 
        background: '#0a2540', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h2 style={{ margin: 0 }}>Maritime Graph Editor</h2>
        <div>
          <button 
            onClick={handleExport}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#00b8d4', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Export Full Graph
          </button>
          <a href="#" style={{ color: 'white', marginLeft: '1rem', textDecoration: 'none' }}>Back to Dashboard</a>
        </div>
      </div>
      
      <div style={{ flex: 1 }}>
        <MapContainer center={[56, 11]} zoom={6} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
          />
          
          {Object.entries(nodes).map(([id, node]) => (
            <DraggableMarker 
              key={id} 
              id={id} 
              lat={node.lat} 
              lng={node.lng} 
              onMove={handleNodeMove} 
            />
          ))}

          {edges.map((edge, edgeIndex) => (
            edge.waypoints?.map((wp, wpIndex) => (
              <DraggableMarker
                key={`edge_${edgeIndex}_wp_${wpIndex}`}
                id={`edge_${edgeIndex}_wp_${wpIndex}`}
                lat={wp[0]}
                lng={wp[1]}
                onMove={handleWaypointMove}
                icon={waypointIcon}
              />
            ))
          ))}

          {renderedEdges}
        </MapContainer>
      </div>
    </div>
  );
}
