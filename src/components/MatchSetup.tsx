import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Player {
  id: number;
  name: string;
  runs: number;
  ballsFaced: number;
  isOut: boolean;
  dismissalType?: string;
  dismissedBy?: string;
  oversBowled: number;
  runsConceded: number;
  wicketsTaken: number;
  maidenOvers: number;
  consecutiveWickets: number;
  fours: number;
  sixes: number;
}

interface Team {
  name: string;
  players: Player[];
  captain: number;
  viceCaptain: number;
  totalRuns: number;
  totalBalls: number;
  wickets: number;
  extras: number;
}

interface MatchSetupProps {
  onMatchStart: (data: {
    team1: Team;
    team2: Team;
    totalOvers: number;
    battingFirst: 'team1' | 'team2';
    team1OpeningBatsmen: [number, number];
    team2OpeningBatsmen: [number, number];
  }) => void;
}

const MatchSetup: React.FC<MatchSetupProps> = ({ onMatchStart }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [team1Name, setTeam1Name] = useState('Team 1');
  const [team2Name, setTeam2Name] = useState('Team 2');
  const [totalOvers, setTotalOvers] = useState(20);
  const [team1Players, setTeam1Players] = useState<string[]>(
    Array.from({ length: 11 }, (_, i) => `Player ${i + 1}`)
  );
  const [team2Players, setTeam2Players] = useState<string[]>(
    Array.from({ length: 11 }, (_, i) => `Player ${i + 1}`)
  );
  const [team1Captain, setTeam1Captain] = useState<number>(0);
  const [team2Captain, setTeam2Captain] = useState<number>(0);
  const [team1OpeningBatsman1, setTeam1OpeningBatsman1] = useState<number>(0);
  const [team1OpeningBatsman2, setTeam1OpeningBatsman2] = useState<number>(1);
  const [team2OpeningBatsman1, setTeam2OpeningBatsman1] = useState<number>(0);
  const [team2OpeningBatsman2, setTeam2OpeningBatsman2] = useState<number>(1);
  const [battingFirst, setBattingFirst] = useState<'team1' | 'team2'>('team1');

  useEffect(() => {
    const audio = new Audio('/gta-4-theme-(slowed)-made-with-Voicemod.mp3');
    audio.loop = true;
    audio.volume = 0.5; // Set volume to 50%
    audioRef.current = audio;

    const handleUserInteraction = async () => {
      if (audioRef.current && audioRef.current.paused) {
        try {
          await audioRef.current.play();
          console.log('Audio playback started after user interaction.');
          // Remove the listener once audio starts playing
          document.removeEventListener('click', handleUserInteraction);
          document.removeEventListener('keydown', handleUserInteraction);
        } catch (error) {
          console.error('Audio playback failed on user interaction:', error);
        }
      }
    };

    // Add event listeners for common user interactions
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  const handlePlayerChange = (teamNumber: number, playerIndex: number, value: string) => {
    if (teamNumber === 1) {
      const newPlayers = [...team1Players];
      newPlayers[playerIndex] = value;
      setTeam1Players(newPlayers);
    } else {
      const newPlayers = [...team2Players];
      newPlayers[playerIndex] = value;
      setTeam2Players(newPlayers);
    }
  };

  const createTeam = (name: string, players: string[], captain: number): Team => ({
    name,
    players: players.map((playerName, index) => ({
      id: index,
      name: playerName,
      runs: 0,
      ballsFaced: 0,
      isOut: false,
      oversBowled: 0,
      runsConceded: 0,
      wicketsTaken: 0,
      maidenOvers: 0,
      consecutiveWickets: 0,
      fours: 0,
      sixes: 0
    })),
    captain,
    viceCaptain: captain === 0 ? 1 : 0,
    totalRuns: 0,
    totalBalls: 0,
    wickets: 0,
    extras: 0
  });

  const handleStartMatch = () => {
    // Stop the music when match starts
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (team1OpeningBatsman1 === team1OpeningBatsman2) {
      alert(`Please select two different opening batsmen for ${team1Name}`);
      return;
    }
    if (team2OpeningBatsman1 === team2OpeningBatsman2) {
      alert(`Please select two different opening batsmen for ${team2Name}`);
      return;
    }

    const team1 = createTeam(team1Name, team1Players, team1Captain);
    const team2 = createTeam(team2Name, team2Players, team2Captain);

    onMatchStart({
      team1,
      team2,
      totalOvers,
      battingFirst,
      team1OpeningBatsmen: [team1OpeningBatsman1, team1OpeningBatsman2],
      team2OpeningBatsmen: [team2OpeningBatsman1, team2OpeningBatsman2]
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-orange-900/90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        ></div>
        <div 
          className="absolute top-0 right-0 w-1/2 h-full bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')`
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center py-8 px-4">
          <div className="animate-bounce mb-4">
            <span className="text-8xl md:text-9xl">🏏</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
            Cricket Scorer Pro
          </h1>
          <p className="text-lg md:text-xl text-orange-200 drop-shadow-lg">
            Professional Cricket Match Scoring System
          </p>
          <div className="flex justify-center items-center space-x-4 mt-6">
            <div className="flex items-center space-x-2 text-yellow-300">
              <span className="text-2xl">⚡</span>
              <span className="font-semibold">Live Scoring</span>
            </div>
            <div className="flex items-center space-x-2 text-green-300">
              <span className="text-2xl">📊</span>
              <span className="font-semibold">Detailed Stats</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-300">
              <span className="text-2xl">🎯</span>
              <span className="font-semibold">Professional</span>
            </div>
          </div>
        </div>

        {/* Setup Form */}
        <div className="flex-1 flex items-center justify-center px-4 pb-8">
          <Card className="w-full max-w-6xl bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl md:text-3xl font-bold flex items-center justify-center">
                <span className="text-3xl mr-3">🏆</span>
                Match Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-8">
              {/* Match Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="team1" className="text-lg font-semibold text-gray-700">Team 1 Name</Label>
                  <Input
                    id="team1"
                    value={team1Name}
                    onChange={(e) => setTeam1Name(e.target.value)}
                    className="text-lg p-3 border-2 border-orange-200 focus:border-orange-500"
                    placeholder="Enter team 1 name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team2" className="text-lg font-semibold text-gray-700">Team 2 Name</Label>
                  <Input
                    id="team2"
                    value={team2Name}
                    onChange={(e) => setTeam2Name(e.target.value)}
                    className="text-lg p-3 border-2 border-orange-200 focus:border-orange-500"
                    placeholder="Enter team 2 name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overs" className="text-lg font-semibold text-gray-700">Total Overs</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTotalOvers(prev => Math.max(1, prev - 1))}
                      className="h-12 w-12 text-xl border-2 border-orange-200 hover:border-orange-500"
                    >
                      -
                    </Button>
                    <Input
                      id="overs"
                      type="number"
                      value={totalOvers}
                      onChange={(e) => setTotalOvers(parseInt(e.target.value) || 20)}
                      className="text-lg p-3 border-2 border-orange-200 focus:border-orange-500 text-center w-24"
                      min="1"
                      max="50"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTotalOvers(prev => Math.min(50, prev + 1))}
                      className="h-12 w-12 text-xl border-2 border-orange-200 hover:border-orange-500"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-lg font-semibold text-gray-700">Batting First</Label>
                  <Select value={battingFirst} onValueChange={(value: 'team1' | 'team2') => setBattingFirst(value)}>
                    <SelectTrigger className="text-lg p-3 border-2 border-orange-200 focus:border-orange-500">
                      <SelectValue placeholder="Select batting team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team1">{team1Name}</SelectItem>
                      <SelectItem value="team2">{team2Name}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Teams Setup */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Team 1 Players */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-orange-600 border-b-2 border-orange-200 pb-2">
                    🏏 {team1Name} Players
                  </h3>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-600">Team Captain</Label>
                    <Select value={team1Captain.toString()} onValueChange={(value) => setTeam1Captain(parseInt(value))}>
                      <SelectTrigger className="border-orange-200 focus:border-orange-500">
                        <SelectValue placeholder="Select captain" />
                      </SelectTrigger>
                      <SelectContent>
                        {team1Players.map((player, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {index + 1}. {player}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                    {team1Players.map((player, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className={`w-8 h-8 ${index === team1Captain ? 'bg-yellow-500' : 'bg-orange-500'} text-white rounded-full flex items-center justify-center font-bold text-sm`}>
                          {index === team1Captain ? 'C' : index + 1}
                        </span>
                        <Input
                          value={player}
                          onChange={(e) => handlePlayerChange(1, index, e.target.value)}
                          className="flex-1 border-orange-200 focus:border-orange-500"
                          placeholder={`Player ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team 2 Players */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-blue-600 border-b-2 border-blue-200 pb-2">
                    🏏 {team2Name} Players
                  </h3>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-600">Team Captain</Label>
                    <Select value={team2Captain.toString()} onValueChange={(value) => setTeam2Captain(parseInt(value))}>
                      <SelectTrigger className="border-blue-200 focus:border-blue-500">
                        <SelectValue placeholder="Select captain" />
                      </SelectTrigger>
                      <SelectContent>
                        {team2Players.map((player, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {index + 1}. {player}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                    {team2Players.map((player, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className={`w-8 h-8 ${index === team2Captain ? 'bg-yellow-500' : 'bg-blue-500'} text-white rounded-full flex items-center justify-center font-bold text-sm`}>
                          {index === team2Captain ? 'C' : index + 1}
                        </span>
                        <Input
                          value={player}
                          onChange={(e) => handlePlayerChange(2, index, e.target.value)}
                          className="flex-1 border-blue-200 focus:border-blue-500"
                          placeholder={`Player ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Opening Batsmen Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Team 1 Opening Batsmen */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border-2 border-orange-200">
                  <h3 className="text-xl font-bold text-orange-700 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🏏</span>
                    {team1Name} Opening Batsmen
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-gray-700">Opening Batsman 1</Label>
                      <Select value={team1OpeningBatsman1.toString()} onValueChange={(value) => setTeam1OpeningBatsman1(parseInt(value))}>
                        <SelectTrigger className="border-2 border-orange-200 focus:border-orange-500">
                          <SelectValue placeholder="Select first batsman" />
                        </SelectTrigger>
                        <SelectContent>
                          {team1Players.map((player, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {index + 1}. {player} {index === team1Captain && '(C)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-gray-700">Opening Batsman 2</Label>
                      <Select value={team1OpeningBatsman2.toString()} onValueChange={(value) => setTeam1OpeningBatsman2(parseInt(value))}>
                        <SelectTrigger className="border-2 border-orange-200 focus:border-orange-500">
                          <SelectValue placeholder="Select second batsman" />
                        </SelectTrigger>
                        <SelectContent>
                          {team1Players.map((player, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {index + 1}. {player} {index === team1Captain && '(C)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Team 2 Opening Batsmen */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🏏</span>
                    {team2Name} Opening Batsmen
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-gray-700">Opening Batsman 1</Label>
                      <Select value={team2OpeningBatsman1.toString()} onValueChange={(value) => setTeam2OpeningBatsman1(parseInt(value))}>
                        <SelectTrigger className="border-2 border-blue-200 focus:border-blue-500">
                          <SelectValue placeholder="Select first batsman" />
                        </SelectTrigger>
                        <SelectContent>
                          {team2Players.map((player, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {index + 1}. {player} {index === team2Captain && '(C)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-gray-700">Opening Batsman 2</Label>
                      <Select value={team2OpeningBatsman2.toString()} onValueChange={(value) => setTeam2OpeningBatsman2(parseInt(value))}>
                        <SelectTrigger className="border-2 border-blue-200 focus:border-blue-500">
                          <SelectValue placeholder="Select second batsman" />
                        </SelectTrigger>
                        <SelectContent>
                          {team2Players.map((player, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {index + 1}. {player} {index === team2Captain && '(C)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <div className="text-center pt-6">
                <Button
                  onClick={handleStartMatch}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <span className="text-2xl mr-3">🚀</span>
                  Start Cricket Match
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MatchSetup;
