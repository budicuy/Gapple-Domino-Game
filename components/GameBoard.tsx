
import React from 'react';
import { Tile } from '../types';
import DominoTile from './DominoTile';

interface GameBoardProps {
  chain: Tile[];
  onPlay: (end: 'start' | 'end') => void;
  canPlay: boolean;
}

const DropZone: React.FC<{ onClick: () => void; canPlay: boolean; children?: React.ReactNode }> = ({ onClick, canPlay, children }) => {
  const classes = `w-14 h-28 md:w-16 md:h-32 flex items-center justify-center border-2 border-dashed rounded-lg transition-all duration-200 ${canPlay ? 'border-green-400 bg-green-500/10 hover:bg-green-500/20 cursor-pointer' : 'border-gray-600/50 bg-gray-800/10'}`;
  return <div onClick={canPlay ? onClick : undefined} className={classes}>{children}</div>;
};

const GameBoard: React.FC<GameBoardProps> = ({ chain, onPlay, canPlay }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="w-full h-full flex items-center justify-center flex-wrap gap-1">
        {chain.length > 0 && (
          <DropZone onClick={() => onPlay('start')} canPlay={canPlay}>
            <span className="text-green-300 text-4xl font-light">+</span>
          </DropZone>
        )}
        
        {chain.map((tile) => (
          <DominoTile key={tile.id} tile={tile} isPlayed={true} />
        ))}

        <DropZone onClick={() => onPlay(chain.length === 0 ? 'start' : 'end')} canPlay={canPlay}>
          <span className="text-green-300 text-xl font-semibold text-center leading-tight">{chain.length === 0 ? "Mulai Di Sini" : "+"}</span>
        </DropZone>
      </div>
    </div>
  );
};

export default GameBoard;
