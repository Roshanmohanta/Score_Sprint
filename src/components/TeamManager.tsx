
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
  totalRuns: number;
  totalBalls: number;
  wickets: number;
}

interface TeamManagerProps {
  team1: Team;
  team2: Team;
  setTeam1: (team: Team) => void;
  setTeam2: (team: Team) => void;
}

const TeamManager: React.FC<TeamManagerProps> = ({ team1, team2, setTeam1, setTeam2 }) => {
  const [editingTeam, setEditingTeam] = useState<'team1' | 'team2' | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null); // Changed to string to handle team1_0, team2_1 etc
  const [tempName, setTempName] = useState('');
  const [expandedTeam, setExpandedTeam] = useState<'team1' | 'team2' | null>(null);

  const updateTeamName = (teamKey: 'team1' | 'team2', newName: string) => {
    if (teamKey === 'team1') {
      setTeam1({ ...team1, name: newName });
    } else {
      setTeam2({ ...team2, name: newName });
    }
    setEditingTeam(null);
  };

  const updatePlayerName = (teamKey: 'team1' | 'team2', playerIndex: number, newName: string) => {
    const team = teamKey === 'team1' ? team1 : team2;
    const updatedPlayers = [...team.players];
    updatedPlayers[playerIndex] = { ...updatedPlayers[playerIndex], name: newName };
    
    const updatedTeam = { ...team, players: updatedPlayers };
    
    if (teamKey === 'team1') {
      setTeam1(updatedTeam);
    } else {
      setTeam2(updatedTeam);
    }
    
    setEditingPlayer(null);
  };

  const startEditingTeam = (teamKey: 'team1' | 'team2') => {
    setEditingTeam(teamKey);
    setTempName(teamKey === 'team1' ? team1.name : team2.name);
  };

  const startEditingPlayer = (teamKey: 'team1' | 'team2', playerIndex: number, currentName: string) => {
    setEditingPlayer(`${teamKey}_${playerIndex}`);
    setTempName(currentName);
  };

  const toggleTeamExpansion = (teamKey: 'team1' | 'team2') => {
    setExpandedTeam(expandedTeam === teamKey ? null : teamKey);
  };

  const renderTeamEditor = (team: Team, teamKey: 'team1' | 'team2') => {
    const isExpanded = expandedTeam === teamKey;
    const displayPlayers = isExpanded ? team.players : team.players.slice(0, 3);
    
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-700 flex items-center justify-between">
            {editingTeam === teamKey ? (
              <div className="flex items-center space-x-2 w-full">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && updateTeamName(teamKey, tempName)}
                />
                <Button 
                  size="sm" 
                  onClick={() => updateTeamName(teamKey, tempName)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  ✓
                </Button>
              </div>
            ) : (
              <>
                <span>{team.name}</span>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => startEditingTeam(teamKey)}
                    className="text-xs"
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => toggleTeamExpansion(teamKey)}
                    className="text-xs"
                  >
                    {isExpanded ? 'Collapse' : 'View All'}
                  </Button>
                </div>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {displayPlayers.map((player, index) => (
            <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              {editingPlayer === `${teamKey}_${index}` ? (
                <div className="flex items-center space-x-2 w-full">
                  <span className="text-xs text-gray-500 w-6">{index + 1}.</span>
                  <Input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="flex-1 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && updatePlayerName(teamKey, index, tempName)}
                  />
                  <Button 
                    size="sm" 
                    onClick={() => updatePlayerName(teamKey, index, tempName)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    ✓
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-xs text-gray-500 w-6">{index + 1}.</span>
                    <span className="text-sm font-medium">{player.name}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => startEditingPlayer(teamKey, index, player.name)}
                    className="text-xs h-6 px-2"
                  >
                    ✏️
                  </Button>
                </>
              )}
            </div>
          ))}
          {!isExpanded && team.players.length > 3 && (
            <div className="text-xs text-gray-500 text-center pt-2">
              +{team.players.length - 3} more players
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-green-700 text-center">🏏 Team & Player Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderTeamEditor(team1, 'team1')}
        <Separator />
        {renderTeamEditor(team2, 'team2')}
        
        <div className="text-xs text-gray-500 text-center mt-4 p-3 bg-blue-50 rounded">
          💡 Tip: Click "Edit" to change team names, "View All" to see all 11 players, or ✏️ to edit individual player names.
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamManager;
