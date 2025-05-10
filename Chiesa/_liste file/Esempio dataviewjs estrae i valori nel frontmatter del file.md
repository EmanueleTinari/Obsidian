---
creato: 06-05-2025T09:01:07
aggiornato: 06-05-2025T09:01:11
---
```dataviewjs
const fm = Object.entries(await dv.page("").file.frontmatter)
  .filter(obj => obj[0] != "Tags" )
  
dv.table(["Field", "Value"], fm)
```