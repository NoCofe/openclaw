# Agent Reach - 互联网内容获取技能

让 AI Agent 能读取 Twitter、小红书、B站、YouTube、Reddit、GitHub 等平台。

## 安装状态

已通过 pipx 安装：
```bash
pipx install https://github.com/Panniantong/agent-reach/archive/main.zip
agent-reach install --env=auto
```

## 当前可用渠道 (6/13)

| 渠道 | 状态 | 说明 |
|------|------|------|
| GitHub | ✅ | 读取仓库、搜索代码、Issue、PR |
| RSS | ✅ | 读取 RSS/Atom 订阅源 |
| 全网搜索 | ✅ | Exa 语义搜索（免费） |
| 任意网页 | ✅ | Jina Reader |
| Twitter/X | ✅ | 读取和搜索推文 |
| 微信公众号 | ✅ | 搜索和阅读文章 |

## 常用命令

### 诊断
```bash
agent-reach doctor          # 检查各渠道状态
agent-reach setup           # 交互式配置更多渠道
```

### 读取网页/内容
```bash
# 任意网页（推荐）
curl https://r.jina.ai/URL

# GitHub 仓库
gh repo view owner/repo
gh repo view owner/repo --json description
gh search repos "关键词"

# YouTube/B站 字幕
yt-dlp --dump-json "URL" | jq -r '.description'
```

### 搜索
```bash
# 全网语义搜索（通过 mcporter + Exa）
mcporter call exa search --query "关键词"

# Twitter 搜索
xreach tweet "关键词"
```

### 配置代理（服务器用）
```bash
agent-reach configure proxy http://user:pass@ip:port
```

### 导入 Cookie（Twitter、小红书）
1. 浏览器登录目标平台
2. 安装 Cookie-Editor Chrome 插件
3. 点击导出 → Export → Header String
4. 发给 Agent 配置

## 待配置（需要额外设置）

- YouTube/B站：需要 yt-dlp (`pip install yt-dlp`)
- 小红书：需要扫码登录 MCP
- 抖音：需要安装 douyin-mcp-server
- LinkedIn：需要安装 linkedin-scraper-mcp
- Reddit：需要配置代理

## 边界规则

- 所有文件放在 `~/.agent-reach/`，不污染工作目录
- 不使用 sudo，不修改系统文件
- 需要凭据时询问用户

## 更新
```bash
agent-reach update
```
