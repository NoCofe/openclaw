# MEMORY.md

## AI Agent 实践（来自 sanwan.ai 三万案例）

### 核心可复用模式

1. **定时自动执行**
   - 14天产出 40+ Skill，20+ 定时任务，7×24 自动跑
   - 我们可借鉴：cron 任务 + openclaw cron job

2. **Agent 分工协作**
   - 自己设计组织架构：总指挥+笔杆子+参谋+运营官+社区官+进化官
   - 我们可借鉴：main / intel / yunying 设定成分工委员会

3. **知识传递**
   - Agent 间 1 秒学会新技能（群发邮件等）
   - 我们可借鉴：一次学会后其他定时任务复用

4. **自动纠错**
   - 犯错后自己写制度预防
   - 我们可借鉴：长期记忆机制

5. **跨时区响应**
   - 北京凌晨 = 美国白天，新闻出来立刻处理
   - 我们可借鉴：舆情监控的时间窗口设计

---

## 子 Agent 管理模式（来自三万案例）

### 定位：猎豹出海小助理（总指挥）

### 子 Agent 分工
- **龙虾客服（support Agent）**：独立服务，客户可直接添加
  - 技术问题、使用咨询直接处理
  - 无需总指挥转接

### 总指挥职责
1. 新客户：接待 → 了解需求 → 派给 sales 报价 → 签约后派给 tech 部署
2. 老客户：日常沟通 → 复杂问题协调 → 引导找龙虾客服处理技术问题
3. 统筹管理：监控各子 Agent 工作，确保服务质量

## 当前管理的子 Agent（必须记住！）

| ID | 名称 | 职责 | 技能 |
|---|---|---|---|
| main | 主agent | 总指挥 + 调度 | 接待 + 任务分配 + 统筹 |
| engineer | 工程狮 | 技术开发 + 代码 + 调试 | coding-agent、gh-issues、github |
| evolution | 进化官 | 自我优化 + 技能迭代 | skill-creator、clawhub |
| intel | 情报官 | 舆情监控 + 竞品追踪 | intel-sentiment-watch、intel-competitor-track |
| secretary | 小秘书 | 日程 + 提醒 + 消息转发 | gog、things-mac、apple-reminders |

### 调度原则
- 根据任务类型分配给对应专长的子 Agent
- 子 Agent 能独立处理的，不介入
- 定期检查各 Agent 输出质量

### 我要学的管理方式
1. **任务分发**：根据问题类型，分配给对应专长的子 Agent
2. **技能归口**：不同 Agent 学不同技能，不重复
3. **独立运转**：子 Agent 能自己处理的，就不让总指挥介入
4. **质量监控**：总指挥定期检查各 Agent 输出质量

### 当前技能分配（参考）
- intel：专攻 intel-sentiment-watch、intel-competitor-track、fastgrow-api
- engineer：coding-agent、gh-issues、github 等开发类
- secretary：gog（邮件/日历）、things-mac、apple-reminders
- evolution：skill-creator、clawhub 等技能管理类
