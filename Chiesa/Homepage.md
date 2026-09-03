---
cssclasses: interfaccia
licenza-nota: Copyright © 2026 Emanuele Tinari under Creative Commons BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
ideatore: "Emanuele Tinari"
sviluppatore: ["Emanuele Tinari", "Gemini Web App"]
nomeFile: "Homepage.md"
creato: 2026/03/16 13:59:55
modificato: 2026/09/03 07:33:17
---


```dataviewjs
// [ITA] Mappa delle estensioni di file stilizzata secondo le convenzioni di Windows.
// [ENG] Map of file extensions styled according to Windows conventions.
const winNames = {
    // [ITA] Configurazione per le estensioni appartenenti alla categoria Documenti e Testo.
    // [ENG] Configuration for extensions belonging to the Documents and Text category.
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i file Markdown.
    // [ENG] Defines the descriptive name and formatted extension for Markdown files.
    "md": ["File di Markdown", "(*.md)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i file PDF.
    // [ENG] Defines the descriptive name and formatted extension for PDF files.
    "pdf": ["File di Adobe Acrobat", "(*.pdf)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i file di testo semplice.
    // [ENG] Defines the descriptive name and formatted extension for plain text files.
    "txt": ["Documento di testo", "(*.txt)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i file Microsoft Word moderni.
    // [ENG] Defines the descriptive name and formatted extension for modern Microsoft Word files.
    "docx": ["File di Microsoft Word", "(*.docx)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i file Microsoft Word legacy.
    // [ENG] Defines the descriptive name and formatted extension for legacy Microsoft Word files.
    "doc": ["File di Microsoft Word 97-2003", "(*.doc)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i file Microsoft Excel moderni.
    // [ENG] Defines the descriptive name and formatted extension for modern Microsoft Excel files.
    "xlsx": ["File di Microsoft Excel", "(*.xlsx)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i file Excel abilitati alle macro.
    // [ENG] Defines the descriptive name and formatted extension for macro-enabled Excel files.
    "xlsm": ["File di Microsoft Excel con attivazione macro", "(*.xlsm)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i file Microsoft Excel legacy.
    // [ENG] Defines the descriptive name and formatted extension for legacy Microsoft Excel files.
    "xls": ["File di Microsoft Excel 97-2003", "(*.xls)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i file di dati CSV.
    // [ENG] Defines the descriptive name and formatted extension for CSV data files.
    "csv": ["File di valori separati da virgola Microsoft Excel", "(*.csv)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i file Microsoft Publisher.
    // [ENG] Defines the descriptive name and formatted extension for Microsoft Publisher files.
    "pub": ["File di Microsoft Publisher", "(*.pub)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i file in formato Rich Text.
    // [ENG] Defines the descriptive name and formatted extension for Rich Text Format files.
    "rtf": ["Formato Rich Text", "(*.rtf)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i libri digitali EPUB.
    // [ENG] Defines the descriptive name and formatted extension for EPUB e-books.
    "epub": ["File EPUB", "(*.epub)"],
    // [ITA] Configurazione per le estensioni appartenenti alla categoria Immagini e Media.
    // [ENG] Configuration for extensions belonging to the Images and Media category.
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per le immagini JPG.
    // [ENG] Defines the descriptive name and formatted extension for JPG images.
    "jpg": ["Immagine JPEG", "(*.jpg)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per le immagini JPEG.
    // [ENG] Defines the descriptive name and formatted extension for JPEG images.
    "jpeg": ["Immagine JPEG", "(*.jpeg)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per le immagini PNG.
    // [ENG] Defines the descriptive name and formatted extension for PNG images.
    "png": ["Immagine PNG", "(*.png)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per le immagini animate GIF.
    // [ENG] Defines the descriptive name and formatted extension for GIF animated images.
    "gif": ["Immagine GIF", "(*.gif)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per le immagini vettoriali SVG.
    // [ENG] Defines the descriptive name and formatted extension for SVG vector images.
    "svg": ["Immagine Scalable Vector Graphics", "(*.svg)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per le immagini WebP.
    // [ENG] Defines the descriptive name and formatted extension for WebP images.
    "webp": ["Immagine WebP", "(*.webp)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i file audio MP3.
    // [ENG] Defines the descriptive name and formatted extension for MP3 audio files.
    "mp3": ["File MP3", "(*.mp3)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i file video MP4.
    // [ENG] Defines the descriptive name and formatted extension for MP4 video files.
    "mp4": ["Video MP4", "(*.mp4)"],
    // [ITA] Configurazione per le estensioni appartenenti alla categoria Programmazione e Web.
    // [ENG] Configuration for extensions belonging to the Programming and Web category.
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per gli script Python.
    // [ENG] Defines the descriptive name and formatted extension for Python script files.
    "py": ["File di script Python", "(*.py)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per gli script JavaScript.
    // [ENG] Defines the descriptive name and formatted extension for JavaScript script files.
    "js": ["File di script JavaScript", "(*.js)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i documenti HTML.
    // [ENG] Defines the descriptive name and formatted extension for HTML documents.
    "html": ["Firefox HTML Document", "(*.html)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i fogli di stile CSS.
    // [ENG] Defines the descriptive name and formatted extension for CSS stylesheets.
    "css": ["Foglio di stile", "(*.css)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i file dati JSON.
    // [ENG] Defines the descriptive name and formatted extension for JSON data files.
    "json": ["File JSON", "(*.json)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per gli script PowerShell.
    // [ENG] Defines the descriptive name and formatted extension for PowerShell scripts.
    "ps1": ["Script di Windows PowerShell", "(*.ps1)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i file batch di Windows.
    // [ENG] Defines the descriptive name and formatted extension for Windows batch files.
    "bat": ["File batch di Windows", "(*.bat)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per il codice sorgente C++.
    // [ENG] Defines the descriptive name and formatted extension for C++ source files.
    "cpp": ["C++ Source File", "(*.cpp)"],
    // [ITA] Configurazione per le estensioni appartenenti alla categoria Archivi e Sistema.
    // [ENG] Configuration for extensions belonging to the Archives and System category.
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per gli archivi 7Zip.
    // [ENG] Defines the descriptive name and formatted extension for 7Zip archives.
    "7z": ["Archivio 7Zip", "(*.7z)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per gli archivi Zip.
    // [ENG] Defines the descriptive name and formatted extension for Zip archives.
    "zip": ["Archivio Zip", "(*.zip)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per gli archivi WinRAR.
    // [ENG] Defines the descriptive name and formatted extension for WinRAR archives.
    "rar": ["Archivio WinRAR", "(*.rar)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per i file temporanei.
    // [ENG] Defines the descriptive name and formatted extension for temporary files.
    "tmp": ["File temporaneo", "(*.tmp)"],
    // [ITA] Definisce il nome descrittivo e l'estensione formattata per le tele di Obsidian Canvas.
    // [ENG] Defines the descriptive name and formatted extension for Obsidian Canvas boards.
    "canvas": ["Obsidian Canvas", "(*.canvas)"]
};
// [ITA] Array di oggetti contenente i comandi rapidi da mostrare nell'interfaccia dell'applicazione.
// [ENG] Array of objects containing quick commands to be displayed in the application UI.
const comandiRapidi = [
    // [ITA] Inizio della definizione del primo oggetto comando rapido per la barra laterale sinistra.
    // [ENG] Start of definition for the first quick command object for the left sidebar.
    {
        // [ITA] Identificativo univoco del comando interno di Obsidian per commutare la barra sinistra.
        // [ENG] Unique identifier for the internal Obsidian command to toggle the left sidebar.
        id: "app:toggle-left-sidebar",
        // [ITA] Etichetta di testo visualizzata per l'azione della barra sinistra.
        // [ENG] Display text label for the left sidebar action.
        label: "Apri/Chidi barra laterale SINISTRA"
    },
    // [ITA] Inizio della definizione del comando rapido per la creazione di un nuovo file.
    // [ENG] Start of definition for the quick command to create a new file.
    {
        // [ITA] Identificativo univoco del comando per creare un nuovo documento.
        // [ENG] Unique identifier for the command to create a new file.
        id: "file-explorer:new-file",
        // [ITA] Etichetta di testo visualizzata con l'indicazione della scorciatoia da tastiera.
        // [ENG] Display text label with keyboard shortcut indication.
        label: "Crea nuovo file (Ctrl + N)"
    },
    // [ITA] Inizio della definizione del comando rapido per la barra laterale destra.
    // [ENG] Start of definition for the quick command for the right sidebar.
    {
        // [ITA] Identificativo univoco del comando per commutare la barra destra.
        // [ENG] Unique identifier for the command to toggle the right sidebar.
        id: "app:toggle-right-sidebar",
        // [ITA] Etichetta di testo visualizzata per l'azione della barra destra.
        // [ENG] Display text label for the right sidebar action.
        label: "Apri/Chidi barra laterale DESTRA"
    },
    // [ITA] Inizio della definizione del comando rapido per l'apertura dello switcher di file.
    // [ENG] Start of definition for the quick command to open the file switcher.
    {
        // [ITA] Identificativo univoco del comando per attivare lo switcher rapido.
        // [ENG] Unique identifier for the command to trigger quick switcher.
        id: "switcher:open",
        // [ITA] Etichetta di testo visualizzata con l'indicazione della scorciatoia per la ricerca rapida.
        // [ENG] Display text label with keyboard shortcut indication for quick search.
        label: "Vai al file (Ctrl + O)"
    },
    // [ITA] Inizio della definizione del comando rapido per la funzione di visualizzazione web.
    // [ENG] Start of definition for the quick command for web viewer functionality.
    {
        // [ITA] Identificativo univoco del comando per aprire il browser web integrato.
        // [ENG] Unique identifier for the command to open the built-in web viewer.
        id: "webviewer:open",
        // [ITA] Etichetta di testo visualizzata per il visualizzatore web.
        // [ENG] Display text label for the web viewer.
        label: "Visualizzatore web"
    },
    // [ITA] Inizio della definizione del comando rapido per chiudere l'area di lavoro attiva.
    // [ENG] Start of definition for the quick command to close the active workspace.
    {
        // [ITA] Identificativo univoco del comando per chiudere la scheda o l'area di lavoro corrente.
        // [ENG] Unique identifier for the command to close current tab or workspace.
        id: "workspace:close",
        // [ITA] Etichetta di testo visualizzata per il comando di chiusura.
        // [ENG] Display text label for the close command.
        label: "Chiudi"
    },
    // [ITA] Inizio della definizione del comando rapido per aprire le impostazioni dell'applicazione.
    // [ENG] Start of definition for the quick command to open application settings.
    {
        // [ITA] Identificativo univoco del comando per accedere al pannello impostazioni.
        // [ENG] Unique identifier for the command to access settings panel.
        id: "app:open-settings",
        // [ITA] Etichetta di testo visualizzata per accedere alle opzioni di configurazione.
        // [ENG] Display text label for accessing configuration options.
        label: "Impostazioni"
    }
];
// [ITA] Inizio della funzione anonima asincrona per isolare la logica dello script.
// [ENG] Start of the anonymous async function to encapsulate script logic.
(async () => {
    // [ITA] Definisce la funzione asincrona interna dedicata al calcolo e aggiornamento delle statistiche del vault.
    // [ENG] Defines the internal async function dedicated to calculating and updating vault statistics.
    const updateStats = async () => {
        // [ITA] Estrae la lista completa di tutti i file memorizzati all'interno della cassaforte corrente.
        // [ENG] Retrieves the complete list of all files stored inside the current vault.
        const allFiles = app.vault.getFiles();
        // [ITA] Inizializza un oggetto vuoto destinato ad accumulare i conteggi e le dimensioni per estensione.
        // [ENG] Initializes an empty object intended to accumulate counts and sizes per extension.
        const stats = {};
        // [ITA] Itera attraverso ciascun elemento presente nell'array dei file recuperati dal vault.
        // [ENG] Iterates through each element present in the array of files retrieved from the vault.
        allFiles.forEach(f => {
            // [ITA] Estrae l'estensione del file in formato minuscolo o assegna un valore predefinito se assente.
            // [ENG] Extracts the file extension in lowercase format or assigns a default value if missing.
            const ext = (f.extension || "N. A.").toLowerCase();
            // [ITA] Inizializza la struttura dati per la specifica estensione nel caso non sia ancora stata registrata.
            // [ENG] Initializes the data structure for the specific extension if it hasn't been registered yet.
            if (!stats[ext]) stats[ext] = { count: 0, size: 0 };
            // [ITA] Incrementa di una unità il contatore dei file per la determinata estensione.
            // [ENG] Increments the file counter for the given extension by one unit.
            stats[ext].count++;
            // [ITA] Somma la dimensione in byte del file corrente al totale parziale dell'estensione.
            // [ENG] Adds the current file size in bytes to the running total for this extension.
            stats[ext].size += f.stat.size;
        });
        // [ITA] Inizializza la variabile per accumulare la stringa di codice HTML per il rendering della tabella.
        // [ENG] Initializes the variable to accumulate the HTML code string for rendering the table.
        let htmlContent = "";
        // [ITA] Converte l'oggetto statistiche in un array e lo ordina per numero di file decrescente.
        // [ENG] Converts the stats object into an array and sorts it by descending file count.
        const sortedStats = Object.entries(stats).sort((a, b) => b[1].count - a[1].count);
        // [ITA] Costruisce il tag di apertura della griglia CSS all'interno della sintassi callout di Markdown.
        // [ENG] Builds the opening CSS grid tag inside the Markdown callout syntax.
        htmlContent = `> <div style="border: 0.05rem solid var(--background-modifier-border); display: grid; grid-template-columns: auto 1fr auto auto; margin-left: 1.2rem; margin-top: 2rem; width: fit-content;">\n`;
        // [ITA] Cicla attraverso la lista ordinata delle statistiche delle estensioni dei file.
        // [ENG] Loops through the sorted list of file extension statistics.
        for (const [ext, data] of sortedStats) {
            // [ITA] Introduce un'interruzione di 25 millisecondi per prevenire il blocco del rendering dell'interfaccia.
            // [ENG] Introduces a 25-millisecond pause to prevent freezing the UI rendering pipeline.
            await new Promise(r => setTimeout(r, 25));
            // [ITA] Estrae la configurazione del nome dell'estensione o assegna valori generici di ripiego.
            // [ENG] Extracts extension name configuration or assigns generic fallback values.
            const [nome, estensione] = winNames[ext] || [`File ${ext.toUpperCase()}`, `*.${ext}` ];
            // [ITA] Converte la dimensione totale espressa in byte nel valore arrotondato in kilobyte.
            // [ENG] Converts total size expressed in bytes into a rounded kilobyte value.
            const sizeKb = Math.round(data.size / 1024).toLocaleString('it-IT');
            // [ITA] Calcola la dimensione totale formattata in megabyte con tre cifre decimali.
            // [ENG] Calculates total size formatted in megabytes with three decimal places.
            const sizeMb = (data.size / (1024 * 1024)).toLocaleString('it-IT', {
                // [ITA] Imposta il numero minimo di cifre decimali per la formattazione dei megabyte.
                // [ENG] Sets minimum decimal digits for megabyte formatting.
                minimumFractionDigits: 3,
                // [ITA] Imposta il numero massimo di cifre decimali per la formattazione dei megabyte.
                // [ENG] Sets maximum decimal digits for megabyte formatting.
                maximumFractionDigits: 3
            });
            // [ITA] Genera la cella della tabella HTML per visualizzare il numero di file associati.
            // [ENG] Generates the HTML table cell displaying the number of associated files.
            htmlContent += `> <div style="border: 0.05rem solid var(--background-modifier-border); padding: 0.4rem 1rem; text-align: right;">${data.count}</div>`;
            // [ITA] Genera la cella della tabella HTML per il nome esteso e descrittivo del tipo di file.
            // [ENG] Generates the HTML table cell for the extended descriptive file type name.
            htmlContent += `<div style="border: 0.05rem solid var(--background-modifier-border); padding: 0.4rem 1rem; text-align: left;">${nome}</div>`;
            // [ITA] Genera la cella della tabella HTML che mostra il pattern dell'estensione.
            // [ENG] Generates the HTML table cell showing the extension pattern.
            htmlContent += `<div style="border: 0.05rem solid var(--background-modifier-border); padding: 0.4rem 1rem; text-align: center;">${estensione}</div>`;
            // [ITA] Genera la cella finale con il peso formattato in Megabyte e Kilobyte.
            // [ENG] Generates the final cell with formatted size in Megabytes and Kilobytes.
            htmlContent += `<div style="align-items: center; border: 0.05rem solid var(--background-modifier-border); display: flex; font-family: monospace; font-size: 0.8em; justify-content: flex-end; padding: 0.5rem 1rem 0.3rem 1rem; text-align: right;">${sizeMb} MB (${sizeKb} KB)</div>\n`;
        } // [ITA] Fine del ciclo di iterazione sulle estensioni ordinati.
        // [ENG] End of iteration loop over sorted extensions.
        htmlContent += `> </div>\n`;
        // [ITA] Somma le dimensioni di ciascun singolo file per ottenere il peso complessivo del vault.
        // [ENG] Sums the size of each individual file to compute the total size of the vault.
        const totalSize = allFiles.reduce((acc, f) => acc + f.stat.size, 0);
        // [ITA] Converte il peso complessivo da byte a megabyte formattandolo con due decimali.
        // [ENG] Converts total weight from bytes to megabytes formatting with two decimals.
        const totalMb = (totalSize / (1024 * 1024)).toLocaleString('it-IT', { minimumFractionDigits: 2 });
        // [ITA] Costruisce l'etichetta badge in HTML con il numero totale di file e lo spazio occupato.
        // [ENG] Builds HTML badge label containing total file count and occupied space.
        const badge = `<span style="background: rgba(0,0,0,0.2); border-radius: 4px; color: white !important; font-weight: 400; margin-left: 0.5rem; padding: 0 1rem;">${allFiles.length} file&nbsp;&nbsp;&nbsp;&nbsp;⟶&nbsp;&nbsp;&nbsp;&nbsp;${totalMb} MB</span>`;
        // [ITA] Svuota completamente il contenuto dell'elemento contenitore prima di procedere al nuovo rendering.
        // [ENG] Completely empties the content of container element before proceeding with new render.
        dv.container.innerHTML = "";
        // [ITA] Inserisce il blocco callout formattato nell'interfaccia utente utilizzando l'API nativa Dataview.
        // [ENG] Renders the formatted callout block in UI using native Dataview API.
        await dv.el("div", `> [!info]- Numero totale file nel vault: ${badge}\n${htmlContent}`);
    }
// [ITA] Inizio della seconda IIFE per gestire l'interazione con le barre laterali e gli eventi.
// [ENG] Start of the second IIFE to handle interaction with sidebars and application events.
(async () => {
    // [ITA] Cerca nel documento HTML l'elemento principale dell'area di lavoro dell'applicazione.
    // [ENG] Queries the HTML document for the main workspace element of the application.
    const workspace = document.querySelector('.workspace');
    // [ITA] Verifica l'esistenza dell'elemento workspace e interrompe l'esecuzione se non trovato.
    // [ENG] Checks if workspace element exists and halts execution if not found.
    if (!workspace) return;
    // [ITA] Rileva se il pannello della barra laterale sinistra è attualmente visibile.
    // [ENG] Detects if the left sidebar panel is currently visible.
    const isLeftOpen = workspace.classList.contains('is-left-sidedock-open');
    // [ITA] Rileva se il pannello della barra laterale destra è attualmente visibile.
    // [ENG] Detects if the right sidebar panel is currently visible.
    const isRightOpen = workspace.classList.contains('is-right-sidedock-open');
    // [ITA] Valuta la condizione di apertura per chiudere la barra laterale sinistra se aperta.
    // [ENG] Evaluates open state to close the left sidebar if currently opened.
    if (isLeftOpen) {
        // [ITA] Invia il comando interno per nascondere il pannello laterale sinistro.
        // [ENG] Triggers internal command to hide the left side panel.
        app.commands.executeCommandById('app:toggle-left-sidebar');
    }
    // [ITA] Valuta la condizione di apertura per chiudere la barra laterale destra se aperta.
    // [ENG] Evaluates open state to close the right sidebar if currently opened.
    if (isRightOpen) {
        // [ITA] Invia il comando interno per nascondere il pannello laterale destro.
        // [ENG] Triggers internal command to hide the right side panel.
        app.commands.executeCommandById('app:toggle-right-sidebar');
    }
	// Esegue le righe comuni
    // [ITA] Inserisce una breve pausa per stabilizzare il layout dell'interfaccia dopo la chiusura dei pannelli.
    // [ENG] Inserts a short delay to stabilize interface layout after closing sidebars.
    await new Promise(r => setTimeout(r, 50));
    // [ITA] Controlla che la funzione di calcolo delle statistiche sia correttamente definita prima dell'invocazione.
    // [ENG] Verifies that statistics calculation function is properly defined prior to invocation.
    if (typeof updateStats === 'function') {
        // [ITA] Esegue la funzione di calcolo per aggiornare e mostrare i dati aggiornati del vault.
        // [ENG] Executes calculation function to update and display refreshed vault data.
        await updateStats();
    }
	// Registrazione eventi sul componente per evitare memory leak
    // [ITA] Accede all'istanza del componente genitore all'interno del contesto di Dataview.
    // [ENG] Accesses the parent component instance inside Dataview context.
    const component = dv.container.component;
    // [ITA] Verifica la presenza del componente prima di procedere con l'associazione degli eventi DOM.
    // [ENG] Checks for component presence before proceeding with DOM event binding.
    if (component) {
        // [ITA] Registra l'ascoltatore per l'evento di focus della finestra prevenendo le perdite di memoria.
        // [ENG] Registers event listener for window focus event preventing memory leaks.
        component.registerDomEvent(window, 'focus', () => updateStats());
        // [ITA] Registra l'ascoltatore per l'evento di sfocatura della finestra garantendo il ciclo di vita corretto.
        // [ENG] Registers event listener for window blur event ensuring proper component lifecycle.
        component.registerDomEvent(window, 'blur', () => updateStats());
    }
	// --- BLOCCO LINK STATICI ---
    // [ITA] Genera un elemento div contenitore destinato ad ospitare la pulsantiera dei comandi rapidi.
    // [ENG] Generates a container div element intended to hold the quick command action items.
    const containerAzioni = dv.container.createEl("div", {
        // [ITA] Assegna la classe CSS nativa per uniformare lo stile del contenitore allo stato vuoto.
        // [ENG] Assigns native CSS class to conform container style to empty-state layout.
        cls: `empty-state-container`,
        // [ITA] Imposta gli attributi di stile inline per centrare e limitare i bordi del contenitore.
        // [ENG] Sets inline style attributes to center and bound the borders of the container.
        attr: {
            style: `
                border: 0.1rem solid var(--background-modifier-border);
                margin: 0.5rem auto;
                max-width: 100%;
                padding: 1rem;
                width: fit-content;
            `
        }
    });
	// Iniezione nel DOM della nota
    // [ITA] Crea l'elemento griglia interno per organizzare visivamente i pulsanti di azione rapida.
    // [ENG] Creates internal grid element to visually structure the quick action buttons.
    const listActions = containerAzioni.createEl("div", {
        // [ITA] Applica la classe specifica per la lista delle azioni sullo stato vuoto.
        // [ENG] Applies specific class for action list layout on empty state.
        cls: `empty-state-action-list`,
        // [ITA] Configura il layout a griglia diviso su 3 colonne con formattazione CSS inline.
        // [ENG] Configures grid layout split into 3 columns using inline CSS formatting.
        attr: {
            style: `
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 0rem 1rem;
                text-align: left;
            `
        }
    });
    // [ITA] Cicla su ogni elemento dell'array comandiRapidi per generare i rispettivi elementi interattivi.
    // [ENG] Loops over every item in comandiRapidi array to create respective interactive elements.
    comandiRapidi.forEach(cmd => {
        // [ITA] Crea un nuovo div rappresentante il singolo pulsante per l'esecuzione del comando.
        // [ENG] Creates a new div element representing individual button for command execution.
        const btn = listActions.createEl("div", {
            // [ITA] Assegna le classi necessarie per abilitare gli stili nativi e l'effetto al passaggio del mouse.
            // [ENG] Assigns necessary classes to enable native styling and hover states.
            cls: "empty-state-action tappable",
            // [ITA] Inserisce il testo dell'etichetta del comando all'interno del nodo generato.
            // [ENG] Sets the command label text inside the generated node.
            text: cmd.label,
            // [ITA] Associa l'ID univoco e assegna gli stili di visualizzazione del pulsante via CSS.
            // [ENG] Binds unique ID and assigns visual styling properties for the button via CSS.
            attr: {
                "data-id": cmd.id,
                style: `
                    align-items: center;
                    color: var(--text-accent);
                    cursor: pointer;
                    font-size: 0.9em;
                    display: flex;
                `
            }
        });
		// Aggiunge il bullet manuale prima del testo
        // [ITA] Modifica la struttura HTML interna inserendo un punto elenco personalizzato prima dell'etichetta.
        // [ENG] Modifies inner HTML structure injecting a custom bullet point before the text label.
        btn.innerHTML = `<span style="color: var(--text-muted); margin-right: 0.5rem;">•</span> ${cmd.label}`;
        // [ITA] Collega un listener per l'evento di click sull'elemento per intercettare l'interazione dell'utente.
        // [ENG] Attaches event listener for click on element to intercept user interaction.
        btn.addEventListener('click', (e) => {
            // [ITA] Annulla il comportamento di default associato all'evento di click nel DOM.
            // [ENG] Prevents default behavior associated with the click event in DOM.
            e.preventDefault();
            // [ITA] Esegue il comando di Obsidian corrispondente all'identificatore memorizzato nell'oggetto.
            // [ENG] Triggers Obsidian command corresponding to the identifier stored in object.
            app.commands.executeCommandById(cmd.id);
        });
    });
	// --- FINE BLOCCO LINK STATICI ---
    // [ITA] Chiusura del blocco di codice per l'iniezione dei collegamenti dinamici alla GUI.
    // [ENG] Closing code block responsible for injecting dynamic UI action links.
})();
// [ITA] Chiusura della funzione wrapper anonima asincrona principale dello script.
// [ENG] Closing main anonymous async wrapper function of the script.
})();
```


> [!info]+ Operazioni quotidiane<div style="position: absolute; left: 50%; transform: translateX(-50%); color: white !important; white-space: nowrap;"><font style="font-size: 1.5em;"></font></div>
> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-left: 5em; margin-top: 0em;">
>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] [[_Utilità Dataviewjs/Scraper per i documenti Leone XIV su vatican-va|Nuovo documento Papa Leone XIV]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] [[_Utilità Dataviewjs/Scraper per i documenti pontefici passati su vatican-va|Nuovo documento pontefice passato]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] [[_Utilità Dataviewjs/Caricamento nuovo canto|Nuovo canto per le Liturgie]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] [[_Utilità Dataviewjs/Caricamento nuovo messaggio|Nuovo messaggio di Medjugorje]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] Santo del giorno
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] Messalino del giorno
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] Carica un nuovo capitolo della Sacra Bibbia
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] [[_Utilità Dataviewjs/Scraper per i testi su augustinus-it|Nuovo scritto Sant’Agostino]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] [[_Utilità Dataviewjs/Scraper per i documenti pontefici passati su vatican-va valori dalla Clipboard|Nuovo documento pontificio, valori dalla Clipboard]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] [[_Utilità Dataviewjs/Scraper per il sito valtortamaria-it|Nuovo capitolo Opera Maria Valtorta]]
>
> </div></div>
> </div>


<figure style="border-left: 2px solid var(--interactive-accent); margin: 2.5rem 0; padding-left: 1rem;">
	<blockquote style="border: none; color: rgb(255, 190, 92); font-family: 'citazioneCorsivo', serif; font-size: 2rem; font-style: normal; letter-spacing: 0.1rem; line-height: 1.1; margin: 0; padding: 0;">
		“Io non perseguito l’eretico nel corpo, ma gli faccio guerra con le parole – e non contro l’eretico, ma solo contro la sua eresia: non disprezzo l’uomo; è l’errore che odio, e che cerco di espellere da lui…<br>Sono abituato a essere perseguitato, non a perseguitare gli altri…<br>Così ha trionfato Cristo; Lui non ha crocifisso, ma è Lui invece che è stato crocifisso.<br>Non ha percosso gli altri, ma è Lui ad essere stato percosso.”
	</blockquote>
	<figcaption style="color: var(--text-muted); font-size: 1rem; font-weight: 400; margin-top: 0.8rem; text-align: right;">
	<span style="font-weight: 400;">– San Giovanni Crisostomo<br></span>
		<cite style="font-style: italic; opacity: 0.8;">PG 50, 701</cite>
	</figcaption>
</figure>


> [!info]+ Indici dei documenti<div style="position: absolute; left: 50%; transform: translateX(-50%); color: white !important; white-space: nowrap;"><font style="font-size: 1.5em;"></font></div>
> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-left: 5em; margin-top: 0em;">
>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Allocuzioni/_Indice Allocuzioni#Indice di tutte le Allocuzioni pontificie|Allocuzioni]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Angelus/_Indice Angelus#Indice di tutti gli Angelus pontifici|Angelus]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Bolle/_Indice Bolle#Indice di tutte le Bolle pontificie|Bolle]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Brevi/_Indice Brevi#Indice di tutti i Brevi pontifici|Brevi]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Brevi Encicliche/_Indice Brevi Encicliche#Indice di tutte le Brevi Encicliche pontificie|Brevi Encicliche]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Chirografi/_Indice Chirografi#Indice di tutti i Chirografi pontifici|Chirografi]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Costituzioni/_Indice Costituzioni#Indice di tutte le Costituzioni|Costituzioni]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Costituzioni apostoliche/_Indice Costituzioni apostoliche#Indice di tutte le Costituzioni apostoliche pontificie|Costituzioni apostoliche]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Costituzioni dogmatiche/_Indice Costituzioni dogmatiche#Indice di tutte le Costituzioni dogmatiche|Costituzioni dogmatiche]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Costituzioni pastorali/_Indice Costituzioni pastorali#Indice di tutte le Costituzioni pastorali|Costituzioni pastorali]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Decreti/_Indice Decreti#Indice di tutti i Decreti|Decreti]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Dichiarazioni/_Indice Dichiarazioni#Indice di tutte le Dichiarazioni|Dichiarazioni]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Discorsi/_Indice Discorsi#Indice di tutti i Discorsi pontifici|Discorsi]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Editti/_Indice Editti#Indice di tutti gli Editti pontifici|Editti]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Encicliche/_Indice Encicliche#Indice di tutte le Encicliche pontificie|Encicliche]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Esortazioni apostoliche/_Indice Esortazioni apostoliche#Indice di tutte le Esortazioni apostoliche pontificie|Esortazioni apostoliche]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Lettere/_Indice Lettere#Indice di tutte le Lettere pontificie|Lettere]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Lettere apostoliche/_Indice Lettere apostoliche#Indice di tutte le Lettere apostoliche pontificie|Lettere apostoliche]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Meditazioni quotidiane/_Indice Meditazioni quotidiane#Indice di tutte le Meditazioni quotidiane pontificie|Meditazioni quotidiane]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Messaggi/_Indice Messaggi#Indice di tutti i Messaggi pontifici|Messaggi]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Motu proprio/_Indice Motu proprio#Indice di tutti i Motu proprio pontifici|Motu proprio]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Omelie/_Indice Omelie#Indice di tutte le Omelie pontificie|Omelie]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Preghiere/_Indice Preghiere#Indice di tutte le Preghiere pontificie|Preghiere]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Proclami/_Indice Proclami#Indice di tutti i Proclami pontifici|Proclami]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Proteste/_Indice Proteste#Indice di tutte le Proteste pontificie|Proteste]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Radiomessaggi/_Indice Radiomessaggi#Indice di tutti i Radiomessaggi pontifici|Radiomessaggi]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Regina Caeli/_Indice Regina Caeli#Indice di tutti i Regina Caeli pontifici|Regina Caeli]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Udienze/_Indice Udienze#Indice di tutte le Udienze pontificie|Udienze]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Viaggi apostolici/_Indice Viaggi apostolici#Indice di tutti i Viaggi apostolici pontifici|Viaggi apostolici]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Visite pastorali/_Indice Visite pastorali#Indice di tutte le Visite pastorali|Visite pastorali]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Videomessaggi/_Indice Videomessaggi#Indice di tutti i Videomessaggi pontifici|Videomessaggi]]
>
> </div></div>
> </div>