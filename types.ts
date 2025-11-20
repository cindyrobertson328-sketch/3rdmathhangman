
export enum GameState {
  Welcome,
  Loading,
  Playing,
  Won,
  Lost,
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface WordData {
  word: string;
  definition: string;
}

export interface GuessedLetters {
  correct: string[];
  incorrect: string[];
}

export interface GameHistoryItem {
  word: string;
  definition: string;
  status: 'won' | 'lost' | 'skipped';
}
