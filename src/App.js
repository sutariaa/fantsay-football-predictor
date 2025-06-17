import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Predictions from './pages/Predictions';
import TradeAnalyzer from './pages/TradeAnalyzer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow p-4 flex gap-6">
          <Link to="/" className="text-blue-600 font-semibold">Home</Link>
          <Link to="/predictions" className="text-blue-600 font-semibold">Predictions</Link>
          <Link to="/trade-analyzer" className="text-blue-600 font-semibold">Trade Analyzer</Link>
        </nav>
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/trade-analyzer" element={<TradeAnalyzer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
