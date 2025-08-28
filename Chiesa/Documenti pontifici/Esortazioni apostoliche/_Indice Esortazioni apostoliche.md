---
creato: 2025/06/16 08:37:29
modificato: 2025/08/28 22:30:24
---


```dataview
TABLE WITHOUT ID
	autore-doc AS Autore,
	dateformat(data-doc, "dd MMMM yyyy") AS Data,
	titolo-doc AS Titolo,
	link(file.name) AS File
FROM
	"Documenti pontifici/Esortazioni apostoliche"
WHERE
	!startswith(file.name, "_")
SORT data-doc ASC
```
