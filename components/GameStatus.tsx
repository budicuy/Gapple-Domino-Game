
import React, { useEffect, useState } from 'react';

interface GameStatusProps {
  message: string;
}

const GameStatus: React.FC<GameStatusProps> = ({ message }) => {
  const [visible, setVisible] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(message);

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      setVisible(true);
      
      const timer = setTimeout(() => {
        if (!message.toLowerCase().includes('giliran') && !message.toLowerCase().includes('menang')) {
            setVisible(false);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message]);

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 transition-all duration-500 z-50 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'}`}>
      <div className="status-message bg-gray-900/80 backdrop-blur-md text-cyan-200 font-semibold px-6 py-3 rounded-lg shadow-lg border border-cyan-500/30">
        <p>{displayMessage}</p>
      </div>
    </div>
  );
};

export default GameStatus;
