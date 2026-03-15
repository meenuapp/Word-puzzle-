import * as fs from 'fs';

const levelData = [
  { w: ["CAT", "ACT", "BAT", "TAB"], l: ["C", "A", "T", "B"] },
  { w: ["DOG", "GOD", "GOOD"], l: ["D", "O", "G"] },
  { w: ["SUN", "NUN", "US"], l: ["S", "U", "N"] },
  { w: ["CAR", "ARC", "ART", "TAR", "RAT"], l: ["C", "A", "R", "T"] },
  { w: ["PEN", "PIN", "PINE", "NIP"], l: ["P", "E", "N", "I"] },
  { w: ["HAT", "THAT", "CHAT"], l: ["H", "A", "T", "C"] },
  { w: ["LIP", "SLIP", "LIPS"], l: ["L", "I", "P", "S"] },
  { w: ["POT", "TOP", "STOP", "POST", "SPOT"], l: ["P", "O", "T", "S"] },
  { w: ["CARE", "RACE", "CAR", "EAR", "ARC"], l: ["C", "A", "R", "E"] },
  { w: ["BEAR", "BARE", "EAR", "BAR", "ARE"], l: ["B", "E", "A", "R"] },
  { w: ["DEAR", "READ", "DARE", "RED", "EAR"], l: ["D", "E", "A", "R"] },
  { w: ["MEAT", "TEAM", "TAME", "MATE", "EAT", "TEA", "MAT"], l: ["M", "E", "A", "T"] },
  { w: ["SEAT", "EAST", "TEAS", "SEA", "EAT", "ATE"], l: ["S", "E", "A", "T"] },
  { w: ["WOLF", "FLOW", "FOWL", "LOW", "OWL"], l: ["W", "O", "L", "F"] },
  { w: ["WORD", "SWORD", "ROW", "ROD"], l: ["W", "O", "R", "D", "S"] },
  { w: ["TIME", "MITE", "ITEM", "EMIT", "TIE", "MET"], l: ["T", "I", "M", "E"] },
  { w: ["HEART", "EARTH", "HATER", "HEAR", "TEAR", "ART", "EAR", "HAT"], l: ["H", "E", "A", "R", "T"] },
  { w: ["SMILE", "MILES", "SLIME", "MILE", "ISLE"], l: ["S", "M", "I", "L", "E"] },
  { w: ["STONE", "TONES", "NOTES", "TONE", "NOTE", "SON", "NOT", "NET", "TEN"], l: ["S", "T", "O", "N", "E"] },
  { w: ["WATER", "WEAR", "TEAR", "RATE", "ART", "WAR", "RAW", "ATE"], l: ["W", "A", "T", "E", "R"] },
  { w: ["NIGHT", "THING", "THIN", "HINT", "HIT", "TIN"], l: ["N", "I", "G", "H", "T"] },
  { w: ["LIGHT"], l: ["L", "I", "G", "H", "T"] },
  { w: ["HOUSE", "SHOES", "HOSE", "SHOE", "USE", "SUE"], l: ["H", "O", "U", "S", "E"] },
  { w: ["MOUSE", "MUSE", "SOME", "SUM", "USE"], l: ["M", "O", "U", "S", "E"] },
  { w: ["TRAIN", "RAIN", "RAN", "ART", "TAR", "RAT", "TIN"], l: ["T", "R", "A", "I", "N"] },
  { w: ["TRACK", "RACK", "CART", "ART", "CAT", "ACT", "RAT"], l: ["T", "R", "A", "C", "K"] },
  { w: ["BREAD", "BEAR", "BARE", "DARE", "READ", "DEAR", "RED", "BAD", "BED"], l: ["B", "R", "E", "A", "D"] },
  { w: ["BREAK", "BAKER", "BEAR", "BARE", "BARK", "EAR", "ERA", "ARE"], l: ["B", "R", "E", "A", "K"] },
  { w: ["CLEAN", "LANCE", "CLAN", "LANE", "LEAN", "CAN", "ALE"], l: ["C", "L", "E", "A", "N"] },
  { w: ["CLEAR"], l: ["C", "L", "E", "A", "R"] },
  { w: ["DREAM", "ARMED", "READ", "DEAR", "DARE", "ARM", "MAD", "RED"], l: ["D", "R", "E", "A", "M"] },
  { w: ["DRINK", "RIND", "KIND", "INK", "KID", "RID"], l: ["D", "R", "I", "N", "K"] },
  { w: ["DRIVE", "DIVER", "RIDE", "DIVE", "RED", "RID"], l: ["D", "R", "I", "V", "E"] },
  { w: ["EMPTY", "TYPE", "YET", "PET", "MET"], l: ["E", "M", "P", "T", "Y"] },
  { w: ["EQUAL"], l: ["E", "Q", "U", "A", "L"] },
  { w: ["FAULT", "FLAT", "FAT"], l: ["F", "A", "U", "L", "T"] },
  { w: ["FIELD", "FILE", "LIFE", "FED", "LED", "LIE"], l: ["F", "I", "E", "L", "D"] },
  { w: ["FIGHT", "GIFT", "FIG", "FIT", "HIT"], l: ["F", "I", "G", "H", "T"] },
  { w: ["FINAL", "NAIL", "FAIL", "FAN", "FIN"], l: ["F", "I", "N", "A", "L"] },
  { w: ["FIRST", "RITS", "FITS", "SIT", "FIT", "SIR"], l: ["F", "I", "R", "S", "T"] },
  { w: ["FLOOR", "FOOL", "ROOF", "FOR"], l: ["F", "L", "O", "O", "R"] },
  { w: ["FORCE", "CORE", "FOR"], l: ["F", "O", "R", "C", "E"] },
  { w: ["FRAME", "FARM", "FEAR", "FARE", "ARM", "EAR", "ARE"], l: ["F", "R", "A", "M", "E"] },
  { w: ["FRONT", "FONT", "FORT", "TORN", "FOR", "NOT", "TON", "ROT"], l: ["F", "R", "O", "N", "T"] },
  { w: ["FRUIT"], l: ["F", "R", "U", "I", "T"] },
  { w: ["GLASS", "LASS", "GAS", "ASS"], l: ["G", "L", "A", "S", "S"] },
  { w: ["GRANT", "RANT", "ART", "ANT", "RAN", "TAR", "RAT"], l: ["G", "R", "A", "N", "T"] },
  { w: ["GRASS", "RAGS", "GAS", "ASS", "RAG"], l: ["G", "R", "A", "S", "S"] },
  { w: ["GREEN", "GENRE", "GENE"], l: ["G", "R", "E", "E", "N"] },
  { w: ["GROUP", "POUR", "OUR", "PRO", "PUG"], l: ["G", "R", "O", "U", "P"] }
];

const levels = [];

for (let i = 0; i < 50; i++) {
  const data = levelData[i];
  const words = data.w;
  
  // We will just put the first word horizontal, and the rest as bonus words, 
  // OR we can make a simple cross. Let's make a simple cross of the first 2 words if they share a letter.
  
  const levelWords = [];
  const bonusWords = [];
  
  let w1 = words[0];
  levelWords.push({ word: w1, x: 0, y: 0, direction: 'horizontal' });
  
  let w2 = words.length > 1 ? words[1] : null;
  let placedW2 = false;
  
  if (w2) {
    // find common letter
    let commonChar = null;
    let idx1 = -1;
    let idx2 = -1;
    for (let c = 0; c < w1.length; c++) {
      let c2 = w2.indexOf(w1[c]);
      if (c2 !== -1) {
        commonChar = w1[c];
        idx1 = c;
        idx2 = c2;
        break;
      }
    }
    
    if (commonChar) {
      levelWords.push({ word: w2, x: idx1, y: -idx2, direction: 'vertical' });
      placedW2 = true;
    }
  }
  
  for (let j = placedW2 ? 2 : 1; j < words.length; j++) {
    bonusWords.push(words[j]);
  }
  
  if (!placedW2 && w2) {
    bonusWords.push(w2);
  }
  
  // Shift coordinates to be positive
  let minX = 0;
  let minY = 0;
  levelWords.forEach(w => {
    if (w.x < minX) minX = w.x;
    if (w.y < minY) minY = w.y;
  });
  
  levelWords.forEach(w => {
    w.x -= minX;
    w.y -= minY;
  });

  levels.push({
    id: i + 1,
    difficulty: i < 10 ? 'Beginner' : i < 25 ? 'Easy' : i < 40 ? 'Medium' : 'Hard',
    letters: data.l,
    words: levelWords,
    bonusWords: bonusWords
  });
}

const content = `import { Level } from '../types/game';

export const LEVELS: Level[] = ${JSON.stringify(levels, null, 2)};

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
`;

fs.writeFileSync('src/data/levels.ts', content);
