---
creato: 03/05/2025 01:54:16
modificato: 09/07/2025 00:16:22
---

```dataviewjs
// All tags sort by name
const allTags = Object.keys(app.metadataCache.getTags())
  .sort((a, b) => a.localeCompare(b))

const tagCount = allTags.length
// Define how many columns in a row
// and how many tags in each box
const colNum = 6
const rowCount = 30
const boxCount = Math.ceil(1.0 * tagCount / rowCount)
dv.header(2, "Tutti i Tag")
dv.paragraph(`Conteggio dei Tag: ${ tagCount }`)

for (let i = 0; i <= Math.ceil(boxCount / colNum); i++) {
  let content = `\n---\n> [!multi-column]\n`
  for (let j = 0; j <= colNum; j++ ) {
    const start = i * colNum * rowCount + j*rowCount
    let end = start + rowCount -1
    if (end > tagCount) end = tagCount - 1
    if (start < tagCount) {
      content += `>\n>> [!info]- <small>${allTags[start].substring(1) } – ${ allTags[end].substring(1) }</small>\n`
      // content += `>\n>> [!info]- Tag ${start } -- ${ end }\n`
      for (const tag of allTags.slice(start, end)) {
        content += `>> - ${ tag }\n`
      }
    }
  }
  dv.el('div', content )
}

```


```dataviewjs
let tags = dv.pages()
.flatMap(page => page.file.tags)
.groupBy(tag => tag)
.sort(tag => tag.rows.length, 'desc')
var temp = '';
for (let tag of tags) {
temp += ('\n' + tag.key + ' ' + tag.rows.length)
}
dv.span('>[!info]- Tag ordinati in base alla frequenza ' + temp)
```

## Usando i paragrafi (con #):

```dataviewjs
// Change to false to use H4
const useHighlight = true

// All tags sort by name
const allTags = Object.keys(app.metadataCache.getTags())
  .sort((a, b) => a.localeCompare(b))
 
const tagCount = allTags.length
// Define how many tag in each paragraph
const eachParagraph = 80
const paragraphs = Math.ceil(1.0 * tagCount / eachParagraph)
dv.header(3, "Tutti i Tag:")
dv.paragraph(`Conteggio dei Tag: ${ tagCount }`)

for (let i = 0; i <= paragraphs; i++) {
  const start = i * eachParagraph
  let end = start + eachParagraph -1
  if (end > tagCount) end = tagCount - 1
  if (start < tagCount) {
    if (useHighlight) {
      dv.paragraph(`==${allTags[start].substring(1) } – ${ allTags[end].substring(1) }==: `  + allTags.slice(start, end).join(", ")) 
    } else  {
      dv.header(4, `${allTags[start].substring(1) } – ${ allTags[end].substring(1) }`)
      dv.paragraph(allTags.slice(start, end).join(", "))
    }
  }
}
```



```dataviewjs
console.log("CON   # iniziale: " + Object.keys(app.metadataCache.getTags()).join(', '));
console.log("SENZA # iniziale: " + Object.keys(app.metadataCache.getTags()).map(x => x.slice(1)).join(', '));

```



## Usando i paragrafi (senza #):

```dataviewjs
// Change to false to use H4
const useHighlight = true

// All tags sort by name
const allTags = Object.keys(app.metadataCache.getTags())
  .sort((a, b) => a.localeCompare(b))
 
const tagCount = allTags.length
// Define how many tag in each paragraph
const eachParagraph = 80
const paragraphs = Math.ceil(1.0 * tagCount / eachParagraph)
dv.header(3, "Tutti i Tag:")
dv.paragraph(`Conteggio dei Tag: ${ tagCount }`)

for (let i = 0; i <= paragraphs; i++) {
  const start = i * eachParagraph
  let end = start + eachParagraph -1
  if (end > tagCount) end = tagCount - 1
  if (start < tagCount) {
    if (useHighlight) {
      dv.paragraph(`==${allTags[start].substring(1) } – ${ allTags[end].substring(1) }==: `  + allTags.slice(start, end).join(", ")) 
    } else  {
      dv.header(4, `${allTags[start].substring(1) } – ${ allTags[end].substring(1) }`)
      dv.paragraph(allTags.slice(start, end).join(", "))
    }
  }
}
console.log("CON   # iniziale: " + Object.keys(app.metadataCache.getTags()).join(', '));
console.log("SENZA # iniziale: " + Object.keys(app.metadataCache.getTags()).map(x => x.slice(1)).join(', '));


```


## Tutti i Tag in lista puntata:

```dataviewjs
dv.list(Object.keys(app.metadataCache.getTags()))
```