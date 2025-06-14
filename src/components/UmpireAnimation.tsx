
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface UmpireAnimationProps {
  action: string;
  show: boolean;
}

const UmpireAnimation: React.FC<UmpireAnimationProps> = ({ action, show }) => {
  const getAnimationClass = () => {
    if (!show) return '';
    
    switch (action) {
      case '4':
        return 'animate-four-signal';
      case '6':
        return 'animate-six-signal';
      case 'wide':
        return 'animate-wide-signal';
      case 'noball':
        return 'animate-noball-signal';
      case 'legbye':
        return 'animate-legbye-signal';
      case 'wicket':
        return 'animate-wicket-signal';
      default:
        return 'animate-normal-signal';
    }
  };

  const getUmpireDisplay = () => {
    switch (action) {
      case '4':
        return (
          <div className="text-center">
            <div className="text-9xl animate-bounce mb-4">🧑‍⚖️</div>
            <div className="relative">
              <div className="text-7xl animate-pulse text-orange-500 mb-2">🖐️</div>
              <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block mb-2">
                Waving to boundary
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">BOUNDARY FOUR!</div>
            <div className="text-lg text-gray-600">Right arm extended horizontally</div>
            <div className="mt-4 bg-orange-100 p-3 rounded-lg">
              <div className="text-sm text-orange-700">
                📏 Official Signal: Arm waved towards boundary rope
              </div>
            </div>
          </div>
        );
      case '6':
        return (
          <div className="text-center">
            <div className="text-9xl animate-bounce mb-4">🧑‍⚖️</div>
            <div className="relative">
              <div className="text-7xl animate-spin text-purple-600 mb-2">🙌</div>
              <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block mb-2">
                Both hands raised high
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">MAXIMUM SIX!</div>
            <div className="text-lg text-gray-600">Both arms raised above head</div>
            <div className="mt-4 bg-purple-100 p-3 rounded-lg">
              <div className="text-sm text-purple-700">
                🏏 Official Signal: Both arms raised straight up
              </div>
            </div>
          </div>
        );
      case 'wide':
        return (
          <div className="text-center">
            <div className="text-9xl animate-pulse mb-4">🧑‍⚖️</div>
            <div className="relative">
              <div className="text-7xl animate-ping text-yellow-500 mb-2">🤲</div>
              <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block mb-2">
                Arms extended horizontally
              </div>
            </div>
            <div className="text-3xl font-bold text-yellow-600 mb-2">WIDE BALL!</div>
            <div className="text-lg text-gray-600">Both arms extended sideways</div>
            <div className="mt-4 bg-yellow-100 p-3 rounded-lg">
              <div className="text-sm text-yellow-700">
                ⚠️ Official Signal: Both arms stretched out horizontally
              </div>
            </div>
          </div>
        );
      case 'noball':
        return (
          <div className="text-center">
            <div className="text-9xl animate-bounce mb-4">🧑‍⚖️</div>
            <div className="relative">
              <div className="text-7xl animate-pulse text-red-500 mb-2">☝️</div>
              <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block mb-2">
                One arm raised straight up
              </div>
            </div>
            <div className="text-3xl font-bold text-red-600 mb-2">NO BALL!</div>
            <div className="text-lg text-gray-600">Right arm extended upward</div>
            <div className="mt-4 bg-red-100 p-3 rounded-lg">
              <div className="text-sm text-red-700">
                🚫 Official Signal: One arm raised straight above head
              </div>
            </div>
          </div>
        );
      case 'legbye':
        return (
          <div className="text-center">
            <div className="text-9xl animate-bounce mb-4">🧑‍⚖️</div>
            <div className="relative">
              <div className="text-7xl animate-pulse text-blue-500 mb-2">🦵</div>
              <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block mb-2">
                Touching raised knee
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">LEG BYE!</div>
            <div className="text-lg text-gray-600">Hand touches raised knee</div>
            <div className="mt-4 bg-blue-100 p-3 rounded-lg">
              <div className="text-sm text-blue-700">
                🦵 Official Signal: One hand touching raised knee
              </div>
            </div>
          </div>
        );
      case 'wicket':
        return (
          <div className="text-center">
            <div className="text-9xl animate-bounce mb-4">🧑‍⚖️</div>
            <div className="relative">
              <div className="text-7xl animate-pulse text-red-600 mb-2">👆</div>
              <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block mb-2">
                Index finger raised
              </div>
            </div>
            <div className="text-3xl font-bold text-red-600 mb-2">OUT!</div>
            <div className="text-lg text-gray-600">Index finger pointing upward</div>
            <div className="mt-4 bg-red-100 p-3 rounded-lg">
              <div className="text-sm text-red-700">
                ⚡ Official Signal: Index finger raised decisively
              </div>
            </div>
          </div>
        );
      case 'dot':
        return (
          <div className="text-center">
            <div className="text-9xl mb-4">🧑‍⚖️</div>
            <div className="text-7xl text-gray-500 mb-2">⚫</div>
            <div className="text-2xl font-bold text-gray-600 mb-2">DOT BALL</div>
            <div className="text-lg text-gray-600">No signal - Normal delivery</div>
            <div className="mt-4 bg-gray-100 p-3 rounded-lg">
              <div className="text-sm text-gray-700">
                ⭕ No runs scored from this delivery
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center">
            <div className="text-9xl mb-4">🧑‍⚖️</div>
            <div className="text-3xl font-bold text-green-600 mb-4">READY FOR PLAY!</div>
            <div className="text-lg text-gray-600">Umpire in position</div>
            <div className="mt-4 bg-green-100 p-3 rounded-lg">
              <div className="text-sm text-green-700">
                🏏 International Cricket Umpire ready for the next delivery
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-100 to-green-200 shadow-lg border-green-300 min-h-[400px] flex items-center justify-center">
      <CardContent className="p-8 text-center">
        <div className={`transition-all duration-700 ${getAnimationClass()}`}>
          {getUmpireDisplay()}
        </div>
        {show && (
          <div className="mt-6 text-center">
            <div className="inline-block px-6 py-3 bg-white rounded-full shadow-lg animate-pulse border-2 border-green-300">
              <span className="text-lg font-bold text-green-700">Official Signal Given!</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              As per ICC Cricket Rules & Regulations
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UmpireAnimation;
