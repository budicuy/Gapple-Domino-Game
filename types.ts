
export interface Tile {
  id: string;
  top: number;
  bottom: number;
}

export interface Player {
  id: number;
  name: string;
  hand: Tile[];
  score: number;
}

export type GameState = 'SETUP' | 'PLAYING' | 'GAME_OVER' | 'BLOCKED';
