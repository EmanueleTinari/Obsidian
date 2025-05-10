---
creato: 02-05-2025T13:09:09
aggiornato: 05-05-2025T10:25:27
---
```dataviewjs
const allTags = app.metadataCache.getTags()

dv.container.className += " multi-column-list-block"
dv.list(Object.keys(allTags).slice(0, 59))
```