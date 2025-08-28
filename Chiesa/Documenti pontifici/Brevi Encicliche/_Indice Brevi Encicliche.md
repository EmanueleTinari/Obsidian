---
creato: 2025/08/28 22:14:04
modificato: 2025/08/28 22:22:25
---


```dataview

TABLE WITHOUT ID
	autore-doc AS Autore,
	dateformat(data-doc, "dd MMMM yyyy")	AS Data,
	titolo-doc AS Titolo,
	link(file.name) AS File
FROM
	"Documenti pontifici/Brevi Encicliche"
WHERE
	!startswith(file.name, "_")
SORT data-doc ASC
```
