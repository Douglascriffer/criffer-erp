import React, { useState, useEffect, useRef } from 'react';

export default function PlrView({ darkMode }) {
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => setMounted(true), []);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      if (duration > 0) {
        videoRef.current.playbackRate = duration / 10;
      }
    }
  };

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
        ref={videoRef}
        onLoadedMetadata={handleLoadedMetadata}
        autoPlay 
        loop 
        muted 
        playsInline 
        src="/plr_video_2.mp4" 
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
