---
creato: 2025/08/28 01:38:47
modificato: 2025/11/13 00:35:12
---

```dataview
TABLE tipo-doc as tipo, titolo-doc AS "Eventuale titolo", dateformat(file.ctime, "dd-MM-yyyy_HH:mm:ss") AS "Creato", dateformat(file.mtime, "dd-MM-yyyy_HH:mm:ss") AS "Ultimo aggiornamento"
FROM ""
SORT file.ctime ASC
```