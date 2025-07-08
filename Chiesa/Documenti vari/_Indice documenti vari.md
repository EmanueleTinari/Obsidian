---
creato: 03/05/2025 17:13:29
modificato: 09/07/2025 00:15:48
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
