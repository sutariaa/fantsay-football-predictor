import axios from 'axios';

const API_BASE_URL = 'https://api.sportsblaze.com/nfl/v1/schedule/daily';

export class ScheduleService {
  static async fetchDailySchedule(date) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${date}.json`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch schedule for ${date}:`, error);
      throw error;
    }
  }

  static async fetchWeekSchedule(year, week) {
    const weekDates = this.getWeekDates(year, week);
    const schedulePromises = weekDates.map(date => this.fetchDailySchedule(date));
    
    try {
      const dailySchedules = await Promise.all(schedulePromises);
      return this.mergeDailySchedules(dailySchedules);
    } catch (error) {
      console.error(`Failed to fetch week ${week} schedule:`, error);
      throw error;
    }
  }

  static async fetchSeasonSchedule(year = 2025) {
    const schedule = {};
    
    for (let week = 1; week <= 18; week++) {
      try {
        const weekSchedule = await this.fetchWeekSchedule(year, week);
        this.mergeWeekIntoSeason(schedule, weekSchedule, week);
      } catch (error) {
        console.error(`Failed to fetch week ${week}:`, error);
      }
    }
    
    return schedule;
  }

  static getWeekDates(year, week) {
    // NFL season typically starts first Thursday in September
    const seasonStart = new Date(year, 8, 4); // September 4th, 2025
    const daysToAdd = (week - 1) * 7;
    const weekStart = new Date(seasonStart.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000);
      dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD format
    }
    
    return dates;
  }

  static mergeDailySchedules(dailySchedules) {
    const merged = [];
    dailySchedules.forEach(daySchedule => {
      if (daySchedule && daySchedule.games) {
        merged.push(...daySchedule.games);
      }
    });
    return merged;
  }

  static mergeWeekIntoSeason(seasonSchedule, weekGames, week) {
    weekGames.forEach(game => {
      const homeTeam = this.normalizeTeamName(game.home_team);
      const awayTeam = this.normalizeTeamName(game.away_team);
      
      if (!seasonSchedule[homeTeam]) {
        seasonSchedule[homeTeam] = [];
      }
      if (!seasonSchedule[awayTeam]) {
        seasonSchedule[awayTeam] = [];
      }
      
      seasonSchedule[homeTeam].push({
        week,
        opponent: awayTeam,
        home: true
      });
      
      seasonSchedule[awayTeam].push({
        week,
        opponent: homeTeam,
        home: false
      });
    });
  }

  static normalizeTeamName(teamName) {
    // Map full team names to abbreviations
    const teamMap = {
      'Arizona Cardinals': 'ARI',
      'Atlanta Falcons': 'ATL',
      'Baltimore Ravens': 'BAL',
      'Buffalo Bills': 'BUF',
      'Carolina Panthers': 'CAR',
      'Chicago Bears': 'CHI',
      'Cincinnati Bengals': 'CIN',
      'Cleveland Browns': 'CLE',
      'Dallas Cowboys': 'DAL',
      'Denver Broncos': 'DEN',
      'Detroit Lions': 'DET',
      'Green Bay Packers': 'GB',
      'Houston Texans': 'HOU',
      'Indianapolis Colts': 'IND',
      'Jacksonville Jaguars': 'JAX',
      'Kansas City Chiefs': 'KC',
      'Las Vegas Raiders': 'LV',
      'Los Angeles Chargers': 'LAC',
      'Los Angeles Rams': 'LAR',
      'Miami Dolphins': 'MIA',
      'Minnesota Vikings': 'MIN',
      'New England Patriots': 'NE',
      'New Orleans Saints': 'NO',
      'New York Giants': 'NYG',
      'New York Jets': 'NYJ',
      'Philadelphia Eagles': 'PHI',
      'Pittsburgh Steelers': 'PIT',
      'San Francisco 49ers': 'SF',
      'Seattle Seahawks': 'SEA',
      'Tampa Bay Buccaneers': 'TB',
      'Tennessee Titans': 'TEN',
      'Washington Commanders': 'WAS'
    };
    
    return teamMap[teamName] || teamName;
  }
}