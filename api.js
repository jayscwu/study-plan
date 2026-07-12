// 部署 Apps Script 後，把產生的網址貼在這裡（見 README「Apps Script 部署步驟」）
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby03zKLtUptIejroZYumiPEG-Y3vYrVAIdXcEYmmupjVFqeOgzBmGdzJAHeOXn36an6/exec";

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
  getRequests: (name, role) => apiGet("requests", { name, role }),
  submitRequest: (student, seq, newStatus) =>
    apiPost("submitRequest", { student, seq, newStatus }),
  reviewRequest: (requestId, decision, reviewer) =>
    apiPost("reviewRequest", { requestId, decision, reviewer }),
};
