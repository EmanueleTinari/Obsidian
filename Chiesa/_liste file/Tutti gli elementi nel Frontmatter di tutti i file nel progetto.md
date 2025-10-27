---
creato: 05/05/2025 00:11:22
modificato: 09/07/2025 00:16:22
---

```dataviewjs
// Store an alias for long function name
const listProp = Object.getOwnPropertyNames

// Get frontmatter from every page having one
const allMatter =
  dv.pages()
    .where(p => listProp(p.file.frontmatter).length > 0)
    .file.frontmatter
   
// Loop all of the frontmatter, and count all fields
let fieldList = {}
for (let frontmatter of allMatter) {

  // For each frontmatter section, list and count each field
  for (let field of listProp(frontmatter)) {
    // console.log(field)
    if (field in fieldList) {
       fieldList[field] += 1
    } else {
       fieldList[field] = 1
    }
  }
}

// Build an ordinary array out of the dictionary
let fieldCounts = []
for (let key in fieldList) {
   fieldCounts.push([key, fieldList[key]])
}

// Sort the array for display purposes
fieldCounts = fieldCounts.sort((a, b) => a[1] - b[1])
// console.log(fieldCounts)

// Present the final table of all fields found in
// frontmatter, with the most frequently used fields
// at the end of the table
dv.table(["name", "count"],
         dv.array(fieldCounts)
           .map(m => [m[0], m[1]])
    )

```



```dataview
table file.frontmatter
where file.frontmatter and title
```