const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database/affiliate_suite.db');

const db = new sqlite3.Database(DB_PATH);

// Add admin-related tables
db.serialize(() => {
  // Update users table to include role, status, metadata
  db.run(`
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
  `, () => {});

  db.run(`
    ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'pending';
  `, () => {});

  db.run(`
    ALTER TABLE users ADD COLUMN last_login DATETIME;
  `, () => {});

  db.run(`
    ALTER TABLE users ADD COLUMN metadata TEXT;
  `, () => {});

  // System settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS system_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      access_mode TEXT DEFAULT 'public',
      allow_registration INTEGER DEFAULT 1,
      require_email_verification INTEGER DEFAULT 0,
      maintenance_mode INTEGER DEFAULT 0,
      product1_enabled INTEGER DEFAULT 1,
      product2_enabled INTEGER DEFAULT 1,
      product3_enabled INTEGER DEFAULT 1,
      max_users_per_tier TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      CHECK (id = 1)
    )
  `, (err) => {
    if (err) console.error('Error creating system_settings:', err);
    else {
      // Insert default settings
      db.run(`
        INSERT OR IGNORE INTO system_settings (id, access_mode, max_users_per_tier) 
        VALUES (1, 'public', '{"free":1000,"professional":500,"expert":200,"enterprise":50}')
      `);
      console.log('✅ System settings table ready');
    }
  });

  // Access requests table
  db.run(`
    CREATE TABLE IF NOT EXISTS access_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      name TEXT,
      message TEXT,
      status TEXT DEFAULT 'pending',
      reviewed_by INTEGER,
      reviewed_at DATETIME,
      rejection_reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reviewed_by) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Error creating access_requests:', err);
    else console.log('✅ Access requests table ready');
  });

  // Invitations table
  db.run(`
    CREATE TABLE IF NOT EXISTS invitations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      subscription_tier TEXT DEFAULT 'trial',
      status TEXT DEFAULT 'pending',
      expires_at DATETIME,
      message TEXT,
      created_by INTEGER,
      used_by INTEGER,
      used_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (used_by) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error('Error creating invitations:', err);
    else console.log('✅ Invitations table ready');
  });

  // Product settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS product_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT UNIQUE NOT NULL,
      product_name TEXT NOT NULL,
      enabled INTEGER DEFAULT 1,
      access_mode TEXT DEFAULT 'public',
      features TEXT,
      limits TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating product_settings:', err);
    else {
      // Insert default product settings
      db.run(`
        INSERT OR IGNORE INTO product_settings (product_id, product_name, features, limits) 
        VALUES 
        ('product1', 'NicheFinder AI Pro', '{"export":true,"analytics":true,"bridgePages":true}', '{"nichesPerDay":10,"exportsPerDay":5}'),
        ('product2', 'CampaignMaster Pro', '{"aiGenerator":true,"launch":true,"monitoring":true}', '{"campaignsPerMonth":10,"adsPerCampaign":20}'),
        ('product3', 'TrendScout Live', '{"discovery":true,"scanning":true,"export":true}', '{"scansPerDay":5,"exportsPerDay":10}')
      `);
      console.log('✅ Product settings table ready');
    }
  });

  // User permissions table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id TEXT NOT NULL,
      can_access INTEGER DEFAULT 1,
      features_enabled TEXT,
      custom_limits TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, product_id)
    )
  `, (err) => {
    if (err) console.error('Error creating user_permissions:', err);
    else console.log('✅ User permissions table ready');
  });

  // Create owner account if not exists
  db.get('SELECT id FROM users WHERE role = ?', ['owner'], (err, row) => {
    if (!row) {
      const bcrypt = require('bcryptjs');
      const ownerPassword = 'OwnerMaster2025!'; // Change this!
      const hash = bcrypt.hashSync(ownerPassword, 10);
      
      db.run(
        `INSERT INTO users (email, password_hash, role, subscription_tier, status) 
         VALUES (?, ?, ?, ?, ?)`,
        ['owner@affiliatesuite.com', hash, 'owner', 'enterprise', 'active'],
        (err) => {
          if (err) console.error('Error creating owner:', err);
          else {
            console.log('\n✅ OWNER ACCOUNT CREATED!');
            console.log('Email: owner@affiliatesuite.com');
            console.log('Password: OwnerMaster2025!');
            console.log('⚠️  CHANGE THIS PASSWORD IMMEDIATELY!\n');
          }
        }
      );
    }
  });
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
  } else {
    console.log('\n✅ Admin database setup complete!\n');
  }
});

module.exports = db;
