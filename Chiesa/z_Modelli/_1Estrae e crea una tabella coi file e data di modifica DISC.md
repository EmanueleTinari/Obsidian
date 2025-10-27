<%*

// QUESTO TEMPLATE GENERA UNA TABELLA DI TUTTI I FILE PRESENTI
// IN UNA CARTELLA DI PARTENZA (MODIFICARE IN CASO LA VARIABILE folderPath)
// ESCLUDENDO EVENTUALMENTE TUTTE LE SOTTOCARTELLE CHE INIZIANO CON UN
// DETERMINATO PREFISSO (MODIFICARE IN CASO LA VARIABILE excludeFolder)
// E DELLA LORO DATA DI MODIFICA. L'ORDINAMENTO DEGLI STESSI FILE
// NELLA TABELLA È IN BASE ALLA DATA ED ORA DI MOFICICA
// IN MODO DISCENDENTE (DALL'ULTIMO AL PRIMO).



// Replace with your main folder path
const folderPath = "Documenti";
// Replace with the folder to exclude
const excludeFolder = "_";

const recentFiles = app.vault.getFiles()
    // Filter files within the specified folder and exclude the excluded folder
    .filter(file => file.path.startsWith(folderPath) && !file.path.startsWith(excludeFolder))
    // Sort by last modified time (descending)
    .sort((a, b) => b.stat.mtime - a.stat.mtime)

if (recentFiles.length === 0) {
    tR += "No valid published files found in the specified folder.";
}
else {
    let table = `| File Name | Last Modified |\n`;
    table += `| --- | --- |\n`;

    for (const file of recentFiles) {
        const fileName = file.basename;
        // Format as readable date
        const lastModified = new Date(file.stat.mtime).toLocaleString();
        table += `| [[${fileName}]] | ${lastModified} |\n`;
    }
	// Return the final table
    tR += table;
}
%>