const STORAGE_KEY = "expense-tracker-v1";

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);

const loadExpenses = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveExpenses = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

let expenses = loadExpenses();
let searchTerm = "";

const $ = (sel) => document.querySelector(sel);

const form = $("#expense-form");
const amountInput = $("#amount");
const categoryInput = $("#category");
const dateInput = $("#date");
const noteInput = $("#note");
const tbody = $("#expense-table tbody");
const emptyMsg = $("#empty");
const totalEl = $("#total");
const monthTotalEl = $("#month-total");
const countEl = $("#count");
const byCategoryEl = $("#by-category");
const searchInput = $("#search");
const exportBtn = $("#export-btn");
const clearBtn = $("#clear-btn");

dateInput.valueAsDate = new Date();

const render = () => {
  const filtered = expenses
    .filter((e) => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return (
        e.category.toLowerCase().includes(q) ||
        (e.note || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  tbody.innerHTML = "";
  for (const e of filtered) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.date}</td>
      <td>${escapeHtml(e.category)}</td>
      <td>${escapeHtml(e.note || "")}</td>
      <td class="num">${formatINR(e.amount)}</td>
      <td><button class="del" data-id="${e.id}" aria-label="Delete">✕</button></td>
    `;
    tbody.appendChild(tr);
  }

  emptyMsg.style.display = filtered.length === 0 ? "block" : "none";

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const now = new Date();
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthTotal = expenses
    .filter((e) => e.date.startsWith(ym))
    .reduce((s, e) => s + e.amount, 0);

  totalEl.textContent = formatINR(total);
  monthTotalEl.textContent = formatINR(monthTotal);
  countEl.textContent = expenses.length;

  renderByCategory();
};

const renderByCategory = () => {
  const byCat = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const entries = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const max = entries.length ? entries[0][1] : 0;

  byCategoryEl.innerHTML = "";
  if (entries.length === 0) {
    byCategoryEl.innerHTML = `<p class="empty" style="grid-column:1/-1">No data yet.</p>`;
    return;
  }
  for (const [cat, amt] of entries) {
    const pct = max ? (amt / max) * 100 : 0;
    const div = document.createElement("div");
    div.className = "cat-pill";
    div.innerHTML = `
      <span class="name">${escapeHtml(cat)}</span>
      <span class="amt">${formatINR(amt)}</span>
      <div class="bar"><div style="width:${pct}%"></div></div>
    `;
    byCategoryEl.appendChild(div);
  }
};

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const amount = parseFloat(amountInput.value);
  if (!Number.isFinite(amount) || amount <= 0) return;
  expenses.push({
    id: crypto.randomUUID(),
    amount,
    category: categoryInput.value,
    date: dateInput.value,
    note: noteInput.value.trim(),
  });
  saveExpenses(expenses);
  form.reset();
  dateInput.valueAsDate = new Date();
  amountInput.focus();
  render();
});

tbody.addEventListener("click", (e) => {
  const btn = e.target.closest(".del");
  if (!btn) return;
  const id = btn.dataset.id;
  expenses = expenses.filter((x) => x.id !== id);
  saveExpenses(expenses);
  render();
});

searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value;
  render();
});

clearBtn.addEventListener("click", () => {
  if (expenses.length === 0) return;
  if (!confirm("Delete all expenses? This cannot be undone.")) return;
  expenses = [];
  saveExpenses(expenses);
  render();
});

exportBtn.addEventListener("click", () => {
  if (expenses.length === 0) return;
  const header = ["Date", "Category", "Note", "Amount"];
  const rows = expenses
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => [e.date, e.category, e.note || "", e.amount.toFixed(2)]);
  const csv = [header, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

render();
