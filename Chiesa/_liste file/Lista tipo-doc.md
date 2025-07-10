---
creato: 15/05/2025 10:43:38
modificato: 09/07/2025 00:16:22
---

```dataview
LIST WITHOUT ID
FROM
	""
WHERE startswith(file.folder, "Documenti")
	AND
	file.name != this.file.folder
	AND
	file.name != startswith(file.name, "_")
FLATTEN
	tipo-doc AS Tipo
GROUP BY
	tipo-doc
```
