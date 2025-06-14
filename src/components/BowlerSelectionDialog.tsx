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
  totalBallsBowled: number;
}

interface BowlerSelectionDialogProps {
  isOpen: boolean;
  availableBowlers: Player[];
  onSelect: (bowlerIndex: number) => void;
  onCancel: () => void;
}

const BowlerSelectionDialog: React.FC<BowlerSelectionDialogProps> = ({
  isOpen,
  availableBowlers,
  onSelect,
  onCancel
}) => {
  const [selectedBowler, setSelectedBowler] = useState<number | null>(null);

  const formatOvers = (totalBalls: number) => {
    const completeOvers = Math.floor(totalBalls / 6);
    const ballsInCurrentOver = totalBalls % 6;
    return `${completeOvers}.${ballsInCurrentOver}`;
  };

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedBowler !== null) {
      onSelect(selectedBowler);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-center">Select Next Bowler</CardTitle>
          <p className="text-center text-blue-100">Over completed - Choose new bowler</p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">Available Bowlers</Label>
            <div className="space-y-2">
              {availableBowlers.map((bowler, index) => (
                <label key={bowler.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="nextBowler"
                    value={bowler.id}
                    onChange={() => setSelectedBowler(bowler.id)}
                    className="form-radio"
                  />
                  <span>{bowler.name}</span>
                  <span className="text-sm text-gray-500">
                    ({formatOvers(bowler.totalBallsBowled)} overs, 
                    {bowler.wicketsTaken} wickets)
                  </span>
                </label>
              ))}
            </div>
          </div>

          {availableBowlers.length === 0 && (
            <p className="text-center text-gray-500">No bowlers available</p>
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
              disabled={selectedBowler === null || availableBowlers.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BowlerSelectionDialog;
