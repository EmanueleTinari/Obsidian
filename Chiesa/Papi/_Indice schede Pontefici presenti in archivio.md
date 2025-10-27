---
creato: 2025/05/03 07:31:21
modificato: 2025/09/13 21:31:48
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
	rows.file.frontmatter.papa-numero ASC
```


