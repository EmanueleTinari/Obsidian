---
creato: 2025-05-02T16:55:24
aggiornato: 2025-05-10T21:37:09
---
```javascript
// Suggester for files
[[<% (await tp.system.suggester((item) => item.basename, app.vault.getMarkdownFiles())).basename %>]]
```
Esempi presi [qui:](https://silentvoid13.github.io/Templater/internal-functions/internal-modules/system-module.html)