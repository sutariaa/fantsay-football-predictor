// export default function Home() {
//     return <h1 className="text-2xl font-bold">🏠 Welcome to Fantasy Football Predictor</h1>;
//   }
  
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const teams = [
  { name: 'Kansas City Chiefs', abbr: 'KC', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/KC' },
  { name: 'San Francisco 49ers', abbr: 'SF', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/SF' },
  { name: 'Buffalo Bills', abbr: 'BUF', logo: 'https://static.www.nfl.com/t_q-best/league/api/clubs/logos/BUF' },
  // ... add more teams
];

export default function Home() {
  const [favoriteTeam, setFavoriteTeam] = useState(() => localStorage.getItem('favoriteTeam') || '');

  const handleTeamSelect = (teamAbbr) => {
    setFavoriteTeam(teamAbbr);
    localStorage.setItem('favoriteTeam', teamAbbr);
  };

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
