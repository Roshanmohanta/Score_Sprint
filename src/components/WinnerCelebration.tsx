import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Team {
  name: string;
  players: any[];
  captain: number;
  viceCaptain: number;
  totalRuns: number;
  totalBalls: number;
  wickets: number;
}

interface WinnerCelebrationProps {
  winner: Team;
  loser: Team;
  margin: string;
  onNewMatch: () => void;
}

const WinnerCelebration: React.FC<WinnerCelebrationProps> = ({ 
  winner, 
  loser, 
  margin, 
  onNewMatch 
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Set volume to 50%
      audioRef.current.play().catch(error => {
        console.error('Audio playback failed in WinnerCelebration:', error);
      });
    }

    // Cleanup function to stop music when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-4 flex items-center justify-center">
      <audio ref={audioRef} src="/_Ipl_Slow_Motion_Music_Ringtone_(by Fringster.com).mp3" autoPlay loop controls style={{position:'absolute',left:'-9999px', opacity:0}}/>
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Fireworks Animation */}
        <div className="relative">
          <div className="text-9xl animate-bounce mb-4">🎆</div>
          <div className="absolute top-0 left-1/4 text-6xl animate-pulse delay-300">✨</div>
          <div className="absolute top-0 right-1/4 text-6xl animate-pulse delay-700">🎉</div>
          <div className="absolute top-8 left-1/3 text-4xl animate-bounce delay-500">⭐</div>
          <div className="absolute top-8 right-1/3 text-4xl animate-bounce delay-900">🌟</div>
        </div>

        {/* Winner Announcement */}
        <Card className="shadow-2xl border-4 border-yellow-400 bg-gradient-to-br from-yellow-100 to-orange-100">
          <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardTitle className="text-4xl font-bold animate-pulse">
              🏆 MATCH WINNER! 🏆
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="text-6xl font-bold text-orange-600 animate-bounce">
              {winner.name}
            </div>
            
            <div className="text-2xl text-gray-700 font-semibold">
              Won  {margin}
            </div>

            {/* Trophy Animation */}
            <div className="text-8xl animate-spin-slow">🏆</div>

            {/* Captain Celebration */}
            <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-300">
              <div className="text-xl font-semibold text-gray-700 mb-2">
                Captain's Victory! 🎖️
              </div>
              <div className="text-lg text-gray-600">
                {winner.players[winner.captain]?.name} leads {winner.name} to victory!
              </div>
            </div>

            {/* Match Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                <div className="text-lg font-bold text-green-700">{winner.name}</div>
                <div className="text-2xl font-bold text-green-600">
                  {winner.totalRuns}/{winner.wickets}
                </div>
                <div className="text-sm text-gray-600">
                  ({Math.floor(winner.totalBalls / 6)}.{winner.totalBalls % 6} overs)
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300">
                <div className="text-lg font-bold text-red-700">{loser.name}</div>
                <div className="text-2xl font-bold text-red-600">
                  {loser.totalRuns}/{loser.wickets}
                </div>
                <div className="text-sm text-gray-600">
                  ({Math.floor(loser.totalBalls / 6)}.{loser.totalBalls % 6} overs)
                </div>
              </div>
            </div>

            {/* Celebration Messages */}
            <div className="space-y-4 mt-8">
              <div className="text-6xl animate-bounce delay-200">🎊</div>
              <div className="text-lg text-gray-700 animate-fade-in">
                "Outstanding performance by {winner.name}!"
              </div>
              <div className="text-lg text-gray-700 animate-fade-in delay-500">
                "A match to remember! 🏏"
              </div>
            </div>

            {/* Player of the Match (Top scorer) */}
            <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-300 mt-6">
              <div className="text-xl font-bold text-purple-700 mb-2">
                🌟 Player of the Match 🌟
              </div>
              <div className="text-lg text-purple-600">
                {winner.players.reduce((top, player) => 
                  player.runs > top.runs ? player : top, winner.players[0]
                )?.name}
              </div>
              <div className="text-sm text-gray-600">
                {winner.players.reduce((top, player) => 
                  player.runs > top.runs ? player : top, winner.players[0]
                )?.runs} runs
              </div>
            </div>

            <Button 
              onClick={onNewMatch}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-xl py-4 px-8 animate-pulse"
            >
              🆕 Start New Match
            </Button>
          </CardContent>
        </Card>

        {/* Animated Emojis */}
        <div className="flex justify-center space-x-8 text-4xl">
          <span className="animate-bounce">🎉</span>
          <span className="animate-bounce delay-200">🎊</span>
          <span className="animate-bounce delay-400">🏆</span>
          <span className="animate-bounce delay-600">🥇</span>
          <span className="animate-bounce delay-800">🎖️</span>
        </div>
      </div>
    </div>
  );
};

export default WinnerCelebration;
