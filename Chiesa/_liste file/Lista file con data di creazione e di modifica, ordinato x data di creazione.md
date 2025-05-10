---
creato: 02-05-2025T15:49:08
aggiornato: 09-05-2025_21:14:51
---
```dataview
TABLE dateformat(file.ctime, "dd-MM-yyyy_HH:mm:ss") AS "Creato", dateformat(file.mtime, "dd-MM-yyyy_HH:mm:ss") AS "Ultimo aggiornamento"
FROM ""
SORT file.ctime ASC
```