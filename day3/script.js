let notes = [
    { id: 1, text: "Buy milk and bread", category: "personal" },
    { id: 2, text: "Finish the Day 3 assignment", category: "study" },
    { id: 3, text: "Email the project report to Grace", category: "work" },
    { id: 4, text: "Revise JavaScript arrays", category: "study" },
    { id: 5, text: "Call mum", category: "personal" }
];


// 1. Search notes
function searchNotes(word) {
    return notes.filter(function(note) {
        return note.text.toLowerCase().includes(word.toLowerCase());
    });
}

console.log(searchNotes("javascript"));
// Expected: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]

console.log(searchNotes("pizza"));
// Expected: []


// 2. Find the longest note
function longestNote() {
    if (notes.length === 0) {
        return null;
    }

    let longest = notes[0];

    for (let i = 1; i < notes.length; i++) {
        if (notes[i].text.length > longest.text.length) {
            longest = notes[i];
        }
    }

    return longest;
}

console.log(longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

let savedNotes = notes;
notes = [];

console.log(longestNote());
// Expected: null

notes = savedNotes;


// 3. Count notes by category
function countByCategory() {
    let counts = {};

    for (let note of notes) {
        if (counts[note.category] === undefined) {
            counts[note.category] = 0;
        }

        counts[note.category]++;
    }

    return counts;
}

console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

let savedNotesForCount = notes;
notes = [
    { id: 6, text: "One personal note", category: "personal" }
];

console.log(countByCategory());
// Expected: { personal: 1 }

notes = savedNotesForCount;


// 4. Get notes summary
function getSummary() {
    let counts = countByCategory();
    let total = notes.length;

    let noteWord = total === 1 ? "note" : "notes";

    return `${total} ${noteWord}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}

console.log(getSummary());
// Expected: 5 notes: 2 personal, 1 work, 2 study.

let savedNotesForSummary = notes;
notes = [
    { id: 6, text: "One personal note", category: "personal" }
];

console.log(getSummary());
// Expected: 1 note: 1 personal, 0 work, 0 study.

notes = savedNotesForSummary;


// 5. Check for duplicate notes
function isDuplicate(text) {
    let normalisedText = text.trim().toLowerCase();

    return notes.some(function(note) {
        return note.text.trim().toLowerCase() === normalisedText;
    });
}

console.log(isDuplicate("  call mum  "));
// Expected: true

console.log(isDuplicate("Go to the gym"));
// Expected: false


// 6. Add a new note
function addNote(text, category) {
    let trimmedText = text.trim();
    let validCategories = ["personal", "work", "study"];

    if (trimmedText.length < 1 || trimmedText.length > 200) {
        console.log("Note was not added: text must be between 1 and 200 characters.");
        return false;
    }

    if (isDuplicate(trimmedText)) {
        console.log("Note was not added: duplicate note.");
        return false;
    }

    if (!validCategories.includes(category)) {
        console.log("Note was not added: invalid category.");
        return false;
    }

    let newId = notes.length === 0
        ? 1
        : Math.max(...notes.map(function(note) {
            return note.id;
        })) + 1;

    notes.push({
        id: newId,
        text: trimmedText,
        category: category
    });

    console.log("Note added successfully.");
    return true;
}

console.log(addNote("Prepare for the JavaScript test", "study"));
// Expected: true

console.log(addNote("  Call mum  ", "personal"));
// Expected: false


// Additional addNote edge-case tests
console.log(addNote("", "personal"));
// Expected: false

console.log(addNote("This is a new note", "invalid"));
// Expected: false