---
creato: 03/05/2025 17:11:11
modificato: 09/07/2025 00:15:55
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
