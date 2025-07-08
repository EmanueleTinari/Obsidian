---
creato: 08/07/2025 08:08:21
modificato: 09/07/2025 00:10:02
---

```dataview

TABLE WITHOUT ID
	link(file.name) AS Titolo
FROM
	"_Canti per le Liturgie/Tutti i canti"
WHERE
	contains(tempo, "Tempo di Pasqua")
	AND
	startswith(file.folder, "_Canti per le Liturgie/Tutti i canti")
	AND
	!startswith(file.name, "_")
SORT data-doc ASC

```
