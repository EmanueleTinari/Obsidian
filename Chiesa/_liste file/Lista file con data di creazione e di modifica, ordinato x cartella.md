---
creato: 02-05-2025T13:35:26
aggiornato: 04-05-2025T23:33:58
---
```dataview
TABLE file.folder AS "Cartella",
	titolo-doc AS "Eventuale titolo",
	dateformat(file.ctime, "dd-MM-yyyy - HH:mm") AS "Creato",
	dateformat(file.mtime, "dd-MM-yyyy - HH:mm") AS "Modificato"
FROM ""
SORT file.folder ASC
```
