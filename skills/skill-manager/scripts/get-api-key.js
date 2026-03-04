#!/usr/bin/env node

/**
 * 获取用户的 API Key
 * 用法: node get-api-key.js <terminal> <user_id> <skill_name>
 * 
 * 示例: node get-api-key.js feishu ou_123456 fastgrow-api
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'data.db');

const [,, terminal, userId, skillName] = process.argv;

if (!terminal || !userId || !skillName) {
  console.error('用法: node get-api-key.js <terminal> <user_id> <skill_name>');
  process.exit(1);
}

try {
  const db = new Database(dbPath);
  
  const row = db.prepare(`
    SELECT api_key FROM user_api_keys 
    WHERE terminal = ? AND user_id = ? AND skill_name = ?
  `).get(terminal, userId, skillName);
  
  if (row) {
    console.log(row.api_key);
  }
  // 如果没找到，不输出任何内容
  
  db.close();
} catch (err) {
  // 数据库可能不存在，返回空
  process.exit(0);
}
