import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Player {
  id: number;
  name: string;
  runs: number;
  ballsFaced: number;
  isOut: boolean;
  oversBowled: number;
  runsConceded: number;
  wicketsTaken: number;
  maidenOvers: number;
}

interface Team {
  name: string;
  players: Player[];
  captain: number;
  viceCaptain: number;
  totalRuns: number;
  totalBalls: number;
  wickets: number;
}

interface MatchControlsProps {
  currentTeam: Team;
  bowlingTeam: Team;
  striker: number;
  currentBatsman1: number;
  currentBatsman2: number;
  currentBowler: number;
  inningsComplete: boolean;
  onSwitchInnings: () => void;
  onBowlerChange: (bowlerIndex: number) => void;
}

const MatchControls: React.FC<MatchControlsProps> = ({
  currentTeam,
  bowlingTeam,
  striker,
  currentBatsman1,
  currentBatsman2,
  currentBowler,
  inningsComplete,
  onSwitchInnings,
  onBowlerChange,
}) => {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-green-700">Match Control</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!inningsComplete && (
          <Button 
            onClick={onSwitchInnings}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Switch Innings
          </Button>
        )}
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Striker:</strong> {currentTeam.players[striker]?.name} (C: {striker === currentTeam.captain ? '👑' : striker === currentTeam.viceCaptain ? '⭐' : ''})</p>
          <p><strong>Non-Striker:</strong> {currentTeam.players[striker === currentBatsman1 ? currentBatsman2 : currentBatsman1]?.name}</p>
          <p><strong>Bowler:</strong> {bowlingTeam.players[currentBowler]?.name}</p>
          <p><strong>Captain:</strong> {bowlingTeam.players[bowlingTeam.captain]?.name} 👑</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Current Bowler:</label>
          <select 
            value={currentBowler} 
            onChange={(e) => onBowlerChange(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          >
            {bowlingTeam.players.map((player, index) => (
              <option key={index} value={index}>
                {player.name} {index === bowlingTeam.captain ? '👑' : index === bowlingTeam.viceCaptain ? '⭐' : ''}
              </option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchControls;
