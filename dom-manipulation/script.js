let quotes = [];

// Load quotes from localStorage or defaults
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    quotes = JSON.parse(stored);
  } else {
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Success is not in what you have, but who you are.", category: "Success" },
      { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Life" }
    ];
  }
  populateCategories();
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  const filter = document.getElementById("categoryFilter").value;
  let filtered = quotes;

  if (filter !== "all") {
    filtered = quotes.filter(q => q.category === filter);
  }

  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").textContent = "No quotes available for this category.";
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById("quoteDisplay").textContent = `"${random.text}" — [${random.category}]`;
}

// Populate categories dynamically
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  // Reset dropdown
  select.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  // Restore last selected filter
  const lastFilter = localStorage.getItem("lastFilter");
  if (lastFilter && [...select.options].some(o => o.value === lastFilter)) {
    select.value = lastFilter;
  }
}

// Filter quotes
function filterQuotes() {
  const filter = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastFilter", filter); // remember last filter
  showRandomQuote();
}

// Add a new quote
function createAddQuoteForm() {
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

// Export quotes to JSON
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

// Import quotes from JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes = imported;
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error reading JSON file.");
    }
  };
  reader.readAsText(file);
}

// ---------------- SERVER SYNC LOGIC ----------------

// Simulated server (just an array for demo)
let serverQuotes = [
  { text: "Stay hungry, stay foolish.", category: "Life" },
  { text: "Dream big and dare to fail.", category: "Motivation" }
];

// Simulate server sync
function syncWithServer() {
  document.getElementById("statusMessage").textContent = "Syncing with server...";

  setTimeout(() => {
    // Merge logic: server wins if conflict
    const serverSet = new Map(serverQuotes.map(q => [q.text, q]));

    // Add/update server quotes into local
    quotes.forEach(localQ => {
      if (!serverSet.has(localQ.text)) {
        serverQuotes.push(localQ); // push missing local quotes to server
      }
    });

    // Final local = server’s version (server wins conflicts)
    quotes = [...serverQuotes];
    saveQuotes();
    populateCategories();

    document.getElementById("statusMessage").textContent = "Sync complete. Quotes updated!";
  }, 1000);
}

// Periodic auto-sync every 30s
setInterval(syncWithServer, 30000);

// ---------------- INIT ----------------
loadQuotes();
showRandomQuote();
