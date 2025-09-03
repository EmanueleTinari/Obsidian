---
creato: 2025/06/16 16:53:25
modificato: 2025/08/29 09:44:06
---


```dataview

TABLE WITHOUT ID
	stato AS Stato,
	autore-doc AS Autore,
	tipo-doc AS Tipo,
	dateformat(data-doc, "dd/MM/yyyy") AS Data,
	titolo-doc AS Titolo,
	link(file.name) AS File
FROM
	""
WHERE
	startswith(file.folder, "Documenti")
	AND
	!startswith(file.name, "_")
SORT data-doc ASC
```
