import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTeam } from '../contexts/TeamContext';
import { mockSchedule2025 } from '../data/mockSchedule2025';

export default function Home() {
  const { selectedTeam, favoriteTeams, teams, selectTeam, addFavoriteTeam, removeFavoriteTeam } = useTeam();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const divisions = {
    'AFC East': ['BUF', 'MIA', 'NE', 'NYJ'],
    'AFC North': ['BAL', 'CIN', 'CLE', 'PIT'],
    'AFC South': ['HOU', 'IND', 'JAX', 'TEN'],
    'AFC West': ['DEN', 'KC', 'LAC', 'LV'],
    'NFC East': ['DAL', 'NYG', 'PHI', 'WAS'],
    'NFC North': ['CHI', 'DET', 'GB', 'MIN'],
    'NFC South': ['ATL', 'CAR', 'NO', 'TB'],
    'NFC West': ['ARI', 'LAR', 'SF', 'SEA']
  };

  const handleTeamSelect = (teamAbbr) => {
    selectTeam(teamAbbr);
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.abbr.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedDivision === 'all') return matchesSearch;
    
    return matchesSearch && divisions[selectedDivision].includes(team.abbr);
  });

  const toggleFavorite = (teamAbbr, e) => {
    e.stopPropagation();
    if (favoriteTeams.includes(teamAbbr)) {
      removeFavoriteTeam(teamAbbr);
    } else {
      addFavoriteTeam(teamAbbr);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 text-blue-700">🏈 Fantasy Football Hub</h1>
        <p className="text-xl text-gray-600">Select your team and start analyzing trades like a pro!</p>
      </div>

      {/* Current Team Display */}
      {selectedTeam && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-center gap-4">
            <img src={selectedTeam.logo} alt={selectedTeam.name} className="h-16 w-16" />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">{selectedTeam.name}</h2>
              <p className="text-blue-600 font-semibold">Your Selected Team</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Divisions</option>
              {Object.keys(divisions).map(division => (
                <option key={division} value={division}>{division}</option>
              ))}
            </select>
            
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
        
        {favoriteTeams.length > 0 && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">⭐ Your Favorite Teams:</h3>
            <div className="flex flex-wrap gap-2">
              {favoriteTeams.map(abbr => {
                const team = teams.find(t => t.abbr === abbr);
                return team ? (
                  <span key={abbr} className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    <img src={team.logo} alt={team.name} className="h-4 w-4" />
                    {team.abbr}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>

      {/* Team Selection Grid/List */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Choose Your Team</h2>
        
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredTeams.map((team) => (
              <div
                key={team.abbr}
                onClick={() => handleTeamSelect(team.abbr)}
                className={`relative cursor-pointer p-4 border-2 rounded-lg hover:shadow-lg transition-all duration-200 text-center group ${
                  selectedTeam?.abbr === team.abbr
                    ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <button
                  onClick={(e) => toggleFavorite(team.abbr, e)}
                  className={`absolute top-2 right-2 text-lg ${
                    favoriteTeams.includes(team.abbr) ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  {favoriteTeams.includes(team.abbr) ? '⭐' : '☆'}
                </button>
                
                <img
                  src={team.logo}
                  alt={team.name}
                  className="h-12 w-12 mx-auto mb-2 group-hover:scale-110 transition-transform"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <div className="font-medium text-sm">{team.abbr}</div>
                <div className="text-xs text-gray-500 mt-1">{team.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {Object.entries(divisions).map(([division, teamAbbrs]) => {
              const divisionTeams = teams.filter(team => teamAbbrs.includes(team.abbr));
              const filteredDivisionTeams = divisionTeams.filter(team => 
                filteredTeams.some(ft => ft.abbr === team.abbr)
              );
              
              if (filteredDivisionTeams.length === 0) return null;
              
              return (
                <div key={division} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 font-semibold text-gray-700">
                    {division}
                  </div>
                  <div className="divide-y divide-gray-100">
                    {filteredDivisionTeams.map((team) => (
                      <div
                        key={team.abbr}
                        onClick={() => handleTeamSelect(team.abbr)}
                        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedTeam?.abbr === team.abbr ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={team.logo} alt={team.name} className="h-8 w-8" />
                          <div>
                            <div className="font-semibold">{team.name}</div>
                            <div className="text-sm text-gray-500">{team.abbr}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => toggleFavorite(team.abbr, e)}
                            className={`text-lg ${
                              favoriteTeams.includes(team.abbr) ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                            }`}
                          >
                            {favoriteTeams.includes(team.abbr) ? '⭐' : '☆'}
                          </button>
                          {selectedTeam?.abbr === team.abbr && (
                            <span className="text-blue-600 font-semibold">✓ Selected</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="text-center space-y-4">
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/trade-analyzer"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            🔄 Analyze Trades
          </Link>
          <Link
            to="/predictions"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            📊 View Predictions
          </Link>
        </div>
        
        {selectedTeam && (
          <p className="text-gray-600">
            Ready to analyze trades for the <span className="font-semibold text-blue-600">{selectedTeam.name}</span>!
          </p>
        )}
      </div>
    </div>
  );
}