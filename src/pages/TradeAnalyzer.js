import { useState, useEffect } from 'react';
import { useCombobox } from 'downshift';
import axios from 'axios';

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
        (p) => p.active && p.full_name && p.position !== 'DEF'
      );

      const values = {};
      filtered.forEach((p) => {
        const value = Math.floor(Math.random() * 30) + 70;
        values[p.full_name] = value;
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
    players.reduce((sum, p) => sum + (playerValues[p] || 0), 0);

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

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">🔄 Fantasy Trade Analyzer</h1>

      <div className="grid grid-cols-2 gap-6">
        {['A', 'B'].map((team) => (
          <div key={team}>
            <h2 className="font-semibold text-lg mb-2">Team {team}</h2>
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

      <button
        onClick={rateTrade}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Rate Trade
      </button>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p className="text-lg font-semibold">🔍 Result:</p>
          <p>Team A Value: {result.totalA}</p>
          <p>Team B Value: {result.totalB}</p>
          <p className="mt-2 text-xl font-bold">{result.verdict}</p>
        </div>
      )}
    </div>
  );
}

function PlayerInput({ team, index, value, onChange, playerValues }) {
  const items = Object.keys(playerValues);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items,
    inputValue: value,
    onInputValueChange: ({ inputValue }) => {
      onChange(team, index, inputValue);
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
        className="absolute z-10 bg-white border w-full rounded shadow"
      >
        {isOpen &&
          items
            .filter((item) =>
              item.toLowerCase().includes(value.toLowerCase())
            )
            .slice(0, 6)
            .map((item, idx) => (
              <li
                key={item}
                {...getItemProps({ item, index: idx })}
                className={`p-2 cursor-pointer ${
                  highlightedIndex === idx ? 'bg-gray-200' : ''
                }`}
              >
                {item}
              </li>
            ))}
      </ul>
    </div>
  );
}
