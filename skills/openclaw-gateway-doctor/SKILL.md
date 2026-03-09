---
name: openclaw-gateway-doctor
description: 诊断和修复 OpenClaw Gateway 问题。**只有当用户明确提到"小胖龙虾"时才能触发**，如"小胖龙虾出问题了"、"小胖龙虾连不上"。触发后需要先确认用户是否需要登录服务器执行诊断。
---

# OpenClaw Gateway 医生

> 诊断和修复 OpenClaw Gateway 的标准操作流程（SOP）

## 触发条件

**只有当用户明确提到"小胖龙虾"时才触发此技能**，例如：
- "小胖龙虾出问题了"
- "小胖龙虾连不上"
- "小胖龙虾 Gateway 报错了"
- "OpenClaw Gateway 不工作了"

## 确认步骤

触发后，必须先执行以下确认流程：

### 1. 确认服务器 IP

```
🤖 请确认要登录的服务器 IP 地址：
例如：192.168.1.100 或 example.com
```

等待用户确认 IP 后再继续。

### 2. 确认 SSH 授权

```
🤖 请确认以下条件已满足：
□ 已完成 SSH 公钥授权（ssh user@IP 可直接登录）
□ 知道服务器登录用户名
□ 有 sudo 权限（如需要）

确认后我将开始执行诊断。
```

等待用户确认 SSH 授权已完成后再执行后续操作。

---

## 完整诊断 SOP

### 阶段一：连接与基础检查

#### Step 1: SSH 连接到服务器

```bash
ssh ${SSH_USER}@${SERVER_IP}
```

#### Step 2: 检查 OpenClaw 是否已安装

```bash
which openclaw
# 或
~/.npm-global/bin/openclaw --version
```

#### Step 3: 检查 Gateway 当前状态

```bash
~/.npm-global/bin/openclaw gateway status
```

**期望输出**：
- `Status: running` 或 `Status: healthy`
- 显示监听的端口（默认 8080）

---

### 阶段二：诊断模式

#### Step 4: 如果状态异常，运行 Doctor 诊断

```bash
~/.npm-global/bin/openclaw doctor
```

**Doctor 会检查**：
- 配置文件语法
- 端口占用情况
- 依赖完整性
- 日志文件权限
- 磁盘空间

#### Step 5: 查看详细日志

```bash
# 查看 Gateway 日志
tail -100 ~/.openclaw/logs/gateway.log

# 实时跟踪日志
tail -f ~/.openclaw/logs/gateway.log

# 查看错误日志
grep -i error ~/.openclaw/logs/gateway.log | tail -50
```

---

### 阶段三：问题识别与修复

#### 常见问题矩阵

| 症状 | 可能原因 | 诊断命令 | 最小修复方案 |
|------|----------|----------|-------------|
| Gateway 未运行 | 服务未启动 | `gateway status` | `openclaw gateway start` |
| 端口被占用 | 8080 端口被占 | `lsof -i:8080` | kill 占用进程或改端口 |
| 配置错误 | JSON 语法错 | `openclaw doctor` | 修复 `~/.openclaw/openclaw.json` |
| 依赖缺失 | npm 包损坏 | `openclaw doctor` | `npm install -g openclaw` |
| 权限问题 | 目录权限错 | `ls -la ~/.openclaw/` | `chown -R $(whoami) ~/.openclaw/` |
| 内存不足 | OOM 被 kill | `dmesg \| grep -i oom` | 增加内存或调低并发 |
| 磁盘满 | 日志/数据占满 | `df -h` | 清理日志或旧sessions |

#### Step 6: 根据诊断结果修复

**Gateway 未运行**：
```bash
# 启动 Gateway
openclaw gateway start

# 如果启动失败，查看错误
openclaw gateway start 2>&1
```

**端口被占用**：
```bash
# 查找占用端口的进程
lsof -i:8080

# 或者
netstat -tlnp | grep 8080

# 杀死占用进程
kill -9 <PID>

# 然后重新启动
openclaw gateway start
```

**配置文件错误**：
```bash
# 备份配置
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak

# 验证 JSON 语法
cat ~/.openclaw/openclaw.json | python3 -m json.tool > /dev/null

# 如果有语法错误，修复后重启
openclaw gateway restart
```

**权限问题**：
```bash
# 修复目录权限
chown -R $(whoami) ~/.openclaw/
chmod -R 755 ~/.openclaw/

# 如果是日志目录
mkdir -p ~/.openclaw/logs
chmod 755 ~/.openclaw/logs
```

---

### 阶段四：验证修复

#### Step 7: 确认 Gateway 健康

```bash
openclaw gateway status
```

**期望输出**：
```
Gateway Status: healthy
Port: 8080
Uptime: X hours X minutes
```

#### Step 8: 测试连接

```bash
# 本地测试
curl http://localhost:8080/health

# 如果有防火墙，测试端口
nc -zv localhost 8080
```

#### Step 9: 远程测试（如果配置了公网访问）

```bash
# 测试公网连接
curl http://${SERVER_IP}:8080/health
```

---

### 阶段五：后续检查

#### Step 10: 检查定时任务（Cron）

```bash
# 查看 cron 配置
cat ~/.openclaw/cron/jobs.json

# 检查 cron 进程是否运行
crontab -l
ps aux | grep openclaw | grep cron
```

#### Step 11: 检查资源使用

```bash
# CPU 和内存
top -bn1 | grep openclaw

# 磁盘使用
du -sh ~/.openclaw/

# 清理旧日志（可选）
find ~/.openclaw/logs -name "*.log" -mtime +7 -delete
```

---

## 关键路径速查

| 用途 | 路径 |
|------|------|
| 配置目录 | `~/.openclaw/` |
| 主配置文件 | `~/.openclaw/openclaw.json` |
| Gateway 日志 | `~/.openclaw/logs/gateway.log` |
| Cron 任务 | `~/.openclaw/cron/jobs.json` |
| 工作区 | `~/.openclaw/workspace/` |
| 会话存储 | `~/.openclaw/sessions/` |
| 记忆存储 | `~/.openclaw/memory/` |

---

## 常用命令速查

```bash
# 状态相关
openclaw gateway status
openclaw status

# 启动/停止/重启
openclaw gateway start
openclaw gateway stop
openclaw gateway restart

# 诊断
openclaw doctor

# 日志
openclaw logs gateway -n 100

# 版本
openclaw --version
```

---

## 注意事项

1. **最小化原则**：只修改必要的配置文件，不要删除数据
2. **先备份**：修改配置前先备份（cp file file.bak）
3. **不要动数据文件**：memory、sessions、workspace 不要删除
4. **只重启 Gateway**：优先使用 `openclaw gateway restart` 而不是 stop + start
5. **先诊断再动手**：运行 `openclaw doctor` 了解问题全貌
6. **分阶段执行**：按 SOP 顺序执行，不要跳步

---

## 紧急回滚

如果修复后问题更严重：

```bash
# 恢复配置文件
cp ~/.openclaw/openclaw.json.bak ~/.openclaw/openclaw.json

# 重启 Gateway
openclaw gateway restart
```
