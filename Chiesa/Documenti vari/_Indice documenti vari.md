---
creato: 2025/05/03 17:13:29
modificato: 2025/07/09 23:32:40
---

<!-- (!= this.file.name) esclude questo stesso file dalla lista -->
```dataview
TABLE WITHOUT ID
	autore-doc AS Autore,
	dateformat(data-doc, "dd-MM-yyyy")	AS Data,
	titolo-doc AS Titolo,
	link(file.name) AS File
FROM
	"Documenti vari"
WHERE
	file.name != this.file.name
SORT data-doc ASC
```
