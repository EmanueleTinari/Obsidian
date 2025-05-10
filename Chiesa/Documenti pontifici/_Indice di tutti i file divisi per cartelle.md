---
creato: 03-05-2025T16:46:19
aggiornato: 03-05-2025T16:59:20
---
```dataview 
TABLE join(rows.file.link, " | ") as "File contenuti"
GROUP BY file.folder as "Cartelle"
```