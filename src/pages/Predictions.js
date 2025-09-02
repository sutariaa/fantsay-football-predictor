import { useState, useEffect } from 'react';
import { useTeam } from '../contexts/TeamContext';
import { mockSchedule2025 } from '../data/mockSchedule2025';
import { ScheduleService } from '../services/scheduleService';

// Team strength ratings (1-100 scale)
const TEAM_RATINGS = {
  KC: 95, BUF: 92, SF: 90, DAL: 89, PHI: 88,
  BAL: 87, CIN: 85, MIA: 84, GB: 83, MIN: 82,
  DET: 81, SEA: 80, LAR: 79, LAC: 78, HOU: 77,
  NYJ: 76, NE: 75, PIT: 74, IND: 73, JAX: 72,
  TEN: 71, NO: 70, ATL: 69, TB: 68, LV: 67,
  DEN: 66, CHI: 65, WAS: 64, NYG: 63, CAR: 62, 
  CLE: 61, ARI: 60
};

// Home field advantage points
const HOME_FIELD_ADVANTAGE = 3;

// Calculate win probability using team ratings and home field advantage
const calculateWinProbability = (team1, team2, isTeam1Home) => {
  const team1Rating = TEAM_RATINGS[team1] || 70;
  const team2Rating = TEAM_RATINGS[team2] || 70;
  
  let adjustedTeam1Rating = team1Rating;
  let adjustedTeam2Rating = team2Rating;
  
  // Apply home field advantage
  if (isTeam1Home) {
    adjustedTeam1Rating += HOME_FIELD_ADVANTAGE;
  } else {
    adjustedTeam2Rating += HOME_FIELD_ADVANTAGE;
  }
  
  // Convert rating difference to win probability
  const ratingDiff = adjustedTeam1Rating - adjustedTeam2Rating;
  const winProbability = 50 + (ratingDiff * 0.7); // Each rating point = ~0.7% win probability
  
  return Math.max(5, Math.min(95, winProbability)); // Cap between 5-95%
};

// Generate all matchups for a given week
const generateWeekMatchups = (week, scheduleData) => {
  const matchups = [];
  const processedTeams = new Set();
  
  Object.entries(scheduleData).forEach(([team, schedule]) => {
    if (processedTeams.has(team)) return;
    
    const game = schedule.find(g => g.week === week);
    if (!game) return;
    
    const opponent = game.opponent;
    if (processedTeams.has(opponent)) return;
    
    const homeTeam = game.home ? team : opponent;
    const awayTeam = game.home ? opponent : team;
    
    const homeWinProb = calculateWinProbability(homeTeam, awayTeam, true);
    const favorite = homeWinProb > 50 ? homeTeam : awayTeam;
    const favoriteProb = Math.max(homeWinProb, 100 - homeWinProb);
    
    matchups.push({
      homeTeam,
      awayTeam,
      homeWinProb: Math.round(homeWinProb),
      awayWinProb: Math.round(100 - homeWinProb),
      favorite,
      favoriteProb: Math.round(favoriteProb),
      spread: Math.round((favoriteProb - 50) / 3.5), // Convert probability to point spread
      id: `${homeTeam}-${awayTeam}-${week}`
    });
    
    processedTeams.add(team);
    processedTeams.add(opponent);
  });
  
  return matchups.sort((a, b) => b.favoriteProb - a.favoriteProb);
};

// Get team logo URL
const getTeamLogo = (teamAbbr) => {
  return `https://a.espncdn.com/i/teamlogos/nfl/500/${teamAbbr.toLowerCase()}.png`;
};

export default function Predictions() {
  const { selectedTeam } = useTeam();
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [weekMatchups, setWeekMatchups] = useState([]);
  const [userPicks, setUserPicks] = useState({}); // Store user's predictions
  const [showAllGames, setShowAllGames] = useState(!selectedTeam); // Default to team filter if team is selected
  const [schedule, setSchedule] = useState(mockSchedule2025); // Current schedule data
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);
  
  // Load schedule from API on component mount
  useEffect(() => {
    const loadSchedule = async () => {
      setIsLoadingSchedule(true);
      setScheduleError(null);
      
      try {
        const apiSchedule = await ScheduleService.fetchSeasonSchedule(2025);
        if (Object.keys(apiSchedule).length > 0) {
          setSchedule(apiSchedule);
        }
      } catch (error) {
        console.warn('Failed to load schedule from API, using mock data:', error);
        setScheduleError('Using offline schedule data');
      } finally {
        setIsLoadingSchedule(false);
      }
    };

    loadSchedule();
  }, []);

  useEffect(() => {
    let matchups = generateWeekMatchups(selectedWeek, schedule);
    
    // Filter to only show selected team's games if team filter is active
    if (!showAllGames && selectedTeam) {
      matchups = matchups.filter(matchup => 
        matchup.homeTeam === selectedTeam.abbr || matchup.awayTeam === selectedTeam.abbr
      );
    }
    
    setWeekMatchups(matchups);
  }, [selectedWeek, showAllGames, selectedTeam, schedule]);
  
  const handleUserPick = (matchupId, pickedTeam) => {
    setUserPicks(prev => ({
      ...prev,
      [matchupId]: pickedTeam
    }));
  };
  
  const getConfidenceColor = (prob) => {
    if (prob >= 80) return 'text-green-700 bg-green-100';
    if (prob >= 65) return 'text-blue-700 bg-blue-100';
    if (prob >= 55) return 'text-yellow-700 bg-yellow-100';
    return 'text-gray-700 bg-gray-100';
  };
  
  const getConfidenceText = (prob) => {
    if (prob >= 80) return 'High Confidence';
    if (prob >= 65) return 'Moderate Confidence';
    if (prob >= 55) return 'Low Confidence';
    return 'Toss-up';
  };
  
  // Calculate season predictions summary
  const seasonStats = Object.keys(TEAM_RATINGS).map(team => {
    let wins = 0;
    let totalGames = 0;
    
    const teamSchedule = schedule[team] || [];
    teamSchedule.forEach(game => {
      if (game.opponent !== 'BYE') {
        const winProb = calculateWinProbability(team, game.opponent, game.home);
        wins += winProb / 100;
        totalGames++;
      }
    });
    
    return {
      team,
      rating: TEAM_RATINGS[team],
      projectedWins: Math.round(wins * 10) / 10,
      totalGames
    };
  }).sort((a, b) => b.projectedWins - a.projectedWins);
  
  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded shadow">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-4 text-center text-purple-700">🔮 NFL Predictions</h1>
        <p className="text-center text-gray-600 mb-6">
          AI-powered predictions based on team strength, home field advantage, and historical performance
        </p>
        
        {isLoadingSchedule && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 text-blue-700">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
              Loading live NFL schedule...
            </div>
          </div>
        )}
        
        {scheduleError && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-yellow-50 text-yellow-700 text-sm">
              ⚠️ {scheduleError}
            </div>
          </div>
        )}
      </div>
      
      {/* Team Filter Toggle */}
      {selectedTeam && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={selectedTeam.logo} alt={selectedTeam.name} className="h-8 w-8" />
              <span className="font-semibold text-blue-800">{selectedTeam.name} Schedule</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-700">
                  {showAllGames ? 'Show All Games' : 'My Team Only'}
                </span>
                <button
                  onClick={() => setShowAllGames(!showAllGames)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    showAllGames ? 'bg-gray-400' : 'bg-blue-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showAllGames ? 'translate-x-1' : 'translate-x-6'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Week Selector */}
      <div className="mb-8 bg-gray-50 p-6 rounded-lg">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 w-full text-center">Select Week</label>
          <div className="grid grid-cols-6 md:grid-cols-9 lg:grid-cols-18 gap-2">
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map(week => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`px-3 py-2 rounded-md font-semibold transition-colors ${
                  selectedWeek === week 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-purple-100'
                }`}
              >
                {week}
              </button>
            ))}
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          Week {selectedWeek} • {weekMatchups.length} Game{weekMatchups.length !== 1 ? 's' : ''}
          {!showAllGames && selectedTeam && weekMatchups.length > 0 && (
            <span className="ml-2 text-blue-600">({selectedTeam.name} Schedule)</span>
          )}
        </div>
      </div>
      
      {/* Week Matchups */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Week {selectedWeek} Predictions
          {!showAllGames && selectedTeam && (
            <span className="text-lg font-normal text-blue-600 ml-2">- {selectedTeam.name}</span>
          )}
        </h2>
        
        {weekMatchups.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-500 mb-4">
              {!showAllGames && selectedTeam ? (
                <>
                  <div className="text-lg font-semibold mb-2">{selectedTeam.name} has no games in Week {selectedWeek}</div>
                  <div className="text-sm">This could be a bye week or the season might not extend to this week.</div>
                  <button
                    onClick={() => setShowAllGames(true)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Show All Games This Week
                  </button>
                </>
              ) : (
                <div className="text-lg">No games scheduled for Week {selectedWeek}</div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
          {weekMatchups.map((matchup, index) => (
            <div key={matchup.id} className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500 font-medium">Game {index + 1}</div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  getConfidenceColor(matchup.favoriteProb)
                }`}>
                  {getConfidenceText(matchup.favoriteProb)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                {/* Away Team */}
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={getTeamLogo(matchup.awayTeam)} 
                      alt={matchup.awayTeam} 
                      className="w-12 h-12"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/48?text=' + matchup.awayTeam}
                    />
                    <div>
                      <div className="font-bold text-lg">{matchup.awayTeam}</div>
                      <div className="text-sm text-gray-500">@ {matchup.homeTeam}</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleUserPick(matchup.id, matchup.awayTeam)}
                    className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                      userPicks[matchup.id] === matchup.awayTeam
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-blue-100 border border-gray-300'
                    }`}
                  >
                    Pick
                  </button>
                </div>
                
                {/* Prediction Center */}
                <div className="text-center mx-8">
                  <div className="text-2xl font-bold mb-2">
                    {matchup.awayWinProb}% - {matchup.homeWinProb}%
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {matchup.favorite} by {matchup.spread}
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                    matchup.favorite === matchup.homeTeam ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {matchup.favoriteProb}% Favorite
                  </div>
                </div>
                
                {/* Home Team */}
                <div className="flex items-center space-x-4 flex-1 flex-row-reverse">
                  <div className="flex items-center space-x-3 flex-row-reverse">
                    <img 
                      src={getTeamLogo(matchup.homeTeam)} 
                      alt={matchup.homeTeam} 
                      className="w-12 h-12"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/48?text=' + matchup.homeTeam}
                    />
                    <div className="text-right">
                      <div className="font-bold text-lg">{matchup.homeTeam}</div>
                      <div className="text-sm text-gray-500">vs {matchup.awayTeam}</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleUserPick(matchup.id, matchup.homeTeam)}
                    className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                      userPicks[matchup.id] === matchup.homeTeam
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-blue-100 border border-gray-300'
                    }`}
                  >
                    Pick
                  </button>
                </div>
              </div>
              
              {selectedTeam && (matchup.homeTeam === selectedTeam.abbr || matchup.awayTeam === selectedTeam.abbr) && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <img src={selectedTeam.logo} alt={selectedTeam.name} className="h-5 w-5" />
                    <span className="text-sm font-semibold text-blue-800">Your Team Game!</span>
                    <span className="text-sm text-blue-600">
                      {matchup.homeTeam === selectedTeam.abbr ? 
                        `${matchup.homeWinProb}% chance to win at home` : 
                        `${matchup.awayWinProb}% chance to win on the road`
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        )}
      </div>
      
      {/* Season Projections */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">2025 Season Projections</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {seasonStats.slice(0, 16).map((team, index) => {
            const isSelectedTeam = selectedTeam && team.team === selectedTeam.abbr;
            return (
            <div key={team.team} className={`p-4 rounded-lg border ${
              isSelectedTeam ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-200' :
              index < 4 ? 'bg-green-50 border-green-200' :
              index < 8 ? 'bg-blue-50 border-blue-200' :
              index < 12 ? 'bg-yellow-50 border-yellow-200' :
              'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <img 
                  src={getTeamLogo(team.team)} 
                  alt={team.team} 
                  className="w-8 h-8"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/32?text=' + team.team}
                />
                <div>
                  <div className="font-bold">{team.team}</div>
                  <div className="text-sm text-gray-600">{team.projectedWins}-{(17 - team.projectedWins).toFixed(1)}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-sm font-semibold">#{index + 1}</div>
                  <div className="text-xs text-gray-500">{team.rating}</div>
                </div>
              </div>
              {isSelectedTeam && (
                <div className="mt-2 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                    Your Team
                  </span>
                </div>
              )}
            </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          Rankings based on projected wins • Ratings scale 1-100
        </div>
      </div>
    </div>
  );
}
  