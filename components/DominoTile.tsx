
import React from 'react';
import { Tile } from '../types';

interface DominoTileProps {
  tile: Tile | null;
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
  isPlayed?: boolean;
  orientation?: 'vertical' | 'horizontal';
  isCurrentHand?: boolean;
}

const Pip: React.FC = () => <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-gray-900 rounded-full"></div>;

const PipGroup: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return <div className="w-full h-full"></div>;

  const pips = Array(count).fill(0);
  let layoutClasses = "grid grid-cols-3 grid-rows-3 gap-0.5 w-full h-full p-1 items-center justify-items-center";

  // Simplified grid layouts for pips
  const pipLayouts: { [key: number]: string[] } = {
    1: ['col-start-2 row-start-2'],
    2: ['col-start-1 row-start-1', 'col-start-3 row-start-3'],
    3: ['col-start-1 row-start-1', 'col-start-2 row-start-2', 'col-start-3 row-start-3'],
    4: ['col-start-1 row-start-1', 'col-start-3 row-start-1', 'col-start-1 row-start-3', 'col-start-3 row-start-3'],
    5: ['col-start-1 row-start-1', 'col-start-3 row-start-1', 'col-start-2 row-start-2', 'col-start-1 row-start-3', 'col-start-3 row-start-3'],
    6: ['col-start-1 row-start-1', 'col-start-3 row-start-1', 'col-start-1 row-start-2', 'col-start-3 row-start-2', 'col-start-1 row-start-3', 'col-start-3 row-start-3'],
  };
  
  return (
    <div className={layoutClasses}>
      {pips.map((_, i) => (
        <div key={i} className={pipLayouts[count][i]}><Pip /></div>
      ))}
    </div>
  );
};


const DominoTile: React.FC<DominoTileProps> = ({ tile, onClick, isSelected, className, isPlayed = false, orientation = 'vertical', isCurrentHand = false }) => {
  if (!tile) {
    return <div className="w-10 h-20 md:w-12 md:h-24 bg-gray-700/50 rounded-md border-2 border-gray-600"></div>;
  }

  const isDouble = tile.top === tile.bottom;
  
  // On the board, doubles are vertical, others are horizontal.
  // In hand, orientation is controlled by the prop.
  let finalOrientation = orientation;
  if (isPlayed) {
    finalOrientation = isDouble ? 'vertical' : 'horizontal';
  }

  const isVertical = finalOrientation === 'vertical';

  const baseClasses = "bg-stone-50 rounded-md border border-gray-400 flex items-center justify-around overflow-hidden shadow-lg transition-all duration-200 ease-in-out";
  
  const sizeClasses = isVertical
    ? "w-10 h-20 md:w-12 md:h-24"
    : "w-20 h-10 md:w-24 md:h-12";
    
  const orientationClasses = isVertical ? "flex-col" : "flex-row";
  
  const interactiveClasses = isSelected
    ? "ring-4 ring-cyan-400 scale-110 shadow-xl shadow-cyan-700/50" // Selected tile is largest
    : isCurrentHand
    ? "scale-105 hover:scale-110 hover:shadow-xl" // Current player's tiles are slightly larger
    : "hover:scale-105 hover:shadow-xl"; // Default hover for other players

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${orientationClasses} ${interactiveClasses} ${className || ''}`}
    >
      <div className={`${isVertical ? 'w-full h-1/2' : 'w-1/2 h-full'} flex items-center justify-center`}>
        <PipGroup count={tile.top} />
      </div>
      <div className={`${isVertical ? 'w-full h-px' : 'h-full w-px'} bg-gray-400`}></div>
      <div className={`${isVertical ? 'w-full h-1/2' : 'w-1/2 h-full'} flex items-center justify-center`}>
        <PipGroup count={tile.bottom} />
      </div>
    </div>
  );
};

export default DominoTile;
