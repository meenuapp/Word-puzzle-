import React, { createContext, useContext, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

interface SoundContextType {
  playSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const soundEffectRef = useRef<HTMLAudioElement>(null);
  const { soundEnabled } = useGameStore();

  const playSound = () => {
    if (soundEnabled && soundEffectRef.current) {
      soundEffectRef.current.currentTime = 0;
      soundEffectRef.current.play().catch(e => console.log("Sound effect play error:", e));
    }
  };

  return (
    <SoundContext.Provider value={{ playSound }}>
      {children}
      <audio ref={soundEffectRef} src="https://actions.google.com/sounds/v1/ui/button_tap.ogg" />
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
