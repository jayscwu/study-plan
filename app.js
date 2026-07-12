const STATUS_LABELS = {
  "0": "待執行",
  "1": "學習中",
  "2": "已完成",
};

const WEEKDAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"];

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
  currentUser: document.getElementById("current-user"),
  logoutBtn: document.getElementById("logout-btn"),
  mainNav: document.getElementById("main-nav"),

  courseName: document.getElementById("course-name"),
  refreshBtn: document.getElementById("refresh-btn"),
  retryBtn: document.getElementById("retry-btn"),
  loadingState: document.getElementById("loading-state"),
  errorState: document.getElementById("error-state"),
  errorMessage: document.getElementById("error-message"),

  viewDashboard: document.getElementById("view-dashboard"),
  viewRequests: document.getElementById("view-requests"),

  studentToolbar: document.getElementById("student-toolbar"),
  studentSelect: document.getElementById("student-select"),

  modeToggle: document.getElementById("mode-toggle"),
  listMode: document.getElementById("list-mode"),
  calendarMode: document.getElementById("calendar-mode"),

  requestsPanel: document.getElementById("requests-panel"),
  pendingRequestsList: document.getElementById("pending-requests-list"),
  noPendingRequests: document.getElementById("no-pending-requests"),

  myRequestsPanel: document.getElementById("my-requests-panel"),
  myRequestsList: document.getElementById("my-requests-list"),
  noMyRequests: document.getElementById("no-my-requests"),

  submitRequestPanel: document.getElementById("submit-request-panel"),
  reqCourseSelect: document.getElementById("req-course-select"),
  reqSubjectSelect: document.getElementById("req-subject-select"),
  reqChapterSelect: document.getElementById("req-chapter-select"),
  reqTaskSelect: document.getElementById("req-task-select"),
  reqCurrentStatus: document.getElementById("req-current-status"),
  reqStatusSelect: document.getElementById("req-status-select"),
  reqSubmitBtn: document.getElementById("req-submit-btn"),
  reqFormMessage: document.getElementById("req-form-message"),
  reqSearchInput: document.getElementById("req-search-input"),
  reqSearchResults: document.getElementById("req-search-results"),

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
let allRequests = [];
let currentStudent = null;
let currentStatusFilter = "all";
let currentSearch = "";
let selectedLoginUser = null;

let currentView = "dashboard";
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

// ---------- App shell ----------

function enterApp() {
  el.loginView.classList.add("hidden");
  el.appView.classList.remove("hidden");
  el.currentUser.textContent = `${session.name}（${session.role}）`;
  el.studentToolbar.classList.toggle("hidden", session.role !== "家長");
  el.requestsPanel.classList.toggle("hidden", session.role !== "家長");
  el.myRequestsPanel.classList.toggle("hidden", session.role !== "學生");
  el.submitRequestPanel.classList.toggle("hidden", session.role !== "學生");
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
  applyViewVisibility();
}

function applyViewVisibility() {
  const loadingHidden = el.loadingState.classList.contains("hidden");
  const errorHidden = el.errorState.classList.contains("hidden");
  const dataLoaded = loadingHidden && errorHidden;
  el.viewDashboard.classList.toggle("hidden", !(dataLoaded && currentView === "dashboard"));
  el.viewRequests.classList.toggle("hidden", !(dataLoaded && currentView === "requests"));
}

// ---------- Data loading ----------

function loadData() {
  showLoading();
  Promise.all([Api.getTasks(session.name, session.role), Api.getRequests(session.name, session.role)])
    .then(([tasksRes, requestsRes]) => {
      if (!tasksRes.ok) throw new Error(tasksRes.error || "讀取任務失敗");
      if (!requestsRes.ok) throw new Error(requestsRes.error || "讀取申請紀錄失敗");
      allTasks = tasksRes.tasks;
      allRequests = requestsRes.requests;

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
  el.viewDashboard.classList.add("hidden");
  el.viewRequests.classList.add("hidden");
}

function showError(err) {
  el.loadingState.classList.add("hidden");
  el.errorState.classList.remove("hidden");
  el.viewDashboard.classList.add("hidden");
  el.viewRequests.classList.add("hidden");
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
  el.courseName.textContent = currentStudent ? `${currentStudent} 的學習計畫` : "";
  const lastUpdated = new Date().toLocaleString("zh-TW", { hour12: false });
  el.currentUser.textContent = `${session.name}（${session.role}）・最後更新 ${lastUpdated}`;

  const studentTasks = getStudentTasks();
  renderSummary(studentTasks);
  renderSubjects();
  renderCalendar();
  renderRequestPanels();
  renderRequestForm();
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

function getFilteredTasks() {
  const search = currentSearch.trim().toLowerCase();
  return getStudentTasks().filter((t) => {
    if (currentStatusFilter !== "all" && t.status !== currentStatusFilter) return false;
    if (!search) return true;
    const haystack = `${t.course} ${t.subject} ${t.chapter} ${t.task}`.toLowerCase();
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
  const bySubject = groupBy(tasks, "subject");
  for (const [subject, subjectTasks] of bySubject) {
    container.appendChild(buildSubjectCard(subject, subjectTasks));
  }
  block.appendChild(container);

  return block;
}

function buildSubjectCard(subject, tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "2").length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  const card = document.createElement("section");
  card.className = "subject-card collapsed";

  const header = document.createElement("div");
  header.className = "subject-header";
  header.innerHTML = `
    <div class="subject-title-group">
      <h3 class="subject-title">${escapeHtml(subject)}</h3>
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

  card.appendChild(buildTaskTable(tasks));
  card.appendChild(buildTaskListMobile(tasks));

  return card;
}

function buildTaskTable(tasks) {
  const table = document.createElement("table");
  table.className = "task-table";
  table.innerHTML = `
    <thead>
      <tr><th>章節</th><th>任務</th><th>狀態</th></tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector("tbody");
  for (const t of tasks) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(t.chapter)}</td>
      <td>${escapeHtml(t.task)}</td>
      <td>${statusBadge(t.status)}</td>
    `;
    tbody.appendChild(tr);
  }
  return table;
}

function buildTaskListMobile(tasks) {
  const list = document.createElement("div");
  list.className = "task-list-mobile";
  for (const t of tasks) {
    const item = document.createElement("div");
    item.className = "task-list-item";
    item.innerHTML = `
      <div class="task-list-item-text">
        <div class="task-list-item-course">${escapeHtml(t.course)}</div>
        <div class="task-list-item-chapter">${escapeHtml(t.chapter)}</div>
        <div class="task-list-item-type">${escapeHtml(t.task)}</div>
      </div>
      ${statusBadge(t.status)}
    `;
    list.appendChild(item);
  }
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
      ${shown.map((t) => `<span class="calendar-day-chip status-badge status-${t.status}">${escapeHtml(t.chapter)}</span>`).join("")}
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

// ---------- Request panels (待審核 / 我的申請紀錄) ----------

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

function buildRequestItem(r, showActions) {
  const item = document.createElement("div");
  item.className = "request-item";
  item.innerHTML = `
    <div class="request-item-info">
      <p class="request-item-title">${escapeHtml(r.course)}・${escapeHtml(r.subject)}・${escapeHtml(r.chapter)}</p>
      <p class="request-item-meta">${escapeHtml(r.applicant)} ・ ${formatTime(r.time)}</p>
      <p class="request-item-change">
        ${statusBadge(r.oldStatus)} → ${statusBadge(r.newStatus)}
        ${showActions ? "" : reviewStatusBadge(r.reviewStatus)}
      </p>
    </div>
    ${showActions ? `<div class="request-item-actions">
      <button class="approve-btn" data-id="${r.requestId}" data-decision="核准">核准</button>
      <button class="reject-btn" data-id="${r.requestId}" data-decision="拒絕">拒絕</button>
    </div>` : ""}
  `;
  if (showActions) {
    item.querySelectorAll("button[data-decision]").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.closest(".request-item-actions").querySelectorAll("button").forEach((b) => (b.disabled = true));
        Api.reviewRequest(r.requestId, btn.dataset.decision, session.name)
          .then((res) => {
            if (!res.ok) {
              alert(res.error || "審核失敗");
              loadData();
              return;
            }
            loadData();
          })
          .catch((err) => alert(`審核失敗（${err.message}）`));
      });
    });
  }
  return item;
}

function renderRequestPanels() {
  if (session.role === "家長") {
    const pending = allRequests.filter((r) => r.reviewStatus === "待審核");
    el.pendingRequestsList.innerHTML = "";
    if (pending.length === 0) {
      el.noPendingRequests.classList.remove("hidden");
    } else {
      el.noPendingRequests.classList.add("hidden");
      pending.forEach((r) => el.pendingRequestsList.appendChild(buildRequestItem(r, true)));
    }
  } else if (session.role === "學生") {
    el.myRequestsList.innerHTML = "";
    if (allRequests.length === 0) {
      el.noMyRequests.classList.remove("hidden");
    } else {
      el.noMyRequests.classList.add("hidden");
      allRequests.forEach((r) => el.myRequestsList.appendChild(buildRequestItem(r, false)));
    }
  }
}

// ---------- Submit request form (學生：課程→科目→章節→任務) ----------

function fillSelect(select, options, placeholder) {
  select.innerHTML = `<option value="">${placeholder}</option>` +
    options.map((o) => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join("");
}

function renderRequestForm() {
  if (session.role !== "學生") return;
  const courses = [...new Set(allTasks.map((t) => t.course))];
  fillSelect(el.reqCourseSelect, courses, "選擇課程");
  el.reqSubjectSelect.innerHTML = '<option value="">選擇科目</option>';
  el.reqChapterSelect.innerHTML = '<option value="">選擇章節</option>';
  el.reqTaskSelect.innerHTML = '<option value="">選擇任務</option>';
  [el.reqSubjectSelect, el.reqChapterSelect, el.reqTaskSelect, el.reqStatusSelect].forEach((s) => (s.disabled = true));
  el.reqSubmitBtn.disabled = true;
  el.reqCurrentStatus.classList.add("hidden");
  el.reqFormMessage.classList.add("hidden");
  el.reqStatusSelect.value = "";
  el.reqSearchInput.value = "";
  el.reqSearchResults.innerHTML = "";
  el.reqSearchResults.classList.add("hidden");
}

el.reqSearchInput.addEventListener("input", () => {
  const query = el.reqSearchInput.value.trim().toLowerCase();
  el.reqSearchResults.innerHTML = "";
  if (!query) {
    el.reqSearchResults.classList.add("hidden");
    return;
  }
  const matches = allTasks
    .filter((t) => !t.pendingStatus)
    .filter((t) => `${t.course} ${t.subject} ${t.chapter} ${t.task}`.toLowerCase().includes(query))
    .slice(0, 8);

  if (matches.length === 0) {
    el.reqSearchResults.innerHTML = '<p class="no-results">找不到符合的任務</p>';
    el.reqSearchResults.classList.remove("hidden");
    return;
  }

  matches.forEach((t) => {
    const item = document.createElement("div");
    item.className = "req-search-result-item";
    item.innerHTML = `${escapeHtml(t.course)}・${escapeHtml(t.subject)}・${escapeHtml(t.chapter)}・${escapeHtml(t.task)} ${statusBadge(t.status)}`;
    item.addEventListener("click", () => {
      selectTaskFully(t);
      el.reqSearchInput.value = "";
      el.reqSearchResults.innerHTML = "";
      el.reqSearchResults.classList.add("hidden");
    });
    el.reqSearchResults.appendChild(item);
  });
  el.reqSearchResults.classList.remove("hidden");
});

let selectedRequestTask = null;

function populateSubjects(course) {
  el.reqChapterSelect.innerHTML = '<option value="">選擇章節</option>';
  el.reqTaskSelect.innerHTML = '<option value="">選擇任務</option>';
  el.reqSubjectSelect.disabled = !course;
  el.reqChapterSelect.disabled = true;
  el.reqTaskSelect.disabled = true;
  resetTaskSelection();
  if (!course) {
    el.reqSubjectSelect.innerHTML = '<option value="">選擇科目</option>';
    return;
  }
  const subjects = [...new Set(allTasks.filter((t) => t.course === course).map((t) => t.subject))];
  fillSelect(el.reqSubjectSelect, subjects, "選擇科目");
}

function populateChapters(course, subject) {
  el.reqTaskSelect.innerHTML = '<option value="">選擇任務</option>';
  el.reqChapterSelect.disabled = !subject;
  el.reqTaskSelect.disabled = true;
  resetTaskSelection();
  if (!subject) {
    el.reqChapterSelect.innerHTML = '<option value="">選擇章節</option>';
    return;
  }
  const chapters = [...new Set(allTasks.filter((t) => t.course === course && t.subject === subject).map((t) => t.chapter))];
  fillSelect(el.reqChapterSelect, chapters, "選擇章節");
}

function populateTasks(course, subject, chapter) {
  el.reqTaskSelect.disabled = !chapter;
  resetTaskSelection();
  if (!chapter) {
    el.reqTaskSelect.innerHTML = '<option value="">選擇任務</option>';
    return;
  }
  const candidates = allTasks.filter(
    (t) => t.course === course && t.subject === subject && t.chapter === chapter && !t.pendingStatus
  );
  el.reqTaskSelect.innerHTML =
    '<option value="">選擇任務</option>' +
    candidates.map((t) => `<option value="${escapeHtml(String(t.seq))}">${escapeHtml(t.task)}</option>`).join("");
  if (candidates.length === 0) {
    el.reqFormMessage.textContent = "這個章節底下的任務都已經有審核中的申請。";
    el.reqFormMessage.classList.remove("hidden");
  } else {
    el.reqFormMessage.classList.add("hidden");
  }
}

function selectTaskBySeq(seq) {
  resetTaskSelection();
  if (!seq) return;
  selectedRequestTask = allTasks.find((t) => String(t.seq) === seq) || null;
  if (!selectedRequestTask) return;
  el.reqCurrentStatus.textContent = `目前狀態：${STATUS_LABELS[selectedRequestTask.status]}`;
  el.reqCurrentStatus.classList.remove("hidden");
  el.reqStatusSelect.disabled = false;
  [...el.reqStatusSelect.options].forEach((opt) => {
    if (!opt.value) return;
    opt.hidden = opt.value === selectedRequestTask.status;
  });
}

function selectTaskFully(task) {
  el.reqCourseSelect.value = task.course;
  populateSubjects(task.course);
  el.reqSubjectSelect.value = task.subject;
  populateChapters(task.course, task.subject);
  el.reqChapterSelect.value = task.chapter;
  populateTasks(task.course, task.subject, task.chapter);
  el.reqTaskSelect.value = String(task.seq);
  selectTaskBySeq(String(task.seq));
  el.reqStatusSelect.focus();
}

el.reqCourseSelect.addEventListener("change", () => populateSubjects(el.reqCourseSelect.value));

el.reqSubjectSelect.addEventListener("change", () =>
  populateChapters(el.reqCourseSelect.value, el.reqSubjectSelect.value)
);

el.reqChapterSelect.addEventListener("change", () =>
  populateTasks(el.reqCourseSelect.value, el.reqSubjectSelect.value, el.reqChapterSelect.value)
);

el.reqTaskSelect.addEventListener("change", () => selectTaskBySeq(el.reqTaskSelect.value));

el.reqStatusSelect.addEventListener("change", () => {
  el.reqSubmitBtn.disabled = !selectedRequestTask || !el.reqStatusSelect.value;
});

function resetTaskSelection() {
  selectedRequestTask = null;
  el.reqCurrentStatus.classList.add("hidden");
  el.reqStatusSelect.disabled = true;
  el.reqStatusSelect.value = "";
  el.reqSubmitBtn.disabled = true;
}

el.reqSubmitBtn.addEventListener("click", () => {
  if (!selectedRequestTask || !el.reqStatusSelect.value) return;
  el.reqSubmitBtn.disabled = true;
  Api.submitRequest(session.name, selectedRequestTask.seq, el.reqStatusSelect.value)
    .then((res) => {
      if (!res.ok) {
        el.reqFormMessage.textContent = res.error || "申請失敗";
        el.reqFormMessage.classList.remove("hidden");
        el.reqSubmitBtn.disabled = false;
        return;
      }
      loadData();
    })
    .catch((err) => {
      el.reqFormMessage.textContent = `申請失敗（${err.message}）`;
      el.reqFormMessage.classList.remove("hidden");
      el.reqSubmitBtn.disabled = false;
    });
});

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
