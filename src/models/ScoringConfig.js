export const DEFAULT_SCORING_CONFIG = {
  passing: {
    yards: 0.04,
    touchdowns: 4,
    twoPointConversions: 2,
    interceptions: -2
  },
  rushing: {
    yards: 0.1,
    touchdowns: 6,
    twoPointConversions: 2
  },
  receiving: {
    receptions: 1,
    yards: 0.1,
    touchdowns: 6,
    twoPointConversions: 2
  },
  kicking: {
    fieldGoals: {
      '0-19': 1,
      '20-29': 2,
      '30-39': 3,
      '40-49': 4,
      '50+': 5
    },
    patMade: 1,
    fieldGoalMissed: -1,
    patMissed: -1
  },
  defense: {
    touchdowns: 6,
    pointsAllowed: {
      '0': 10,
      '1-6': 7,
      '7-13': 4,
      '14-20': 2,
      '21-27': 1,
      '28-34': -1,
      '35+': -4
    },
    sacks: 1,
    interceptions: 2,
    fumbleRecoveries: 1,
    safeties: 2,
    forcedFumbles: 1,
    blockedKicks: 2
  },
  specialTeams: {
    defense: {
      touchdowns: 6,
      forcedFumbles: 1,
      fumbleRecoveries: 1
    },
    player: {
      touchdowns: 6,
      forcedFumbles: 1,
      fumbleRecoveries: 1
    }
  },
  misc: {
    fumbles: -1,
    fumblesLost: -1,
    fumbleRecoveryTouchdowns: 6
  }
};

export const SCORING_CATEGORIES = {
  PASSING: 'passing',
  RUSHING: 'rushing',
  RECEIVING: 'receiving',
  KICKING: 'kicking',
  DEFENSE: 'defense',
  SPECIAL_TEAMS: 'specialTeams',
  MISC: 'misc'
};

export const FIELD_GOAL_RANGES = ['0-19', '20-29', '30-39', '40-49', '50+'];
export const POINTS_ALLOWED_RANGES = ['0', '1-6', '7-13', '14-20', '21-27', '28-34', '35+'];

export class ScoringConfig {
  constructor(config = DEFAULT_SCORING_CONFIG) {
    this.config = { ...config };
  }

  updateCategory(category, subcategory, value) {
    if (!this.config[category]) {
      this.config[category] = {};
    }
    
    if (subcategory) {
      if (!this.config[category][subcategory]) {
        this.config[category][subcategory] = {};
      }
      if (typeof value === 'object') {
        this.config[category][subcategory] = { ...this.config[category][subcategory], ...value };
      } else {
        this.config[category][subcategory] = value;
      }
    } else {
      this.config[category] = value;
    }
  }

  getConfig() {
    return this.config;
  }

  exportConfig() {
    return JSON.stringify(this.config, null, 2);
  }

  importConfig(configString) {
    try {
      const parsedConfig = JSON.parse(configString);
      this.config = { ...DEFAULT_SCORING_CONFIG, ...parsedConfig };
      return true;
    } catch (error) {
      console.error('Invalid scoring configuration:', error);
      return false;
    }
  }

  resetToDefault() {
    this.config = { ...DEFAULT_SCORING_CONFIG };
  }

  validateConfig() {
    const required = ['passing', 'rushing', 'receiving', 'kicking', 'defense'];
    return required.every(category => this.config[category] !== undefined);
  }
}

export const createPresetConfigs = () => ({
  standard: {
    name: 'Standard Scoring',
    config: DEFAULT_SCORING_CONFIG
  },
  ppr: {
    name: 'PPR (Point Per Reception)',
    config: {
      ...DEFAULT_SCORING_CONFIG,
      receiving: {
        ...DEFAULT_SCORING_CONFIG.receiving,
        receptions: 1
      }
    }
  },
  halfPpr: {
    name: 'Half PPR',
    config: {
      ...DEFAULT_SCORING_CONFIG,
      receiving: {
        ...DEFAULT_SCORING_CONFIG.receiving,
        receptions: 0.5
      }
    }
  },
  superFlex: {
    name: 'SuperFlex',
    config: {
      ...DEFAULT_SCORING_CONFIG,
      passing: {
        ...DEFAULT_SCORING_CONFIG.passing,
        touchdowns: 6
      }
    }
  }
});