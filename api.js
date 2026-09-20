// 部署 Apps Script 後，把產生的網址貼在這裡（見 README「Apps Script 部署步驟」）
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxHOWIeiaKO7Hi6qP4ByQE70mdLuMBH4wqnNP-Y6AqhGI5IQcXXcgy83t2HZfljyao1nw/exec";

function apiGet(action, params) {
  const query = new URLSearchParams({ action, ...params }).toString();
  return fetch(`${APPS_SCRIPT_URL}?${query}`, { cache: "no-store" }).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
}

function apiPost(action, body) {
  return fetch(`${APPS_SCRIPT_URL}?action=${encodeURIComponent(action)}`, {
    method: "POST",
    body: JSON.stringify(body),
  }).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
}

const Api = {
  getUsers: () => apiGet("users", {}),
  login: (name, pin) => apiPost("login", { name, pin }),
  getTasks: (name, role) => apiGet("tasks", { name, role }),
  getCourseUnits: () => apiGet("courseUnits", {}),
  createTask: (payload) => apiPost("createTask", payload),
  updateTask: (payload) => apiPost("updateTask", payload),
  deleteTask: (payload) => apiPost("deleteTask", payload),
  reportTask: (student, id) => apiPost("reportTask", { student, id }),
  reviewTask: (id, decision, reviewer) => apiPost("reviewTask", { id, decision, reviewer }),
};
