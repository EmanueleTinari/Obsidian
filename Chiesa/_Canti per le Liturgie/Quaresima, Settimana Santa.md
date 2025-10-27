---
creato: 08/07/2025 08:31:50
modificato: 09/07/2025 00:09:58
---

```dataview

TABLE WITHOUT ID
	link(file.name) AS Titolo
FROM
	"_Canti per le Liturgie/Tutti i canti"
WHERE
	contains(tempo, "Quaresima")
	OR
	contains(tempo, "Settimana Santa")
	AND
	startswith(file.folder, "_Canti per le Liturgie/Tutti i canti")
	AND
	!startswith(file.name, "_")
SORT data-doc ASC

```
