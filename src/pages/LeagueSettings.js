import React, { useState } from 'react';
import { useLeague } from '../contexts/LeagueContext';

const ScoringSection = ({ title, config, onUpdate, categoryKey }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(config).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
            {typeof value === 'object' ? (
              <div className="space-y-2">
                {Object.entries(value).map(([subKey, subValue]) => (
                  <div key={subKey} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-12">{subKey}</span>
                    <input
                      type="number"
                      step="0.01"
                      value={subValue}
                      onChange={(e) => onUpdate(categoryKey, key, { [subKey]: parseFloat(e.target.value) || 0 })}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <input
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => onUpdate(categoryKey, key, parseFloat(e.target.value) || 0)}
                className="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const LeagueSettings = () => {
  const { 
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
  } = useLeague();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLeagueName, setNewLeagueName] = useState('');
  const [newLeagueType, setNewLeagueType] = useState('redraft');
  const [newLeagueTeamCount, setNewLeagueTeamCount] = useState(12);

  const handleCreateLeague = (e) => {
    e.preventDefault();
    if (newLeagueName.trim()) {
      const league = createLeague({
        name: newLeagueName.trim(),
        type: newLeagueType,
        teamCount: newLeagueTeamCount,
        scoringConfig: scoringConfig.getConfig()
      });
      selectLeague(league.id);
      setNewLeagueName('');
      setShowCreateForm(false);
    }
  };

  const handleScoringUpdate = (category, subcategory, value) => {
    const currentConfig = scoringConfig.getConfig();
    const newConfig = { ...currentConfig };
    
    if (typeof value === 'object') {
      newConfig[category][subcategory] = {
        ...newConfig[category][subcategory],
        ...value
      };
    } else {
      newConfig[category][subcategory] = value;
    }
    
    updateLeagueScoring(newConfig);
  };

  const handleExport = () => {
    const config = exportLeagueConfig();
    if (config) {
      const dataStr = JSON.stringify(config, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentLeague.name.replace(/\s+/g, '_')}_config.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const configData = JSON.parse(event.target.result);
          if (importLeagueConfig(configData)) {
            alert('League configuration imported successfully!');
          } else {
            alert('Failed to import configuration. Please check the file format.');
          }
        } catch (error) {
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!currentLeague) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">League Settings</h2>
          
          {leagues.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Select Existing League</h3>
              <div className="grid gap-3">
                {leagues.map(league => (
                  <div key={league.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <span className="font-medium">{league.name}</span>
                      <span className="ml-2 text-sm text-gray-500">({league.type}, {league.teamCount} teams)</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => selectLeague(league.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Select
                      </button>
                      <button
                        onClick={() => deleteLeague(league.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            {!showCreateForm ? (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                Create New League
              </button>
            ) : (
              <form onSubmit={handleCreateLeague} className="space-y-4">
                <h3 className="text-lg font-semibold">Create New League</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">League Name</label>
                  <input
                    type="text"
                    value={newLeagueName}
                    onChange={(e) => setNewLeagueName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">League Type</label>
                  <select
                    value={newLeagueType}
                    onChange={(e) => setNewLeagueType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="redraft">Redraft</option>
                    <option value="dynasty">Dynasty</option>
                    <option value="keeper">Keeper</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Count</label>
                  <select
                    value={newLeagueTeamCount}
                    onChange={(e) => setNewLeagueTeamCount(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {[8, 10, 12, 14, 16].map(count => (
                      <option key={count} value={count}>{count} teams</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create League
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-3">Import League Configuration</h3>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="mb-4"
            />
            <p className="text-sm text-gray-600">
              Import a previously exported league configuration file.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentConfig = scoringConfig.getConfig();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{currentLeague.name}</h2>
            <p className="text-gray-600">{currentLeague.type} • {currentLeague.teamCount} teams</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Export Config
            </button>
            <button
              onClick={() => {
                selectLeague(null);
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Switch League
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Quick Presets</h3>
        <div className="flex gap-3 flex-wrap">
          {Object.entries(presetConfigs).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPresetConfig(key)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <ScoringSection
        title="Passing"
        config={currentConfig.passing}
        onUpdate={handleScoringUpdate}
        categoryKey="passing"
      />

      <ScoringSection
        title="Rushing"
        config={currentConfig.rushing}
        onUpdate={handleScoringUpdate}
        categoryKey="rushing"
      />

      <ScoringSection
        title="Receiving"
        config={currentConfig.receiving}
        onUpdate={handleScoringUpdate}
        categoryKey="receiving"
      />

      <ScoringSection
        title="Kicking"
        config={currentConfig.kicking}
        onUpdate={handleScoringUpdate}
        categoryKey="kicking"
      />

      <ScoringSection
        title="Defense"
        config={currentConfig.defense}
        onUpdate={handleScoringUpdate}
        categoryKey="defense"
      />

      <ScoringSection
        title="Special Teams"
        config={currentConfig.specialTeams}
        onUpdate={handleScoringUpdate}
        categoryKey="specialTeams"
      />

      <ScoringSection
        title="Miscellaneous"
        config={currentConfig.misc}
        onUpdate={handleScoringUpdate}
        categoryKey="misc"
      />
    </div>
  );
};

export default LeagueSettings;