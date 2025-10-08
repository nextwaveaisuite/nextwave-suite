const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../database/affiliate_suite.db');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

// Create tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      subscription_tier TEXT DEFAULT 'free',
      trial_ends_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating users table:', err);
    else console.log('✅ Users table ready');
  });

  // Niches table
  db.run(`
    CREATE TABLE IF NOT EXISTS niches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      category TEXT,
      opportunity_score INTEGER,
      commission REAL,
      roi_week1 REAL,
      difficulty TEXT,
      cpc_estimate REAL,
      competition_level TEXT,
      data JSON,
      source TEXT DEFAULT 'manual',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Error creating niches table:', err);
    else console.log('✅ Niches table ready');
  });

  // Campaigns table
  db.run(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      niche_id INTEGER,
      name TEXT NOT NULL,
      status TEXT DEFAULT 'draft',
      platform TEXT,
      budget_daily REAL,
      spent REAL DEFAULT 0,
      revenue REAL DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      conversions INTEGER DEFAULT 0,
      bing_campaign_id TEXT,
      data JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (niche_id) REFERENCES niches(id)
    )
  `, (err) => {
    if (err) console.error('Error creating campaigns table:', err);
    else console.log('✅ Campaigns table ready');
  });

  // Ads table
  db.run(`
    CREATE TABLE IF NOT EXISTS ads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER,
      headline TEXT NOT NULL,
      description TEXT NOT NULL,
      cta TEXT,
      status TEXT DEFAULT 'active',
      impressions INTEGER DEFAULT 0,
      clicks INTEGER DEFAULT 0,
      ctr REAL DEFAULT 0,
      conversions INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
    )
  `, (err) => {
    if (err) console.error('Error creating ads table:', err);
    else console.log('✅ Ads table ready');
  });

  // Trends table
  db.run(`
    CREATE TABLE IF NOT EXISTS trends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      niche_name TEXT NOT NULL,
      source TEXT NOT NULL,
      trend_score INTEGER,
      search_volume INTEGER,
      competition_level TEXT,
      data JSON,
      discovered_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating trends table:', err);
    else console.log('✅ Trends table ready');
  });

  // Integrations table
  db.run(`
    CREATE TABLE IF NOT EXISTS integrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      platform TEXT NOT NULL,
      api_key TEXT,
      api_secret TEXT,
      access_token TEXT,
      refresh_token TEXT,
      status TEXT DEFAULT 'active',
      data JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Error creating integrations table:', err);
    else console.log('✅ Integrations table ready');
  });

  // Activity log table
  db.run(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id INTEGER,
      details JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Error creating activity_log table:', err);
    else console.log('✅ Activity log table ready');
  });
});

// Close database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
  } else {
    console.log('\n✅ Database initialization complete!');
    console.log(`📁 Database location: ${DB_PATH}\n`);
  }
});

module.exports = db;
