import { Level } from '../types/game';

export const LEVELS: Level[] = [
  {
    id: 1,
    difficulty: 'Beginner',
    letters: ['E', 'A', 'T'],
    words: [
      { word: 'EAT', x: 0, y: 0, direction: 'horizontal' },
      { word: 'ATE', x: 1, y: 0, direction: 'vertical' },
      { word: 'TEA', x: 0, y: 2, direction: 'horizontal' },
    ],
    bonusWords: ['AT', 'TAE'],
  },
  {
    id: 2,
    difficulty: 'Beginner',
    letters: ['D', 'O', 'G', 'S'],
    words: [
      { word: 'DOGS', x: 1, y: 0, direction: 'horizontal' },
      { word: 'DOG', x: 1, y: 0, direction: 'vertical' },
      { word: 'GOD', x: 1, y: 2, direction: 'horizontal' },
      { word: 'SO', x: 4, y: 0, direction: 'vertical' },
    ],
    bonusWords: ['GO', 'DO'],
  },
  {
    id: 3,
    difficulty: 'Easy',
    letters: ['P', 'O', 'S', 'T'],
    words: [
      { word: 'POST', x: 0, y: 0, direction: 'horizontal' },
      { word: 'POT', x: 0, y: 0, direction: 'vertical' },
      { word: 'TOP', x: 0, y: 2, direction: 'horizontal' },
      { word: 'STOP', x: 3, y: 0, direction: 'vertical' },
    ],
    bonusWords: ['SPOT', 'OPTS', 'POTS', 'SO', 'TO'],
  },
  {
    id: 4,
    difficulty: 'Easy',
    letters: ['C', 'A', 'R', 'E'],
    words: [
      { word: 'CARE', x: 0, y: 0, direction: 'horizontal' },
      { word: 'CAR', x: 0, y: 0, direction: 'vertical' },
      { word: 'RACE', x: 0, y: 2, direction: 'horizontal' },
      { word: 'EAR', x: 3, y: 0, direction: 'vertical' },
    ],
    bonusWords: ['ARE', 'ERA', 'ARC'],
  },
  {
    id: 5,
    difficulty: 'Medium',
    letters: ['B', 'R', 'A', 'I', 'N'],
    words: [
      { word: 'BRAIN', x: 0, y: 0, direction: 'horizontal' },
      { word: 'BAR', x: 0, y: 0, direction: 'vertical' },
      { word: 'RAIN', x: 0, y: 2, direction: 'horizontal' },
      { word: 'IN', x: 3, y: 0, direction: 'vertical' },
      { word: 'RAN', x: 2, y: 2, direction: 'vertical' },
    ],
    bonusWords: ['AIR', 'RIB', 'BIN', 'NAB'],
  },
  {
    id: 6,
    difficulty: 'Medium',
    letters: ['S', 'T', 'A', 'R', 'E'],
    words: [
      { word: 'STARE', x: 0, y: 0, direction: 'horizontal' },
      { word: 'STAR', x: 0, y: 0, direction: 'vertical' },
      { word: 'TEAR', x: 0, y: 3, direction: 'horizontal' },
      { word: 'ART', x: 2, y: 0, direction: 'vertical' },
      { word: 'EAR', x: 4, y: 0, direction: 'vertical' },
    ],
    bonusWords: ['ARE', 'ERA', 'RATE', 'REST', 'SEAT'],
  },
  {
    id: 7,
    difficulty: 'Hard',
    letters: ['P', 'L', 'A', 'N', 'E', 'T'],
    words: [
      { word: 'PLANET', x: 0, y: 0, direction: 'horizontal' },
      { word: 'PLANE', x: 0, y: 0, direction: 'vertical' },
      { word: 'PLANT', x: 0, y: 4, direction: 'horizontal' },
      { word: 'LATE', x: 1, y: 0, direction: 'vertical' },
      { word: 'TEN', x: 5, y: 0, direction: 'vertical' },
    ],
    bonusWords: ['PLAN', 'PANT', 'TALE', 'LENT', 'PALE'],
  }
];

export const DAILY_PUZZLES: Record<string, Level> = {
  '2026-03-15': {
    id: 9991,
    difficulty: 'Hard',
    letters: ['S', 'P', 'R', 'I', 'N', 'G'],
    words: [
      { word: 'SPRING', x: 0, y: 0, direction: 'horizontal' },
      { word: 'RING', x: 2, y: 0, direction: 'vertical' },
      { word: 'PIG', x: 1, y: 0, direction: 'vertical' },
      { word: 'SIGN', x: 0, y: 0, direction: 'vertical' },
      { word: 'GRIN', x: 0, y: 3, direction: 'horizontal' },
    ],
    bonusWords: ['SPIN', 'RIG', 'SIR', 'NIP', 'PIN'],
  }
};
