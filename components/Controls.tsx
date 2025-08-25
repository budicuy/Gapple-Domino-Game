
import React from 'react';
import { Player, GameState } from '../types';

interface ControlsProps {
  gameState: GameState;
  winner: Player | null;
  finalScores: Player[];
  onNewGame: () => void;
  onPass: () => void;
  canPass: boolean;
}

const Controls: React.FC<ControlsProps> = ({ gameState, winner, finalScores, onNewGame, onPass, canPass }) => {
  if (gameState !== 'PLAYING' && gameState !== 'SETUP') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="modal-content bg-gray-900 text-white p-8 rounded-xl shadow-2xl text-center max-w-md w-full border border-gray-700">
          <h2 className="text-4xl font-bold text-cyan-400 mb-4">
            {gameState === 'GAME_OVER' ? `${winner?.name} Menang!` : "Permainan Buntu!"}
          </h2>
          {gameState === 'BLOCKED' && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2 text-gray-300">Skor Akhir:</h3>
              <ul className="space-y-2">
                {finalScores.sort((a, b) => a.score - b.score).map(p => (
                  <li key={p.id} className="flex justify-between items-center bg-gray-800 p-3 rounded-md">
                    <span className="font-medium text-gray-200">{p.name}</span>
                    <span className="font-bold text-cyan-300">{p.score} poin</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-lg text-gray-300">Pemenang: <span className="font-bold text-green-400">{winner?.name}</span></p>
            </div>
          )}
          <button
            onClick={onNewGame}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-all duration-200 transform hover:scale-105"
          >
            Mulai Game Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-4">
      {gameState === 'SETUP' && (
        <button
          onClick={onNewGame}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Mulai Permainan
        </button>
      )}
       {gameState === 'PLAYING' && (
        <button
          onClick={onPass}
          disabled={!canPass}
          className="bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50"
        >
          Lewat (Pass)
        </button>
      )}
    </div>
  );
};

export default Controls;
