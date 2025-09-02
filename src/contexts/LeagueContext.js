import React, { createContext, useContext, useState, useEffect } from 'react';
import { ScoringConfig, DEFAULT_SCORING_CONFIG, createPresetConfigs } from '../models/ScoringConfig';

const LeagueContext = createContext();

export const useLeague = () => {
  const context = useContext(LeagueContext);
  if (!context) {
    throw new Error('useLeague must be used within a LeagueProvider');
  }
  return context;
};

export const LeagueProvider = ({ children }) => {
  const [currentLeague, setCurrentLeague] = useState(null);
  const [scoringConfig, setScoringConfig] = useState(new ScoringConfig());
  const [leagues, setLeagues] = useState([]);
  const [presetConfigs] = useState(createPresetConfigs());

  useEffect(() => {
    const savedLeagues = localStorage.getItem('fantasyLeagues');
    const savedCurrentLeague = localStorage.getItem('currentLeague');
    const savedScoringConfig = localStorage.getItem('scoringConfig');
    
    if (savedLeagues) {
      try {
        setLeagues(JSON.parse(savedLeagues));
      } catch (e) {
        setLeagues([]);
      }
    }
    
    if (savedCurrentLeague) {
      try {
        setCurrentLeague(JSON.parse(savedCurrentLeague));
      } catch (e) {
        setCurrentLeague(null);
      }
    }
    
    if (savedScoringConfig) {
      try {
        const config = new ScoringConfig();
        if (config.importConfig(savedScoringConfig)) {
          setScoringConfig(config);
        }
      } catch (e) {
        setScoringConfig(new ScoringConfig());
      }
    }
  }, []);

  const createLeague = (leagueData) => {
    const newLeague = {
      id: Date.now().toString(),
      name: leagueData.name,
      type: leagueData.type || 'redraft',
      teamCount: leagueData.teamCount || 12,
      scoringConfig: leagueData.scoringConfig || DEFAULT_SCORING_CONFIG,
      createdAt: new Date().toISOString()
    };
    
    const updatedLeagues = [...leagues, newLeague];
    setLeagues(updatedLeagues);
    localStorage.setItem('fantasyLeagues', JSON.stringify(updatedLeagues));
    
    return newLeague;
  };

  const selectLeague = (leagueId) => {
    if (leagueId === null) {
      setCurrentLeague(null);
      setScoringConfig(new ScoringConfig());
      localStorage.removeItem('currentLeague');
      localStorage.removeItem('scoringConfig');
      return;
    }
    
    const league = leagues.find(l => l.id === leagueId);
    if (league) {
      setCurrentLeague(league);
      setScoringConfig(new ScoringConfig(league.scoringConfig));
      localStorage.setItem('currentLeague', JSON.stringify(league));
      localStorage.setItem('scoringConfig', JSON.stringify(league.scoringConfig));
    }
  };

  const updateLeagueScoring = (newScoringConfig) => {
    if (!currentLeague) return;
    
    const updatedLeague = {
      ...currentLeague,
      scoringConfig: newScoringConfig
    };
    
    const updatedLeagues = leagues.map(league => 
      league.id === currentLeague.id ? updatedLeague : league
    );
    
    setLeagues(updatedLeagues);
    setCurrentLeague(updatedLeague);
    setScoringConfig(new ScoringConfig(newScoringConfig));
    
    localStorage.setItem('fantasyLeagues', JSON.stringify(updatedLeagues));
    localStorage.setItem('currentLeague', JSON.stringify(updatedLeague));
    localStorage.setItem('scoringConfig', JSON.stringify(newScoringConfig));
  };

  const deleteLeague = (leagueId) => {
    const updatedLeagues = leagues.filter(l => l.id !== leagueId);
    setLeagues(updatedLeagues);
    localStorage.setItem('fantasyLeagues', JSON.stringify(updatedLeagues));
    
    if (currentLeague && currentLeague.id === leagueId) {
      setCurrentLeague(null);
      setScoringConfig(new ScoringConfig());
      localStorage.removeItem('currentLeague');
      localStorage.removeItem('scoringConfig');
    }
  };

  const applyPresetConfig = (presetName) => {
    const preset = presetConfigs[presetName];
    if (preset && currentLeague) {
      updateLeagueScoring(preset.config);
    }
  };

  const exportLeagueConfig = () => {
    if (!currentLeague) return null;
    
    return {
      league: currentLeague,
      scoring: scoringConfig.getConfig()
    };
  };

  const importLeagueConfig = (configData) => {
    try {
      const { league, scoring } = configData;
      const newConfig = new ScoringConfig();
      
      if (newConfig.importConfig(JSON.stringify(scoring))) {
        const importedLeague = createLeague({
          ...league,
          name: `${league.name} (Imported)`,
          scoringConfig: scoring
        });
        selectLeague(importedLeague.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import league config:', error);
      return false;
    }
  };

  const value = {
    currentLeague,
    leagues,
    scoringConfig,
    presetConfigs,
    createLeague,
    selectLeague,
    updateLeagueScoring,
    deleteLeague,
    applyPresetConfig,
    exportLeagueConfig,
    importLeagueConfig
  };

  return (
    <LeagueContext.Provider value={value}>
      {children}
    </LeagueContext.Provider>
  );
};