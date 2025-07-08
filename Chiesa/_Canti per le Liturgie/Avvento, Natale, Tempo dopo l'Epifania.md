
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
