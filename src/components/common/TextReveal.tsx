import React from 'react';
import { motion } from 'framer-motion';
import { EASE } from '../../utils/animations';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

/**
 * Character-by-character "crystallization" reveal.
 * Each letter fades in and rises from below, staggered —
 * like pixels rendering into a scene. The aria-label on the
 * wrapper ensures screen readers read the full word, not letters.
 */
const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  delay = 0,
  stagger = 0.045,
}) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const charVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.65, ease: EASE },
    },
  };

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={charVariants}
          style={{ display: 'inline-block' }}
          aria-hidden="true"
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default TextReveal;
