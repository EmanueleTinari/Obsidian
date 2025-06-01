---
creato: 2025-05-03T07:31:21
aggiornato: 2025-05-10T21:40:20
---
<!--  (!= this.file.name) esclude questo stesso file dalla lista -->
```dataview 
TABLE rows.file.link as File
FROM "Papi"
WHERE file.name != this.file.name AND !startswith(file.name, "I sommi")
FLATTEN regexreplace(file.folder, ".*/", "") as lastPart
GROUP BY lastPart as Lista
SORT lastPart
```