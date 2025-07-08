---
creato: 18/05/2025 23:27:49
aggiornato: 2025-05-19T00:44:03
modificato: 09/07/2025 00:16:15
---



```dataviewjs

// --- Configuration ---
//const FOLDER_PREFIX = "Document"; // Case-sensitive prefix for folders to scan
const MIN_WORD_LENGTH = 3;      // Minimum length for a word to be included

// --- Helper Function to Extract Words ---
function getWordsFromText(text) {
    if (!text || typeof text !== 'string') {
        return [];
    }

    // Match sequences of letters, optionally with internal apostrophes.
    // Converts to lowercase.
    const wordsArray = text.toLowerCase().match(/\b[a-z']+\b/g);

    if (!wordsArray) {
        return [];
    }

    // Filter words:
    // - by minimum length
    // - ensure it's not purely numeric (though \b[a-z']+\b mostly handles this)
    // - ensure it contains at least one letter (redundant with regex but safe)
    return wordsArray.filter(word =>
        word.length >= MIN_WORD_LENGTH &&
        !/^\d+$/.test(word) && // Exclude pure numbers like "123"
        /[a-z]/.test(word)      // Ensure it has at least one letter
    );
}

// --- Main Logic ---
// 1. Get all pages that are in a folder starting with the FOLDER_PREFIX
const pagesToScan = dv.pages()
    .where(p => p.file && p.file.folder && p.file.folder.startsWith(FOLDER_PREFIX));

// 2. Create a map to store words and the files they appear in
//    Structure: wordMap = { "word1": Set<LinkObject>, "word2": Set<LinkObject>, ... }
const wordMap = new Map();

// 3. Process each page
for (const page of pagesToScan) {
    // Load the content of the page asynchronously
    const content = await dv.io.load(page.file.path);

    if (content) {
        const wordsInContent = getWordsFromText(content);
        // Use a Set to count each word only once per page for this specific map
        const uniqueWordsInPage = new Set(wordsInContent);

        for (const word of uniqueWordsInPage) {
            if (!wordMap.has(word)) {
                wordMap.set(word, new Set());
            }
            // Add the dataview file link object to the set for this word
            wordMap.get(word).add(dv.fileLink(page.file.path));
        }
    }
}

// 4. Prepare data for the table
const resultData = [];
// Sort words alphabetically for a consistent and readable output
const sortedUniqueWords = Array.from(wordMap.keys()).sort();

for (const word of sortedUniqueWords) {
    const fileLinksSet = wordMap.get(word);
    // Convert the Set of file links to an Array.
    // Sort the file links by their path for consistent order within each cell.
    const sortedFileLinksArray = Array.from(fileLinksSet).sort((linkA, linkB) => {
        // dv.fileLink() creates Link objects which have a 'path' property
        if (linkA.path && linkB.path) {
            return linkA.path.localeCompare(linkB.path);
        }
        return 0; // Fallback, though Link objects should always have a path
    });
    resultData.push([word, sortedFileLinksArray]);
}

// 5. Display the table
if (resultData.length > 0) {
    dv.table(["Unique Word", "Found In Files"], resultData);
} else {
    dv.paragraph(`No unique words (meeting criteria) found in notes within directories starting with "${FOLDER_PREFIX}".`);
}
```