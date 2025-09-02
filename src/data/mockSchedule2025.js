// Based on official ESPN 2025 NFL Schedule
export const mockSchedule2025 = {
    ARI: [
      { week: 1, opponent: 'NO', home: false },  // @ New Orleans Saints
      { week: 2, opponent: 'CAR', home: true },  // vs Carolina Panthers
      { week: 3, opponent: 'SF', home: false },  // @ San Francisco 49ers
      { week: 4, opponent: 'SEA', home: true },  // vs Seattle Seahawks
      { week: 5, opponent: 'TEN', home: true },  // vs Tennessee Titans
      { week: 6, opponent: 'IND', home: true },  // vs Indianapolis Colts
      { week: 7, opponent: 'GB', home: false },  // @ Green Bay Packers
      { week: 8, opponent: 'BYE', home: null },  // Bye week
      { week: 9, opponent: 'DAL', home: false }, // @ Dallas Cowboys
      { week: 10, opponent: 'SEA', home: false }, // @ Seattle Seahawks
      { week: 11, opponent: 'SF', home: true },  // vs San Francisco 49ers
      { week: 12, opponent: 'JAX', home: true }, // vs Jacksonville Jaguars
      { week: 13, opponent: 'TB', home: false }, // @ Tampa Bay Buccaneers
      { week: 14, opponent: 'LAR', home: false }, // @ Los Angeles Rams
      { week: 15, opponent: 'HOU', home: false }, // @ Houston Texans
      { week: 16, opponent: 'ATL', home: true }, // vs Atlanta Falcons
      { week: 17, opponent: 'BYE', home: null },  // Bye week
      { week: 18, opponent: 'LAR', home: false }, // @ Los Angeles Rams
    ],
    ATL: [
      { week: 1, opponent: 'TB', home: true },   // vs Tampa Bay Buccaneers
      { week: 2, opponent: 'MIN', home: false }, // @ Minnesota Vikings
      { week: 3, opponent: 'CAR', home: true },  // vs Carolina Panthers
      { week: 4, opponent: 'WAS', home: false }, // @ Washington Commanders
      { week: 5, opponent: 'BYE', home: null },  // Bye week
      { week: 6, opponent: 'BUF', home: false }, // @ Buffalo Bills
      { week: 7, opponent: 'SF', home: false },  // @ San Francisco 49ers
      { week: 8, opponent: 'MIA', home: true },  // vs Miami Dolphins
      { week: 9, opponent: 'NE', home: false },  // @ New England Patriots
      { week: 10, opponent: 'IND', home: false }, // @ Indianapolis Colts (Berlin)
      { week: 11, opponent: 'CAR', home: false }, // @ Carolina Panthers
      { week: 12, opponent: 'NO', home: false }, // @ New Orleans Saints
      { week: 13, opponent: 'BYE', home: null },  // Bye week
      { week: 14, opponent: 'SEA', home: true }, // vs Seattle Seahawks
      { week: 15, opponent: 'TB', home: false }, // @ Tampa Bay Buccaneers
      { week: 16, opponent: 'ARI', home: false }, // @ Arizona Cardinals
      { week: 17, opponent: 'LAR', home: false }, // @ Los Angeles Rams
      { week: 18, opponent: 'NO', home: true },  // vs New Orleans Saints
    ],
    BAL: [
      { week: 1, opponent: 'BUF', home: false }, // @ Buffalo Bills
      { week: 2, opponent: 'CLE', home: true },  // vs Cleveland Browns
      { week: 3, opponent: 'DET', home: false }, // @ Detroit Lions
      { week: 4, opponent: 'KC', home: false },  // @ Kansas City Chiefs
      { week: 5, opponent: 'HOU', home: false }, // @ Houston Texans
      { week: 6, opponent: 'LAR', home: false }, // @ Los Angeles Rams
      { week: 7, opponent: 'BYE', home: null },  // Bye week
      { week: 8, opponent: 'CHI', home: true },  // vs Chicago Bears
      { week: 9, opponent: 'MIA', home: false }, // @ Miami Dolphins
      { week: 10, opponent: 'MIN', home: true }, // vs Minnesota Vikings
      { week: 11, opponent: 'CLE', home: false }, // @ Cleveland Browns
      { week: 12, opponent: 'NYJ', home: true }, // vs New York Jets
      { week: 13, opponent: 'CIN', home: true }, // vs Cincinnati Bengals
      { week: 14, opponent: 'PIT', home: true }, // vs Pittsburgh Steelers
      { week: 15, opponent: 'CIN', home: false }, // @ Cincinnati Bengals
      { week: 16, opponent: 'NE', home: true },  // vs New England Patriots
      { week: 17, opponent: 'BYE', home: null },  // Bye week
      { week: 18, opponent: 'PIT', home: false }, // @ Pittsburgh Steelers
    ],
    BUF: [
      { week: 1, opponent: 'BAL', home: true },  // vs Baltimore Ravens
      { week: 2, opponent: 'NYJ', home: false }, // @ New York Jets
      { week: 3, opponent: 'MIA', home: true },  // vs Miami Dolphins
      { week: 4, opponent: 'NO', home: false },  // @ New Orleans Saints
      { week: 5, opponent: 'NE', home: false },  // @ New England Patriots
      { week: 6, opponent: 'ATL', home: true },  // vs Atlanta Falcons
      { week: 7, opponent: 'BYE', home: null },  // Bye week
      { week: 8, opponent: 'CAR', home: true },  // vs Carolina Panthers
      { week: 9, opponent: 'KC', home: false },  // @ Kansas City Chiefs
      { week: 10, opponent: 'MIA', home: true }, // vs Miami Dolphins
      { week: 11, opponent: 'TB', home: true },  // vs Tampa Bay Buccaneers
      { week: 12, opponent: 'HOU', home: false }, // @ Houston Texans
      { week: 13, opponent: 'PIT', home: false }, // @ Pittsburgh Steelers
      { week: 14, opponent: 'CIN', home: false }, // @ Cincinnati Bengals
      { week: 15, opponent: 'NE', home: true },  // vs New England Patriots
      { week: 16, opponent: 'CLE', home: true }, // vs Cleveland Browns
      { week: 17, opponent: 'PHI', home: false }, // @ Philadelphia Eagles
      { week: 18, opponent: 'NYJ', home: false }, // @ New York Jets
    ],
    CAR: [
      { week: 1, opponent: 'JAX', home: false }, // @ Jacksonville Jaguars
      { week: 2, opponent: 'ARI', home: false }, // @ Arizona Cardinals
      { week: 3, opponent: 'ATL', home: false }, // @ Atlanta Falcons
      { week: 4, opponent: 'NE', home: false },  // @ New England Patriots
      { week: 5, opponent: 'MIA', home: false }, // @ Miami Dolphins
      { week: 6, opponent: 'DAL', home: false }, // @ Dallas Cowboys
      { week: 7, opponent: 'NYJ', home: false }, // @ New York Jets
      { week: 8, opponent: 'BUF', home: false }, // @ Buffalo Bills
      { week: 9, opponent: 'GB', home: false },  // @ Green Bay Packers
      { week: 10, opponent: 'NO', home: true },  // vs New Orleans Saints
      { week: 11, opponent: 'ATL', home: true }, // vs Atlanta Falcons
      { week: 12, opponent: 'SF', home: false }, // @ San Francisco 49ers
      { week: 13, opponent: 'LAR', home: false }, // @ Los Angeles Rams
      { week: 14, opponent: 'BYE', home: null },  // Bye week
      { week: 15, opponent: 'NO', home: false }, // @ New Orleans Saints
      { week: 16, opponent: 'TB', home: false }, // @ Tampa Bay Buccaneers
      { week: 17, opponent: 'BYE', home: null },  // Bye week
      { week: 18, opponent: 'TB', home: false }, // @ Tampa Bay Buccaneers
    ],
    CHI: [
      { week: 1, opponent: 'MIN', home: true },  // vs Minnesota Vikings
      { week: 2, opponent: 'DET', home: false }, // @ Detroit Lions
      { week: 3, opponent: 'DAL', home: false }, // @ Dallas Cowboys
      { week: 4, opponent: 'LV', home: false },  // @ Las Vegas Raiders
      { week: 5, opponent: 'BYE', home: null },  // Bye week
      { week: 6, opponent: 'WAS', home: false }, // @ Washington Commanders
      { week: 7, opponent: 'NO', home: false },  // @ New Orleans Saints
      { week: 8, opponent: 'BAL', home: false }, // @ Baltimore Ravens
      { week: 9, opponent: 'CIN', home: false }, // @ Cincinnati Bengals
      { week: 10, opponent: 'NYG', home: false }, // @ New York Giants
      { week: 11, opponent: 'MIN', home: false }, // @ Minnesota Vikings
      { week: 12, opponent: 'PIT', home: false }, // @ Pittsburgh Steelers
      { week: 13, opponent: 'PHI', home: false }, // @ Philadelphia Eagles
      { week: 14, opponent: 'GB', home: false }, // @ Green Bay Packers
      { week: 15, opponent: 'CLE', home: false }, // @ Cleveland Browns
      { week: 16, opponent: 'GB', home: true },  // vs Green Bay Packers
      { week: 17, opponent: 'SF', home: false }, // @ San Francisco 49ers
      { week: 18, opponent: 'DET', home: false }, // @ Detroit Lions
    ],
    CIN: [
      { week: 1, opponent: 'CLE', home: false }, // @ Cleveland Browns
      { week: 2, opponent: 'JAX', home: true },  // vs Jacksonville Jaguars
      { week: 3, opponent: 'MIN', home: false }, // @ Minnesota Vikings
      { week: 4, opponent: 'DEN', home: false }, // @ Denver Broncos
      { week: 5, opponent: 'DET', home: false }, // @ Detroit Lions
      { week: 6, opponent: 'GB', home: false },  // @ Green Bay Packers
      { week: 7, opponent: 'PIT', home: true },  // vs Pittsburgh Steelers
      { week: 8, opponent: 'NYJ', home: false }, // @ New York Jets
      { week: 9, opponent: 'CHI', home: true },  // vs Chicago Bears
      { week: 10, opponent: 'BYE', home: null }, // Bye week
      { week: 11, opponent: 'PIT', home: false }, // @ Pittsburgh Steelers
      { week: 12, opponent: 'NE', home: false }, // @ New England Patriots
      { week: 13, opponent: 'BAL', home: false }, // @ Baltimore Ravens
      { week: 14, opponent: 'BUF', home: true }, // vs Buffalo Bills
      { week: 15, opponent: 'BAL', home: true }, // vs Baltimore Ravens
      { week: 16, opponent: 'MIA', home: false }, // @ Miami Dolphins
      { week: 17, opponent: 'BYE', home: null },  // Bye week
      { week: 18, opponent: 'CLE', home: true }, // vs Cleveland Browns
    ],
    CLE: [
      { week: 1, opponent: 'CIN', home: true },  // vs Cincinnati Bengals
      { week: 2, opponent: 'BAL', home: false }, // @ Baltimore Ravens
      { week: 3, opponent: 'GB', home: false },  // @ Green Bay Packers
      { week: 4, opponent: 'DET', home: false }, // @ Detroit Lions
      { week: 5, opponent: 'MIN', home: true },  // vs Minnesota Vikings (London)
      { week: 6, opponent: 'PIT', home: false }, // @ Pittsburgh Steelers
      { week: 7, opponent: 'MIA', home: true },  // vs Miami Dolphins
      { week: 8, opponent: 'NE', home: true },   // vs New England Patriots
      { week: 9, opponent: 'BYE', home: null },  // Bye week
      { week: 10, opponent: 'NYJ', home: false }, // @ New York Jets
      { week: 11, opponent: 'BAL', home: true }, // vs Baltimore Ravens
      { week: 12, opponent: 'LV', home: true },  // vs Las Vegas Raiders
      { week: 13, opponent: 'SF', home: false }, // @ San Francisco 49ers
      { week: 14, opponent: 'TEN', home: false }, // @ Tennessee Titans
      { week: 15, opponent: 'CHI', home: true }, // vs Chicago Bears
      { week: 16, opponent: 'BUF', home: false }, // @ Buffalo Bills
      { week: 17, opponent: 'PIT', home: false }, // @ Pittsburgh Steelers
      { week: 18, opponent: 'CIN', home: false }, // @ Cincinnati Bengals
    ],
    DAL: [
      { week: 1, opponent: 'PHI', home: false }, // @ Philadelphia Eagles
      { week: 2, opponent: 'NYG', home: true },  // vs New York Giants
      { week: 3, opponent: 'CHI', home: true },  // vs Chicago Bears
      { week: 4, opponent: 'GB', home: false },  // @ Green Bay Packers
      { week: 5, opponent: 'NYJ', home: true },  // vs New York Jets
      { week: 6, opponent: 'CAR', home: true },  // vs Carolina Panthers
      { week: 7, opponent: 'WAS', home: false }, // @ Washington Commanders
      { week: 8, opponent: 'DEN', home: false }, // @ Denver Broncos
      { week: 9, opponent: 'ARI', home: true },  // vs Arizona Cardinals
      { week: 10, opponent: 'BYE', home: null }, // Bye week
      { week: 11, opponent: 'LV', home: false }, // @ Las Vegas Raiders
      { week: 12, opponent: 'PHI', home: false }, // @ Philadelphia Eagles
      { week: 13, opponent: 'KC', home: false }, // @ Kansas City Chiefs
      { week: 14, opponent: 'DET', home: false }, // @ Detroit Lions
      { week: 15, opponent: 'MIN', home: false }, // @ Minnesota Vikings
      { week: 16, opponent: 'LAC', home: true }, // vs Los Angeles Chargers
      { week: 17, opponent: 'WAS', home: false }, // @ Washington Commanders
      { week: 18, opponent: 'NYG', home: false }, // @ New York Giants
    ],
    DEN: [
      { week: 1, opponent: 'TEN', home: true },  // vs Tennessee Titans
      { week: 2, opponent: 'IND', home: false }, // @ Indianapolis Colts
      { week: 3, opponent: 'LAC', home: false }, // @ Los Angeles Chargers
      { week: 4, opponent: 'CIN', home: true },  // vs Cincinnati Bengals
      { week: 5, opponent: 'PHI', home: false }, // @ Philadelphia Eagles
      { week: 6, opponent: 'NYJ', home: true },  // vs New York Jets (London)
      { week: 7, opponent: 'NYG', home: false }, // @ New York Giants
      { week: 8, opponent: 'DAL', home: true },  // vs Dallas Cowboys
      { week: 9, opponent: 'HOU', home: false }, // @ Houston Texans
      { week: 10, opponent: 'LV', home: false }, // @ Las Vegas Raiders
      { week: 11, opponent: 'KC', home: false }, // @ Kansas City Chiefs
      { week: 12, opponent: 'BYE', home: null }, // Bye week
      { week: 13, opponent: 'WAS', home: false }, // @ Washington Commanders
      { week: 14, opponent: 'LV', home: true },  // vs Las Vegas Raiders
      { week: 15, opponent: 'GB', home: false }, // @ Green Bay Packers
      { week: 16, opponent: 'JAX', home: false }, // @ Jacksonville Jaguars
      { week: 17, opponent: 'KC', home: true },  // vs Kansas City Chiefs
      { week: 18, opponent: 'LAC', home: false }, // @ Los Angeles Chargers
    ],
    DET: [
      { week: 1, opponent: 'GB', home: false },  // @ Green Bay Packers
      { week: 2, opponent: 'CHI', home: true },  // vs Chicago Bears
      { week: 3, opponent: 'BAL', home: true },  // vs Baltimore Ravens
      { week: 4, opponent: 'CLE', home: true },  // vs Cleveland Browns
      { week: 5, opponent: 'CIN', home: true },  // vs Cincinnati Bengals
      { week: 6, opponent: 'KC', home: false },  // @ Kansas City Chiefs
      { week: 7, opponent: 'TB', home: false },  // @ Tampa Bay Buccaneers
      { week: 8, opponent: 'BYE', home: null },  // Bye week
      { week: 9, opponent: 'MIN', home: false }, // @ Minnesota Vikings
      { week: 10, opponent: 'WAS', home: false }, // @ Washington Commanders
      { week: 11, opponent: 'PHI', home: false }, // @ Philadelphia Eagles
      { week: 12, opponent: 'NYG', home: false }, // @ New York Giants
      { week: 13, opponent: 'GB', home: false }, // @ Green Bay Packers
      { week: 14, opponent: 'DAL', home: true }, // vs Dallas Cowboys
      { week: 15, opponent: 'LAR', home: true }, // vs Los Angeles Rams
      { week: 16, opponent: 'PIT', home: false }, // @ Pittsburgh Steelers
      { week: 17, opponent: 'MIN', home: true }, // vs Minnesota Vikings
      { week: 18, opponent: 'CHI', home: true }, // vs Chicago Bears
    ],
    GB: [
      { week: 1, opponent: 'DET', home: true },  // vs Detroit Lions
      { week: 2, opponent: 'WAS', home: false }, // @ Washington Commanders
      { week: 3, opponent: 'CLE', home: true },  // vs Cleveland Browns
      { week: 4, opponent: 'DAL', home: true },  // vs Dallas Cowboys
      { week: 5, opponent: 'BYE', home: null },  // Bye week
      { week: 6, opponent: 'CIN', home: true },  // vs Cincinnati Bengals
      { week: 7, opponent: 'ARI', home: true },  // vs Arizona Cardinals
      { week: 8, opponent: 'PIT', home: false }, // @ Pittsburgh Steelers
      { week: 9, opponent: 'CAR', home: true },  // vs Carolina Panthers
      { week: 10, opponent: 'PHI', home: false }, // @ Philadelphia Eagles
      { week: 11, opponent: 'NYG', home: false }, // @ New York Giants
      { week: 12, opponent: 'MIN', home: false }, // @ Minnesota Vikings
      { week: 13, opponent: 'DET', home: true }, // vs Detroit Lions
      { week: 14, opponent: 'CHI', home: true }, // vs Chicago Bears
      { week: 15, opponent: 'DEN', home: true }, // vs Denver Broncos
      { week: 16, opponent: 'CHI', home: false }, // @ Chicago Bears
      { week: 17, opponent: 'BYE', home: null },  // Bye week
      { week: 18, opponent: 'MIN', home: false }, // @ Minnesota Vikings
    ],
    HOU: [
      { week: 1, opponent: 'LAR', home: false }, // @ Los Angeles Rams
      { week: 2, opponent: 'TB', home: true },   // vs Tampa Bay Buccaneers
      { week: 3, opponent: 'JAX', home: false }, // @ Jacksonville Jaguars
      { week: 4, opponent: 'TEN', home: false }, // @ Tennessee Titans
      { week: 5, opponent: 'BAL', home: true },  // vs Baltimore Ravens
      { week: 6, opponent: 'BYE', home: null },  // Bye week
      { week: 7, opponent: 'SEA', home: false }, // @ Seattle Seahawks
      { week: 8, opponent: 'SF', home: false },  // @ San Francisco 49ers
      { week: 9, opponent: 'DEN', home: true },  // vs Denver Broncos
      { week: 10, opponent: 'JAX', home: false }, // @ Jacksonville Jaguars
      { week: 11, opponent: 'TEN', home: false }, // @ Tennessee Titans
      { week: 12, opponent: 'BUF', home: true }, // vs Buffalo Bills
      { week: 13, opponent: 'BYE', home: null },  // Bye week
      { week: 14, opponent: 'KC', home: false }, // @ Kansas City Chiefs
      { week: 15, opponent: 'ARI', home: true }, // vs Arizona Cardinals
      { week: 16, opponent: 'LV', home: false }, // @ Las Vegas Raiders
      { week: 17, opponent: 'BYE', home: null },  // Bye week
      { week: 18, opponent: 'IND', home: false }, // @ Indianapolis Colts
    ],
    IND: [
      { week: 1, opponent: 'MIA', home: true },  // vs Miami Dolphins
      { week: 2, opponent: 'DEN', home: true },  // vs Denver Broncos
      { week: 3, opponent: 'TEN', home: false }, // @ Tennessee Titans
      { week: 4, opponent: 'LAR', home: false }, // @ Los Angeles Rams
      { week: 5, opponent: 'LV', home: false },  // @ Las Vegas Raiders
      { week: 6, opponent: 'ARI', home: false }, // @ Arizona Cardinals
      { week: 7, opponent: 'LAC', home: false }, // @ Los Angeles Chargers
      { week: 8, opponent: 'TEN', home: false }, // @ Tennessee Titans
      { week: 9, opponent: 'PIT', home: false }, // @ Pittsburgh Steelers
      { week: 10, opponent: 'ATL', home: true }, // vs Atlanta Falcons (Berlin)
      { week: 11, opponent: 'BYE', home: null }, // Bye week
      { week: 12, opponent: 'KC', home: false }, // @ Kansas City Chiefs
      { week: 13, opponent: 'HOU', home: false }, // @ Houston Texans
      { week: 14, opponent: 'JAX', home: false }, // @ Jacksonville Jaguars
      { week: 15, opponent: 'BYE', home: null },  // Bye week
      { week: 16, opponent: 'SF', home: false }, // @ San Francisco 49ers
      { week: 17, opponent: 'JAX', home: false }, // @ Jacksonville Jaguars
      { week: 18, opponent: 'HOU', home: true }, // vs Houston Texans
    ],
    JAX: [
      { week: 1, opponent: 'CAR', home: true },  // vs Carolina Panthers
      { week: 2, opponent: 'CIN', home: false }, // @ Cincinnati Bengals
      { week: 3, opponent: 'HOU', home: true },  // vs Houston Texans
      { week: 4, opponent: 'SF', home: false },  // @ San Francisco 49ers
      { week: 5, opponent: 'KC', home: false },  // @ Kansas City Chiefs
      { week: 6, opponent: 'SEA', home: false }, // @ Seattle Seahawks
      { week: 7, opponent: 'LAR', home: false }, // @ Los Angeles Rams (London)
      { week: 8, opponent: 'BYE', home: null },  // Bye week
      { week: 9, opponent: 'LV', home: false },  // @ Las Vegas Raiders
      { week: 10, opponent: 'HOU', home: true }, // vs Houston Texans
      { week: 11, opponent: 'LAC', home: false }, // @ Los Angeles Chargers
      { week: 12, opponent: 'ARI', home: false }, // @ Arizona Cardinals
      { week: 13, opponent: 'TEN', home: false }, // @ Tennessee Titans
      { week: 14, opponent: 'IND', home: true }, // vs Indianapolis Colts
      { week: 15, opponent: 'NYJ', home: false }, // @ New York Jets
      { week: 16, opponent: 'DEN', home: true }, // vs Denver Broncos
      { week: 17, opponent: 'IND', home: true }, // vs Indianapolis Colts
      { week: 18, opponent: 'TEN', home: false }, // @ Tennessee Titans
    ],
    KC: [
      { week: 1, opponent: 'LAC', home: false }, // @ Los Angeles Chargers (Brazil)
      { week: 2, opponent: 'PHI', home: false }, // @ Philadelphia Eagles
      { week: 3, opponent: 'NYG', home: false }, // @ New York Giants
      { week: 4, opponent: 'BAL', home: true },  // vs Baltimore Ravens
      { week: 5, opponent: 'JAX', home: true },  // vs Jacksonville Jaguars
      { week: 6, opponent: 'DET', home: true },  // vs Detroit Lions
      { week: 7, opponent: 'LV', home: false },  // @ Las Vegas Raiders
      { week: 8, opponent: 'WAS', home: false }, // @ Washington Commanders
      { week: 9, opponent: 'BUF', home: true },  // vs Buffalo Bills
      { week: 10, opponent: 'BYE', home: null }, // Bye week
      { week: 11, opponent: 'DEN', home: true }, // vs Denver Broncos
      { week: 12, opponent: 'IND', home: true }, // vs Indianapolis Colts
      { week: 13, opponent: 'DAL', home: true }, // vs Dallas Cowboys
      { week: 14, opponent: 'HOU', home: true }, // vs Houston Texans
      { week: 15, opponent: 'LAC', home: true }, // vs Los Angeles Chargers
      { week: 16, opponent: 'TEN', home: false }, // @ Tennessee Titans
      { week: 17, opponent: 'DEN', home: false }, // @ Denver Broncos
      { week: 18, opponent: 'LV', home: false }, // @ Las Vegas Raiders
    ],
    LAC: [
      { week: 1, opponent: 'KC', home: true },   // vs Kansas City Chiefs (Brazil)
      { week: 2, opponent: 'LV', home: false },  // @ Las Vegas Raiders
      { week: 3, opponent: 'DEN', home: true },  // vs Denver Broncos
      { week: 4, opponent: 'NYG', home: false }, // @ New York Giants
      { week: 5, opponent: 'WAS', home: false }, // @ Washington Commanders
      { week: 6, opponent: 'MIA', home: false }, // @ Miami Dolphins
      { week: 7, opponent: 'IND', home: true },  // vs Indianapolis Colts
      { week: 8, opponent: 'MIN', home: false }, // @ Minnesota Vikings
      { week: 9, opponent: 'TEN', home: false }, // @ Tennessee Titans
      { week: 10, opponent: 'PIT', home: false }, // @ Pittsburgh Steelers
      { week: 11, opponent: 'JAX', home: true }, // vs Jacksonville Jaguars
      { week: 12, opponent: 'BYE', home: null }, // Bye week
      { week: 13, opponent: 'LV', home: false }, // @ Las Vegas Raiders
      { week: 14, opponent: 'BYE', home: null },  // Bye week
      { week: 15, opponent: 'KC', home: false }, // @ Kansas City Chiefs
      { week: 16, opponent: 'DAL', home: false }, // @ Dallas Cowboys
      { week: 17, opponent: 'BYE', home: null },  // Bye week
      { week: 18, opponent: 'DEN', home: true }, // vs Denver Broncos
    ],
    LAR: [
      { week: 1, opponent: 'HOU', home: true },  // vs Houston Texans
      { week: 2, opponent: 'TEN', home: false }, // @ Tennessee Titans
      { week: 3, opponent: 'PHI', home: false }, // @ Philadelphia Eagles
      { week: 4, opponent: 'IND', home: true },  // vs Indianapolis Colts
      { week: 5, opponent: 'SF', home: true },   // vs San Francisco 49ers
      { week: 6, opponent: 'BAL', home: true },  // vs Baltimore Ravens
      { week: 7, opponent: 'JAX', home: true },  // vs Jacksonville Jaguars (London)
      { week: 8, opponent: 'BYE', home: null },  // Bye week
      { week: 9, opponent: 'NO', home: false },  // @ New Orleans Saints
      { week: 10, opponent: 'SF', home: false }, // @ San Francisco 49ers
      { week: 11, opponent: 'SEA', home: false }, // @ Seattle Seahawks
      { week: 12, opponent: 'TB', home: false }, // @ Tampa Bay Buccaneers
      { week: 13, opponent: 'CAR', home: true }, // vs Carolina Panthers
      { week: 14, opponent: 'ARI', home: true }, // vs Arizona Cardinals
      { week: 15, opponent: 'DET', home: false }, // @ Detroit Lions
      { week: 16, opponent: 'SEA', home: false }, // @ Seattle Seahawks
      { week: 17, opponent: 'ATL', home: true }, // vs Atlanta Falcons
      { week: 18, opponent: 'ARI', home: true }, // vs Arizona Cardinals
    ],
    LV: [
      { week: 1, opponent: 'NE', home: false },  // @ New England Patriots
      { week: 2, opponent: 'LAC', home: true },  // vs Los Angeles Chargers
      { week: 3, opponent: 'WAS', home: false }, // @ Washington Commanders
      { week: 4, opponent: 'CHI', home: true },  // vs Chicago Bears
      { week: 5, opponent: 'IND', home: true },  // vs Indianapolis Colts
      { week: 6, opponent: 'TEN', home: false }, // @ Tennessee Titans
      { week: 7, opponent: 'KC', home: true },   // vs Kansas City Chiefs
      { week: 8, opponent: 'BYE', home: null },  // Bye week
      { week: 9, opponent: 'JAX', home: true },  // vs Jacksonville Jaguars
      { week: 10, opponent: 'DEN', home: true }, // vs Denver Broncos
      { week: 11, opponent: 'DAL', home: true }, // vs Dallas Cowboys
      { week: 12, opponent: 'CLE', home: false }, // @ Cleveland Browns
      { week: 13, opponent: 'LAC', home: true }, // vs Los Angeles Chargers
      { week: 14, opponent: 'DEN', home: false }, // @ Denver Broncos
      { week: 15, opponent: 'PHI', home: false }, // @ Philadelphia Eagles
      { week: 16, opponent: 'HOU', home: true }, // vs Houston Texans
      { week: 17, opponent: 'BYE', home: null },  // Bye week
      { week: 18, opponent: 'KC', home: true },  // vs Kansas City Chiefs
    ],
    MIA: [
      { week: 1, opponent: 'IND', home: false }, // @ Indianapolis Colts
      { week: 2, opponent: 'NE', home: false },  // @ New England Patriots
      { week: 3, opponent: 'BUF', home: false }, // @ Buffalo Bills
      { week: 4, opponent: 'NYJ', home: false }, // @ New York Jets
      { week: 5, opponent: 'CAR', home: true },  // vs Carolina Panthers
      { week: 6, opponent: 'LAC', home: true },  // vs Los Angeles Chargers
      { week: 7, opponent: 'CLE', home: false }, // @ Cleveland Browns
      { week: 8, opponent: 'ATL', home: false }, // @ Atlanta Falcons
      { week: 9, opponent: 'BAL', home: true },  // vs Baltimore Ravens
      { week: 10, opponent: 'BUF', home: false }, // @ Buffalo Bills
      { week: 11, opponent: 'WAS', home: true }, // vs Washington Commanders (Madrid)
      { week: 12, opponent: 'BYE', home: null }, // Bye week
      { week: 13, opponent: 'NO', home: false }, // @ New Orleans Saints
      { week: 14, opponent: 'NYJ', home: true }, // vs New York Jets
      { week: 15, opponent: 'PIT', home: true }, // vs Pittsburgh Steelers
      { week: 16, opponent: 'CIN', home: true }, // vs Cincinnati Bengals
      { week: 17, opponent: 'TB', home: false }, // @ Tampa Bay Buccaneers
      { week: 18, opponent: 'NE', home: false }, // @ New England Patriots
    ],
    MIN: [
      { week: 1, opponent: 'CHI', home: false }, // @ Chicago Bears
      { week: 2, opponent: 'ATL', home: true },  // vs Atlanta Falcons
      { week: 3, opponent: 'CIN', home: true },  // vs Cincinnati Bengals
      { week: 4, opponent: 'PIT', home: true },  // vs Pittsburgh Steelers (Dublin)
      { week: 5, opponent: 'CLE', home: false }, // @ Cleveland Browns (London)
      { week: 6, opponent: 'BYE', home: null },  // Bye week
      { week: 7, opponent: 'PHI', home: false }, // @ Philadelphia Eagles
      { week: 8, opponent: 'LAC', home: true },  // vs Los Angeles Chargers
      { week: 9, opponent: 'DET', home: true },  // vs Detroit Lions
      { week: 10, opponent: 'BAL', home: false }, // @ Baltimore Ravens
      { week: 11, opponent: 'CHI', home: true }, // vs Chicago Bears
      { week: 12, opponent: 'GB', home: true },  // vs Green Bay Packers
      { week: 13, opponent: 'SEA', home: false }, // @ Seattle Seahawks
      { week: 14, opponent: 'WAS', home: false }, // @ Washington Commanders
      { week: 15, opponent: 'DAL', home: true }, // vs Dallas Cowboys
      { week: 16, opponent: 'NYG', home: false }, // @ New York Giants
      { week: 17, opponent: 'DET', home: false }, // @ Detroit Lions
      { week: 18, opponent: 'GB', home: true },  // vs Green Bay Packers
    ],
    NE: [
      { week: 1, opponent: 'LV', home: true },   // vs Las Vegas Raiders
      { week: 2, opponent: 'MIA', home: true },  // vs Miami Dolphins
      { week: 3, opponent: 'PIT', home: false }, // @ Pittsburgh Steelers
      { week: 4, opponent: 'CAR', home: true },  // vs Carolina Panthers
      { week: 5, opponent: 'BUF', home: true },  // vs Buffalo Bills
      { week: 6, opponent: 'NO', home: false },  // @ New Orleans Saints
      { week: 7, opponent: 'TEN', home: false }, // @ Tennessee Titans
      { week: 8, opponent: 'CLE', home: false }, // @ Cleveland Browns
      { week: 9, opponent: 'ATL', home: true },  // vs Atlanta Falcons
      { week: 10, opponent: 'TB', home: false }, // @ Tampa Bay Buccaneers
      { week: 11, opponent: 'NYJ', home: false }, // @ New York Jets
      { week: 12, opponent: 'CIN', home: true }, // vs Cincinnati Bengals
      { week: 13, opponent: 'NYG', home: false }, // @ New York Giants
      { week: 14, opponent: 'BYE', home: null },  // Bye week
      { week: 15, opponent: 'BUF', home: false }, // @ Buffalo Bills
      { week: 16, opponent: 'BAL', home: false }, // @ Baltimore Ravens
      { week: 17, opponent: 'NYJ', home: false }, // @ New York Jets
      { week: 18, opponent: 'MIA', home: true }, // vs Miami Dolphins
    ],
    NO: [
      { week: 1, opponent: 'ARI', home: true },  // vs Arizona Cardinals
      { week: 2, opponent: 'SF', home: false },  // @ San Francisco 49ers
      { week: 3, opponent: 'SEA', home: false }, // @ Seattle Seahawks
      { week: 4, opponent: 'BUF', home: true },  // vs Buffalo Bills
      { week: 5, opponent: 'NYG', home: false }, // @ New York Giants
      { week: 6, opponent: 'NE', home: true },   // vs New England Patriots
      { week: 7, opponent: 'CHI', home: true },  // vs Chicago Bears
      { week: 8, opponent: 'TB', home: false },  // @ Tampa Bay Buccaneers
      { week: 9, opponent: 'LAR', home: true },  // vs Los Angeles Rams
      { week: 10, opponent: 'CAR', home: false }, // @ Carolina Panthers
      { week: 11, opponent: 'BYE', home: null }, // Bye week
      { week: 12, opponent: 'ATL', home: true }, // vs Atlanta Falcons
      { week: 13, opponent: 'MIA', home: true }, // vs Miami Dolphins
      { week: 14, opponent: 'TB', home: false }, // @ Tampa Bay Buccaneers
      { week: 15, opponent: 'CAR', home: true }, // vs Carolina Panthers
      { week: 16, opponent: 'NYJ', home: false }, // @ New York Jets
      { week: 17, opponent: 'TEN', home: false }, // @ Tennessee Titans
      { week: 18, opponent: 'ATL', home: false }, // @ Atlanta Falcons
    ],
    NYG: [
      { week: 1, opponent: 'WAS', home: false }, // @ Washington Commanders
      { week: 2, opponent: 'DAL', home: false }, // @ Dallas Cowboys
      { week: 3, opponent: 'KC', home: true },   // vs Kansas City Chiefs
      { week: 4, opponent: 'LAC', home: true },  // vs Los Angeles Chargers
      { week: 5, opponent: 'NO', home: true },   // vs New Orleans Saints
      { week: 6, opponent: 'PHI', home: false }, // @ Philadelphia Eagles
      { week: 7, opponent: 'DEN', home: true },  // vs Denver Broncos
      { week: 8, opponent: 'PHI', home: false }, // @ Philadelphia Eagles
      { week: 9, opponent: 'SF', home: false },  // @ San Francisco 49ers
      { week: 10, opponent: 'CHI', home: true }, // vs Chicago Bears
      { week: 11, opponent: 'GB', home: true },  // vs Green Bay Packers
      { week: 12, opponent: 'DET', home: true }, // vs Detroit Lions
      { week: 13, opponent: 'NE', home: true },  // vs New England Patriots
      { week: 14, opponent: 'BYE', home: null },  // Bye week
      { week: 15, opponent: 'WAS', home: false }, // @ Washington Commanders
      { week: 16, opponent: 'MIN', home: true }, // vs Minnesota Vikings
      { week: 17, opponent: 'BYE', home: null },  // Bye week
      { week: 18, opponent: 'DAL', home: true }, // vs Dallas Cowboys
    ],
    NYJ: [
      { week: 1, opponent: 'PIT', home: true },  // vs Pittsburgh Steelers
      { week: 2, opponent: 'BUF', home: true },  // vs Buffalo Bills
      { week: 3, opponent: 'TB', home: false },  // @ Tampa Bay Buccaneers
      { week: 4, opponent: 'MIA', home: true },  // vs Miami Dolphins
      { week: 5, opponent: 'DAL', home: false }, // @ Dallas Cowboys
      { week: 6, opponent: 'DEN', home: false }, // @ Denver Broncos (London)
      { week: 7, opponent: 'CAR', home: true },  // vs Carolina Panthers
      { week: 8, opponent: 'CIN', home: true },  // vs Cincinnati Bengals
      { week: 9, opponent: 'BYE', home: null },  // Bye week
      { week: 10, opponent: 'CLE', home: false }, // @ Cleveland Browns
      { week: 11, opponent: 'NE', home: true },  // vs New England Patriots
      { week: 12, opponent: 'BAL', home: false }, // @ Baltimore Ravens
      { week: 13, opponent: 'ATL', home: false }, // @ Atlanta Falcons
      { week: 14, opponent: 'MIA', home: false }, // @ Miami Dolphins
      { week: 15, opponent: 'JAX', home: true }, // vs Jacksonville Jaguars
      { week: 16, opponent: 'NO', home: true },  // vs New Orleans Saints
      { week: 17, opponent: 'NE', home: true },  // vs New England Patriots
      { week: 18, opponent: 'BUF', home: true }, // vs Buffalo Bills
    ],
    PHI: [
      { week: 1, opponent: 'DAL', home: true },  // vs Dallas Cowboys
      { week: 2, opponent: 'KC', home: true },   // vs Kansas City Chiefs
      { week: 3, opponent: 'LAR', home: true },  // vs Los Angeles Rams
      { week: 4, opponent: 'TB', home: false },  // @ Tampa Bay Buccaneers
      { week: 5, opponent: 'DEN', home: true },  // vs Denver Broncos
      { week: 6, opponent: 'NYG', home: true },  // vs New York Giants
      { week: 7, opponent: 'MIN', home: true },  // vs Minnesota Vikings
      { week: 8, opponent: 'NYG', home: true },  // vs New York Giants
      { week: 9, opponent: 'BYE', home: null },  // Bye week
      { week: 10, opponent: 'GB', home: true },  // vs Green Bay Packers
      { week: 11, opponent: 'DET', home: true }, // vs Detroit Lions
      { week: 12, opponent: 'DAL', home: true }, // vs Dallas Cowboys
      { week: 13, opponent: 'CHI', home: true }, // vs Chicago Bears
      { week: 14, opponent: 'LAC', home: false }, // @ Los Angeles Chargers
      { week: 15, opponent: 'LV', home: true },  // vs Las Vegas Raiders
      { week: 16, opponent: 'WAS', home: false }, // @ Washington Commanders
      { week: 17, opponent: 'BUF', home: true }, // vs Buffalo Bills
      { week: 18, opponent: 'WAS', home: false }, // @ Washington Commanders
    ],
    PIT: [
      { week: 1, opponent: 'NYJ', home: false }, // @ New York Jets
      { week: 2, opponent: 'SEA', home: true },  // vs Seattle Seahawks
      { week: 3, opponent: 'NE', home: true },   // vs New England Patriots
      { week: 4, opponent: 'MIN', home: false }, // @ Minnesota Vikings (Dublin)
      { week: 5, opponent: 'BYE', home: null },  // Bye week
      { week: 6, opponent: 'CLE', home: true },  // vs Cleveland Browns
      { week: 7, opponent: 'CIN', home: false }, // @ Cincinnati Bengals
      { week: 8, opponent: 'GB', home: true },   // vs Green Bay Packers
      { week: 9, opponent: 'IND', home: true },  // vs Indianapolis Colts
      { week: 10, opponent: 'LAC', home: true }, // vs Los Angeles Chargers
      { week: 11, opponent: 'CIN', home: true }, // vs Cincinnati Bengals
      { week: 12, opponent: 'CHI', home: true }, // vs Chicago Bears
      { week: 13, opponent: 'BUF', home: true }, // vs Buffalo Bills
      { week: 14, opponent: 'BAL', home: false }, // @ Baltimore Ravens
      { week: 15, opponent: 'MIA', home: false }, // @ Miami Dolphins
      { week: 16, opponent: 'DET', home: true }, // vs Detroit Lions
      { week: 17, opponent: 'CLE', home: true }, // vs Cleveland Browns
      { week: 18, opponent: 'BAL', home: true }, // vs Baltimore Ravens
    ],
    SEA: [
      { week: 1, opponent: 'SF', home: false },  // @ San Francisco 49ers
      { week: 2, opponent: 'PIT', home: false }, // @ Pittsburgh Steelers
      { week: 3, opponent: 'NO', home: true },   // vs New Orleans Saints
      { week: 4, opponent: 'ARI', home: false }, // @ Arizona Cardinals
      { week: 5, opponent: 'TB', home: false },  // @ Tampa Bay Buccaneers
      { week: 6, opponent: 'JAX', home: true },  // vs Jacksonville Jaguars
      { week: 7, opponent: 'HOU', home: true },  // vs Houston Texans
      { week: 8, opponent: 'BYE', home: null },  // Bye week
      { week: 9, opponent: 'WAS', home: false }, // @ Washington Commanders
      { week: 10, opponent: 'ARI', home: true }, // vs Arizona Cardinals
      { week: 11, opponent: 'LAR', home: true }, // vs Los Angeles Rams
      { week: 12, opponent: 'TEN', home: false }, // @ Tennessee Titans
      { week: 13, opponent: 'MIN', home: true }, // vs Minnesota Vikings
      { week: 14, opponent: 'ATL', home: false }, // @ Atlanta Falcons
      { week: 15, opponent: 'IND', home: false }, // @ Indianapolis Colts
      { week: 16, opponent: 'LAR', home: true }, // vs Los Angeles Rams
      { week: 17, opponent: 'BYE', home: null },  // Bye week
      { week: 18, opponent: 'SF', home: true },  // vs San Francisco 49ers
    ],
    SF: [
      { week: 1, opponent: 'SEA', home: true },  // vs Seattle Seahawks
      { week: 2, opponent: 'NO', home: true },   // vs New Orleans Saints
      { week: 3, opponent: 'ARI', home: true },  // vs Arizona Cardinals
      { week: 4, opponent: 'JAX', home: true },  // vs Jacksonville Jaguars
      { week: 5, opponent: 'LAR', home: false }, // @ Los Angeles Rams
      { week: 6, opponent: 'TB', home: false },  // @ Tampa Bay Buccaneers
      { week: 7, opponent: 'ATL', home: true },  // vs Atlanta Falcons
      { week: 8, opponent: 'HOU', home: true },  // vs Houston Texans
      { week: 9, opponent: 'NYG', home: false }, // @ New York Giants
      { week: 10, opponent: 'LAR', home: true }, // vs Los Angeles Rams
      { week: 11, opponent: 'ARI', home: false }, // @ Arizona Cardinals
      { week: 12, opponent: 'CAR', home: true }, // vs Carolina Panthers
      { week: 13, opponent: 'CLE', home: false }, // @ Cleveland Browns
      { week: 14, opponent: 'BYE', home: null },  // Bye week
      { week: 15, opponent: 'TEN', home: false }, // @ Tennessee Titans
      { week: 16, opponent: 'IND', home: false }, // @ Indianapolis Colts
      { week: 17, opponent: 'CHI', home: true }, // vs Chicago Bears
      { week: 18, opponent: 'SEA', home: false }, // @ Seattle Seahawks
    ],
    TB: [
      { week: 1, opponent: 'ATL', home: false }, // @ Atlanta Falcons
      { week: 2, opponent: 'HOU', home: false }, // @ Houston Texans
      { week: 3, opponent: 'NYJ', home: true },  // vs New York Jets
      { week: 4, opponent: 'PHI', home: true },  // vs Philadelphia Eagles
      { week: 5, opponent: 'SEA', home: true },  // vs Seattle Seahawks
      { week: 6, opponent: 'SF', home: true },   // vs San Francisco 49ers
      { week: 7, opponent: 'DET', home: true },  // vs Detroit Lions
      { week: 8, opponent: 'NO', home: true },   // vs New Orleans Saints
      { week: 9, opponent: 'BYE', home: null },  // Bye week
      { week: 10, opponent: 'NE', home: true },  // vs New England Patriots
      { week: 11, opponent: 'BUF', home: false }, // @ Buffalo Bills
      { week: 12, opponent: 'LAR', home: true }, // vs Los Angeles Rams
      { week: 13, opponent: 'BYE', home: null },  // Bye week
      { week: 14, opponent: 'NO', home: true },  // vs New Orleans Saints
      { week: 15, opponent: 'ATL', home: true }, // vs Atlanta Falcons
      { week: 16, opponent: 'CAR', home: true }, // vs Carolina Panthers
      { week: 17, opponent: 'MIA', home: true }, // vs Miami Dolphins
      { week: 18, opponent: 'CAR', home: true }, // vs Carolina Panthers
    ],
    TEN: [
      { week: 1, opponent: 'DEN', home: false }, // @ Denver Broncos
      { week: 2, opponent: 'LAR', home: true },  // vs Los Angeles Rams
      { week: 3, opponent: 'IND', home: true },  // vs Indianapolis Colts
      { week: 4, opponent: 'HOU', home: true },  // vs Houston Texans
      { week: 5, opponent: 'ARI', home: false }, // @ Arizona Cardinals
      { week: 6, opponent: 'LV', home: true },   // vs Las Vegas Raiders
      { week: 7, opponent: 'NE', home: true },   // vs New England Patriots
      { week: 8, opponent: 'IND', home: true },  // vs Indianapolis Colts
      { week: 9, opponent: 'LAC', home: true },  // vs Los Angeles Chargers
      { week: 10, opponent: 'BYE', home: null }, // Bye week
      { week: 11, opponent: 'HOU', home: true }, // vs Houston Texans
      { week: 12, opponent: 'SEA', home: true }, // vs Seattle Seahawks
      { week: 13, opponent: 'JAX', home: false }, // @ Jacksonville Jaguars
      { week: 14, opponent: 'CLE', home: true }, // vs Cleveland Browns
      { week: 15, opponent: 'SF', home: true },  // vs San Francisco 49ers
      { week: 16, opponent: 'KC', home: true },  // vs Kansas City Chiefs
      { week: 17, opponent: 'NO', home: true },  // vs New Orleans Saints
      { week: 18, opponent: 'JAX', home: true }, // vs Jacksonville Jaguars
    ],
    WAS: [
      { week: 1, opponent: 'NYG', home: true },  // vs New York Giants
      { week: 2, opponent: 'GB', home: true },   // vs Green Bay Packers
      { week: 3, opponent: 'LV', home: true },   // vs Las Vegas Raiders
      { week: 4, opponent: 'ATL', home: true },  // vs Atlanta Falcons
      { week: 5, opponent: 'LAC', home: true },  // vs Los Angeles Chargers
      { week: 6, opponent: 'CHI', home: true },  // vs Chicago Bears
      { week: 7, opponent: 'DAL', home: true },  // vs Dallas Cowboys
      { week: 8, opponent: 'KC', home: false },  // @ Kansas City Chiefs
      { week: 9, opponent: 'SEA', home: true },  // vs Seattle Seahawks
      { week: 10, opponent: 'DET', home: true }, // vs Detroit Lions
      { week: 11, opponent: 'MIA', home: false }, // @ Miami Dolphins (Madrid)
      { week: 12, opponent: 'BYE', home: null }, // Bye week
      { week: 13, opponent: 'DEN', home: true }, // vs Denver Broncos
      { week: 14, opponent: 'MIN', home: true }, // vs Minnesota Vikings
      { week: 15, opponent: 'NYG', home: true }, // vs New York Giants
      { week: 16, opponent: 'PHI', home: true }, // vs Philadelphia Eagles
      { week: 17, opponent: 'DAL', home: true }, // vs Dallas Cowboys
      { week: 18, opponent: 'PHI', home: true }, // vs Philadelphia Eagles
    ]
  };