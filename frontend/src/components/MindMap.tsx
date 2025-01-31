import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { MindMapNode } from '../types';

interface MindMapProps {
  data: MindMapNode[];
}

export function MindMap({ data }: MindMapProps) {
  return (
    <div className="card-hover bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Mind Map</h2>
      <div className="h-[500px] bg-gray-50 rounded-lg overflow-hidden">
        <ForceGraph2D
          graphData={{ nodes: data, links: data.flatMap(node => node.links || []) }}
          nodeLabel="name"
          nodeColor={() => '#4f46e5'}
          linkColor={() => '#94a3b8'}
          backgroundColor="#f8fafc"
          nodeRelSize={6}
          linkWidth={2}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
        />
      </div>
    </div>
  );
}