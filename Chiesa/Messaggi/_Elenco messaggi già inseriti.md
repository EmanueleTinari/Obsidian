---
creato: 2025/06/18 18:56:48
modificato: 2025/08/28 22:38:07
---


```dataview

TABLE WITHOUT ID
	veggente AS Veggente,
	dateformat(data-mess, "dd MMMM yyyy")	AS Data,
	link(file.name) AS File
FROM
	""
WHERE
	startswith(file.folder, "Messaggi")
	AND
	!startswith(file.name, "_")
SORT data-mess ASC
```
