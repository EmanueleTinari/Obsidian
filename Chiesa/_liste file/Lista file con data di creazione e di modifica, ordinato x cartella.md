---
creato: 2025-05-02T13:35:26
aggiornato: 2025-05-11T01:23:58
---
```dataview
TABLE file.folder AS "Cartella",
	titolo-doc AS "Eventuale titolo",
	dateformat(file.ctime, "dd-MM-yyyy - HH:mm") AS "Creato",
	dateformat(file.mtime, "dd-MM-yyyy - HH:mm") AS "Modificato"
FROM ""
SORT file.folder ASC
```
