# 手动部署到 GitHub Pages
Write-Host "🚀 开始手动部署到 GitHub Pages..." -ForegroundColor Green

# 1. 构建
Write-Host "📦 正在构建..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 构建失败" -ForegroundColor Red
    exit 1
}

# 2. 保存当前分支
$currentBranch = git branch --show-current
Write-Host "📌 当前分支: $currentBranch" -ForegroundColor Cyan

# 3. 切换到 gh-pages 分支
Write-Host "🔄 切换到 gh-pages 分支..." -ForegroundColor Yellow
git checkout gh-pages

# 4. 清空旧文件（保留 .git）
Write-Host "🧹 清理旧文件..." -ForegroundColor Yellow
Get-ChildItem -Path . -Exclude .git,.github | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

# 5. 复制新构建的文件
Write-Host "📋 复制构建产物..." -ForegroundColor Yellow
Copy-Item -Path "docs/.vitepress/dist/*" -Destination "." -Recurse -Force

# 6. 提交并推送
Write-Host "💾 提交更改..." -ForegroundColor Yellow
git add .
$commitMsg = "Manual deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $commitMsg
git push origin gh-pages

# 7. 切回原分支
Write-Host "🔙 切回 $currentBranch 分支..." -ForegroundColor Yellow
git checkout $currentBranch

Write-Host "✅ 部署完成！访问 https://gao-shu.github.io/ 查看" -ForegroundColor Green
Write-Host "⏱️  部署时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
