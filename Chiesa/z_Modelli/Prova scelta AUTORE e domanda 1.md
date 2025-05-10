---
creato: 05-05-2025T23:04:45
aggiornato: 06-05-2025_07:44:27
---

<%*
var tagSenza = (item => item, Object.keys(app.metadataCache.getTags()).map(x => x.replace("#", "")));
console.log(tagSenza);
let tagSelezionato = await tp.system.suggester([...tagSenza, "Inserisci un nuovo TAG"], [...tagSenza, "Inserisci un nuovo TAG"])
if (tagSelezionato === "Inserisci un nuovo TAG") {
    tagSelezionato = tp.system.prompt("Inserisci un nuovo TAG senza #")
}
tR = `---
tags: ${tagSelezionato}
---`
-%>

Altro TAG ?:

<%*
const domanda1 = "Inserire un altro Tag?";
console.log("const domanda1: " + domanda1);
const scelta1 = tp.system.suggester(['Si','No'],['Si','No'], false, domanda1);
console.log("const scelta1: " + scelta1);
if (scelta1 === 'Si')
{
	console.log("const scelta1: " + scelta1);
}
else if (scelta1 === 'No')
{
	console.log("const scelta1: " + scelta1);
}
-%>

`<% scelta1 %>`.

