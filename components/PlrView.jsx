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
      marginTop: '25px',
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)'
    }}>
      <video
        ref={videoRef}
        src="/video.mp4"
        style={{
          width: '100%',
          display: 'block'
        }}
        muted
        playsInline
        onEnded={handleVideoEnded}
      />
    </div>
  );
}
