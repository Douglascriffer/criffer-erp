"use client";
import React, { useState, useEffect } from 'react';

const frames = [
  "/plr-frames/FRAME A.png",
  "/plr-frames/FRAME B.png",
  "/plr-frames/FRAME C.png",
  "/plr-frames/FRAME D.png",
  "/plr-frames/FRAME E.png",
  "/plr-frames/FRAME F - Final.png",
];

export default function PlrView({ darkMode }) {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    // Play the sequence of frames
    if (currentFrame < frames.length - 1) {
      const timer = setTimeout(() => {
        setCurrentFrame(prev => prev + 1);
      }, 1500); // 1.5 seconds per frame for a smooth transition
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
      background: '#000'
    }}>
      {frames.map((src, index) => (
        <img 
          key={src}
          src={src} 
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: index <= currentFrame ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: index
          }}
          alt={`Frame ${index}`}
        />
      ))}
    </div>
  );
}
