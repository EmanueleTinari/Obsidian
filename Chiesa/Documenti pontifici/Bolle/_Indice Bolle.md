---
creato: 2025-05-03T16:49:10
aggiornato: 2025-05-11T01:32:06
---
<!--  (!= this.file.name) esclude questo stesso file dalla lista -->
```dataview 
TABLE titolo-doc AS Titolo
FROM "Documenti pontifici/Bolle"
WHERE file.name != this.file.name
SORT Titolo
```