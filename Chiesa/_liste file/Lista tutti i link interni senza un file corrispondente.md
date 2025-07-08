---
creato: 02/06/2025 22:55:15
modificato: 09/07/2025 00:16:22
---


```dataview
TABLE without id
out AS "File ancora da creare", file.link as "File di origine"
FLATTEN file.outlinks as out
WHERE !(out.file) AND !contains(meta(out).path, "/")
SORT out ASC
```

