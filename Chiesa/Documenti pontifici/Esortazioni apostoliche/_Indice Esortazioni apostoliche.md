---
creato: 2025/06/16 08:37:29
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
	"Documenti pontifici/Esortazioni apostoliche"
WHERE
	file.name != this.file.name
SORT data-doc ASC
```
