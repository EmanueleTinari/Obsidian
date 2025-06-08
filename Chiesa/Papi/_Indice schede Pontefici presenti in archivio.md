---
---

<!--  (!= .file.name) esclude questo stesso file dalla lista -->

```dataview 
TABLE
	regexreplace(rows.file.name, "Scheda ([0-9]{1,3})° papa - (.*)", "$2, $1° papa") AS Nome,
	rows.file.frontmatter.anno-elezione AS Inizio,
	rows.file.frontmatter.anno-fine AS Fine,
	link(rows.file.link, regexreplace(rows.file.name, "Scheda ([0-9]{1,3})° papa - ", "")) AS File
FROM
	"Papi"
WHERE
	file.name != this.file.name
	AND
		!startswith(file.name, "I sommi")
FLATTEN
	regexreplace(file.folder, ".*/", "") as lastPart
GROUP BY
	lastPart as Lista
SORT
	lastPart
```


