import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CrosswordGrid } from './CrosswordGrid';
import { LetterWheel } from './LetterWheel';
import { LEVELS } from '../data/levels';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Coins, Lightbulb, ArrowLeft, Star, Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../context/SoundContext';

export const Game = ({ onBack }: { onBack: () => void }) => {
  const { currentLevelId, submitWord, useHint, coins, wordsFound, score, loadLevel, soundEnabled, toggleSound, generateNewLevel, isGeneratingLevel, dynamicLevels } = useGameStore();
  const { playSound } = useSound();
  const level = LEVELS.find((l) => l.id === currentLevelId) || dynamicLevels.find((l) => l.id === currentLevelId);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' | 'bonus' } | null>(null);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showMeanings, setShowMeanings] = useState(false);
  const [floatingScores, setFloatingScores] = useState<{ id: number; score: number; x: number; y: number }[]>([]);
  const [wordMeanings, setWordMeanings] = useState<{ word: string; meaning: string }[]>([]);

  useEffect(() => {
    const fetchMeanings = async () => {
      const meanings = await Promise.all(
        level.words.map(async (w) => {
          try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${w.word}`);
            if (res.ok) {
              const data = await res.json();
              // Replace word in definition with underscores
              const rawMeaning = data[0]?.meanings[0]?.definitions[0]?.definition || 'Meaning not found.';
              const regex = new RegExp(w.word, 'gi');
              const meaning = rawMeaning.replace(regex, '_____');
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
    
    if (level) {
      fetchMeanings();
    }
  }, [level]);

  useEffect(() => {
    if (level && wordsFound.length === level.words.length) {
      // Level complete
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
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

  const handleNextLevel = async () => {
    setShowLevelComplete(false);
    setWordMeanings([]);
    const { selectedDifficulty } = useGameStore.getState();
    
    if (selectedDifficulty) {
      await generateNewLevel(selectedDifficulty);
    } else {
      // Fallback to sequential if no difficulty selected (shouldn't happen with new flow)
      loadLevel(currentLevelId + 1);
    }
  };

  if (!level) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white">
        <h2 className="text-3xl font-bold mb-4">More levels coming soon!</h2>
        <button onClick={() => { playSound(); onBack(); }} className="px-6 py-3 bg-white text-indigo-600 rounded-full font-bold shadow-lg">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <button onClick={() => { playSound(); onBack(); }} className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium opacity-80">Level {level.id}</span>
          <span className="text-lg font-bold">{level.difficulty}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { playSound(); setShowMeanings(true); }} className="p-2 hover:bg-white/20 rounded-full transition-colors text-white">
            <Lightbulb size={20} />
          </button>
          <button onClick={() => { playSound(); toggleSound(); }} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full">
            <Coins size={18} className="text-yellow-400" />
            <span className="font-bold">{coins}</span>
          </div>
        </div>
      </div>

      {/* Meanings Modal */}
      <AnimatePresence>
        {showMeanings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 z-50"
            onClick={() => setShowMeanings(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-indigo-900 mb-4">Word Meanings</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {wordMeanings.map((m, i) => (
                  <div key={i} className="border-b border-gray-200 pb-2">
                    <p className="text-indigo-600 font-bold">{m.word.length} letters</p>
                    <p className="text-gray-700 text-sm">{m.meaning}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowMeanings(false)}
                className="w-full mt-6 py-2 bg-indigo-600 text-white rounded-xl font-bold"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              onClick={() => { playSound(); useHint('reveal_letter'); }}
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
              onClick={() => { playSound(); useHint('reveal_word'); }}
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
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-gradient-to-b from-indigo-600 to-purple-800 rounded-[2rem] p-8 w-full max-w-sm flex flex-col items-center text-center shadow-2xl border border-white/20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 shadow-lg border-4 border-white/30"
              >
                <Star size={48} className="text-yellow-300 fill-yellow-300" />
              </motion.div>
              
              <h2 className="text-4xl font-black text-white mb-2 drop-shadow-md">Level Cleared!</h2>
              <p className="text-indigo-100 mb-8 font-medium">Amazing work! You've mastered this level.</p>
              
              <div className="flex items-center justify-center gap-4 mb-8 w-full">
                <div className="flex flex-col items-center bg-white/10 p-4 rounded-2xl flex-1 border border-white/10">
                  <span className="text-xs text-indigo-200 font-bold uppercase tracking-wider mb-1">Score</span>
                  <span className="text-3xl font-black text-white">{score}</span>
                </div>
                <div className="flex flex-col items-center bg-white/10 p-4 rounded-2xl flex-1 border border-white/10">
                  <span className="text-xs text-indigo-200 font-bold uppercase tracking-wider mb-1">Coins</span>
                  <span className="text-3xl font-black text-yellow-300">+{level.words.length * 10}</span>
                </div>
              </div>

              <button
                onClick={() => { playSound(); handleNextLevel(); }}
                disabled={isGeneratingLevel}
                className="w-full py-4 bg-white text-indigo-900 rounded-2xl font-black text-xl shadow-lg hover:bg-indigo-50 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGeneratingLevel ? 'Generating...' : 'Next Level'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
