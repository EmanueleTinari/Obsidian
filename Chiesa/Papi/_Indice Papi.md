---
creato: 03-05-2025T07:31:21
aggiornato: 04-05-2025T08:50:24
---
<!--  (!= this.file.name) esclude questo stesso file dalla lista -->
```dataview 
TABLE rows.file.link as File
FROM "Papi"
WHERE file.name != this.file.name
FLATTEN regexreplace(file.folder, ".*/", "") as lastPart
GROUP BY lastPart as Lista
SORT lastPart
```