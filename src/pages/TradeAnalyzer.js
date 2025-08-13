import { useState, useEffect } from 'react';
import { useCombobox } from 'downshift';
import { useTeam } from '../contexts/TeamContext';
import axios from 'axios';
import Fuse from 'fuse.js';

const LEAGUE_TYPES = {
  REDRAFT: 'redraft',
  KEEPER: 'keeper',
  DYNASTY: 'dynasty'
};

const SCORING_FORMATS = {
  PPR: 'ppr',
  HALF_PPR: 'half_ppr',
  STANDARD: 'standard'
};

// League size affects player scarcity and value
const LEAGUE_SIZE_MULTIPLIERS = {
  8: { QB: 0.85, RB: 1.0, WR: 1.0, TE: 0.9 },
  10: { QB: 0.9, RB: 1.05, WR: 1.0, TE: 0.95 },
  12: { QB: 1.0, RB: 1.1, WR: 1.0, TE: 1.0 },
  14: { QB: 1.1, RB: 1.2, WR: 1.05, TE: 1.1 },
  16: { QB: 1.2, RB: 1.3, WR: 1.1, TE: 1.2 },
  18: { QB: 1.3, RB: 1.4, WR: 1.15, TE: 1.3 }
};

// Starter requirements affect positional value
const STARTER_REQUIREMENTS = {
  QB: 1, RB: 2, WR: 2, TE: 1, FLEX: 1 // Standard lineup
};

export default function TradeAnalyzer() {
  const { selectedTeam, getTeamByAbbr } = useTeam();
  const [teamA, setTeamA] = useState(['']);
  const [teamB, setTeamB] = useState(['']);
  const [playerValues, setPlayerValues] = useState({});
  const [result, setResult] = useState(null);
  const [leagueType, setLeagueType] = useState(LEAGUE_TYPES.REDRAFT);
  const [scoringFormat, setScoringFormat] = useState(SCORING_FORMATS.PPR);
  const [loading, setLoading] = useState(false);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [showMyTeamFilter, setShowMyTeamFilter] = useState(false);
  
  // Advanced league configuration
  const [leagueSize, setLeagueSize] = useState(12);
  const [keeperCount, setKeeperCount] = useState(0);
  const [rosterSettings, setRosterSettings] = useState({
    QB: 1, RB: 2, WR: 2, TE: 1, FLEX: 1, BENCH: 6
  });

  // Advanced player valuation system considering league size and keeper settings
  const getPlayerValue = (player, type = leagueType) => {
    if (!playerValues[player]) return 0;
    
    const playerData = playerValues[player];
    const baseValue = playerData.baseValue || 0;
    const age = playerData.age || 25;
    const position = playerData.position;
    
    // Step 1: Apply league size multiplier (scarcity adjustment)
    const sizeMultiplier = LEAGUE_SIZE_MULTIPLIERS[leagueSize] || LEAGUE_SIZE_MULTIPLIERS[12];
    let adjustedValue = baseValue * (sizeMultiplier[position] || 1.0);
    
    // Step 2: Apply positional scarcity based on roster requirements
    const totalStarters = Object.values(rosterSettings).reduce((sum, count) => sum + count, 0) - rosterSettings.BENCH;
    const positionDemand = rosterSettings[position] || 0;
    const flexDemand = position !== 'QB' && position !== 'TE' ? rosterSettings.FLEX * 0.3 : 0; // RB/WR can fill FLEX
    const totalPositionDemand = (positionDemand + flexDemand) * leagueSize;
    
    // Higher demand = higher value multiplier
    const demandMultiplier = position === 'QB' ? 1.0 : 
                            position === 'RB' ? 1.1 + (totalPositionDemand / 100) :
                            position === 'WR' ? 1.0 + (totalPositionDemand / 120) :
                            position === 'TE' ? 1.05 + (totalPositionDemand / 80) : 1.0;
    
    adjustedValue *= demandMultiplier;
    
    // Step 3: Apply age-based multipliers by league type
    let ageMultiplier = 1.0;
    switch (type) {
      case LEAGUE_TYPES.DYNASTY:
        // Dynasty heavily weights age
        ageMultiplier = age < 23 ? 1.3 : age < 25 ? 1.2 : age < 27 ? 1.1 : 
                       age < 29 ? 1.0 : age < 31 ? 0.8 : age < 33 ? 0.6 : 0.4;
        break;
      
      case LEAGUE_TYPES.KEEPER:
        // Keeper considers long-term value based on keeper count
        const keeperPremium = keeperCount / leagueSize; // Higher keeper count = more premium on youth
        const baseKeeperMultiplier = age < 24 ? 1.15 : age < 26 ? 1.1 : age < 28 ? 1.05 : 
                                    age < 30 ? 1.0 : age < 32 ? 0.9 : 0.8;
        ageMultiplier = baseKeeperMultiplier + (keeperPremium * 0.2);
        break;
      
      case LEAGUE_TYPES.REDRAFT:
      default:
        // Redraft focuses on current year, slight penalty for very old players
        ageMultiplier = age > 32 ? 0.95 : age > 30 ? 0.98 : 1.0;
        break;
    }
    
    adjustedValue *= ageMultiplier;
    
    // Step 4: Apply keeper-specific adjustments
    if (type === LEAGUE_TYPES.KEEPER && keeperCount > 0) {
      // Players likely to be kept are more valuable
      const keeperLikelihood = getKeeperLikelihood(playerData, keeperCount, leagueSize);
      adjustedValue *= (1 + keeperLikelihood * 0.15); // Up to 15% bonus for keeper candidates
    }
    
    // Step 5: Apply scoring format adjustments
    if (position === 'WR' || position === 'RB' || position === 'TE') {
      const pprMultiplier = scoringFormat === SCORING_FORMATS.PPR ? 1.1 :
                           scoringFormat === SCORING_FORMATS.HALF_PPR ? 1.05 : 1.0;
      adjustedValue *= pprMultiplier;
    }
    
    return Math.round(adjustedValue);
  };
  
  // Helper function to determine keeper likelihood
  const getKeeperLikelihood = (playerData, keeperCount, leagueSize) => {
    const age = playerData.age || 25;
    const position = playerData.position;
    const baseValue = playerData.baseValue || 0;
    
    // Younger, higher-value players are more likely to be kept
    let likelihood = 0;
    
    // Age factor
    if (age < 25) likelihood += 0.4;
    else if (age < 27) likelihood += 0.3;
    else if (age < 29) likelihood += 0.2;
    else if (age < 31) likelihood += 0.1;
    
    // Value factor (top tier players more likely to be kept)
    const valuePercentile = baseValue / 100; // Assuming max base value around 100
    likelihood += valuePercentile * 0.4;
    
    // Position scarcity factor
    if (position === 'RB') likelihood += 0.1; // RBs age faster, less likely kept long-term
    if (position === 'QB') likelihood += 0.2; // QBs age well
    if (position === 'WR') likelihood += 0.15; // WRs have longevity
    if (position === 'TE') likelihood += 0.1; // TEs develop late
    
    return Math.min(likelihood, 1.0); // Cap at 100%
  };

  useEffect(() => {
    async function fetchPlayers() {
      setLoading(true);
      try {
        const res = await axios.get('https://api.sleeper.app/v1/players/nfl');
        const data = res.data;

        const filtered = Object.values(data).filter(
          (p) => 
            p.active &&
            p.full_name &&
            p.position !== 'DEF' &&
            p.team
        );

        const values = {};
        filtered.forEach((p) => {
          // More realistic value generation based on position and other factors
          let baseValue;
          const position = p.position;
          
          switch (position) {
            case 'QB':
              baseValue = Math.floor(Math.random() * 40) + 60; // 60-100
              break;
            case 'RB':
              baseValue = Math.floor(Math.random() * 50) + 50; // 50-100
              break;
            case 'WR':
              baseValue = Math.floor(Math.random() * 45) + 45; // 45-90
              break;
            case 'TE':
              baseValue = Math.floor(Math.random() * 35) + 30; // 30-65
              break;
            default:
              baseValue = Math.floor(Math.random() * 30) + 20;
          }
          
          values[p.full_name] = {
            name: p.full_name,
            baseValue,
            team: p.team,
            position: p.position,
            age: p.age || Math.floor(Math.random() * 10) + 22, // Random age if not available
            avatar: p.search_rank && p.player_id
              ? `https://sleepercdn.com/content/nfl/players/thumb/${p.player_id}.jpg`
              : null,
          };
        });
        setPlayerValues(values);
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
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
    players.reduce((sum, p) => sum + getPlayerValue(p), 0);

  const rateTrade = () => {
    const filteredA = teamA.filter(Boolean);
    const filteredB = teamB.filter(Boolean);
    
    if (filteredA.length === 0 || filteredB.length === 0) {
      alert('Please add players to both teams');
      return;
    }
    
    const totalA = getTotalValue(filteredA);
    const totalB = getTotalValue(filteredB);
    const diff = Math.abs(totalA - totalB);
    const percentDiff = ((diff / Math.max(totalA, totalB)) * 100).toFixed(1);
    
    let verdict, recommendation, fairness;
    
    if (diff < 5) {
      verdict = 'Excellent Trade';
      recommendation = 'This is a very fair trade for both sides!';
      fairness = 'excellent';
    } else if (diff < 15) {
      verdict = 'Fair Trade';
      recommendation = 'This trade is reasonably balanced.';
      fairness = 'fair';
    } else if (diff < 25) {
      verdict = `${totalA > totalB ? 'Team A' : 'Team B'} wins slightly`;
      recommendation = 'There\'s some imbalance but could work depending on team needs.';
      fairness = 'slight';
    } else {
      verdict = `${totalA > totalB ? 'Team A' : 'Team B'} wins significantly`;
      recommendation = 'This trade heavily favors one side.';
      fairness = 'unfair';
    }
    
    const tradeResult = {
      verdict,
      recommendation,
      fairness,
      totalA,
      totalB,
      diff,
      percentDiff,
      leagueType,
      scoringFormat,
      timestamp: new Date(),
      playersA: filteredA.map(p => ({
        name: p,
        value: getPlayerValue(p),
        ...playerValues[p]
      })),
      playersB: filteredB.map(p => ({
        name: p,
        value: getPlayerValue(p),
        ...playerValues[p]
      }))
    };
    
    setResult(tradeResult);
    setTradeHistory(prev => [tradeResult, ...prev.slice(0, 9)]); // Keep last 10 trades
  };

  const copyResultToClipboard = () => {
    if (!result) return;
    
    const playersAText = result.playersA.map(p => `${p.name} (${p.value})`).join(', ');
    const playersBText = result.playersB.map(p => `${p.name} (${p.value})`).join(', ');
    
    const summary = `🏈 Fantasy Trade Analysis\n\n` +
      `League Type: ${result.leagueType.toUpperCase()}\n` +
      `Scoring: ${result.scoringFormat.toUpperCase()}\n\n` +
      `Team A: ${playersAText}\n` +
      `Team A Total: ${result.totalA}\n\n` +
      `Team B: ${playersBText}\n` +
      `Team B Total: ${result.totalB}\n\n` +
      `Verdict: ${result.verdict}\n` +
      `Difference: ${result.diff} points (${result.percentDiff}%)\n` +
      `Recommendation: ${result.recommendation}`;
    
    navigator.clipboard.writeText(summary);
    alert('Trade analysis copied to clipboard!');
  };
  
  const removePlayer = (team, index) => {
    const updated = team === 'A' ? [...teamA] : [...teamB];
    updated.splice(index, 1);
    if (updated.length === 0) updated.push(''); // Always keep at least one input
    team === 'A' ? setTeamA(updated) : setTeamB(updated);
  };
  
  const clearTeam = (team) => {
    team === 'A' ? setTeamA(['']) : setTeamB(['']);
  };
  
  const clearTrade = () => {
    setTeamA(['']);
    setTeamB(['']);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading player database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow animate-fade-in">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-700">🔄 Fantasy Trade Analyzer</h1>

      {/* Settings */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-6">⚙️ Advanced League Configuration</h3>
        
        {/* Basic Settings Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">League Type</label>
            <select 
              value={leagueType} 
              onChange={(e) => {
                setLeagueType(e.target.value);
                if (e.target.value === LEAGUE_TYPES.REDRAFT) setKeeperCount(0);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={LEAGUE_TYPES.REDRAFT}>Redraft League</option>
              <option value={LEAGUE_TYPES.KEEPER}>Keeper League</option>
              <option value={LEAGUE_TYPES.DYNASTY}>Dynasty League</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">League Size</label>
            <select 
              value={leagueSize} 
              onChange={(e) => setLeagueSize(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={8}>8 Teams</option>
              <option value={10}>10 Teams</option>
              <option value={12}>12 Teams</option>
              <option value={14}>14 Teams</option>
              <option value={16}>16 Teams</option>
              <option value={18}>18 Teams</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scoring Format</label>
            <select 
              value={scoringFormat} 
              onChange={(e) => setScoringFormat(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={SCORING_FORMATS.PPR}>PPR (1.0)</option>
              <option value={SCORING_FORMATS.HALF_PPR}>Half PPR (0.5)</option>
              <option value={SCORING_FORMATS.STANDARD}>Standard (0.0)</option>
            </select>
          </div>
          
          {leagueType === LEAGUE_TYPES.KEEPER && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keeper Count</label>
              <select 
                value={keeperCount} 
                onChange={(e) => setKeeperCount(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={0}>0 Keepers</option>
                <option value={1}>1 Keeper</option>
                <option value={2}>2 Keepers</option>
                <option value={3}>3 Keepers</option>
                <option value={4}>4 Keepers</option>
                <option value={5}>5 Keepers</option>
                <option value={6}>6 Keepers</option>
                <option value={8}>8 Keepers</option>
                <option value={10}>10 Keepers</option>
              </select>
            </div>
          )}
        </div>

        {/* Roster Settings */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3">📋 Roster Configuration</h4>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {Object.entries(rosterSettings).map(([position, count]) => (
              <div key={position}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{position}</label>
                <input
                  type="number"
                  min="0"
                  max={position === 'BENCH' ? 15 : 3}
                  value={count}
                  onChange={(e) => setRosterSettings(prev => ({
                    ...prev,
                    [position]: Number(e.target.value)
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Roster settings affect positional scarcity and player values
          </p>
        </div>

        {/* League Impact Summary */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-md font-semibold text-blue-800 mb-2">📊 League Impact Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-700">Scarcity Multipliers:</span>
              <ul className="text-blue-600 mt-1">
                <li>QB: {((LEAGUE_SIZE_MULTIPLIERS[leagueSize]?.QB || 1) * 100).toFixed(0)}%</li>
                <li>RB: {((LEAGUE_SIZE_MULTIPLIERS[leagueSize]?.RB || 1) * 100).toFixed(0)}%</li>
                <li>WR: {((LEAGUE_SIZE_MULTIPLIERS[leagueSize]?.WR || 1) * 100).toFixed(0)}%</li>
                <li>TE: {((LEAGUE_SIZE_MULTIPLIERS[leagueSize]?.TE || 1) * 100).toFixed(0)}%</li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-blue-700">Positional Demand:</span>
              <ul className="text-blue-600 mt-1">
                <li>QB Needed: {rosterSettings.QB * leagueSize}</li>
                <li>RB Needed: {(rosterSettings.RB + rosterSettings.FLEX * 0.5) * leagueSize}</li>
                <li>WR Needed: {(rosterSettings.WR + rosterSettings.FLEX * 0.5) * leagueSize}</li>
                <li>TE Needed: {rosterSettings.TE * leagueSize}</li>
              </ul>
            </div>
            <div>
              <span className="font-medium text-blue-700">Age Weighting:</span>
              <p className="text-blue-600 mt-1">
                {leagueType === LEAGUE_TYPES.DYNASTY && 'Heavy age premium (up to 30% bonus for youth)'}
                {leagueType === LEAGUE_TYPES.KEEPER && `Keeper premium based on ${keeperCount} keeper${keeperCount !== 1 ? 's' : ''}`}
                {leagueType === LEAGUE_TYPES.REDRAFT && 'Current season focus (minimal age impact)'}
              </p>
            </div>
          </div>
        </div>

        {/* Team Filters */}
        {selectedTeam && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={selectedTeam.logo} alt={selectedTeam.name} className="h-5 w-5" />
                <span className="text-sm font-medium">{selectedTeam.name} Team Filter</span>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showMyTeamFilter}
                  onChange={(e) => setShowMyTeamFilter(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Show only my team players</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Trade Input */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {['A', 'B'].map((team) => (
          <div key={team} className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xl">Team {team}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => addPlayer(team)}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  + Add Player
                </button>
                <button
                  onClick={() => clearTeam(team)}
                  className="text-sm bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                >
                  Clear
                </button>
              </div>
            </div>
            
            {(team === 'A' ? teamA : teamB).map((player, i) => (
              <PlayerInput
                key={i}
                team={team}
                index={i}
                value={player}
                onChange={handleChange}
                onRemove={removePlayer}
                playerValues={playerValues}
                leagueType={leagueType}
                getPlayerValue={getPlayerValue}
                selectedTeam={selectedTeam}
                showMyTeamFilter={showMyTeamFilter}
              />
            ))}
            
            {/* Team Total */}
            <div className="mt-4 p-3 bg-white rounded border">
              <div className="font-semibold text-lg">
                Team {team} Total: <span className="text-blue-600">{getTotalValue((team === 'A' ? teamA : teamB).filter(Boolean))}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={rateTrade}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
        >
          📊 Analyze Trade
        </button>
        <button
          onClick={clearTrade}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-semibold"
        >
          🔄 Clear All
        </button>
        {result && (
          <button
            onClick={copyResultToClipboard}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
          >
            📋 Copy Analysis
          </button>
        )}
      </div>

      {/* Trade Result */}
      {result && (
        <div className={`p-6 rounded-lg animate-slide-up mb-8 ${
          result.fairness === 'excellent' ? 'bg-green-50 border-2 border-green-300' :
          result.fairness === 'fair' ? 'bg-blue-50 border-2 border-blue-300' :
          result.fairness === 'slight' ? 'bg-yellow-50 border-2 border-yellow-300' :
          'bg-red-50 border-2 border-red-300'
        }`}>
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold mb-2">{result.verdict}</h3>
            <p className="text-gray-600">{result.recommendation}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Team A Players</h4>
              {result.playersA.map((player, i) => (
                <div key={i} className="flex justify-between items-center bg-white p-2 rounded">
                  <span>{player.name}</span>
                  <span className="font-semibold text-blue-600">{player.value}</span>
                </div>
              ))}
              <div className="font-bold text-lg border-t pt-2">
                Total: {result.totalA}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Team B Players</h4>
              {result.playersB.map((player, i) => (
                <div key={i} className="flex justify-between items-center bg-white p-2 rounded">
                  <span>{player.name}</span>
                  <span className="font-semibold text-blue-600">{player.value}</span>
                </div>
              ))}
              <div className="font-bold text-lg border-t pt-2">
                Total: {result.totalB}
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4 p-3 bg-white rounded">
            <p className="text-sm text-gray-600">
              Value Difference: <span className="font-semibold">{result.diff} points ({result.percentDiff}%)</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Analysis based on {result.leagueType} league with {result.scoringFormat} scoring
            </p>
          </div>
        </div>
      )}
      
      {/* Trade History */}
      {tradeHistory.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">📈 Recent Trade Analysis</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {tradeHistory.map((trade, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded border text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{trade.verdict}</span>
                  <span className="text-gray-500">{trade.timestamp.toLocaleTimeString()}</span>
                </div>
                <div className="text-gray-600">
                  {trade.totalA} vs {trade.totalB} ({trade.leagueType})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
function PlayerInput({ team, index, value, onChange, onRemove, playerValues, leagueType, getPlayerValue, selectedTeam, showMyTeamFilter }) {
  const playerList = Object.values(playerValues);
  
  // Filter players based on team selection
  const basePlayerList = showMyTeamFilter && selectedTeam 
    ? playerList.filter(p => p.team === selectedTeam.abbr)
    : playerList;

  // Fuse.js config
  const fuse = new Fuse(basePlayerList, {
    keys: ['name', 'team', 'position'],
    threshold: 0.4, // Adjust for strictness
  });

  const filteredItems = value
    ? fuse.search(value).slice(0, 8).map((result) => result.item)
    : basePlayerList.slice(0, 8); // default show top few

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

  const currentValue = value ? getPlayerValue(value) : 0;
  
  return (
    <div className="relative mb-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            {...getInputProps({
              placeholder: 'Enter player name',
              className: 'w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            })}
          />
          {value && currentValue > 0 && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
              {currentValue}
            </div>
          )}
          <ul
            {...getMenuProps()}
            className={`absolute z-20 bg-white border w-full rounded-md shadow-lg max-h-64 overflow-y-auto ${
              isOpen ? '' : 'hidden'
            }`}
          >
            {isOpen &&
              filteredItems.map((item, idx) => {
                const itemValue = getPlayerValue(item.name);
                return (
                  <li
                    key={`${item.name}-${idx}`}
                    {...getItemProps({ item, index: idx })}
                    className={`p-3 cursor-pointer flex items-center justify-between hover:bg-gray-50 ${
                      highlightedIndex === idx ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) =>
                          (e.target.src = 'https://via.placeholder.com/40?text=?')
                        }
                      />
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          {item.position} – {item.team} – Age {item.age}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{itemValue}</div>
                      <div className="text-xs text-gray-500">{leagueType}</div>
                      {selectedTeam && item.team === selectedTeam.abbr && (
                        <div className="text-xs text-green-600 font-semibold">My Team!</div>
                      )}
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
        {value && (
          <button
            onClick={() => onRemove(team, index)}
            className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm"
            title="Remove player"
          >
            ×
          </button>
        )}
      </div>
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
