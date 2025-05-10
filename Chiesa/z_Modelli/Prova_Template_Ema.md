---
creato: 03-05-2025T22:21:34
aggiornato: 10-05-2025_05:51:45
---
```javascript
<%*
// Prompt

const folderOrFile = this.app.vault.getAbstractFileByPath('folderOrFile');

const NomeNuovoFileAutoGenerato = app.vault.getAbstractFileByPath("Untitled.md");
console.log("const NomeNuovoFileAutoGenerato: " + NomeNuovoFileAutoGenerato)
// Prompt
const NomeDelFile = await tp.system.prompt("Inserire il nome del file");

// If no word is entered
//if (NomeDelFile) return;
console.log("const NomeDelFile(1): " + NomeDelFile)


// Se il nome del nuovo file è nullo (viene premuta la X di uscita o il tasto Esc)
if (NomeDelFile === null) {
	console.log("const NomeDelFile(2): " + NomeDelFile)
	// Lo elimina
	await app.vault.trash(NomeNuovoFileAutoGenerato, true);
	console.log("File temporaneo \"null\" eliminato")
	return;
}
console.log("const NomeDelFile(3): " + NomeDelFile);

const folders = this.app.vault.getAllLoadedFiles().filter(i => i.children).map(folder => folder.path);
const folder = await tp.system.suggester(folders, folders);
console.log("const folder(4): " + folder); 

const template = tp.file.find_tfile("Template_BOLLA").basename;
console.log("const template(5): " + template); 

await tp.file.create_new(template, NomeDelFile, true, folder).basename;
//console.log("4");
// If all inputs are provided, move the file
await tp.file.move(folder + "/" + NomeDelFile);
//console.log("2");

tR += "---"
console.log("const tR(6): " + tR);

//tR = `---
//Data di pubblicazione: ${dtPubblicazione}
//---`
-%>

<% tp.file.cursor(1) %>

```



