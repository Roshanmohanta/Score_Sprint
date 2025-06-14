
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

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
}

interface DismissalDialogProps {
  isOpen: boolean;
  dismissedPlayer: Player | null;
  bowlingTeamPlayers: Player[];
  currentBowler: number;
  onConfirm: (dismissalType: string, dismissedBy?: string) => void;
  onCancel: () => void;
}

const DismissalDialog: React.FC<DismissalDialogProps> = ({
  isOpen,
  dismissedPlayer,
  bowlingTeamPlayers,
  currentBowler,
  onConfirm,
  onCancel
}) => {
  const [dismissalType, setDismissalType] = useState('bowled');
  const [dismissedBy, setDismissedBy] = useState('');

  if (!isOpen || !dismissedPlayer) return null;

  const dismissalTypes = [
    { value: 'bowled', label: 'Bowled', needsFielder: false },
    { value: 'lbw', label: 'LBW', needsFielder: false },
    { value: 'caught', label: 'Caught', needsFielder: true },
    { value: 'hitwicket', label: 'Hit Wicket', needsFielder: false },
    { value: 'runout', label: 'Run Out', needsFielder: true },
    { value: 'stumped', label: 'Stumped', needsFielder: true },
  ];

  const selectedDismissal = dismissalTypes.find(d => d.value === dismissalType);
  const needsFielder = selectedDismissal?.needsFielder || false;

  const handleConfirm = () => {
    if (needsFielder && !dismissedBy) {
      alert('Please select who dismissed the batsman');
      return;
    }
    
    let finalDismissedBy = dismissedBy;
    if (dismissalType === 'bowled' || dismissalType === 'lbw' || dismissalType === 'hitwicket') {
      finalDismissedBy = bowlingTeamPlayers[currentBowler].name;
    }
    
    onConfirm(dismissalType, finalDismissedBy);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="bg-red-600 text-white">
          <CardTitle className="text-center">Wicket Details</CardTitle>
          <p className="text-center text-red-100">
            {dismissedPlayer.name} is out
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">Dismissal Type</Label>
            <select 
              value={dismissalType}
              onChange={(e) => {
                setDismissalType(e.target.value);
                setDismissedBy('');
              }}
              className="w-full p-2 border rounded"
            >
              {dismissalTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {needsFielder && (
            <div className="space-y-2">
              <Label className="font-semibold">
                {dismissalType === 'caught' ? 'Caught by' : 
                 dismissalType === 'runout' ? 'Run out by' : 
                 dismissalType === 'stumped' ? 'Stumped by' : 'Dismissed by'}
              </Label>
              <select 
                value={dismissedBy}
                onChange={(e) => setDismissedBy(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select player</option>
                {bowlingTeamPlayers.map((player, index) => (
                  <option key={index} value={player.name}>
                    {player.name} {index === currentBowler ? '(bowler)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex space-x-4 mt-6">
            <Button 
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DismissalDialog;
