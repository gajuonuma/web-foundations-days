const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

const DRAFT_KEY = "quicknotes-draft";
const THEME_KEY = "quicknotes-theme";

function updateCounts() {
    const text = noteText.value;
    const characterCount = text.length;

    const trimmedText = text.trim();

    const words = trimmedText === ""
        ? []
        : trimmedText.split(/\s+/);

    const numberOfWords = words.length;

    charCount.textContent = `${characterCount} / 200 characters`;
    wordCount.textContent = `${numberOfWords} words`;

    charCount.classList.remove("warning", "over");

    if (characterCount > 200) {
        charCount.classList.add("over");
    } else if (characterCount > 180) {
        charCount.classList.add("warning");
    }
}

function saveDraft() {
    localStorage.setItem(DRAFT_KEY, noteText.value);
}

function clearNote() {
    noteText.value = "";

    updateCounts();

    localStorage.removeItem(DRAFT_KEY);
}

function setTheme(isDark) {
    document.body.classList.toggle("dark", isDark);

    if (isDark) {
        themeToggle.textContent = "Light mode";
        localStorage.setItem(THEME_KEY, "dark");
    } else {
        themeToggle.textContent = "Dark mode";
        localStorage.setItem(THEME_KEY, "light");
    }
}

noteText.addEventListener("input", function() {
    updateCounts();
    saveDraft();
});

clearBtn.addEventListener("click", function() {
    clearNote();
});

noteText.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        clearNote();
    }
});

themeToggle.addEventListener("click", function() {
    const isDark = !document.body.classList.contains("dark");

    setTheme(isDark);
});

const savedDraft = localStorage.getItem(DRAFT_KEY);

if (savedDraft !== null) {
    noteText.value = savedDraft;
}

const savedTheme = localStorage.getItem(THEME_KEY);

if (savedTheme === "dark") {
    setTheme(true);
} else {
    setTheme(false);
}

updateCounts();