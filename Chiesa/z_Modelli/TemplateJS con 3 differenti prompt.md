---
creato: 02-05-2025T16:55:24
aggiornato: 04-05-2025T15:36:02
---
```javascript
// Prompt
<% tp.system.prompt("Please enter a value") %>
// Prompt with default value
<% tp.system.prompt("What is your mood today?", "happy") %>
// Multiline prompt
<% tp.system.prompt("What is your mood today?", null, false, true) %>
```