let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation", updatedAt: Date.now() },
  { text: "Success is not in what you have, but who you are.", category: "Success", updatedAt: Date.now() },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Life", updatedAt: Date.now() }
];

// ---------- Local Storage ----------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) quotes = JSON.parse(storedQuotes);
}

// ---------- Display Quote ----------
function displayQuote(quote) {
  document.getElementById("quoteDisplay").innerHTML =
    `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;

  // Save last viewed quote to sessionStorage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// ---------- Populate Categories ----------
function populateCategories() {
  let menu = document.querySelector('#categoryFilter');
  menu.innerHTML = '<option value="all">All Categories</option>'; // reset first

  let categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    let option = document.createElement('option');
    option.value = cat;
    option.innerText = cat;
    menu.append(option);
  });

  // restore last selected filter
  const lastFilter = localStorage.getItem("selectedCategory");
  if (lastFilter) {
    menu.value = lastFilter;
  }
}

// ---------- Filtering ----------
function filterQuotes() {
  const selected = document.querySelector("#categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  let filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = `<p>No quotes in this category.</p>`;
  } else {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    let random = filtered[randomIndex];
    displayQuote(random); // display & save to sessionStorage
  }
}

// ---------- Show Random Quote ----------
function showRandomQuote() {
  filterQuotes(); // reuse filter logic
}

// ---------- Add New Quote ----------
function createAddQuoteForm() {
  let newText = document.getElementById('newQuoteText').value.trim();
  let newCategory = document.getElementById('newQuoteCategory').value.trim();

  if (!newText || !newCategory) {
    alert("⚠️ Please fill in both fields.");
    return;
  }

  quotes.push({ text: newText, category: newCategory, updatedAt: Date.now() });
  saveQuotes();
  populateCategories();

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  alert("✅ New quote added!");
}

// ---------- Import / Export ----------
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes.map(q => ({ ...q, updatedAt: Date.now() })));
      saveQuotes();
      populateCategories();
      alert("✅ Quotes imported successfully!");
    } catch (e) {
      alert("❌ Invalid JSON file");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ---------- Simulated Server Sync ----------
function syncWithServer() {
  let serverQuotes = JSON.parse(localStorage.getItem("serverQuotes") || "[]");

  // merge local + server (resolve conflicts by latest updatedAt)
  let merged = {};
  [...quotes, ...serverQuotes].forEach(q => {
    let key = q.text + "::" + q.category;
    if (!merged[key] || q.updatedAt > merged[key].updatedAt) {
      merged[key] = q;
    }
  });

  quotes = Object.values(merged);

  // save to both storages
  localStorage.setItem("serverQuotes", JSON.stringify(quotes));
  saveQuotes();
  populateCategories();

  alert("🔄 Sync complete! Local and server data merged.");
}

// ---------- Init ----------
loadQuotes();
populateCategories();

// Restore last viewed quote from sessionStorage
const lastViewed = sessionStorage.getItem("lastViewedQuote");
if (lastViewed) {
  displayQuote(JSON.parse(lastViewed));
} else {
  filterQuotes(); // fallback if none stored
}

