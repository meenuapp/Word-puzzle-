import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { LEVELS } from '../data/levels';
import { motion } from 'motion/react';
import clsx from 'clsx';

export const CrosswordGrid = () => {
  const { currentLevelId, wordsFound, revealedCells } = useGameStore();
  const level = LEVELS.find((l) => l.id === currentLevelId);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!level) return null;

  // Calculate grid dimensions
  let minX = 0, minY = 0, maxX = 0, maxY = 0;
  level.words.forEach((w) => {
    minX = Math.min(minX, w.x);
    minY = Math.min(minY, w.y);
    maxX = Math.max(maxX, w.direction === 'horizontal' ? w.x + w.word.length - 1 : w.x);
    maxY = Math.max(maxY, w.direction === 'vertical' ? w.y + w.word.length - 1 : w.y);
  });

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  // Calculate scale to fit within available area on mobile screens
  // Header ~60px, Bottom controls ~340px. Total fixed height ~400px.
  const availableWidth = Math.min(dimensions.width, 448) - 32; // 448px is max-w-md
  const availableHeight = Math.max(150, dimensions.height - 400); 
  
  // Grid logical size in pixels (1rem = 16px, so 3rem = 48px)
  const gridPixelWidth = width * 48;
  const gridPixelHeight = height * 48;

  const scaleX = availableWidth / gridPixelWidth;
  const scaleY = availableHeight / gridPixelHeight;
  const scale = Math.min(1, scaleX, scaleY);

  // Create grid cells
  const cells: { x: number; y: number; letter: string; isRevealed: boolean }[] = [];

  level.words.forEach((w) => {
    const isWordFound = wordsFound.includes(w.word);
    for (let i = 0; i < w.word.length; i++) {
      const x = w.direction === 'horizontal' ? w.x + i : w.x;
      const y = w.direction === 'vertical' ? w.y + i : w.y;
      
      const isRevealed = isWordFound || revealedCells.some((c) => c.x === x && c.y === y);
      
      const existingCell = cells.find((c) => c.x === x && c.y === y);
      if (!existingCell) {
        cells.push({ x, y, letter: w.word[i], isRevealed });
      } else if (isRevealed) {
        existingCell.isRevealed = true;
      }
    }
  });

  return (
    <div className="flex-1 w-full flex items-center justify-center p-2 min-h-0">
      <div 
        className="relative flex items-center justify-center"
        style={{
          width: `${width * 3 * scale}rem`,
          height: `${height * 3 * scale}rem`,
        }}
      >
        <div 
          className="absolute top-0 left-0"
          style={{
            width: `${width * 3}rem`,
            height: `${height * 3}rem`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left'
          }}
        >
          {cells.map((cell, i) => (
          <motion.div
            key={`${cell.x}-${cell.y}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: i * 0.05 }}
            className={clsx(
              "absolute w-11 h-11 flex items-center justify-center rounded-lg shadow-md border-2",
              cell.isRevealed ? "bg-white border-yellow-400 text-slate-800 shadow-[0_0_15px_rgba(253,224,71,0.5)]" : "bg-white/20 border-white/30 backdrop-blur-sm"
            )}
            style={{
              left: `${(cell.x - minX) * 3}rem`,
              top: `${(cell.y - minY) * 3}rem`,
            }}
          >
            {cell.isRevealed && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-2xl font-bold uppercase"
              >
                {cell.letter}
              </motion.span>
            )}
          </motion.div>
        ))}
        </div>
      </div>
    </div>
  );
};
