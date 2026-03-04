#!/usr/bin/env node

/**
 * 删除用户的 API Key
 * 用法: node unbind-key.js <terminal> <user_id> <skill_name>
 * 
 * 示例: node unbind-key.js feishu ou_123456 fastgrow-api
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'data.db');

const [,, terminal, userId, skillName] = process.argv;

if (!terminal || !userId || !skillName) {
  console.error('用法: node unbind-key.js <terminal> <user_id> <skill_name>');
  process.exit(1);
}

const db = new Database(dbPath);

try {
  const stmt = db.prepare(`
    DELETE FROM user_api_keys 
    WHERE terminal = ? AND user_id = ? AND skill_name = ?
  `);
  
  const result = stmt.run(terminal, userId, skillName);
  
  if (result.changes > 0) {
    console.log('OK: 已删除 ' + skillName + ' 的 API Key');
  } else {
    console.log('未找到绑定的 Key');
  }
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
} finally {
  db.close();
}
