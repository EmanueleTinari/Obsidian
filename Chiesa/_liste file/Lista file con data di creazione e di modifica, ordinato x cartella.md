---
creato: 02/05/2025 13:35:26
modificato: 09/07/2025 00:16:22
---

```dataview
TABLE file.folder AS "Cartella",
	titolo-doc AS "Eventuale titolo",
	dateformat(file.ctime, "dd-MM-yyyy - HH:mm") AS "Creato",
	dateformat(file.mtime, "dd-MM-yyyy - HH:mm") AS "Modificato"
FROM ""
SORT file.folder ASC
```
