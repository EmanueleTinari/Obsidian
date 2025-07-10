---
creato: 2025/06/18 18:56:48
modificato: 2025/07/09 23:33:01
---

<!--  (!= this.file.name) esclude questo stesso file dalla lista -->
```dataview

TABLE WITHOUT ID
	veggente AS Veggente,
	dateformat(data-mess, "dd-MM-yyyy")	AS Data,
	link(file.name) AS File
FROM
	""
WHERE
	startswith(file.folder, "Messaggi")
	AND
	!startswith(file.name, "_")
SORT data-mess ASC
```
