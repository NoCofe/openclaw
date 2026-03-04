#!/usr/bin/env node

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'data', 'data.db');
const dataDir = path.dirname(dbPath);

// 确保目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// 创建表
db.exec(`
  CREATE TABLE IF NOT EXISTS user_api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    terminal TEXT NOT NULL,
    user_id TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    api_key TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(terminal, user_id, skill_name)
  );

  CREATE TABLE IF NOT EXISTS installed_skills (
    name TEXT PRIMARY KEY,
    required_keys TEXT,
    description TEXT,
    installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('Database initialized at:', dbPath);
db.close();
