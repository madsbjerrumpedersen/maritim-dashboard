import { useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MARITIME_NODES, type Node, type NodeId } from '../data/maritimeGraph';
import 'leaflet/dist/leaflet.css';

// Fix for default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// --- Icons ---

// 1. Port Icon (Blue - Standard)
const portIcon = new L.Icon.Default();

// 2. Junction Icon (Yellow - User added / Non-Port)
const junctionIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// 4. Selected Node Icon (Green)
const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
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
  onClick,
  icon,
  draggable = true,
  showPopup = true,
  popupContent
}: { 
  id: string; 
  lat: number;
  lng: number;
  onMove: (id: string, lat: number, lng: number) => void;
  onClick?: (id: string) => void;
  icon?: L.Icon;
  draggable?: boolean;
  showPopup?: boolean;
  popupContent?: React.ReactNode;
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
      click() {
        if (onClick) onClick(id);
      }
    }),
    [id, onMove, onClick],
  );

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={[lat, lng]}
      ref={markerRef}
      icon={icon || new L.Icon.Default()}
    >
      {showPopup && (
        <Popup minWidth={90}>
          {popupContent || (
            <>
              <span style={{ fontWeight: 'bold' }}>{id}</span>
              <br />
              {lat.toFixed(4)}, {lng.toFixed(4)}
            </>
          )}
        </Popup>
      )}
    </Marker>
  );
};

type Tool = 'move' | 'add-node' | 'delete-node' | 'add-edge' | 'delete-edge';

const MapEvents = ({ tool, onMapClick }: { tool: Tool, onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      if (tool === 'add-node') {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

export default function NodeEditor() {
  const [nodes, setNodes] = useState<Record<NodeId, Node>>({ ...MARITIME_NODES });
  const [selectedTool, setSelectedTool] = useState<Tool>('move');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Helper to extract unique edges for rendering and interaction
  // Since the graph is undirected, A->B and B->A exist. We only want to render one.
  const uniqueEdges = useMemo(() => {
    const edges: { from: string, to: string, distance: number, fromIdx: number }[] = [];
    const processed = new Set<string>();

    Object.values(nodes).forEach(node => {
      node.neighbors.forEach((neighbor, idx) => {
        const key1 = `${node.id}-${neighbor.nodeId}`;
        const key2 = `${neighbor.nodeId}-${node.id}`;

        if (!processed.has(key1) && !processed.has(key2)) {
          processed.add(key1);
          edges.push({
            from: node.id,
            to: neighbor.nodeId,
            distance: neighbor.distance,
            fromIdx: idx 
          });
        }
      });
    });
    return edges;
  }, [nodes]);

  const handleNodeMove = (id: string, lat: number, lng: number) => {
    setNodes((prev) => ({
      ...prev,
      [id]: { ...prev[id], lat, lng },
    }));
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; 
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return (R * c) / 1852; 
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (selectedTool === 'add-node') {
      const newId = `node_${Date.now()}`;
      setNodes(prev => ({
        ...prev,
        [newId]: { id: newId, lat, lng, isCity: false, neighbors: [] }
      }));
    }
  };

  const handleNodeClick = (id: string) => {
    if (selectedTool === 'add-edge') {
      if (selectedNodeId === null) {
        setSelectedNodeId(id);
      } else if (selectedNodeId === id) {
        setSelectedNodeId(null); 
      } else {
        // Create edge
        const fromNode = nodes[selectedNodeId];
        const toNode = nodes[id];
        
        // Check if already connected
        if (fromNode.neighbors.some(n => n.nodeId === id)) {
            alert("Already connected!");
            setSelectedNodeId(null);
            return;
        }

        const distance = Math.round(calculateDistance(fromNode.lat, fromNode.lng, toNode.lat, toNode.lng));

        setNodes(prev => {
            const next = { ...prev };
            
            // Add forward
            next[selectedNodeId] = {
                ...next[selectedNodeId],
                neighbors: [...next[selectedNodeId].neighbors, { nodeId: id, distance }]
            };

            // Add backward
            next[id] = {
                ...next[id],
                neighbors: [...next[id].neighbors, { nodeId: selectedNodeId, distance }]
            };

            return next;
        });
        
        setSelectedNodeId(null);
      }
    } else if (selectedTool === 'delete-node') {
      if (nodes[id].isCity) {
        alert("Cannot delete City nodes.");
        return;
      }
      
      setNodes(prev => {
        const next = { ...prev };
        
        // Remove connections TO this node from other nodes
        Object.values(next).forEach(n => {
            if (n.neighbors.some(nb => nb.nodeId === id)) {
                next[n.id] = {
                    ...n,
                    neighbors: n.neighbors.filter(nb => nb.nodeId !== id)
                };
            }
        });

        // Remove the node itself
        delete next[id];
        return next;
      });
    }
  };

  const handleEdgeClick = (fromId: string, toId: string) => {
    if (selectedTool === 'delete-edge') {
      setNodes(prev => {
        const next = { ...prev };
        
        // Remove from -> to
        if (next[fromId]) {
            next[fromId] = {
                ...next[fromId],
                neighbors: next[fromId].neighbors.filter(n => n.nodeId !== toId)
            };
        }

        // Remove to -> from
        if (next[toId]) {
            next[toId] = {
                ...next[toId],
                neighbors: next[toId].neighbors.filter(n => n.nodeId !== fromId)
            };
        }

        return next;
      });
    }
  };

    const handleExport = () => {

      let output = `// Define the graph structure types

  export type NodeId = string;

  

  export interface Neighbor {

    nodeId: NodeId;

    distance: number;

  }

  

  export interface Node {

    id: NodeId;

    lat: number;

    lng: number;

    isCity: boolean;

    neighbors: Neighbor[];

  }

  

  export const MARITIME_NODES: Record<NodeId, Node> = {\n`;

      

      const keys = Object.keys(nodes).sort();

      keys.forEach(key => {

        const n = nodes[key];

        output += `  "${key}": {

  `;

        output += `    id: "${n.id}",

  `;

        output += `    lat: ${n.lat},

  `;

        output += `    lng: ${n.lng},

  `;

        output += `    isCity: ${n.isCity},

  `;

        output += `    neighbors: [

  `;

        n.neighbors.forEach(nb => {

            output += `      { nodeId: "${nb.nodeId}", distance: ${nb.distance} },

  `;

        });

        output += `    ]

  `;

        output += `  },

  `;

      });

      output += `};

  `;

  

      const blob = new Blob([output], { type: 'text/plain' });

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;

      a.download = 'maritimeGraph.ts';

      a.click();

      URL.revokeObjectURL(url);

    };

  

    const renderedEdges = useMemo(() => {

      return uniqueEdges.map((edge) => {

        const fromNode = nodes[edge.from];

        const toNode = nodes[edge.to];

        

        if (!fromNode || !toNode) return null;

  

        const positions: [number, number][] = [

          [fromNode.lat, fromNode.lng],

          [toNode.lat, toNode.lng]

        ];

  

        const isDeleteMode = selectedTool === 'delete-edge';

  

        return (

          <Polyline 

            key={`${edge.from}-${edge.to}`}

            positions={positions} 

            color={isDeleteMode ? "#ff4444" : "red"} 

            weight={isDeleteMode ? 4 : 2} 

            opacity={0.5}

            eventHandlers={{

              click: () => handleEdgeClick(edge.from, edge.to)

            }}

            className={isDeleteMode ? 'leaflet-interactive' : ''}

          />

        );

      });

    }, [nodes, uniqueEdges, selectedTool]);

  

    const ToolButton = ({ tool, label }: { tool: Tool, label: string }) => (

      <button 

        onClick={() => { setSelectedTool(tool); setSelectedNodeId(null); }}

        style={{ 

          padding: '0.5rem 1rem', 

          backgroundColor: selectedTool === tool ? '#4fc3f7' : 'transparent', 

          color: 'white', 

          border: '1px solid #4fc3f7', 

          borderRadius: '4px',

          cursor: 'pointer',

          marginRight: '0.5rem',

          fontWeight: selectedTool === tool ? 'bold' : 'normal'

        }}

      >

        {label}

      </button>

    );

  

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

          <div style={{ display: 'flex', alignItems: 'center' }}>

            <h2 style={{ margin: '0 1rem 0 0' }}>Graph Editor</h2>

            <div style={{ display: 'flex' }}>

              <ToolButton tool="move" label="Move" />

              <ToolButton tool="add-node" label="Add Node" />

              <ToolButton tool="delete-node" label="Del Node" />

              <ToolButton tool="add-edge" label="Add Edge" />

              <ToolButton tool="delete-edge" label="Del Edge" />

            </div>

          </div>

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

              Export TS

            </button>

            <a href="#" style={{ color: 'white', marginLeft: '1rem', textDecoration: 'none' }}>Exit</a>

          </div>

        </div>

        

        <div style={{ flex: 1 }}>

          <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>

            <TileLayer

              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"

              attribution='&copy; CARTO'

            />

            

            <MapEvents tool={selectedTool} onMapClick={handleMapClick} />

  

            {Object.entries(nodes).map(([id, node]) => (

              <DraggableMarker 

                key={id} 

                id={id} 

                lat={node.lat} 

                lng={node.lng} 

                onMove={handleNodeMove}

                onClick={handleNodeClick}

                draggable={selectedTool === 'move'}

                showPopup={selectedTool === 'move'}

                icon={

                  (id === selectedNodeId ? selectedIcon :

                  node.isCity ? portIcon : junctionIcon) as L.Icon

                }

              />

            ))}

  

            {renderedEdges}

          </MapContainer>

        </div>

      </div>

    );

  }

  