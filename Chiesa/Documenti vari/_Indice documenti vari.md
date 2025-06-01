---
creato: 2025-05-03T16:49:10
aggiornato: 2025-05-11T01:20:52
---
<!--  (!= this.file.name) esclude questo stesso file dalla lista -->
```dataview 
TABLE titolo-doc AS Titolo
FROM "Documenti vari"
WHERE file.name != this.file.name
SORT Titolo
```
