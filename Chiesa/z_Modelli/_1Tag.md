

<%*
// Replace with your main folder path
const folderPath = "Documenti";
// Replace with the folder to exclude
const excludeFolder = "_";
const exclude = "_";
const dv = app.plugins.plugins.dataview.api;
const allTags = Object.entries(app.metadataCache.getTags() )

    // How to filter only files in folder starting with given prefix
    // and exclude folder and files with given prefix ?

	.filter(
	    file => file.extension === 'md' &&
	    file.path.startsWith(folderPath) &&
	    !file.path.startsWith(exclude)
	    !file.basename.startsWith(exclude)
	)

	
	// Sorted alphabetically
   .sort(
	   (a, b) => a[0].localeCompare(b[0])
	)
	// Sorted related to frequency
	// .sort( (a, b) => b[1] - a[1], "desc" )

let selectMore = true
let selectedTags = []
while (selectMore) {

	// How to put two initial option:
	// End
	// Insert new tag
	// before filtered tags ?
	// IS there the possibility of stilyng 'End' word in RED
	// and 'Insert new tag' words in yellow (or other color) ?
	// In Elements I found below code that I think is what to stylish:
	// But how to stylish the 'Placeholder field' ?
	/*
	<div class="prompt-input-container">
	<input class="prompt-input" autocapitalize="off" spellcheck="false" enterkeyhint="done" type="text" placeholder="[Add a new Tag or select one or more existent Tag (Select End to terminate)] - ">
	<div class="prompt-input-cta"></div>
	<div class="search-input-clear-button"></div>
	</div>
	*/

	let choice = await tp.system.suggester( (t) => t[0] + "(" + t[1] + ")", allTags, false, "[Add a new Tag or select one or more existent Tag (Select End to terminate)] - " + selectedTags.join(", "))
	if ( choice === 'END' ) {
		selectMore = false
	}
	else if ( choice === 'Add new Tag' ) {
		const newTagValue = await tp.system.prompt('Insert a new tag in note:');
		if (newTagValue) {

		// How to add new tag value to the array ?

	    selectedTags.push(newTagValue[0]);
		}
	}
	else {
		// Add selected Tag to array
		selectedTags.push(choice[0])

		// AFTER adding selectedTags to array
		// HOW TO refresh tp.system.suggester excluded
		// selectedTags choose ? 
	}
}

tagDoc = "Tags: " + selectedTags.join(", ") 
-%>

<% tagDoc %>

