---
creato: 2025-05-02T15:49:08
aggiornato: 2025-05-11T01:24:10
---
```dataview
TABLE dateformat(file.ctime, "dd-MM-yyyy_HH:mm:ss") AS "Creato", dateformat(file.mtime, "dd-MM-yyyy_HH:mm:ss") AS "Ultimo aggiornamento"
FROM ""
SORT file.ctime ASC
```