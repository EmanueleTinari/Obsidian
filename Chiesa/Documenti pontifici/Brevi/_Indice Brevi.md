---
creato: 03-05-2025T16:49:10
aggiornato: 04-05-2025T10:26:00
---
<!--  (!= this.file.name) esclude questo stesso file dalla lista -->
```dataview 
TABLE titolo-doc AS Titolo
FROM "Documenti pontifici/Brevi"
WHERE file.name != this.file.name
SORT Titolo
```