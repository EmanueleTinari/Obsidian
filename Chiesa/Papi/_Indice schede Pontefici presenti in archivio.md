---
creato: 03/05/2025 07:31:21
modificato: 09/07/2025 00:11:28
---

<!--  (!= .file.name) esclude questo stesso file dalla lista -->

```dataview
TABLE
	rows.file.frontmatter.papa-numero AS "N°",
	link(rows.file.link, regexreplace(rows.file.name, "Scheda ([0-9]{1,3})° papa - ", "")) AS File,
	rows.file.frontmatter.anno-elezione AS "Inizio pontificato",
	rows.file.frontmatter.anno-fine AS "Fine pontificato"
FROM
	"Papi"
WHERE
	file.name != this.file.name
	AND
		!startswith(file.name, "I sommi")
	AND
		!startswith(file.name, "_")
FLATTEN
	regexreplace(file.folder, ".*/", "") as lastPart
GROUP BY
	lastPart as Lista
SORT
	"N°" ASC
```


