---
creato: 03-05-2025T14:26:49
aggiornato: 07-05-2025T22:20:58
---
```dataviewjs
// console.log(app.plugins)
// console.log(app.plugins.enabledPlugins)

const plugins = dv.array(Object.values(app.plugins.manifests))
  .sort(p => p.name)
  .map(p => [p.name, p.id, p.description, app.plugins.enabledPlugins.has(p.id) ])
  
dv.table(["Nome", "ID", "Descrizione", "Abilitato"], plugins)
```


