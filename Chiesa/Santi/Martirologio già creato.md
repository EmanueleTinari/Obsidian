---
creato: 2025/07/10 13:37:40
modificato: 2025/07/13 06:51:31
---
```dataview

TABLE WITHOUT ID
	link(file.name) AS File
FROM
	""
WHERE
	startswith(file.folder, "Santi")
	AND
	!startswith(file.name, "_")
	AND
	file.name != this.file.name
SORT mese ASC
```

