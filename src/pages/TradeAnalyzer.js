import { useState, useEffect } from 'react';
import { useCombobox } from 'downshift';
import { useTeam } from '../contexts/TeamContext';
import { useLeague } from '../contexts/LeagueContext';
import { ScoringCalculator } from '../utils/ScoringCalculator';
import axios from 'axios';
import Fuse from 'fuse.js';

const LEAGUE_TYPES = {
  REDRAFT: 'redraft',
  KEEPER: 'keeper',
  DYNASTY: 'dynasty'
};

const SCORING_FORMATS = {
  PPR: 'ppr',
  HALF_PPR: 'half_ppr',
  STANDARD: 'standard'
};

// Injury status definitions and multipliers
const INJURY_STATUS = {
  HEALTHY: 'healthy',
  QUESTIONABLE: 'questionable', 
  DOUBTFUL: 'doubtful',
  OUT: 'out',
  IR: 'ir',
  PUP: 'pup'
};

// Injury multipliers by league type and current week
const INJURY_MULTIPLIERS = {
  [LEAGUE_TYPES.REDRAFT]: {
    [INJURY_STATUS.HEALTHY]: 1.0,
    [INJURY_STATUS.QUESTIONABLE]: 0.9,
    [INJURY_STATUS.DOUBTFUL]: 0.7,
    [INJURY_STATUS.OUT]: 0.3,
    [INJURY_STATUS.IR]: 0.1,
    [INJURY_STATUS.PUP]: 0.05
  },
  [LEAGUE_TYPES.KEEPER]: {
    [INJURY_STATUS.HEALTHY]: 1.0,
    [INJURY_STATUS.QUESTIONABLE]: 0.95,
    [INJURY_STATUS.DOUBTFUL]: 0.85,
    [INJURY_STATUS.OUT]: 0.6,
    [INJURY_STATUS.IR]: 0.4,
    [INJURY_STATUS.PUP]: 0.3
  },
  [LEAGUE_TYPES.DYNASTY]: {
    [INJURY_STATUS.HEALTHY]: 1.0,
    [INJURY_STATUS.QUESTIONABLE]: 0.98,
    [INJURY_STATUS.DOUBTFUL]: 0.92,
    [INJURY_STATUS.OUT]: 0.8,
    [INJURY_STATUS.IR]: 0.7, // Depends on injury type - could be 0.9 for minor, 0.3 for major
    [INJURY_STATUS.PUP]: 0.6
  }
};

// Season timing affects injury impact
const getSeasonMultiplier = (currentWeek, injuryStatus) => {
  if (injuryStatus === INJURY_STATUS.HEALTHY) return 1.0;
  
  // Early season injuries have less impact than late season
  if (currentWeek <= 6) {
    return 1.0; // Full season to recover
  } else if (currentWeek <= 12) {
    return 0.9; // Significant season left
  } else {
    return 0.7; // Playoff push, less time to return
  }
};

// League size affects player scarcity and value
const LEAGUE_SIZE_MULTIPLIERS = {
  8: { QB: 0.85, RB: 1.0, WR: 1.0, TE: 0.9 },
  10: { QB: 0.9, RB: 1.05, WR: 1.0, TE: 0.95 },
  12: { QB: 1.0, RB: 1.1, WR: 1.0, TE: 1.0 },
  14: { QB: 1.1, RB: 1.2, WR: 1.05, TE: 1.1 },
  16: { QB: 1.2, RB: 1.3, WR: 1.1, TE: 1.2 },
  18: { QB: 1.3, RB: 1.4, WR: 1.15, TE: 1.3 }
};

// Starter requirements affect positional value
const STARTER_REQUIREMENTS = {
  QB: 1, RB: 2, WR: 2, TE: 1, FLEX: 1 // Standard lineup
};

// Pick timing affects value (current year vs future picks)
const PICK_TIMING = {
  CURRENT_YEAR: 'current',
  NEXT_YEAR: 'next',
  FUTURE: 'future' // 2+ years out
};

// Generate realistic projected stats based on position and tier
const generateProjectedStats = (position) => {
  const tierRandom = Math.random();
  let tier;
  
  // Determine player tier (elite, good, average, bench)
  if (tierRandom < 0.1) tier = 'elite';
  else if (tierRandom < 0.3) tier = 'good';
  else if (tierRandom < 0.6) tier = 'average';
  else tier = 'bench';
  
  switch (position) {
    case 'QB':
      return generateQBStats(tier);
    case 'RB':
      return generateRBStats(tier);
    case 'WR':
      return generateWRStats(tier);
    case 'TE':
      return generateTEStats(tier);
    default:
      return {};
  }
};

const generateQBStats = (tier) => {
  const baseStats = {
    elite: { passYards: [4500, 5200], passTDs: [35, 45], ints: [8, 12], rushYards: [400, 800], rushTDs: [3, 8] },
    good: { passYards: [3800, 4400], passTDs: [25, 34], ints: [10, 16], rushYards: [200, 500], rushTDs: [1, 5] },
    average: { passYards: [3200, 3700], passTDs: [18, 24], ints: [12, 18], rushYards: [100, 300], rushTDs: [0, 3] },
    bench: { passYards: [2000, 3100], passTDs: [10, 17], ints: [8, 15], rushYards: [50, 200], rushTDs: [0, 2] }
  };
  
  const stats = baseStats[tier];
  return {
    passing: {
      passingYards: Math.floor(Math.random() * (stats.passYards[1] - stats.passYards[0]) + stats.passYards[0]),
      passingTDs: Math.floor(Math.random() * (stats.passTDs[1] - stats.passTDs[0]) + stats.passTDs[0]),
      interceptions: Math.floor(Math.random() * (stats.ints[1] - stats.ints[0]) + stats.ints[0]),
      twoPointConversions: Math.floor(Math.random() * 3)
    },
    rushing: {
      rushingYards: Math.floor(Math.random() * (stats.rushYards[1] - stats.rushYards[0]) + stats.rushYards[0]),
      rushingTDs: Math.floor(Math.random() * (stats.rushTDs[1] - stats.rushTDs[0]) + stats.rushTDs[0]),
      twoPointConversions: Math.floor(Math.random() * 2)
    },
    misc: {
      fumbles: Math.floor(Math.random() * 4),
      fumblesLost: Math.floor(Math.random() * 3)
    }
  };
};

const generateRBStats = (tier) => {
  const baseStats = {
    elite: { rushYards: [1400, 1800], rushTDs: [12, 18], recs: [40, 80], recYards: [400, 800], recTDs: [2, 6] },
    good: { rushYards: [1000, 1300], rushTDs: [8, 12], recs: [30, 60], recYards: [300, 600], recTDs: [1, 4] },
    average: { rushYards: [600, 900], rushTDs: [4, 8], recs: [20, 40], recYards: [200, 400], recTDs: [0, 3] },
    bench: { rushYards: [200, 500], rushTDs: [1, 4], recs: [10, 25], recYards: [80, 200], recTDs: [0, 2] }
  };
  
  const stats = baseStats[tier];
  return {
    rushing: {
      rushingYards: Math.floor(Math.random() * (stats.rushYards[1] - stats.rushYards[0]) + stats.rushYards[0]),
      rushingTDs: Math.floor(Math.random() * (stats.rushTDs[1] - stats.rushTDs[0]) + stats.rushTDs[0]),
      twoPointConversions: Math.floor(Math.random() * 2)
    },
    receiving: {
      receptions: Math.floor(Math.random() * (stats.recs[1] - stats.recs[0]) + stats.recs[0]),
      receivingYards: Math.floor(Math.random() * (stats.recYards[1] - stats.recYards[0]) + stats.recYards[0]),
      receivingTDs: Math.floor(Math.random() * (stats.recTDs[1] - stats.recTDs[0]) + stats.recTDs[0]),
      twoPointConversions: Math.floor(Math.random() * 2)
    },
    misc: {
      fumbles: Math.floor(Math.random() * 3),
      fumblesLost: Math.floor(Math.random() * 2)
    }
  };
};

const generateWRStats = (tier) => {
  const baseStats = {
    elite: { recs: [90, 130], recYards: [1300, 1800], recTDs: [8, 15], rushAtt: [0, 5] },
    good: { recs: [70, 90], recYards: [1000, 1300], recTDs: [5, 10], rushAtt: [0, 3] },
    average: { recs: [45, 70], recYards: [600, 1000], recTDs: [3, 7], rushAtt: [0, 2] },
    bench: { recs: [20, 45], recYards: [300, 600], recTDs: [1, 4], rushAtt: [0, 1] }
  };
  
  const stats = baseStats[tier];
  const rushAttempts = Math.floor(Math.random() * (stats.rushAtt[1] - stats.rushAtt[0]) + stats.rushAtt[0]);
  
  return {
    receiving: {
      receptions: Math.floor(Math.random() * (stats.recs[1] - stats.recs[0]) + stats.recs[0]),
      receivingYards: Math.floor(Math.random() * (stats.recYards[1] - stats.recYards[0]) + stats.recYards[0]),
      receivingTDs: Math.floor(Math.random() * (stats.recTDs[1] - stats.recTDs[0]) + stats.recTDs[0]),
      twoPointConversions: Math.floor(Math.random() * 2)
    },
    rushing: rushAttempts > 0 ? {
      rushingYards: Math.floor(Math.random() * 100),
      rushingTDs: Math.floor(Math.random() * 2),
      twoPointConversions: 0
    } : {},
    misc: {
      fumbles: Math.floor(Math.random() * 2),
      fumblesLost: Math.floor(Math.random() * 1)
    }
  };
};

const generateTEStats = (tier) => {
  const baseStats = {
    elite: { recs: [75, 110], recYards: [900, 1400], recTDs: [6, 12] },
    good: { recs: [50, 75], recYards: [600, 900], recTDs: [4, 8] },
    average: { recs: [35, 50], recYards: [400, 600], recTDs: [2, 5] },
    bench: { recs: [15, 35], recYards: [200, 400], recTDs: [0, 3] }
  };
  
  const stats = baseStats[tier];
  return {
    receiving: {
      receptions: Math.floor(Math.random() * (stats.recs[1] - stats.recs[0]) + stats.recs[0]),
      receivingYards: Math.floor(Math.random() * (stats.recYards[1] - stats.recYards[0]) + stats.recYards[0]),
      receivingTDs: Math.floor(Math.random() * (stats.recTDs[1] - stats.recTDs[0]) + stats.recTDs[0]),
      twoPointConversions: Math.floor(Math.random() * 2)
    },
    misc: {
      fumbles: Math.floor(Math.random() * 2),
      fumblesLost: Math.floor(Math.random() * 1)
    }
  };
};

export default function TradeAnalyzer() {
  const { selectedTeam, getTeamByAbbr } = useTeam();
  const { currentLeague, scoringConfig } = useLeague();
  const [givingUp, setGivingUp] = useState(['']);
  const [getting, setGetting] = useState(['']);
  const [givingUpPicks, setGivingUpPicks] = useState([]);
  const [gettingPicks, setGettingPicks] = useState([]);
  const [playerValues, setPlayerValues] = useState({});
  const [result, setResult] = useState(null);
  const [leagueType, setLeagueType] = useState(currentLeague?.type || LEAGUE_TYPES.REDRAFT);
  const [loading, setLoading] = useState(false);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [showMyTeamFilter, setShowMyTeamFilter] = useState(false);
  
  // Advanced league configuration
  const [leagueSize, setLeagueSize] = useState(currentLeague?.teamCount || 12);
  const [keeperCount, setKeeperCount] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(8); // Current NFL week for injury timing
  const [rosterSettings, setRosterSettings] = useState({
    QB: 1, RB: 2, WR: 2, TE: 1, FLEX: 1, BENCH: 6
  });

  // Improved tier-based pick valuation system
  const getPickValue = (pick) => {
    const { round, position, year } = pick;
    const pickNumber = (round - 1) * leagueSize + position;
    
    // Tier-based valuation (more realistic than linear decay)
    let baseValue;
    
    if (pickNumber <= 12) {
      // Elite tier (Round 1): 85-110 points
      baseValue = 110 - ((pickNumber - 1) * 2.0);
    } else if (pickNumber <= 24) {
      // High tier (Round 2): 60-83 points  
      baseValue = 85 - ((pickNumber - 12) * 1.9);
    } else if (pickNumber <= 36) {
      // Mid tier (Round 3): 40-58 points
      baseValue = 62 - ((pickNumber - 24) * 1.8);
    } else if (pickNumber <= 60) {
      // Depth tier (Rounds 4-5): 20-38 points
      baseValue = 40 - ((pickNumber - 36) * 0.8);
    } else if (pickNumber <= 84) {
      // Late tier (Rounds 6-7): 10-19 points
      baseValue = 21 - ((pickNumber - 60) * 0.45);
    } else {
      // Flyer tier (Round 8+): 1-9 points with exponential decay
      baseValue = Math.max(1, 12 * Math.pow(0.92, pickNumber - 84));
    }
    
    // League type multipliers (more conservative)
    const typeMultipliers = {
      [LEAGUE_TYPES.REDRAFT]: 1.0,      // Current year focus
      [LEAGUE_TYPES.KEEPER]: 1.15,      // Moderate premium for future planning  
      [LEAGUE_TYPES.DYNASTY]: 1.3       // Higher premium on youth/potential
    };
    
    // Year-based depreciation for future picks
    const currentYear = new Date().getFullYear();
    const yearsDifference = year - currentYear;
    
    let yearMultiplier = 1.0;
    if (yearsDifference > 0) {
      // Future picks lose value: 15% per year for redraft, 10% for keeper, 5% for dynasty
      const depreciationRates = {
        [LEAGUE_TYPES.REDRAFT]: 0.15,
        [LEAGUE_TYPES.KEEPER]: 0.10, 
        [LEAGUE_TYPES.DYNASTY]: 0.05
      };
      yearMultiplier = Math.pow(1 - depreciationRates[leagueType], yearsDifference);
    }
    
    // Season depreciation (picks lose value as season progresses, especially in redraft)
    if (yearsDifference === 0 && leagueType === LEAGUE_TYPES.REDRAFT) {
      const weekDepreciation = Math.max(0.4, 1 - (currentWeek * 0.04)); // Lose 4% per week, floor at 40%
      yearMultiplier *= weekDepreciation;
    }
    
    return Math.round(baseValue * typeMultipliers[leagueType] * yearMultiplier);
  };

  // Helper function for common league sizes (parse pick descriptions)
  const getStandardPickValue = (pickDescription, leagueTypeOverride = leagueType, leagueSizeOverride = leagueSize) => {
    // Parse strings like "2025 Round 1, Pick 1" or "Round 2, Pick 5"
    const roundMatch = pickDescription.match(/Round\s+(\d+)/i);
    const pickMatch = pickDescription.match(/Pick\s+(\d+)/i);
    const yearMatch = pickDescription.match(/(\d{4})/);
    
    if (!roundMatch || !pickMatch) {
      return 0; // Invalid format, return 0 instead of throwing error
    }
    
    const round = parseInt(roundMatch[1]);
    const pickPosition = parseInt(pickMatch[1]);
    const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
    
    return getPickValue({ round, position: pickPosition, year });
  };

  // Advanced player valuation system using actual scoring configuration
  const getPlayerValue = (player, type = leagueType) => {
    if (!playerValues[player]) return 0;
    
    const playerData = playerValues[player];
    const projectedStats = playerData.projectedStats;
    const age = playerData.age || 25;
    const position = playerData.position;
    
    if (!projectedStats) return playerData.baseValue || 0;
    
    // Step 1: Calculate base fantasy points using league's actual scoring
    const calculator = new ScoringCalculator(scoringConfig.getConfig());
    const fantasyPoints = calculator.calculateTotalScore(projectedStats);
    
    // Step 2: Apply league size multiplier (scarcity adjustment)
    const sizeMultiplier = LEAGUE_SIZE_MULTIPLIERS[leagueSize] || LEAGUE_SIZE_MULTIPLIERS[12];
    let adjustedValue = fantasyPoints * (sizeMultiplier[position] || 1.0);
    
    // Step 3: Apply positional scarcity based on roster requirements
    const totalStarters = Object.values(rosterSettings).reduce((sum, count) => sum + count, 0) - rosterSettings.BENCH;
    const positionDemand = rosterSettings[position] || 0;
    const flexDemand = position !== 'QB' && position !== 'TE' ? rosterSettings.FLEX * 0.3 : 0;
    const totalPositionDemand = (positionDemand + flexDemand) * leagueSize;
    
    // Higher demand = higher value multiplier
    const demandMultiplier = position === 'QB' ? 1.0 : 
                            position === 'RB' ? 1.1 + (totalPositionDemand / 100) :
                            position === 'WR' ? 1.0 + (totalPositionDemand / 120) :
                            position === 'TE' ? 1.05 + (totalPositionDemand / 80) : 1.0;
    
    adjustedValue *= demandMultiplier;
    
    // Step 4: Apply age-based multipliers by league type
    let ageMultiplier = 1.0;
    switch (type) {
      case LEAGUE_TYPES.DYNASTY:
        ageMultiplier = age < 23 ? 1.3 : age < 25 ? 1.2 : age < 27 ? 1.1 : 
                       age < 29 ? 1.0 : age < 31 ? 0.8 : age < 33 ? 0.6 : 0.4;
        break;
      
      case LEAGUE_TYPES.KEEPER:
        const keeperPremium = keeperCount / leagueSize;
        const baseKeeperMultiplier = age < 24 ? 1.15 : age < 26 ? 1.1 : age < 28 ? 1.05 : 
                                    age < 30 ? 1.0 : age < 32 ? 0.9 : 0.8;
        ageMultiplier = baseKeeperMultiplier + (keeperPremium * 0.2);
        break;
      
      case LEAGUE_TYPES.REDRAFT:
      default:
        ageMultiplier = age > 32 ? 0.95 : age > 30 ? 0.98 : 1.0;
        break;
    }
    
    adjustedValue *= ageMultiplier;
    
    // Step 5: Apply keeper-specific adjustments
    if (type === LEAGUE_TYPES.KEEPER && keeperCount > 0) {
      const keeperLikelihood = getKeeperLikelihood(playerData, keeperCount, leagueSize);
      adjustedValue *= (1 + keeperLikelihood * 0.15);
    }
    
    // Step 6: Apply injury status multipliers
    const injuryStatus = playerData.injuryStatus || INJURY_STATUS.HEALTHY;
    const baseInjuryMultiplier = INJURY_MULTIPLIERS[type][injuryStatus] || 1.0;
    const seasonTimingMultiplier = getSeasonMultiplier(currentWeek, injuryStatus);
    const finalInjuryMultiplier = baseInjuryMultiplier * seasonTimingMultiplier;
    
    adjustedValue *= finalInjuryMultiplier;
    
    return Math.round(adjustedValue);
  };
  
  // Helper function to determine keeper likelihood
  const getKeeperLikelihood = (playerData, keeperCount, leagueSize) => {
    const age = playerData.age || 25;
    const position = playerData.position;
    const baseValue = playerData.baseValue || 0;
    
    // Younger, higher-value players are more likely to be kept
    let likelihood = 0;
    
    // Age factor
    if (age < 25) likelihood += 0.4;
    else if (age < 27) likelihood += 0.3;
    else if (age < 29) likelihood += 0.2;
    else if (age < 31) likelihood += 0.1;
    
    // Value factor (top tier players more likely to be kept)
    const valuePercentile = baseValue / 100; // Assuming max base value around 100
    likelihood += valuePercentile * 0.4;
    
    // Position scarcity factor
    if (position === 'RB') likelihood += 0.1; // RBs age faster, less likely kept long-term
    if (position === 'QB') likelihood += 0.2; // QBs age well
    if (position === 'WR') likelihood += 0.15; // WRs have longevity
    if (position === 'TE') likelihood += 0.1; // TEs develop late
    
    return Math.min(likelihood, 1.0); // Cap at 100%
  };

  // Sync with league settings when league changes
  useEffect(() => {
    if (currentLeague) {
      setLeagueType(currentLeague.type);
      setLeagueSize(currentLeague.teamCount);
    }
  }, [currentLeague]);

  useEffect(() => {
    async function fetchPlayers() {
      setLoading(true);
      try {
        const res = await axios.get('https://api.sleeper.app/v1/players/nfl');
        const data = res.data;

        const filtered = Object.values(data).filter(
          (p) => 
            p.active &&
            p.full_name &&
            p.position !== 'DEF' &&
            p.team
        );

        const values = {};
        filtered.forEach((p) => {
          const position = p.position;
          
          // Generate realistic projected stats based on position
          const projectedStats = generateProjectedStats(position);
          
          // Generate realistic injury status (most players are healthy)
          const injuryRandom = Math.random();
          let injuryStatus;
          if (injuryRandom < 0.75) {
            injuryStatus = INJURY_STATUS.HEALTHY;
          } else if (injuryRandom < 0.85) {
            injuryStatus = INJURY_STATUS.QUESTIONABLE;
          } else if (injuryRandom < 0.92) {
            injuryStatus = INJURY_STATUS.DOUBTFUL;
          } else if (injuryRandom < 0.97) {
            injuryStatus = INJURY_STATUS.OUT;
          } else if (injuryRandom < 0.99) {
            injuryStatus = INJURY_STATUS.IR;
          } else {
            injuryStatus = INJURY_STATUS.PUP;
          }
          
          values[p.full_name] = {
            name: p.full_name,
            team: p.team,
            position: p.position,
            age: p.age || Math.floor(Math.random() * 10) + 22,
            injuryStatus,
            projectedStats,
            baseValue: 0, // Will be calculated from projectedStats
            avatar: p.search_rank && p.player_id
              ? `https://sleepercdn.com/content/nfl/players/thumb/${p.player_id}.jpg`
              : null,
          };
        });
        setPlayerValues(values);
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, []);

  const handleChange = (side, index, value) => {
    const updated = side === 'giving' ? [...givingUp] : [...getting];
    updated[index] = value;
    side === 'giving' ? setGivingUp(updated) : setGetting(updated);
  };

  const addPlayer = (side) => {
    side === 'giving' ? setGivingUp([...givingUp, '']) : setGetting([...getting, '']);
  };

  const addPick = (side) => {
    const newPick = { 
      round: 1, 
      position: 1, 
      year: new Date().getFullYear(), 
      timing: PICK_TIMING.CURRENT_YEAR 
    };
    side === 'giving' ? setGivingUpPicks([...givingUpPicks, newPick]) : setGettingPicks([...gettingPicks, newPick]);
  };

  const updatePick = (side, index, field, value) => {
    const picks = side === 'giving' ? [...givingUpPicks] : [...gettingPicks];
    picks[index] = { ...picks[index], [field]: value };
    
    // Auto-adjust timing based on year
    const currentYear = new Date().getFullYear();
    if (picks[index].year === currentYear) {
      picks[index].timing = PICK_TIMING.CURRENT_YEAR;
    } else if (picks[index].year === currentYear + 1) {
      picks[index].timing = PICK_TIMING.NEXT_YEAR;
    } else {
      picks[index].timing = PICK_TIMING.FUTURE;
    }
    
    side === 'giving' ? setGivingUpPicks(picks) : setGettingPicks(picks);
  };

  const removePick = (side, index) => {
    const picks = side === 'giving' ? [...givingUpPicks] : [...gettingPicks];
    picks.splice(index, 1);
    side === 'giving' ? setGivingUpPicks(picks) : setGettingPicks(picks);
  };

  const getTotalValue = (players, picks = []) => {
    const playerValue = players.reduce((sum, p) => sum + getPlayerValue(p), 0);
    const pickValue = picks.reduce((sum, pick) => sum + getPickValue(pick), 0);
    return playerValue + pickValue;
  };

  const rateTrade = () => {
    const filteredGiving = givingUp.filter(Boolean);
    const filteredGetting = getting.filter(Boolean);
    
    if ((filteredGiving.length === 0 && givingUpPicks.length === 0) || 
        (filteredGetting.length === 0 && gettingPicks.length === 0)) {
      alert('Please add players or picks to both sides of the trade');
      return;
    }
    
    const totalGiving = getTotalValue(filteredGiving, givingUpPicks);
    const totalGetting = getTotalValue(filteredGetting, gettingPicks);
    const diff = Math.abs(totalGiving - totalGetting);
    const percentDiff = ((diff / Math.max(totalGiving, totalGetting)) * 100).toFixed(1);
    
    let verdict, recommendation, fairness;
    
    if (diff < 5) {
      verdict = 'Excellent Trade';
      recommendation = 'This is a very fair trade for both sides!';
      fairness = 'excellent';
    } else if (diff < 15) {
      verdict = 'Fair Trade';
      recommendation = 'This trade is reasonably balanced.';
      fairness = 'fair';
    } else if (diff < 25) {
      if (totalGetting > totalGiving) {
        verdict = 'You WIN this trade!';
        recommendation = 'You\'re getting more value than you\'re giving up.';
      } else {
        verdict = 'You LOSE this trade';
        recommendation = 'You\'re giving up more value than you\'re getting.';
      }
      fairness = 'slight';
    } else {
      if (totalGetting > totalGiving) {
        verdict = 'You WIN BIG!';
        recommendation = 'This trade heavily favors you. Take it!';
      } else {
        verdict = 'You LOSE BIG';
        recommendation = 'This trade heavily favors the other side. Avoid it!';
      }
      fairness = 'unfair';
    }
    
    const tradeResult = {
      verdict,
      recommendation,
      fairness,
      totalGiving,
      totalGetting,
      diff,
      percentDiff,
      leagueType,
      leagueName: currentLeague?.name || 'Custom League',
      timestamp: new Date(),
      playersGiving: filteredGiving.map(p => ({
        name: p,
        value: getPlayerValue(p),
        ...playerValues[p]
      })),
      playersGetting: filteredGetting.map(p => ({
        name: p,
        value: getPlayerValue(p),
        ...playerValues[p]
      })),
      picksGiving: givingUpPicks.map(pick => ({
        ...pick,
        value: getPickValue(pick),
        description: `${pick.year} Round ${pick.round}, Pick ${pick.position}`
      })),
      picksGetting: gettingPicks.map(pick => ({
        ...pick,
        value: getPickValue(pick),
        description: `${pick.year} Round ${pick.round}, Pick ${pick.position}`
      }))
    };
    
    setResult(tradeResult);
    setTradeHistory(prev => [tradeResult, ...prev.slice(0, 9)]); // Keep last 10 trades
  };

  const copyResultToClipboard = () => {
    if (!result) return;
    
    const playersGivingText = result.playersGiving.map(p => `${p.name} (${p.value})`).join(', ');
    const playersGettingText = result.playersGetting.map(p => `${p.name} (${p.value})`).join(', ');
    const picksGivingText = result.picksGiving.map(p => `${p.description} (${p.value})`).join(', ');
    const picksGettingText = result.picksGetting.map(p => `${p.description} (${p.value})`).join(', ');
    
    const summary = `🏈 Fantasy Trade Analysis\n\n` +
      `League: ${result.leagueName}\n` +
      `Type: ${result.leagueType.toUpperCase()}\n\n` +
      `GIVING UP:\n` +
      `Players: ${playersGivingText || 'None'}\n` +
      `Picks: ${picksGivingText || 'None'}\n` +
      `Total Value: ${result.totalGiving}\n\n` +
      `GETTING:\n` +
      `Players: ${playersGettingText || 'None'}\n` +
      `Picks: ${picksGettingText || 'None'}\n` +
      `Total Value: ${result.totalGetting}\n\n` +
      `Verdict: ${result.verdict}\n` +
      `Difference: ${result.diff} points (${result.percentDiff}%)\n` +
      `Recommendation: ${result.recommendation}`;
    
    navigator.clipboard.writeText(summary);
    alert('Trade analysis copied to clipboard!');
  };
  
  const removePlayer = (side, index) => {
    const updated = side === 'giving' ? [...givingUp] : [...getting];
    updated.splice(index, 1);
    if (updated.length === 0) updated.push(''); // Always keep at least one input
    side === 'giving' ? setGivingUp(updated) : setGetting(updated);
  };
  
  const clearSide = (side) => {
    if (side === 'giving') {
      setGivingUp(['']);
      setGivingUpPicks([]);
    } else {
      setGetting(['']);
      setGettingPicks([]);
    }
  };
  
  const clearTrade = () => {
    setGivingUp(['']);
    setGetting(['']);
    setGivingUpPicks([]);
    setGettingPicks([]);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading player database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow animate-fade-in">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-700">🔄 Fantasy Trade Analyzer</h1>
      
      {!currentLeague && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 text-orange-800">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-medium">No League Selected</p>
              <p className="text-sm">Player values will use default scoring. Go to League Settings to configure your league's specific scoring system for accurate trade analysis.</p>
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-6">⚙️ Advanced League Configuration</h3>
        
        {/* Basic Settings Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">League Type</label>
            <select 
              value={leagueType} 
              onChange={(e) => {
                setLeagueType(e.target.value);
                if (e.target.value === LEAGUE_TYPES.REDRAFT) setKeeperCount(0);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={LEAGUE_TYPES.REDRAFT}>Redraft League</option>
              <option value={LEAGUE_TYPES.KEEPER}>Keeper League</option>
              <option value={LEAGUE_TYPES.DYNASTY}>Dynasty League</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">League Size</label>
            <select 
              value={leagueSize} 
              onChange={(e) => setLeagueSize(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={8}>8 Teams</option>
              <option value={10}>10 Teams</option>
              <option value={12}>12 Teams</option>
              <option value={14}>14 Teams</option>
              <option value={16}>16 Teams</option>
              <option value={18}>18 Teams</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current League</label>
            <div className="p-2 border border-gray-300 rounded-md bg-gray-50">
              {currentLeague ? (
                <div>
                  <div className="font-medium">{currentLeague.name}</div>
                  <div className="text-sm text-gray-600">Custom Scoring</div>
                </div>
              ) : (
                <div className="text-gray-500">No league selected</div>
              )}
            </div>
            {!currentLeague && (
              <p className="text-xs text-orange-600 mt-1">
                Go to League Settings to configure scoring
              </p>
            )}
          </div>
          
          {leagueType === LEAGUE_TYPES.KEEPER && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keeper Count</label>
              <select 
                value={keeperCount} 
                onChange={(e) => setKeeperCount(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={0}>0 Keepers</option>
                <option value={1}>1 Keeper</option>
                <option value={2}>2 Keepers</option>
                <option value={3}>3 Keepers</option>
                <option value={4}>4 Keepers</option>
                <option value={5}>5 Keepers</option>
                <option value={6}>6 Keepers</option>
                <option value={8}>8 Keepers</option>
                <option value={10}>10 Keepers</option>
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Week</label>
            <select 
              value={currentWeek} 
              onChange={(e) => setCurrentWeek(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map(week => (
                <option key={week} value={week}>Week {week}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Roster Settings */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3">📋 Roster Configuration</h4>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {Object.entries(rosterSettings).map(([position, count]) => (
              <div key={position}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{position}</label>
                <input
                  type="number"
                  min="0"
                  max={position === 'BENCH' ? 15 : 3}
                  value={count}
                  onChange={(e) => setRosterSettings(prev => ({
                    ...prev,
                    [position]: Number(e.target.value)
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Roster settings affect positional scarcity and player values
          </p>
        </div>

        {/* League Impact Summary */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-md font-semibold text-blue-800 mb-2">📊 League Impact Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-700">Scarcity Multipliers:</span>
              <ul className="text-blue-600 mt-1">
                <li>QB: {((LEAGUE_SIZE_MULTIPLIERS[leagueSize]?.QB || 1) * 100).toFixed(0)}%</li>
                <li>RB: {((LEAGUE_SIZE_MULTIPLIERS[leagueSize]?.RB || 1) * 100).toFixed(0)}%</li>
                <li>WR: {((LEAGUE_SIZE_MULTIPLIERS[leagueSize]?.WR || 1) * 100).toFixed(0)}%</li>
                <li>TE: {((LEAGUE_SIZE_MULTIPLIERS[leagueSize]?.TE || 1) * 100).toFixed(0)}%</li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-blue-700">Scoring System:</span>
              {currentLeague ? (
                <ul className="text-blue-600 mt-1 text-xs">
                  <li>Pass Yards: {scoringConfig.getConfig().passing.yards}/yd</li>
                  <li>Pass TDs: {scoringConfig.getConfig().passing.touchdowns}pts</li>
                  <li>Receptions: {scoringConfig.getConfig().receiving.receptions}pts</li>
                  <li>Rush/Rec Yards: {scoringConfig.getConfig().rushing.yards}/yd</li>
                </ul>
              ) : (
                <p className="text-blue-600 mt-1 text-xs">Using default scoring</p>
              )}
            </div>
            <div>
              <span className="font-medium text-blue-700">Age Weighting:</span>
              <p className="text-blue-600 mt-1 text-xs">
                {leagueType === LEAGUE_TYPES.DYNASTY && 'Heavy age premium (30% bonus for youth)'}
                {leagueType === LEAGUE_TYPES.KEEPER && `Keeper premium (${keeperCount} keepers)`}
                {leagueType === LEAGUE_TYPES.REDRAFT && 'Current season focus'}
              </p>
              <p className="text-blue-600 mt-1 text-xs">
                <span className="font-medium">Pick Multiplier:</span> {
                  leagueType === LEAGUE_TYPES.DYNASTY ? '130%' :
                  leagueType === LEAGUE_TYPES.KEEPER ? '115%' : '100%'
                }
              </p>
            </div>
            <div>
              <span className="font-medium text-blue-700">Future Pick Decay:</span>
              <ul className="text-blue-600 mt-1 text-xs">
                <li>Redraft: -15% per year</li>
                <li>Keeper: -10% per year</li>
                <li>Dynasty: -5% per year</li>
              </ul>
              {leagueType === LEAGUE_TYPES.REDRAFT && (
                <p className="text-blue-600 mt-1 text-xs">
                  Week {currentWeek}: -{currentWeek * 4}% season decay
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Team Filters */}
        {selectedTeam && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={selectedTeam.logo} alt={selectedTeam.name} className="h-5 w-5" />
                <span className="text-sm font-medium">{selectedTeam.name} Team Filter</span>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showMyTeamFilter}
                  onChange={(e) => setShowMyTeamFilter(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Show only my team players</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Trade Input */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[
          { key: 'giving', title: '❌ What You\'re Giving Up', color: 'border-red-200 bg-red-50', buttonColor: 'bg-red-500 hover:bg-red-600' },
          { key: 'getting', title: '✅ What You\'re Getting', color: 'border-green-200 bg-green-50', buttonColor: 'bg-green-500 hover:bg-green-600' }
        ].map((side) => (
          <div key={side.key} className={`p-6 rounded-lg shadow-sm border-2 ${side.color}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xl">{side.title}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => addPlayer(side.key)}
                  className={`text-sm text-white px-3 py-1 rounded ${side.buttonColor}`}
                >
                  + Add Player
                </button>
                <button
                  onClick={() => clearSide(side.key)}
                  className="text-sm bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                >
                  Clear
                </button>
              </div>
            </div>
            
            {(side.key === 'giving' ? givingUp : getting).map((player, i) => (
              <PlayerInput
                key={i}
                team={side.key}
                index={i}
                value={player}
                onChange={handleChange}
                onRemove={removePlayer}
                playerValues={playerValues}
                leagueType={leagueType}
                getPlayerValue={getPlayerValue}
                selectedTeam={selectedTeam}
                showMyTeamFilter={showMyTeamFilter}
              />
            ))}
            
            {/* Draft Picks Section */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg">📋 Draft Picks</h3>
                <button
                  onClick={() => addPick(side.key)}
                  className={`text-sm text-white px-3 py-1 rounded ${side.buttonColor}`}
                >
                  + Add Pick
                </button>
              </div>
              
              {(side.key === 'giving' ? givingUpPicks : gettingPicks).map((pick, i) => (
                <PickInput
                  key={i}
                  team={side.key}
                  index={i}
                  pick={pick}
                  onUpdate={updatePick}
                  onRemove={removePick}
                  getPickValue={getPickValue}
                  leagueSize={leagueSize}
                  leagueType={leagueType}
                />
              ))}
            </div>

            {/* Side Total */}
            <div className="mt-4 p-3 bg-white rounded border border-gray-300">
              <div className="font-semibold text-lg">
                Total Value: <span className={side.key === 'giving' ? 'text-red-600' : 'text-green-600'}>
                  {getTotalValue(
                    (side.key === 'giving' ? givingUp : getting).filter(Boolean), 
                    side.key === 'giving' ? givingUpPicks : gettingPicks
                  )}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Players: {getTotalValue((side.key === 'giving' ? givingUp : getting).filter(Boolean))} | 
                Picks: {(side.key === 'giving' ? givingUpPicks : gettingPicks).reduce((sum, pick) => sum + getPickValue(pick), 0)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={rateTrade}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
        >
          📊 Analyze Trade
        </button>
        <button
          onClick={clearTrade}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-semibold"
        >
          🔄 Clear All
        </button>
        {result && (
          <button
            onClick={copyResultToClipboard}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
          >
            📋 Copy Analysis
          </button>
        )}
      </div>

      {/* Trade Result */}
      {result && (
        <div className={`p-6 rounded-lg animate-slide-up mb-8 ${
          result.fairness === 'excellent' ? 'bg-green-50 border-2 border-green-300' :
          result.fairness === 'fair' ? 'bg-blue-50 border-2 border-blue-300' :
          result.fairness === 'slight' ? 'bg-yellow-50 border-2 border-yellow-300' :
          'bg-red-50 border-2 border-red-300'
        }`}>
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold mb-2">{result.verdict}</h3>
            <p className="text-gray-600">{result.recommendation}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-lg text-red-700">❌ Giving Up</h4>
              
              {/* Giving Up Players */}
              {result.playersGiving.length > 0 && (
                <div className="bg-red-50 p-2 rounded border border-red-200">
                  <h5 className="font-medium text-sm text-red-700 mb-2">Players</h5>
                  {result.playersGiving.map((player, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-2 rounded mb-1">
                      <span>{player.name}</span>
                      <span className="font-semibold text-red-600">{player.value}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Giving Up Picks */}
              {result.picksGiving.length > 0 && (
                <div className="bg-red-50 p-2 rounded border border-red-200">
                  <h5 className="font-medium text-sm text-red-700 mb-2">Draft Picks</h5>
                  {result.picksGiving.map((pick, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-2 rounded mb-1">
                      <span>{pick.description}</span>
                      <span className="font-semibold text-red-600">{pick.value}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="font-bold text-lg border-t pt-2">
                Total: <span className="text-red-600">{result.totalGiving}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-lg text-green-700">✅ Getting</h4>
              
              {/* Getting Players */}
              {result.playersGetting.length > 0 && (
                <div className="bg-green-50 p-2 rounded border border-green-200">
                  <h5 className="font-medium text-sm text-green-700 mb-2">Players</h5>
                  {result.playersGetting.map((player, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-2 rounded mb-1">
                      <span>{player.name}</span>
                      <span className="font-semibold text-green-600">{player.value}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Getting Picks */}
              {result.picksGetting.length > 0 && (
                <div className="bg-green-50 p-2 rounded border border-green-200">
                  <h5 className="font-medium text-sm text-green-700 mb-2">Draft Picks</h5>
                  {result.picksGetting.map((pick, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-2 rounded mb-1">
                      <span>{pick.description}</span>
                      <span className="font-semibold text-green-600">{pick.value}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="font-bold text-lg border-t pt-2">
                Total: <span className="text-green-600">{result.totalGetting}</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4 p-3 bg-white rounded">
            <p className="text-sm text-gray-600">
              Value Difference: <span className="font-semibold">{result.diff} points ({result.percentDiff}%)</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Analysis based on {result.leagueName} ({result.leagueType} league)
            </p>
          </div>
        </div>
      )}
      
      {/* Trade History */}
      {tradeHistory.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">📈 Recent Trade Analysis</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {tradeHistory.map((trade, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded border text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{trade.verdict}</span>
                  <span className="text-gray-500">{trade.timestamp.toLocaleTimeString()}</span>
                </div>
                <div className="text-gray-600">
                  Giving: {trade.totalGiving} | Getting: {trade.totalGetting} ({trade.leagueType})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
function PlayerInput({ team, index, value, onChange, onRemove, playerValues, leagueType, getPlayerValue, selectedTeam, showMyTeamFilter }) {
  const playerList = Object.values(playerValues);
  
  // Filter players based on team selection
  const basePlayerList = showMyTeamFilter && selectedTeam 
    ? playerList.filter(p => p.team === selectedTeam.abbr)
    : playerList;

  // Fuse.js config
  const fuse = new Fuse(basePlayerList, {
    keys: ['name', 'team', 'position'],
    threshold: 0.4, // Adjust for strictness
  });

  const filteredItems = value
    ? fuse.search(value).slice(0, 8).map((result) => result.item)
    : basePlayerList.slice(0, 8); // default show top few

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items: filteredItems,
    itemToString: (item) => (item ? item.name : ''),
    inputValue: value,
    onInputValueChange: ({ inputValue }) => {
      onChange(team, index, inputValue);
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        onChange(team, index, selectedItem.name);
      }
    },
  });

  const currentValue = value ? getPlayerValue(value) : 0;
  
  return (
    <div className="relative mb-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            {...getInputProps({
              placeholder: 'Enter player name',
              className: 'w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            })}
          />
          {value && currentValue > 0 && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
              {currentValue}
            </div>
          )}
          <ul
            {...getMenuProps()}
            className={`absolute z-20 bg-white border w-full rounded-md shadow-lg max-h-64 overflow-y-auto ${
              isOpen ? '' : 'hidden'
            }`}
          >
            {isOpen &&
              filteredItems.map((item, idx) => {
                const itemValue = getPlayerValue(item.name);
                return (
                  <li
                    key={`${item.name}-${idx}`}
                    {...getItemProps({ item, index: idx })}
                    className={`p-3 cursor-pointer flex items-center justify-between hover:bg-gray-50 ${
                      highlightedIndex === idx ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) =>
                          (e.target.src = 'https://via.placeholder.com/40?text=?')
                        }
                      />
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          {item.position} – {item.team} – Age {item.age}
                          {item.injuryStatus && item.injuryStatus !== INJURY_STATUS.HEALTHY && (
                            <span className={`ml-2 px-1 py-0.5 rounded text-xs font-semibold ${
                              item.injuryStatus === INJURY_STATUS.QUESTIONABLE ? 'bg-yellow-100 text-yellow-800' :
                              item.injuryStatus === INJURY_STATUS.DOUBTFUL ? 'bg-orange-100 text-orange-800' :
                              item.injuryStatus === INJURY_STATUS.OUT ? 'bg-red-100 text-red-800' :
                              item.injuryStatus === INJURY_STATUS.IR ? 'bg-purple-100 text-purple-800' :
                              item.injuryStatus === INJURY_STATUS.PUP ? 'bg-gray-100 text-gray-800' : ''
                            }`}>
                              {item.injuryStatus.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{itemValue}</div>
                      <div className="text-xs text-gray-500">{leagueType}</div>
                      {selectedTeam && item.team === selectedTeam.abbr && (
                        <div className="text-xs text-green-600 font-semibold">My Team!</div>
                      )}
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
        {value && (
          <button
            onClick={() => onRemove(team, index)}
            className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm"
            title="Remove player"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

function PickInput({ team, index, pick, onUpdate, onRemove, getPickValue, leagueSize, leagueType }) {
  const currentYear = new Date().getFullYear();
  const pickValue = getPickValue(pick);
  
  const getTimingColor = (timing) => {
    switch (timing) {
      case PICK_TIMING.CURRENT_YEAR: return 'text-green-600';
      case PICK_TIMING.NEXT_YEAR: return 'text-yellow-600';
      case PICK_TIMING.FUTURE: return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };
  
  return (
    <div className="bg-green-50 p-3 rounded-lg mb-2 border border-green-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
          <select
            value={pick.year}
            onChange={(e) => onUpdate(team, index, 'year', Number(e.target.value))}
            className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value={currentYear}>{currentYear}</option>
            <option value={currentYear + 1}>{currentYear + 1}</option>
            <option value={currentYear + 2}>{currentYear + 2}</option>
            <option value={currentYear + 3}>{currentYear + 3}</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Round</label>
          <select
            value={pick.round}
            onChange={(e) => onUpdate(team, index, 'round', Number(e.target.value))}
            className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {[...Array(18)].map((_, i) => (
              <option key={i + 1} value={i + 1}>Round {i + 1}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Pick</label>
          <select
            value={pick.position}
            onChange={(e) => onUpdate(team, index, 'position', Number(e.target.value))}
            className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {[...Array(leagueSize)].map((_, i) => (
              <option key={i + 1} value={i + 1}>Pick {i + 1}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={() => onRemove(team, index)}
            className="w-full p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
            title="Remove pick"
          >
            Remove
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="font-medium">Overall Pick {((pick.round - 1) * leagueSize) + pick.position}</span>
          <span className={`ml-2 font-semibold ${getTimingColor(pick.timing)}`}>
            ({pick.timing === PICK_TIMING.CURRENT_YEAR ? 'Current Year' : 
              pick.timing === PICK_TIMING.NEXT_YEAR ? 'Next Year' : 'Future'})
          </span>
        </div>
        <div className="text-right">
          <div className="font-bold text-green-600 text-lg">{pickValue}</div>
          <div className="text-xs text-gray-500">{leagueType} value</div>
        </div>
      </div>
    </div>
  );
}

// Tailwind animation classes
// Add these to your global CSS (index.css or App.css):
/*
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slide-up 0.4s ease-out;
}
*/
