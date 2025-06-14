
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ExtrasDialog from './ExtrasDialog';

interface ScoringButtonsProps {
  onScore: (type: string, runs?: number) => void;
}

const ScoringButtons: React.FC<ScoringButtonsProps> = ({ onScore }) => {
  const [showExtrasDialog, setShowExtrasDialog] = useState(false);
  const [extraType, setExtraType] = useState<'wide' | 'noball' | 'legbye' | null>(null);

  const handleExtraClick = (type: 'wide' | 'noball' | 'legbye') => {
    setExtraType(type);
    setShowExtrasDialog(true);
  };

  const handleExtraConfirm = (runs: number) => {
    if (extraType) {
      onScore(extraType, runs);
    }
    setShowExtrasDialog(false);
    setExtraType(null);
  };

  const handleExtraCancel = () => {
    setShowExtrasDialog(false);
    setExtraType(null);
  };

  return (
    <div className="space-y-4">
      {/* Main scoring buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Button 
          onClick={() => onScore('dot')} 
          className="h-12 text-lg bg-purple-600 hover:bg-purple-700 rounded-full"
        >
          0
        </Button>
        <Button 
          onClick={() => onScore('1')} 
          className="h-12 text-lg bg-purple-600 hover:bg-purple-700 rounded-full"
        >
          1
        </Button>
        <Button 
          onClick={() => onScore('2')} 
          className="h-12 text-lg bg-purple-600 hover:bg-purple-700 rounded-full"
        >
          2
        </Button>
        <Button 
          onClick={() => onScore('3')} 
          className="h-12 text-lg bg-purple-600 hover:bg-purple-700 rounded-full"
        >
          3
        </Button>
        <Button 
          onClick={() => onScore('4')} 
          className="h-12 text-lg bg-purple-600 hover:bg-purple-700 rounded-full"
        >
          4
        </Button>
        <Button 
          onClick={() => onScore('6')} 
          className="h-12 text-lg bg-purple-600 hover:bg-purple-700 rounded-full"
        >
          6
        </Button>
      </div>

      {/* Extra buttons */}
      <div className="grid grid-cols-4 gap-2">
        <Button 
          onClick={() => handleExtraClick('wide')}
          className="h-10 text-sm bg-yellow-500 hover:bg-yellow-600 rounded-full"
        >
          Wide
        </Button>
        <Button 
          onClick={() => handleExtraClick('noball')}
          className="h-10 text-sm bg-yellow-500 hover:bg-yellow-600 rounded-full"
        >
          No Ball
        </Button>
        <Button 
          onClick={() => handleExtraClick('legbye')}
          className="h-10 text-sm bg-yellow-500 hover:bg-yellow-600 rounded-full"
        >
          Leg Bye
        </Button>
        <Button 
          onClick={() => onScore('wicket')} 
          className="h-10 text-sm bg-red-600 hover:bg-red-700 rounded-full"
        >
          Wicket
        </Button>
      </div>

      <ExtrasDialog
        isOpen={showExtrasDialog}
        extraType={extraType}
        onConfirm={handleExtraConfirm}
        onCancel={handleExtraCancel}
      />
    </div>
  );
};

export default ScoringButtons;
