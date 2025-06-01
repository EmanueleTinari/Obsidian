<%*
try {  
	var manufacturer = await tp.system.prompt("Manufacturer");  
}
catch {  
	/_Don't die if user cancels prompt_/  
}  
if (manufacturer === null) manufacturer = "Manufacturer";  
try {  
	var model = await tp.system.prompt("Model");  
}
catch {  
	/_Don't die if user cancels prompt_/  
}  
if (model === null) model = "Model";  

/* Change the title/filename */  
const newTitle = `${manufacturer} ${model}`;  
await tp.file.rename(newTitle);  

// Let the user select the right tag  
const allTags = Object.entries(app.metadataCache.getTags());  
const filteredTags = allTags.filter(t => String(t[0]).startsWith("bol/")).sort( (a, b) => a[0].localeCompare(b[0]));  
const selectedTag = (await tp.system.suggester(t => t[0], filteredTags))[0];



-%>
---
tags:
  - <% selectedTag %>
Manufacturer:  <% manufacturer %>
Model: <% model %>
Charging Type: 
OS: 
Updated: 
---