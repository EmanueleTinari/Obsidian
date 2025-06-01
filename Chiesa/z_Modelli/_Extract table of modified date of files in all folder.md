---
creato: 2025-05-15T11:10:44
aggiornato: 2025-05-15T11:10:48
---

<%*
const folderPath = "Documenti"; // Replace with your main folder path
const excludeFolder = "_"; // Replace with the folder to exclude
const frontmatterKey = "tipo-doc"; // Key for the 'tipo-doc' metadata in frontmatter

const recentFiles = app.vault.getFiles()
    // Filter files within the specified folder and exclude the excluded folder
    .filter(file => file.path.startsWith(folderPath) && !file.path.startsWith(excludeFolder))
    // Sort by last modified time (descending)
    .sort((a, b) => b.stat.mtime - a.stat.mtime)

if (recentFiles.length === 0) {
    tR += "No valid published files found in the specified folder.";
} else {
    let table = `| File Name | Last Modified |\n`;
    table += `|-----------|----------------|\n`;

    for (const file of recentFiles) {
        const fileName = file.basename;
        const lastModified = new Date(file.stat.mtime).toLocaleString(); // Format as readable date
        table += `| [[${fileName}]] | ${lastModified} |\n`;
    }

    tR += table; // Return the final table
}
%>