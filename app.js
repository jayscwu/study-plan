const STATUS_LABELS = {
  "0": "待執行",
  "1": "學習中",
  "2": "已完成",
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
  currentUser: document.getElementById("current-user"),
  logoutBtn: document.getElementById("logout-btn"),

  courseName: document.getElementById("course-name"),
  lastUpdated: document.getElementById("last-updated"),
  refreshBtn: document.getElementById("refresh-btn"),
  retryBtn: document.getElementById("retry-btn"),
  loadingState: document.getElementById("loading-state"),
  errorState: document.getElementById("error-state"),
  errorMessage: document.getElementById("error-message"),
  dataView: document.getElementById("data-view"),

  studentToolbar: document.getElementById("student-toolbar"),
  studentSelect: document.getElementById("student-select"),

  requestsPanel: document.getElementById("requests-panel"),
  pendingRequestsList: document.getElementById("pending-requests-list"),
  noPendingRequests: document.getElementById("no-pending-requests"),

  myRequestsPanel: document.getElementById("my-requests-panel"),
  myRequestsList: document.getElementById("my-requests-list"),
  noMyRequests: document.getElementById("no-my-requests"),

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

  statusPicker: document.getElementById("status-picker"),
  statusPickerCancel: document.getElementById("status-picker-cancel"),
};

let session = loadSession();
let allTasks = [];
let allRequests = [];
let currentStudent = null;
let currentStatusFilter = "all";
let currentSearch = "";
let openPickerSeq = null;
let selectedLoginUser = null;

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
    card.addEventListener("click", () => selectLoginUser(u));
    el.loginUsers.appendChild(card);
  }
}

function selectLoginUser(user) {
  selectedLoginUser = user;
  el.loginSelectedName.textContent = `${user.name}（${user.role}）`;
  el.loginPinPanel.classList.remove("hidden");
  el.loginError.classList.add("hidden");
  el.loginPinInput.value = "";
  el.loginPinInput.focus();
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

el.loginBackBtn.addEventListener("click", () => {
  selectedLoginUser = null;
  el.loginPinPanel.classList.add("hidden");
});

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
  loadData();
}

function init() {
  if (session) {
    enterApp();
  } else {
    initLogin();
  }
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
  el.dataView.classList.add("hidden");
}

function showError(err) {
  el.loadingState.classList.add("hidden");
  el.errorState.classList.remove("hidden");
  el.dataView.classList.add("hidden");
  el.errorMessage.textContent = err && err.message
    ? `讀取資料失敗（${err.message}），請確認網路連線或稍後再試。`
    : "讀取資料失敗，請確認網路連線或稍後再試。";
}

function showData() {
  el.loadingState.classList.add("hidden");
  el.errorState.classList.add("hidden");
  el.dataView.classList.remove("hidden");
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
  el.lastUpdated.textContent = `最後更新：${new Date().toLocaleString("zh-TW", { hour12: false })}`;

  const studentTasks = getStudentTasks();
  renderSummary(studentTasks);
  renderSubjects();
  renderRequestPanels();
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
  card.className = "subject-card";

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
  const showAction = session.role === "學生";
  const table = document.createElement("table");
  table.className = "task-table";
  table.innerHTML = `
    <thead>
      <tr><th>章節</th><th>任務</th><th>狀態</th>${showAction ? "<th></th>" : ""}</tr>
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
      ${showAction ? `<td>${taskActionHtml(t)}</td>` : ""}
    `;
    tbody.appendChild(tr);
    if (showAction) bindTaskAction(tr, t);
  }
  return table;
}

function buildTaskListMobile(tasks) {
  const showAction = session.role === "學生";
  const list = document.createElement("div");
  list.className = "task-list-mobile";
  for (const t of tasks) {
    const item = document.createElement("div");
    item.className = "task-list-item";
    item.innerHTML = `
      <div class="task-list-item-text">
        <div class="task-list-item-chapter">${escapeHtml(t.chapter)}</div>
        <div class="task-list-item-type">${escapeHtml(t.task)}</div>
      </div>
      ${statusBadge(t.status)}
      ${showAction ? taskActionHtml(t) : ""}
    `;
    list.appendChild(item);
    if (showAction) bindTaskAction(item, t);
  }
  return list;
}

function taskActionHtml(t) {
  if (t.pendingStatus) {
    return `<span class="pending-badge">審核中→${STATUS_LABELS[t.pendingStatus]}</span>`;
  }
  return `<button class="task-action-btn" data-seq="${escapeHtml(String(t.seq))}">申請變更</button>`;
}

function bindTaskAction(container, t) {
  if (t.pendingStatus) return;
  const btn = container.querySelector(".task-action-btn");
  if (!btn) return;
  btn.addEventListener("click", (e) => openStatusPicker(t, e.currentTarget));
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

// ---------- Status change request (student) ----------

function openStatusPicker(task, anchorEl) {
  openPickerSeq = task.seq;
  const rect = anchorEl.getBoundingClientRect();
  const top = Math.min(rect.bottom + 6, window.innerHeight - 160);
  el.statusPicker.style.top = `${Math.max(8, top)}px`;
  el.statusPicker.style.left = `${Math.max(8, rect.right - 170)}px`;
  el.statusPicker.querySelectorAll(".status-picker-option").forEach((opt) => {
    opt.style.display = opt.dataset.status === task.status ? "none" : "block";
  });
  el.statusPicker.classList.remove("hidden");
}

function closeStatusPicker() {
  el.statusPicker.classList.add("hidden");
  openPickerSeq = null;
}

el.statusPicker.querySelectorAll(".status-picker-option").forEach((opt) => {
  opt.addEventListener("click", () => {
    if (openPickerSeq == null) return;
    const newStatus = opt.dataset.status;
    const seq = openPickerSeq;
    closeStatusPicker();
    Api.submitRequest(session.name, seq, newStatus)
      .then((res) => {
        if (!res.ok) {
          alert(res.error || "申請失敗");
          return;
        }
        loadData();
      })
      .catch((err) => alert(`申請失敗（${err.message}）`));
  });
});

el.statusPickerCancel.addEventListener("click", closeStatusPicker);

document.addEventListener("click", (e) => {
  if (el.statusPicker.classList.contains("hidden")) return;
  if (el.statusPicker.contains(e.target) || e.target.closest(".task-action-btn")) return;
  closeStatusPicker();
});

// ---------- Request panels ----------

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

// ---------- Filters ----------

el.statusFilter.addEventListener("click", (e) => {
  const chip = e.target.closest(".filter-chip");
  if (!chip) return;
  currentStatusFilter = chip.dataset.status;
  [...el.statusFilter.children].forEach((c) => c.classList.toggle("active", c === chip));
  renderSubjects();
});

el.searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value;
  renderSubjects();
});

el.refreshBtn.addEventListener("click", () => {
  el.refreshBtn.classList.add("spinning");
  loadData();
  setTimeout(() => el.refreshBtn.classList.remove("spinning"), 800);
});

el.retryBtn.addEventListener("click", loadData);

init();
