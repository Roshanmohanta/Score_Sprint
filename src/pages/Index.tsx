import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Scorecard from '@/components/Scorecard';
import BowlingStats from '@/components/BowlingStats';
import MatchSetup from '@/components/MatchSetup';
import WinnerCelebration from '@/components/WinnerCelebration';
import MatchHeader from '@/components/MatchHeader';
import MatchControls from '@/components/MatchControls';
import ScoringButtons from '@/components/ScoringButtons';
import DismissalDialog from '@/components/DismissalDialog';
import BatsmanSelectionDialog from '@/components/BatsmanSelectionDialog';
import BowlerSelectionDialog from '@/components/BowlerSelectionDialog';
import CelebrationAnimation from '@/components/CelebrationAnimation';
import { useMatchState } from '@/hooks/useMatchState';
import { useScoringLogic } from '@/hooks/useScoringLogic';

const Index = () => {
  const {
    matchStarted,
    matchEnded,
    totalOvers,
    inningsComplete,
    winner,
    loser,
    margin,
    team1,
    team2,
    currentTeam,
    currentBatsman1,
    currentBatsman2,
    striker,
    currentBowler,
    setStriker,
    setCurrentBowler,
    getCurrentTeam,
    getBowlingTeam,
    setCurrentTeamData,
    setBowlingTeamData,
    handleMatchStart,
    handleNewMatch,
    switchInnings,
    replaceOutBatsman,
    handleDismissal,
    endMatch,
  } = useMatchState();

  const [showDismissalDialog, setShowDismissalDialog] = useState(false);
  const [showBatsmanDialog, setShowBatsmanDialog] = useState(false);
  const [showBowlerDialog, setShowBowlerDialog] = useState(false);
  const [dismissedPlayer, setDismissedPlayer] = useState(null);
  const [activeTab, setActiveTab] = useState<'batting' | 'bowling'>('batting');
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'four' | 'six' | 'hatrick'>('four');
  const [wicketOnLastBall, setWicketOnLastBall] = useState(false);

  const handleWicket = (isLastBallOfOver: boolean) => {
    const currentTeamData = getCurrentTeam();
    const player = currentTeamData.players[striker];
    setDismissedPlayer(player);
    setShowDismissalDialog(true);
    setWicketOnLastBall(isLastBallOfOver);
  };

  const handleOverComplete = () => {
    // Only show bowler dialog if match is not ended and not at the end of innings
    const currentTeamData = getCurrentTeam();
    const oversCompleted = Math.floor(currentTeamData.totalBalls / 6);
    
    // Don't ask for new bowler at end of innings or match
    if (oversCompleted < totalOvers && currentTeamData.wickets < 10 && !matchEnded) {
      setShowBowlerDialog(true);
    }
  };

  const handleCelebration = (type: 'four' | 'six' | 'hatrick') => {
    setCelebrationType(type);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const handleInningsComplete = () => {
    // Auto switch innings after first innings
    setTimeout(() => {
      switchInnings();
    }, 2000); // 2 second delay to show completion
  };

  const { ballsInOver, handleScore } = useScoringLogic({
    getCurrentTeam,
    getBowlingTeam,
    setCurrentTeamData,
    setBowlingTeamData,
    striker,
    setStriker,
    currentBatsman1,
    currentBatsman2,
    currentBowler,
    totalOvers,
    inningsComplete,
    onWicket: handleWicket,
    onOverComplete: handleOverComplete,
    onCelebration: handleCelebration,
    onInningsComplete: handleInningsComplete,
    onMatchEnd: (battingTeam, bowlingTeam) => endMatch(battingTeam, bowlingTeam)
  });

  const handleDismissalConfirm = (dismissalType: string, dismissedBy?: string) => {
    handleDismissal(dismissalType, dismissedBy);
    // setShowDismissalDialog(false); // Dialog should remain open until new batsman is selected
    setDismissedPlayer(null);
    
    const currentTeamData = getCurrentTeam();
    if (currentTeamData.wickets < 10) {
      setShowBatsmanDialog(true);
    } else {
      // If all wickets are lost, the match will end, and the dialog will naturally close.
      // No need to explicitly hide dismissal dialog here as endMatch will handle the UI state.
    }
  };

  const handleBatsmanSelection = (playerIndex: number) => {
    replaceOutBatsman(playerIndex, wicketOnLastBall); 
    setShowBatsmanDialog(false);
    setShowDismissalDialog(false); 
  };

  const handleBowlerSelection = (bowlerIndex: number) => {
    setCurrentBowler(bowlerIndex);
    setShowBowlerDialog(false);
    // Change striker for new over
    setStriker(striker === currentBatsman1 ? currentBatsman2 : currentBatsman1);
  };

  const getAvailablePlayers = () => {
    const currentTeamData = getCurrentTeam();
    return currentTeamData.players.filter((player, index) => 
      !player.isOut && index !== currentBatsman1 && index !== currentBatsman2
    );
  };

  const getAvailableBowlers = () => {
    const bowlingTeamData = getBowlingTeam();
    return bowlingTeamData.players.filter((_, index) => index !== currentBowler);
  };

  if (!matchStarted) {
    return <MatchSetup onMatchStart={handleMatchStart} />;
  }

  if (matchEnded && winner) {
    return (
      <WinnerCelebration 
        winner={winner} 
        loser={loser} 
        margin={margin}
        onNewMatch={handleNewMatch}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-center mb-2">
            <span className="text-2xl">🏆</span>
            <h1 className="text-3xl font-bold mx-2"> Cricket Scorer</h1>
          </div>
          <p className="text-center text-lg">
            {inningsComplete ? 'Second Innings' : 'First Innings'} • {totalOvers} Overs Match
          </p>
        </div>

        {/* Match status */}
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-2xl">🏏</span>
              <div>
                <h2 className="text-xl font-bold text-purple-600">
                  {getCurrentTeam().name} vs {getBowlingTeam().name}
                </h2>
                <p className="text-gray-600">
                  Overs: {Math.floor(getCurrentTeam().totalBalls / 6)}.{ballsInOver} / {totalOvers}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-orange-500">
                {getCurrentTeam().totalRuns}/{getCurrentTeam().wickets}
              </div>
              {inningsComplete && (
                <div className="text-sm text-red-500">
                  Target: {(currentTeam === 'team1' ? team2.totalRuns : team1.totalRuns) + 1} runs • 
                  Need {(currentTeam === 'team1' ? team2.totalRuns : team1.totalRuns) + 1 - getCurrentTeam().totalRuns} runs
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab buttons */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => setActiveTab('batting')}
                variant={activeTab === 'batting' ? 'default' : 'outline'}
                className="px-6"
              >
                🏏 Batting Stats
              </Button>
              <Button 
                onClick={() => setActiveTab('bowling')}
                variant={activeTab === 'bowling' ? 'default' : 'outline'}
                className="px-6"
              >
                🎳 Bowling Stats
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <MatchControls
              currentTeam={getCurrentTeam()}
              bowlingTeam={getBowlingTeam()}
              striker={striker}
              currentBatsman1={currentBatsman1}
              currentBatsman2={currentBatsman2}
              currentBowler={currentBowler}
              inningsComplete={inningsComplete}
              onSwitchInnings={switchInnings}
              onBowlerChange={setCurrentBowler}
            />
          </div>

          <div className="space-y-4">
            <ScoringButtons onScore={handleScore} />
          </div>

          <div>
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">🏏</span>
                <h3 className="text-xl font-bold text-purple-600"> Live Scorecard</h3>
              </div>
              
              {activeTab === 'batting' ? (
                <Scorecard 
                  team1={team1} 
                  team2={team2} 
                  currentTeam={currentTeam}
                  currentBatsman1={currentBatsman1}
                  currentBatsman2={currentBatsman2}
                  striker={striker}
                />
              ) : (
                <BowlingStats 
                  team1={team1} 
                  team2={team2} 
                  currentTeam={currentTeam}
                  currentBowler={currentBowler}
                />
              )}
            </div>
          </div>
        </div>

        {/* Dialogs */}
        <DismissalDialog
          isOpen={showDismissalDialog}
          dismissedPlayer={dismissedPlayer}
          bowlingTeamPlayers={getBowlingTeam().players}
          currentBowler={currentBowler}
          onConfirm={handleDismissalConfirm}
          onCancel={() => {
            setShowDismissalDialog(false);
            setDismissedPlayer(null);
          }}
        />

        <BatsmanSelectionDialog
          isOpen={showBatsmanDialog}
          availablePlayers={getAvailablePlayers()}
          onSelect={handleBatsmanSelection}
          onCancel={() => setShowBatsmanDialog(false)}
        />

        <BowlerSelectionDialog
          isOpen={showBowlerDialog}
          availableBowlers={getAvailableBowlers()}
          onSelect={handleBowlerSelection}
          onCancel={() => setShowBowlerDialog(false)}
        />

        <CelebrationAnimation
          show={showCelebration}
          type={celebrationType}
        />
      </div>
    </div>
  );
};

export default Index;
