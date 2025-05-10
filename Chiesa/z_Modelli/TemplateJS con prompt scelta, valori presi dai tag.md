---
creato: 02-05-2025T16:55:24
aggiornato: 04-05-2025T15:10:38
---
```javascript

// Suggester for tags
<% tp.system.suggester(item => item, Object.keys(app.metadataCache.getTags()).map(x => x.replace("#", ""))) %>
```
Esempi presi [qui:](https://silentvoid13.github.io/Templater/internal-functions/internal-modules/system-module.html)