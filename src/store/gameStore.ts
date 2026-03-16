import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Level, Cell, Word } from '../types/game';
import { DailyChallenge } from '../types/challenge';
import { LEVELS } from '../data/levels';
import { db, auth } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getStoredWords, generateAndStoreWords } from '../services/wordService';
import { generateDynamicLevel } from '../services/levelGenerator';

interface GameStore extends GameState {
  soundEnabled: boolean;
  isGeneratingLevel: boolean;
  // Actions
  loadLevel: (levelId: number) => void;
  setDifficulty: (difficulty: 'Easy' | 'Medium' | 'Hard' | null) => void;
  submitWord: (word: string) => 'valid' | 'bonus' | 'already_found' | 'invalid';
  useHint: (type: 'reveal_letter' | 'reveal_word' | 'shuffle') => boolean;
  addCoins: (amount: number) => void;
  setTheme: (theme: string) => void;
  toggleSound: () => void;
  checkDailyLogin: () => void;
  resetCurrentLevel: () => void;
  syncToCloud: () => Promise<void>;
  loadFromCloud: () => Promise<void>;
  fetchWords: () => Promise<void>;
  fetchDailyChallenge: () => Promise<void>;
  generateNewLevel: (difficulty: 'Easy' | 'Medium' | 'Hard') => Promise<void>;
}

const INITIAL_STATE: GameState = {
  currentLevelId: 1,
  selectedDifficulty: null,
  coins: 200,
  hints: 5,
  score: 0,
  bonusWordsFound: [],
  wordsFound: [],
  revealedCells: [],
  theme: 'forest',
  dailyStreak: 0,
  lastLoginDate: null,
  levelsCompleted: 0,
  totalPlayTime: 0,
  playedLevels: [],
  words: [],
  dailyChallenge: null,
  dynamicLevels: [],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      soundEnabled: true,
      isGeneratingLevel: false,

      fetchWords: async () => {
        let words = await getStoredWords();
        if (words.length < 10) {
          words = await generateAndStoreWords(words);
        }
        set({ words });
      },

      fetchDailyChallenge: async () => {
        const today = new Date().toISOString().split('T')[0];
        const challengeRef = doc(db, 'dailyChallenges', today);
        const challengeSnap = await getDoc(challengeRef);
        if (challengeSnap.exists()) {
          set({ dailyChallenge: challengeSnap.data() as DailyChallenge });
        } else {
          // Fallback or generate new challenge
          const newChallenge: DailyChallenge = {
            id: today,
            date: today,
            word: 'PUZZLE',
            description: 'A game, toy, or problem designed to test ingenuity or knowledge.',
            isCompleted: false,
            reward: 50,
          };
          await setDoc(challengeRef, newChallenge);
          set({ dailyChallenge: newChallenge });
        }
      },

      loadLevel: (levelId) => {
        set((s) => ({
          currentLevelId: levelId,
          wordsFound: [],
          bonusWordsFound: [],
          revealedCells: [],
          playedLevels: s.playedLevels.includes(levelId) ? s.playedLevels : [...s.playedLevels, levelId],
        }));
        get().syncToCloud();
      },

      generateNewLevel: async (difficulty) => {
        console.log(`Starting level generation for difficulty: ${difficulty}`);
        
        if (!navigator.onLine) {
          console.log('Offline: Falling back to existing level');
          const diffLevels = LEVELS.filter(l => l.difficulty === difficulty || (difficulty === 'Easy' && l.difficulty === 'Beginner'));
          if (diffLevels.length > 0) {
            const randomLevel = diffLevels[Math.floor(Math.random() * diffLevels.length)];
            get().loadLevel(randomLevel.id);
          }
          return;
        }

        set({ isGeneratingLevel: true });
        
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Generation timed out after 30s')), 30000)
        );

        try {
          const nextId = Math.max(0, ...LEVELS.map(l => l.id), ...get().dynamicLevels.map(l => l.id)) + 1;
          console.log(`Generating level with ID: ${nextId}`);
          
          const newLevel = await Promise.race([
            generateDynamicLevel(difficulty, nextId),
            timeoutPromise
          ]) as Level;

          console.log('Level generated successfully:', newLevel.id);

          set((s) => ({
            dynamicLevels: [...s.dynamicLevels, newLevel],
            currentLevelId: newLevel.id,
            wordsFound: [],
            bonusWordsFound: [],
            revealedCells: [],
            playedLevels: [...s.playedLevels, newLevel.id],
            isGeneratingLevel: false
          }));
          get().syncToCloud();
        } catch (error) {
          console.error('Failed to generate level:', error);
          set({ isGeneratingLevel: false });
          
          // Fallback to a random existing level if generation fails
          console.log('Falling back to existing level...');
          const diffLevels = LEVELS.filter(l => l.difficulty === difficulty || (difficulty === 'Easy' && l.difficulty === 'Beginner'));
          if (diffLevels.length > 0) {
            const randomLevel = diffLevels[Math.floor(Math.random() * diffLevels.length)];
            get().loadLevel(randomLevel.id);
          }
        }
      },

      setDifficulty: (difficulty) => {
        set({ selectedDifficulty: difficulty });
        get().syncToCloud();
      },

      submitWord: (word) => {
        const state = get();
        const level = LEVELS.find((l) => l.id === state.currentLevelId) || state.dynamicLevels.find((l) => l.id === state.currentLevelId);
        if (!level) return 'invalid';

        if (state.wordsFound.includes(word) || state.bonusWordsFound.includes(word)) {
          return 'already_found';
        }

        const wordInGrid = level.words.find((w) => w.word === word);
        if (wordInGrid) {
          // Reveal cells
          const newRevealed = [...state.revealedCells];
          for (let i = 0; i < word.length; i++) {
            const x = wordInGrid.direction === 'horizontal' ? wordInGrid.x + i : wordInGrid.x;
            const y = wordInGrid.direction === 'vertical' ? wordInGrid.y + i : wordInGrid.y;
            if (!newRevealed.some((c) => c.x === x && c.y === y)) {
              newRevealed.push({ x, y });
            }
          }

          set((s) => ({
            wordsFound: [...s.wordsFound, word],
            revealedCells: newRevealed,
            score: s.score + word.length * 10,
            coins: s.coins + word.length * 2,
          }));

          // Check if level completed
          if (get().wordsFound.length === level.words.length) {
            set((s) => ({
              levelsCompleted: s.levelsCompleted + 1,
            }));
          }
          
          get().syncToCloud();
          return 'valid';
        }

        if (level.bonusWords.includes(word)) {
          set((s) => ({
            bonusWordsFound: [...s.bonusWordsFound, word],
            score: s.score + word.length * 5,
            coins: s.coins + word.length * 1,
          }));
          get().syncToCloud();
          return 'bonus';
        }

        return 'invalid';
      },

      useHint: (type) => {
        const state = get();
        const level = LEVELS.find((l) => l.id === state.currentLevelId) || state.dynamicLevels.find((l) => l.id === state.currentLevelId);
        if (!level) return false;

        const hintCost = type === 'reveal_word' ? 50 : 25;
        if (state.coins < hintCost) return false;

        if (type === 'reveal_letter') {
          // Find an unrevealed cell
          const allCells: {x: number, y: number}[] = [];
          level.words.forEach(w => {
            for (let i = 0; i < w.word.length; i++) {
              const x = w.direction === 'horizontal' ? w.x + i : w.x;
              const y = w.direction === 'vertical' ? w.y + i : w.y;
              if (!state.revealedCells.some(c => c.x === x && c.y === y)) {
                allCells.push({x, y});
              }
            }
          });

          if (allCells.length === 0) return false;

          const randomCell = allCells[Math.floor(Math.random() * allCells.length)];
          set((s) => ({
            coins: s.coins - hintCost,
            revealedCells: [...s.revealedCells, randomCell],
          }));

          // Check if level completed
          // We need to check if all cells are revealed now
          const allCellsInLevel: {x: number, y: number}[] = [];
          level.words.forEach(w => {
            for (let i = 0; i < w.word.length; i++) {
              const x = w.direction === 'horizontal' ? w.x + i : w.x;
              const y = w.direction === 'vertical' ? w.y + i : w.y;
              allCellsInLevel.push({x, y});
            }
          });
          
          const uniqueCells = Array.from(new Set(allCellsInLevel.map(c => `${c.x},${c.y}`))).map(s => {
            const [x, y] = s.split(',').map(Number);
            return {x, y};
          });

          if (get().revealedCells.length === uniqueCells.length) {
            set((s) => ({
              levelsCompleted: s.levelsCompleted + 1,
            }));
          }

          get().syncToCloud();
          return true;
        }

        if (type === 'reveal_word') {
          const unrevealedWords = level.words.filter(w => !state.wordsFound.includes(w.word));
          if (unrevealedWords.length === 0) return false;

          const randomWord = unrevealedWords[Math.floor(Math.random() * unrevealedWords.length)];
          const newRevealed = [...state.revealedCells];
          for (let i = 0; i < randomWord.word.length; i++) {
            const x = randomWord.direction === 'horizontal' ? randomWord.x + i : randomWord.x;
            const y = randomWord.direction === 'vertical' ? randomWord.y + i : randomWord.y;
            if (!newRevealed.some((c) => c.x === x && c.y === y)) {
              newRevealed.push({ x, y });
            }
          }

          set((s) => ({
            coins: s.coins - hintCost,
            wordsFound: [...s.wordsFound, randomWord.word],
            revealedCells: newRevealed,
          }));

          // Check if level completed
          if (get().wordsFound.length === level.words.length) {
            set((s) => ({
              levelsCompleted: s.levelsCompleted + 1,
            }));
          }

          get().syncToCloud();
          return true;
        }

        return false;
      },

      addCoins: (amount) => {
        set((s) => ({ coins: s.coins + amount }));
        get().syncToCloud();
      },
      setTheme: (theme) => set({ theme }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

      checkDailyLogin: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        if (state.lastLoginDate !== today) {
          const isConsecutive = state.lastLoginDate === new Date(Date.now() - 86400000).toISOString().split('T')[0];
          set((s) => ({
            lastLoginDate: today,
            dailyStreak: isConsecutive ? s.dailyStreak + 1 : 1,
            coins: s.coins + 50, // Daily reward
          }));
          get().syncToCloud();
        }
      },

      resetCurrentLevel: () => {
        set((s) => ({
          wordsFound: [],
          bonusWordsFound: [],
          revealedCells: [],
        }));
      },

      syncToCloud: async () => {
        const user = auth.currentUser;
        if (!user) return;
        const state = get();
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            currentLevelId: state.currentLevelId,
            selectedDifficulty: state.selectedDifficulty,
            coins: state.coins,
            hints: state.hints,
            score: state.score,
            dailyStreak: state.dailyStreak,
            lastLoginDate: state.lastLoginDate,
            levelsCompleted: state.levelsCompleted,
            totalPlayTime: state.totalPlayTime,
            playedLevels: state.playedLevels,
            dynamicLevels: state.dynamicLevels,
            updatedAt: serverTimestamp()
          }, { merge: true });
        } catch (error) {
          console.error('Error syncing to cloud', error);
        }
      },

      loadFromCloud: async () => {
        const user = auth.currentUser;
        if (!user) return;
        try {
          const docSnap = await getDoc(doc(db, 'users', user.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            set({
              currentLevelId: data.currentLevelId ?? 1,
              selectedDifficulty: data.selectedDifficulty ?? null,
              coins: data.coins ?? 200,
              hints: data.hints ?? 5,
              score: data.score ?? 0,
              dailyStreak: data.dailyStreak ?? 0,
              lastLoginDate: data.lastLoginDate ?? null,
              levelsCompleted: data.levelsCompleted ?? 0,
              totalPlayTime: data.totalPlayTime ?? 0,
              playedLevels: data.playedLevels ?? [],
              dynamicLevels: data.dynamicLevels ?? [],
            });
          }
        } catch (error) {
          console.error('Error loading from cloud', error);
        }
      }
    }),
    {
      name: 'word-puzzle-storage',
    }
  )
);
