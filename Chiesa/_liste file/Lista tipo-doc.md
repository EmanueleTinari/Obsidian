---
creato: 2025-05-15T10:43:38
aggiornato: 2025-05-15T11:46:03
---
```dataview
LIST WITHOUT ID
FROM "Documenti *"
FLATTEN tipo-doc AS Tipo
GROUP BY tipo-doc
```
