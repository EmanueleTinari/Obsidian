---
creato: 2025-05-15T10:43:38
aggiornato: 2025-05-15T11:46:03
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
