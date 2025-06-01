

```dataviewjs
// Replace with your main folder path
const folderPath          = 'Documenti';
// Replace with the folder or file to exclude
const excludeFolderOrFile = '_';
// Key for the 'tipo-doc' metadata in frontmatter
const frontmatterKey      = 'lingua-doc';

const filteredFiles = app.vault.getMarkdownFiles()
    // Filter files within the specified folder and exclude the excluded folder
    .filter(file => file.path.startsWith( folderPath ) &&
	    !file.path.startsWith( excludeFolderOrFile ) &&
	    !file.basename.startsWith( excludeFolderOrFile ))
    // Sort by last modified time (descending)
    .sort((a, b) => b, a)

if ( filteredFiles.length === 0 ) {
    log( 'No valid published files found in the specified folder.' );
}
log( filteredFiles );
function log( firstMsg, secondMsg ) {
	// use this if you specifically want to know if secondMsg was passed
    if ( secondMsg === undefined ) {
        // secondMsg was not passed
	    console.log( firstMsg );
    }
	else if ( secondMsg ) {
		console.log( firstMsg + ' :\n' + secondMsg );
	}
}
```