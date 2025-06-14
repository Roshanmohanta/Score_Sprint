import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  fours: number;
  sixes: number;
}

interface Team {
  name: string;
  players: Player[];
  totalRuns: number;
  totalBalls: number;
  wickets: number;
}

interface ScorecardProps {
  team1: Team;
  team2: Team;
  currentTeam: 'team1' | 'team2';
  currentBatsman1: number;
  currentBatsman2: number;
  striker: number;
}

const Scorecard: React.FC<ScorecardProps> = ({ 
  team1, 
  team2, 
  currentTeam, 
  currentBatsman1, 
  currentBatsman2, 
  striker 
}) => {
  const calculateStrikeRate = (runs: number, ballsFaced: number) => {
    if (ballsFaced === 0) return 0;
    return ((runs / ballsFaced) * 100).toFixed(1);
  };

  const getDismissalText = (player: Player) => {
    if (!player.isOut || !player.dismissalType) return '';
    
    switch (player.dismissalType) {
      case 'bowled':
        return `b ${player.dismissedBy}`;
      case 'lbw':
        return `lbw b ${player.dismissedBy}`;
      case 'caught':
        return `c ${player.dismissedBy}`;
      case 'hitwicket':
        return `hit wicket b ${player.dismissedBy}`;
      case 'runout':
        return `run out (${player.dismissedBy})`;
      case 'stumped':
        return `st ${player.dismissedBy}`;
      default:
        return 'out';
    }
  };

  const renderPlayerRow = (player: Player, index: number, team: Team, isCurrentTeam: boolean) => {
    const isBatting = isCurrentTeam && (index === currentBatsman1 || index === currentBatsman2);
    const isStriker = isCurrentTeam && index === striker;
    const isNonStriker = isCurrentTeam && isBatting && !isStriker;
    
    return (
      <tr 
        key={player.id} 
        className={`
          ${isBatting ? 'bg-green-50 border-l-4 border-green-500' : ''}
          ${isStriker ? 'bg-green-100 font-semibold' : ''}
          ${player.isOut ? 'bg-red-50 text-red-800' : ''}
          transition-colors duration-200
        `}
      >
        <td className="px-3 py-2 text-sm">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <span className={isStriker ? 'font-bold' : ''}>{player.name}</span>
              {player.isOut && <span className="text-xs text-red-600 font-semibold">(OUT)</span>}
              {isStriker && (
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded font-bold animate-pulse">
                  ⚡ STRIKER
                </span>
              )}
              {isNonStriker && (
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded font-bold">
                  🏃 NON-STRIKER
                </span>
              )}
            </div>
            {player.isOut && (
              <div className="text-xs text-red-600 italic">
                {getDismissalText(player)}
              </div>
            )}
          </div>
        </td>
        <td className="px-3 py-2 text-sm text-center font-medium">{player.runs}</td>
        <td className="px-3 py-2 text-sm text-center">{player.ballsFaced}</td>
        <td className="px-3 py-2 text-sm text-center">
          <div className="flex flex-col">
            <span>{calculateStrikeRate(player.runs, player.ballsFaced)}</span>
            {(player.fours > 0 || player.sixes > 0) && (
              <span className="text-xs text-gray-500">
                {player.fours > 0 && `${player.fours}×4`}
                {player.fours > 0 && player.sixes > 0 && ', '}
                {player.sixes > 0 && `${player.sixes}×6`}
              </span>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const renderTeamCard = (team: Team, teamKey: 'team1' | 'team2') => {
    const isCurrentTeam = currentTeam === teamKey;
    const runRate = team.totalBalls > 0 ? ((team.totalRuns / team.totalBalls) * 6).toFixed(2) : '0.00';
    
    return (
      <Card className={`shadow-lg ${isCurrentTeam ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
        <CardHeader className={`${isCurrentTeam ? 'bg-green-600 text-white' : 'bg-gray-100'} rounded-t-lg`}>
          <CardTitle className="text-lg flex justify-between items-center">
            <span>{team.name}</span>
            {isCurrentTeam && <span className="text-sm bg-white text-green-600 px-2 py-1 rounded">BATTING</span>}
          </CardTitle>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Score:</span>
              <span className="font-bold">{team.totalRuns}/{team.wickets}</span>
            </div>
            <div className="flex justify-between">
              <span>Overs:</span>
              <span>{Math.floor(team.totalBalls / 6)}.{team.totalBalls % 6}</span>
            </div>
            <div className="flex justify-between">
              <span>Run Rate:</span>
              <span>{runRate}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Runs
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balls
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SR
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {team.players.map((player, index) => 
                  renderPlayerRow(player, index, team, isCurrentTeam)
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-green-700 text-center">📊 Live Scorecard</h3>
      
      {/* Team 1 Scorecard */}
      {renderTeamCard(team1, 'team1')}
      
      {/* Team 2 Scorecard */}
      {renderTeamCard(team2, 'team2')}
      
      {/* Match Summary */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-green-700 text-center">Match Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-600">{team1.name}</div>
              <div className="text-2xl font-bold text-green-600">
                {team1.totalRuns}/{team1.wickets}
              </div>
              <div className="text-xs text-gray-500">
                ({Math.floor(team1.totalBalls / 6)}.{team1.totalBalls % 6} overs)
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-600">{team2.name}</div>
              <div className="text-2xl font-bold text-green-600">
                {team2.totalRuns}/{team2.wickets}
              </div>
              <div className="text-xs text-gray-500">
                ({Math.floor(team2.totalBalls / 6)}.{team2.totalBalls % 6} overs)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scorecard;
