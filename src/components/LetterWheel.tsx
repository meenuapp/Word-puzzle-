import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';
import { LEVELS } from '../data/levels';
import clsx from 'clsx';
import { RefreshCw } from 'lucide-react';

export const LetterWheel = ({ onWordSubmit }: { onWordSubmit: (word: string) => void }) => {
  const { currentLevelId } = useGameStore();
  const level = LEVELS.find((l) => l.id === currentLevelId);
  const [letters, setLetters] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [letterPositions, setLetterPositions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (level) {
      const shuffledLetters = [...level.letters].sort(() => Math.random() - 0.5);
      setLetters(shuffledLetters);
      // Calculate positions
      const radius = 80;
      const center = { x: 100, y: 100 };
      const positions = shuffledLetters.map((_, i) => {
        const angle = (i / shuffledLetters.length) * 2 * Math.PI - Math.PI / 2;
        return {
          x: center.x + radius * Math.cos(angle),
          y: center.y + radius * Math.sin(angle),
        };
      });
      setLetterPositions(positions);
    }
  }, [level]);

  const handleStart = (index: number) => {
    setIsDragging(true);
    setSelectedIndices([index]);
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !wheelRef.current) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = wheelRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Check if we are over any letter
    letterPositions.forEach((pos, index) => {
      const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
      if (distance < 30) {
        if (!selectedIndices.includes(index)) {
          setSelectedIndices((prev) => [...prev, index]);
        } else if (selectedIndices.length > 1 && selectedIndices[selectedIndices.length - 2] === index) {
          // Backtrack
          setSelectedIndices((prev) => prev.slice(0, -1));
        }
      }
    });
  };

  const handleEnd = () => {
    if (isDragging && selectedIndices.length > 0) {
      const word = selectedIndices.map((i) => letters[i]).join('');
      onWordSubmit(word);
    }
    setIsDragging(false);
    setSelectedIndices([]);
  };

  const shuffle = () => {
    setLetters((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  if (!level) return null;

  const currentWord = selectedIndices.map((i) => letters[i]).join('');

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="h-10 mb-2 flex items-center justify-center">
        {currentWord && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-bold text-2xl tracking-widest shadow-lg border border-white/30"
          >
            {currentWord}
          </motion.div>
        )}
      </div>

      <div
        ref={wheelRef}
        className="relative w-[200px] h-[200px] touch-none"
        onMouseDown={(e) => {
          // Find closest letter
          const rect = wheelRef.current?.getBoundingClientRect();
          if (!rect) return;
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          let closestIndex = -1;
          let minDistance = Infinity;
          letterPositions.forEach((pos, index) => {
            const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
            if (distance < 30 && distance < minDistance) {
              minDistance = distance;
              closestIndex = index;
            }
          });
          if (closestIndex !== -1) handleStart(closestIndex);
        }}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => {
          const rect = wheelRef.current?.getBoundingClientRect();
          if (!rect) return;
          const x = e.touches[0].clientX - rect.left;
          const y = e.touches[0].clientY - rect.top;
          let closestIndex = -1;
          let minDistance = Infinity;
          letterPositions.forEach((pos, index) => {
            const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
            if (distance < 30 && distance < minDistance) {
              minDistance = distance;
              closestIndex = index;
            }
          });
          if (closestIndex !== -1) handleStart(closestIndex);
        }}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
      >
        {/* Draw lines between selected letters */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {selectedIndices.map((index, i) => {
            if (i === 0) return null;
            const prevIndex = selectedIndices[i - 1];
            const start = letterPositions[prevIndex];
            const end = letterPositions[index];
            return (
              <line
                key={`line-${i}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="rgba(253, 224, 71, 0.8)"
                strokeWidth="8"
                strokeLinecap="round"
                filter="url(#glow)"
              />
            );
          })}
        </svg>

        {/* Draw letters */}
        {letters.map((letter, index) => {
          const pos = letterPositions[index];
          const isSelected = selectedIndices.includes(index);
          if (!pos) return null;

          return (
            <motion.div
              key={`${letter}-${index}`}
              className={clsx(
                "absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg cursor-pointer select-none transition-colors duration-200",
                isSelected ? "bg-yellow-400 text-slate-900 scale-110" : "bg-white text-slate-800 hover:bg-slate-100"
              )}
              style={{ left: pos.x, top: pos.y }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {letter}
            </motion.div>
          );
        })}

        {/* Shuffle button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            shuffle();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors pointer-events-auto"
        >
          <RefreshCw size={24} />
        </button>
      </div>
    </div>
  );
};
