export interface WordPosition {
  word: string;
  x: number;
  y: number;
  direction: 'horizontal' | 'vertical';
}

export interface Level {
  id: number;
  difficulty: 'Beginner' | 'Easy' | 'Medium' | 'Hard' | 'Expert';
  letters: string[];
  words: WordPosition[];
  bonusWords: string[];
}

export interface Cell {
  x: number;
  y: number;
  letter: string;
  isRevealed: boolean;
  wordIds: string[]; // Which words this cell belongs to
}

export interface GameState {
  currentLevelId: number;
  selectedDifficulty: 'Easy' | 'Medium' | 'Hard' | null;
  coins: number;
  hints: number;
  score: number;
  bonusWordsFound: string[];
  wordsFound: string[];
  revealedCells: { x: number; y: number }[];
  theme: string;
  dailyStreak: number;
  lastLoginDate: string | null;
  levelsCompleted: number;
  totalPlayTime: number; // in seconds
  playedLevels: number[];
}
