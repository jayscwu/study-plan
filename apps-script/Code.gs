/**
 * 學習計畫進度追蹤 - Apps Script 後端
 *
 * 部署方式：
 * 1. 開啟這份 Google Sheet → 擴充功能(Extensions) → Apps Script
 * 2. 刪除預設的程式碼，貼上這個檔案全部內容
 * 3. 右上角「部署」→「新增部署作業」→ 類型選「網頁應用程式」
 *    - 執行身分(Execute as)：我 (你自己的帳號)
 *    - 存取權(Who has access)：所有人 (Anyone)
 * 4. 授權後會拿到一個 https://script.google.com/macros/s/xxx/exec 網址
 * 5. 把這個網址貼到前端 api.js 的 APPS_SCRIPT_URL
 */

const TASKS_SHEET = "讀書計畫";
const ACCOUNTS_SHEET = "登入帳號";
const REQUESTS_SHEET = "狀態變更申請";

const STATUS_LABELS = {
  "0": "0-待執行",
  "1": "1-學習中",
  "2": "2-已完成",
};

function statusCode(fullLabel) {
  const match = /^(\d)/.exec(String(fullLabel || "").trim());
  return match ? match[1] : "0";
}

function formatTaskDate(value, timeZone) {
  if (!value) return null;
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return Utilities.formatDate(value, timeZone, "yyyy-MM-dd");
  }
  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) {
    return Utilities.formatDate(parsed, timeZone, "yyyy-MM-dd");
  }
  return null;
}

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    // 容錯：分頁名稱前後可能有多打的空白
    sheet = ss.getSheets().find((s) => s.getName().trim() === name.trim());
  }
  if (!sheet) {
    const actual = ss.getSheets().map((s) => s.getName()).join("、");
    throw new Error(`找不到分頁：${name}（目前分頁有：${actual}）`);
  }
  return sheet;
}

function sheetRows(sheet) {
  const values = sheet.getDataRange().getValues();
  const header = values[0];
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    if (values[i].every((c) => c === "")) continue;
    const obj = { rowIndex: i + 1 };
    header.forEach((h, idx) => (obj[h] = values[i][idx]));
    rows.push(obj);
  }
  return rows;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    if (action === "users") return json(handleUsers());
    if (action === "tasks") return json(handleTasks(e.parameter.name, e.parameter.role));
    if (action === "requests") return json(handleRequests(e.parameter.name, e.parameter.role));
    return json({ ok: false, error: "未知的 action" });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    const action = e.parameter.action;
    const body = JSON.parse(e.postData.contents || "{}");
    if (action === "login") return json(handleLogin(body.name, body.pin));
    if (action === "submitRequest")
      return json(handleSubmitRequest(body.student, body.seq, body.newStatus));
    if (action === "reviewRequest")
      return json(handleReviewRequest(body.requestId, body.decision, body.reviewer));
    return json({ ok: false, error: "未知的 action" });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function handleUsers() {
  const rows = sheetRows(getSheet(ACCOUNTS_SHEET));
  return {
    ok: true,
    users: rows.map((r) => ({ name: String(r["姓名"]).trim(), role: String(r["角色"]).trim() })),
  };
}

function handleLogin(name, pin) {
  name = String(name || "").trim();
  pin = String(pin || "").trim();
  const rows = sheetRows(getSheet(ACCOUNTS_SHEET));
  const account = rows.find((r) => String(r["姓名"]).trim() === name);
  if (!account || String(account["PIN"]).trim() !== pin) {
    return { ok: false, error: "姓名或 PIN 碼不正確" };
  }
  return { ok: true, name, role: String(account["角色"]).trim() };
}

function handleTasks(name, role) {
  const taskRows = sheetRows(getSheet(TASKS_SHEET));
  const requestRows = sheetRows(getSheet(REQUESTS_SHEET));

  const pendingBySeq = {};
  requestRows.forEach((r) => {
    if (String(r["審核狀態"]).trim() === "待審核") {
      pendingBySeq[String(r["項次"])] = statusCode(r["申請新狀態"]);
    }
  });

  let filtered = taskRows;
  if (role === "學生") {
    filtered = taskRows.filter((r) => String(r["學生"]).trim() === String(name).trim());
  }

  const tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
  const tasks = filtered.map((r) => ({
    seq: r["項次"],
    student: r["學生"],
    course: r["課程"],
    subject: r["科目"],
    chapter: r["章節"],
    task: r["任務"],
    status: statusCode(r["狀態"]),
    pendingStatus: pendingBySeq[String(r["項次"])] || null,
    date: formatTaskDate(r["預計學習日期"], tz),
  }));

  return { ok: true, tasks };
}

function handleRequests(name, role) {
  const rows = sheetRows(getSheet(REQUESTS_SHEET));
  let filtered = rows;
  if (role === "學生") {
    filtered = rows.filter((r) => String(r["申請人"]).trim() === String(name).trim());
  }
  const requests = filtered
    .map((r) => ({
      requestId: r.rowIndex,
      time: r["申請時間"],
      applicant: r["申請人"],
      seq: r["項次"],
      course: r["課程"],
      subject: r["科目"],
      chapter: r["章節"],
      task: r["任務"],
      oldStatus: statusCode(r["原狀態"]),
      newStatus: statusCode(r["申請新狀態"]),
      reviewStatus: r["審核狀態"],
      reviewer: r["審核人"],
      reviewTime: r["審核時間"],
    }))
    .sort((a, b) => new Date(b.time) - new Date(a.time));
  return { ok: true, requests };
}

function handleSubmitRequest(student, seq, newStatus) {
  student = String(student || "").trim();
  seq = String(seq || "").trim();
  if (!STATUS_LABELS[newStatus]) return { ok: false, error: "新狀態不合法" };

  const tasksSheet = getSheet(TASKS_SHEET);
  const taskRows = sheetRows(tasksSheet);
  const task = taskRows.find((r) => String(r["項次"]).trim() === seq);
  if (!task) return { ok: false, error: "找不到這個任務" };
  if (String(task["學生"]).trim() !== student) return { ok: false, error: "這不是你的任務" };

  const requestsSheet = getSheet(REQUESTS_SHEET);
  const existing = sheetRows(requestsSheet);
  const hasPending = existing.some(
    (r) => String(r["項次"]).trim() === seq && String(r["審核狀態"]).trim() === "待審核"
  );
  if (hasPending) return { ok: false, error: "這項任務已經有審核中的申請" };

  requestsSheet.appendRow([
    new Date(),
    student,
    task["項次"],
    task["課程"],
    task["科目"],
    task["章節"],
    task["任務"],
    task["狀態"],
    STATUS_LABELS[newStatus],
    "待審核",
    "",
    "",
  ]);

  return { ok: true };
}

function handleReviewRequest(requestId, decision, reviewer) {
  requestId = Number(requestId);
  if (decision !== "核准" && decision !== "拒絕") return { ok: false, error: "審核決定不合法" };

  const requestsSheet = getSheet(REQUESTS_SHEET);
  const header = requestsSheet.getDataRange().getValues()[0];
  const col = (name) => header.indexOf(name) + 1;

  const rowValues = requestsSheet.getRange(requestId, 1, 1, header.length).getValues()[0];
  const rowObj = {};
  header.forEach((h, idx) => (rowObj[h] = rowValues[idx]));

  if (String(rowObj["審核狀態"]).trim() !== "待審核") {
    return { ok: false, error: "這筆申請已經審核過了" };
  }

  if (decision === "核准") {
    const tasksSheet = getSheet(TASKS_SHEET);
    const taskValues = tasksSheet.getDataRange().getValues();
    const taskHeader = taskValues[0];
    const seqCol = taskHeader.indexOf("項次");
    const statusCol = taskHeader.indexOf("狀態");
    for (let i = 1; i < taskValues.length; i++) {
      if (String(taskValues[i][seqCol]).trim() === String(rowObj["項次"]).trim()) {
        tasksSheet.getRange(i + 1, statusCol + 1).setValue(rowObj["申請新狀態"]);
        break;
      }
    }
  }

  requestsSheet.getRange(requestId, col("審核狀態")).setValue(decision === "核准" ? "已核准" : "已拒絕");
  requestsSheet.getRange(requestId, col("審核人")).setValue(reviewer || "");
  requestsSheet.getRange(requestId, col("審核時間")).setValue(new Date());

  return { ok: true };
}
