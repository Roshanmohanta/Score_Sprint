import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  totalBallsBowled: number;
}

interface Team {
  name: string;
  players: Player[];
  totalRuns: number;
  totalBalls: number;
  wickets: number;
}

interface BowlingStatsProps {
  team1: Team;
  team2: Team;
  currentTeam: 'team1' | 'team2';
  currentBowler: number;
}

const BowlingStats: React.FC<BowlingStatsProps> = ({ 
  team1, 
  team2, 
  currentTeam, 
  currentBowler 
}) => {
  const getBowlingTeam = () => currentTeam === 'team1' ? team2 : team1;
  const getBattingTeam = () => currentTeam === 'team1' ? team1 : team2;

  const calculateEconomy = (runs: number, totalBalls: number) => {
    if (totalBalls === 0) return '0.00';
    const overs = Math.floor(totalBalls / 6) + (totalBalls % 6) / 6;
    return (runs / overs).toFixed(2);
  };

  const formatOvers = (totalBalls: number) => {
    const completeOvers = Math.floor(totalBalls / 6);
    const ballsInCurrentOver = totalBalls % 6;
    return `${completeOvers}.${ballsInCurrentOver}`;
  };

  const renderBowlerRow = (player: Player, index: number, isCurrentBowler: boolean) => {
    return (
      <tr 
        key={player.id} 
        className={`
          ${isCurrentBowler ? 'bg-red-50 border-l-4 border-red-500 font-semibold' : ''}
          transition-colors duration-200
        `}
      >
        <td className="px-3 py-2 text-sm">
          <div className="flex items-center space-x-2">
            <span className={isCurrentBowler ? 'font-bold' : ''}>{player.name}</span>
            {isCurrentBowler && (
              <span className="text-xs bg-red-600 text-white px-2 py-1 rounded animate-pulse">
                🎳 BOWLING
              </span>
            )}
          </div>
        </td>
        <td className="px-3 py-2 text-sm text-center">{formatOvers(player.totalBallsBowled)}</td>
        <td className="px-3 py-2 text-sm text-center">{player.maidenOvers}</td>
        <td className="px-3 py-2 text-sm text-center font-medium">{player.runsConceded}</td>
        <td className="px-3 py-2 text-sm text-center font-medium text-red-600">{player.wicketsTaken}</td>
        <td className="px-3 py-2 text-sm text-center">{calculateEconomy(player.runsConceded, player.totalBallsBowled)}</td>
      </tr>
    );
  };

  const renderBowlingCard = (team: Team, isBowlingTeam: boolean) => {
    return (
      <Card className={`shadow-lg ${isBowlingTeam ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
        <CardHeader className={`${isBowlingTeam ? 'bg-red-600 text-white' : 'bg-gray-100'} rounded-t-lg`}>
          <CardTitle className="text-lg flex justify-between items-center">
            <span>{team.name} Bowling</span>
            {isBowlingTeam && <span className="text-sm bg-white text-red-600 px-2 py-1 rounded">BOWLING</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bowler
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overs
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Maidens
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Runs
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wickets
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Economy
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {team.players.map((player, index) => 
                  renderBowlerRow(player, index, isBowlingTeam && index === currentBowler)
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
      <h3 className="text-xl font-bold text-red-700 text-center">🎳 Bowling Statistics</h3>
      
      {/* Current Bowling Team */}
      {renderBowlingCard(getBowlingTeam(), true)}
      
      {/* Other Team */}
      {renderBowlingCard(getBattingTeam(), false)}
      
      {/* Bowling Summary */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-red-700 text-center">Bowling Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="text-center p-4 bg-red-50 rounded">
              <div className="font-semibold text-gray-600">{getBowlingTeam().name}</div>
              <div className="text-2xl font-bold text-red-600">
                {getBowlingTeam().players.reduce((sum, p) => sum + p.wicketsTaken, 0)} Wickets
              </div>
              <div className="text-xs text-gray-500">
                {getBowlingTeam().players.reduce((sum, p) => sum + p.runsConceded, 0)} Runs Conceded
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="font-semibold text-gray-600">Current Bowler</div>
              <div className="text-xl font-bold text-gray-800">
                {getBowlingTeam().players[currentBowler]?.name}
              </div>
              <div className="text-xs text-gray-500">
                {getBowlingTeam().players[currentBowler]?.wicketsTaken}-{getBowlingTeam().players[currentBowler]?.runsConceded} 
                ({formatOvers(getBowlingTeam().players[currentBowler]?.totalBallsBowled || 0)} overs)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BowlingStats;
