let quotes = [];
let filteredCategory = "all";

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Success is not in what you have, but who you are.", category: "Success" },
      { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Life" }
    ];
    saveQuotes();
  }
  updateCategoryFilter();
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a quote
function displayQuote(quote) {
  document.getElementById("quoteDisplay").textContent = `"${quote.text}" — ${quote.category}`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// Show a random quote (with filter)
function showRandomQuote() {
  let availableQuotes =
    filteredCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category.toLowerCase() === filteredCategory.toLowerCase());

  if (availableQuotes.length === 0) {
    document.getElementById("quoteDisplay").textContent = "No quotes available for this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * availableQuotes.length);
  displayQuote(availableQuotes[randomIndex]);
}

// Filter quotes by category
function filterQuotes() {
  const filter = document.getElementById("categoryFilter").value;
  filteredCategory = filter;
  showRandomQuote();
}

// Update dropdown dynamically
function updateCategoryFilter() {
  const select = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map((q) => q.category))];

  select.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

// Add new quote
function createAddQuoteForm() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    updateCategoryFilter();
    alert("Quote added!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both text and category!");
  }
}

// Export quotes
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

// Import quotes
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        saveQuotes();
        updateCategoryFilter();
        showRandomQuote();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format");
      }
    } catch (err) {
      alert("Error reading JSON file");
    }
  };
  reader.readAsText(file);
}

// Sync with server (dummy placeholder)
function syncWithServer() {
  alert("Server sync feature not implemented yet.");
}

// Init on page load
window.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  const lastViewed = sessionStorage.getItem("lastViewedQuote");
  if (lastViewed) {
    displayQuote(JSON.parse(lastViewed));
  } else {
    showRandomQuote();
  }
});
