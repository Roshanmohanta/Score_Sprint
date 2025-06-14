
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ExtrasDialogProps {
  isOpen: boolean;
  extraType: 'wide' | 'noball' | 'legbye' | null;
  onConfirm: (runs: number) => void;
  onCancel: () => void;
}

const ExtrasDialog: React.FC<ExtrasDialogProps> = ({
  isOpen,
  extraType,
  onConfirm,
  onCancel
}) => {
  const [runs, setRuns] = useState(0);

  const handleConfirm = () => {
    onConfirm(runs);
    setRuns(0);
  };

  const getTitle = () => {
    switch (extraType) {
      case 'wide': return '🎯 Wide Ball';
      case 'noball': return '🚫 No Ball';
      case 'legbye': return '🦵 Leg Bye';
      default: return 'Extra Runs';
    }
  };

  const getDescription = () => {
    switch (extraType) {
      case 'wide': return 'Enter additional runs scored on this wide ball';
      case 'noball': return 'Enter runs scored by batsman on this no ball';
      case 'legbye': return 'Enter leg bye runs scored';
      default: return 'Enter extra runs';
    }
  };

  const getColor = () => {
    switch (extraType) {
      case 'wide': return 'from-yellow-400 to-orange-500';
      case 'noball': return 'from-red-400 to-red-600';
      case 'legbye': return 'from-blue-400 to-blue-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className={`bg-gradient-to-r ${getColor()} text-white p-4 -m-6 mb-4 rounded-t-lg`}>
            <DialogTitle className="text-2xl font-bold text-center">
              {getTitle()}
            </DialogTitle>
            <p className="text-center text-white/90 mt-1">{getDescription()}</p>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Runs
            </label>
            <Input
              type="number"
              value={runs}
              onChange={(e) => setRuns(parseInt(e.target.value) || 0)}
              className="text-center text-2xl font-bold h-12"
              min="0"
              max="6"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3, 4, 5, 6].map((num) => (
              <Button
                key={num}
                onClick={() => setRuns(num)}
                variant={runs === num ? "default" : "outline"}
                className="h-12 text-lg font-bold"
              >
                {num}
              </Button>
            ))}
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className={`flex-1 h-12 bg-gradient-to-r ${getColor()} hover:opacity-90`}
            >
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExtrasDialog;
