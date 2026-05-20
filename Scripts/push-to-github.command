#!/bin/bash

# 切換到作品集根目錄
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
cd "$REPO_DIR"

echo "=============================="
echo "  作品集發佈到 GitHub Pages"
echo "=============================="
echo ""
echo "目錄：$REPO_DIR"
echo ""

# 確認有變更才 commit
if git diff --quiet && git diff --cached --quiet; then
  echo "沒有新的變更，略過 commit。"
else
  echo "偵測到新的變更，正在 commit..."
  git add -A
  git commit -m "Update portfolio $(date '+%Y-%m-%d %H:%M')"
fi

echo ""
echo "正在推送到 GitHub..."
git push origin main

echo ""
if [ $? -eq 0 ]; then
  echo "✅ 發佈成功！"
  echo ""
  echo "網頁連結（需先在 GitHub 開啟 Pages）："
  echo "https://hedywu-web.github.io/portfolio/"
else
  echo "❌ 推送失敗，請確認網路連線或 GitHub 權限。"
fi

echo ""
echo "按任意鍵關閉..."
read -n 1
