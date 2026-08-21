---
licenza-nota: Copyright © 2026 Emanuele Tinari under Creative Commons BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
nomeFile: Dataview File unresolved-link.md
creato: 2026/06/03 01:08:10
modificato: 2026/08/21 23:54:23
---


# Dataview per mostrare di un file gli unresolved-link


```dataviewjs
/*
===============================================================================
📌 ESTRAZIONE LINK MANCANTI E GESTIONE ALIAS (OBSIDIAN SCRIPT PER DATAVIEWJS)
===============================================================================

ITA
--------
DESCRIZIONE:
Questo script DataviewJS crea un'interfaccia utente interattiva all'interno di Obsidian
per analizzare uno o più file Markdown della Vault ed estrarre tutti i wikilink
rivolti a note non ancora esistenti (link mancanti).

FUNZIONALITÀ PRINCIPALI:

Interfaccia Utente Interattiva:
- Campo di ricerca dinamico con icona integrata per filtrare in tempo reale i file
  della Vault presente nel menu di selezione.
- Menu a selezione multipla (select) contenente l'elenco dei file ordinati alfabeticamente.

Filtro dei Link:
- Esclude automaticamente dall'analisi i link contenuti all'interno di blocchi
  HTML specifici (es. tag <span class="BibleRef">).
- Tronca ed elide ancore e sottosezioni (carattere '#') per isolare esclusivamente
  il file di destinazione principale.

Gestione Avanzata degli Alias e Pulizia Rigorosa:
- Rileva gli alias dei link mancanti e applica un'espressione regolare (Regex)
  per rimuovere automaticamente pattern specifici (es. ", n. 123" o ", nn. 456").
- Risolve i duplicati mantenendo la versione con l'alias più completo e pulito.

Tabella dei Risultati e Ordinamento Dinamico:
- Genera una tabella Dataview con due colonne: link ibrido al file da creare e relativo
  alias/titolo pulito (o un trattino '-' se assente).
- Implementa un motore JavaScript per l'ordinamento dinamico (ascendente/discendente)
  al click sulle intestazioni della tabella.

REQUISITI:
- Obsidian MD
- Community Plugin: Dataview (con supporto DataviewJS abilitato)


===============================================================================

ENG
--------
DESCRIPTION:

This DataviewJS script builds an interactive user interface within Obsidian to
analyze one or more Markdown files in the Vault and extract all unresolved wikilinks
pointing to non-existent notes (missing links).

KEY FEATURES:

Interactive User Interface:
- Dynamic search field with an integrated icon to filter the Vault's file list
  in real time.
- Multi-select menu containing all Markdown files sorted alphabetically.

Surgical Link Filtering:
- Automatically ignores links wrapped inside specific HTML tags
  (e.g., <span class="BibleRef">).
- Strips anchors and sub-sections (using the '#' delimiter) to isolate only the
  main target file.

Smart Alias Handling & Strict Pattern Cleaning:
- Detects link aliases and applies a Regular Expression (Regex) to automatically
  clean specific matching patterns (e.g., ", n. 123" or ", nn. 456").
- Deduplicates missing links by preferring the cleaned alias version over raw target paths.

Table Output & Dynamic Column Sorting:
- Renders a Dataview table with two columns: a hybrid link to the missing file and its
  cleaned display title/alias (or a dash '-' if none exists).
- Integrates a lightweight JavaScript sorting engine enabling column reordering
  (ascending/descending) on header click.

REQUIREMENTS:
- Obsidian MD
- Community Plugin: Dataview (with DataviewJS enabled)


===============================================================================
*/

// [ITA] Crea un elemento contenitore div principale tramite l'API di Dataview
// [ENG] Creates a main container div element using the Dataview API
const container = dv.el("div", "");
// [ITA] 1. Recupera tutti i file markdown del vault per il menu a discesa
// [ENG] 1. Retrieves all markdown files from the vault for the dropdown menu
// [ITA] Recupera l'elenco dei file markdown dal vault di Obsidian
// [ENG] Gets the list of markdown files from the Obsidian vault
const allFiles = app.vault.getMarkdownFiles()
	// [ITA] Ordina i file alfabeticamente in base al nome base senza estensione
	// [ENG] Sorts files alphabetically based on their basename without extension
	.sort((a, b) => a.basename.localeCompare(b.basename));
// [ITA] 2. Crea l'interfaccia utente (Menu a selezione multipla)
// [ENG] 2. Creates the user interface (Multiple selection menu)
// [ITA] Aggiunge un titolo H3 al contenitore principale
// [ENG] Adds an H3 heading to the main container
container.createEl("h3", { text: "Seleziona uno o più file sorgente:" });
// [ITA] Blocco di ricerca con icona (costruzione HTML manuale)
// [ENG] Search block with icon (manual HTML construction)
const searchContainer = container.createEl("div", {
	// [ITA] Crea un div contenitore per la barra di ricerca con posizionamento relativo
	// [ENG] Creates a container div for the search bar with relative positioning
	attr: { style: "position: relative; margin-bottom: 15px; width: 100%;" }
});
// [ITA] Crea un div per contenere l'icona di ricerca
// [ENG] Creates a div to hold the search icon
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
// [ITA] Inserisce l'emoji della lente di ingrandimento dentro il div dell'icona
// [ENG] Inserts the magnifying glass emoji inside the icon div
iconDiv.innerHTML = `🔍`;
// [ITA] Crea il campo di input di testo per filtrare i file
// [ENG] Creates the text input field for filtering files
const searchInput = searchContainer.createEl("input", {
	attr: {
		type: "text",
		placeholder: "Inizia a scrivere per filtrare i file…",
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
// [ITA] Crea l'elemento HTML select per la selezione multipla dei file
// [ENG] Creates the select HTML element for multiple file selection
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
// [ITA] Cicla su tutti i file markdown recuperati
// [ENG] Loops through all retrieved markdown files
allFiles.forEach(file => {
	// [ITA] Crea un'opzione all'interno del select per ciascun file
	// [ENG] Creates an option inside the select for each file
	const option = selectEl.createEl("option", { value: file.path, text: file.basename });
});
// [ITA] Logica di filtraggio dinamico della lista
// [ENG] Dynamic list filtering logic
// [ITA] Aggiunge un evento per intercettare l'input dell'utente nella barra di ricerca
// [ENG] Adds an event listener to intercept user input in the search bar
searchInput.addEventListener("input", () => {
	// [ITA] Converte il testo di ricerca inserito dall'utente in minuscolo
	// [ENG] Converts the user's search text to lowercase
	const filter = searchInput.value.toLowerCase();
	// [ITA] Seleziona tutte le opzioni presenti nel menu a discesa
	// [ENG] Selects all option elements within the select menu
	const options = selectEl.querySelectorAll("option");
	// [ITA] Cicla attraverso ciascuna opzione del menu
	// [ENG] Loops through each option in the menu
	options.forEach(opt => {
		// [ITA] Converte il testo dell'opzione in minuscolo
		// [ENG] Converts the option text to lowercase
		const text = opt.text.toLowerCase();
		// [ITA] Mostra l'opzione se contiene il testo cercato, altrimenti la nasconde
		// [ENG] Displays the option if it includes the searched text, otherwise hides it
		opt.style.display = text.includes(filter) ? "" : "none";
	});
});
// [ITA] Crea il pulsante per avviare l'estrazione dei link
// [ENG] Creates the button to trigger link extraction
const buttonEl = container.createEl("button", {
	text: "Estrai Link Mancanti"
	});
// [ITA] Crea il contenitore div per mostrare i risultati
// [ENG] Creates the container div to display results
const resultContainer = container.createEl("div", {
	attr: {
		style: `
			margin-top: 20px;
		`
	}
});
// [ITA] 3. Logica di estrazione al click del pulsante
// [ENG] 3. Extraction logic on button click
// [ITA] Aggiunge un listener asincrono per l'evento click sul pulsante
// [ENG] Adds an asynchronous event listener for the button click event
buttonEl.addEventListener("click", async () => {
	// [ITA] Pulisce lo schermo dai risultati precedenti
	// [ENG] Clears the screen of previous results
	resultContainer.empty();
	// [ITA] Prendi i file selezionati dall’utente
	// [ENG] Get the files selected by the user
	// [ITA] Ottiene l'array dei percorsi dei file selezionati nell'elemento select
	// [ENG] Gets the array of file paths selected in the select element
	const selectedPaths = Array.from(selectEl.selectedOptions).map(opt => opt.value);
	// [ITA] Verifica se l'utente non ha selezionato alcun file
	// [ENG] Checks if the user has not selected any files
	if (selectedPaths.length === 0) {
		// [ITA] Mostra un messaggio di avviso se nessun file è selezionato
		// [ENG] Displays a warning message if no file is selected
		resultContainer.createEl("p", { text: "⚠️ Seleziona almeno un file dalla lista sopra.", attr: { style: "color: orange;" } });
		// [ITA] Interrompe l'esecuzione della funzione
		// [ENG] Halts function execution
		return;
	}
	// [ITA] Mappa per evitare duplicati (Chiave: percorso file pulito, Valore: titolo visualizzato pulito)
	// [ENG] Map to avoid duplicates (Key: clean file path, Value: clean display title)
	const missingLinksMap = new Map();
	// [ITA] Espressione Regolare (Regex) basata sulla sintassi rigorosa
	// [ENG] Regular Expression (Regex) based on strict syntax
	const strictPattern = /, nn?\. \d{1,3}$/;
	// [ITA] Cicla attraverso ciascun percorso di file selezionato dall'utente
	// [ENG] Loops through each file path selected by the user
	for (const filePath of selectedPaths) {
		// [ITA] Ottiene l'oggetto file abstract dal vault di Obsidian tramite il suo percorso
		// [ENG] Gets the abstract file object from the Obsidian vault using its path
		const file = app.vault.getAbstractFileByPath(filePath);
		// [ITA] Se il file non esiste, salta all'iterazione successiva
		// [ENG] If the file does not exist, skips to the next iteration
		if (!file) continue;
		// [ITA] LEGGE IL TESTO DEL FILE: Serve per verificare la presenza dei tag HTML intorno al link
		// [ENG] READS THE FILE TEXT: Used to verify the presence of HTML tags around the link
		const fileContent = await app.vault.read(file);
		// [ITA] Ottiene la cache dei metadati del file da Obsidian
		// [ENG] Gets the file metadata cache from Obsidian
		const fileCache = app.metadataCache.getFileCache(file);
		// [ITA] Verifica se la cache dei metadati e l'elenco dei link esistono
		// [ENG] Checks if the metadata cache and the links list exist
		if (fileCache && fileCache.links) {
			// [ITA] Cicla attraverso tutti i link trovati nel file corrente
			// [ENG] Loops through all links found in the current file
			for (const linkObj of fileCache.links) {
				// [ITA] FILTRO: Verifica se il link è dentro uno <span class="BibleRef">
				// [ENG] FILTER: Checks if the link is inside a <span class="BibleRef">
				// [ITA] Recupera la posizione di inizio del link nel testo del file
				// [ENG] Gets the start position offset of the link in the file text
				const startOffset = linkObj.position.start.offset;
				// [ITA] Estrae fino a 50 caratteri precedenti al link per analizzare il contesto
				// [ENG] Extracts up to 50 characters preceding the link to analyze context
				const textBefore = fileContent.substring(Math.max(0, startOffset - 50), startOffset);
				// [ITA] Se negli ultimi 50 caratteri prima del link c’è lo span biblico e NON è ancora stato chiuso
				// [ENG] If in the last 50 characters before the link there is the Bible span and it has NOT been closed yet
				if (textBefore.includes('class="BibleRef"') && !textBefore.includes('</span>', textBefore.indexOf('class="BibleRef"'))) {
					// [ITA] Salta il link della Bibbia all'istante
					// [ENG] Skips the Bible link instantly
					continue;
				}
				// [ITA] Tronchiamo al carattere '#' per isolare solo il file principale
				// [ENG] We truncate at the '#' character to isolate only the main file
				const targetPath = linkObj.link;
				// [ITA] Isola il percorso del file rimuovendo eventuali ancore o sezioni post '#'
				// [ENG] Isolates the file path by removing any anchors or sections after '#'
				const cleanTarget = targetPath.split("#")[0];
				// [ITA] Se il percorso pulito è vuoto, salta l'iterazione
				// [ENG] If the clean target path is empty, skips the iteration
				if (!cleanTarget) continue;
				// [ITA] Verifica se il file di destinazione (senza #) esiste nel vault
				// [ENG] Checks if the destination file (without #) exists in the vault
				const destFile = app.metadataCache.getFirstLinkpathDest(cleanTarget, file.path);
				// [ITA] Se destFile è null, significa che il file NON esiste ancora
				// [ENG] If destFile is null, it means the file does NOT exist yet
				if (!destFile) {
					// [ITA] Recupera l'alias o testo di visualizzazione originale del link
					// [ENG] Gets the original alias or display text of the link
					const originalAlias = linkObj.displayText;
					// [ITA] Di base usa il nome file
					// [ENG] By default uses the filename
					let finalDisplay = cleanTarget;
					// [ITA] Verifica se esiste un alias originale ed è diverso dal percorso del link
					// [ENG] Checks if an original alias exists and is different from the link target path
					if (originalAlias && originalAlias !== targetPath) {
						// [ITA] Se l'alias corrisponde al pattern rigoroso, lo puliamo
						// [ENG] If the alias matches strict pattern, we clean it
						if (strictPattern.test(originalAlias)) {
							// [ITA] Rimuove il pattern finale dall'alias per pulire il titolo
							// [ENG] Removes the matching trailing pattern from the alias to clean the title
							finalDisplay = originalAlias.replace(strictPattern, "");
						}
						else {
							// [ITA] Se NON corrisponde, ignoriamo l'alias e prendiamo solo il link al file
							// [ENG] If it does NOT match, we ignore the alias and take only the link to the file
							finalDisplay = cleanTarget;
						}
					}
					// [ITA] Gestione Duplicati Intelligente nella mappa
					// [ENG] Smart Duplicate Handling in the map
					// [ITA] Controlla se la mappa non contiene ancora la chiave del file mancante
					// [ENG] Checks if the map does not already contain the key for the missing file
					if (!missingLinksMap.has(cleanTarget)) {
						// [ITA] Inserisce il percorso del file mancante e la sua intitolazione finale nella mappa
						// [ENG] Inserts the missing file path and its final display title into the map
						missingLinksMap.set(cleanTarget, finalDisplay);
					}
					else {
						// [ITA] Se era stato salvato come grezzo, lo aggiorniamo se troviamo la versione con alias pulito
						// [ENG] If it was saved as raw, we update it if we find the clean alias version
						const currentVal = missingLinksMap.get(cleanTarget);
						// [ITA] Aggiorna il valore nella mappa se quello attuale è grezzo e quello nuovo è un alias pulito
						// [ENG] Updates the map value if the current one is raw and the new one is a clean alias
						if (currentVal === cleanTarget && finalDisplay !== cleanTarget) {
							missingLinksMap.set(cleanTarget, finalDisplay);
						}
					}
				}
			}
		}
	}
	// [ITA] 4. Ordinamento alfabetico iniziale in base all'Alias / Titolo (Colonna 2)
	// [ENG] 4. Initial alphabetical sorting based on Alias / Title (Column 2)
	const sortedMissingLinks = Array.from(missingLinksMap.entries())
		.sort((a, b) => a[1].localeCompare(b[1]));
	// [ITA] 5. Rendering dei risultati in formato Tabella
	// [ENG] 5. Rendering results in Table format
	// [ITA] Controlla se non sono stati trovati link mancanti
	// [ENG] Checks if no missing links were found
	if (sortedMissingLinks.length === 0) {
		// [ITA] Mostra un messaggio di conferma se non ci sono file mancanti
		// [ENG] Displays a confirmation message if no missing files are found
		resultContainer.createEl("p", { text: "✅ Nessun link mancante trovato nei file selezionati!" });
	}
	else {
		// [ITA] Stampa l'avviso in rosso per l'ordinamento delle colonne
		// [ENG] Prints the warning in red for column sorting
		resultContainer.createEl("p", {
			text: "Cliccando sull’intestazione della colonna si ordinano i documenti in maniera ascendente o discendente.",
			attr: { style: "color: red; font-size: 18px; font-weight: normal; margin-bottom: 10px;" }
		});
		// [ITA] Mostra il titolo dell'elenco indicando il numero totale di file mancanti
		// [ENG] Displays the list header indicating the total number of missing files
		resultContainer.createEl("h4", { text: `File mancanti da creare (${sortedMissingLinks.length}):` });
		// [ITA] Prepariamo le righe della tabella applicando il taglio del path
		// [ENG] We prepare the table rows applying the path cut
		const tableRows = sortedMissingLinks.map(([fullPath, displayTitle]) => {
			// [ITA] Isola solo il nome del file eliminando il percorso delle cartelle
			// [ENG] Isolates only the file name removing the folder path
			const fileNameOnly = fullPath.substring(fullPath.lastIndexOf("/") + 1);
			// [ITA] Crea il link ibrido: punta al percorso intero nascosto, ma mostra solo il nome file pulito
			// [ENG] Creates the hybrid link: points to the hidden full path, but displays only the clean file name
			const fileLink = `[[${fullPath}|${fileNameOnly}]]`;
			// [ITA] Se l'alias coincideva con il nome file (ovvero non c'era un vero alias), mostriamo un trattino nella colonna Titolo
			// [ENG] If the alias matched the filename (meaning there was no real alias), we show a dash in the Title column
			const finalTitle = displayTitle === fullPath ? "-" : displayTitle;
			// [ITA] Restituisce la coppia di valori per la riga della tabella
			// [ENG] Returns the pair of values for the table row
			return [fileLink, finalTitle];
		});
		// [ITA] Genera la tabella all'interno del resultContainer
		// [ENG] Generates the table inside the resultContainer
		dv.api.table(['File da creare', 'Alias / Titolo documento'], tableRows, resultContainer, dv.component);
		// [ITA] Attiva il motore di sorting sulle intestazioni appena create
		// [ENG] Activates the sorting engine on the newly created headers
		setTimeout(() => {
			// [ITA] Trova la tabella generata nel resultContainer
			// [ENG] Finds the generated table inside resultContainer
			const table = resultContainer.querySelector('table');
			// [ITA] Se la tabella non viene trovata, esce dalla funzione
			// [ENG] If table is not found, exits the function
			if (!table) return;
			// [ITA] Funzione ausiliaria per estrarre il valore di testo da una cella
			// [ENG] Helper function to extract text content from a cell
			const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
			// [ITA] Funzione di comparazione per ordinare le righe in base al tipo di contenuto
			// [ENG] Comparator function to sort rows based on content type
			const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
				v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)
					? v1 - v2
					: v1.toString().localeCompare(v2, undefined, {numeric: true})
			)(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
			// [ITA] Configura il listener per il click su tutte le intestazioni (th) della tabella
			// [ENG] Configures the click listener for all table headers (th)
			table.querySelectorAll('th').forEach(th => {
				// [ITA] Imposta il cursore a forma di puntatore sull'intestazione
				// [ENG] Sets pointer cursor on the header
				th.style.cursor = "pointer";
				// [ITA] Gestisce il click sull'intestazione per invertire e applicare l'ordinamento
				// [ENG] Handles header click to toggle and apply sorting
				th.addEventListener('click', function() {
					// [ITA] Seleziona l'elemento tbody della tabella contenente tutte le righe di dati
					// [ENG] Selects the table's tbody element containing all data rows
					const tbody = table.querySelector('tbody');
					// [ITA] Inverte il senso di ordinamento memorizzato nell'intestazione (da ascendente a discendente o viceversa)
					// [ENG] Toggles the stored sorting direction on the header (from ascending to descending or vice versa)
					this.asc = !this.asc;
					// [ITA] Converte la NodeList di tutte le righe (tr) presente in tbody in un Array per consentirne l'ordinamento
					// [ENG] Converts the NodeList of all rows (tr) within tbody into an Array to allow sorting
					Array.from(tbody.querySelectorAll('tr'))
						// [ITA] Ordina le righe invocando la funzione comparer passandole l'indice della colonna cliccata e la direzione (asc/desc)
						// [ENG] Sorts rows by invoking the comparer function with the clicked column index and direction (asc/desc)
						.sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc))
						// [ITA] Riavvolge e riappende ciascuna riga ordinata al tbody, aggiornando la visualizzazione DOM della tabella
						// [ENG] Re-appends each sorted row back into the tbody, updating the table's DOM view
						.forEach(tr => tbody.appendChild(tr));
				});
			});
		// [ITA] Piccolo delay di sicurezza per dare tempo a Dataview di stampare l'HTML della tabella
		// [ENG] Small safety delay to give Dataview time to render the table HTML
		}, 50);
	}
});

```