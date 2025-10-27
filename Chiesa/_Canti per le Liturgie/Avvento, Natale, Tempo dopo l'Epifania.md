---
creato: 08/07/2025 08:29:08
modificato: 09/07/2025 00:09:55
---

```dataview

TABLE WITHOUT ID
	link(file.name) AS Titolo
FROM
	"_Canti per le Liturgie/Tutti i canti"
WHERE
	contains(tempo, "Avvento")
	OR
	contains(tempo, "Natale")
	OR
	contains(tempo, "Tempo dopo l’Epifania")
	AND
	startswith(file.folder, "_Canti per le Liturgie/Tutti i canti")
	AND
	!startswith(file.name, "_")
SORT data-doc ASC

```
