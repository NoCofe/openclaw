# Vercel 运营交接（给新 OpenClaw）

## 目标
让新 OpenClaw 只接手 **单一项目** 的日常运营：
- 线上网址：`https://www.lumij.top/`
- Git 仓库：`git@github.com:NoCofe/child_web.git`
- 运营范围：发布、回滚、健康检查、简单故障处理、变更记录。

## 已知历史（从记忆中提取）
1. 你已确认 Vercel CLI 可用，并允许我“直接改代码 + push 触发 Vercel 发布”。
2. 你委托运营 `child_web`，线上为 `https://www.lumij.top/`。
3. 运营偏好是“流量优先、转化导向”。

> Source: `memory/2026-02-12.md#L29-L33`

---

## 一次性初始化（新 OpenClaw 必做）
1. 验证 CLI 与账号
```bash
vercel whoami
vercel teams ls
```

2. 进入项目目录并绑定（仅此项目）
```bash
git clone git@github.com:NoCofe/child_web.git
cd child_web
vercel link
```
- 选择与你账号对应的 Vercel scope
- 选择项目 `child_web`（或 lumij.top 对应项目）

3. 拉取线上环境变量到本地
```bash
vercel env pull .env.local
```

4. 本地预发布验证
```bash
npm ci
npm run build
vercel --prebuilt
```

---

## 日常运营 SOP（手动执行）
1. **晨检（5-10分钟）**
```bash
vercel ls
vercel inspect <deployment-url>
```
检查：最新部署状态、域名可达、函数报错。

2. **变更发布（标准路径）**
```bash
git checkout -b chore/<short-task>
# 修改代码
npm run build
npm test   # 若有

git add -A && git commit -m "chore: <summary>"
git push
```
- 默认走 Git 集成触发 Preview/Production。
- 紧急可用 `vercel --prod`，但要记录原因。

3. **回滚（线上异常）**
- 在 Vercel Dashboard 选上一稳定部署 Promote，或
```bash
vercel rollback <deployment-url>
```

4. **发布后验收（必须）**
- 首页 + 核心路径 3 条（示例：登录、提交、支付/转化入口）
- 性能与错误：首屏、接口 5xx、边缘函数失败率

---

## 故障排查优先级
1. 环境变量缺失/错误（最常见）
2. 构建命令或 Node 版本不匹配
3. Third-party API 限流/密钥失效
4. 路由重写/中间件冲突

常用命令：
```bash
vercel logs <deployment-url> --since 1h
vercel inspect <deployment-url>
```

---

## 运营记录规范（给新 OpenClaw）
每次动作记录 4 项：
- 变更内容（做了什么）
- 影响范围（哪个项目/页面）
- 结果（成功/失败 + 证据链接）
- 回滚点（上一稳定版本）

建议写入：`memory/YYYY-MM-DD.md`

---

## 给新 OpenClaw 的“接管提示词”
直接复制给它：

```text
你现在接管我的 Vercel 运营（仅 `child_web` 项目，对应 `https://www.lumij.top/`）。
规则：
1) 先执行 vercel whoami / vercel teams ls，确认身份；
2) 只允许操作仓库 `git@github.com:NoCofe/child_web.git`；
3) 不做任何破坏性操作（删项目/删域名）除非我明确同意；
4) 所有发布先本地 build；
5) 每次上线后给我：变更摘要、部署链接、验收结果、回滚点；
6) 优先保证线上稳定，其次再做优化。
请先输出你今天的执行计划（不超过8条）。
```

---

## 你（NoCofe）只需提供给新 OpenClaw
- 本地项目路径（`child_web` 在你机器上的路径）
- 是否允许该项目自动发 Production（或仅 Preview）
- 最高优先的 1~3 个业务目标（如 SEO、转化、页面速度）
