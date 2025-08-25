
import React from 'react';
import { Player, Tile } from '../types';
import DominoTile from './DominoTile';

interface PlayerHandProps {
  player: Player;
  isCurrentPlayer: boolean;
  onTileSelect: (tile: Tile) => void;
  selectedTile: Tile | null;
  position: 'bottom' | 'top' | 'left' | 'right';
}

const PlayerHand: React.FC<PlayerHandProps> = ({ player, isCurrentPlayer, onTileSelect, selectedTile, position }) => {
  const positionClasses = {
    bottom: "flex-row justify-center items-end",
    top: "flex-row-reverse justify-center items-start",
    left: "flex-col-reverse justify-center items-start",
    right: "flex-col justify-center items-end",
  };
  
  const handWrapperClasses = `flex gap-1 md:gap-2 p-2 rounded-lg transition-all duration-300 items-center ${isCurrentPlayer ? 'bg-black/30' : ''} ${positionClasses[position]}`;
  const nameClasses = `font-semibold text-sm md:text-lg mb-2 text-center transition-colors duration-300 ${isCurrentPlayer ? 'text-cyan-300' : 'text-gray-300'}`;
  
  const getHandPositionClasses = () => {
    switch(position) {
      case 'bottom': return 'absolute bottom-0 left-1/2 -translate-x-1/2 w-full md:w-3/4 lg:w-1/2';
      case 'top': return 'absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-3/4 lg:w-1/2';
      case 'left': return 'absolute left-4 top-1/2 -translate-y-1/2';
      case 'right': return 'absolute right-4 top-1/2 -translate-y-1/2';
    }
  }

  return (
    <div className={getHandPositionClasses()}>
        <h2 className={nameClasses}>{player.name}</h2>
      <div className={handWrapperClasses}>
        {player.hand.map(tile => (
          <DominoTile
            key={tile.id}
            tile={tile}
            onClick={() => isCurrentPlayer && onTileSelect(tile)}
            isSelected={isCurrentPlayer && selectedTile?.id === tile.id}
            isCurrentHand={isCurrentPlayer}
            className={isCurrentPlayer ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}
            orientation={position === 'left' || position === 'right' ? 'horizontal' : 'vertical'}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerHand;
