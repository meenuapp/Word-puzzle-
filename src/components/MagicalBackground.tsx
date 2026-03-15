import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const MagicalBackground = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    // Generate random particles only on client to avoid hydration mismatch if SSR was used
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      delay: Math.random() * 10,
      duration: Math.random() * 10 + 15, // 15-25s
      size: Math.random() * 4 + 2, // 2-6px
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bottom-0 bg-yellow-200 rounded-full"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            boxShadow: `0 0 ${p.size * 2}px ${p.size / 2}px rgba(253, 224, 71, 0.6)`,
          }}
          initial={{
            y: 100,
            opacity: 0,
            x: 0,
          }}
          animate={{
            y: -window.innerHeight - 100,
            opacity: [0, 0.8, 1, 0.8, 0],
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};
