let quotes = [];

// ---- Local Storage ----
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) quotes = parsed;
    } catch {}
  }
  if (quotes.length === 0) {
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Success is not in what you have, but who you are.", category: "Success" },
      { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Life" }
    ];
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ---- Remember last selected filter (localStorage) ----
function saveSelectedCategory(cat) {
  localStorage.setItem("selectedCategory", cat);
}

function restoreSelectedCategory() {
  const saved = localStorage.getItem("selectedCategory");
  if (saved) {
    const sel = document.getElementById("categoryFilter");
    if ([...sel.options].some(o => o.value === saved)) {
      sel.value = saved;
    }
  }
}

// ---- UI helpers ----
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))].sort();

  select.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });

  // restore last selected filter if available
  restoreSelectedCategory();
}

function showRandomQuote() {
  const filter = document.getElementById("categoryFilter").value;
  const pool = filter === "all" ? quotes : quotes.filter(q => q.category === filter);

  const display = document.getElementById("quoteDisplay");
  if (pool.length === 0) {
    display.textContent = "No quotes available for this category.";
    return;
  }
  const random = pool[Math.floor(Math.random() * pool.length)];
  display.textContent = `"${random.text}" — [${random.category}]`;
}

function filterQuotes() {
  const filter = document.getElementById("categoryFilter").value;
  saveSelectedCategory(filter);
  showRandomQuote();
}

// ---- Add Quote ----
function createAddQuoteForm() {
  const container = document.getElementById("addQuoteContainer");
  container.innerHTML = ""; // clear old form if any

  const form = document.createElement("form");
  form.id = "addQuoteForm";

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";
  textInput.required = true;

  const catInput = document.createElement("input");
  catInput.id = "newQuoteCategory";
  catInput.type = "text";
  catInput.placeholder = "Enter quote category";
  catInput.required = true;

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Add Quote";

  form.append(textInput, catInput, submitBtn);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addQuote();
  });

  container.appendChild(form);
  return form;
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }
  quotes.push({ text, category });
  saveQuotes();
  populateCategories();

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added!");
}

// ---- Export / Import ----
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function isValidQuoteObject(o) {
  return o && typeof o.text === "string" && typeof o.category === "string";
}

function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("not-array");
      const cleaned = imported.filter(isValidQuoteObject);
      if (cleaned.length === 0) throw new Error("empty-or-bad");
      quotes.push(...cleaned);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON format. Expect an array of { text, category }.");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

// ---- Init ----
(function init() {
  loadQuotes();
  populateCategories();
  createAddQuoteForm();
  showRandomQuote();
})();
