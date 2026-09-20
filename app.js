const STATUS_LABELS = {
  "0": "待執行",
  "1": "學習中",
  "2": "已完成",
};

const WEEKDAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"];

const APP_VERSION = "v2.0";

const VIEW_TITLES = {
  overview: "儀表板",
  tasks: "學習列表",
  manage: "任務管理",
};

const SESSION_KEY = "studyplan_session";

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
  viewTasks: document.getElementById("view-tasks"),
  viewManage: document.getElementById("view-manage"),

  studentToolbar: document.getElementById("student-toolbar"),
  studentSelect: document.getElementById("student-select"),

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

  modeToggle: document.getElementById("mode-toggle"),
  listMode: document.getElementById("list-mode"),
  calendarMode: document.getElementById("calendar-mode"),

  taskFormPanel: document.getElementById("task-form-panel"),
  taskFormTitle: document.getElementById("task-form-title"),
  taskStudentSelect: document.getElementById("task-student-select"),
  taskCourseSelect: document.getElementById("task-course-select"),
  taskUnitSelect: document.getElementById("task-unit-select"),
  taskNameInput: document.getElementById("task-name-input"),
  taskDateInput: document.getElementById("task-date-input"),
  taskSubmitBtn: document.getElementById("task-submit-btn"),
  taskCancelEditBtn: document.getElementById("task-cancel-edit-btn"),
  taskFormMessage: document.getElementById("task-form-message"),

  pendingReportsList: document.getElementById("pending-reports-list"),
  noPendingReports: document.getElementById("no-pending-reports"),

  manageTasksList: document.getElementById("manage-tasks-list"),
  noManageTasks: document.getElementById("no-manage-tasks"),

  statTotal: document.getElementById("stat-total"),
  statDone: document.getElementById("stat-done"),
  statProgress: document.getElementById("stat-progress"),
  statTodo: document.getElementById("stat-todo"),
  overallPercent: document.getElementById("overall-percent"),
  overallProgressBar: document.getElementById("overall-progress-bar"),
  subjectsContainer: document.getElementById("subjects-container"),
  statusFilter: document.getElementById("status-filter"),
  searchInput: document.getElementById("search-input"),
  noResults: document.getElementById("no-results"),

  calendarPrev: document.getElementById("calendar-prev"),
  calendarNext: document.getElementById("calendar-next"),
  calendarMonthLabel: document.getElementById("calendar-month-label"),
  calendarGrid: document.getElementById("calendar-grid"),
  calendarDayDetail: document.getElementById("calendar-day-detail"),
  calendarDayTitle: document.getElementById("calendar-day-title"),
  calendarDayList: document.getElementById("calendar-day-list"),
  unscheduledList: document.getElementById("unscheduled-list"),
  noUnscheduled: document.getElementById("no-unscheduled"),
};

let session = loadSession();
let allTasks = [];
let allCourseUnits = [];
let allStudents = [];
let currentStudent = null;
let currentStatusFilter = "all";
let currentSearch = "";
let selectedLoginUser = null;
let editingTaskId = null;

let currentView = "overview";
let dashboardMode = "list";
let calendarDate = new Date();
let selectedCalendarDay = null;

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
  el.statusBarViewTitle.textContent = VIEW_TITLES[currentView];
  applyViewVisibility();
}

function applyViewVisibility() {
  const loadingHidden = el.loadingState.classList.contains("hidden");
  const errorHidden = el.errorState.classList.contains("hidden");
  const dataLoaded = loadingHidden && errorHidden;
  el.viewOverview.classList.toggle("hidden", !(dataLoaded && currentView === "overview"));
  el.viewTasks.classList.toggle("hidden", !(dataLoaded && currentView === "tasks"));
  el.viewManage.classList.toggle("hidden", !(dataLoaded && currentView === "manage"));
}

// ---------- Data loading ----------

function loadData() {
  showLoading();
  Promise.all([Api.getTasks(session.name, session.role), Api.getCourseUnits(), Api.getUsers()])
    .then(([tasksRes, courseUnitsRes, usersRes]) => {
      if (!tasksRes.ok) throw new Error(tasksRes.error || "讀取任務失敗");
      if (!courseUnitsRes.ok) throw new Error(courseUnitsRes.error || "讀取課程單元失敗");
      if (!usersRes.ok) throw new Error(usersRes.error || "讀取使用者失敗");
      allTasks = tasksRes.tasks;
      allCourseUnits = courseUnitsRes.units;
      allStudents = usersRes.users.filter((u) => u.role === "學生");

      if (session.role === "家長") {
        const students = [...new Set(allTasks.map((t) => t.student).filter(Boolean))];
        const prevSelection = currentStudent;
        el.studentSelect.innerHTML = students
          .map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`)
          .join("");
        currentStudent = students.includes(prevSelection) ? prevSelection : students[0] || null;
        el.studentSelect.value = currentStudent || "";
      } else {
        currentStudent = session.name;
      }

      populateTaskFormOptions();
      renderAll();
      showData();
    })
    .catch((err) => {
      console.error("讀取資料失敗", err);
      showError(err);
    });
}

el.studentSelect.addEventListener("change", (e) => {
  currentStudent = e.target.value;
  renderAll();
});

function showLoading() {
  el.loadingState.classList.remove("hidden");
  el.errorState.classList.add("hidden");
  el.viewOverview.classList.add("hidden");
  el.viewTasks.classList.add("hidden");
  el.viewManage.classList.add("hidden");
}

function showError(err) {
  el.loadingState.classList.add("hidden");
  el.errorState.classList.remove("hidden");
  el.viewOverview.classList.add("hidden");
  el.viewTasks.classList.add("hidden");
  el.viewManage.classList.add("hidden");
  el.errorMessage.textContent = err && err.message
    ? `讀取資料失敗（${err.message}），請確認網路連線或稍後再試。`
    : "讀取資料失敗，請確認網路連線或稍後再試。";
}

function showData() {
  el.loadingState.classList.add("hidden");
  el.errorState.classList.add("hidden");
  applyViewVisibility();
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

  const studentTasks = getStudentTasks();
  renderSummary(studentTasks);
  renderOverview(studentTasks);
  renderSubjects();
  renderCalendar();
  renderPendingReports();
  renderManageTasksList();
}

function renderSummary(tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "2").length;
  const progress = tasks.filter((t) => t.status === "1").length;
  const todo = tasks.filter((t) => t.status === "0").length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  el.statTotal.textContent = total;
  el.statDone.textContent = done;
  el.statProgress.textContent = progress;
  el.statTodo.textContent = todo;
  el.overallPercent.textContent = `${percent}%`;
  el.overallProgressBar.style.width = `${percent}%`;
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
  const todayStr = dateKey(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const tomorrowStr = dateKey(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

  const overdue = tasks.filter((t) => t.date && t.date < todayStr && t.status !== "2");
  const today = tasks.filter((t) => t.date === todayStr);
  const tomorrowTasks = tasks.filter((t) => t.date === tomorrowStr);

  renderOverviewGroup(overdue, el.overdueList, el.overdueCount, el.noOverdue);
  renderOverviewGroup(today, el.todayList, el.todayCount, el.noToday);
  renderOverviewGroup(tomorrowTasks, el.tomorrowList, el.tomorrowCount, el.noTomorrow);
}

el.overdueHeader.addEventListener("click", () => el.overdueBlock.classList.toggle("collapsed"));
el.todayHeader.addEventListener("click", () => el.todayBlock.classList.toggle("collapsed"));
el.tomorrowHeader.addEventListener("click", () => el.tomorrowBlock.classList.toggle("collapsed"));

function getFilteredTasks() {
  const search = currentSearch.trim().toLowerCase();
  return getStudentTasks().filter((t) => {
    if (currentStatusFilter !== "all" && t.status !== currentStatusFilter) return false;
    if (!search) return true;
    const haystack = `${t.course} ${t.unit} ${t.task}`.toLowerCase();
    return haystack.includes(search);
  });
}

function groupBy(tasks, key) {
  const map = new Map();
  for (const t of tasks) {
    if (!map.has(t[key])) map.set(t[key], []);
    map.get(t[key]).push(t);
  }
  return map;
}

// ---------- List mode ----------

function renderSubjects() {
  const filtered = getFilteredTasks();
  el.subjectsContainer.innerHTML = "";

  if (filtered.length === 0) {
    el.noResults.classList.remove("hidden");
    return;
  }
  el.noResults.classList.add("hidden");

  const byCourse = groupBy(filtered, "course");

  for (const [course, courseTasks] of byCourse) {
    el.subjectsContainer.appendChild(buildCourseBlock(course, courseTasks));
  }
}

function buildCourseBlock(course, tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "2").length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  const block = document.createElement("section");
  block.className = "course-block";

  const header = document.createElement("div");
  header.className = "course-block-header";
  header.innerHTML = `
    <h2 class="course-block-title">${escapeHtml(course)}</h2>
    <span class="course-block-percent">${done}/${total}・${percent}%</span>
  `;
  block.appendChild(header);

  const container = document.createElement("div");
  container.className = "subjects-container";
  const byUnit = groupBy(tasks, "unit");
  for (const [unit, unitTasks] of byUnit) {
    container.appendChild(buildUnitCard(unit, unitTasks));
  }
  block.appendChild(container);

  return block;
}

function buildUnitCard(unit, tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "2").length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  const card = document.createElement("section");
  card.className = "subject-card collapsed";

  const header = document.createElement("div");
  header.className = "subject-header";
  header.innerHTML = `
    <div class="subject-title-group">
      <h4 class="subject-title">${escapeHtml(unit)}</h4>
      <div class="subject-mini-progress">
        <div class="subject-mini-progress-fill" style="width:${percent}%"></div>
      </div>
      <span class="subject-percent">${done}/${total}・${percent}%</span>
    </div>
    <button class="subject-toggle" aria-label="展開/收合">▾</button>
  `;
  header.addEventListener("click", () => {
    card.classList.toggle("collapsed");
  });
  card.appendChild(header);

  card.appendChild(buildTaskListSimple(tasks));

  return card;
}

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
      ${showCourse ? `<div class="task-list-item-course">${escapeHtml(t.course)}</div>` : ""}
      <div class="task-list-item-chapter">${escapeHtml(t.unit)}</div>
      <div class="task-list-item-type">${escapeHtml(t.task)}</div>
    </div>
    <div class="task-list-item-actions">
      ${statusBadge(t.status)}
      ${reportActionHtml(t)}
    </div>
  `;
  const reportBtn = item.querySelector(".report-btn");
  if (reportBtn) {
    reportBtn.addEventListener("click", () => {
      reportBtn.disabled = true;
      Api.reportTask(session.name, t.id)
        .then((res) => {
          if (!res.ok) alert(res.error || "回報失敗");
          loadData();
        })
        .catch((err) => alert(`回報失敗（${err.message}）`));
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

// ---------- List / Calendar toggle ----------

el.modeToggle.addEventListener("click", (e) => {
  const btn = e.target.closest(".mode-toggle-btn");
  if (!btn) return;
  dashboardMode = btn.dataset.mode;
  [...el.modeToggle.children].forEach((c) => c.classList.toggle("active", c === btn));
  el.listMode.classList.toggle("hidden", dashboardMode !== "list");
  el.calendarMode.classList.toggle("hidden", dashboardMode !== "calendar");
  if (dashboardMode === "calendar") renderCalendar();
});

// ---------- Calendar mode ----------

function pad2(n) {
  return String(n).padStart(2, "0");
}

function dateKey(y, m, d) {
  return `${y}-${pad2(m + 1)}-${pad2(d)}`;
}

el.calendarPrev.addEventListener("click", () => {
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
  selectedCalendarDay = null;
  renderCalendar();
});

el.calendarNext.addEventListener("click", () => {
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
  selectedCalendarDay = null;
  renderCalendar();
});

function renderCalendar() {
  if (dashboardMode !== "calendar") return;

  const tasks = getFilteredTasks();
  const byDate = new Map();
  const unscheduled = [];
  for (const t of tasks) {
    if (!t.date) {
      unscheduled.push(t);
      continue;
    }
    if (!byDate.has(t.date)) byDate.set(t.date, []);
    byDate.get(t.date).push(t);
  }

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  el.calendarMonthLabel.textContent = `${year} 年 ${month + 1} 月`;

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstDay.getDay();
  const today = new Date();
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  el.calendarGrid.innerHTML = "";
  WEEKDAY_LABELS.forEach((label) => {
    const cell = document.createElement("div");
    cell.className = "calendar-weekday";
    cell.textContent = label;
    el.calendarGrid.appendChild(cell);
  });

  for (let i = 0; i < startWeekday; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day empty";
    el.calendarGrid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const key = dateKey(year, month, d);
    const dayTasks = byDate.get(key) || [];
    const cell = document.createElement("div");
    cell.className = "calendar-day";
    if (key === todayKey) cell.classList.add("today");
    if (key === selectedCalendarDay) cell.classList.add("selected");

    const shown = dayTasks.slice(0, 3);
    const more = dayTasks.length - shown.length;
    cell.innerHTML = `
      <span class="calendar-day-number">${d}</span>
      ${shown.map((t) => `<span class="calendar-day-chip status-badge status-${t.status}">${escapeHtml(t.unit)}</span>`).join("")}
      ${more > 0 ? `<span class="calendar-day-more">+${more}</span>` : ""}
    `;
    cell.addEventListener("click", () => {
      selectedCalendarDay = key;
      renderCalendar();
    });
    el.calendarGrid.appendChild(cell);
  }

  if (selectedCalendarDay && byDate.has(selectedCalendarDay)) {
    el.calendarDayDetail.classList.remove("hidden");
    el.calendarDayTitle.textContent = `${selectedCalendarDay} 的任務`;
    el.calendarDayList.replaceChildren(...buildTaskListMobile(byDate.get(selectedCalendarDay)).children);
  } else {
    el.calendarDayDetail.classList.add("hidden");
  }

  el.unscheduledList.innerHTML = "";
  if (unscheduled.length === 0) {
    el.noUnscheduled.classList.remove("hidden");
  } else {
    el.noUnscheduled.classList.add("hidden");
    el.unscheduledList.replaceChildren(...buildTaskListMobile(unscheduled).children);
  }
}

// ---------- Shared helpers ----------

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

function fillSelect(select, options, placeholder) {
  select.innerHTML = `<option value="">${placeholder}</option>` +
    options.map((o) => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join("");
}

// ---------- 任務管理（家長）：新增／編輯任務表單 ----------

function populateTaskFormOptions() {
  fillSelect(el.taskStudentSelect, allStudents.map((s) => s.name), "選擇學生");
  const courses = [...new Set(allCourseUnits.map((u) => u.course))];
  fillSelect(el.taskCourseSelect, courses, "選擇課程");
}

function populateTaskUnitSelect(course) {
  el.taskUnitSelect.disabled = !course;
  if (!course) {
    el.taskUnitSelect.innerHTML = '<option value="">選擇單元</option>';
    return;
  }
  const units = allCourseUnits.filter((u) => u.course === course);
  el.taskUnitSelect.innerHTML =
    '<option value="">選擇單元</option>' +
    units
      .map((u) => `<option value="${escapeHtml(u.unit)}">${escapeHtml(`${u.unitCode} ${u.unit}`.trim())}</option>`)
      .join("");
}

el.taskCourseSelect.addEventListener("change", () => populateTaskUnitSelect(el.taskCourseSelect.value));

function resetTaskForm() {
  editingTaskId = null;
  el.taskFormTitle.textContent = "新增任務";
  el.taskSubmitBtn.textContent = "新增任務";
  el.taskCancelEditBtn.classList.add("hidden");
  el.taskStudentSelect.value = "";
  el.taskCourseSelect.value = "";
  populateTaskUnitSelect("");
  el.taskNameInput.value = "";
  el.taskDateInput.value = "";
  el.taskFormMessage.classList.add("hidden");
}

function startEditTask(t) {
  editingTaskId = t.id;
  el.taskFormTitle.textContent = "編輯任務";
  el.taskSubmitBtn.textContent = "更新任務";
  el.taskCancelEditBtn.classList.remove("hidden");
  el.taskStudentSelect.value = t.student;
  el.taskCourseSelect.value = t.course;
  populateTaskUnitSelect(t.course);
  el.taskUnitSelect.value = t.unit;
  el.taskNameInput.value = t.task;
  el.taskDateInput.value = t.date || "";
  el.taskFormMessage.classList.add("hidden");
  el.taskFormPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

el.taskCancelEditBtn.addEventListener("click", resetTaskForm);

el.taskSubmitBtn.addEventListener("click", () => {
  const payload = {
    student: el.taskStudentSelect.value,
    course: el.taskCourseSelect.value,
    unit: el.taskUnitSelect.value,
    task: el.taskNameInput.value.trim(),
    date: el.taskDateInput.value,
  };
  if (!payload.student || !payload.course || !payload.unit || !payload.task) {
    el.taskFormMessage.textContent = "請完整填寫學生、課程、單元與任務名稱。";
    el.taskFormMessage.classList.remove("hidden");
    return;
  }
  el.taskSubmitBtn.disabled = true;
  const call = editingTaskId
    ? Api.updateTask({ id: editingTaskId, editor: session.name, ...payload })
    : Api.createTask({ creator: session.name, ...payload });
  call
    .then((res) => {
      el.taskSubmitBtn.disabled = false;
      if (!res.ok) {
        el.taskFormMessage.textContent = res.error || "操作失敗";
        el.taskFormMessage.classList.remove("hidden");
        return;
      }
      resetTaskForm();
      loadData();
    })
    .catch((err) => {
      el.taskSubmitBtn.disabled = false;
      el.taskFormMessage.textContent = `操作失敗（${err.message}）`;
      el.taskFormMessage.classList.remove("hidden");
    });
});

// ---------- 任務管理（家長）：待回報審核 ----------

function buildPendingReportItem(t) {
  const item = document.createElement("div");
  item.className = "request-item";
  item.innerHTML = `
    <div class="request-item-info">
      <p class="request-item-title">${escapeHtml(t.course)}・${escapeHtml(t.unit)}・${escapeHtml(t.task)}</p>
      <p class="request-item-meta">${escapeHtml(t.student)} ・ ${formatTime(t.reportTime)}</p>
    </div>
    <div class="request-item-actions">
      <button class="approve-btn" data-decision="核准">核准</button>
      <button class="reject-btn" data-decision="拒絕">拒絕</button>
    </div>
  `;
  item.querySelectorAll("button[data-decision]").forEach((btn) => {
    btn.addEventListener("click", () => {
      item.querySelectorAll("button").forEach((b) => (b.disabled = true));
      Api.reviewTask(t.id, btn.dataset.decision, session.name)
        .then((res) => {
          if (!res.ok) alert(res.error || "審核失敗");
          loadData();
        })
        .catch((err) => alert(`審核失敗（${err.message}）`));
    });
  });
  return item;
}

function renderPendingReports() {
  if (session.role !== "家長") return;
  const pending = allTasks.filter((t) => t.reportStatus === "待審核");
  el.pendingReportsList.innerHTML = "";
  if (pending.length === 0) {
    el.noPendingReports.classList.remove("hidden");
  } else {
    el.noPendingReports.classList.add("hidden");
    pending.forEach((t) => el.pendingReportsList.appendChild(buildPendingReportItem(t)));
  }
}

// ---------- 任務管理（家長）：任務清單管理 ----------

function buildManageTaskItem(t) {
  const item = document.createElement("div");
  item.className = "request-item";
  item.innerHTML = `
    <div class="request-item-info">
      <p class="request-item-title">${escapeHtml(t.course)}・${escapeHtml(t.unit)}・${escapeHtml(t.task)}</p>
      <p class="request-item-meta">
        ${t.date ? escapeHtml(t.date) : "未排定日期"} ${statusBadge(t.status)} ${t.reportStatus ? reviewStatusBadge(t.reportStatus) : ""}
      </p>
    </div>
    <div class="request-item-actions">
      <button class="secondary-btn" data-action="edit">編輯</button>
      <button class="reject-btn" data-action="delete">刪除</button>
    </div>
  `;
  item.querySelector('[data-action="edit"]').addEventListener("click", () => startEditTask(t));
  item.querySelector('[data-action="delete"]').addEventListener("click", () => {
    if (!confirm(`確定要刪除「${t.task}」這筆任務嗎？`)) return;
    Api.deleteTask({ id: t.id, editor: session.name })
      .then((res) => {
        if (!res.ok) {
          alert(res.error || "刪除失敗");
          return;
        }
        loadData();
      })
      .catch((err) => alert(`刪除失敗（${err.message}）`));
  });
  return item;
}

function renderManageTasksList() {
  if (session.role !== "家長") return;
  const tasks = allTasks.filter((t) => t.student === currentStudent);
  el.manageTasksList.innerHTML = "";
  if (tasks.length === 0) {
    el.noManageTasks.classList.remove("hidden");
  } else {
    el.noManageTasks.classList.add("hidden");
    tasks.forEach((t) => el.manageTasksList.appendChild(buildManageTaskItem(t)));
  }
}

// ---------- Filters ----------

el.statusFilter.addEventListener("click", (e) => {
  const chip = e.target.closest(".filter-chip");
  if (!chip) return;
  currentStatusFilter = chip.dataset.status;
  [...el.statusFilter.children].forEach((c) => c.classList.toggle("active", c === chip));
  renderSubjects();
  renderCalendar();
});

el.searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value;
  renderSubjects();
  renderCalendar();
});

el.refreshBtn.addEventListener("click", () => {
  el.refreshBtn.classList.add("spinning");
  loadData();
  setTimeout(() => el.refreshBtn.classList.remove("spinning"), 800);
});

el.retryBtn.addEventListener("click", loadData);

init();
