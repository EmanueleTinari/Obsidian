---
creato: 06-05-2025T07:13:10
aggiornato: 06-05-2025T07:35:33
---
<%_*
// Get the destination file
const allFiles = await app.vault.getMarkdownFiles()
// .slice(0, 10) // Uncomment for test purposes of a smaller file set

const alternatives = []

function pushAlternative(path, basename, alias) {
  alternatives.push({ path: path, basename: basename, alias: alias})
}

allFiles.map(file => {
  const fileCache = app.metadataCache.getFileCache(file);
  // Push non-aliased alternative
  file.alias = file.basename
  pushAlternative(file.path, file.basename, file.alias)
  // Use the following to check for existence, and type of alias
  const aliasType = typeof(fileCache.frontmatter?.aliases)
  
  if (aliasType == "string") {
    // Single alias
    file.alias = fileCache.frontmatter.aliases
    pushAlternative(file.path, file.basename, file.alias)
    
  } else if (aliasType == "object" && file.frontmatter?.aliases.length ) {
    // Multiple aliases
    for (const alias of fileCache.frontmatter.aliases ) {
      file.alias = alias
      pushAlternative(file.path, file.basename, file.alias)
    }
  }
})

const destination = await tp.system.suggester(
  item => item.basename + 
         (item.alias != item.basename ? `\n↳ ${ item.alias }` : ""),
  alternatives,
  true,
  "Enter file",
  10);

if (destination)
  tR += `[[${ destination.path } | ${ destination.alias }]]`
_%>