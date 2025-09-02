import { DEFAULT_SCORING_CONFIG } from '../models/ScoringConfig';

export class ScoringCalculator {
  constructor(scoringConfig = DEFAULT_SCORING_CONFIG) {
    this.config = scoringConfig;
  }

  calculatePassingScore(stats) {
    const { passingYards = 0, passingTDs = 0, twoPointConversions = 0, interceptions = 0 } = stats;
    const config = this.config.passing;
    
    return (
      (passingYards * config.yards) +
      (passingTDs * config.touchdowns) +
      (twoPointConversions * config.twoPointConversions) +
      (interceptions * config.interceptions)
    );
  }

  calculateRushingScore(stats) {
    const { rushingYards = 0, rushingTDs = 0, twoPointConversions = 0 } = stats;
    const config = this.config.rushing;
    
    return (
      (rushingYards * config.yards) +
      (rushingTDs * config.touchdowns) +
      (twoPointConversions * config.twoPointConversions)
    );
  }

  calculateReceivingScore(stats) {
    const { receptions = 0, receivingYards = 0, receivingTDs = 0, twoPointConversions = 0 } = stats;
    const config = this.config.receiving;
    
    return (
      (receptions * config.receptions) +
      (receivingYards * config.yards) +
      (receivingTDs * config.touchdowns) +
      (twoPointConversions * config.twoPointConversions)
    );
  }

  calculateKickingScore(stats) {
    const {
      fieldGoalsMade = {},
      patMade = 0,
      fieldGoalsMissed = 0,
      patMissed = 0
    } = stats;
    const config = this.config.kicking;
    
    let score = 0;
    
    Object.entries(fieldGoalsMade).forEach(([range, count]) => {
      if (config.fieldGoals[range]) {
        score += count * config.fieldGoals[range];
      }
    });
    
    score += patMade * config.patMade;
    score += fieldGoalsMissed * config.fieldGoalMissed;
    score += patMissed * config.patMissed;
    
    return score;
  }

  calculateDefenseScore(stats) {
    const {
      defenseTDs = 0,
      pointsAllowed = 0,
      sacks = 0,
      interceptions = 0,
      fumbleRecoveries = 0,
      safeties = 0,
      forcedFumbles = 0,
      blockedKicks = 0
    } = stats;
    const config = this.config.defense;
    
    let score = 0;
    
    score += defenseTDs * config.touchdowns;
    score += sacks * config.sacks;
    score += interceptions * config.interceptions;
    score += fumbleRecoveries * config.fumbleRecoveries;
    score += safeties * config.safeties;
    score += forcedFumbles * config.forcedFumbles;
    score += blockedKicks * config.blockedKicks;
    
    const pointsAllowedScore = this.getPointsAllowedScore(pointsAllowed);
    score += pointsAllowedScore;
    
    return score;
  }

  getPointsAllowedScore(pointsAllowed) {
    const config = this.config.defense.pointsAllowed;
    
    if (pointsAllowed === 0) return config['0'];
    if (pointsAllowed >= 1 && pointsAllowed <= 6) return config['1-6'];
    if (pointsAllowed >= 7 && pointsAllowed <= 13) return config['7-13'];
    if (pointsAllowed >= 14 && pointsAllowed <= 20) return config['14-20'];
    if (pointsAllowed >= 21 && pointsAllowed <= 27) return config['21-27'];
    if (pointsAllowed >= 28 && pointsAllowed <= 34) return config['28-34'];
    if (pointsAllowed >= 35) return config['35+'];
    
    return 0;
  }

  calculateSpecialTeamsScore(stats) {
    const {
      specialTeamsTDs = 0,
      specialTeamsForcedFumbles = 0,
      specialTeamsFumbleRecoveries = 0,
      specialTeamsPlayerTDs = 0,
      specialTeamsPlayerForcedFumbles = 0,
      specialTeamsPlayerFumbleRecoveries = 0
    } = stats;
    const config = this.config.specialTeams;
    
    let score = 0;
    
    score += specialTeamsTDs * config.defense.touchdowns;
    score += specialTeamsForcedFumbles * config.defense.forcedFumbles;
    score += specialTeamsFumbleRecoveries * config.defense.fumbleRecoveries;
    score += specialTeamsPlayerTDs * config.player.touchdowns;
    score += specialTeamsPlayerForcedFumbles * config.player.forcedFumbles;
    score += specialTeamsPlayerFumbleRecoveries * config.player.fumbleRecoveries;
    
    return score;
  }

  calculateMiscScore(stats) {
    const {
      fumbles = 0,
      fumblesLost = 0,
      fumbleRecoveryTDs = 0
    } = stats;
    const config = this.config.misc;
    
    return (
      (fumbles * config.fumbles) +
      (fumblesLost * config.fumblesLost) +
      (fumbleRecoveryTDs * config.fumbleRecoveryTouchdowns)
    );
  }

  calculateTotalScore(playerStats) {
    const {
      passing = {},
      rushing = {},
      receiving = {},
      kicking = {},
      defense = {},
      specialTeams = {},
      misc = {}
    } = playerStats;

    return (
      this.calculatePassingScore(passing) +
      this.calculateRushingScore(rushing) +
      this.calculateReceivingScore(receiving) +
      this.calculateKickingScore(kicking) +
      this.calculateDefenseScore(defense) +
      this.calculateSpecialTeamsScore(specialTeams) +
      this.calculateMiscScore(misc)
    );
  }

  getScoreBreakdown(playerStats) {
    const {
      passing = {},
      rushing = {},
      receiving = {},
      kicking = {},
      defense = {},
      specialTeams = {},
      misc = {}
    } = playerStats;

    return {
      passing: this.calculatePassingScore(passing),
      rushing: this.calculateRushingScore(rushing),
      receiving: this.calculateReceivingScore(receiving),
      kicking: this.calculateKickingScore(kicking),
      defense: this.calculateDefenseScore(defense),
      specialTeams: this.calculateSpecialTeamsScore(specialTeams),
      misc: this.calculateMiscScore(misc),
      total: this.calculateTotalScore(playerStats)
    };
  }
}

export const validateFieldGoalRange = (distance) => {
  if (distance <= 19) return '0-19';
  if (distance <= 29) return '20-29';
  if (distance <= 39) return '30-39';
  if (distance <= 49) return '40-49';
  return '50+';
};

export const formatScore = (score) => {
  return Math.round(score * 100) / 100;
};