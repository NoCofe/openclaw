# FastGrow API Map（for OpenClaw）

## 接入约定

- Base URL: `https://api.fastgrow.ai`
- Header: `Authorization: Bearer {token}` + `X-Organization-Id: {orgId}`（平台预配置）
- 统一响应：`{ code, msg, data, timestamp, request_id }`

---

## 1) 文件上传

- `POST /api/upload`：`multipart/form-data`，返回 `{ url }`

---

## 2) 项目与资产管理

### 项目
- `POST /projects` 创建项目
- `GET /projects` 项目列表
- `GET /projects/{projectId}` 项目详情
- `PUT /projects/{projectId}` 重命名
- `DELETE /projects/{projectId}` 删除

### 资产库
- `GET /projects/{project_id}/assets/library` 资产列表
- `POST /projects/{projectId}/assets/upload` 上传资产
- `DELETE /projects/assets/{assetId}` 删除资产

---

## 3) 图像生成

- `POST /projects/assets/images/generate` 文生图/图生图
- `GET /projects/assets/{assetId}` 查询状态/结果
- `POST /projects/{projectId}/assets/images/generate-from-template` 模板生图
- `POST /projects/assets/images/remove-background` 去背景
- `POST /projects/assets/images/inpainting` 局部重绘
- `POST /projects/assets/images/outpainting` 扩图

状态流：`pending -> processing -> completed|failed`

---

## 4) 视频生成

- `POST /projects/assets/videos/generate`
- `POST /projects/assets/batch-status`
- `POST /api/video/crop`
- `POST /api/video/export`
- `GET /api/video/export/status/{taskId}`

---

## 5) 语音克隆与 TTS

- `GET /api/ai/audio/voices` 预置音色
- `GET /api/ai/audio/voice/clones` 克隆音色列表
- `POST /api/ai/audio/voice/enroll` 标准克隆
- `POST /api/ai/audio/voice/enroll-pro` Pro 克隆
- `POST /api/ai/audio/tts` TTS
- `GET /api/ai/audio/tts/history` 历史

---

## 6) 文本翻译

- `POST /api/localization/translate`
- `POST /api/localization/translate/stream`（SSE）
- `POST /api/localization/translate/batch`
- `POST /api/localization/translate/multi-language`
- `POST /api/localization/translate/retry`
- `GET /api/localization/history`
- `POST /api/localization/feedback`

支持语言：`zh/en/ja/ko/de/fr/es/pt`

---

## 7) 视频翻配

- `GET /api/video-translation/config`
- `POST /api/video-translation/submit`
- `GET /api/video-translation/{taskId}`
- `PUT /api/video-translation/{taskId}/asr`
- `POST /api/video-translation/{taskId}/asr/optimize`
- `POST /api/video-translation/{taskId}/translate`
- `PUT /api/video-translation/{taskId}/translation`
- `POST /api/video-translation/{taskId}/synthesize`
- `POST /api/video-translation/{taskId}/merge`
- `GET /api/video-translation/history`

状态流：
`created -> asr_processing -> asr_ready -> translating -> translated -> synthesizing -> synthesized -> merging -> completed`

---

## 8) 脚本生成

- `POST /api/script-generation/generate`（SSE）
- `GET /api/script-generation/history`
- `GET /api/script-generation/{generationId}`
- `PUT /api/script-generation/scripts/{scriptId}/favorite`
- `POST /api/script-generation/scripts/{scriptId}/export`

Reels 前缀：`/api/reels/script-generation/`

---

## 9) 创意跟创（Creative Remix）

- `POST /api/creative-remix/video`（SSE）
- `GET /api/creative-remix/jobs/{remixId}`
- `GET /api/creative-remix/jobs`
- `GET /api/creative-remix/jobs/{remixId}/video-tasks`
- `POST /api/creative-remix/jobs/{remixId}/continue`（SSE）
- `GET /api/remix-templates`

关键事件：
`script_generated / image_generated / video_group_submitted / video_completed / completed`

---

## 10) 批量视频剪辑（/api/v1/batchvideo）

### A 项目与脚本
- 创建项目、解析脚本、镜头列表、镜头更新、文案分配、镜头重排

### B 素材库
- 素材登记、素材列表、比例兼容性检查、镜头加素材

### C AI 推荐与智能分配
- 镜头推荐、应用推荐、smart-assign 预览/确认

### D 生成与导出
- 校验、组合数、开始生成、轮询状态、选版本、导出

---

## 11) 视频分析

- `POST /api/video-analysis/analyze`
- `GET /api/video-analysis/jobs/{jobId}/stream`（SSE）
- `GET /api/video-analysis/jobs/{jobId}`
- `GET /api/video-analysis/jobs`

---

## 12) 图片分析

- `POST /api/image-analysis/analyze`（SSE）
- `GET /api/image-analysis/jobs`
- `GET /api/image-analysis/jobs/{jobId}`

---

## 13) 模板与 AI App

- `GET /api/templates`
- `GET /api/templates/filters`
- `GET /api/templates/{templateId}`
- `POST /projects/{projectId}/assets/ai-app/execute`
- `POST /projects/{projectId}/assets/workflow/execute`

---

## 14) TikTok 工具套件（/api/tt）

统一状态查询：`GET /api/tt/tasks/{taskId}`

- Script: `/api/tt/script/submit`
- Caption Removal: `/api/tt/caption-removal/submit`
- Video Dubbing: `/api/tt/video-dubbing/submit`
- Video Refresh: `/api/tt/video-refresh/submit`
- Digital Avatar: `/api/tt/digital-avatar/*`
- TTS: `/api/tt/tts/*`
- Assets: `/api/tt/assets/*`

---

## 关键依赖

- 上传 URL（Skill 1）是多数媒体流程的前置
- `project_id`（Skill 2）是图像/视频/模板执行入口
- `voice_id`（Skill 5）可被视频翻配、批量视频复用
- `video_analysis_job_id`（Skill 11）可喂给创意跟创（Skill 9）
