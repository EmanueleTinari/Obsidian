---
creato: 2025-05-02T16:55:24
aggiornato: 2025-05-10T21:37:28
---
<%*

const includedDirs = "Documenti";
const excludedFiles = "_";
const allFiles = await app.vault.getMarkdownFiles();
const myArray = [];

	function pushAlternative(path, basename) {
	  myArray.push({ path: path, basename: basename});
	}

	allFiles.map(file => {
		const fileCache = app.metadataCache.getFileCache(file);
		if (file.path.startsWith(includedDirs)){
			if (!file.basename.startsWith(excludedFiles)) {
				pushAlternative(file.path, file.basename);
			}
		}
	})
	const destination = await tp.system.suggester(item => item.basename, myArray, true, "Enter file");


-%>


