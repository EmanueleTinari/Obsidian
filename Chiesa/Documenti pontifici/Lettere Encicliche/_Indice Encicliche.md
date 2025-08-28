---
creato: 2025/05/03 17:11:52
modificato: 2025/08/28 22:30:54
---


```dataview
TABLE WITHOUT ID
	autore-doc AS Autore,
	dateformat(data-doc, "dd MMMM yyyy") AS Data,
	titolo-doc AS Titolo,
	link(file.name) AS File
FROM
	"Documenti pontifici/Lettere Encicliche"
WHERE
	!startswith(file.name, "_")
SORT data-doc ASC
```
