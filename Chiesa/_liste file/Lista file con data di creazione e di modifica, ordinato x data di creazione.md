---
creato: 02/05/2025 15:49:08
modificato: 09/07/2025 00:16:22
---

```dataview
TABLE dateformat(file.ctime, "dd-MM-yyyy_HH:mm:ss") AS "Creato", dateformat(file.mtime, "dd-MM-yyyy_HH:mm:ss") AS "Ultimo aggiornamento"
FROM ""
SORT file.ctime ASC
```