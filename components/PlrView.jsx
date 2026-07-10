"use client";
import React, { useRef, useEffect } from 'react';

export default function PlrView({ darkMode }) {
  const videoRef = useRef(null);

  const handleVideoEnded = () => {
    // Aguarda 4 segundos e então reinicia o vídeo
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(e => console.error("Falha ao iniciar o vídeo:", e));
      }
    }, 4000);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.error("Autoplay bloqueado:", e));
    }
  }, []);

  return (
    <div style={{
      width: '100%',
      margin: '15px auto 0',
      aspectRatio: '16/9',
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      background: '#000',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)'
    }}>
      <video
        ref={videoRef}
        src="/video.mp4"
        style={{
          width: 'calc(100% + 8px)',
          marginLeft: '-8px',
          height: '100%',
          maxHeight: 'calc(100vh - 120px)',
          objectFit: 'fill'
        }}
        muted
        playsInline
        onEnded={handleVideoEnded}
      />
    </div>
  );
}
