---
creato: 18/06/2025 18:56:48
modificato: 09/07/2025 00:14:22
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
