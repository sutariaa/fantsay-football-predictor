import { useState, useEffect } from 'react';
import { useCombobox } from 'downshift';
import axios from 'axios';
import Fuse from 'fuse.js';


export default function TradeAnalyzer() {
  const [teamA, setTeamA] = useState(['']);
  const [teamB, setTeamB] = useState(['']);
  const [playerValues, setPlayerValues] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function fetchPlayers() {
      const res = await axios.get('https://api.sleeper.app/v1/players/nfl');
      const data = res.data;

      const filtered = Object.values(data).filter(
        (p) => 
          p.active &&
          p.full_name &&
          p.position !== 'DEF' &&
          p.team // ensure they have a team
      );

      const values = {};
      filtered.forEach((p) => {
        const value = Math.floor(Math.random() * 30) + 70;
        values[p.full_name] = {
          name: p.full_name,
          value,
          team: p.team,
          position: p.position,
          avatar: p.search_rank && p.player_id
            ? `https://sleepercdn.com/content/nfl/players/thumb/${p.player_id}.jpg`
            : null,
      };
    });
      setPlayerValues(values);
    }

    fetchPlayers();
  }, []);

  const handleChange = (team, index, value) => {
    const updated = team === 'A' ? [...teamA] : [...teamB];
    updated[index] = value;
    team === 'A' ? setTeamA(updated) : setTeamB(updated);
  };

  const addPlayer = (team) => {
    team === 'A' ? setTeamA([...teamA, '']) : setTeamB([...teamB, '']);
  };

  const getTotalValue = (players) =>
    players.reduce((sum, p) => sum + (playerValues[p]?.value || 0), 0);

  const rateTrade = () => {
    const filteredA = teamA.filter(Boolean);
    const filteredB = teamB.filter(Boolean);
    const totalA = getTotalValue(filteredA);
    const totalB = getTotalValue(filteredB);
    const diff = Math.abs(totalA - totalB);

    if (diff < 10) return setResult({ verdict: 'Fair Trade', totalA, totalB });

    setResult({
      verdict: `${totalA > totalB ? 'Team A' : 'Team B'} wins`,
      totalA,
      totalB,
    });
  };

  const copyResultToClipboard = () => {
    if (!result) return;
    const summary = `Trade Verdict: ${result.verdict}\nTeam A Value: ${result.totalA}\nTeam B Value: ${result.totalB}`;
    navigator.clipboard.writeText(summary);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow animate-fade-in">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">🔄 Fantasy Trade Analyzer</h1>

      <div className="grid grid-cols-2 gap-6">
        {['A', 'B'].map((team) => (
          <div key={team} className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-xl mb-3">Team {team}</h2>
            {(team === 'A' ? teamA : teamB).map((player, i) => (
              <PlayerInput
                key={i}
                team={team}
                index={i}
                value={player}
                onChange={handleChange}
                playerValues={playerValues}
              />
            ))}
            <button
              onClick={() => addPlayer(team)}
              className="text-sm text-blue-500 hover:underline"
            >
              + Add Player
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={rateTrade}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Rate Trade
        </button>
        {result && (
          <button
            onClick={copyResultToClipboard}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            📋 Copy Result
          </button>
        )}
      </div>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded animate-slide-up">
          <p className="text-lg font-semibold text-green-700">🔍 Trade Verdict</p>
          <p>Team A Value: <span className="font-medium">{result.totalA}</span></p>
          <p>Team B Value: <span className="font-medium">{result.totalB}</span></p>
          <p className="mt-2 text-xl font-bold text-green-800">{result.verdict}</p>
        </div>
      )}
    </div>
  );
}
function PlayerInput({ team, index, value, onChange, playerValues }) {
  const playerList = Object.values(playerValues);

  // Fuse.js config
  const fuse = new Fuse(playerList, {
    keys: ['name', 'team', 'position'],
    threshold: 0.4, // Adjust for strictness
  });

  const filteredItems = value
    ? fuse.search(value).slice(0, 8).map((result) => result.item)
    : playerList.slice(0, 8); // default show top few

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

  return (
    <div className="relative">
      <input
        {...getInputProps({
          placeholder: 'Enter player name',
          className: 'w-full p-2 border rounded mb-2',
        })}
      />
      <ul
        {...getMenuProps()}
        className={`absolute z-10 bg-white border w-full rounded shadow max-h-64 overflow-y-auto ${
          isOpen ? '' : 'hidden'
        }`}
      >
        {isOpen &&
          filteredItems.map((item, idx) => (
            <li
              key={`${item.name}-${idx}`}
              {...getItemProps({ item, index: idx })}
              className={`p-2 cursor-pointer flex items-center gap-3 ${
                highlightedIndex === idx ? 'bg-gray-200' : ''
              }`}
            >
              <img
                src={item.avatar}
                alt={item.name}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) =>
                  (e.target.src = 'https://via.placeholder.com/32?text=?')
                }
              />
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-xs text-gray-600">
                  {item.position} – {item.team}
                </div>
              </div>
            </li>
          ))}
      </ul>
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
