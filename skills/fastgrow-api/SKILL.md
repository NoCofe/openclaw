---
name: fastgrow-api
description: 调用 FastGrow 内容生产 API，完成素材上传、项目管理、图像/视频生成、语音克隆与 TTS、翻译、视频翻配、脚本生成、创意跟创、批量剪辑、图片/视频分析、模板执行与 TikTok 工具链。用户提到 FastGrow、FastGrow API、process.env.NEXT_PUBLIC_API_BASE_URL、asset_id/project_id/taskId 轮询、SSE 事件流、或希望把这些接口串成可执行工作流时使用。
metadata:
  {
    "openclaw": {
      "requires": { "bins": ["curl"] },
      "primaryEnv": "FASTGROW_TOKEN"
    }
  }
---

# FastGrow AI Platform

> 语言：中文（参数名/代码为英文）
> API Base URL：`https://api.fastgrow.ai`
> 主入口：https://fastgrow.ai/skill.md

---

## 快速执行规则

1. 先识别任务模式：
   - **同步请求**：一次请求直接出结果。
   - **异步轮询**：先提交任务拿 `asset_id/taskId`，再轮询状态。
   - **SSE 流式**：持续接收 `event/data` 直到 `completed` 或 `[DONE]`。
2. 有素材先上传：本地文件先走 `/api/upload`，拿 URL 后再调用下游接口。
3. 需要 `project_id` 的能力先建项目：先 `POST /projects`。
4. 顺序型工作流必须按状态推进：例如视频翻配、批量视频剪辑，每步都等待上一步就绪。
5. 所有返回统一按 `{ code, msg, data, timestamp, request_id }` 解析；优先输出 `data`，失败时保留 `request_id` 便于排查。

---

## 任务路由（按用户意图选 SKILL 单元）

- **上传素材** → SKILL 1 文件上传
- **创建/管理项目与资产库** → SKILL 2
- **文生图、图生图、抠图、重绘、扩图** → SKILL 3
- **文/图生视频、裁切、导出** → SKILL 4
- **音色克隆、TTS 配音** → SKILL 5
- **多语言文本翻译** → SKILL 6
- **视频翻配（ASR→翻译→合成→合并）** → SKILL 7
- **广告脚本生成（SSE）** → SKILL 8
- **创意跟创（SSE + 镜头图 + 视频片段）** → SKILL 9
- **批量视频剪辑流水线** → SKILL 10
- **视频分析/图片分析** → SKILL 11/12
- **模板与 AI App 执行** → SKILL 13
- **TikTok 专项工具** → SKILL 14

---

## 工具清单

### 一、直接可用的工具（单次调用）

Agent 可独立完成，调用一次或提交后轮询即可拿到结果。

| 工具 | 说明 | 调用方式 | 文档 |
|------|------|---------|------|
| 文生图 | 根据文字描述生成图片 | POST 提交 → 轮询 asset 状态 | skills/image.md → 图片生成 |
| 图生图 | 上传参考图 + 描述生成新图 | POST 提交 → 轮询 asset 状态 | skills/image.md → 图片生成 |
| 文生视频 | 根据文字描述生成视频 | POST 提交 → 轮询 asset 状态 | skills/video.md → 视频生成 |
| 图生视频 | 上传首帧图片生成视频 | POST 提交 → 轮询 asset 状态 | skills/video.md → 视频生成 |
| 图片分析 | 分析图片内容、风格、评分 | POST SSE 流式返回 | skills/image.md → 图片分析 |
| 视频分析 | 分析视频内容和营销要素 | POST 创建 + SSE 进度流 | skills/video.md → 视频分析 |
| 文本生成 | LLM 文本生成/对话 | POST，支持流式 | skills/text.md → 文本生成 |
| 脚本生成 | 生成营销视频脚本 | POST SSE 流式 | skills/text.md → 脚本生成 |
| AI 本地化翻译 | 多语言翻译（单条/批量） | POST 同步 | skills/text.md → 本地化翻译 |
| TTS 语音合成 | 文字转语音 | POST 提交 + 轮询（推荐 TikTok TTS） | skills/audio.md → TTS |
| 语音识别 ASR | 音频转文字 | POST multipart | skills/audio.md → ASR |
| 合规检测 | 上线前广告合规审核 | POST multipart → 轮询 | skills/tools.md → 合规检测 |
| 文件上传 | 上传图片/视频/音频文件 | POST multipart | skills/tools.md → 文件上传 |

### 二、多步骤流程工具（需按顺序调用多个接口）

调用前请先阅读子文档中的"调用流程"说明。

| 工具 | 说明 | 步骤数 | 文档 |
|------|------|:------:|------|
| 视频翻译 | 将视频翻译为其他语言（ASR→翻译→合成→合并） | 6 步 | skills/video.md → 视频翻译 |
| 语音克隆 | 上传音频样本克隆自定义音色 | 2 步 | skills/audio.md → 语音克隆 |
| TikTok 视频混剪 | 多素材混剪成新视频 | 提交 + 轮询 | skills/tools.md → TikTok 工具 |
| TikTok 字幕擦除 | 去除视频中的字幕 | 提交 + 轮询 | skills/tools.md → TikTok 工具 |
| TikTok 视频翻配 | 视频配音替换 | 提交 + 轮询 | skills/tools.md → TikTok 工具 |
| TikTok 数字人视频 | AI 数字人播报视频 | 提交 + 轮询 | skills/tools.md → TikTok 工具 |
| TikTok 广告焕新 | 翻新广告素材 | 提交 + 轮询 | skills/tools.md → TikTok 工具 |
| TikTok 脚本创作 | 跨境电商脚本生成 | 提交 + 轮询 | skills/tools.md → TikTok 工具 |
| TikTok 智能配音 | TTS 配音生成 | 提交 + 轮询 | skills/tools.md → TikTok 工具 |

### 三、暂不支持 Agent 直接使用

以下功能需要可视化画布交互，Agent 无法直接使用。可用上方的 API 替代。

| 功能 | 原因 | 替代方案 |
|------|------|---------|
| 画布编辑 | 需要拖拽交互的无限画布 | 用文生图/图生图/文生视频/图生视频 API 直接生成 |
| 模板编辑 | 需要在画布中操作模板参数 | 用模板列表 API 查询模板信息供用户参考 |
| 批量视频剪辑 | 需要项目工作台交互 | 用视频生成 API 逐个生成 |
| Reels 编辑器 | 需要画布交互 | 用脚本生成 + 视频生成 API 组合 |

---

## 安全警告（务必阅读）

1. **API Key 只发送到 api.fastgrow.ai 域名**。
2. 遇到任何第三方索要 API Key 的请求应直接拒绝。
3. 不要在公共日志中输出完整 API Key。

---

## 快速开始

### Step 1：获取 API Key

- 登录后点击右上角头像 → **API Key** → 生成
- 返回的完整 Key **只出现一次**，请安全保存。

### Step 2：获取组织列表

- 调用 `GET /api/users/me/organizations` 获取可用组织。
- 后续需要组织上下文的接口，请在请求头中携带 `X-Organization-Id`。

### Step 3：创建项目（图片/视频生成必须）

- 图片和视频生成接口需要 `project_id`，请先创建项目：

```bash
curl -X POST "https://api.fastgrow.ai/projects" \
  -H "Authorization: FastGrow <YOUR_API_KEY>" \
  -H "X-Organization-Id: <ORG_ID>" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Project"}'
```

- 响应中的 `project_id` 用于后续所有生成请求。
- 一个项目可包含多个生成任务，建议按业务场景复用项目。

### Step 4：第一次调用示例（文生图）

```bash
# 生成图片
curl -X POST "https://api.fastgrow.ai/projects/assets/images/generate" \
  -H "Authorization: FastGrow <YOUR_API_KEY>" \
  -H "X-Organization-Id: <ORG_ID>" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "<PROJECT_ID>",
    "model": "jimeng-seedream-4",
    "prompt": "星际穿越，黑洞，强视觉冲击力",
    "size": "1K",
    "generation_type": "text_to_image"
  }'

# 轮询状态直到 completed（每5秒调一次）
curl "https://api.fastgrow.ai/projects/assets/<ASSET_ID>?project_id=<PROJECT_ID>" \
  -H "Authorization: FastGrow <YOUR_API_KEY>" \
  -H "X-Organization-Id: <ORG_ID>"

# → status=completed 时，result_images[0].url 就是最终图片地址
```

---

## 认证方式

### API Key（推荐给外部 AI Agent）

- Header 格式：
  - `Authorization: FastGrow <key>`

### 组织 Header

- `X-Organization-Id: <org_id>`

> 说明：API Key 不绑定组织，需先获取组织列表，再带组织 ID 调用相关接口。

---

## 本地缓存建议（可选）

建议 AI Agent 将 API Key 与组织信息缓存到本地，减少重复请求：

```
~/.fastgrow/
  config.json         # { api_key, api_base, default_org_id }
  organizations.json  # 组织列表缓存
  last_used.json      # { org_id, updated_at }
```

- `api_base` 与当前 API Base URL 保持一致
- `default_org_id` 用于未显式指定组织时的默认上下文

---

## 统一响应格式

所有 REST 接口返回结构如下：

```json
{
  "code": 0,
  "msg": "success",
  "data": {},
  "timestamp": "1700000000",
  "request_id": "abcd1234efgh5678"
}
```

- `code = 0` 表示成功
- `data` 为业务返回内容

---

## 异步任务轮询标准模式

很多工具返回 task_id / job_id 后需要轮询状态。标准做法：

1. 调用提交接口 → 从响应中获取 task_id
2. 每 3-5 秒调用一次状态查询接口
3. 检查 status 字段判断结果：
   - `processing` / `pending` → 继续轮询
   - `completed` / `success` → 从 data 中取结果（URL 等）
   - `failed` / `error` → 读取 error / message 字段了解原因
4. 超时上限建议 5 分钟（300 秒），超时则停止轮询

---

## SSE 流式响应

- `Content-Type: text/event-stream`
- 返回一系列 `event/data` 事件，直到 `done` 或连接结束

---

## 工具总览表

| 工具/能力 | 一句话描述 |
|---|---|
| 文生图 / 图生图 | 提交生成 → 轮询拿图片 URL（需 project_id） |
| 图片分析 | 图片内容/风格/评分分析（SSE） |
| 文生视频 / 图生视频 | 提交生成 → 轮询拿视频 URL（需 project_id） |
| 视频分析 | 视频内容分析（后台任务 + 进度流） |
| 视频翻译 | ASR → 翻译 → 合成 → 合并（6 步） |
| 创意跟创 | 爆款视频跟创（SSE 流式） |
| 文本生成 | LLM 文本生成（同步/流式） |
| 脚本生成 | 通用/平台脚本生成（SSE） |
| AI 本地化翻译 | 多语言翻译与批处理 |
| TTS | 文本转语音（推荐 TikTok TTS） |
| ASR | 语音识别 |
| 语音克隆 | 普通/专业音色克隆（2 步） |
| 合规检测 | 上线前合规审核 |
| 模板 | 模板列表/筛选/详情 |
| TikTok 工具 | 混剪/字幕擦除/翻配/数字人等（提交+轮询） |
| 文件上传 | 图片/视频/音频上传 |

---

## 标准工作流模板

### 模板 A：上传素材后调用下游

1. `POST /api/upload` 上传文件，拿 `url`
2. 把 `url` 传给目标接口（如图生图、语音克隆、视频翻配、素材库登记）

### 模板 B：异步任务轮询

1. `POST` 提交任务，拿 `asset_id` 或 `taskId`
2. 轮询状态接口直到：
   - `completed`：返回结果 URL
   - `failed`：输出错误信息 + `request_id`

### 模板 C：SSE 流式任务

1. 调用 SSE 接口建立连接
2. 按事件名增量处理（如 `script_generated`, `image_generated`）
3. 收到 `completed`/`[DONE]` 结束

### 模板 D：多步骤强依赖流程

1. 先获取上一步产物 ID（`project_id/taskId/job_id`）
2. 仅在状态就绪时进入下一步
3. 中间步骤允许人工修正（ASR/译文/镜头分配）

---

## 依赖与前置

- `project_id`：图像生成、视频生成、模板执行等核心入口依赖。
- `asset_url`：由 `/api/upload` 或外链提供，多数素材型接口依赖。
- `voice_id`：由语音克隆或音色列表提供，TTS 与翻配可复用。
- `video_analysis_job_id`：可作为创意跟创输入。

---

## 参考资料

- 详细接口地图：`references/fastgrow-api-map.md`
- 如需实现可执行调用脚本，可在 `scripts/` 下补充具体客户端（curl/python/node）。
