# 學習計畫進度追蹤

一個純前端的靜態網頁，讀取 Google Sheet 上的學習計畫，讓學生與家長隨時掌握學習進度。電腦與手機瀏覽器皆可使用。

## 功能

- 從 Google Sheet 即時讀取學習計畫資料（不需登入、不需後端）
- 整體進度摘要（總任務數／已完成／學習中／待執行／完成百分比）
- 依科目分組呈現，各科目顯示個別完成度
- 依狀態篩選、關鍵字搜尋
- 響應式版面，手機自動切換為卡片列表

## 本機預覽

**注意：不能直接雙擊開啟 `index.html`**（網址會變成 `file://...`）。瀏覽器基於安全機制，會擋掉這種方式對 Google Sheet 的連線，畫面會顯示「讀取資料失敗」。請務必透過本機網頁伺服器開啟。

如果電腦沒有安裝 Node.js 或 Python，可以直接用 Windows 內建的 PowerShell 啟動一個簡易伺服器（本專案已附上 `.claude/server.ps1`）：

```powershell
# 在專案資料夾（StudyPlan）底下執行
powershell -NoProfile -Command "Get-Content -Raw '.claude/server.ps1' | Invoke-Expression"
```

啟動後，用瀏覽器開啟 `http://localhost:5173` 即可。若電腦有安裝 Node.js 或 Python，也可以用：

```bash
npx serve .
# 或
python -m http.server 8000
```

## 資料來源設定

網頁會讀取 `app.js` 中 `SHEET_ID` 對應的 Google Sheet 匯出資料。若要換成別的試算表：

1. 將 Google Sheet 共用設定改為「知道連結的使用者」可檢視（或編輯）
2. 複製試算表網址中 `/d/` 與 `/edit` 之間的 ID
3. 貼到 `app.js` 檔案最上方的 `SHEET_ID` 常數

試算表欄位需包含：`項次`、`課程`、`科目`、`章節`、`任務`、`狀態`（狀態需以 `0`、`1`、`2` 開頭，分別代表待執行／學習中／已完成）。

## 部署到 GitHub Pages

1. 將此資料夾推送到 GitHub repository
2. Repository 設定 → Pages → Source 選擇 `main` 分支的根目錄
3. 儲存後幾分鐘內即可透過 GitHub 提供的網址存取
