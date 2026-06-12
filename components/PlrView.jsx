import React from 'react';

export default function PlrView() {
  return (
    <div style={{
      width: '100%',
      height: '85vh',
      background: '#040a18',
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      {/* 
        A imagem de fundo. 
        Para funcionar, você precisa salvar a imagem que me mandou 
        dentro da pasta "public" do projeto com o nome "plr-bg.jpg" 
      */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1200px',
        aspectRatio: '16/9',
        backgroundImage: "url('/plr-bg.png')",
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        
        {/* Overlay do Valor Central (Cobrindo o 2.000.000 original) */}
        <div style={{
          position: 'absolute',
          top: '56%',
          left: '50.3%',
          transform: 'translate(-50%, -50%)',
          background: '#0a101d', // Cor de fundo para cobrir o texto original da imagem
          padding: '10px 30px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{
            color: '#ffffff',
            fontSize: '1.8vw',
            fontWeight: 'bold',
            fontFamily: "'Inter', sans-serif"
          }}>
            1.986.520,00
          </span>
        </div>

        {/* Overlay dos Cilindros (se precisar ajustar a porcentagem dinamicamente no futuro) */}
        {/* Cilindro P */}
        <div style={{ position: 'absolute', top: '30%', right: '14%', background: '#0a101d', padding: '4px 10px', borderRadius: '4px' }}>
          <span style={{ color: '#000', fontSize: '1.5vw', fontWeight: 'bold' }}>100%</span>
        </div>
        {/* Cilindro L */}
        <div style={{ position: 'absolute', top: '56%', right: '14%', background: '#0a101d', padding: '4px 10px', borderRadius: '4px' }}>
          <span style={{ color: '#000', fontSize: '1.5vw', fontWeight: 'bold' }}>35%</span>
        </div>
        {/* Cilindro R */}
        <div style={{ position: 'absolute', top: '81%', right: '14%', background: '#0a101d', padding: '4px 10px', borderRadius: '4px' }}>
          <span style={{ color: '#ffffff', fontSize: '1.5vw', fontWeight: 'bold' }}>0%</span>
        </div>

        {/* Mensagem de aviso caso a imagem não exista */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '12px',
          pointerEvents: 'none'
        }}>
          *Salve a imagem como "public/plr-bg.jpg" para que ela apareça aqui.
        </div>
      </div>
    </div>
  );
}
