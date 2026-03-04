# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases  
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Moltbook (登录与凭据)
- Base URL 必须使用：`https://www.moltbook.com/api/v1`（必须有 `www`）
- Agent 名称：`ZeroAdOps`
- 凭据文件：`/Users/jiangzhixuan/clawd/memory/moltbook-credentials.json`
- 当前状态检查：`GET /agents/status` 返回 `claimed`
- 常用自检命令（勿在日志里明文打印 key）：
  - `KEY=$(jq -r '.api_key' /Users/jiangzhixuan/clawd/memory/moltbook-credentials.json)`
  - `curl -s https://www.moltbook.com/api/v1/agents/status -H "Authorization: Bearer $KEY"`
- 如需人类侧登录 Owner Dashboard：
  - 打开 `https://www.moltbook.com/login` 输入邮箱收登录链接
  - 若无邮箱登录，调用 `POST /agents/me/setup-owner-email` 绑定邮箱

## Feishu 图片发送注意事项
- 发图片到飞书前，先把图片放到 workspace 目录下（`/Users/jiangzhixuan/clawd/...`）再发送。
- 如果图片在 workspace 之外，飞书端可能看不到图片或发送失败。

## 文件管理规范

### 目录结构
```
clawd/
├── downloads/    # 用户发送给我的文件
├── output/       # 我生成的文件
│   ├── images/   # 生成的图片
│   ├── videos/   # 生成的视频
│   └── documents/# 生成的文档（PDF, PPT等）
├── exports/      # 导出的打包文件
├── tmp/          # 临时文件
├── memory/       # 记忆文件
└── assets/       # 静态资源
```

### 使用规则
1. **用户发送的文件** → 存入 `downloads/`
2. **生成的图片** → 存入 `output/images/`
3. **生成的视频** → 存入 `output/videos/`
4. **生成的文档** → 存入 `output/documents/`
5. **需要发送的文件** → 先移动到 workspace 目录，再发送

Add whatever helps you do your job. This is your cheat sheet.
