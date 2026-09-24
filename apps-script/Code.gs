/**
 * 學習計畫進度追蹤 - Apps Script 後端
 *
 * 部署方式（獨立專案，不綁定任何一份試算表）：
 * 1. 前往 https://script.google.com → 新增專案
 * 2. 刪除預設的程式碼，貼上這個檔案全部內容
 * 3. 把下面四個 `_FILE_ID` 常數換成你自己「登入帳號」「課程單元」「學習任務」「上課進度」四份 Google Sheet 的檔案 ID
 *    （網址 https://docs.google.com/spreadsheets/d/這一段/edit 裡的那一段）
 * 4. 右上角「部署」→「新增部署作業」→ 類型選「網頁應用程式」
 *    - 執行身分(Execute as)：我 (你自己的帳號)
 *    - 存取權(Who has access)：所有人 (Anyone)
 * 5. 第一次執行會跳出 Google 授權畫面，請同意存取這四份 Sheet
 * 6. 部署後會拿到一個 https://script.google.com/macros/s/xxx/exec 網址
 * 7. 把這個網址貼到前端 api.js 的 APPS_SCRIPT_URL
 */

const ACCOUNTS_FILE_ID = "1wF5p5oK5QKS0Wn-qNy6t1n1RvBU45yi_Nu1aEKKBBxU";
const COURSE_UNITS_FILE_ID = "1D7-F_QI8TSn-M1prbR932YNyTI4DKE6VLpF-EOdRETM";
const TASKS_FILE_ID = "1uZTPoOxmQCvoNus2RBxEgzjdXctyAcEd5dmV5QcjBHg";
const PROGRESS_FILE_ID = "1f4bAsQik7VSgiJvTB0gpZv8KxLn6lr1JHz8p-5yBZoE";

const STATUS_LABELS = {
  "0": "0-待執行",
  "1": "1-學習中",
  "2": "2-已完成",
};

const TIME_SLOTS = ["整天", "上午", "下午", "晚上"];

const PROGRESS_STATUSES = ["待學習", "學習中", "上完課"];

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

function parseTaskDate(value) {
  if (!value) return "";
  const parsed = new Date(`${value}T00:00:00`);
  return isNaN(parsed.getTime()) ? "" : parsed;
}

function openSheet(fileId) {
  return SpreadsheetApp.openById(fileId).getSheets()[0];
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
    if (action === "courseUnits") return json(handleCourseUnits());
    if (action === "progress") return json(handleProgress(e.parameter.name, e.parameter.role));
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
    if (action === "createTask") return json(handleCreateTask(body));
    if (action === "updateTask") return json(handleUpdateTask(body));
    if (action === "deleteTask") return json(handleDeleteTask(body));
    if (action === "reportTask") return json(handleReportTask(body));
    if (action === "reviewTask") return json(handleReviewTask(body));
    if (action === "setProgress") return json(handleSetProgress(body));
    return json({ ok: false, error: "未知的 action" });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// ---------- 帳號 ----------

function getAccountRows() {
  return sheetRows(openSheet(ACCOUNTS_FILE_ID));
}

function findAccount(name) {
  const rows = getAccountRows();
  return rows.find((r) => String(r["姓名"]).trim() === String(name || "").trim());
}

function isParent(name) {
  const account = findAccount(name);
  return !!account && String(account["角色"]).trim() === "家長";
}

function isStudent(name) {
  const account = findAccount(name);
  return !!account && String(account["角色"]).trim() === "學生";
}

function handleUsers() {
  const rows = getAccountRows();
  return {
    ok: true,
    users: rows.map((r) => ({ name: String(r["姓名"]).trim(), role: String(r["角色"]).trim() })),
  };
}

function handleLogin(name, pin) {
  name = String(name || "").trim();
  pin = String(pin || "").trim();
  const account = findAccount(name);
  if (!account || String(account["PIN"]).trim() !== pin) {
    return { ok: false, error: "姓名或 PIN 碼不正確" };
  }
  return { ok: true, name, role: String(account["角色"]).trim() };
}

// ---------- 課程單元 ----------
//
// 「課程單元」表欄位：項次 / 階層 / 課程單元
// 階層 1 = 課程、2 = 單元、3 = 學習項目；每一列的上層是往上最近一個階層較小的列。
// 項次是固定編號（上課進度用它對應學習項目），畫面順序依列的位置。

function getCourseTree() {
  const rows = sheetRows(openSheet(COURSE_UNITS_FILE_ID));
  const courses = [];
  let course = null;
  let unit = null;
  rows.forEach((r) => {
    const id = Number(r["項次"]);
    const level = Number(r["階層"]);
    const name = String(r["課程單元"] || "").trim();
    if (!id || !name) return;
    if (level === 1) {
      course = { id, name, units: [] };
      courses.push(course);
      unit = null;
    } else if (level === 2 && course) {
      unit = { id, name, items: [] };
      course.units.push(unit);
    } else if (level === 3 && unit) {
      unit.items.push({ id, name });
    }
  });
  return courses;
}

function handleCourseUnits() {
  return { ok: true, courses: getCourseTree() };
}

// 學習任務的「課程名稱」對應階層 1、「單元名稱」對應階層 2
function findCourseUnit(course, unit) {
  course = String(course || "").trim();
  unit = String(unit || "").trim();
  const c = getCourseTree().find((x) => x.name === course);
  return !!c && c.units.some((u) => u.name === unit);
}

function findLearningItem(itemId) {
  itemId = Number(itemId);
  for (const course of getCourseTree()) {
    for (const unit of course.units) {
      const item = unit.items.find((i) => i.id === itemId);
      if (item) return { course, unit, item };
    }
  }
  return null;
}

// ---------- 學習任務 ----------

function handleTasks(name, role) {
  const rows = sheetRows(openSheet(TASKS_FILE_ID));
  let filtered = rows;
  if (role === "學生") {
    filtered = rows.filter((r) => String(r["學生"]).trim() === String(name).trim());
  }

  const tz = Session.getScriptTimeZone();
  const tasks = filtered.map((r) => ({
    id: r.rowIndex,
    student: r["學生"],
    course: r["課程名稱"],
    unit: r["單元名稱"],
    task: r["任務名稱"],
    status: statusCode(r["狀態"]),
    date: formatTaskDate(r["預計學習日期"], tz),
    timeSlot: r["時段"] || "整天",
    reportStatus: r["回報狀態"] || "",
    reportTime: r["回報時間"] || "",
    reviewer: r["審核人"] || "",
    reviewTime: r["審核時間"] || "",
    createdBy: r["建立人"] || "",
  }));

  return { ok: true, tasks };
}

function taskCol(header, name) {
  return header.indexOf(name) + 1;
}

function getTaskRow(id) {
  const sheet = openSheet(TASKS_FILE_ID);
  const header = sheet.getDataRange().getValues()[0];
  id = Number(id);
  if (!id || id < 2 || id > sheet.getLastRow()) return null;
  const values = sheet.getRange(id, 1, 1, header.length).getValues()[0];
  const obj = { rowIndex: id };
  header.forEach((h, idx) => (obj[h] = values[idx]));
  return { sheet, header, row: obj };
}

function handleCreateTask(body) {
  const creator = String(body.creator || "").trim();
  const student = String(body.student || "").trim();
  const course = String(body.course || "").trim();
  const unit = String(body.unit || "").trim();
  const task = String(body.task || "").trim();
  const timeSlot = String(body.timeSlot || "").trim();

  if (!isParent(creator)) return { ok: false, error: "沒有權限新增任務" };
  if (!isStudent(student)) return { ok: false, error: "找不到這個學生" };
  if (!course || !unit) return { ok: false, error: "請選擇課程與單元" };
  if (!findCourseUnit(course, unit)) return { ok: false, error: "找不到這個課程/單元" };
  if (!task) return { ok: false, error: "請輸入任務名稱" };
  if (TIME_SLOTS.indexOf(timeSlot) === -1) return { ok: false, error: "時段不合法" };

  const sheet = openSheet(TASKS_FILE_ID);
  const header = sheet.getDataRange().getValues()[0];
  const rowIndex = sheet.getLastRow() + 1;

  sheet.getRange(rowIndex, taskCol(header, "學生")).setValue(student);
  sheet.getRange(rowIndex, taskCol(header, "課程名稱")).setValue(course);
  sheet.getRange(rowIndex, taskCol(header, "單元名稱")).setValue(unit);
  sheet.getRange(rowIndex, taskCol(header, "任務名稱")).setValue(task);
  sheet.getRange(rowIndex, taskCol(header, "狀態")).setValue(STATUS_LABELS["0"]);
  sheet.getRange(rowIndex, taskCol(header, "預計學習日期")).setValue(parseTaskDate(body.date));
  sheet.getRange(rowIndex, taskCol(header, "時段")).setValue(timeSlot);
  sheet.getRange(rowIndex, taskCol(header, "建立人")).setValue(creator);

  return { ok: true };
}

function handleUpdateTask(body) {
  const editor = String(body.editor || "").trim();
  if (!isParent(editor)) return { ok: false, error: "沒有權限編輯任務" };

  const found = getTaskRow(body.id);
  if (!found) return { ok: false, error: "找不到這個任務" };

  const student = String(body.student || "").trim();
  const course = String(body.course || "").trim();
  const unit = String(body.unit || "").trim();
  const task = String(body.task || "").trim();
  const timeSlot = String(body.timeSlot || "").trim();

  if (!isStudent(student)) return { ok: false, error: "找不到這個學生" };
  if (!course || !unit || !findCourseUnit(course, unit)) return { ok: false, error: "找不到這個課程/單元" };
  if (!task) return { ok: false, error: "請輸入任務名稱" };
  if (TIME_SLOTS.indexOf(timeSlot) === -1) return { ok: false, error: "時段不合法" };

  const { sheet, header, row } = found;
  sheet.getRange(row.rowIndex, taskCol(header, "學生")).setValue(student);
  sheet.getRange(row.rowIndex, taskCol(header, "課程名稱")).setValue(course);
  sheet.getRange(row.rowIndex, taskCol(header, "單元名稱")).setValue(unit);
  sheet.getRange(row.rowIndex, taskCol(header, "任務名稱")).setValue(task);
  sheet.getRange(row.rowIndex, taskCol(header, "預計學習日期")).setValue(parseTaskDate(body.date));
  sheet.getRange(row.rowIndex, taskCol(header, "時段")).setValue(timeSlot);

  return { ok: true };
}

function handleDeleteTask(body) {
  const editor = String(body.editor || "").trim();
  if (!isParent(editor)) return { ok: false, error: "沒有權限刪除任務" };

  const found = getTaskRow(body.id);
  if (!found) return { ok: false, error: "找不到這個任務" };

  found.sheet.deleteRow(found.row.rowIndex);
  return { ok: true };
}

function handleReportTask(body) {
  const student = String(body.student || "").trim();
  const found = getTaskRow(body.id);
  if (!found) return { ok: false, error: "找不到這個任務" };

  const { sheet, header, row } = found;
  if (String(row["學生"]).trim() !== student) return { ok: false, error: "這不是你的任務" };
  if (statusCode(row["狀態"]) === "2") return { ok: false, error: "這個任務已經完成了" };
  if (String(row["回報狀態"]).trim() === "待審核") return { ok: false, error: "這個任務已經在審核中" };

  sheet.getRange(row.rowIndex, taskCol(header, "回報狀態")).setValue("待審核");
  sheet.getRange(row.rowIndex, taskCol(header, "回報時間")).setValue(new Date());

  return { ok: true };
}

function handleReviewTask(body) {
  const reviewer = String(body.reviewer || "").trim();
  const decision = body.decision;
  if (decision !== "核准" && decision !== "拒絕") return { ok: false, error: "審核決定不合法" };
  if (!isParent(reviewer)) return { ok: false, error: "沒有權限審核" };

  const found = getTaskRow(body.id);
  if (!found) return { ok: false, error: "找不到這個任務" };

  const { sheet, header, row } = found;
  if (String(row["回報狀態"]).trim() !== "待審核") {
    return { ok: false, error: "這個任務目前沒有待審核的回報" };
  }

  if (decision === "核准") {
    sheet.getRange(row.rowIndex, taskCol(header, "狀態")).setValue(STATUS_LABELS["2"]);
    sheet.getRange(row.rowIndex, taskCol(header, "回報狀態")).setValue("已核准");
  } else {
    sheet.getRange(row.rowIndex, taskCol(header, "回報狀態")).setValue("已拒絕");
  }
  sheet.getRange(row.rowIndex, taskCol(header, "審核人")).setValue(reviewer);
  sheet.getRange(row.rowIndex, taskCol(header, "審核時間")).setValue(new Date());

  return { ok: true };
}

// ---------- 上課進度 ----------
//
// 「上課進度」表欄位：學生 / 項次 / 課程單元 / 狀態 / 開始學習日期 / 上完課日期 / 更新人 / 更新時間
// 一位學生的一個學習項目一列；沒有資料的項目視為「待學習」。

function progressFromRow(r, tz) {
  const status = String(r["狀態"]).trim();
  return {
    student: String(r["學生"]).trim(),
    itemId: Number(r["項次"]),
    status: PROGRESS_STATUSES.indexOf(status) === -1 ? "待學習" : status,
    startDate: formatTaskDate(r["開始學習日期"], tz),
    doneDate: formatTaskDate(r["上完課日期"], tz),
    updatedBy: r["更新人"] || "",
    updatedTime: r["更新時間"] || "",
  };
}

function handleProgress(name, role) {
  const rows = sheetRows(openSheet(PROGRESS_FILE_ID));
  let filtered = rows;
  if (role === "學生") {
    filtered = rows.filter((r) => String(r["學生"]).trim() === String(name).trim());
  }
  const tz = Session.getScriptTimeZone();
  return { ok: true, progress: filtered.map((r) => progressFromRow(r, tz)) };
}

function handleSetProgress(body) {
  const editor = String(body.editor || "").trim();
  const student = String(body.student || "").trim();
  const itemId = Number(body.itemId);
  const status = String(body.status || "").trim();
  const date = String(body.date || "").trim();

  const account = findAccount(editor);
  const editorRole = account ? String(account["角色"]).trim() : "";
  if (editorRole === "學生") {
    if (editor !== student) return { ok: false, error: "只能更新自己的上課進度" };
  } else if (editorRole !== "家長") {
    return { ok: false, error: "沒有權限更新上課進度" };
  }
  if (!isStudent(student)) return { ok: false, error: "找不到這個學生" };
  if (PROGRESS_STATUSES.indexOf(status) === -1) return { ok: false, error: "狀態不合法" };

  const found = findLearningItem(itemId);
  if (!found) return { ok: false, error: "找不到這個學習項目" };

  const tz = Session.getScriptTimeZone();
  const today = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");
  if (status !== "待學習") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !parseTaskDate(date)) return { ok: false, error: "日期不合法" };
    if (date > today) return { ok: false, error: "不能填未來的日期" };
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = openSheet(PROGRESS_FILE_ID);
    const header = sheet.getDataRange().getValues()[0];
    const existing = sheetRows(sheet).find(
      (r) => String(r["學生"]).trim() === student && Number(r["項次"]) === itemId
    );

    // 待學習：清掉兩個日期；學習中：記開始日期、清掉上完課日期；
    // 上完課：記上完課日期，沒有開始日期（或開始日期比較晚）就用同一天
    let startDate = existing ? formatTaskDate(existing["開始學習日期"], tz) : null;
    let doneDate = null;
    if (status === "待學習") {
      startDate = null;
    } else if (status === "學習中") {
      startDate = date;
    } else {
      doneDate = date;
      if (!startDate || startDate > date) startDate = date;
    }

    const updatedTime = new Date();
    const values = {
      "學生": student,
      "項次": itemId,
      "課程單元": found.item.name,
      "狀態": status,
      "開始學習日期": startDate ? parseTaskDate(startDate) : "",
      "上完課日期": doneDate ? parseTaskDate(doneDate) : "",
      "更新人": editor,
      "更新時間": updatedTime,
    };
    const rowIndex = existing ? existing.rowIndex : sheet.getLastRow() + 1;
    const rowValues = header.map((h) => (h in values ? values[h] : existing ? existing[h] : ""));
    sheet.getRange(rowIndex, 1, 1, header.length).setValues([rowValues]);

    return {
      ok: true,
      progress: { student, itemId, status, startDate, doneDate, updatedBy: editor, updatedTime },
    };
  } finally {
    lock.releaseLock();
  }
}
