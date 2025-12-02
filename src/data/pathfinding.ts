import { MARITIME_NODES, MARITIME_EDGES, type NodeId } from './maritimeGraph';

interface GraphNode {
  id: NodeId;
  neighbors: { nodeId: NodeId; weight: number; waypoints?: [number, number][] }[];
}

// Build the adjacency list for the graph
const graph: Record<NodeId, GraphNode> = {};

// Initialize nodes
Object.keys(MARITIME_NODES).forEach((id) => {
  graph[id] = { id, neighbors: [] };
});

// Populate edges (undirected)
MARITIME_EDGES.forEach((edge) => {
  // Forward
  if (graph[edge.from] && graph[edge.to]) {
    graph[edge.from].neighbors.push({
      nodeId: edge.to,
      weight: edge.distance,
      waypoints: edge.waypoints,
    });
  }
  // Backward (reverse waypoints)
  if (graph[edge.to] && graph[edge.from]) {
    const reversedWaypoints = edge.waypoints ? [...edge.waypoints].reverse() : undefined;
    graph[edge.to].neighbors.push({
      nodeId: edge.from,
      weight: edge.distance,
      waypoints: reversedWaypoints,
    });
  }
});

interface QueueItem {
  nodeId: NodeId;
  cost: number;
}

export const findShortestPath = (startNodeId: NodeId, endNodeId: NodeId): [number, number][] | null => {
  if (!graph[startNodeId] || !graph[endNodeId]) return null;

  const costs: Record<NodeId, number> = {};
  const backtrace: Record<NodeId, { from: NodeId; waypoints?: [number, number][] }> = {};
  const queue: QueueItem[] = [];

  // Initialize
  costs[startNodeId] = 0;
  queue.push({ nodeId: startNodeId, cost: 0 });

  while (queue.length > 0) {
    // Sort queue to process lowest cost first (Simple Priority Queue)
    queue.sort((a, b) => a.cost - b.cost);
    const current = queue.shift()!;

    if (current.nodeId === endNodeId) {
      // Found target, reconstruct path
      const path: [number, number][] = [];
      let curr = endNodeId;
      
      // Start adding points from the end back to start
      path.push([MARITIME_NODES[curr].lat, MARITIME_NODES[curr].lng]);

      while (curr !== startNodeId) {
        const prev = backtrace[curr];
        if (!prev) break; // Should not happen if path exists

        // If there were waypoints on the edge, add them (in reverse order of traversal, which means correct order for reconstruction since we are going backwards? No, we prepend.)
        // Wait, we are building backwards: End -> Prev.
        // The edge was Prev -> End.
        // So `prev.waypoints` are from Prev to End.
        // Since we are walking End -> Prev, we need to add them in reverse (End <- ... <- Prev).
        
        if (prev.waypoints) {
          const reversed = [...prev.waypoints].reverse();
          reversed.forEach(pt => path.unshift(pt));
        }
        
        const prevNode = MARITIME_NODES[prev.from];
        path.unshift([prevNode.lat, prevNode.lng]);
        
        curr = prev.from;
      }
      return path;
    }

    const neighbors = graph[current.nodeId].neighbors;
    for (const neighbor of neighbors) {
      const newCost = costs[current.nodeId] + neighbor.weight;
      if (costs[neighbor.nodeId] === undefined || newCost < costs[neighbor.nodeId]) {
        costs[neighbor.nodeId] = newCost;
        backtrace[neighbor.nodeId] = { from: current.nodeId, waypoints: neighbor.waypoints };
        queue.push({ nodeId: neighbor.nodeId, cost: newCost });
      }
    }
  }

  return null;
};
