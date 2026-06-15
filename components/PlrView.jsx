import React, { useState, useEffect } from 'react';


export default function PlrView({ darkMode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;



  return (
    <div style={{
      width: '100%',
      minHeight: '85vh',
      background: '#020617', // Very dark blue/black
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '2px solid rgba(255,106,34,0.2)',
      boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.5)',
      fontFamily: "'Inter', 'Gotham', sans-serif",
      color: '#ffffff'
    }}>
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        src="/plr_video.mp4" 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          zIndex: 1,
          opacity: 0.8
        }} 
      />

    </div>
  );
}
