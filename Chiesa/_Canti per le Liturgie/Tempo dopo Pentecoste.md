---
creato: 08/07/2025 08:00:21
modificato: 09/07/2025 00:10:06
---

```dataview

TABLE WITHOUT ID
	link(file.name) AS Titolo
FROM
	"_Canti per le Liturgie/Tutti i canti"
WHERE
	contains(tempo, "Tempo dopo Pentecoste")
	AND
	startswith(file.folder, "_Canti per le Liturgie/Tutti i canti")
	AND
	!startswith(file.name, "_")
SORT data-doc ASC

```
