// export default function Home() {
//     return <h1 className="text-2xl font-bold">🏠 Welcome to Fantasy Football Predictor</h1>;
//   }
  
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockSchedule2025 } from '../data/mockSchedule2025';

const teams = [
    { name: 'Arizona Cardinals', abbr: 'ARI', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/ARI' },
    { name: 'Atlanta Falcons', abbr: 'ATL', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/ATL' },
    { name: 'Baltimore Ravens', abbr: 'BAL', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/BAL' },
    { name: 'Buffalo Bills', abbr: 'BUF', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/BUF' },
    { name: 'Carolina Panthers', abbr: 'CAR', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/CAR' },
    { name: 'Chicago Bears', abbr: 'CHI', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/CHI' },
    { name: 'Cincinnati Bengals', abbr: 'CIN', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/CIN' },
    { name: 'Cleveland Browns', abbr: 'CLE', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/CLE' },
    { name: 'Dallas Cowboys', abbr: 'DAL', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/DAL' },
    { name: 'Denver Broncos', abbr: 'DEN', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/DEN' },
    { name: 'Detroit Lions', abbr: 'DET', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/DET' },
    { name: 'Green Bay Packers', abbr: 'GB', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/GB' },
    { name: 'Houston Texans', abbr: 'HOU', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/HOU' },
    { name: 'Indianapolis Colts', abbr: 'IND', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/IND' },
    { name: 'Jacksonville Jaguars', abbr: 'JAX', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/JAX' },
    { name: 'Kansas City Chiefs', abbr: 'KC', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/KC' },
    { name: 'Las Vegas Raiders', abbr: 'LV', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/LV' },
    { name: 'Los Angeles Chargers', abbr: 'LAC', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/LAC' },
    { name: 'Los Angeles Rams', abbr: 'LAR', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/LAR' },
    { name: 'Miami Dolphins', abbr: 'MIA', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/MIA' },
    { name: 'Minnesota Vikings', abbr: 'MIN', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/MIN' },
    { name: 'New England Patriots', abbr: 'NE', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/NE' },
    { name: 'New Orleans Saints', abbr: 'NO', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/NO' },
    { name: 'New York Giants', abbr: 'NYG', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/NYG' },
    { name: 'New York Jets', abbr: 'NYJ', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/NYJ' },
    { name: 'Philadelphia Eagles', abbr: 'PHI', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/PHI' },
    { name: 'Pittsburgh Steelers', abbr: 'PIT', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/PIT' },
    { name: 'San Francisco 49ers', abbr: 'SF', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/SF' },
    { name: 'Seattle Seahawks', abbr: 'SEA', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/SEA' },
    { name: 'Tampa Bay Buccaneers', abbr: 'TB', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/TB' },
    { name: 'Tennessee Titans', abbr: 'TEN', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/TEN' },
    { name: 'Washington Commanders', abbr: 'WAS', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/WAS' }
  ];
  

export default function Home() {
  const [favoriteTeam, setFavoriteTeam] = useState(() => localStorage.getItem('favoriteTeam') || '');
  const [schedule, setSchedule] = useState([]);

  const handleTeamSelect = (teamAbbr) => {
    setFavoriteTeam(teamAbbr);
    localStorage.setItem('favoriteTeam', teamAbbr);
  };

  useEffect(() => {
    if (favoriteTeam){
      setSchedule(mockSchedule2025[favoriteTeam] || []);
    }
  }, [favoriteTeam]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">🏈 Fantasy Football Hub</h1>

      {/* Team Selector */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Select Your Favorite Team</h2>
        <div className="grid grid-cols-4 gap-4">
          {teams.map((team) => (
            <div
              key={team.abbr}
              onClick={() => handleTeamSelect(team.abbr)}
              className={`cursor-pointer p-4 border rounded hover:bg-blue-50 text-center ${
                favoriteTeam === team.abbr ? 'border-blue-500 ring-2 ring-blue-500' : ''
              }`}
            >
              <img src={team.logo} alt={team.name} className="h-12 mx-auto mb-2" />
              <div className="font-medium text-sm">{team.name}</div>
            </div>
          ))}
        </div>
        {favoriteTeam && (
          <div className="mt-4 text-green-700 font-semibold">
            ✅ Favorite Team: {favoriteTeam}
          </div>
        )}
      </div>

      {/* Schedule Viewer Placeholder */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">2025 NFL Schedule (Coming Soon)</h2>
        <p className="text-gray-500">Schedule will appear here. Filter by team or week.</p>
      </div>

      {/* Navigation */}
      <div className="text-center">
        <Link
          to="/trade"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Go to Trade Analyzer
        </Link>
      </div>
    </div>
  );
}
