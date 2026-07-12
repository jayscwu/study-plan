const SHEET_ID = "1jKSDlFF1_2GBb0jlfiIZcxln7mUYswKh0n6Q7nIQsUg";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

const STATUS_LABELS = {
  "0": "待執行",
  "1": "學習中",
  "2": "已完成",
};

const el = {
  courseName: document.getElementById("course-name"),
  lastUpdated: document.getElementById("last-updated"),
  refreshBtn: document.getElementById("refresh-btn"),
  retryBtn: document.getElementById("retry-btn"),
  loadingState: document.getElementById("loading-state"),
  errorState: document.getElementById("error-state"),
  errorMessage: document.getElementById("error-message"),
  dataView: document.getElementById("data-view"),
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
};

let allTasks = [];
let currentStatusFilter = "all";
let currentSearch = "";

function parseStatus(raw) {
  const match = /^(\d)/.exec((raw || "").trim());
  return match ? match[1] : "0";
}

function normalizeRow(row) {
  return {
    seq: row["項次"] || "",
    course: (row["課程"] || "").trim(),
    subject: (row["科目"] || "").trim(),
    chapter: (row["章節"] || "").trim(),
    task: (row["任務"] || "").trim(),
    status: parseStatus(row["狀態"]),
  };
}

function fetchData() {
  showLoading();
  fetch(CSV_URL, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then((csvText) => {
      const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
      const rows = parsed.data
        .map(normalizeRow)
        .filter((r) => r.subject && r.chapter);
      if (rows.length === 0) throw new Error("EMPTY");
      allTasks = rows;
      renderAll();
      showData();
    })
    .catch((err) => {
      console.error("讀取 Google Sheet 失敗", err);
      showError(err);
    });
}

function showLoading() {
  el.loadingState.classList.remove("hidden");
  el.errorState.classList.add("hidden");
  el.dataView.classList.add("hidden");
}

function showError(err) {
  el.loadingState.classList.add("hidden");
  el.errorState.classList.remove("hidden");
  el.dataView.classList.add("hidden");

  if (window.location.protocol === "file:") {
    el.errorMessage.textContent =
      "偵測到目前是用「本機檔案」方式開啟這個網頁（網址開頭是 file://）。瀏覽器基於安全機制會擋掉這種方式對 Google Sheet 的連線，請改用本機網頁伺服器開啟（見 README.md），或發佈到 GitHub Pages 後用網址開啟。";
  } else if (err && err.message) {
    el.errorMessage.textContent = `讀取資料失敗（${err.message}），請確認網路連線或稍後再試。`;
  } else {
    el.errorMessage.textContent = "讀取資料失敗，請確認網路連線或稍後再試。";
  }
}

function showData() {
  el.loadingState.classList.add("hidden");
  el.errorState.classList.add("hidden");
  el.dataView.classList.remove("hidden");
}

function renderAll() {
  const courses = [...new Set(allTasks.map((t) => t.course).filter(Boolean))];
  el.courseName.textContent = courses.length ? courses.join("、") : "";
  el.lastUpdated.textContent = `最後更新：${new Date().toLocaleString("zh-TW", { hour12: false })}`;

  renderSummary(allTasks);
  renderSubjects();
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
  return allTasks.filter((t) => {
    if (currentStatusFilter !== "all" && t.status !== currentStatusFilter) return false;
    if (!search) return true;
    const haystack = `${t.subject} ${t.chapter} ${t.task}`.toLowerCase();
    return haystack.includes(search);
  });
}

function groupBySubject(tasks) {
  const map = new Map();
  for (const t of tasks) {
    if (!map.has(t.subject)) map.set(t.subject, []);
    map.get(t.subject).push(t);
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

  const grouped = groupBySubject(filtered);

  for (const [subject, tasks] of grouped) {
    el.subjectsContainer.appendChild(buildSubjectCard(subject, tasks));
  }
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
      <h2 class="subject-title">${escapeHtml(subject)}</h2>
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
  div.textContent = str;
  return div.innerHTML;
}

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
  fetchData();
  setTimeout(() => el.refreshBtn.classList.remove("spinning"), 800);
});

el.retryBtn.addEventListener("click", fetchData);

fetchData();
