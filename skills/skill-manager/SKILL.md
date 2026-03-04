# skill-manager

Skill 安装管理与用户 API Key 绑定。

## 功能

1. **安装新 Skill 确认**：当用户要求安装新 skill 时，自动提示确认（仅确认，不自动安装）
2. **用户 API Key 绑定**：为用户绑定特定 skill 的 API Key
3. **API Key 路由**：自动根据发起请求的用户查找对应 API Key

## 目录结构

```
skill-manager/
├── SKILL.md              # 本文件，Skill 说明
├── scripts/              # 可执行脚本
│   ├── init-db.js        # 初始化数据库
│   ├── bind-key.js       # 绑定 API Key
│   ├── list-keys.js      # 查看已绑定的 Key
│   ├── unbind-key.js     # 删除 Key
│   └── get-api-key.js    # 查询 Key（供其他 skill 调用）
└── data/                 # 数据库目录
    └── data.db           # SQLite 数据库
```

## 数据库

位置：`~/.openclaw/skills/skill-manager/data/data.db`

### 表结构

```sql
-- 用户 API Key 绑定
CREATE TABLE user_api_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  terminal TEXT NOT NULL,      -- 'feishu', 'whatsapp', 'discord', 'telegram'
  user_id TEXT NOT NULL,       -- 飞书是 open_id，Discord 是 user_id
  skill_name TEXT NOT NULL,    -- skill 名称，如 'fastgrow-api'
  api_key TEXT NOT NULL,       -- 对应的 API Key
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(terminal, user_id, skill_name)
);

-- 已安装的 skill 清单
CREATE TABLE installed_skills (
  name TEXT PRIMARY KEY,
  required_keys TEXT,          -- JSON 数组，如 '["fastgrow"]'
  description TEXT,
  installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 使用方式

### 1. 初始化数据库

首次使用需要初始化数据库：

```bash
node ~/.openclaw/skills/skill-manager/scripts/init-db.js
```

### 2. 绑定 API Key

用户说"绑定 XX skill 的 API Key"时使用。

```bash
# 命令行格式
node ~/.openclaw/skills/skill-manager/scripts/bind-key.js <terminal> <user_id> <skill-name> <api-key>

# 示例：绑定飞书用户的 fastgrow-api
node ~/.openclaw/skills/skill-manager/scripts/bind-key.js feishu ou_123456 fastgrow-api fg_xxx
```

或自然语言：
"帮我绑定 fastgrow-api 的 key：xxx"

### 3. 查看已绑定的 Key

```bash
# 命令行格式
node ~/.openclaw/skills/skill-manager/scripts/list-keys.js <terminal> <user_id>

# 示例
node ~/.openclaw/skills/skill-manager/scripts/list-keys.js feishu ou_123456
```

输出示例：
```
- fastgrow-api: fg_fCkB6_D...B1Ps
```

或自然语言：
"我绑定了哪些 key？"

### 4. 删除绑定

```bash
# 命令行格式
node ~/.openclaw/skills/skill-manager/scripts/unbind-key.js <terminal> <user_id> <skill-name>

# 示例
node ~/.openclaw/skills/skill-manager/scripts/unbind-key.js feishu ou_123456 fastgrow-api
```

### 5. 查询 API Key（供其他 skill 调用）

```bash
# 命令行格式
node ~/.openclaw/skills/skill-manager/scripts/get-api-key.js <terminal> <user_id> <skill-name>

# 示例
node ~/.openclaw/skills/skill-manager/scripts/get-api-key.js feishu ou_123456 fastgrow-api
```

返回 API Key 或空（无绑定）。

## 在其他 Skill 中调用

当其他 skill 需要使用用户的 API Key 时，按以下步骤：

### 步骤 1：获取用户身份

从消息上下文获取：
- `terminal`: 终端类型（feishu/whatsapp/discord/telegram）
- `user_id`: 用户 ID（飞书是 open_id）

### 步骤 2：调用 get-api-key.js

```javascript
const { execSync } = require('child_process');

function getApiKey(terminal, userId, skillName) {
  const script = '/Users/jiangzhixuan/clawd/skills/skill-manager/scripts/get-api-key.js';
  const result = execSync(`node ${script} ${terminal} ${userId} ${skillName}`, {
    encoding: 'utf8'
  }).trim();
  return result || null;
}

// 使用示例
const apiKey = getApiKey('feishu', 'ou_123456', 'fastgrow-api');
if (apiKey) {
  // 使用 apiKey 调用对应服务
}
```

### 步骤 3：处理无 Key 情况

如果返回为空，提示用户绑定 API Key：
"你需要先绑定 [skill-name] 的 API Key 才能使用此功能。请告诉我你的 API Key。"

## 命令汇总表

| 命令 | 用途 |
|------|------|
| `bind` | 绑定 API Key |
| `list` | 查看已绑定的 Key |
| `unbind` | 删除 Key |
| `get` | 查询 Key（内部使用） |

## 注意事项

- 这个 skill 是全局共享的，所有终端（飞书、WhatsApp、Discord）都可以使用
- 每个用户、每个 skill 只能绑定一个 API Key
- API Key 存储为明文（因为是用户自己提供的个人凭据）
- 数据库位置：`~/.openclaw/skills/skill-manager/data/data.db`

## 错误处理

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| 无输出 | 用户未绑定该 skill 的 key | 提示用户绑定 |
| SQLITE_CANTOPEN | 数据库不存在 | 运行 init-db.js 初始化 |
| UNIQUE constraint | 已存在绑定 | 自动更新，无需处理 |

---

## 示例对话

**用户**: 帮我绑定 fastgrow 的 key
**Agent**: 请提供你的 fastgrow API Key
**用户**: fg_xxx
**Agent**: (调用 bind-key.js) 已绑定 ✅

**用户**: 我绑定了哪些 key？
**Agent**: (调用 list-keys.js) 
- fastgrow-api: fg_fCkB6_D...B1Ps
- ga4-analytics: 未绑定