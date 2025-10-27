---
creato: 06/05/2025 09:01:07
modificato: 09/07/2025 00:16:22
---

```dataviewjs
const fm = Object.entries(await dv.page("").file.frontmatter)
  .filter(obj => obj[0] != "Tags" )
  
dv.table(["Field", "Value"], fm)
```