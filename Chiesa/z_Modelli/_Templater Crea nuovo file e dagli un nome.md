
<%*

const folderOrFile = this.app.vault.getAbstractFileByPath('folderOrFile');
const NameAutoGenNewFile = app.vault.getAbstractFileByPath("Untitled.md");

console.log("const NameAutoGenNewFile: " + NameAutoGenNewFile);

const question1 = "Do you want to create a new note?";
console.log("const question1: " + question1);
const chose1 = tp.system.suggester(['Yes','No'],['Yes','No'], false, question1);
console.log("const chose1: " + chose1);
if (chose1 === 'Yes')
{
	console.log("const chose1: " + chose1);
}
else if (chose1 === 'No')
{
	console.log("const chose1: " + chose1);
	exit;
}

// Prompt
const NewFileName = await tp.system.prompt("Please insert new file name.");
// If no word is entered
//if (NewFileName) return;
console.log("const NewFileName(1): " + NewFileName)

// If new file name is null (user click X or Esc button)
if (NewFileName === null) {
	console.log("const NewFileName(2): " + NewFileName)
	// remove it
	await app.vault.trash(NameAutoGenNewFile, true);
	console.log("tmp file \"null\" removed!")
	return;
}
console.log("const NewFileName(3): " + NewFileName);

const folders = this.app.vault.getAllLoadedFiles().filter(i => i.children).map(folder => folder.path);
const folder = await tp.system.suggester(folders, folders);
console.log("const folder(4): " + folder);

const template = tp.file.find_tfile("Template_BOLLA").basename;
console.log("const template(5): " + template);

await tp.file.create_new(template, NewFileName, true, folder).basename;
//console.log("4");
// If all inputs are provided, move the file
await tp.file.move(folder + "/" + NewFileName);
//console.log("2");

tR += "---"
console.log("const tR(6): " + tR);

//tR = `---
//Publish date: ${dtPublish}
//---`
-%>

<% tp.file.cursor(1) %>




