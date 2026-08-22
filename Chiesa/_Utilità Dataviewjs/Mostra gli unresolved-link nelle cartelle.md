---
licenza-nota: Copyright © 2026 Emanuele Tinari under Creative Commons BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
nomeFile: "Mostra gli unresolved-link nelle cartelle.md"
creato: 2026/06/22 00:00:33
modificato: 2026/06/22 00:47:11
---


# Dataview per mostrare di tutti i file in una cartella e sue eventuali sub gli unresolved-link


```dataviewjs
/*
===============================================================================
📌 ESTRAZIONE DEI LINK MANCANTI E DEI LINK ESTERNI DA CARTELLE E SOTTOCARTELLE
===============================================================================

ITA
--------
DESCRIZIONE:
Questo script DataviewJS crea un'interfaccia utente interattiva all'interno di Obsidian
per analizzare tutti i file Markdown contenuti in una o più cartelle selezionate,
incluse le eventuali sottocartelle, ed estrarre i wikilink rivolti a note mancanti.
Lo script raccoglie inoltre i link Markdown esterni e li visualizza in una seconda tabella.

FUNZIONALITÀ PRINCIPALI:

Selezione delle cartelle:
- Mostra tutte le cartelle del Vault in un menu a selezione multipla.
- Offre un campo di ricerca dinamico per filtrare i percorsi visualizzati.
- Analizza ricorsivamente tutti i file Markdown presenti nelle cartelle selezionate.

Estrazione dei link:
- Individua i wikilink che puntano a file non ancora esistenti.
- Esclude i link contenuti negli span HTML con classe "BibleRef".
- Rimuove ancore e sottosezioni dopo il carattere '#'.
- Gestisce gli alias e pulisce i pattern finali come ", n. 123" e ", nn. 456".
- Elimina i duplicati mantenendo, quando disponibile, l'alias pulito.

Link esterni e risultati:
- Raccoglie i link Markdown verso URL HTTP o HTTPS.
- Esclude il collegamento standard al documento sul sito del Vaticano.
- Visualizza i link mancanti e quelli esterni in due tabelle separate.
- Permette di ordinare entrambe le tabelle facendo clic sulle intestazioni.

REQUISITI:
- Obsidian MD
- Community Plugin: Dataview (con supporto DataviewJS abilitato)


ENG
--------
DESCRIPTION:
This DataviewJS script creates an interactive interface inside Obsidian
to analyze all Markdown files contained in one or more selected folders,
including their subfolders, and extract wikilinks pointing to missing notes.
The script also collects external Markdown links and displays them in a second table.

KEY FEATURES:

Folder selection:
- Displays every Vault folder in a multiple-selection menu.
- Provides a dynamic search field to filter the displayed paths.
- Recursively analyzes all Markdown files inside the selected folders.

Link extraction:
- Finds wikilinks pointing to files that do not yet exist.
- Excludes links contained in HTML spans with the "BibleRef" class.
- Removes anchors and subsections after the '#' character.
- Handles aliases and cleans trailing patterns such as ", n. 123" and ", nn. 456".
- Removes duplicates while retaining the cleaned alias when available.

External links and results:
- Collects Markdown links pointing to HTTP or HTTPS URLs.
- Excludes the standard link to the document on the Vatican website.
- Displays missing and external links in two separate tables.
- Allows both tables to be sorted by clicking their headers.

REQUIREMENTS:
- Obsidian MD
- Community Plugin: Dataview (with DataviewJS enabled)

===============================================================================
*/
// [ITA] Crea il contenitore principale dell'interfaccia tramite l'API Dataview.
// [ENG] Creates the main interface container through the Dataview API.
const container = dv.el("div", "");
// [ITA] 1. Recupera tutte le cartelle del Vault per il menu a discesa.
// [ENG] 1. Retrieves all Vault folders for the dropdown menu.
const allFolders = app.vault.getAllLoadedFiles()
    // [ITA] Mantiene solo gli oggetti cartella ed esclude la radice vuota.
    // [ENG] Keeps only folder objects and excludes the empty root path.
    // [ITA] Filtra l'elenco mantenendo soltanto gli elementi che rappresentano cartelle.
    // [ENG] Filters the list, keeping only elements that represent folders.
    .filter(f => f.children && f.path !== "/")
    // [ITA] Ordina le cartelle alfabeticamente in base al percorso completo.
    // [ENG] Sorts folders alphabetically by their complete path.
    // [ITA] Completa la catena ordinando i percorsi delle cartelle in ordine alfabetico.
    // [ENG] Completes the chain by sorting folder paths alphabetically.
    .sort((a, b) => a.path.localeCompare(b.path));
// [ITA] 2. Crea l'interfaccia utente con selezione multipla delle cartelle.
// [ENG] 2. Creates the user interface with multiple folder selection.
// [ITA] Inserisce il titolo della sezione di selezione.
// [ENG] Inserts the selection section heading.
container.createEl("h3", { text: "Seleziona una o più cartelle sorgente:" });
// [ITA] Crea il contenitore relativo della barra di ricerca.
// [ENG] Creates the relative container for the search bar.
const searchContainer = container.createEl("div", {
	attr: { style: "position: relative; margin-bottom: 15px; width: 100%;" }
});
// [ITA] Crea il contenitore dell'icona di ricerca.
// [ENG] Creates the search icon container.
const iconDiv = searchContainer.createEl("div", {
	attr: {
		style: `
		position: absolute;
		left: 7px;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		pointer-events: none;
		opacity: 1;
		`
	}
});
// [ITA] Inserisce l'icona della lente di ingrandimento.
// [ENG] Inserts the magnifying-glass icon.
iconDiv.innerHTML = `🔍`;
// [ITA] Crea il campo di testo per filtrare le cartelle.
// [ENG] Creates the text field used to filter folders.
const searchInput = searchContainer.createEl("input", {
	attr: {
		type: "text",
		placeholder: "Inizia a scrivere per filtrare le cartelle…",
		style: `
			background-color: var(--background-modifier-form-field);
			border-radius: 6px;
			border: 1px solid var(--background-modifier-border);
			color: var(--text-normal);
			font-size: 1rem;
			padding: 10px 10px 10px 40px;
			width: 100%;
		`
	}
});
// [ITA] Crea il menu HTML a selezione multipla.
// [ENG] Creates the HTML multiple-selection menu.
const selectEl = container.createEl("select", {
	attr: {
		multiple: true,
		style: `
			width: 100%;
			height: 220px;
			margin-bottom: 10px;
			font-size: 0.9rem;
			padding: 5px;
			border-radius: 6px;
		`
	}
});
// [ITA] Popola il menu con il percorso di ogni cartella disponibile.
// [ENG] Populates the menu with the path of every available folder.
allFolders.forEach(folder => {
    // [ITA] Aggiunge una voce selezionabile per la cartella corrente.
    // [ENG] Adds a selectable option for the current folder.
    selectEl.createEl("option", { value: folder.path, text: folder.path });
});
// [ITA] 3. Aggiorna dinamicamente la lista quando cambia il testo di ricerca.
// [ENG] 3. Dynamically updates the list when the search text changes.
searchInput.addEventListener("input", () => {
    // [ITA] Normalizza il testo inserito per rendere il filtro senza distinzione tra maiuscole e minuscole.
    // [ENG] Normalizes the entered text so filtering is case-insensitive.
    const filter = searchInput.value.toLowerCase();
    // [ITA] Recupera tutte le opzioni del menu.
    // [ENG] Retrieves all menu options.
    const options = selectEl.querySelectorAll("option");
    // [ITA] Applica il filtro a ogni voce del menu.
    // [ENG] Applies the filter to every menu option.
	options.forEach(opt => {
        // [ITA] Converte il testo della voce in minuscolo e ne verifica la corrispondenza.
        // [ENG] Converts the option text to lowercase and checks whether it matches.
		const text = opt.text.toLowerCase();
        // [ITA] Mostra o nasconde la voce in base al risultato del filtro.
        // [ENG] Shows or hides the option according to the filter result.
		opt.style.display = text.includes(filter) ? "" : "none";
	});
});
// [ITA] Crea il pulsante che avvia l'analisi delle cartelle.
// [ENG] Creates the button that starts folder analysis.
const buttonEl = container.createEl("button", {
	text: "Estrai Link Mancanti dai Folder"
});
// [ITA] Crea il contenitore dei risultati dell'analisi.
// [ENG] Creates the container for analysis results.
const resultContainer = container.createEl("div", {
	attr: { style: "margin-top: 20px;" }
});
// [ITA] 4. Avvia l'estrazione quando l'utente fa clic sul pulsante.
// [ENG] 4. Starts extraction when the user clicks the button.
buttonEl.addEventListener("click", async () => {
    // [ITA] Elimina i risultati di un'eventuale analisi precedente.
    // [ENG] Removes the results from any previous analysis.
    resultContainer.empty();
    // [ITA] Recupera i percorsi delle cartelle selezionate.
    // [ENG] Retrieves the paths of the selected folders.
    const selectedFolderPaths = Array.from(selectEl.selectedOptions).map(opt => opt.value);
    if (selectedFolderPaths.length === 0) {
        // [ITA] Avvisa l'utente se non è stata selezionata alcuna cartella.
        // [ENG] Warns the user when no folder has been selected.
        resultContainer.createEl("p", { text: "⚠️ Seleziona almeno una cartella dalla lista sopra.", attr: { style: "color: orange;" } });
        // [ITA] Interrompe il callback perché non ci sono cartelle da analizzare.
        // [ENG] Stops the callback because there are no folders to analyze.
        return;
    }
    // [ITA] Raccoglie tutti i Markdown il cui percorso appartiene alle cartelle selezionate o alle loro sottocartelle.
    // [ENG] Collects every Markdown file whose path belongs to a selected folder or one of its subfolders.
    const filesToScan = app.vault.getMarkdownFiles().filter(file => {
        // [ITA] Verifica l'appartenenza del file a ciascuna cartella selezionata.
        // [ENG] Checks whether the file belongs to any selected folder.
        return selectedFolderPaths.some(folderPath => file.path.startsWith(folderPath + "/"));
    });
    if (filesToScan.length === 0) {
        // [ITA] Avvisa l'utente quando le cartelle non contengono file Markdown.
        // [ENG] Warns the user when the folders contain no Markdown files.
        resultContainer.createEl("p", { text: "⚠️ Nessun file markdown trovato nelle cartelle selezionate.", attr: { style: "color: orange;" } });
        // [ITA] Interrompe il callback perché non ci sono file da analizzare.
        // [ENG] Stops the callback because there are no files to analyze.
        return;
    }
    // [ITA] Mappa dei link mancanti: chiave = percorso, valore = alias o titolo pulito.
    // [ENG] Map of missing links: key = path, value = cleaned alias or title.
    const missingLinksMap = new Map();
    // [ITA] Array che raccoglie URL e testo dei link esterni.
    // [ENG] Array collecting external URLs and their link text.
    const externalLinksArray = [];
    // [ITA] Regex per riconoscere il suffisso numerico da rimuovere dagli alias.
    // [ENG] Regex for recognizing the numeric suffix to remove from aliases.
    const strictPattern = /, nn?\. \d{1,3}$/;
	for (const file of filesToScan) {
        // [ITA] Legge il contenuto del file per analizzare link esterni e contesto HTML.
        // [ENG] Reads the file content to analyze external links and HTML context.
		const fileContent = await app.vault.read(file);
        // [ITA] Definisce la Regex per estrarre i link Markdown HTTP o HTTPS.
        // [ENG] Defines the Regex used to extract HTTP or HTTPS Markdown links.
		const extLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
        // [ITA] Variabile che conterrà di volta in volta il risultato della Regex.
        // [ENG] Variable holding each successive Regex match.
		let match;
        // [ITA] Analizza tutte le corrispondenze di link esterni trovate nel contenuto.
        // [ENG] Processes every external-link match found in the content.
		while ((match = extLinkRegex.exec(fileContent)) !== null) {
            // [ITA] Recupera il testo mostrato nelle parentesi quadre.
            // [ENG] Retrieves the text shown inside the square brackets.
            const linkText = match[1];
            // [ITA] Recupera l'URL contenuto nelle parentesi tonde.
            // [ENG] Retrieves the URL contained in the parentheses.
            const linkUrl = match[2];
            // [ITA] Ignora il collegamento standard escluso dal report.
            // [ENG] Skips the standard link excluded from the report.
			if (linkText === "Link al documento sul sito del Vaticano") {
                // [ITA] Passa al risultato successivo senza aggiungere il link escluso.
                // [ENG] Moves to the next match without adding the excluded link.
				continue;
			}
            // [ITA] Aggiunge il link esterno solo se l'URL non è già stato raccolto.
            // [ENG] Adds the external link only when its URL has not already been collected.
			if (!externalLinksArray.some(item => item[0] === linkUrl)) {
                // [ITA] Salva URL e testo associato nella coppia del report.
                // [ENG] Stores the URL and its associated text as a report pair.
				externalLinksArray.push([linkUrl, linkText]);
			}
		}
        // [ITA] Recupera dalla cache di Obsidian i metadati e i wikilink del file.
        // [ENG] Retrieves the file metadata and wikilinks from Obsidian's cache.
		const fileCache = app.metadataCache.getFileCache(file);
		if (fileCache && fileCache.links) {
            // [ITA] Analizza ogni wikilink registrato nella cache.
            // [ENG] Analyzes every wikilink recorded in the cache.
			for (const linkObj of fileCache.links) {
                // [ITA] Filtro: verifica se il wikilink si trova in uno span BibleRef.
                // [ENG] Filter: checks whether the wikilink is inside a BibleRef span.
				const startOffset = linkObj.position.start.offset;
                // [ITA] Legge il testo immediatamente precedente per determinare il contesto HTML.
                // [ENG] Reads the immediately preceding text to determine the HTML context.
				const textBefore = fileContent.substring(Math.max(0, startOffset - 50), startOffset);
                // [ITA] Ignora il link se si trova dentro uno span BibleRef ancora aperto.
                // [ENG] Skips the link when it is inside an unclosed BibleRef span.
				if (textBefore.includes('class="BibleRef"') && !textBefore.includes('</span>', textBefore.indexOf('class="BibleRef"'))) {
                    // [ITA] Passa al wikilink successivo quando quello corrente appartiene a BibleRef.
                    // [ENG] Moves to the next wikilink when the current one belongs to BibleRef.
					continue;
				}
                // [ITA] Recupera il percorso originale del link e rimuove eventuali ancore.
                // [ENG] Retrieves the original link path and removes any anchors.
				const targetPath = linkObj.link;
                const cleanTarget = targetPath.split("#")[0];
                // [ITA] Ignora i link che contengono soltanto un'ancora senza un file destinazione.
                // [ENG] Ignores links containing only an anchor without a destination file.
                if (!cleanTarget) continue;
                // [ITA] Risolve il percorso relativo al file sorgente per verificare l'esistenza della destinazione.
                // [ENG] Resolves the path relative to the source file to check whether the destination exists.
                const destFile = app.metadataCache.getFirstLinkpathDest(cleanTarget, file.path);
                if (!destFile) {
                    // [ITA] Recupera alias e testo visualizzato dal wikilink mancante.
                    // [ENG] Retrieves the alias and display text from the missing wikilink.
                    const originalAlias = linkObj.displayText;
                    // [ITA] Usa il percorso come valore predefinito da mostrare.
                    // [ENG] Uses the path as the default display value.
                    let finalDisplay = cleanTarget;
                    if (originalAlias && originalAlias !== targetPath) {
                        // [ITA] Pulisce l'alias solo quando rispetta il pattern previsto.
                        // [ENG] Cleans the alias only when it matches the expected pattern.
                        if (strictPattern.test(originalAlias)) {
                            finalDisplay = originalAlias.replace(strictPattern, "");
                        }
						else {
                            // [ITA] Ignora gli alias non conformi e mantiene il percorso.
                            // [ENG] Ignores non-matching aliases and keeps the path.
                            finalDisplay = cleanTarget;
                        }
                    }
                    // [ITA] Inserisce il primo risultato per questo percorso mancante.
                    // [ENG] Inserts the first result for this missing path.
                    if (!missingLinksMap.has(cleanTarget)) {
                        missingLinksMap.set(cleanTarget, finalDisplay);
                    }
					else {
                        // [ITA] Recupera il valore già memorizzato per il percorso duplicato.
                        // [ENG] Retrieves the value already stored for the duplicate path.
                        const currentVal = missingLinksMap.get(cleanTarget);
                        // [ITA] Sostituisce il percorso grezzo con un alias pulito, se disponibile.
                        // [ENG] Replaces the raw path with a cleaned alias when available.
                        if (currentVal === cleanTarget && finalDisplay !== cleanTarget) {
                            missingLinksMap.set(cleanTarget, finalDisplay);
                        }
                    }
                }
            }
        }
    }
    // [ITA] 5. Ordina inizialmente i link mancanti in base al titolo o alias visualizzato.
    // [ENG] 5. Initially sorts missing links by their displayed title or alias.
    const sortedMissingLinks = Array.from(missingLinksMap.entries())
        .sort((a, b) => a[1].localeCompare(b[1]));
    // [ITA] 6. Visualizza i risultati in formato tabellare.
    // [ENG] 6. Renders the results in table format.
    if (sortedMissingLinks.length === 0) {
        // [ITA] Conferma che non sono stati trovati link mancanti.
        // [ENG] Confirms that no missing links were found.
        resultContainer.createEl("p", { text: "✅ Nessun link mancante trovato nelle cartelle selezionate!" });
    }
    else {
        // [ITA] Mostra l'istruzione per ordinare la tabella facendo clic sulle intestazioni.
        // [ENG] Displays instructions for sorting the table by clicking its headers.
        resultContainer.createEl("p", {
            text: "Cliccando sull’intestazione della colonna si ordinano i documenti in maniera ascendente o discendente.",
            attr: { style: "color: red; font-size: 18px; font-weight: normal; margin-bottom: 10px;" }
        });
        // [ITA] Mostra il numero totale di file mancanti da creare.
        // [ENG] Displays the total number of missing files to create.
        resultContainer.createEl("h4", { text: `File mancanti da creare (${sortedMissingLinks.length}):` });
        // [ITA] Prepara le righe della tabella dei link mancanti.
        // [ENG] Prepares the rows for the missing-links table.
        const tableRows = sortedMissingLinks.map(([fullPath, displayTitle]) => {
            // [ITA] Ricava il solo nome del file dal percorso completo.
            // [ENG] Extracts only the file name from the complete path.
            const fileNameOnly = fullPath.substring(fullPath.lastIndexOf("/") + 1);
            // [ITA] Crea un wikilink che conserva il percorso completo ma mostra il solo nome del file.
            // [ENG] Creates a wikilink that keeps the full path while displaying only the file name.
            const fileLink = `[[${fullPath}|${fileNameOnly}]]`;
            // [ITA] Mostra un trattino quando non è disponibile un alias distinto dal percorso.
            // [ENG] Displays a dash when no alias distinct from the path is available.
            const finalTitle = displayTitle === fullPath ? "-" : displayTitle;
            // [ITA] Restituisce i valori delle due colonne della riga.
            // [ENG] Returns the values for the row's two columns.
            return [fileLink, finalTitle];
        });
        // [ITA] Genera la tabella dei file mancanti nel contenitore dei risultati.
        // [ENG] Generates the missing-files table inside the results container.
        dv.api.table(['File da creare', 'Alias / Titolo documento'], tableRows, resultContainer, dv.component);
        // [ITA] Avvia il motore di ordinamento interattivo dopo il rendering della tabella.
        // [ENG] Starts the interactive sorting engine after the table has been rendered.
        setTimeout(() => {
            // [ITA] Recupera la tabella dei link mancanti appena generata.
            // [ENG] Retrieves the newly generated missing-links table.
            const table = resultContainer.querySelector('table');
            // [ITA] Interrompe l'operazione se la tabella non è stata generata.
            // [ENG] Stops if the table was not generated.
            if (!table) return;
            // [ITA] Restituisce il testo della cella indicata dall'indice di colonna.
            // [ENG] Returns the text of the cell at the specified column index.
            const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
            // [ITA] Crea un comparatore numerico o alfabetico in base al contenuto delle celle.
            // [ENG] Creates a numeric or alphabetical comparator based on cell contents.
            const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
                v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)
                    ? v1 - v2
                    : v1.toString().localeCompare(v2, undefined, {numeric: true})
            )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
            // [ITA] Collega il comportamento di ordinamento a ogni intestazione della tabella.
            // [ENG] Attaches sorting behavior to every table header.
            table.querySelectorAll('th').forEach(th => th.addEventListener('click', function () {
                // [ITA] Recupera il corpo della tabella e le sue righe.
                // [ENG] Retrieves the table body and its rows.
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));
                // [ITA] Inverte la direzione di ordinamento memorizzata per la tabella.
                // [ENG] Toggles the sorting direction stored for the table.
                this.asc = !this.asc;
                // [ITA] Ordina le righe in base alla colonna dell'intestazione cliccata e le riappende.
                // [ENG] Sorts rows by the clicked header's column and appends them again.
                rows.sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc))
                        // [ITA] Riappende ogni riga nell'ordine calcolato per aggiornare la tabella.
                        // [ENG] Appends each row in the calculated order to update the table.
                    .forEach(tr => tbody.appendChild(tr));
            }));
        }, 100);
    }
    // [ITA] Mostra sempre il titolo della sezione dei link esterni e il relativo conteggio.
    // [ENG] Always displays the external-links section title and its count.
    resultContainer.createEl("h4", {
        text: `Link esterni trovati (${externalLinksArray.length}):`,
        attr: { style: "margin-top: 30px;" }
    });
    if (externalLinksArray.length === 0) {
        // [ITA] Comunica che non sono stati trovati link esterni.
        // [ENG] Reports that no external links were found.
        resultContainer.createEl("p", { text: "ℹ️ Nessun link esterno trovato nelle cartelle selezionate." });
    }
    else {
        // [ITA] Prepara le righe della tabella dei link esterni.
        // [ENG] Prepares the rows for the external-links table.
        const extTableRows = externalLinksArray.map(([url, text]) => {
            // [ITA] Crea il link Markdown visualizzato nella prima colonna.
            // [ENG] Creates the Markdown link displayed in the first column.
            const cleanDisplayLink = `[Link](${url})`;
            // [ITA] Restituisce URL visualizzato e testo del link per la riga.
            // [ENG] Returns the displayed URL and link text for the row.
            return [cleanDisplayLink, text];
        });
        // [ITA] Crea un contenitore dedicato per identificare la seconda tabella.
        // [ENG] Creates a dedicated container to identify the second table.
        const extTableDiv = resultContainer.createEl("div", { attr: { class: "ext-links-table-container" } });
        // [ITA] Genera la tabella dei link esterni nel contenitore dedicato.
        // [ENG] Generates the external-links table in the dedicated container.
        dv.api.table(['Collegamento', 'Testo del Link'], extTableRows, extTableDiv, dv.component);
        // [ITA] Avvia l'ordinamento interattivo della seconda tabella dopo il rendering.
        // [ENG] Starts interactive sorting for the second table after rendering.
        setTimeout(() => {
            // [ITA] Recupera esclusivamente la seconda tabella.
            // [ENG] Retrieves only the second table.
            const table = extTableDiv.querySelector('table');
            // [ITA] Interrompe l'operazione se la seconda tabella non è stata generata.
            // [ENG] Stops if the second table was not generated.
            // [ITA] Esce dal callback se la tabella esterna non è disponibile.
            // [ENG] Exits the callback if the external table is unavailable.
            if (!table) return;
            // [ITA] Restituisce il testo della cella indicata dall'indice di colonna.
            // [ENG] Returns the text of the cell at the specified column index.
            const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
            // [ITA] Crea un comparatore numerico o alfabetico per le righe.
            // [ENG] Creates a numeric or alphabetical comparator for the rows.
            const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
                v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)
                    ? v1 - v2
                    : v1.toString().localeCompare(v2, undefined, {numeric: true})
            )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
            // [ITA] Collega l'ordinamento a ogni intestazione della seconda tabella.
            // [ENG] Attaches sorting to every header of the second table.
            table.querySelectorAll('th').forEach(th => th.addEventListener('click', function () {
                // [ITA] Recupera il corpo e tutte le righe della seconda tabella.
                // [ENG] Retrieves the body and all rows of the second table.
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));
                // [ITA] Inverte la direzione di ordinamento indipendentemente dalla prima tabella.
                // [ENG] Toggles sorting independently from the first table.
                this.ascExt = !this.ascExt; // [ITA] Stato separato per non entrare in conflitto con la prima tabella. // [ENG] Separate state to avoid conflict with the first table.
                // [ITA] Ordina le righe in base all'intestazione cliccata e le riappende.
                // [ENG] Sorts rows by the clicked header and appends them again.
                rows.sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.ascExt))
                    // [ITA] Riappende ogni riga nell'ordine calcolato per aggiornare la seconda tabella.
                    // [ENG] Appends each row in the calculated order to update the second table.
                    .forEach(tr => tbody.appendChild(tr));
            }));
        }, 100);
    }
});

```
