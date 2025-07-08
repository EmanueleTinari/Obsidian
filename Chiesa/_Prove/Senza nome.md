---
aggiornato: 2025-05-19T23:45:56
creato: 18/05/2025 23:50:38
modificato: 09/07/2025 00:16:15
---


```dataviewjs
// --- Configuration ---

// Case-sensitive prefix for folders to scan
const folderPrefix = "Document";
// Case-sensitive prefix for files to exclude
const excludedPrefix = "_";
// Minimum length for a word to be included
const minWordLenght = 3;
// Folder where the output files will be created
const outputFolder = "Vocaboli";
// File to track already scanned files
const alreadyScannedFiles = "already_scanned.md";



// --- Helper Functions ---
function getWordsFromText(text) {
    if (!text || typeof text !== 'string') {
        return [];
    }
    const wordsArray = text.toLowerCase().match(/\b[a-z']+\b/g);
    if (!wordsArray) {
        return [];
    }
    return wordsArray.filter(word =>
        word.length >= minWordLenght &&
        !/^\d+$/.test(word) &&
        /[a-z]/.test(word)
    );
}

// --- File Management Functions ---
async function ensureFolderExists(folderPath) {
    const adapter = app.vault.adapter;
    try {
        const folderExists = await adapter.exists(folderPath);
        if (folderExists) {
            const stat = await adapter.stat(folderPath);
            if (stat.type === 'folder') {
                return true;
            } else {
                console.error(`"${folderPath}" exists but is a file, not a folder.`);
                new Notice(`Error: "${folderPath}" is a file. Expected a folder.`);
                return false;
            }
        } else {
            await adapter.mkdir(folderPath);
            console.log(`Successfully created folder "${folderPath}".`);
            return true;
        }
    } catch (error) {
        console.error(`Error ensuring folder "${folderPath}" exists:`, error);
        new Notice(`Failed to ensure folder "${folderPath}". Check console.`);
        return false;
    }
}

async function getAlreadyScannedFiles() {
    const filePath = `${outputFolder}/${alreadyScannedFiles}`;
    try {
        // Check if TFile is defined
        if (typeof TFile === 'undefined') {
            console.error("TFile is not defined in this environment. Cannot reliably check file type.");
            // Fallback or error handling if TFile is not available
        }

        const abstractFile = app.vault.getAbstractFileByPath(filePath);
        if (abstractFile instanceof TFile) { // This is the line that might cause "TFile is not defined"
            const content = await app.vault.read(abstractFile);
            return new Set(content.split("\n").map(line => line.trim()).filter(line => line !== ""));
        } else if (abstractFile === null) { // File does not exist
            console.log(`File "${filePath}" not found. Assuming no files have been scanned yet.`);
            return new Set();
        } else { // It exists but is not a TFile (e.g., a TFolder)
            console.warn(`"${filePath}" exists but is not a regular file. Assuming no files have been scanned yet.`);
            return new Set();
        }
    } catch (e) {
        console.log(`Error reading "${filePath}". Assuming no files have been scanned yet.`, e);
        return new Set();
    }
}

async function writeDataToFile(filePath, content) {
    try {
        const abstractFile = app.vault.getAbstractFileByPath(filePath);
        if (abstractFile instanceof TFile) {
            await app.vault.modify(abstractFile, content);
        } else if (abstractFile === null) { // File does not exist, create it
            await app.vault.create(filePath, content);
        } else { // Path exists but is a folder
             console.error(`Cannot write to "${filePath}" as it is a folder.`);
             new Notice(`Error: Cannot write to "${filePath}", it's a folder.`);
             return false;
        }
        console.log(`Successfully wrote to "${filePath}".`);
        return true;
    } catch (e) {
        console.error(`Failed to write to "${filePath}":`, e);
        new Notice(`Failed to write to "${filePath}". Check console for details.`);
        return false;
    }
}

async function writeAlreadyScannedFiles(filesSet) {
    const filePath = `${outputFolder}/${alreadyScannedFiles}`;
    const content = Array.from(filesSet).sort().join("\n");
    await writeDataToFile(filePath, content);
}

async function writeWordsToLetterFile(letter, wordsSet) {
    const filePath = `${outputFolder}/${letter}.md`;
    const content = Array.from(wordsSet).sort().join("\n");
    await writeDataToFile(filePath, content);
}

// --- Main Logic ---
(async () => {
    // Debug: Check if TFile is available
    if (typeof TFile === 'undefined') {
        console.error("CRITICAL: TFile is undefined in the DataviewJS environment. File operations might fail. Please check your Obsidian and Dataview setup.");
        new Notice("CRITICAL: TFile is undefined. Check console.", 5000);
        // Depending on severity, you might want to return early
    }

    dv.paragraph("Starting word extraction process...");

    // 1. Ensure the output folder exists
    if (!await ensureFolderExists(outputFolder)) {
        dv.paragraph(`Failed to create or access folder "${outputFolder}". Aborting.`);
        return;
    }

    // 2. Load the list of already scanned files
    let alreadyScanned = await getAlreadyScannedFiles();

    // 3. Prompt the user to rescan or not
    const shouldRescan = confirm("Do you want to rescan all files? (Press OK for Yes, Cancel for No to scan only new files.)");

    if (shouldRescan) {
        console.log("Rescanning all files.");
        new Notice("Rescanning all files.", 3000);
        alreadyScanned = new Set(); // Clear the set
        // Clear existing letter files
        for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode(97 + i); // a, b, c, ...
            await writeWordsToLetterFile(letter, new Set()); // Clear the file
        }
        // Clear the already_scanned.md file as well
        await writeDataToFile(`${outputFolder}/${alreadyScannedFiles}`, "");
    } else {
        console.log("Scanning only new files.");
        new Notice("Scanning only new files.", 3000);
    }

    // 4. Get all pages that are in a folder starting with the folderPrefix
    //    and exclude files starting with "_"
    const pagesToConsider = dv.pages()
        .where(p => p.file &&
                     p.file.folder &&
                     p.file.folder.startsWith(folderPrefix) &&
                     !p.file.name.startsWith('_'));

    // 5. Filter out already scanned files (if not rescanning)
    const filesToScan = shouldRescan ? pagesToConsider : pagesToConsider.filter(p => !alreadyScanned.has(p.file.path));

    if (filesToScan.length === 0) {
        dv.paragraph(shouldRescan ? "No files found to scan in specified directories." : "No new files to scan.");
        // Still update already_scanned.md if we didn't rescan, in case it was empty or needs creation
        if (!shouldRescan) await writeAlreadyScannedFiles(alreadyScanned);
        return;
    }
    new Notice(`Found ${filesToScan.length} files to process.`, 3000);

    // 6. Create a map to store words for each letter
    //    Structure: wordMap = { "a": Set<"word1", "word2">, "b": Set<...>, ... }
    const wordMapByLetter = new Map();
    for (let i = 0; i < 26; i++) {
        wordMapByLetter.set(String.fromCharCode(97 + i), new Set());
    }

    // 7. Process each page
    let processedFileCount = 0;
    for (const page of filesToScan) {
        try {
            const abstractFile = app.vault.getAbstractFileByPath(page.file.path);
            if (abstractFile instanceof TFile) { // Check if it's a file
                const content = await app.vault.read(abstractFile);

                if (content) {
                    // Exclude content within YAML frontmatter
                    const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---\s*/m, "");

                    const wordsInContent = getWordsFromText(contentWithoutFrontmatter);

                    for (const word of wordsInContent) {
                        const firstLetter = word.charAt(0).toLowerCase();
                        if (wordMapByLetter.has(firstLetter)) {
                            wordMapByLetter.get(firstLetter).add(word);
                        }
                    }
                    alreadyScanned.add(page.file.path);
                    processedFileCount++;
                }
            } else {
                console.warn(`Skipping "${page.file.path}" as it's not a regular file or TFile is undefined.`);
            }
        } catch (e) {
            console.error(`Error processing file "${page.file.path}":`, e);
            new Notice(`Error processing file "${page.file.path}". Check console.`, 5000);
        }
    }

    // 8. Write words to separate files
    if (processedFileCount > 0 || shouldRescan) { // Only write if new words were processed or if rescanning (to clear files)
        for (const [letter, wordsSet] of wordMapByLetter) {
            // If not rescanning, we need to load existing words and merge
            if (!shouldRescan) {
                const existingLetterFilePath = `${outputFolder}/${letter}.md`;
                const existingAbstractFile = app.vault.getAbstractFileByPath(existingLetterFilePath);
                if (existingAbstractFile instanceof TFile) {
                    const existingContent = await app.vault.read(existingAbstractFile);
                    existingContent.split("\n").map(line => line.trim()).filter(line => line !== "").forEach(word => wordsSet.add(word));
                }
            }
            await writeWordsToLetterFile(letter, wordsSet);
        }
    }

    // 9. Update the list of already scanned files
    await writeAlreadyScannedFiles(alreadyScanned);

    dv.paragraph(`Word extraction complete. ${processedFileCount} files processed. Check the "${outputFolder}" folder for the results.`);
    new Notice("Word extraction complete!", 5000);
})();
```
