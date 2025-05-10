---
creato: 04-05-2025T16:34:56
aggiornato: 05-05-2025T15:04:28
---


```dataview
TABLE WITHOUT ID
	file.folder AS "Cartella",
	file.link as "File",
	file.frontmatter AS "Proprietà"
FROM ""
WHERE file.frontmatter
	AND !startswith(file.name, "_")
	AND !startswith(file.name, "Lista")
	AND !startswith(file.path, "z_")
SORT file.name ASC
```
