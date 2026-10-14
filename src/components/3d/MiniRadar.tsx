import React from 'react';
import { IslandWorldNode } from '../../types';

interface MiniRadarProps {
  nodes: IslandWorldNode[];
  completedIds: string[];
}

export const MiniRadar: React.FC<MiniRadarProps> = ({ nodes, completedIds }) => {
  const radarRadius = 45; // pixel radius

  return (
    <div className="bg-card/95 backdrop-blur-md rounded-2xl border-2 border-border p-2.5 game-card flex flex-col items-center gap-1.5 font-heading text-[10px]">
      <div className="flex items-center justify-between w-full text-muted font-bold px-1">
        <span className="text-purple">RADAR</span>
        <span className="text-navy">ISLE MAP</span>
      </div>

      {/* Radar Circular Grid */}
      <div className="relative w-24 h-24 rounded-full border-2 border-border bg-card-alt overflow-hidden flex items-center justify-center">
        {/* Radar Rings */}
        <div className="absolute inset-2 rounded-full border border-border pointer-events-none" />
        <div className="absolute inset-5 rounded-full border border-border pointer-events-none" />
        {/* Crosshair lines */}
        <div className="absolute w-full h-[1px] bg-border pointer-events-none" />
        <div className="absolute h-full w-[1px] bg-border pointer-events-none" />

        {/* Center Player Dot */}
        <div className="absolute w-2.5 h-2.5 rounded-full bg-red shadow-xs shadow-red/50 z-10" />

        {/* Nodes Blips on Radar */}
        {nodes.map((node) => {
          // Normalize node coordinates (approx island radius 52)
          const rx = (node.x / 52) * (radarRadius * 0.85);
          const rz = (node.z / 52) * (radarRadius * 0.85);
          const isCleared = completedIds.includes(node.challenge.id);

          let color = '#EF5B5B';
          if (isCleared) color = '#4CB963';
          else if (node.type === 'tree') color = '#4CB963';
          else if (node.type === 'stone') color = '#FFC53D';
          else if (node.type === 'cave') color = '#7B5CFF';

          return (
            <div
              key={node.id}
              style={{
                left: `calc(50% + ${rx}px - 3px)`,
                top: `calc(50% + ${rz}px - 3px)`,
                backgroundColor: color
              }}
              className="absolute w-2 h-2 rounded-full shadow-xs"
              title={`${node.title} (${node.type})`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-[9px] text-muted font-bold">
        <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-green" />Tree</span>
        <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-purple" />Cave</span>
        <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-gold" />Stone</span>
      </div>
    </div>
  );
};
