<%*
// Insert a code block with language selection
const languages = [
	"javascript",
	"python",
	"java",
	"c",
	"cpp",
	"csharp",
	"php",
	"ruby",
	"go",
	"rust",
	"typescript",
	"bash",
	"sql",
	"html",
	"css",
	"json",
	"yaml",
	"markdown",
	"plaintext"];
// Sort the Array 
languages.sort();	
const language = await tp.system.suggester(languages, languages);
if (!language) return "";

return "```" + language + "\n\n```";
-%>
