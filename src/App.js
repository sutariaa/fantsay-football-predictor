import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { TeamProvider, useTeam } from './contexts/TeamContext';
import Home from './pages/Home';
import Predictions from './pages/Predictions';
import TradeAnalyzer from './pages/TradeAnalyzer';

function Navigation() {
  const { selectedTeam, clearSelectedTeam } = useTeam();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
              🏈 Home
            </Link>
            <Link to="/predictions" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
              📊 Predictions
            </Link>
            <Link to="/trade-analyzer" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
              🔄 Trade Analyzer
            </Link>
          </div>
          
          {selectedTeam && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
                <img 
                  src={selectedTeam.logo} 
                  alt={selectedTeam.name} 
                  className="w-6 h-6"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <span className="font-semibold text-gray-700">{selectedTeam.name}</span>
              </div>
              <button
                onClick={clearSelectedTeam}
                className="text-red-500 hover:text-red-700 text-sm"
                title="Clear team selection"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <TeamProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/trade-analyzer" element={<TradeAnalyzer />} />
            </Routes>
          </div>
        </div>
      </Router>
    </TeamProvider>
  );
}

export default App;
