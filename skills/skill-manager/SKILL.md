# skill-manager

Skill 安装管理与用户 API Key 绑定。

## 功能

1. **安装新 Skill 确认**：当用户要求安装新 skill 时，自动提示确认（仅确认，不自动安装）
2. **用户 API Key 绑定**：为用户绑定特定 skill 的 API Key
3. **API Key 路由**：自动根据发起请求的用户查找对应 API Key

## 数据库

位置：`~/.openclaw/skills/skill-manager/data.db`

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

## 命令

### 绑定 API Key

用户说"绑定 XX skill 的 API Key"时使用。

```
/skill-manager bind <skill-name> <api-key>
```

或自然语言：
"帮我绑定 fastgrow-api 的 key：xxx"

### 查看已绑定的 Key

```
/skill-manager list
```

或自然语言：
"我绑定了哪些 key？"

### 删除绑定

```
/skill-manager unbind <skill-name>
```

### 安装新 Skill 确认

当用户要求安装新 skill 时，自动提示：
"收到安装 [skill-name] 的请求，需要 NoCofe 确认后才能安装。"

---

## 内部使用

其他 skill 调用时，通过以下方式获取用户的 API Key：

```bash
# 查询指定用户的 API Key
node ~/.openclaw/skills/skill-manager/scripts/get-api-key.js <terminal> <user_id> <skill_name>
```

返回 API Key 或空。

---

## 注意事项

- 这个 skill 是全局共享的，所有终端（飞书、WhatsApp、Discord）都可以使用
- 每个用户、每个 skill 只能绑定一个 API Key
- API Key 存储为明文（因为是用户自己提供的个人凭据）
