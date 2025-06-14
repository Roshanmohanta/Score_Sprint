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

export const useMatchState = () => {
  const [matchStarted, setMatchStarted] = useState(false);
  const [matchEnded, setMatchEnded] = useState(false);
  const [totalOvers, setTotalOvers] = useState(20);
  const [inningsComplete, setInningsComplete] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<'team1' | 'team2'>('team1');
  const [winner, setWinner] = useState<Team | null>(null);
  const [loser, setLoser] = useState<Team | null>(null);
  const [margin, setMargin] = useState('');

  const [team1, setTeam1] = useState<Team>({
    name: 'Team A',
    players: [],
    captain: 0,
    viceCaptain: 1,
    totalRuns: 0,
    totalBalls: 0,
    wickets: 0,
    extras: 0,
  });

  const [team2, setTeam2] = useState<Team>({
    name: 'Team B',
    players: [],
    captain: 0,
    viceCaptain: 1,
    totalRuns: 0,
    totalBalls: 0,
    wickets: 0,
    extras: 0,
  });

  const [currentBatsman1, setCurrentBatsman1] = useState(0);
  const [currentBatsman2, setCurrentBatsman2] = useState(1);
  const [striker, setStriker] = useState(0);
  const [currentBowler, setCurrentBowler] = useState(0);

  const [team1OpeningBatsmen, setTeam1OpeningBatsmen] = useState<[number, number]>([0, 1]);
  const [team2OpeningBatsmen, setTeam2OpeningBatsmen] = useState<[number, number]>([0, 1]);

  const getCurrentTeam = () => currentTeam === 'team1' ? team1 : team2;
  const getBowlingTeam = () => currentTeam === 'team1' ? team2 : team1;

  const setCurrentTeamData = (data: Team) => {
    if (currentTeam === 'team1') {
      setTeam1(data);
    } else {
      setTeam2(data);
    }
  };

  const setBowlingTeamData = (data: Team) => {
    if (currentTeam === 'team1') {
      setTeam2(data);
    } else {
      setTeam1(data);
    }
  };

  const handleMatchStart = (data: {
    team1: Team;
    team2: Team;
    totalOvers: number;
    battingFirst: 'team1' | 'team2';
    team1OpeningBatsmen: [number, number];
    team2OpeningBatsmen: [number, number];
  }) => {
    // Initialize players with new fields
    const initializeTeam = (team: Team) => ({
      ...team,
      players: team.players.map(player => ({
        ...player,
        consecutiveWickets: 0,
        fours: 0,
        sixes: 0,
        totalBallsBowled: 0,
      })),
      extras: 0
    });

    setTeam1(initializeTeam(data.team1));
    setTeam2(initializeTeam(data.team2));
    setTotalOvers(data.totalOvers);
    setCurrentTeam(data.battingFirst);
    setTeam1OpeningBatsmen(data.team1OpeningBatsmen);
    setTeam2OpeningBatsmen(data.team2OpeningBatsmen);
    
    // Set opening batsmen for the team batting first
    if (data.battingFirst === 'team1') {
      setCurrentBatsman1(data.team1OpeningBatsmen[0]);
      setCurrentBatsman2(data.team1OpeningBatsmen[1]);
      setStriker(data.team1OpeningBatsmen[0]);
    } else {
      setCurrentBatsman1(data.team2OpeningBatsmen[0]);
      setCurrentBatsman2(data.team2OpeningBatsmen[1]);
      setStriker(data.team2OpeningBatsmen[0]);
    }
    
    setMatchStarted(true);
  };

  const switchInnings = () => {
    setInningsComplete(true);
    setCurrentTeam(currentTeam === 'team1' ? 'team2' : 'team1');
    
    // Set opening batsmen for the new batting team
    if (currentTeam === 'team1') {
      // Switching to team2 batting
      setCurrentBatsman1(team2OpeningBatsmen[0]);
      setCurrentBatsman2(team2OpeningBatsmen[1]);
      setStriker(team2OpeningBatsmen[0]);
    } else {
      // Switching to team1 batting
      setCurrentBatsman1(team1OpeningBatsmen[0]);
      setCurrentBatsman2(team1OpeningBatsmen[1]);
      setStriker(team1OpeningBatsmen[0]);
    }
    
    setCurrentBowler(0);
  };

  const replaceOutBatsman = (newBatsmanIndex: number, isLastBallOfOver: boolean) => {
    const currentNonStriker = striker === currentBatsman1 ? currentBatsman2 : currentBatsman1;

    // When a new batsman comes in, they always take the striker's position.
    // The existing non-striker remains at their end.
    setCurrentBatsman1(newBatsmanIndex); 
    setCurrentBatsman2(currentNonStriker);
    setStriker(newBatsmanIndex); 
  };

  const shouldEndMatch = (battingTeam: Team, bowlingTeam: Team) => {
    // Check if all wickets are lost
    if (battingTeam.wickets >= 10) {
      return true;
    }

    // Check if all overs are completed
    const oversCompleted = Math.floor(battingTeam.totalBalls / 6);
    if (oversCompleted >= totalOvers) {
      return true;
    }

    // In second innings, check if target is achieved
    if (inningsComplete) {
      const target = bowlingTeam.totalRuns + 1;
      // Only end match if target is achieved
      if (battingTeam.totalRuns >= target) {
        return true;
      }
    }

    return false;
  };

  const handleDismissal = (dismissalType: string, dismissedBy?: string) => {
    const currentTeamData = getCurrentTeam();
    const updatedPlayers = [...currentTeamData.players];
    
    updatedPlayers[striker].isOut = true;
    updatedPlayers[striker].dismissalType = dismissalType;
    updatedPlayers[striker].dismissedBy = dismissedBy;
    
    const updatedTeam = {
      ...currentTeamData,
      players: updatedPlayers,
    };
    
    setCurrentTeamData(updatedTeam);
    
    // Check if match should end
    if (shouldEndMatch(updatedTeam, getBowlingTeam())) {
      endMatch(updatedTeam, getBowlingTeam());
    }
  };

  const endMatch = (currentBattingTeam: Team, currentBowlingTeam: Team) => {
    let matchWinner: Team;
    let matchLoser: Team;
    let winMargin: string;
    
    console.log('--- endMatch triggered ---');

    if (inningsComplete) {
      const target = currentBowlingTeam.totalRuns + 1; // Target for the chasing team

      if (currentBattingTeam.totalRuns >= target) {
        // Chasing team won by successfully achieving the target
        matchWinner = currentBattingTeam;
        matchLoser = currentBowlingTeam;
        const wicketsRemaining = 10 - currentBattingTeam.wickets;
        winMargin = `by ${wicketsRemaining} wicket${wicketsRemaining !== 1 ? 's' : ''}`;
      } else if (currentBattingTeam.totalRuns === currentBowlingTeam.totalRuns && 
                 (currentBattingTeam.wickets >= 10 || Math.floor(currentBattingTeam.totalBalls / 6) >= totalOvers)) {
        // Match Tied: Scores are level AND chasing team is all out or overs completed
        matchWinner = currentBattingTeam; // Arbitrarily assign for display, but indicate tie
        matchLoser = currentBowlingTeam;
        winMargin = 'Match Tied';
      } else {
        // Defending team won: Chasing team failed to reach target after all wickets or overs
        matchWinner = currentBowlingTeam;
        matchLoser = currentBattingTeam;
        const runDifference = currentBowlingTeam.totalRuns - currentBattingTeam.totalRuns;
        winMargin = `by ${runDifference} run${runDifference !== 1 ? 's' : ''}`;
      }
    } else {
      // First innings ended - wait for second innings. This case should ideally not trigger endMatch unless all out.
      // If first innings ends due to all out, it's still not a match end, but an innings end.
      // This 'return' is correct for ensuring match doesn't prematurely end after 1st innings.
      return;
    }
    
    setWinner(matchWinner);
    setLoser(matchLoser);
    setMargin(winMargin);
    setMatchEnded(true);
  };

  const handleNewMatch = () => {
    setMatchStarted(false);
    setMatchEnded(false);
    setInningsComplete(false);
    setCurrentTeam('team1');
    setWinner(null);
    setLoser(null);
    setMargin('');
    setCurrentBatsman1(0);
    setCurrentBatsman2(1);
    setStriker(0);
    setCurrentBowler(0);
  };

  return {
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
  };
};
