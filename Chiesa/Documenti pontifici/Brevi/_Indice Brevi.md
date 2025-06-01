---
creato: 2025-05-03T16:49:10
aggiornato: 2025-05-11T01:30:23
---
<!--  (!= this.file.name) esclude questo stesso file dalla lista -->
```dataview 
TABLE titolo-doc AS Titolo
FROM "Documenti pontifici/Brevi"
WHERE file.name != this.file.name
SORT Titolo
```