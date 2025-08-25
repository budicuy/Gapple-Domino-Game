
import React, { useState, useCallback, useEffect } from 'react';
import { Player, Tile, GameState } from './types';
import { createDominoSet, shuffleDeck } from './utils/gameLogic';
import PlayerHand from './components/PlayerHand';
import GameBoard from './components/GameBoard';
import GameStatus from './components/GameStatus';
import Controls from './components/Controls';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('SETUP');
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameChain, setGameChain] = useState<Tile[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Selamat datang di Gaple!');
  const [passCounter, setPassCounter] = useState(0);
  const [finalScores, setFinalScores] = useState<Player[]>([]);

  const setupGame = useCallback(() => {
    const deck = shuffleDeck(createDominoSet());
    const numPlayers = 4;
    const newPlayers: Player[] = Array.from({ length: numPlayers }, (_, i) => ({
      id: i,
      name: i === 0 ? `Pemain 1 (Anda)` : `Pemain ${i + 1}`,
      hand: deck.slice(i * 7, (i + 1) * 7),
      score: 0,
    }));

    setPlayers(newPlayers);
    setGameChain([]);
    setCurrentPlayerIndex(0);
    setSelectedTile(null);
    setWinner(null);
    setGameState('PLAYING');
    setStatusMessage(`Giliran ${newPlayers[0].name}`);
    setPassCounter(0);
    setFinalScores([]);
  }, []);

  const advanceTurn = useCallback((nextPlayerIndex: number) => {
    setCurrentPlayerIndex(nextPlayerIndex);
    setSelectedTile(null);
    setStatusMessage(`Giliran ${players[nextPlayerIndex]?.name}`);
  }, [players]);

  const canPlayerMove = useCallback((player: Player, chain: Tile[]): boolean => {
    if (chain.length === 0) return true;
    const startValue = chain[0].top;
    const endValue = chain[chain.length - 1].bottom;
    return player.hand.some(tile => tile.top === startValue || tile.bottom === startValue || tile.top === endValue || tile.bottom === endValue);
  }, []);

  const handlePass = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    const currentPlayer = players[currentPlayerIndex];
    if (canPlayerMove(currentPlayer, gameChain)) {
      setStatusMessage('Anda memiliki kartu yang bisa dimainkan!');
      return;
    }
    
    const newPassCounter = passCounter + 1;
    setPassCounter(newPassCounter);

    if (newPassCounter >= players.length) {
      // Game is blocked
      const scores = players.map(p => ({
        ...p,
        score: p.hand.reduce((acc, tile) => acc + tile.top + tile.bottom, 0),
      }));
      setFinalScores(scores);
      const gameWinner = scores.reduce((minPlayer, currentPlayer) => 
          currentPlayer.score < minPlayer.score ? currentPlayer : minPlayer
      );
      setWinner(gameWinner);
      setGameState('BLOCKED');
      setStatusMessage(`Permainan buntu! Pemenangnya adalah ${gameWinner.name}.`);
    } else {
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      advanceTurn(nextPlayerIndex);
    }
  }, [gameState, players, currentPlayerIndex, gameChain, passCounter, canPlayerMove, advanceTurn]);


  const handlePlayTile = useCallback((end: 'start' | 'end') => {
    if (!selectedTile || gameState !== 'PLAYING') return;

    const currentPlayer = players[currentPlayerIndex];
    let newChain = [...gameChain];
    let tileToPlay = { ...selectedTile };

    if (newChain.length === 0) {
      newChain.push(tileToPlay);
    } else {
      const startValue = newChain[0].top;
      const endValue = newChain[newChain.length - 1].bottom;
      let isValidMove = false;

      if (end === 'start') {
        if (tileToPlay.bottom === startValue) {
          [tileToPlay.top, tileToPlay.bottom] = [tileToPlay.bottom, tileToPlay.top]; // flip
          newChain.unshift(tileToPlay);
          isValidMove = true;
        } else if (tileToPlay.top === startValue) {
          newChain.unshift(tileToPlay);
          isValidMove = true;
        }
      } else { // end === 'end'
        if (tileToPlay.top === endValue) {
          newChain.push(tileToPlay);
          isValidMove = true;
        } else if (tileToPlay.bottom === endValue) {
          [tileToPlay.top, tileToPlay.bottom] = [tileToPlay.bottom, tileToPlay.top]; // flip
          newChain.push(tileToPlay);
          isValidMove = true;
        }
      }

      if (!isValidMove) {
        setStatusMessage("Gerakan tidak valid!");
        setSelectedTile(null);
        return;
      }
    }

    const newHand = currentPlayer.hand.filter(t => t.id !== selectedTile.id);
    const updatedPlayers = players.map(p => p.id === currentPlayer.id ? { ...p, hand: newHand } : p);
    
    setGameChain(newChain);
    setPlayers(updatedPlayers);
    setPassCounter(0); // Reset pass counter on a successful move

    if (newHand.length === 0) {
      setWinner(currentPlayer);
      setGameState('GAME_OVER');
      setStatusMessage(`${currentPlayer.name} menang!`);
    } else {
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      advanceTurn(nextPlayerIndex);
    }
  }, [selectedTile, gameState, players, currentPlayerIndex, gameChain, advanceTurn]);

  const playerPositions = ['bottom', 'left', 'top', 'right'];

  return (
    <div className="relative w-screen h-screen bg-gray-900 text-white overflow-hidden font-sans">
      <div className="absolute inset-0 game-board-bg"></div>
      
      <GameStatus message={statusMessage} />
      
      <main className="relative w-full h-full">
        {gameState === 'PLAYING' && (
          <>
            <GameBoard chain={gameChain} onPlay={handlePlayTile} canPlay={!!selectedTile} />
            {players.map((p, i) => (
              <PlayerHand
                key={p.id}
                player={p}
                isCurrentPlayer={i === currentPlayerIndex}
                onTileSelect={setSelectedTile}
                selectedTile={selectedTile}
                position={playerPositions[i] as 'bottom' | 'top' | 'left' | 'right'}
              />
            ))}
          </>
        )}
      </main>

      <Controls 
        gameState={gameState} 
        winner={winner}
        finalScores={finalScores}
        onNewGame={setupGame}
        onPass={handlePass}
        canPass={gameState === 'PLAYING' && !canPlayerMove(players[currentPlayerIndex], gameChain)}
      />
    </div>
  );
};

export default App;
