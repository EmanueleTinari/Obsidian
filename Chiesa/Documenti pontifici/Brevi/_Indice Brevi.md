---
creato: 2025/05/03 17:11:11
modificato: 2025/07/09 23:32:33
---

<!--  (!= this.file.name) esclude questo stesso file dalla lista -->
```dataview

TABLE WITHOUT ID
	autore-doc AS Autore,
	data-doc AS Data,
	titolo-doc AS Titolo,
	link(file.name) AS File
FROM
	"Documenti pontifici/Brevi"
WHERE
	file.name != this.file.name
SORT data-doc ASC
```
