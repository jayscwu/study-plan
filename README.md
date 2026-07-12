# 學習計畫進度追蹤

一個讀寫 Google Sheet 學習計畫的網頁，讓學生與家長掌握學習進度。支援登入、依學生／課程分組呈現、以及「學生申請狀態變更 → 家長審核」的流程。電腦與手機瀏覽器皆可使用。

## 功能

- PIN 碼登入（4 位使用者：2 位家長＋2 位學生）
- 儀表板：依課程／科目分組呈現學習任務（科目卡片預設收合，點擊展開），各層級顯示完成度；可切換「列表／日曆」檢視，日曆會依「預計學習日期」把任務排到對應日期，沒有日期的任務另外列在「未排定日期」
- 申請審核（獨立頁籤，不影響儀表板）：學生選課程→科目→章節→任務提出「狀態變更申請」；家長核准／拒絕申請，核准後會直接更新 Google Sheet
- 依狀態篩選、關鍵字搜尋、響應式版面（手機自動切換為卡片列表）

## 架構

```
瀏覽器 (GitHub Pages 靜態頁: index.html / style.css / app.js / api.js)
   │  fetch (JSON)
   ▼
Google Apps Script Web App（部署在你自己的 Google 帳號、綁定同一份 Sheet）
   │  讀寫
   ▼
Google Sheet：讀書計畫 / 登入帳號 / 狀態變更申請（三個分頁）
```

前端本身不儲存任何資料，所有讀寫都透過 Apps Script 這層 API。這是**一次性設定**，設定完成後平常只要維護 Google Sheet 內容即可。

## 一次性設定步驟

### 1. 在 Google Sheet 新增欄位與分頁

在「讀書計畫」分頁（項次／學生／課程／科目／章節／任務／狀態）最後面加一欄「預計學習日期」（日期格式，可留空，日曆會用這欄排任務）。

除此之外，需要再新增：

**「登入帳號」分頁**（手動填入 4 位使用者）

| 姓名 | 角色 | PIN |
|---|---|---|
| mason | 學生 | 自訂 4 位數字 |
| (學生2姓名) | 學生 | ... |
| (家長1姓名) | 家長 | ... |
| (家長2姓名) | 家長 | ... |

⚠️ 「學生」角色的姓名必須與「讀書計畫」分頁裡「學生」欄位的值**完全一致**（例如都是 `mason`），否則篩選不到資料。

**「狀態變更申請」分頁**（留空表頭即可，由程式自動寫入資料）

| 申請時間 | 申請人 | 項次 | 課程 | 科目 | 章節 | 任務 | 原狀態 | 申請新狀態 | 審核狀態 | 審核人 | 審核時間 |
|---|---|---|---|---|---|---|---|---|---|---|---|

### 2. 部署 Apps Script 後端

1. 開啟這份 Google Sheet → 上方選單「擴充功能」(Extensions) → 「Apps Script」
2. 刪除編輯器裡預設的程式碼，貼上 [apps-script/Code.gs](apps-script/Code.gs) 的完整內容
3. 右上角「部署」(Deploy) → 「新增部署作業」(New deployment) → 類型選「網頁應用程式」(Web app)
   - 執行身分 (Execute as)：**我**（你自己的帳號）
   - 存取權 (Who has access)：**所有人** (Anyone)
4. 點「部署」，第一次會跳出 Google 授權畫面，允許存取
5. 複製產生的網址（格式類似 `https://script.google.com/macros/s/xxxxx/exec`）

### 3. 設定前端

打開 [api.js](api.js)，把第一行的網址換成剛剛複製的那個：

```js
const APPS_SCRIPT_URL = "貼上你的 Apps Script 網址";
```

存檔後，若已發佈到 GitHub Pages，把改動 push 上去即可生效。

### 4.（建議）收回 Google Sheet 的公開共用權限

設定完成、確認登入與審核都正常運作後，可以把 Sheet 的共用權限改回「限制」（只有你自己或指定帳號能開啟），因為之後前端都是透過 Apps Script（用你的帳號執行）讀寫，不再需要 Sheet 本身公開。

## 安全性說明

PIN 碼是給家庭成員快速辨識用的**輕量機制**，不是正式的帳號密碼安全機制（沒有錯誤鎖定、沒有額外加密）。適合家庭內部使用，請不要用來保護重要或敏感資料。

## 本機預覽

**不能直接雙擊開啟 `index.html`**（網址會變成 `file://...`），瀏覽器會擋掉跨網域請求。請透過本機網頁伺服器開啟：

```powershell
# 在專案資料夾（StudyPlan）底下執行
powershell -NoProfile -Command "Get-Content -Raw '.claude/server.ps1' | Invoke-Expression"
```

啟動後用瀏覽器開啟 `http://localhost:5173`。若電腦有裝 Node.js 或 Python，也可以用 `npx serve .` 或 `python -m http.server 8000`。

## 部署到 GitHub Pages

1. 將此資料夾推送到 GitHub repository
2. Repository 設定 → Pages → Source 選擇分支的根目錄
3. 儲存後幾分鐘內即可透過 GitHub 提供的網址存取
