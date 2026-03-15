import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion } from 'motion/react';
import { Play, Calendar, Trophy, LogIn, LogOut, Coins, Volume2, VolumeX } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';

export const Home = ({ onPlay, onDaily }: { onPlay: () => void; onDaily: () => void }) => {
  const { currentLevelId, coins, score, levelsCompleted, checkDailyLogin, dailyStreak, soundEnabled, toggleSound } = useGameStore();
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    checkDailyLogin();
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, [checkDailyLogin]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed', error);
    }
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
          <button 
            onClick={toggleSound}
            className="p-2 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/30 transition-colors"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          {!user ? (
            <button onClick={handleLogin} className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/30 transition-colors font-bold text-sm">
              <LogIn size={18} />
              <span>Sign In</span>
            </button>
          ) : (
            <button onClick={() => signOut(auth)} className="flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/30 transition-colors font-bold text-sm">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center mb-12">
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlay}
          className="w-full max-w-xs py-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full font-black text-2xl text-slate-900 shadow-xl shadow-orange-500/30 flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <Play size={28} className="fill-slate-900" />
          <span>PLAY</span>
        </motion.button>
      </div>

      {/* Bottom Menu */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={onDaily}
          className="bg-black/20 backdrop-blur-sm p-4 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-black/30 transition-colors border border-white/10"
        >
          <div className="relative">
            <Calendar size={32} className="text-indigo-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-indigo-900"></div>
          </div>
          <span className="font-bold text-sm">Daily Puzzle</span>
          <span className="text-xs opacity-70">{dailyStreak} Day Streak</span>
        </button>

        <button className="bg-black/20 backdrop-blur-sm p-4 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-black/30 transition-colors border border-white/10">
          <Trophy size={32} className="text-yellow-400" />
          <span className="font-bold text-sm">Achievements</span>
          <span className="text-xs opacity-70">{levelsCompleted} Completed</span>
        </button>
      </div>
    </div>
  );
};
