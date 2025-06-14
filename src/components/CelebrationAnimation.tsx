
import React from 'react';

interface CelebrationAnimationProps {
  show: boolean;
  type: 'four' | 'six' | 'hatrick';
}

const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({ show, type }) => {
  if (!show) return null;

  const getAnimationContent = () => {
    switch (type) {
      case 'four':
        return {
          emoji: '🏏',
          text: 'BOUNDARY!',
          color: 'bg-orange-500',
          animation: 'animate-bounce'
        };
      case 'six':
        return {
          emoji: '🚀',
          text: 'MAXIMUM!',
          color: 'bg-purple-600',
          animation: 'animate-pulse'
        };
      case 'hatrick':
        return {
          emoji: '🎩',
          text: 'HAT-TRICK!',
          color: 'bg-red-600',
          animation: 'animate-spin'
        };
      default:
        return {
          emoji: '🏏',
          text: 'GREAT SHOT!',
          color: 'bg-green-500',
          animation: 'animate-bounce'
        };
    }
  };

  const { emoji, text, color, animation } = getAnimationContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pointer-events-none">
      <div className={`${color} text-white p-8 rounded-full ${animation}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">{emoji}</div>
          <div className="text-3xl font-bold">{text}</div>
        </div>
      </div>
    </div>
  );
};

export default CelebrationAnimation;
