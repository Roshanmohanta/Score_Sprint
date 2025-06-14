
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Team {
  name: string;
  totalRuns: number;
  totalBalls: number;
  wickets: number;
}

interface MatchHeaderProps {
  currentTeam: Team;
  bowlingTeam: Team;
  totalOvers: number;
  inningsComplete: boolean;
  team1TotalRuns: number;
  team2TotalRuns: number;
  currentTeamName: 'team1' | 'team2';
}

const MatchHeader: React.FC<MatchHeaderProps> = ({
  currentTeam,
  bowlingTeam,
  totalOvers,
  inningsComplete,
  team1TotalRuns,
  team2TotalRuns,
  currentTeamName
}) => {
  return (
    <Card className="bg-white shadow-lg border-green-200">
      <CardHeader className="text-center bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
        <CardTitle className="text-3xl font-bold">🏏 Live Cricket Match Scorer</CardTitle>
        <p className="text-green-100">
          {inningsComplete ? 'Second Innings' : 'First Innings'} • {totalOvers} Overs Match
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            {currentTeam.name} Batting vs {bowlingTeam.name}
          </h2>
          <div className="text-4xl font-bold text-green-700">
            {currentTeam.totalRuns}/{currentTeam.wickets}
          </div>
          <div className="text-lg text-gray-600">
            Overs: {Math.floor(currentTeam.totalBalls / 6)}.{currentTeam.totalBalls % 6} / {totalOvers}
          </div>
          {inningsComplete && (
            <div className="text-sm text-blue-600 font-medium">
              Target: {currentTeamName === 'team2' ? team1TotalRuns + 1 : 'Set'} runs
              {currentTeamName === 'team2' && ` • Need ${(team1TotalRuns + 1) - team2TotalRuns} runs`}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchHeader;
