---
creato: 2025/06/16 14:57:26
modificato: 2025/09/14 12:23:02
---

# Indice di tutte le Lettere apostoliche


<span style="color: red; font-size: 24px">Cliccando sull’intestazione della colonna si ordinano i documenti in maniera ascendente o discendente.</span>


```dataviewjs
// Verifica e mostra i file markdown solo nella cartella specificata
// esclusi quelli che cominciano con "_"
const workingFolder = "Documenti pontifici/Lettere apostoliche"
// Definisci il simbolo per i campi mancanti
const missing = `<span style="color:red; font-weight:bold;">X</span>`;
const pages = dv.pages(`"${workingFolder}"`)
    .where(p => p.file.ext === "md" && !p.file.name.startsWith("_"));
// Ordina subito per "progr-doc" crescente
const ordered = pages.sort((a, b) => (a["progr-doc"] ?? 0) - (b["progr-doc"] ?? 0));
// Mostra un messaggio se non ci sono risultati
if (pages.length == 0) {
	dv.paragraph("⚠️ Nessun file trovato con i campi richiesti in folder “" + workingFolder + "”. Verifica frontmatter e nomi dei campi.")
;}
else {
    // Rendere intestazioni cliccabili e aggiungere data ISO per ordinamento corretto
    dv.table(
        ['Progressivo', 'Autore', 'Data', 'Titolo', 'File'],
        ordered.map(b => [
            b["progr-doc"] ?? missing,
            b["autore-doc"] ?? missing,
            b["data-doc"] 
                ? `<span data-iso="${b["data-doc"]}">${dv.luxon.DateTime.fromISO(b["data-doc"]).toFormat('dd-MM-yyyy')}</span>` 
                : missing,
            b["titolo-doc"] ?? missing,
            dv.fileLink(b.file.path, false)
        ])
    );
}

// Funzione per sorting tabella
const getCellValue = (tr, idx) => {
    const cell = tr.children[idx];
    const span = cell.querySelector('span[data-iso]');
    return span ? span.getAttribute('data-iso') : (cell.innerText || cell.textContent);
};

const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) 
        ? v1 - v2 
        : v1.toString().localeCompare(v2, undefined, {numeric: true})
)(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

// Rendere le intestazioni cliccabili
document.querySelectorAll('th').forEach(th => th.style.cursor = "pointer");
document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
    const table = th.closest('table');
    const tbody = table.querySelector('tbody');
    Array.from(tbody.querySelectorAll('tr'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
        .forEach(tr => tbody.appendChild(tr));
})));
```


