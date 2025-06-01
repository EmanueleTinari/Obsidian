---
creato: 2025-05-06T09:01:07
aggiornato: 2025-05-11T01:23:20
---
```dataviewjs
const fm = Object.entries(await dv.page("").file.frontmatter)
  .filter(obj => obj[0] != "Tags" )
  
dv.table(["Field", "Value"], fm)
```