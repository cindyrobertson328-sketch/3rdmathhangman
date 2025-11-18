
export enum GameState {
  Welcome,
  Loading,
  Playing,
  Won,
  Lost,
}

export interface WordData {
  word: string;
  definition: string;
}

export interface GuessedLetters {
  correct: string[];
  incorrect: string[];
}
