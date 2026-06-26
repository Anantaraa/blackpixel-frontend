import React from 'react';
import { motion } from 'framer-motion';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
