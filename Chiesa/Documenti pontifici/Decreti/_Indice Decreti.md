---
cssclasses: indice
licenza-nota: Copyright © 2025 Emanuele Tinari under Creative Commons BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
ideatore: "Emanuele Tinari"
sviluppatore: ["Emanuele Tinari", "Gemini Web App"]
nomeFile: "_Indice Decreti.md"
creato: 2025/10/26 23:07:59
modificato: 2026/08/24 21:42:30
---


# Indice di tutti i Decreti pontifici


<div style="text-align: center; color: red; font-size: 1.2rem;"><span>Cliccando sull’intestazione della colonna si ordinano i documenti in maniera ascendente o discendente.</span></div>


```dataviewjs

/*
===================================================
📌 INDICE DINAMICO INTERATTIVO DEI DECRETI PONTIFICI
===================================================

ITA
--------
DESCRIZIONE:
Questo script DataviewJS genera una tabella interattiva dei file Markdown contenuti
nella cartella "Documenti pontifici/Decreti", escludendo tutti i file che iniziano per "_".
Visualizza i dati metadata (progressivo, numero, autore, data formattata, titolo, link al file)
e permette l'ordinamento dinamico delle colonne al clic sulle intestazioni di tabella.


ENG
--------
DESCRIPTION:
This DataviewJS script generates an interactive table of Markdown files located in the
"Documenti pontifici/Decreti" folder, excluding all files starting with "_".
It displays metadata fields (progressive ID, number, author, formatted date, title, file link)
and enables dynamic column sorting upon clicking table headers.
*/


// [ITA] Apre un blocco di codice isolato (scope) per evitare conflitti di variabili ad ogni ricaricamento della nota.
// [ENG] Opens an isolated code block (scope) to prevent variable conflicts on every note reload.
{
	// [ITA] Definisce il percorso della cartella del vault da cui recuperare i documenti.
	// [ENG] Defines the vault folder path from which to retrieve the documents.
	const workingFolder = "Documenti pontifici/Decreti";
	// [ITA] Crea una stringa HTML formattata per rappresentare visivamente i campi metadata mancanti.
	// [ENG] Creates a formatted HTML string to visually represent missing metadata fields.
	const missing = `<span style="color:red; font-weight:bold;">X</span>`;
	// [ITA] Interroga Dataview per ottenere tutte le pagine presenti nella cartella specificata.
	// [ENG] Queries Dataview to retrieve all pages located inside the specified folder.
	const pages = dv.pages(`"${workingFolder}"`)
		// [ITA] Filtra le pagine mantenendo solo i file con estensione ".md".
		// [ENG] Filters pages to keep only files with the ".md" extension.
		.where(p =>
			p.file.ext === "md" &&
			// [ITA] Esclude dal risultato i file il cui nome inizia con il carattere di sottolineatura ("_").
			// [ENG] Excludes files whose name starts with an underscore ("_") from the result.
			!p.file.name.startsWith("_")
		// [ITA] Chiude la funzione di filtraggio .where().
		// [ENG] Closes the .where() filtering function.
		);
	// [ITA] Ordina le pagine filtrate in base al campo metadata "progr-doc" in ordine crescente.
	// [ENG] Sorts the filtered pages based on the "progr-doc" metadata field in ascending order.
	const ordered = pages.sort((a, b) => (a["progr-doc"] ?? 0) - (b["progr-doc"] ?? 0));
	// [ITA] Controlla se l'elenco delle pagine trovate è vuoto.
	// [ENG] Checks if the array of retrieved pages is empty.
	if (pages.length == 0) {
		// [ITA] Stampa un messaggio di avviso nel caso in cui non venga trovato alcun file valido.
		// [ENG] Prints a warning message in case no valid files are found.
		dv.paragraph("⚠️ Nessun file trovato con i campi richiesti in folder “" + workingFolder + "”. Verifica frontmatter e nomi dei campi.");
	// [ITA] Chiude il ramo 'if' ed esegue il ramo 'else' se è stato trovato almeno un file valido.
	// [ENG] Closes the 'if' branch and executes the 'else' branch if at least one valid file is found.
	}
	else {
		// [ITA] Genera la tabella HTML di Dataview specificando le intestazioni delle colonne e i dati delle righe.
		// [ENG] Generates the Dataview HTML table specifying column headers and row data.
		dv.table(
			// [ITA] Definisce i titoli delle 6 colonne della tabella.
			// [ENG] Defines the titles for the 6 table columns.
			['Progr', 'Num', 'Autore', 'Data', 'Titolo', 'File'],
			// [ITA] Mappa ciascuna pagina ordinata in un array di valori corrispondenti alle colonne.
			// [ENG] Maps each sorted page into an array of values corresponding to the columns.
			ordered.map(b => [
				// [ITA] Inserisce il valore di "progr-doc" oppure il placeholder rosso se assente.
				// [ENG] Inserts the "progr-doc" value or the red placeholder if missing.
				b["progr-doc"] ?? missing,
				// [ITA] Inserisce il valore di "num-doc" oppure il placeholder rosso se assente.
				// [ENG] Inserts the "num-doc" value or the red placeholder if missing.
				b["num-doc"] ?? missing,
				// [ITA] Inserisce il valore di "autore-doc" oppure il placeholder rosso se assente.
				// [ENG] Inserts the "autore-doc" value or the red placeholder if missing.
				b["autore-doc"] ?? missing,
				// [ITA] Controlla se il campo "data-doc" è presente nella nota.
				// [ENG] Checks whether the "data-doc" field exists in the note.
				b["data-doc"]
					// [ITA] Se presente, formatta la data in gg-mm-aaaa e la avvolge in uno span contenente l'attributo ISO per il sorting.
					// [ENG] If present, formats the date as dd-mm-yyyy and wraps it in a span with an ISO attribute for sorting.
					? `<span data-iso="${b["data-doc"]}">${dv.luxon.DateTime.fromISO(b["data-doc"]).toFormat('dd-MM-yyyy')}</span>`
					// [ITA] Se assente, utilizza il placeholder di valore mancante.
					// [ENG] If missing, uses the missing value placeholder.
					: missing,
				// [ITA] Inserisce il valore di "titolo-doc" oppure il placeholder rosso se assente.
				// [ENG] Inserts the "titolo-doc" value or the red placeholder if missing.
				b["titolo-doc"] ?? missing,
				// [ITA] Crea un link interno cliccabile di Obsidian verso il file corrente.
				// [ENG] Creates a clickable Obsidian internal link pointing to the current file.
				dv.fileLink(b.file.path, false)
			// [ITA] Chiude l'array di mappatura delle righe della tabella.
			// [ENG] Closes the table row mapping array.
			])
		// [ITA] Chiude la chiamata alla funzione dv.table.
		// [ENG] Closes the dv.table function call.
		);
	// [ITA] Definisce la funzione per estrarre il valore confrontabile da una cella della tabella.
	// [ENG] Defines the function to extract a comparable value from a table cell.
	const getCellValue = (tr, idx) => {
		// [ITA] Seleziona l'elemento cella (td) corrispondente all'indice di colonna specificato.
		// [ENG] Selects the cell element (td) matching the specified column index.
		const cell = tr.children[idx];
		// [ITA] Cerca all'interno della cella un elemento span che possiede l'attributo "data-iso".
		// [ENG] Looks inside the cell for a span element that has the "data-iso" attribute.
		const span = cell.querySelector('span[data-iso]');
		// [ITA] Restituisce il valore ISO se presente, altrimenti il testo semplice della cella.
		// [ENG] Returns the ISO value if present, otherwise the plain text of the cell.
		return span ? span.getAttribute('data-iso') : (cell.innerText || cell.textContent);
	// [ITA] Chiude il blocco della funzione getCellValue.
	// [ENG] Closes the getCellValue function block.
	};
	// [ITA] Definisce la funzione di comparazione per ordinare due righe della tabella.
	// [ENG] Defines the comparator function to sort two table rows.
	const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
		// [ITA] Controlla se entrambi i valori estratti sono numerici e non vuoti.
		// [ENG] Checks if both extracted values are non-empty and numeric.
		v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)
		// [ITA] Se numerici, esegue una sottrazione algebrica per determinare l'ordine.
		// [ENG] If numeric, performs algebraic subtraction to determine order.
		? v1 - v2
		// [ITA] Altrimenti, esegue un confronto tra stringhe in ordine alfabetico o naturale.
		// [ENG] Otherwise, performs a natural string comparison.
		: v1.toString().localeCompare(v2, undefined, {numeric: true})
	// [ITA] Invoca la closure passando i valori di cella estratti invertendo l'ordine in base al flag 'asc'.
	// [ENG] Invokes the closure passing extracted cell values inverted according to the 'asc' flag.
	)(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
		// [ITA] Attende che il rendering della tabella nel DOM sia completato prima di associare la logica interattiva.
		// [ENG] Waits for the table DOM rendering to complete before attaching interactive logic.
		setTimeout(() => {
			// [ITA] Ottiene il riferimento al contenitore DOM locale del blocco Dataview corrente.
			// [ENG] Gets the reference to the local DOM container of the current Dataview block.
			const container = dv.container;
			// [ITA] Seleziona tutte le intestazioni di colonna (th) presenti solo nel contenitore locale ed esegue un ciclo su ciascuna.
			// [ENG] Selects all column headers (th) within the local container only and iterates over each.
			container.querySelectorAll('th').forEach((th, idx) => {
				// [ITA] Imposta il cursore del mouse a forma di puntatore per indicare che l'intestazione è cliccabile.
				// [ENG] Sets the mouse cursor to a pointer to indicate that the header is clickable.
				th.style.cursor = "pointer";
				// [ITA] Aggiunge un ascoltatore di eventi per intercettare il clic dell'utente sull'intestazione.
				// [ENG] Adds an event listener to capture user clicks on the column header.
				th.addEventListener('click', function() {
					// [ITA] Risale l'albero DOM per trovare l'elemento tabella genitore dell'intestazione cliccata.
					// [ENG] Navigates up the DOM tree to find the parent table element of the clicked header.
					const table = th.closest('table');
					// [ITA] Seleziona l'elemento tbody contenente le righe di dati della tabella.
					// [ENG] Selects the tbody element containing the table's data rows.
					const tbody = table.querySelector('tbody');
					// [ITA] Inverte lo stato dell'ordinamento (da ascendente a discendente o viceversa).
					// [ENG] Toggles the sort direction state (from ascending to descending or vice-versa).
					this.asc = !this.asc;
					// [ITA] Converte la NodeList delle righe in array, le ordina tramite 'comparer' e le riattacca al tbody.
					// [ENG] Converts the rows NodeList into an array, sorts them using 'comparer', and re-appends them to tbody.
					Array.from(tbody.querySelectorAll('tr'))
						.sort(comparer(idx, this.asc))
						.forEach(tr => tbody.appendChild(tr));
				// [ITA] Chiude la funzione di callback del gestore di evento 'click'.
				// [ENG] Closes the 'click' event handler callback function.
				});
			// [ITA] Chiude il ciclo forEach per le intestazioni della tabella.
			// [ENG] Closes the forEach loop for the table headers.
			});
		// [ITA] Chiude il timer setTimeout impostato a 50 millisecondi.
		// [ENG] Closes the setTimeout timer set to 50 milliseconds.
		}, 50);
	// [ITA] Chiude il ramo 'else'.
	// [ENG] Closes the 'else' branch.
	}
// [ITA] Chiude il blocco di codice isolato principale.
// [ENG] Closes the main isolated code block scope.
}

```


