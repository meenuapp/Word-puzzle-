import React, { useState, useEffect, useRef } from 'react';
import { Home } from './components/Home';
import { Game } from './components/Game';
import { MagicalBackground } from './components/MagicalBackground';
import { useGameStore } from './store/gameStore';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'game' | 'daily'>('home');
  const { loadFromCloud, soundEnabled } = useGameStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadFromCloud();
      }
    });
    return () => unsubscribe();
  }, [loadFromCloud]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!soundEnabled) {
      audio.pause();
      return;
    }

    const playAudio = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.log("Autoplay prevented, waiting for user interaction");
      }
    };

    playAudio();

    const handleInteraction = () => {
      if (soundEnabled && audio.paused) {
        audio.play().catch(e => console.log("Audio play error:", e));
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [soundEnabled]);

  return (
    <div className="w-full h-screen bg-slate-900 overflow-hidden font-sans select-none touch-none">
      {/* Background Theme */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1000&auto=format&fit=crop')`, // Forest theme
          filter: 'brightness(0.4) saturate(1.2)'
        }}
      />
      
      <MagicalBackground />

      {/* Audio */}
      <audio ref={audioRef} loop>
        <source src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Satie_-_Gymnop%C3%A9die_No._1.mp3" type="audio/mpeg" />
        <source src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Gymnopedie_No._1.ogg" type="audio/ogg" />
      </audio>
      
      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {currentScreen === 'home' && (
          <Home 
            onPlay={() => setCurrentScreen('game')} 
            onDaily={() => setCurrentScreen('daily')} 
          />
        )}
        {currentScreen === 'game' && (
          <Game onBack={() => setCurrentScreen('home')} />
        )}
        {currentScreen === 'daily' && (
          <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Daily Puzzle</h2>
            <p className="mb-8 opacity-80">Come back tomorrow for a new challenge!</p>
            <button 
              onClick={() => setCurrentScreen('home')}
              className="px-8 py-4 bg-white text-indigo-900 rounded-full font-bold shadow-xl"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
