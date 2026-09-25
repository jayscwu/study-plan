const STATUS_LABELS = {
  "0": "待執行",
  "1": "學習中",
  "2": "已完成",
};

// 上課進度的三種狀態；code 沿用任務狀態的配色（status-0/1/2）
const PROGRESS_STATUSES = ["待學習", "學習中", "上完課"];
const PROGRESS_STATUS_CODE = { "待學習": "0", "學習中": "1", "上完課": "2" };

const WEEKDAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"];

const APP_VERSION = "v3.0";

const VIEW_TITLES = {
  overview: "儀表板",
  progress: "上課進度",
  manage: "任務管理",
  me: "我的",
};

const SESSION_KEY = "studyplan_session";
const PROGRESS_PREFS_KEY = "studyplan_progress_prefs";

const el = {
  loginView: document.getElementById("login-view"),
  loginUsers: document.getElementById("login-users"),
  loginPinPanel: document.getElementById("login-pin-panel"),
  loginSelectedName: document.getElementById("login-selected-name"),
  loginPinInput: document.getElementById("login-pin-input"),
  loginError: document.getElementById("login-error"),
  loginBackBtn: document.getElementById("login-back-btn"),
  loginSubmitBtn: document.getElementById("login-submit-btn"),
  loginLoadError: document.getElementById("login-load-error"),

  appRoot: document.querySelector(".app"),
  appView: document.getElementById("app-view"),
  logoutBtn: document.getElementById("logout-btn"),
  mainNav: document.getElementById("main-nav"),
  navManageBtn: document.getElementById("nav-manage-btn"),

  statusBar: document.getElementById("status-bar"),
  statusBarAvatar: document.getElementById("status-bar-avatar"),
  statusBarName: document.getElementById("status-bar-name"),
  statusBarVersion: document.getElementById("status-bar-version"),
  statusBarViewTitle: document.getElementById("status-bar-view-title"),
  statusBarUpdated: document.getElementById("status-bar-updated"),
  userMenuTrigger: document.getElementById("user-menu-trigger"),
  userMenu: document.getElementById("user-menu"),

  refreshBtn: document.getElementById("refresh-btn"),
  retryBtn: document.getElementById("retry-btn"),
  loadingState: document.getElementById("loading-state"),
  errorState: document.getElementById("error-state"),
  errorMessage: document.getElementById("error-message"),

  viewOverview: document.getElementById("view-overview"),
  viewProgress: document.getElementById("view-progress"),
  viewManage: document.getElementById("view-manage"),
  viewMe: document.getElementById("view-me"),

  pageTitle: document.getElementById("page-title"),
  pageSubtitleText: document.getElementById("page-subtitle-text"),
  filterBtn: document.getElementById("filter-btn"),

  homeAvatar: document.getElementById("home-avatar"),
  homeName: document.getElementById("home-name"),
  homeSub: document.getElementById("home-sub"),
  homeGoProgress: document.getElementById("home-go-progress"),
  homeGoLearning: document.getElementById("home-go-learning"),

  meAvatar: document.getElementById("me-avatar"),
  meName: document.getElementById("me-name"),
  meRole: document.getElementById("me-role"),
  meStudents: document.getElementById("me-students"),
  meStudentList: document.getElementById("me-student-list"),
  meUpdated: document.getElementById("me-updated"),
  meVersion: document.getElementById("me-version"),
  meLogoutBtn: document.getElementById("me-logout-btn"),

  bottomNav: document.getElementById("bottom-nav"),
  bottomNavManage: document.getElementById("bottom-nav-manage"),
  manageBadge: document.getElementById("manage-badge"),

  filterSheetOverlay: document.getElementById("filter-sheet-overlay"),
  filterSheetClose: document.getElementById("filter-sheet-close"),
  filterSheetReset: document.getElementById("filter-sheet-reset"),
  filterSheetApply: document.getElementById("filter-sheet-apply"),
  sheetModeOptions: document.getElementById("sheet-mode-options"),
  sheetBoardFilters: document.getElementById("sheet-board-filters"),
  sheetCourseChips: document.getElementById("sheet-course-chips"),
  sheetStatusChips: document.getElementById("sheet-status-chips"),

  studentToolbar: document.getElementById("student-toolbar"),
  studentSelect: document.getElementById("student-select"),

  reviewBanner: document.getElementById("review-banner"),
  reviewBannerText: document.getElementById("review-banner-text"),
  reviewBannerBtn: document.getElementById("review-banner-btn"),

  statTotal: document.getElementById("stat-total"),
  statDone: document.getElementById("stat-done"),
  statProgress: document.getElementById("stat-progress"),
  statTodo: document.getElementById("stat-todo"),
  overallPercent: document.getElementById("overall-percent"),
  overallProgressBar: document.getElementById("overall-progress-bar"),

  coursesBlock: document.getElementById("courses-block"),
  coursesHeader: document.getElementById("courses-header"),
  courseProgressList: document.getElementById("course-progress-list"),

  recentBlock: document.getElementById("recent-block"),
  recentHeader: document.getElementById("recent-header"),
  recentList: document.getElementById("recent-list"),
  recentCount: document.getElementById("recent-count"),
  noRecent: document.getElementById("no-recent"),

  learningBlock: document.getElementById("learning-block"),
  learningHeader: document.getElementById("learning-header"),
  learningList: document.getElementById("learning-list"),
  learningCount: document.getElementById("learning-count"),
  noLearning: document.getElementById("no-learning"),

  overdueBlock: document.getElementById("overdue-block"),
  overdueHeader: document.getElementById("overdue-header"),
  overdueList: document.getElementById("overdue-list"),
  overdueCount: document.getElementById("overdue-count"),
  noOverdue: document.getElementById("no-overdue"),

  todayBlock: document.getElementById("today-block"),
  todayHeader: document.getElementById("today-header"),
  todayList: document.getElementById("today-list"),
  todayCount: document.getElementById("today-count"),
  noToday: document.getElementById("no-today"),

  tomorrowBlock: document.getElementById("tomorrow-block"),
  tomorrowHeader: document.getElementById("tomorrow-header"),
  tomorrowList: document.getElementById("tomorrow-list"),
  tomorrowCount: document.getElementById("tomorrow-count"),
  noTomorrow: document.getElementById("no-tomorrow"),

  progressModeToggle: document.getElementById("progress-mode-toggle"),
  progressAccordion: document.getElementById("progress-accordion"),
  progressBoard: document.getElementById("progress-board"),
  boardCourseFilter: document.getElementById("board-course-filter"),
  boardStatusFilter: document.getElementById("board-status-filter"),
  boardColumns: document.getElementById("board-columns"),
  noBoardResults: document.getElementById("no-board-results"),
  boardPrev: document.getElementById("board-prev"),
  boardNext: document.getElementById("board-next"),

  progressCourseTabs: document.getElementById("progress-course-tabs"),
  progressUnits: document.getElementById("progress-units"),
  noProgressUnits: document.getElementById("no-progress-units"),

  manageCourseTabs: document.getElementById("manage-course-tabs"),
  manageTasksTree: document.getElementById("manage-tasks-tree"),

  taskFab: document.getElementById("task-fab"),
  taskModalOverlay: document.getElementById("task-modal-overlay"),
  modalCloseBtn: document.getElementById("modal-close-btn"),
  modalDoneBtn: document.getElementById("modal-done-btn"),
  modalAddBtn: document.getElementById("modal-add-btn"),
  modalStudentSelect: document.getElementById("modal-student-select"),
  modalCourseSelect: document.getElementById("modal-course-select"),
  modalUnitSelect: document.getElementById("modal-unit-select"),
  modalTaskName: document.getElementById("modal-task-name"),
  modalTaskDate: document.getElementById("modal-task-date"),
  modalTaskSlot: document.getElementById("modal-task-slot"),
  modalMessage: document.getElementById("modal-message"),

  toastContainer: document.getElementById("toast-container"),
};

let session = loadSession();
let allTasks = [];
let allCourses = [];
let learningItemIndex = new Map();
let progressByKey = new Map();
let savingItems = new Set();
let allStudents = [];
let currentStudent = null;
let selectedLoginUser = null;
let editingTaskId = null;
let addingTaskUnit = null;
let expandedUnits = new Set();
let expandedProgressUnits = new Set();
let expandedDashboardCourses = new Set();
let boardOpenUnits = null;
let boardBarPercent = new Map();
let progressPrefs = loadProgressPrefs();
let currentCourse = null;

let currentView = "overview";

// ---------- Session ----------

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function saveSession(s) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ---------- Login ----------

function initLogin() {
  Api.getUsers()
    .then((res) => {
      if (!res.ok) throw new Error(res.error || "無法取得使用者清單");
      renderLoginUsers(res.users);
    })
    .catch((err) => {
      el.loginLoadError.textContent = `無法連線到後端（${err.message}），請確認 Apps Script 網址是否已設定。`;
      el.loginLoadError.classList.remove("hidden");
    });
}

function renderLoginUsers(users) {
  el.loginUsers.innerHTML = "";
  for (const u of users) {
    const card = document.createElement("div");
    card.className = "login-user-card";
    card.innerHTML = `
      <div class="login-user-avatar">${escapeHtml(u.name.slice(0, 1))}</div>
      <p class="login-user-name">${escapeHtml(u.name)}</p>
      <p class="login-user-role">${escapeHtml(u.role)}</p>
    `;
    card.addEventListener("click", () => {
      if (card.classList.contains("expanded")) return;
      selectLoginUser(u, card);
    });
    el.loginUsers.appendChild(card);
  }
}

function selectLoginUser(user, card) {
  selectedLoginUser = user;
  el.loginSelectedName.textContent = `${user.name}（${user.role}）`;
  el.loginError.classList.add("hidden");
  el.loginPinInput.value = "";

  [...el.loginUsers.children].forEach((c) => c.classList.toggle("hidden", c !== card));
  card.classList.add("expanded");
  card.appendChild(el.loginPinPanel);
  el.loginPinPanel.classList.remove("hidden");
  el.loginPinInput.focus();
}

function resetLoginSelection() {
  selectedLoginUser = null;
  el.loginPinPanel.classList.add("hidden");
  el.loginView.appendChild(el.loginPinPanel);
  [...el.loginUsers.children].forEach((c) => {
    c.classList.remove("hidden", "expanded");
  });
}

function submitLogin() {
  if (!selectedLoginUser) return;
  const pin = el.loginPinInput.value.trim();
  if (!pin) return;
  el.loginSubmitBtn.disabled = true;
  Api.login(selectedLoginUser.name, pin)
    .then((res) => {
      el.loginSubmitBtn.disabled = false;
      if (!res.ok) {
        el.loginError.textContent = res.error || "登入失敗";
        el.loginError.classList.remove("hidden");
        el.loginPinInput.value = "";
        el.loginPinInput.focus();
        return;
      }
      session = { name: res.name, role: res.role };
      saveSession(session);
      enterApp();
    })
    .catch((err) => {
      el.loginSubmitBtn.disabled = false;
      el.loginError.textContent = `連線失敗（${err.message}）`;
      el.loginError.classList.remove("hidden");
    });
}

el.loginBackBtn.addEventListener("click", resetLoginSelection);

el.loginSubmitBtn.addEventListener("click", submitLogin);
el.loginPinInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitLogin();
});

el.logoutBtn.addEventListener("click", () => {
  clearSession();
  session = null;
  window.location.reload();
});

// ---------- Status bar ----------

function renderStatusBar() {
  el.statusBarAvatar.textContent = session.name.slice(0, 1);
  el.statusBarName.textContent = session.name;
  el.statusBarVersion.textContent = APP_VERSION;
  el.statusBarViewTitle.textContent = VIEW_TITLES[currentView];
}

function openUserMenu() {
  const rect = el.userMenuTrigger.getBoundingClientRect();
  el.userMenu.style.top = `${rect.bottom + 6}px`;
  el.userMenu.style.left = `${rect.left}px`;
  el.userMenu.classList.remove("hidden");
}

function closeUserMenu() {
  el.userMenu.classList.add("hidden");
}

el.userMenuTrigger.addEventListener("click", () => {
  if (el.userMenu.classList.contains("hidden")) {
    openUserMenu();
  } else {
    closeUserMenu();
  }
});

document.addEventListener("click", (e) => {
  if (el.userMenu.classList.contains("hidden")) return;
  if (el.userMenu.contains(e.target) || el.userMenuTrigger.contains(e.target)) return;
  closeUserMenu();
});

// ---------- App shell ----------

function enterApp() {
  el.loginView.classList.add("hidden");
  el.appView.classList.remove("hidden");
  renderStatusBar();
  el.studentToolbar.classList.toggle("hidden", session.role !== "家長");
  el.navManageBtn.classList.toggle("hidden", session.role !== "家長");
  el.bottomNavManage.classList.toggle("hidden", session.role !== "家長");
  updateFabVisibility();
  updatePageHeader();
  loadData();
}

function init() {
  if (session) {
    enterApp();
  } else {
    initLogin();
  }
}

// ---------- Nav ----------

el.mainNav.addEventListener("click", (e) => {
  const btn = e.target.closest(".nav-tab");
  if (!btn) return;
  setCurrentView(btn.dataset.view);
});

function setCurrentView(view) {
  currentView = view;
  [...el.mainNav.children].forEach((btn) => btn.classList.toggle("active", btn.dataset.view === view));
  [...el.bottomNav.children].forEach((btn) => btn.classList.toggle("active", btn.dataset.view === view));
  el.statusBarViewTitle.textContent = VIEW_TITLES[currentView];
  applyViewVisibility();
  updateFabVisibility();
  updateWideLayout();
  updatePageHeader();
}

// 只有「上課進度」的看板模式撐滿螢幕寬，其他畫面維持置中的閱讀寬度
function updateWideLayout() {
  el.appRoot.classList.toggle("wide", currentView === "progress" && progressPrefs.view === "board");
}

function updateFabVisibility() {
  const show = session && session.role === "家長" && currentView === "manage";
  el.taskFab.classList.toggle("hidden", !show);
}

function applyViewVisibility() {
  const loadingHidden = el.loadingState.classList.contains("hidden");
  const errorHidden = el.errorState.classList.contains("hidden");
  const dataLoaded = loadingHidden && errorHidden;
  el.viewOverview.classList.toggle("hidden", !(dataLoaded && currentView === "overview"));
  el.viewProgress.classList.toggle("hidden", !(dataLoaded && currentView === "progress"));
  el.viewManage.classList.toggle("hidden", !(dataLoaded && currentView === "manage"));
  el.viewMe.classList.toggle("hidden", !(dataLoaded && currentView === "me"));
}

// ---------- Data loading ----------

function loadData(silent) {
  if (!silent) showLoading();
  Promise.all([
    Api.getTasks(session.name, session.role),
    Api.getCourseUnits(),
    Api.getUsers(),
    Api.getProgress(session.name, session.role),
  ])
    .then(([tasksRes, courseUnitsRes, usersRes, progressRes]) => {
      if (!tasksRes.ok) throw new Error(tasksRes.error || "讀取任務失敗");
      if (!courseUnitsRes.ok || !courseUnitsRes.courses) throw new Error(courseUnitsRes.error || "讀取課程單元失敗");
      if (!usersRes.ok) throw new Error(usersRes.error || "讀取使用者失敗");
      if (!progressRes.ok) throw new Error(progressRes.error || "讀取上課進度失敗");
      allTasks = tasksRes.tasks;
      allCourses = courseUnitsRes.courses;
      buildLearningItemIndex();
      // 背景更新時，保留還在儲存中的項目畫面上的狀態
      const pending = [...savingItems].map((key) => progressByKey.get(key)).filter(Boolean);
      setProgressRows(progressRes.progress);
      pending.forEach((p) => progressByKey.set(progressKey(p.student, p.itemId), p));
      allStudents = usersRes.users.filter((u) => u.role === "學生");

      if (session.role === "家長") {
        const students = allStudents.map((s) => s.name);
        const prevSelection = currentStudent;
        el.studentSelect.innerHTML = students
          .map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`)
          .join("");
        currentStudent = students.includes(prevSelection) ? prevSelection : students[0] || null;
        el.studentSelect.value = currentStudent || "";
      } else {
        currentStudent = session.name;
      }

      renderAll();
      if (!silent) showData();
    })
    .catch((err) => {
      console.error("讀取資料失敗", err);
      if (silent) {
        showToast("背景更新失敗，請稍後重新整理", "error");
      } else {
        showError(err);
      }
    });
}

function selectStudent(name) {
  currentStudent = name;
  el.studentSelect.value = name;
  boardOpenUnits = null;
  boardBarPercent.clear();
  renderAll();
}

el.studentSelect.addEventListener("change", (e) => selectStudent(e.target.value));

function showLoading() {
  el.loadingState.classList.remove("hidden");
  el.errorState.classList.add("hidden");
  el.viewOverview.classList.add("hidden");
  el.viewProgress.classList.add("hidden");
  el.viewManage.classList.add("hidden");
  el.viewMe.classList.add("hidden");
}

function showError(err) {
  el.loadingState.classList.add("hidden");
  el.errorState.classList.remove("hidden");
  el.viewOverview.classList.add("hidden");
  el.viewProgress.classList.add("hidden");
  el.viewManage.classList.add("hidden");
  el.viewMe.classList.add("hidden");
  el.errorMessage.textContent = err && err.message
    ? `讀取資料失敗（${err.message}），請確認網路連線或稍後再試。`
    : "讀取資料失敗，請確認網路連線或稍後再試。";
}

function showData() {
  el.loadingState.classList.add("hidden");
  el.errorState.classList.add("hidden");
  applyViewVisibility();
}

// ---------- 課程單元 / 上課進度資料 ----------

function buildLearningItemIndex() {
  learningItemIndex = new Map();
  allCourses.forEach((course) =>
    course.units.forEach((unit) =>
      unit.items.forEach((item) => learningItemIndex.set(item.id, { course, unit, item }))
    )
  );
}

function progressKey(student, itemId) {
  return `${student}|${itemId}`;
}

function setProgressRows(rows) {
  progressByKey = new Map();
  rows.forEach((p) => progressByKey.set(progressKey(p.student, p.itemId), p));
}

function getItemProgress(itemId, student) {
  student = student || currentStudent;
  return (
    progressByKey.get(progressKey(student, itemId)) || {
      student,
      itemId,
      status: "待學習",
      startDate: null,
      doneDate: null,
    }
  );
}

function countProgress(items) {
  const counts = { total: items.length, done: 0, progress: 0, todo: 0 };
  items.forEach((item) => {
    const status = getItemProgress(item.id).status;
    if (status === "上完課") counts.done++;
    else if (status === "學習中") counts.progress++;
    else counts.todo++;
  });
  counts.percent = counts.total ? Math.round((counts.done / counts.total) * 100) : 0;
  return counts;
}

function courseItems(course) {
  return course.units.flatMap((u) => u.items);
}

function todayKey() {
  const now = new Date();
  return dateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

// 跟後端 handleSetProgress 同樣的日期規則，讓畫面先更新
function applyProgressChange(prev, status, date) {
  let startDate = prev.startDate || null;
  let doneDate = null;
  if (status === "待學習") {
    startDate = null;
  } else if (status === "學習中") {
    startDate = date;
  } else {
    doneDate = date;
    if (!startDate || startDate > date) startDate = date;
  }
  return { ...prev, status, startDate, doneDate, updatedBy: session.name, updatedTime: new Date().toISOString() };
}

function saveProgress(itemId, status, date) {
  const student = currentStudent;
  const key = progressKey(student, itemId);
  const prevRow = progressByKey.get(key);
  const prev = getItemProgress(itemId, student);
  const itemName = learningItemIndex.get(itemId).item.name;

  progressByKey.set(key, applyProgressChange(prev, status, date));
  savingItems.add(key);
  renderProgressViews();

  Api.setProgress({ editor: session.name, student, itemId, status, date })
    .then((res) => {
      if (!res.ok) throw new Error(res.error || "儲存失敗");
      progressByKey.set(key, res.progress);
      showToast(`已儲存：${itemName} → ${status}`, "success");
    })
    .catch((err) => {
      if (prevRow) progressByKey.set(key, prevRow);
      else progressByKey.delete(key);
      showToast(`儲存失敗（${err.message}）`, "error");
    })
    .finally(() => {
      savingItems.delete(key);
      renderProgressViews();
    });
}

// ---------- Rendering ----------

function getStudentTasks() {
  if (session.role === "家長") {
    return allTasks.filter((t) => t.student === currentStudent);
  }
  return allTasks;
}

function renderAll() {
  const lastUpdated = new Date().toLocaleString("zh-TW", { hour12: false });
  el.statusBarUpdated.textContent = `最後更新：${lastUpdated}`;

  renderCourseTabs(el.progressCourseTabs);
  renderCourseTabs(el.manageCourseTabs);

  renderProgressViews();
  renderReviewBanner();
  renderOverview(getStudentTasks());
  renderManageTasksList();
  renderManageBadge();
  renderMe();
  updatePageHeader();
}

function renderProgressViews() {
  renderSummary();
  renderCourseProgress();
  renderRecent();
  renderLearning();
  renderProgressUnits();
  renderProgressBoard();
  renderHomeProfile();
}

function getCourseList() {
  return allCourses.map((c) => c.name);
}

function getCourse(name) {
  return allCourses.find((c) => c.name === name) || null;
}

function selectCourse(course) {
  if (currentCourse === course) return;
  currentCourse = course;
  renderCourseTabs(el.progressCourseTabs);
  renderCourseTabs(el.manageCourseTabs);
  renderProgressUnits();
  renderManageTasksList();
}

function renderCourseTabs(container) {
  if (!container) return;
  const courses = getCourseList();
  if (!currentCourse || !courses.includes(currentCourse)) currentCourse = courses[0] || null;
  container.innerHTML = "";
  courses.forEach((course) => {
    const btn = document.createElement("button");
    btn.className = "course-tab" + (course === currentCourse ? " active" : "");
    btn.textContent = course;
    btn.addEventListener("click", () => selectCourse(course));
    container.appendChild(btn);
  });
}

// ---------- 儀表板 ----------

function renderReviewBanner() {
  if (session.role !== "家長") {
    el.reviewBanner.classList.add("hidden");
    return;
  }
  const pending = getStudentTasks().filter((t) => t.reportStatus === "待審核").length;
  el.reviewBanner.classList.toggle("hidden", pending === 0);
  el.reviewBannerText.textContent = `${currentStudent} 有 ${pending} 筆任務回報待審核`;
}

el.reviewBannerBtn.addEventListener("click", () => setCurrentView("manage"));

function renderSummary() {
  const counts = countProgress(allCourses.flatMap(courseItems));
  el.statTotal.textContent = counts.total;
  el.statDone.textContent = counts.done;
  el.statProgress.textContent = counts.progress;
  el.statTodo.textContent = counts.todo;
  el.overallPercent.textContent = `${counts.percent}%`;
  el.overallProgressBar.style.width = `${counts.percent}%`;
}

function stackBarHtml(counts) {
  const pct = (n) => (counts.total ? (n / counts.total) * 100 : 0);
  return `
    <div class="stack-bar" title="上完課 ${counts.done}・學習中 ${counts.progress}・待學習 ${counts.todo}">
      <div class="stack-seg status-2" style="width:${pct(counts.done)}%"></div>
      <div class="stack-seg status-1" style="width:${pct(counts.progress)}%"></div>
    </div>
  `;
}

function renderCourseProgress() {
  el.courseProgressList.innerHTML = "";
  allCourses.forEach((course) => {
    const counts = countProgress(courseItems(course));
    const expanded = expandedDashboardCourses.has(course.id);

    const row = document.createElement("div");
    row.className = "course-row" + (expanded ? "" : " collapsed");

    const header = document.createElement("div");
    header.className = "course-row-header";
    header.innerHTML = `
      <span class="course-row-name">${escapeHtml(course.name)}</span>
      ${stackBarHtml(counts)}
      <span class="course-row-count">${counts.done}/${counts.total}</span>
      <button class="subject-toggle" aria-label="展開/收合">▾</button>
    `;
    header.addEventListener("click", () => {
      if (expandedDashboardCourses.has(course.id)) expandedDashboardCourses.delete(course.id);
      else expandedDashboardCourses.add(course.id);
      renderCourseProgress();
    });
    row.appendChild(header);

    if (expanded) {
      const body = document.createElement("div");
      body.className = "course-row-units";
      course.units.forEach((unit) => body.appendChild(buildProgressUnitCard(course, unit, false)));
      row.appendChild(body);
    }

    el.courseProgressList.appendChild(row);
  });
}

function shortDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  const weekday = WEEKDAY_LABELS[new Date(y, m - 1, d).getDay()];
  return `${m}/${d}（${weekday}）`;
}

function buildProgressEventItem(itemId, badgeCode, badgeLabel, dateText) {
  const entry = learningItemIndex.get(itemId);
  const node = document.createElement("div");
  node.className = "task-list-item";
  node.innerHTML = `
    <div class="task-list-item-text">
      <div class="task-list-item-course">${escapeHtml(`${entry.course.name}・${entry.unit.name}`)}</div>
      <div class="task-list-item-chapter">${escapeHtml(entry.item.name)}</div>
    </div>
    <div class="task-list-item-actions">
      <span class="status-badge status-${badgeCode}">${escapeHtml(badgeLabel)}</span>
      <span class="task-list-item-course">${escapeHtml(dateText)}</span>
    </div>
  `;
  return node;
}

function studentProgressRows() {
  return [...progressByKey.values()].filter(
    (p) => p.student === currentStudent && learningItemIndex.has(p.itemId)
  );
}

// 沒有歷史紀錄，所以動態是從目前的開始學習日期、上完課日期整理出來的
function renderRecent() {
  const now = new Date();
  const since = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  const sinceKey = dateKey(since.getFullYear(), since.getMonth(), since.getDate());

  const events = [];
  studentProgressRows().forEach((p) => {
    if (p.status === "上完課" && p.doneDate && p.doneDate >= sinceKey) {
      events.push({ itemId: p.itemId, code: "2", label: "上完課", date: p.doneDate, rank: 1 });
    }
    if (p.status !== "待學習" && p.startDate && p.startDate >= sinceKey && p.startDate !== p.doneDate) {
      events.push({ itemId: p.itemId, code: "1", label: "開始學習", date: p.startDate, rank: 0 });
    }
  });
  events.sort((a, b) => b.date.localeCompare(a.date) || b.rank - a.rank || b.itemId - a.itemId);

  el.recentCount.textContent = events.length ? `（${events.length}）` : "";
  el.noRecent.classList.toggle("hidden", events.length > 0);
  el.recentList.replaceChildren(
    ...events.map((e) => buildProgressEventItem(e.itemId, e.code, e.label, shortDate(e.date)))
  );
}

function renderLearning() {
  const rows = studentProgressRows()
    .filter((p) => p.status === "學習中")
    .sort((a, b) => (a.startDate || "").localeCompare(b.startDate || "") || a.itemId - b.itemId);

  el.learningCount.textContent = rows.length ? `（${rows.length}）` : "";
  el.noLearning.classList.toggle("hidden", rows.length > 0);
  el.learningList.replaceChildren(
    ...rows.map((p) =>
      buildProgressEventItem(p.itemId, "1", "學習中", p.startDate ? `${shortDate(p.startDate)} 開始` : "")
    )
  );
}

function renderOverviewGroup(tasks, listEl, countEl, noResultsEl) {
  countEl.textContent = tasks.length ? `（${tasks.length}）` : "";
  if (tasks.length === 0) {
    listEl.innerHTML = "";
    noResultsEl.classList.remove("hidden");
  } else {
    noResultsEl.classList.add("hidden");
    listEl.replaceChildren(...buildTaskListMobile(tasks).children);
  }
}

function renderOverview(tasks) {
  const now = new Date();
  const todayStr = todayKey();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const tomorrowStr = dateKey(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

  const overdue = tasks.filter((t) => t.date && t.date < todayStr && t.status !== "2");
  const today = tasks.filter((t) => t.date === todayStr);
  const tomorrowTasks = tasks.filter((t) => t.date === tomorrowStr);

  renderOverviewGroup(overdue, el.overdueList, el.overdueCount, el.noOverdue);
  renderOverviewGroup(today, el.todayList, el.todayCount, el.noToday);
  renderOverviewGroup(tomorrowTasks, el.tomorrowList, el.tomorrowCount, el.noTomorrow);
}

[
  [el.coursesHeader, el.coursesBlock],
  [el.recentHeader, el.recentBlock],
  [el.learningHeader, el.learningBlock],
  [el.overdueHeader, el.overdueBlock],
  [el.todayHeader, el.todayBlock],
  [el.tomorrowHeader, el.tomorrowBlock],
].forEach(([header, block]) => header.addEventListener("click", () => block.classList.toggle("collapsed")));

// ---------- 上課進度 ----------

function renderProgressUnits() {
  el.progressUnits.innerHTML = "";
  const course = getCourse(currentCourse);
  if (!course || course.units.length === 0) {
    el.noProgressUnits.classList.remove("hidden");
    return;
  }
  el.noProgressUnits.classList.add("hidden");

  course.units.forEach((unit) => el.progressUnits.appendChild(buildProgressUnitCard(course, unit, true)));

  // 課程底下、但「單元名稱」對不到任何單元的任務，另外列出來以免看不到
  const unitNames = new Set(course.units.map((u) => u.name));
  const orphanTasks = getStudentTasks().filter((t) => t.course === course.name && !unitNames.has(t.unit));
  if (orphanTasks.length) el.progressUnits.appendChild(buildOrphanTaskCard(orphanTasks));
}

function buildOrphanTaskCard(tasks) {
  const card = document.createElement("section");
  card.className = "subject-card";
  card.innerHTML = `
    <div class="subject-header">
      <div class="subject-title-group">
        <h4 class="subject-title">其他任務</h4>
        <span class="subject-percent">單元名稱對不到課程單元表</span>
      </div>
    </div>
  `;
  card.appendChild(buildTaskListMobile(tasks));
  return card;
}

function buildProgressUnitCard(course, unit, showTasks) {
  const counts = countProgress(unit.items);
  const tasks = showTasks
    ? getStudentTasks().filter((t) => t.course === course.name && t.unit === unit.name)
    : [];

  const card = document.createElement("section");
  card.className = "subject-card" + (expandedProgressUnits.has(unit.id) ? "" : " collapsed");

  const header = document.createElement("div");
  header.className = "subject-header";
  header.innerHTML = `
    <div class="subject-title-group">
      <h4 class="subject-title">${escapeHtml(unit.name)}</h4>
      <div class="subject-mini-progress">
        <div class="subject-mini-progress-fill" style="width:${counts.percent}%"></div>
      </div>
      <span class="subject-percent">上完課 ${counts.done}/${counts.total}${tasks.length ? `・任務 ${tasks.length}` : ""}</span>
    </div>
    <button class="subject-toggle" aria-label="展開/收合">▾</button>
  `;
  header.addEventListener("click", () => {
    if (expandedProgressUnits.has(unit.id)) expandedProgressUnits.delete(unit.id);
    else expandedProgressUnits.add(unit.id);
    card.classList.toggle("collapsed");
  });
  card.appendChild(header);

  const body = document.createElement("div");
  body.className = "subject-body";

  if (unit.items.length === 0) {
    body.innerHTML = `<p class="progress-empty">這個單元沒有學習項目。</p>`;
  } else {
    const list = document.createElement("div");
    list.className = "progress-item-list";
    unit.items.forEach((item) => list.appendChild(buildProgressItemRow(item)));
    body.appendChild(list);
  }

  if (tasks.length) {
    const title = document.createElement("div");
    title.className = "progress-tasks-title";
    title.textContent = "家長交代的任務";
    body.appendChild(title);
    body.appendChild(buildTaskListSimple(tasks));
  }

  card.appendChild(body);
  return card;
}

function buildProgressItemRow(item) {
  const p = getItemProgress(item.id);
  const code = PROGRESS_STATUS_CODE[p.status];
  const saving = savingItems.has(progressKey(currentStudent, item.id));
  const meta = [];
  if (p.status === "上完課" && p.startDate && p.startDate !== p.doneDate) meta.push(`${p.startDate} 開始`);
  if (saving) meta.push("儲存中...");

  const row = document.createElement("div");
  row.className = `progress-item status-${code}` + (saving ? " saving" : "");
  row.innerHTML = `
    <div class="progress-item-text">
      <div class="progress-item-name">${escapeHtml(item.name)}</div>
      ${meta.length ? `<div class="progress-item-meta">${escapeHtml(meta.join("・"))}</div>` : ""}
    </div>
  `;
  row.appendChild(buildProgressControls(item, p, saving));
  return row;
}

// 狀態按鈕＋日期欄，手風琴的項目列和看板卡片共用
function buildProgressControls(item, p, saving) {
  const dateValue = p.status === "上完課" ? p.doneDate : p.status === "學習中" ? p.startDate : "";
  const dateLabel = p.status === "上完課" ? "上完課" : "開始";

  const controls = document.createElement("div");
  controls.className = "progress-item-controls";
  controls.innerHTML = `
    <div class="seg" role="group" aria-label="上課狀態">
      ${PROGRESS_STATUSES.map(
        (s) =>
          `<button class="seg-btn status-${PROGRESS_STATUS_CODE[s]}${s === p.status ? " active" : ""}" data-status="${s}"${saving ? " disabled" : ""}>${s}</button>`
      ).join("")}
    </div>
    ${
      p.status === "待學習"
        ? ""
        : `<label class="progress-date"><span>${dateLabel}</span><input type="date" max="${todayKey()}" value="${escapeHtml(dateValue || "")}"${saving ? " disabled" : ""}></label>`
    }
  `;

  controls.querySelectorAll(".seg-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const status = btn.dataset.status;
      if (status === p.status) return;
      // 從上完課退回學習中時保留原本的開始日期，其他情況預設今天
      const date = status === "待學習" ? "" : status === "學習中" && p.startDate ? p.startDate : todayKey();
      saveProgress(item.id, status, date);
    });
  });

  const dateInput = controls.querySelector('input[type="date"]');
  if (dateInput) {
    dateInput.addEventListener("change", () => {
      const value = dateInput.value;
      if (!value || value > todayKey()) {
        dateInput.value = dateValue || "";
        showToast(value ? "不能填未來的日期" : "請選擇日期", "error");
        return;
      }
      if (value === dateValue) return;
      saveProgress(item.id, p.status, value);
    });
  }

  return controls;
}

// ---------- 上課進度：手風琴／看板切換 ----------

function loadProgressPrefs() {
  const defaults = { view: "accordion", courses: [], statuses: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_PREFS_KEY) || "null");
    if (!saved) return defaults;
    return {
      view: saved.view === "board" ? "board" : "accordion",
      courses: Array.isArray(saved.courses) ? saved.courses : [],
      statuses: Array.isArray(saved.statuses) ? saved.statuses.filter((s) => PROGRESS_STATUSES.includes(s)) : [],
    };
  } catch {
    return defaults;
  }
}

function saveProgressPrefs() {
  try {
    localStorage.setItem(PROGRESS_PREFS_KEY, JSON.stringify(progressPrefs));
  } catch {
    // 無痕模式等情況存不了，就只在這次使用期間有效
  }
}

function applyProgressMode() {
  const board = progressPrefs.view === "board";
  [...el.progressModeToggle.children].forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.mode === progressPrefs.view)
  );
  el.progressAccordion.classList.toggle("hidden", board);
  el.progressBoard.classList.toggle("hidden", !board);
  updateWideLayout();
  updatePageHeader();
}

el.progressModeToggle.addEventListener("click", (e) => {
  const btn = e.target.closest(".mode-toggle-btn");
  if (!btn || btn.dataset.mode === progressPrefs.view) return;
  progressPrefs.view = btn.dataset.mode;
  saveProgressPrefs();
  applyProgressMode();
});

// 篩選值是陣列，空陣列代表「全部」；全部選滿時也收回成空陣列
function toggleFilterValue(key, value, allValues) {
  const current = progressPrefs[key];
  let next;
  if (value === null) {
    next = [];
  } else if (current.includes(value)) {
    next = current.filter((v) => v !== value);
  } else {
    next = [...current, value];
  }
  if (next.length === allValues.length) next = [];
  progressPrefs[key] = next;
  saveProgressPrefs();
  renderProgressBoard();
  updatePageHeader();
}

function renderFilterChips(container, key, allValues) {
  const selected = progressPrefs[key].filter((v) => allValues.includes(v));
  container.innerHTML = "";
  const chips = [{ label: "全部", value: null, active: selected.length === 0 }].concat(
    allValues.map((v) => ({ label: v, value: v, active: selected.includes(v) }))
  );
  chips.forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "filter-chip" + (c.active ? " active" : "");
    btn.textContent = c.label;
    btn.addEventListener("click", () => toggleFilterValue(key, c.value, allValues));
    container.appendChild(btn);
  });
  return selected;
}

function shortMonthDay(key) {
  const [, m, d] = key.split("-").map(Number);
  return `${m}/${d}`;
}

// 每一欄一次只展開一個單元；第一次畫看板時自動展開第一個還沒全部上完的單元
function initBoardOpenUnits() {
  boardOpenUnits = new Map();
  allCourses.forEach((course) => {
    const current = course.units.find((u) => u.items.some((i) => getItemProgress(i.id).status !== "上完課"));
    if (current) boardOpenUnits.set(course.id, current.id);
  });
}

function toggleBoardUnit(courseId, unitId) {
  if (boardOpenUnits.get(courseId) === unitId) boardOpenUnits.delete(courseId);
  else boardOpenUnits.set(courseId, unitId);
  renderProgressBoard();
}

function renderProgressBoard() {
  if (!allCourses.length) return;
  if (!boardOpenUnits) initBoardOpenUnits();
  closeStatusMenu();

  const courseNames = getCourseList();
  const selectedCourses = renderFilterChips(el.boardCourseFilter, "courses", courseNames);
  const selectedStatuses = renderFilterChips(el.boardStatusFilter, "statuses", PROGRESS_STATUSES);

  const courses = selectedCourses.length ? allCourses.filter((c) => selectedCourses.includes(c.name)) : allCourses;
  const statusVisible = (status) => selectedStatuses.length === 0 || selectedStatuses.includes(status);

  // 重畫會把橫向捲動歸零，先記下來再還原
  const scrollLeft = el.boardColumns.scrollLeft;

  el.boardColumns.innerHTML = "";
  let shownCards = 0;
  const bars = [];

  courses.forEach((course) => {
    const counts = countProgress(courseItems(course));
    const prevPercent = boardBarPercent.has(course.id) ? boardBarPercent.get(course.id) : counts.percent;

    const column = document.createElement("section");
    column.className = "board-column";
    column.dataset.courseId = course.id;
    column.innerHTML = `
      <div class="board-column-header">
        <div class="board-column-heading">
          <span class="board-column-title">${escapeHtml(course.name)}</span>
          <span class="board-column-count">上完課 ${counts.done}/${counts.total}</span>
        </div>
        <div class="board-bar"><div class="board-bar-fill" style="width:${prevPercent}%"></div></div>
      </div>
    `;
    bars.push([column.querySelector(".board-bar-fill"), counts.percent]);
    boardBarPercent.set(course.id, counts.percent);

    const body = document.createElement("div");
    body.className = "board-column-body";

    course.units.forEach((unit) => {
      const items = unit.items.filter((item) => statusVisible(getItemProgress(item.id).status));
      if (items.length === 0) return;
      shownCards += items.length;
      body.appendChild(buildBoardUnit(course, unit, items, selectedStatuses));
    });

    if (!body.children.length) {
      body.innerHTML = `<p class="board-empty">沒有符合的項目</p>`;
    }
    column.appendChild(body);
    el.boardColumns.appendChild(column);
  });

  el.boardColumns.scrollLeft = scrollLeft;
  el.noBoardResults.classList.toggle("hidden", shownCards > 0);
  updateBoardNav();

  // 先用舊的寬度畫出來，下一個畫格再改成新寬度，進度條才會有動畫
  requestAnimationFrame(() => bars.forEach(([fill, percent]) => (fill.style.width = `${percent}%`)));
}

// ---------- 看板：左右移動按鈕 ----------

function updateBoardNav() {
  const cols = el.boardColumns;
  const maxScroll = cols.scrollWidth - cols.clientWidth;
  el.boardPrev.classList.toggle("hidden", maxScroll <= 2 || cols.scrollLeft <= 2);
  el.boardNext.classList.toggle("hidden", maxScroll <= 2 || cols.scrollLeft >= maxScroll - 2);
}

// 一次移動一欄（欄寬＋間距）
function scrollBoardBy(direction) {
  const column = el.boardColumns.querySelector(".board-column");
  if (!column) return;
  const gap = parseFloat(getComputedStyle(el.boardColumns).columnGap) || 0;
  el.boardColumns.scrollBy({ left: direction * (column.offsetWidth + gap), behavior: "smooth" });
}

el.boardPrev.addEventListener("click", () => scrollBoardBy(-1));
el.boardNext.addEventListener("click", () => scrollBoardBy(1));
el.boardColumns.addEventListener("scroll", updateBoardNav, { passive: true });
// 看板從隱藏變成顯示、或視窗大小改變時，重新判斷按鈕要不要出現
new ResizeObserver(updateBoardNav).observe(el.boardColumns);

function buildBoardUnit(course, unit, items, selectedStatuses) {
  const open = boardOpenUnits.get(course.id) === unit.id;

  let countText;
  if (selectedStatuses.length) {
    countText = selectedStatuses
      .map((s) => [s, items.filter((i) => getItemProgress(i.id).status === s).length])
      .filter(([, n]) => n > 0)
      .map(([s, n]) => `${s} ${n}`)
      .join("・");
  } else {
    const counts = countProgress(unit.items);
    countText = `${counts.done}/${counts.total}`;
  }

  const section = document.createElement("div");
  section.className = "board-unit" + (open ? " open" : "");

  const header = document.createElement("button");
  header.className = "board-unit-title";
  header.setAttribute("aria-expanded", open);
  header.innerHTML = `
    <span class="board-unit-arrow">▸</span>
    <span class="board-unit-name">${escapeHtml(unit.name)}</span>
    <span class="board-unit-count">${escapeHtml(countText)}</span>
  `;
  header.addEventListener("click", () => toggleBoardUnit(course.id, unit.id));
  section.appendChild(header);

  if (open) {
    const list = document.createElement("div");
    list.className = "board-unit-cards";
    items.forEach((item) => list.appendChild(buildBoardCard(item)));
    section.appendChild(list);
  }
  return section;
}

function buildBoardCard(item) {
  const p = getItemProgress(item.id);
  const code = PROGRESS_STATUS_CODE[p.status];
  const saving = savingItems.has(progressKey(currentStudent, item.id));
  const dateValue = p.status === "上完課" ? p.doneDate : p.status === "學習中" ? p.startDate : "";
  const dateText = !dateValue ? "" : p.status === "學習中" ? `${shortMonthDay(dateValue)} 開始` : shortMonthDay(dateValue);

  const card = document.createElement("div");
  card.className = `board-card status-${code}` + (saving ? " saving" : "");
  card.innerHTML = `
    <div class="board-card-name">${escapeHtml(item.name)}</div>
    <div class="board-card-foot">
      <button class="status-pill status-${code}" aria-haspopup="menu">${escapeHtml(p.status)} ▾</button>
      ${saving ? `<span class="spinner-sm" aria-label="儲存中"></span>` : ""}
      ${
        !saving && p.status !== "待學習"
          ? `<span class="card-date">
              <button class="card-date-btn" title="修改日期">${escapeHtml(dateText || "選擇日期")} ✏️</button>
              <input type="date" class="card-date-input" max="${todayKey()}" value="${escapeHtml(dateValue || "")}" tabindex="-1" aria-label="日期">
            </span>`
          : ""
      }
    </div>
  `;

  const pill = card.querySelector(".status-pill");
  pill.addEventListener("click", (e) => {
    e.stopPropagation();
    openStatusMenu(pill, item, p);
  });

  const dateBtn = card.querySelector(".card-date-btn");
  if (dateBtn) {
    const input = card.querySelector(".card-date-input");
    dateBtn.addEventListener("click", () => {
      try {
        input.showPicker();
      } catch {
        // 不支援 showPicker 的瀏覽器，直接把日期欄顯示出來
        input.classList.add("visible");
        input.focus();
      }
    });
    input.addEventListener("change", () => {
      const value = input.value;
      if (!value || value > todayKey()) {
        input.value = dateValue || "";
        showToast(value ? "不能填未來的日期" : "請選擇日期", "error");
        return;
      }
      if (value === dateValue) return;
      saveProgress(item.id, p.status, value);
    });
  }

  return card;
}

// ---------- 看板：狀態選單 ----------

const statusMenu = document.createElement("div");
statusMenu.className = "status-menu hidden";
statusMenu.setAttribute("role", "menu");
document.body.appendChild(statusMenu);

function openStatusMenu(anchor, item, p) {
  if (!statusMenu.classList.contains("hidden") && statusMenu.dataset.itemId === String(item.id)) {
    closeStatusMenu();
    return;
  }
  statusMenu.dataset.itemId = item.id;
  statusMenu.innerHTML = "";
  PROGRESS_STATUSES.forEach((s) => {
    const btn = document.createElement("button");
    btn.className = `status-menu-item status-${PROGRESS_STATUS_CODE[s]}` + (s === p.status ? " current" : "");
    btn.setAttribute("role", "menuitem");
    btn.textContent = s;
    btn.addEventListener("click", () => {
      closeStatusMenu();
      if (s === p.status) return;
      // 從上完課退回學習中時保留原本的開始日期，其他情況預設今天
      const date = s === "待學習" ? "" : s === "學習中" && p.startDate ? p.startDate : todayKey();
      saveProgress(item.id, s, date);
    });
    statusMenu.appendChild(btn);
  });

  statusMenu.classList.remove("hidden");
  const rect = anchor.getBoundingClientRect();
  const menuHeight = statusMenu.offsetHeight;
  const below = rect.bottom + 4 + menuHeight <= window.innerHeight;
  statusMenu.style.top = `${below ? rect.bottom + 4 : rect.top - 4 - menuHeight}px`;
  statusMenu.style.left = `${Math.min(rect.left, window.innerWidth - statusMenu.offsetWidth - 8)}px`;
}

function closeStatusMenu() {
  statusMenu.classList.add("hidden");
  statusMenu.dataset.itemId = "";
}

document.addEventListener("click", (e) => {
  if (!statusMenu.contains(e.target)) closeStatusMenu();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeStatusMenu();
});
document.addEventListener(
  "scroll",
  (e) => {
    if (!statusMenu.contains(e.target)) closeStatusMenu();
  },
  true
);
window.addEventListener("resize", closeStatusMenu);

// ---------- 任務卡片 ----------

function reportActionHtml(t) {
  if (session.role !== "學生") {
    return t.reportStatus ? reviewStatusBadge(t.reportStatus) : "";
  }
  if (t.status === "2") return "";
  if (t.reportStatus === "待審核") {
    return `<span class="status-badge status-pending">回報審核中</span>`;
  }
  const label = t.reportStatus === "已拒絕" ? "已退回，重新回報" : "回報完成";
  return `<button class="report-btn" data-id="${t.id}">${escapeHtml(label)}</button>`;
}

function buildTaskListItem(t, showCourse) {
  const item = document.createElement("div");
  item.className = "task-list-item";
  item.innerHTML = `
    <div class="task-list-item-text">
      ${showCourse ? `<div class="task-list-item-course">${escapeHtml(`${t.course}・${t.unit}`)}</div>` : ""}
      <div class="task-list-item-chapter">${escapeHtml(t.task)}</div>
      ${t.date ? `<div class="task-list-item-type">${escapeHtml(t.date)}</div>` : ""}
    </div>
    <div class="task-list-item-actions">
      ${timeSlotBadge(t.timeSlot)}
      ${statusBadge(t.status)}
      ${reportActionHtml(t)}
    </div>
  `;
  const reportBtn = item.querySelector(".report-btn");
  if (reportBtn) {
    reportBtn.addEventListener("click", () => {
      reportBtn.disabled = true;
      reportBtn.textContent = "處理中...";
      Api.reportTask(session.name, t.id)
        .then((res) => {
          if (!res.ok) {
            showToast(res.error || "回報失敗", "error");
          } else {
            showToast("已回報完成，等待家長審核", "success");
          }
          loadData(true);
        })
        .catch((err) => showToast(`回報失敗（${err.message}）`, "error"));
    });
  }
  return item;
}

function buildTaskListMobile(tasks) {
  const list = document.createElement("div");
  list.className = "task-list-mobile";
  for (const t of tasks) list.appendChild(buildTaskListItem(t, true));
  return list;
}

function buildTaskListSimple(tasks) {
  const list = document.createElement("div");
  list.className = "task-list-mobile";
  for (const t of tasks) list.appendChild(buildTaskListItem(t, false));
  return list;
}

function statusBadge(status) {
  const label = STATUS_LABELS[status] || status;
  return `<span class="status-badge status-${status}">${label}</span>`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

// ---------- Shared helpers ----------

function pad2(n) {
  return String(n).padStart(2, "0");
}

function dateKey(y, m, d) {
  return `${y}-${pad2(m + 1)}-${pad2(d)}`;
}

function formatTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleString("zh-TW", { hour12: false });
}

function reviewStatusBadge(reviewStatus) {
  const cls = reviewStatus === "已核准" ? "status-2" : reviewStatus === "已拒絕" ? "status-rejected" : "status-pending";
  return `<span class="status-badge ${cls}">${escapeHtml(reviewStatus)}</span>`;
}

function timeSlotBadge(slot) {
  return `<span class="status-badge status-slot">${escapeHtml(slot || "整天")}</span>`;
}

// ---------- 任務管理（家長）：課程/單元/任務樹 ----------

function unitKey(course, unit) {
  return `${course}||${unit}`;
}

function renderManageTasksList() {
  if (session.role !== "家長") return;
  el.manageTasksTree.innerHTML = "";
  if (!currentCourse) return;
  const course = getCourse(currentCourse);
  if (!course) return;
  const studentTasks = allTasks.filter((t) => t.student === currentStudent);
  course.units.forEach((u) => {
    const unitTasks = studentTasks.filter((t) => t.course === course.name && t.unit === u.name);
    el.manageTasksTree.appendChild(buildManageUnitCard(course.name, u, unitTasks));
  });
}

function buildManageUnitCard(course, u, tasks) {
  const key = unitKey(course, u.name);
  const card = document.createElement("section");
  card.className = "subject-card" + (expandedUnits.has(key) ? "" : " collapsed");

  const label = u.name;
  const header = document.createElement("div");
  header.className = "subject-header";
  header.innerHTML = `
    <div class="subject-title-group">
      <h4 class="subject-title">${escapeHtml(label)}</h4>
      <span class="subject-percent">${tasks.length} 個任務</span>
    </div>
    <button class="subject-toggle" aria-label="展開/收合">▾</button>
  `;
  header.addEventListener("click", () => {
    if (expandedUnits.has(key)) {
      expandedUnits.delete(key);
    } else {
      expandedUnits.add(key);
    }
    card.classList.toggle("collapsed");
  });
  card.appendChild(header);

  const body = document.createElement("div");
  body.className = "task-list-mobile";
  tasks.forEach((t) => body.appendChild(buildManageTaskRow(t)));
  card.appendChild(body);

  card.appendChild(buildAddTaskControl(course, u.name, key));

  return card;
}

function buildManageTaskRow(t) {
  const row = document.createElement("div");
  row.className = "task-list-item";

  if (editingTaskId === t.id) {
    row.innerHTML = `
      <div class="request-form">
        <input type="text" class="student-select edit-task-name" value="${escapeHtml(t.task)}">
        <input type="date" class="student-select edit-task-date" value="${escapeHtml(t.date || "")}">
        <select class="student-select edit-task-slot">
          <option value="整天">整天</option>
          <option value="上午">上午</option>
          <option value="下午">下午</option>
          <option value="晚上">晚上</option>
        </select>
      </div>
      <div class="request-item-actions">
        <button class="primary-btn" data-action="save">儲存</button>
        <button class="secondary-btn" data-action="cancel">取消</button>
      </div>
    `;
    const saveBtn = row.querySelector('[data-action="save"]');
    row.querySelector(".edit-task-slot").value = t.timeSlot || "整天";
    row.querySelector('[data-action="cancel"]').addEventListener("click", () => {
      editingTaskId = null;
      renderManageTasksList();
    });
    saveBtn.addEventListener("click", () => {
      const task = row.querySelector(".edit-task-name").value.trim();
      if (!task) return;
      saveBtn.disabled = true;
      saveBtn.textContent = "儲存中...";
      Api.updateTask({
        id: t.id,
        editor: session.name,
        student: t.student,
        course: t.course,
        unit: t.unit,
        task,
        date: row.querySelector(".edit-task-date").value,
        timeSlot: row.querySelector(".edit-task-slot").value,
      })
        .then((res) => {
          if (!res.ok) {
            showToast(res.error || "更新失敗", "error");
            saveBtn.disabled = false;
            saveBtn.textContent = "儲存";
            return;
          }
          editingTaskId = null;
          showToast("已更新任務", "success");
          loadData(true);
        })
        .catch((err) => {
          showToast(`更新失敗（${err.message}）`, "error");
          saveBtn.disabled = false;
          saveBtn.textContent = "儲存";
        });
    });
    return row;
  }

  row.innerHTML = `
    <div class="task-list-item-text">
      <div class="task-list-item-type">${escapeHtml(t.task)}</div>
      <div class="task-list-item-course">${t.date ? escapeHtml(t.date) : "未排定日期"}</div>
    </div>
    <div class="task-list-item-actions">
      <div class="task-row-badges">
        ${timeSlotBadge(t.timeSlot)}
        ${statusBadge(t.status)}
        ${t.reportStatus ? reviewStatusBadge(t.reportStatus) : ""}
      </div>
      <div class="request-item-actions">
        ${t.reportStatus === "待審核" ? '<button class="approve-btn" data-action="approve">核准</button><button class="reject-btn" data-action="reject">拒絕</button>' : ""}
      </div>
    </div>
  `;

  ["approve", "reject"].forEach((action) => {
    const btn = row.querySelector(`[data-action="${action}"]`);
    if (!btn) return;
    btn.addEventListener("click", () => {
      row.querySelectorAll("button").forEach((b) => (b.disabled = true));
      btn.textContent = "處理中...";
      Api.reviewTask(t.id, action === "approve" ? "核准" : "拒絕", session.name)
        .then((res) => {
          if (!res.ok) {
            showToast(res.error || "審核失敗", "error");
          } else {
            showToast(action === "approve" ? "已核准這筆任務" : "已拒絕這筆回報", "success");
          }
          loadData(true);
        })
        .catch((err) => showToast(`審核失敗（${err.message}）`, "error"));
    });
  });

  const actionsWrap = row.querySelector(".request-item-actions");
  actionsWrap.appendChild(
    buildKebab([
      {
        label: "編輯",
        onClick: () => {
          editingTaskId = t.id;
          renderManageTasksList();
        },
      },
      {
        label: "刪除",
        danger: true,
        onClick: () => {
          if (!confirm(`確定要刪除「${t.task}」這筆任務嗎？`)) return;
          Api.deleteTask({ id: t.id, editor: session.name })
            .then((res) => {
              if (!res.ok) {
                showToast(res.error || "刪除失敗", "error");
                return;
              }
              showToast("已刪除任務", "success");
              loadData(true);
            })
            .catch((err) => showToast(`刪除失敗（${err.message}）`, "error"));
        },
      },
    ])
  );

  return row;
}

function buildAddTaskControl(course, unit, key) {
  const wrap = document.createElement("div");

  if (addingTaskUnit !== key) {
    const link = document.createElement("button");
    link.className = "inline-add-link";
    link.textContent = "+ 新增此單元任務";
    link.addEventListener("click", () => {
      addingTaskUnit = key;
      expandedUnits.add(key);
      renderManageTasksList();
    });
    wrap.appendChild(link);
    return wrap;
  }

  wrap.className = "request-form";
  wrap.innerHTML = `
    <input type="text" class="student-select add-task-name" placeholder="任務名稱（如：練習本、練習卷）">
    <input type="date" class="student-select add-task-date">
    <select class="student-select add-task-slot">
      <option value="整天">整天</option>
      <option value="上午">上午</option>
      <option value="下午">下午</option>
      <option value="晚上">晚上</option>
    </select>
    <button class="primary-btn" data-action="save">新增</button>
    <button class="secondary-btn" data-action="cancel">取消</button>
  `;
  const saveBtn = wrap.querySelector('[data-action="save"]');
  wrap.querySelector('[data-action="cancel"]').addEventListener("click", () => {
    addingTaskUnit = null;
    renderManageTasksList();
  });
  saveBtn.addEventListener("click", () => {
    const task = wrap.querySelector(".add-task-name").value.trim();
    if (!task) return;
    saveBtn.disabled = true;
    saveBtn.textContent = "新增中...";
    Api.createTask({
      creator: session.name,
      student: currentStudent,
      course,
      unit,
      task,
      date: wrap.querySelector(".add-task-date").value,
      timeSlot: wrap.querySelector(".add-task-slot").value,
    })
      .then((res) => {
        if (!res.ok) {
          showToast(res.error || "新增失敗", "error");
          saveBtn.disabled = false;
          saveBtn.textContent = "新增";
          return;
        }
        addingTaskUnit = null;
        showToast(`已新增：${task}`, "success");
        loadData(true);
      })
      .catch((err) => {
        showToast(`新增失敗（${err.message}）`, "error");
        saveBtn.disabled = false;
        saveBtn.textContent = "新增";
      });
  });

  return wrap;
}

// ---------- 「⋮」選單 ----------

function closeAllKebabMenus() {
  document.querySelectorAll(".kebab-menu.open").forEach((m) => m.classList.remove("open"));
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".kebab-trigger")) return;
  closeAllKebabMenus();
});

function buildKebab(actions) {
  const wrap = document.createElement("div");
  wrap.className = "kebab";

  const trigger = document.createElement("button");
  trigger.className = "kebab-trigger";
  trigger.textContent = "⋮";
  trigger.setAttribute("aria-label", "更多選項");

  const menu = document.createElement("div");
  menu.className = "kebab-menu";
  actions.forEach((a) => {
    const item = document.createElement("button");
    item.className = "kebab-item" + (a.danger ? " danger" : "");
    item.textContent = a.label;
    item.addEventListener("click", () => {
      closeAllKebabMenus();
      a.onClick();
    });
    menu.appendChild(item);
  });

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const wasOpen = menu.classList.contains("open");
    closeAllKebabMenus();
    if (!wasOpen) menu.classList.add("open");
  });

  wrap.appendChild(trigger);
  wrap.appendChild(menu);
  return wrap;
}

// ---------- Toast ----------

function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type || "success"}`;
  toast.textContent = message;
  el.toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ---------- 批次新增任務彈窗 ----------

function populateModalOptions() {
  el.modalStudentSelect.innerHTML = allStudents
    .map((s) => `<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)}</option>`)
    .join("");
  const courses = getCourseList();
  el.modalCourseSelect.innerHTML = courses
    .map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)
    .join("");
}

function populateModalUnitSelect(course) {
  const units = getCourse(course) ? getCourse(course).units : [];
  el.modalUnitSelect.innerHTML = units
    .map((u) => `<option value="${escapeHtml(u.name)}">${escapeHtml(u.name)}</option>`)
    .join("");
}

function openTaskModal() {
  populateModalOptions();
  el.modalStudentSelect.value = currentStudent || "";
  if (currentCourse) el.modalCourseSelect.value = currentCourse;
  populateModalUnitSelect(el.modalCourseSelect.value);
  el.modalTaskName.value = "";
  el.modalTaskDate.value = "";
  el.modalTaskSlot.value = "整天";
  el.modalMessage.classList.add("hidden");
  el.taskModalOverlay.classList.remove("hidden");
  el.modalTaskName.focus();
}

function closeTaskModal() {
  el.taskModalOverlay.classList.add("hidden");
}

el.taskFab.addEventListener("click", openTaskModal);
el.modalCloseBtn.addEventListener("click", closeTaskModal);
el.modalDoneBtn.addEventListener("click", closeTaskModal);
el.taskModalOverlay.addEventListener("click", (e) => {
  if (e.target === el.taskModalOverlay) closeTaskModal();
});
el.modalCourseSelect.addEventListener("change", () => populateModalUnitSelect(el.modalCourseSelect.value));

el.modalAddBtn.addEventListener("click", () => {
  const payload = {
    creator: session.name,
    student: el.modalStudentSelect.value,
    course: el.modalCourseSelect.value,
    unit: el.modalUnitSelect.value,
    task: el.modalTaskName.value.trim(),
    date: el.modalTaskDate.value,
    timeSlot: el.modalTaskSlot.value,
  };
  if (!payload.student || !payload.course || !payload.unit || !payload.task) {
    el.modalMessage.textContent = "請完整填寫學生、課程、單元與任務名稱。";
    el.modalMessage.classList.remove("hidden");
    return;
  }
  el.modalAddBtn.disabled = true;
  el.modalAddBtn.textContent = "新增中...";
  Api.createTask(payload)
    .then((res) => {
      el.modalAddBtn.disabled = false;
      el.modalAddBtn.textContent = "新增";
      if (!res.ok) {
        el.modalMessage.textContent = res.error || "新增失敗";
        el.modalMessage.classList.remove("hidden");
        return;
      }
      el.modalMessage.classList.add("hidden");
      showToast(`已新增：${payload.task}`, "success");
      el.modalTaskName.value = "";
      el.modalTaskName.focus();
      loadData(true);
    })
    .catch((err) => {
      el.modalAddBtn.disabled = false;
      el.modalAddBtn.textContent = "新增";
      el.modalMessage.textContent = `新增失敗（${err.message}）`;
      el.modalMessage.classList.remove("hidden");
    });
});

el.refreshBtn.addEventListener("click", () => {
  el.refreshBtn.classList.add("spinning");
  loadData();
  setTimeout(() => el.refreshBtn.classList.remove("spinning"), 800);
});

el.retryBtn.addEventListener("click", () => loadData());

// ---------- 圖示（內嵌線條圖示，data-icon 屬性在載入時填入） ----------

const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h5v-6h4v6h5V9.5"/>',
  progress: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="m3.5 6 1.5 1.5L7.5 5M3.5 12l1.5 1.5 2.5-2.5M3.5 18l1.5 1.5 2.5-2.5"/>',
  tasks: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
  userCircle: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18.5c1.2-2 3.2-3 5.5-3s4.3 1 5.5 3"/>',
  sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v5h-5"/>',
  chart: '<path d="M4 4v16h16"/><path d="M8 16v-5M12 16V8M16 16v-3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  book: '<path d="M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3z"/><path d="M21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z"/>',
  alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  logout: '<path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"/>',
  accordion: '<rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="16" width="18" height="4" rx="1"/>',
  board: '<rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="5" height="11" rx="1"/><rect x="17" y="4" width="4" height="14" rx="1"/>',
};

function iconSvg(name) {
  return `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

function fillIcons(root) {
  (root || document).querySelectorAll("[data-icon]").forEach((node) => {
    node.classList.add("icon");
    node.innerHTML = iconSvg(node.dataset.icon);
  });
}

// ---------- 手機版頁首 ----------

const PAGE_TITLES = {
  overview: "學習計畫",
  progress: "上課進度",
  manage: "任務管理",
  me: "我的",
};

function progressScopeText() {
  if (progressPrefs.view !== "board") return "手風琴";
  const parts = ["看板"];
  const courses = progressPrefs.courses.filter((c) => getCourseList().includes(c));
  if (courses.length === 0) parts.push("全部科目");
  else if (courses.length <= 2) parts.push(courses.join("、"));
  else parts.push(`${courses.length} 個科目`);
  if (progressPrefs.statuses.length) parts.push(progressPrefs.statuses.join("、"));
  return parts.join("・");
}

function updatePageHeader() {
  if (!session) return;
  el.pageTitle.textContent = PAGE_TITLES[currentView];
  const who = session.role === "家長" ? `檢視 ${currentStudent || "—"}` : session.name;
  const extra = currentView === "progress" ? progressScopeText() : session.role;
  el.pageSubtitleText.textContent = `${who}・${extra}`;
  el.filterBtn.classList.toggle("hidden", currentView !== "progress");
}

// ---------- 首頁個人資料卡 ----------

function renderHomeProfile() {
  const name = currentStudent || session.name;
  const counts = countProgress(allCourses.flatMap(courseItems));
  el.homeAvatar.textContent = name.slice(0, 1).toUpperCase();
  el.homeName.textContent = name;
  el.homeSub.textContent = `${session.role === "家長" ? "家長檢視中" : "學生"}・上完課 ${counts.done}/${counts.total}`;
}

el.homeGoProgress.addEventListener("click", () => setCurrentView("progress"));
el.homeGoLearning.addEventListener("click", () => {
  el.learningBlock.classList.remove("collapsed");
  el.learningBlock.scrollIntoView({ behavior: "smooth", block: "start" });
});

// ---------- 我的 ----------

function renderMe() {
  el.meAvatar.textContent = session.name.slice(0, 1).toUpperCase();
  el.meName.textContent = session.name;
  el.meRole.textContent = session.role;
  el.meVersion.textContent = APP_VERSION;
  el.meUpdated.textContent = el.statusBarUpdated.textContent.replace("最後更新：", "");

  const isParent = session.role === "家長";
  el.meStudents.classList.toggle("hidden", !isParent);
  if (!isParent) return;
  el.meStudentList.innerHTML = "";
  allStudents.forEach((s) => {
    const counts = countProgressFor(s.name);
    const card = document.createElement("button");
    card.className = "option-card" + (s.name === currentStudent ? " selected" : "");
    card.innerHTML = `
      <span class="option-card-icon">${escapeHtml(s.name.slice(0, 1).toUpperCase())}</span>
      <span class="option-card-text">
        <span class="option-card-title">${escapeHtml(s.name)}</span>
        <span class="option-card-sub">上完課 ${counts.done}/${counts.total}</span>
      </span>
    `;
    card.addEventListener("click", () => {
      if (s.name === currentStudent) return;
      selectStudent(s.name);
      showToast(`已切換為檢視 ${s.name}`, "success");
    });
    el.meStudentList.appendChild(card);
  });
}

function countProgressFor(student) {
  const items = allCourses.flatMap(courseItems);
  const done = items.filter((i) => getItemProgress(i.id, student).status === "上完課").length;
  return { done, total: items.length };
}

el.meLogoutBtn.addEventListener("click", () => el.logoutBtn.click());

// ---------- 底部導覽列 ----------

el.bottomNav.addEventListener("click", (e) => {
  const btn = e.target.closest(".bottom-nav-item");
  if (!btn) return;
  setCurrentView(btn.dataset.view);
  window.scrollTo(0, 0);
});

function renderManageBadge() {
  const pending = session.role === "家長" ? allTasks.filter((t) => t.reportStatus === "待審核").length : 0;
  el.manageBadge.classList.toggle("hidden", pending === 0);
  el.manageBadge.textContent = pending > 9 ? "9+" : pending;
}

// ---------- 篩選底部面板（選好按「套用」才生效） ----------

let filterDraft = null;

function openFilterSheet() {
  filterDraft = { view: progressPrefs.view, courses: [...progressPrefs.courses], statuses: [...progressPrefs.statuses] };
  renderFilterSheet();
  el.filterSheetOverlay.classList.remove("hidden");
  document.body.classList.add("sheet-open");
}

function closeFilterSheet() {
  el.filterSheetOverlay.classList.add("hidden");
  document.body.classList.remove("sheet-open");
  filterDraft = null;
}

function renderFilterSheet() {
  const modes = [
    { value: "accordion", icon: "accordion", title: "手風琴", sub: "依課程分頁，逐單元登錄" },
    { value: "board", icon: "board", title: "看板", sub: "各科一欄，快速瀏覽全部進度" },
  ];
  el.sheetModeOptions.innerHTML = "";
  modes.forEach((m) => {
    const card = document.createElement("button");
    card.className = "option-card" + (filterDraft.view === m.value ? " selected" : "");
    card.innerHTML = `
      <span class="option-card-icon">${iconSvg(m.icon)}</span>
      <span class="option-card-text">
        <span class="option-card-title">${m.title}</span>
        <span class="option-card-sub">${m.sub}</span>
      </span>
    `;
    card.addEventListener("click", () => {
      filterDraft.view = m.value;
      renderFilterSheet();
    });
    el.sheetModeOptions.appendChild(card);
  });

  el.sheetBoardFilters.classList.toggle("hidden", filterDraft.view !== "board");
  renderDraftChips(el.sheetCourseChips, "courses", getCourseList());
  renderDraftChips(el.sheetStatusChips, "statuses", PROGRESS_STATUSES);
}

function renderDraftChips(container, key, allValues) {
  const selected = filterDraft[key].filter((v) => allValues.includes(v));
  container.innerHTML = "";
  [{ label: "全部", value: null }].concat(allValues.map((v) => ({ label: v, value: v }))).forEach((c) => {
    const btn = document.createElement("button");
    btn.className = "filter-chip" + ((c.value === null ? selected.length === 0 : selected.includes(c.value)) ? " active" : "");
    btn.textContent = c.label;
    btn.addEventListener("click", () => {
      let next;
      if (c.value === null) next = [];
      else if (selected.includes(c.value)) next = selected.filter((v) => v !== c.value);
      else next = [...selected, c.value];
      if (next.length === allValues.length) next = [];
      filterDraft[key] = next;
      renderFilterSheet();
    });
    container.appendChild(btn);
  });
}

el.filterBtn.addEventListener("click", openFilterSheet);
el.filterSheetClose.addEventListener("click", closeFilterSheet);
el.filterSheetOverlay.addEventListener("click", (e) => {
  if (e.target === el.filterSheetOverlay) closeFilterSheet();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && filterDraft) closeFilterSheet();
});

el.filterSheetReset.addEventListener("click", () => {
  filterDraft.courses = [];
  filterDraft.statuses = [];
  renderFilterSheet();
});

el.filterSheetApply.addEventListener("click", () => {
  progressPrefs = filterDraft;
  saveProgressPrefs();
  closeFilterSheet();
  applyProgressMode();
  renderProgressBoard();
  updatePageHeader();
});

fillIcons();
applyProgressMode();
init();
