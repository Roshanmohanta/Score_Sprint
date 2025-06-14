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

interface BatsmanSelectionDialogProps {
  isOpen: boolean;
  availablePlayers: Player[];
  onSelect: (playerIndex: number) => void;
  onCancel: () => void;
}

const BatsmanSelectionDialog: React.FC<BatsmanSelectionDialogProps> = ({
  isOpen,
  availablePlayers,
  onSelect,
  onCancel
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedPlayer !== null) {
      onSelect(selectedPlayer);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="bg-green-600 text-white">
          <CardTitle className="text-center">Select Next Batsman</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">Available Players</Label>
            <div className="space-y-2">
              {availablePlayers.map((player, index) => {
                const actualIndex = availablePlayers.indexOf(player);
                return (
                  <label key={player.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="nextBatsman"
                      value={player.id}
                      onChange={() => setSelectedPlayer(player.id)}
                      className="form-radio"
                    />
                    <span>{player.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {availablePlayers.length === 0 && (
            <p className="text-center text-gray-500">No more batsmen available</p>
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
              disabled={selectedPlayer === null || availablePlayers.length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatsmanSelectionDialog;
