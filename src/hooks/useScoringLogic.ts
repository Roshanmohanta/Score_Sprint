import { useState } from 'react';

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
  consecutiveWickets: number;
  fours: number;
  sixes: number;
  totalBallsBowled: number;
}

interface Team {
  name: string;
  players: Player[];
  captain: number;
  viceCaptain: number;
  totalRuns: number;
  totalBalls: number;
  wickets: number;
  extras: number;
}

interface UseScoringLogicProps {
  getCurrentTeam: () => Team;
  getBowlingTeam: () => Team;
  setCurrentTeamData: (data: Team) => void;
  setBowlingTeamData: (data: Team) => void;
  striker: number;
  setStriker: (index: number) => void;
  currentBatsman1: number;
  currentBatsman2: number;
  currentBowler: number;
  totalOvers: number;
  inningsComplete: boolean;
  onWicket: (isLastBallOfOver: boolean) => void;
  onOverComplete: () => void;
  onCelebration: (type: 'four' | 'six' | 'hatrick') => void;
  onInningsComplete: () => void;
  onMatchEnd: (battingTeam: Team, bowlingTeam: Team) => void;
}

export const useScoringLogic = ({
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
  onWicket,
  onOverComplete,
  onCelebration,
  onInningsComplete,
  onMatchEnd
}: UseScoringLogicProps) => {
  const [ballsInOver, setBallsInOver] = useState(0);

  const checkInningsEnd = (updatedTeam: Team) => {
    const bowlingTeam = getBowlingTeam();
    
    // Check if innings should end
    if (updatedTeam.wickets >= 10 || 
        Math.floor(updatedTeam.totalBalls / 6) >= totalOvers) {
      if (!inningsComplete) {
        // First innings complete
        onInningsComplete();
      } else {
        // Second innings complete - match ends
        onMatchEnd(updatedTeam, bowlingTeam);
      }
      return true;
    }
    
    // In second innings, check if target is reached
    if (inningsComplete) {
      const target = bowlingTeam.totalRuns + 1;
      // Only end match if target is achieved
      if (updatedTeam.totalRuns >= target) {
        onMatchEnd(updatedTeam, bowlingTeam);
        return true;
      }
    }
    
    return false;
  };

  const handleScore = (scoreType: string, extraRuns?: number) => {
    console.log(`Scoring action: ${scoreType}, Extra runs: ${extraRuns || 0}`);
    const currentTeamData = getCurrentTeam();
    const bowlingTeamData = getBowlingTeam();
    const batsmanIndex = striker;
    const bowlerIndex = currentBowler;

    let updatedBattingTeam = { ...currentTeamData };
    let updatedBowlingTeam = { ...bowlingTeamData };
    let runsScored = 0;
    let extraBall = false;
    let changeBowlerEnd = false;
    let isValidBall = true;

    // Update players arrays
    updatedBattingTeam.players = [...currentTeamData.players];
    updatedBowlingTeam.players = [...bowlingTeamData.players];

    switch (scoreType) {
      case 'dot':
        updatedBattingTeam.players[batsmanIndex].ballsFaced++;
        break;

      case '1':
      case '3':
        runsScored = parseInt(scoreType);
        console.log(`Runs scored: ${runsScored}`);
        updatedBattingTeam.players[batsmanIndex].runs += runsScored;
        updatedBattingTeam.players[batsmanIndex].ballsFaced++;
        changeBowlerEnd = true;
        break;

      case '2':
        runsScored = 2;
        updatedBattingTeam.players[batsmanIndex].runs += runsScored;
        updatedBattingTeam.players[batsmanIndex].ballsFaced++;
        break;

      case '4':
        runsScored = 4;
        console.log(`Runs scored: ${runsScored}`);
        updatedBattingTeam.players[batsmanIndex].runs += runsScored;
        updatedBattingTeam.players[batsmanIndex].ballsFaced++;
        updatedBattingTeam.players[batsmanIndex].fours++;
        onCelebration('four');
        break;

      case '6':
        runsScored = 6;
        console.log(`Runs scored: ${runsScored}`);
        updatedBattingTeam.players[batsmanIndex].runs += runsScored;
        updatedBattingTeam.players[batsmanIndex].ballsFaced++;
        updatedBattingTeam.players[batsmanIndex].sixes++;
        onCelebration('six');
        break;

      case 'wide':
        runsScored = 1 + (extraRuns || 0);
        console.log(`Wide! Runs: ${runsScored}`);
        extraBall = true;
        isValidBall = false;
        updatedBattingTeam.extras += runsScored;
        // Wide doesn't count as ball faced by batsman
        if ((extraRuns || 0) % 2 === 1) changeBowlerEnd = true;
        break;

      case 'noball':
        runsScored = 1 + (extraRuns || 0);
        console.log(`No-ball! Runs: ${runsScored}`);
        extraBall = true;
        isValidBall = false;
        updatedBattingTeam.extras += 1; // Only the no-ball penalty
        // Batsman gets runs but no ball faced
        if (extraRuns && extraRuns > 0) {
          updatedBattingTeam.players[batsmanIndex].runs += extraRuns;
        }
        if ((extraRuns || 0) % 2 === 1) changeBowlerEnd = true;
        break;

      case 'legbye':
        runsScored = extraRuns || 1;
        console.log(`Leg bye! Runs: ${runsScored}`);
        updatedBattingTeam.players[batsmanIndex].ballsFaced++;
        // Leg bye runs don't count towards batsman's runs
        if (runsScored % 2 === 1) changeBowlerEnd = true;
        break;

      case 'wicket':
        console.log('Wicket!');
        updatedBattingTeam.players[batsmanIndex].ballsFaced++;
        updatedBattingTeam.wickets++;
        updatedBowlingTeam.players[bowlerIndex].wicketsTaken++;
        updatedBowlingTeam.players[bowlerIndex].consecutiveWickets++;
        
        // Check for hat-trick (3 wickets in a row)
        if (updatedBowlingTeam.players[bowlerIndex].consecutiveWickets >= 3) {
          onCelebration('hatrick');
        }
        
        onWicket(ballsInOver + 1 === 6);
        break;

      default:
        return;
    }

    // Reset consecutive wickets for bowler if no wicket
    if (scoreType !== 'wicket') {
      updatedBowlingTeam.players[bowlerIndex].consecutiveWickets = 0;
    }

    // Update team totals
    updatedBattingTeam.totalRuns += runsScored;
    updatedBowlingTeam.players[bowlerIndex].runsConceded += runsScored;

    if (isValidBall) {
      const newBallsInOver = ballsInOver + 1;
      setBallsInOver(newBallsInOver);
      updatedBattingTeam.totalBalls++;
      
      // Update bowler's total balls bowled
      updatedBowlingTeam.players[bowlerIndex].totalBallsBowled++;

      // Check for over completion
      if (newBallsInOver === 6) {
        setBallsInOver(0);
        
        // Check for maiden over (no runs conceded in this over)
        const runsInThisOver = updatedBowlingTeam.players[bowlerIndex].runsConceded;
        if (runsInThisOver === 0) {
          updatedBowlingTeam.players[bowlerIndex].maidenOvers++;
        }
        
        onOverComplete();
      }
    }

    // Handle striker change
    if (changeBowlerEnd && scoreType !== 'wicket') {
      setStriker(striker === currentBatsman1 ? currentBatsman2 : currentBatsman1);
    }

    setCurrentTeamData(updatedBattingTeam);
    setBowlingTeamData(updatedBowlingTeam);

    // Check if innings/match should end
    checkInningsEnd(updatedBattingTeam);
  };

  return {
    ballsInOver,
    handleScore
  };
};
