<%*


const dir = "Documenti";
const allFiles = await app.vault.getMarkdownFiles();
const myArray = [];
let propertyName = "tipo-doc" 
let uniqueProperties = [];

	function pushValues(path, basename) {
	  myArray.push({ path: path, basename: basename})
	}

	allFiles.map(file => {
		const fileCache = app.metadataCache.getFileCache(file);
		if (file.path.startsWith(dir)){
			if (!file.basename.startsWith('_')) {
				pushValues(file.path, file.basename);
				var myFile = (file.path + '\/' + file.basename);
				console.log("myFile var value: " + myFile);
				var a = tp.frontmatter.getFrontMatterInfo(myFile);
				console.log("a var value: " + a);
			}
		}
	})
	const destination = await tp.system.suggester(item => item.basename, myArray, true, "Enter file");


%>
