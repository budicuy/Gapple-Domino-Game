
import { Tile } from '../types';

export const createDominoSet = (): Tile[] => {
  const tiles: Tile[] = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      tiles.push({ id: `${i}-${j}`, top: i, bottom: j });
    }
  }
  return tiles;
};

export const shuffleDeck = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  const newArray = [...array];

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]
    ];
  }

  return newArray;
};
