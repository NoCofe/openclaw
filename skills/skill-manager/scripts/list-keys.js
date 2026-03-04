#!/usr/bin/env node

/**
 * 列出用户的 API Key
 * 用法: node list-keys.js <terminal> <user_id>
 * 
 * 示例: node list-keys.js feishu ou_123456
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'data.db');

const [,, terminal, userId] = process.argv;

if (!terminal || !userId) {
  console.error('用法: node list-keys.js <terminal> <user_id>');
  process.exit(1);
}

const db = new Database(dbPath);

try {
  const rows = db.prepare(`
    SELECT skill_name, api_key, created_at FROM user_api_keys 
    WHERE terminal = ? AND user_id = ?
    ORDER BY created_at DESC
  `).all(terminal, userId);
  
  if (rows.length === 0) {
    console.log('暂无绑定的 API Key');
  } else {
    rows.forEach(row => {
      const maskedKey = row.api_key.substring(0, 10) + '...' + row.api_key.substring(row.api_key.length - 4);
      console.log(`- ${row.skill_name}: ${maskedKey}`);
    });
  }
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
} finally {
  db.close();
}
