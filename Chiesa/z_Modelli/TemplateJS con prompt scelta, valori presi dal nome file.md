---
creato: 02-05-2025T16:55:24
aggiornato: 04-05-2025T15:10:16
---
```javascript
// Suggester for files
[[<% (await tp.system.suggester((item) => item.basename, app.vault.getMarkdownFiles())).basename %>]]
```
Esempi presi [qui:](https://silentvoid13.github.io/Templater/internal-functions/internal-modules/system-module.html)