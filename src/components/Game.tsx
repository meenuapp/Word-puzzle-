import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CrosswordGrid } from './CrosswordGrid';
import { LetterWheel } from './LetterWheel';
import { LEVELS } from '../data/levels';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Coins, Lightbulb, ArrowLeft, Star, Volume2, VolumeX } from 'lucide-react';

export const Game = ({ onBack }: { onBack: () => void }) => {
  const { currentLevelId, submitWord, useHint, coins, wordsFound, score, loadLevel, soundEnabled, toggleSound } = useGameStore();
  const level = LEVELS.find((l) => l.id === currentLevelId);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' | 'bonus' } | null>(null);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [floatingScores, setFloatingScores] = useState<{ id: number; score: number; x: number; y: number }[]>([]);
  const [wordMeanings, setWordMeanings] = useState<{ word: string; meaning: string }[]>([]);

  useEffect(() => {
    if (level && wordsFound.length === level.words.length) {
      // Level complete
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      const fetchMeanings = async () => {
        const meanings = await Promise.all(
          level.words.map(async (w) => {
            try {
              const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${w.word}`);
              if (res.ok) {
                const data = await res.json();
                const meaning = data[0]?.meanings[0]?.definitions[0]?.definition || 'Meaning not found.';
                return { word: w.word, meaning };
              }
            } catch (e) {
              console.error(e);
            }
            return { word: w.word, meaning: 'Meaning not available.' };
          })
        );
        setWordMeanings(meanings);
      };
      
      fetchMeanings();
      setTimeout(() => setShowLevelComplete(true), 1000);
    }
  }, [wordsFound, level]);

  const handleWordSubmit = (word: string) => {
    const result = submitWord(word);
    if (result === 'valid') {
      setFeedback({ text: 'Awesome!', type: 'success' });
      addFloatingScore(word.length * 10);
    } else if (result === 'bonus') {
      setFeedback({ text: 'Bonus Word!', type: 'bonus' });
      addFloatingScore(word.length * 5);
    } else if (result === 'already_found') {
      setFeedback({ text: 'Already Found', type: 'error' });
    } else {
      setFeedback({ text: 'Not a word', type: 'error' });
    }

    setTimeout(() => setFeedback(null), 1500);
  };

  const addFloatingScore = (amount: number) => {
    const id = Date.now();
    setFloatingScores((prev) => [...prev, { id, score: amount, x: Math.random() * 100 - 50, y: Math.random() * 50 }]);
    setTimeout(() => {
      setFloatingScores((prev) => prev.filter((s) => s.id !== id));
    }, 1500);
  };

  const handleNextLevel = () => {
    setShowLevelComplete(false);
    setWordMeanings([]);
    const { selectedDifficulty, playedLevels } = useGameStore.getState();
    
    if (selectedDifficulty) {
      const diffLevels = LEVELS.filter(l => l.difficulty === selectedDifficulty || (selectedDifficulty === 'Easy' && l.difficulty === 'Beginner'));
      if (diffLevels.length > 0) {
        // Find levels of this difficulty that haven't been played yet
        let unplayedLevels = diffLevels.filter(l => !playedLevels.includes(l.id));
        
        // If all levels of this difficulty have been played, reset the played history for this difficulty
        if (unplayedLevels.length === 0) {
          unplayedLevels = diffLevels;
          // Note: We could clear them from playedLevels, but for simplicity we just pick from all of them
        }
        
        // Pick a random unplayed level
        let nextLevel = unplayedLevels[Math.floor(Math.random() * unplayedLevels.length)];
        
        // Ensure we don't pick the exact same level if there are other options
        if (unplayedLevels.length > 1 && nextLevel.id === currentLevelId) {
          const otherLevels = unplayedLevels.filter(l => l.id !== currentLevelId);
          nextLevel = otherLevels[Math.floor(Math.random() * otherLevels.length)];
        }
        
        loadLevel(nextLevel.id);
        return;
      }
    }
    
    // Fallback to sequential
    loadLevel(currentLevelId + 1);
  };

  if (!level) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white">
        <h2 className="text-3xl font-bold mb-4">More levels coming soon!</h2>
        <button onClick={onBack} className="px-6 py-3 bg-white text-indigo-600 rounded-full font-bold shadow-lg">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium opacity-80">Level {level.id}</span>
          <span className="text-lg font-bold">{level.difficulty}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleSound} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full">
            <Coins size={18} className="text-yellow-400" />
            <span className="font-bold">{coins}</span>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-between pb-4 relative min-h-0">
        {/* Floating Scores */}
        <AnimatePresence>
          {floatingScores.map((score) => (
            <motion.div
              key={score.id}
              initial={{ opacity: 0, y: score.y, x: score.x, scale: 0.5 }}
              animate={{ opacity: 1, y: score.y - 100, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 text-yellow-400 font-black text-3xl z-50 pointer-events-none drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]"
            >
              +{score.score}
            </motion.div>
          ))}
        </AnimatePresence>

        <CrosswordGrid />

        {/* Feedback Message */}
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`px-4 py-1 rounded-full font-bold text-sm shadow-md ${
                  feedback.type === 'success' ? 'bg-green-500 text-white' :
                  feedback.type === 'bonus' ? 'bg-yellow-500 text-white' :
                  'bg-red-500 text-white'
                }`}
              >
                {feedback.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls & Wheel */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="relative flex items-center justify-center w-full px-2">
            <button 
              onClick={() => useHint('reveal_letter')}
              className="absolute left-2 sm:left-4 flex flex-col items-center gap-1 text-white opacity-90 hover:opacity-100 transition-opacity"
            >
              <div className="w-12 h-12 bg-indigo-500/50 rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                <Lightbulb size={24} />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium">
                <span>25</span>
                <Coins size={10} className="text-yellow-400" />
              </div>
            </button>

            <LetterWheel onWordSubmit={handleWordSubmit} />

            <button 
              onClick={() => useHint('reveal_word')}
              className="absolute right-2 sm:right-4 flex flex-col items-center gap-1 text-white opacity-90 hover:opacity-100 transition-opacity"
            >
              <div className="w-12 h-12 bg-indigo-500/50 rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                <Star size={24} />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium">
                <span>50</span>
                <Coins size={10} className="text-yellow-400" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Level Complete Modal */}
      <AnimatePresence>
        {showLevelComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm flex flex-col items-center text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <Star size={40} className="text-white fill-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Level Cleared!</h2>
              <p className="text-slate-500 mb-6 font-medium">You found all the words.</p>
              
              <div className="flex items-center justify-center gap-4 mb-6 w-full">
                <div className="flex flex-col items-center bg-slate-50 p-4 rounded-2xl flex-1">
                  <span className="text-sm text-slate-400 font-medium mb-1">Score</span>
                  <span className="text-2xl font-bold text-indigo-600">{score}</span>
                </div>
                <div className="flex flex-col items-center bg-slate-50 p-4 rounded-2xl flex-1">
                  <span className="text-sm text-slate-400 font-medium mb-1">Coins</span>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-yellow-500">+{level.words.length * 10}</span>
                  </div>
                </div>
              </div>

              {wordMeanings.length > 0 && (
                <div className="w-full mb-6 max-h-40 overflow-y-auto text-left bg-slate-50 p-4 rounded-2xl">
                  <h3 className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wider">Word Meanings</h3>
                  <div className="flex flex-col gap-3">
                    {wordMeanings.map((wm, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-bold text-indigo-600 capitalize">{wm.word}: </span>
                        <span className="text-slate-600">{wm.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleNextLevel}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                Next Level
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
