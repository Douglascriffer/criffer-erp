"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const frames = [
  "/plr-frames/FRAME A.png",
  "/plr-frames/FRAME B.png",
  "/plr-frames/FRAME C.png",
  "/plr-frames/FRAME D.png",
  "/plr-frames/FRAME E.png",
  "/plr-frames/FRAME F - Final.png",
];

const slideVariants = {
  enter: {
    opacity: 0,
    scale: 1.05,
    clipPath: "inset(0 100% 0 0)"
  },
  center: {
    zIndex: 1,
    opacity: 1,
    scale: 1,
    clipPath: "inset(0 0% 0 0)",
    transition: {
      opacity: { duration: 0.8 },
      scale: { duration: 1.5, ease: "easeOut" },
      clipPath: { duration: 1.2, ease: [0.45, 0, 0.55, 1] }
    }
  },
  exit: {
    zIndex: 0,
    opacity: 0,
    transition: {
      opacity: { duration: 0.8 }
    }
  }
};

export default function PlrView({ darkMode }) {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    // Play the sequence of frames
    if (currentFrame < frames.length - 1) {
      const timer = setTimeout(() => {
        setCurrentFrame(prev => prev + 1);
      }, 2000); // 2 seconds per frame to appreciate the cinematic transition
      return () => clearTimeout(timer);
    }
  }, [currentFrame]);

  return (
    <div style={{
      width: '100%',
      aspectRatio: '16/9',
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      background: '#040814',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)'
    }}>
      <AnimatePresence mode="popLayout">
        <motion.img 
          key={currentFrame}
          src={frames[currentFrame]} 
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            objectFit: 'cover'
          }}
          alt={`Frame ${currentFrame}`}
        />
      </AnimatePresence>
    </div>
  );
}
