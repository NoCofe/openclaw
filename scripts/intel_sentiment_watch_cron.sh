#!/bin/bash
set -euo pipefail
LOG_DIR=/Users/jiangzhixuan/clawd/logs
mkdir -p "$LOG_DIR"
TS=$(date "+%F %T")
/opt/homebrew/bin/openclaw agent \
  --agent main \
  --message "请使用 intel-sentiment-watch 技能，手动执行一轮舆情监控（重点关注负面预警、声量变化、主要来源），并输出简报。完成后直接回复到当前会话。" \
  --deliver \
  --reply-channel feishu \
  --reply-to user:ou_90983ce520037fefcdaa62acfb9db763 \
  --timeout 1800 >> "$LOG_DIR/intel_sentiment_watch_cron.log" 2>&1

echo "$TS sentiment cron done" >> "$LOG_DIR/intel_sentiment_watch_cron.log"
