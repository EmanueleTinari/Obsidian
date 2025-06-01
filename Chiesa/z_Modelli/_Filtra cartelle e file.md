<%*
// Folder start with to include
const folder = 'Documenti';
// File prefix to exclude
const excludedPrefix = '_'
// Frontmatter Key to include
const key = 'lingua-doc';

const files = app.vault.getMarkdownFiles();
// inFolder'll contain all files extracted
const inFolder = new Array();
files.forEach((file) => {
	if( file.path.includes( folder ) &&  !file.path.includes( excludedPrefix )) {
		inFolder.push(file.basename)
	};
})

console.log(inFolder);
const inFolderSuggester = (await tp.system.suggester(((item) => item),inFolder, 1))
console.log(inFolderSuggester)

-%>
[[<% inFolderSuggester %>]]