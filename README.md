# 🏈 Fantasy Football Trading Hub

A comprehensive React-based fantasy football application designed to help fantasy managers make smarter trades across all league formats - **redraft**, **keeper**, and **dynasty**.

![Fantasy Football Trading Hub](https://img.shields.io/badge/React-18%2B-61DAFB?style=flat-square&logo=react) ![TypeScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)

---

## ✨ Key Features

### 🔄 **Professional Trade Analyzer**
- **Multi-League Support**: Separate valuations for redraft, keeper, and dynasty leagues
- **Smart Age Weighting**: Dynasty values favor younger players for long-term value
- **Comprehensive Analysis**: Detailed trade breakdowns with fairness ratings
- **Real Player Data**: Live player information from Sleeper API
- **Trade History**: Track your recent trade analyses
- **Copy-to-Clipboard**: Share detailed trade summaries

### 🏟️ **Team Management System**
- **32 NFL Teams**: Complete team database with logos and colors
- **Persistent Selection**: Your team choice saved across sessions
- **Favorite Teams**: Star and save multiple favorite teams
- **Team Filtering**: Focus trade analysis on your team's players
- **Division Organization**: Browse teams by AFC/NFC divisions
- **Grid/List Views**: Choose your preferred team selection interface

### 🎯 **Advanced Player Search**
- **Fuzzy Search**: Find players quickly with intelligent text matching
- **Position Filtering**: Filter by QB, RB, WR, TE
- **Team Highlighting**: "My Team" badges for your selected team's players
- **Player Photos**: Visual player identification
- **Real-time Values**: Dynamic player valuations based on league type

### 📊 **League-Specific Valuations**

| League Type | Valuation Focus | Age Impact |
|-------------|-----------------|------------|
| **Redraft** | Current season production | None |
| **Keeper** | 2-3 year outlook | Slight preference for youth |
| **Dynasty** | Long-term value | Heavy age weighting |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/fantasy-football-predictor.git

# Navigate to frontend directory
cd fantasy-football-predictor/frontend

# Install dependencies
npm install

# Start development server
npm start
```

Visit **http://localhost:3000** to access your fantasy football trading hub!

---

## 🎮 How to Use

### 1. **Select Your Team**
- Choose your favorite NFL team on the home page
- Use search or filter by division
- Your selection persists across the entire app

### 2. **Analyze Trades**
- Navigate to the Trade Analyzer
- Set your league type (redraft/keeper/dynasty)
- Add players to both sides of the trade
- Get instant analysis with fairness ratings

### 3. **Make Informed Decisions**
- Review comprehensive trade breakdowns
- Consider age-adjusted values for keeper/dynasty leagues
- Copy detailed analysis to share with league mates

---

## 🛠️ Technical Stack

### Frontend Framework
- **React 19**: Modern component architecture
- **React Router**: Client-side navigation
- **Context API**: Global state management

### Styling & UI
- **Tailwind CSS**: Utility-first styling
- **Responsive Design**: Mobile-first approach
- **Custom Animations**: Smooth transitions and effects

### Data & Search
- **Sleeper API**: Real NFL player database
- **Fuse.js**: Intelligent fuzzy search
- **Downshift**: Accessible dropdown components
- **Axios**: HTTP client for API calls

### Storage & Persistence
- **localStorage**: User preferences and team selections
- **Session Management**: Persistent user experience

---

## 🎯 Trade Analysis Algorithm

Our custom valuation engine considers multiple factors:

```javascript
// Position-based base values
QB: 60-100 points | RB: 50-100 points | WR: 45-90 points | TE: 30-65 points

// League-specific age multipliers
Dynasty: age < 25 ? 1.2x : age < 28 ? 1.0x : age < 30 ? 0.8x : 0.6x
Keeper:  age < 26 ? 1.1x : age < 29 ? 1.0x : 0.85x
Redraft:  No age adjustment (current production focus)
```

### Fairness Ratings
- **🟢 Excellent**: <5 point difference (≤5%)
- **🔵 Fair**: 5-15 point difference (5-15%)
- **🟡 Slight Edge**: 15-25 point difference (15-25%)
- **🔴 Unfair**: >25 point difference (>25%)

---

## 📱 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Create production build |
| `npm test` | Run test suite |
| `npm run lint` | Check code quality |

---

## 🔮 Roadmap

### Short-term Enhancements
- [ ] **Weekly Rankings**: Import expert consensus rankings
- [ ] **Injury Reports**: Real-time injury status integration
- [ ] **Trade Suggestions**: AI-powered trade recommendations
- [ ] **League Integration**: Connect to ESPN/Yahoo leagues

### Long-term Vision
- [ ] **Mobile App**: React Native companion app
- [ ] **Advanced Analytics**: Player trends and projections
- [ ] **Social Features**: Share trades with community
- [ ] **Premium Features**: Advanced metrics and insights

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🏆 What Makes This Special

Unlike other trade analyzers, our system:

- ✅ **Multi-League Awareness**: Different valuations for each league type
- ✅ **Age-Weighted Dynasty**: Smart long-term player evaluation
- ✅ **Team Integration**: Personalized experience based on your team
- ✅ **Professional UI**: Clean, modern interface rivaling premium tools
- ✅ **Free & Open Source**: No subscription fees or paywalls

---

## 📚 API Reference

### Sleeper API Integration
- **Endpoint**: `https://api.sleeper.app/v1/players/nfl`
- **Rate Limit**: No authentication required
- **Data**: 2000+ active NFL players with photos, positions, teams, ages


---

## 🙏 Acknowledgments

- **[Sleeper API](https://docs.sleeper.app/)** - Comprehensive NFL player database
- **[NFL.com](https://www.nfl.com)** - Official team logos and branding  
- **[Fuse.js](https://fusejs.io/)** - Powerful fuzzy search functionality
- **[Downshift](https://github.com/downshift-js/downshift)** - Accessible dropdown components
- **Fantasy Football Community** - For inspiration and feedback

---

<p align="center">
  <strong>Made with ❤️ for the fantasy football community</strong><br>
  <em>May your trades always be fair and your players stay healthy! 🏆</em>
</p>