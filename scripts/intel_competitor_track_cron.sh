#!/bin/bash
set -euo pipefail
LOG_DIR=/Users/jiangzhixuan/clawd/logs
mkdir -p "$LOG_DIR"
TS=$(date "+%F %T")
/opt/homebrew/bin/openclaw agent \
  --agent main \
  --message "请使用 intel-competitor-track 技能，手动执行一轮竞品追踪（官网/定价/功能更新/投放动向），输出变化清单与影响评估。完成后直接回复到当前会话。" \
  --deliver \
  --reply-channel feishu \
  --reply-to user:ou_90983ce520037fefcdaa62acfb9db763 \
  --timeout 1800 >> "$LOG_DIR/intel_competitor_track_cron.log" 2>&1

echo "$TS competitor cron done" >> "$LOG_DIR/intel_competitor_track_cron.log"
