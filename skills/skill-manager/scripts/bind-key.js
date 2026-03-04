#!/usr/bin/env node

/**
 * 绑定用户的 API Key
 * 用法: node bind-key.js <terminal> <user_id> <skill_name> <api_key>
 * 
 * 示例: node bind-key.js feishu ou_123456 fastgrow-api sk-xxx
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'data.db');

const [,, terminal, userId, skillName, apiKey] = process.argv;

if (!terminal || !userId || !skillName || !apiKey) {
  console.error('用法: node bind-key.js <terminal> <user_id> <skill_name> <api_key>');
  process.exit(1);
}

const db = new Database(dbPath);

try {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO user_api_keys (terminal, user_id, skill_name, api_key)
    VALUES (?, ?, ?, ?)
  `);
  
  stmt.run(terminal, userId, skillName, apiKey);
  console.log('OK: 已绑定 ' + skillName + ' 的 API Key');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
} finally {
  db.close();
}
