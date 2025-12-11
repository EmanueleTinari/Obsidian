---
creato: 2025/10/26 21:37:25
modificato: 2025/10/26 21:37:25
---


# Indice di tutti i Proclami pontifici


```dataviewjs  
// Ottiene il percorso completo del file
const path = dv.current().file.path;
// Estrae la cartella in cui si trova il file
const folderPath = path.substring(0, path.lastIndexOf("/"));
const folders = folderPath.split("/");
// Prende solo l’ultima cartella (quella che contiene il file)
const NomeDellaCartella = folders[folders.length - 1];
// Scrive il nome dentro l'HTML richiesto
dv.el("div", `<span style="color:blue; font-style:italic; font-size:100px;">${NomeDellaCartella}</span>`, {attr: {style: "text-align:center; margin-top:6em; margin-bottom:6em;"}});
```


<span style="color: red; font-size: 18px">Cliccando sull’intestazione della colonna si ordinano i documenti in maniera ascendente o discendente.</span>


```dataviewjs
// Verifica e mostra i file markdown solo nella cartella specificata
// esclusi quelli che cominciano con "_"
const workingFolder = "Documenti pontifici/Proclami"
// Definisci il simbolo per i campi mancanti
const missing = `<span style="color:red; font-weight:bold;">X</span>`;
const pages = dv.pages(`"${workingFolder}"`)
    .where(p => 
        p.file.ext === "md" &&
        !p.file.name.startsWith("_")
    );
// Ordina subito per "progr-doc" crescente
const ordered = pages.sort((a, b) => (a["progr-doc"] ?? 0) - (b["progr-doc"] ?? 0));
// Mostra un messaggio se non ci sono risultati
if (pages.length == 0) {
	dv.paragraph("⚠️ Nessun file trovato con i campi richiesti in folder “" + workingFolder + "”. Verifica frontmatter e nomi dei campi.")
;}
else {
    // Rendere intestazioni cliccabili e aggiungere data ISO per ordinamento corretto
    dv.table(
        ['Progr', 'Num', 'Autore', 'Data', 'Titolo', 'File'],
        ordered.map(b => [
            b["progr-doc"] ?? missing,
            b["num-doc"] ?? missing,
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


