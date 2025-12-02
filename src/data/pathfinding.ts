import { MARITIME_NODES, type NodeId } from './maritimeGraph';

interface QueueItem {
  nodeId: NodeId;
  cost: number;
}

export const findShortestPath = (startNodeId: NodeId, endNodeId: NodeId): [number, number][] | null => {
  if (!MARITIME_NODES[startNodeId] || !MARITIME_NODES[endNodeId]) return null;

  const costs: Record<NodeId, number> = {};
  const backtrace: Record<NodeId, NodeId> = {};
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
        const prevId = backtrace[curr];
        if (!prevId) break; 
        
        const prevNode = MARITIME_NODES[prevId];
        path.unshift([prevNode.lat, prevNode.lng]);
        
        curr = prevId;
      }
      return path;
    }

    const neighbors = MARITIME_NODES[current.nodeId].neighbors;
    for (const neighbor of neighbors) {
      const newCost = costs[current.nodeId] + neighbor.distance;
      if (costs[neighbor.nodeId] === undefined || newCost < costs[neighbor.nodeId]) {
        costs[neighbor.nodeId] = newCost;
        backtrace[neighbor.nodeId] = current.nodeId;
        queue.push({ nodeId: neighbor.nodeId, cost: newCost });
      }
    }
  }

  return null;
};
