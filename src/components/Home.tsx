import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Calendar, Trophy, LogIn, LogOut, Coins, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithPopup, signInWithRedirect, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { LEVELS } from '../data/levels';

export const Home = ({ onPlay, onDaily }: { onPlay: () => void; onDaily: () => void }) => {
  const { currentLevelId, coins, score, levelsCompleted, checkDailyLogin, dailyStreak, soundEnabled, toggleSound, setDifficulty, loadLevel, addCoins, fetchDailyChallenge, dailyChallenge, generateNewLevel, isGeneratingLevel } = useGameStore();
  const [user, setUser] = useState(auth.currentUser);
  const [showDifficultySelect, setShowDifficultySelect] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    checkDailyLogin();
    fetchDailyChallenge();
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, [checkDailyLogin, fetchDailyChallenge]);

  const handleLogin = async () => {
    setLoginError(null);
    try {
      const provider = new GoogleAuthProvider();
      // Check if running inside an iframe (like AI Studio preview)
      const inIframe = window.self !== window.top;
      
      if (inIframe) {
        // Use popup for AI Studio iframe to avoid redirect loop issues
        await signInWithPopup(auth, provider);
      } else {
        // Use redirect for Vercel / Android WebView to avoid popup blocks
        await signInWithRedirect(auth, provider);
      }
    } catch (error: any) {
      console.error('Login failed', error);
      setLoginError(error.message || 'Failed to sign in. Please try again.');
    }
  };

  const handleDifficultySelect = async (diff: 'Easy' | 'Medium' | 'Hard') => {
    const { selectedDifficulty, currentLevelId, playedLevels } = useGameStore.getState();
    const currentLevel = LEVELS.find(l => l.id === currentLevelId);
    
    setDifficulty(diff);
    
    // Always generate a new level if the user wants "new words everytime"
    // or if they are switching difficulty
    await generateNewLevel(diff);
    onPlay();
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto relative overflow-hidden text-white p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
          <Coins size={20} className="text-yellow-400" />
          <span className="font-bold text-lg">{coins}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={toggleSound}
            className="p-2 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/30 transition-colors"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </Button>
          {user?.email === 'tamilanews@gmail.com' && (
            <Button 
              onClick={() => addCoins(1000)}
              className="p-2 bg-yellow-500/20 rounded-full backdrop-blur-sm hover:bg-yellow-500/30 transition-colors"
              title="Refill Coins"
            >
              <Coins size={20} className="text-yellow-400" />
            </Button>
          )}
          {!user ? (
            <Button onClick={handleLogin} className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/30 transition-colors font-bold text-sm">
              <LogIn size={18} />
              <span>Sign In</span>
            </Button>
          ) : (
            <Button onClick={() => signOut(auth)} className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/30 transition-colors font-bold text-sm">
              <LogOut size={18} />
              <span>Sign Out</span>
            </Button>
          )}
        </div>
      </div>

      {loginError && (
        <div className="bg-red-500/80 text-white p-3 rounded-xl mb-4 text-sm text-center backdrop-blur-sm border border-red-400">
          {loginError}
        </div>
      )}

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center mb-12 relative">
        <AnimatePresence mode="wait">
          {!showDifficultySelect ? (
            <motion.div
              key="main-menu"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center justify-center w-full"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="relative w-48 h-48 mb-8 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative z-10 w-full h-full bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex flex-col items-center justify-center shadow-2xl">
                  <span className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                    WORD
                  </span>
                  <span className="text-3xl font-bold tracking-widest text-yellow-400 mt-1">
                    PUZZLE
                  </span>
                </div>
              </motion.div>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex flex-col items-center bg-black/20 px-6 py-3 rounded-2xl backdrop-blur-sm">
                  <span className="text-sm font-medium opacity-70 mb-1">Level</span>
                  <span className="text-2xl font-bold">{currentLevelId}</span>
                </div>
                <div className="flex flex-col items-center bg-black/20 px-6 py-3 rounded-2xl backdrop-blur-sm">
                  <span className="text-sm font-medium opacity-70 mb-1">Score</span>
                  <span className="text-2xl font-bold">{score}</span>
                </div>
              </div>

              {/* Play Button */}
              <Button
                onClick={() => setShowDifficultySelect(true)}
                className="w-full max-w-xs py-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full font-black text-2xl text-slate-900 shadow-xl shadow-orange-500/30 flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <Play size={28} className="fill-slate-900" />
                <span>PLAY</span>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="difficulty-select"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col items-center justify-center w-full"
            >
              <Button 
                onClick={() => setShowDifficultySelect(false)}
                className="self-start mb-8 p-2 bg-black/20 rounded-full hover:bg-black/30 transition-colors"
              >
                <ArrowLeft size={24} />
              </Button>
              
              <h2 className="text-3xl font-black mb-8 tracking-wider">SELECT DIFFICULTY</h2>
              
              <div className="flex flex-col gap-4 w-full max-w-xs">
                <Button
                  onClick={() => handleDifficultySelect('Easy')}
                  disabled={isGeneratingLevel}
                  className="w-full py-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl font-bold text-xl text-white shadow-lg shadow-teal-500/30 disabled:opacity-50"
                >
                  {isGeneratingLevel ? 'GENERATING...' : 'EASY'}
                </Button>
                <Button
                  onClick={() => handleDifficultySelect('Medium')}
                  disabled={isGeneratingLevel}
                  className="w-full py-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl font-bold text-xl text-white shadow-lg shadow-indigo-500/30 disabled:opacity-50"
                >
                  {isGeneratingLevel ? 'GENERATING...' : 'MEDIUM'}
                </Button>
                <Button
                  onClick={() => handleDifficultySelect('Hard')}
                  disabled={isGeneratingLevel}
                  className="w-full py-4 bg-gradient-to-r from-rose-400 to-red-500 rounded-2xl font-bold text-xl text-white shadow-lg shadow-red-500/30 disabled:opacity-50"
                >
                  {isGeneratingLevel ? 'GENERATING...' : 'HARD'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Menu */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={onDaily}
          className="bg-black/20 backdrop-blur-sm p-4 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-black/30 transition-colors border border-white/10"
        >
          <div className="relative">
            <Calendar size={32} className={dailyChallenge?.isCompleted ? "text-green-400" : "text-indigo-300"} />
            {!dailyChallenge?.isCompleted && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-indigo-900"></div>}
          </div>
          <span className="font-bold text-sm">Daily Puzzle</span>
          <span className="text-xs opacity-70">{dailyChallenge?.isCompleted ? 'Completed' : 'Available'}</span>
        </Button>

        <Button className="bg-black/20 backdrop-blur-sm p-4 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-black/30 transition-colors border border-white/10">
          <Trophy size={32} className="text-yellow-400" />
          <span className="font-bold text-sm">Achievements</span>
          <span className="text-xs opacity-70">{levelsCompleted} Completed</span>
        </Button>
      </div>
    </div>
  );
};
