---
creato: 2025/06/16 14:57:26
modificato: 2025/08/28 22:24:29
---


```dataview
TABLE WITHOUT ID
	autore-doc AS Autore,
	dateformat(data-doc, "dd MMMM yyyy")	AS Data,
	titolo-doc AS Titolo,
	link(file.name) AS File
FROM
	"Documenti pontifici/Lettere apostoliche"
WHERE
	!startswith(file.name, "_")
SORT data-doc ASC
```
