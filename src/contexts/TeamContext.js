import React, { createContext, useContext, useState, useEffect } from 'react';

const teams = [
  { name: 'Arizona Cardinals', abbr: 'ARI', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/ARI', colors: { primary: '#97233F', secondary: '#FFB612' } },
  { name: 'Atlanta Falcons', abbr: 'ATL', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/ATL', colors: { primary: '#A71930', secondary: '#000000' } },
  { name: 'Baltimore Ravens', abbr: 'BAL', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/BAL', colors: { primary: '#241773', secondary: '#9E7C0C' } },
  { name: 'Buffalo Bills', abbr: 'BUF', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/BUF', colors: { primary: '#00338D', secondary: '#C60C30' } },
  { name: 'Carolina Panthers', abbr: 'CAR', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/CAR', colors: { primary: '#0085CA', secondary: '#101820' } },
  { name: 'Chicago Bears', abbr: 'CHI', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/CHI', colors: { primary: '#0B162A', secondary: '#C83803' } },
  { name: 'Cincinnati Bengals', abbr: 'CIN', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/CIN', colors: { primary: '#FB4F14', secondary: '#000000' } },
  { name: 'Cleveland Browns', abbr: 'CLE', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/CLE', colors: { primary: '#311D00', secondary: '#FF3C00' } },
  { name: 'Dallas Cowboys', abbr: 'DAL', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/DAL', colors: { primary: '#003594', secondary: '#869397' } },
  { name: 'Denver Broncos', abbr: 'DEN', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/DEN', colors: { primary: '#FB4F14', secondary: '#002244' } },
  { name: 'Detroit Lions', abbr: 'DET', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/DET', colors: { primary: '#0076B6', secondary: '#B0B7BC' } },
  { name: 'Green Bay Packers', abbr: 'GB', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/GB', colors: { primary: '#203731', secondary: '#FFB612' } },
  { name: 'Houston Texans', abbr: 'HOU', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/HOU', colors: { primary: '#03202F', secondary: '#A71930' } },
  { name: 'Indianapolis Colts', abbr: 'IND', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/IND', colors: { primary: '#002C5F', secondary: '#A2AAAD' } },
  { name: 'Jacksonville Jaguars', abbr: 'JAX', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/JAX', colors: { primary: '#006778', secondary: '#9F792C' } },
  { name: 'Kansas City Chiefs', abbr: 'KC', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/KC', colors: { primary: '#E31837', secondary: '#FFB81C' } },
  { name: 'Las Vegas Raiders', abbr: 'LV', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/LV', colors: { primary: '#000000', secondary: '#A5ACAF' } },
  { name: 'Los Angeles Chargers', abbr: 'LAC', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/LAC', colors: { primary: '#0080C6', secondary: '#FFC20E' } },
  { name: 'Los Angeles Rams', abbr: 'LAR', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/LAR', colors: { primary: '#003594', secondary: '#FFA300' } },
  { name: 'Miami Dolphins', abbr: 'MIA', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/MIA', colors: { primary: '#008E97', secondary: '#FC4C02' } },
  { name: 'Minnesota Vikings', abbr: 'MIN', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/MIN', colors: { primary: '#4F2683', secondary: '#FFC62F' } },
  { name: 'New England Patriots', abbr: 'NE', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/NE', colors: { primary: '#002244', secondary: '#C60C30' } },
  { name: 'New Orleans Saints', abbr: 'NO', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/NO', colors: { primary: '#D3BC8D', secondary: '#101820' } },
  { name: 'New York Giants', abbr: 'NYG', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/NYG', colors: { primary: '#0B2265', secondary: '#A71930' } },
  { name: 'New York Jets', abbr: 'NYJ', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/NYJ', colors: { primary: '#125740', secondary: '#000000' } },
  { name: 'Philadelphia Eagles', abbr: 'PHI', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/PHI', colors: { primary: '#004C54', secondary: '#A5ACAF' } },
  { name: 'Pittsburgh Steelers', abbr: 'PIT', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/PIT', colors: { primary: '#FFB612', secondary: '#101820' } },
  { name: 'San Francisco 49ers', abbr: 'SF', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/SF', colors: { primary: '#AA0000', secondary: '#B3995D' } },
  { name: 'Seattle Seahawks', abbr: 'SEA', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/SEA', colors: { primary: '#002244', secondary: '#69BE28' } },
  { name: 'Tampa Bay Buccaneers', abbr: 'TB', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/TB', colors: { primary: '#D50A0A', secondary: '#FF7900' } },
  { name: 'Tennessee Titans', abbr: 'TEN', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/TEN', colors: { primary: '#0C2340', secondary: '#4B92DB' } },
  { name: 'Washington Commanders', abbr: 'WAS', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/WAS', colors: { primary: '#5A1414', secondary: '#FFB612' } }
];

const TeamContext = createContext();

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};

export const TeamProvider = ({ children }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [favoriteTeams, setFavoriteTeams] = useState([]);

  useEffect(() => {
    // Load selected team from localStorage
    const savedTeam = localStorage.getItem('selectedTeam');
    const savedFavorites = localStorage.getItem('favoriteTeams');
    
    if (savedTeam) {
      const team = teams.find(t => t.abbr === savedTeam);
      setSelectedTeam(team);
    }
    
    if (savedFavorites) {
      try {
        setFavoriteTeams(JSON.parse(savedFavorites));
      } catch (e) {
        setFavoriteTeams([]);
      }
    }
  }, []);

  const selectTeam = (teamAbbr) => {
    const team = teams.find(t => t.abbr === teamAbbr);
    if (team) {
      setSelectedTeam(team);
      localStorage.setItem('selectedTeam', teamAbbr);
    }
  };

  const addFavoriteTeam = (teamAbbr) => {
    if (!favoriteTeams.includes(teamAbbr)) {
      const newFavorites = [...favoriteTeams, teamAbbr];
      setFavoriteTeams(newFavorites);
      localStorage.setItem('favoriteTeams', JSON.stringify(newFavorites));
    }
  };

  const removeFavoriteTeam = (teamAbbr) => {
    const newFavorites = favoriteTeams.filter(t => t !== teamAbbr);
    setFavoriteTeams(newFavorites);
    localStorage.setItem('favoriteTeams', JSON.stringify(newFavorites));
  };

  const clearSelectedTeam = () => {
    setSelectedTeam(null);
    localStorage.removeItem('selectedTeam');
  };

  const getTeamByAbbr = (abbr) => {
    return teams.find(t => t.abbr === abbr);
  };

  const getAllTeams = () => teams;

  const value = {
    selectedTeam,
    favoriteTeams,
    teams: getAllTeams(),
    selectTeam,
    addFavoriteTeam,
    removeFavoriteTeam,
    clearSelectedTeam,
    getTeamByAbbr
  };

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
};