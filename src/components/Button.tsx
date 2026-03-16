import React from 'react';
import { motion } from 'motion/react';
import { useSound } from '../context/SoundContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className, ...props }) => {
  const { playSound } = useSound();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound();
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
};
