/*
Ultimo aggiornamento: 24-01-2026
Funzionalità:
- Legge tutti i file markdown specificati una sola volta per la massima efficienza.
- Estrae le parole e la riga circostante (il contesto).
- Filtra le parole comuni (stop-word) in base alle impostazioni.
- Raggruppa le parole per lettera iniziale in file di vocabolario separati.
- Per ogni parola, elenca tutte le occorrenze (concordanze).
- Ogni occorrenza include:
    - Il conteggio totale di quella parola in tutti i documenti.
    - Un link cliccabile che usa: obsidian://search per saltare alla riga esatta nel file originale.
    - La parola stessa è in grassetto nel testo del link per una chiara identificazione.
    - Un link secondario al file sorgente.
- Aggiunge un'impostazione "Lunghezza minima della parola" nelle opzioni del plugin.

Last Update: 24-01-2026
Features:
- Reads all specified markdown files only once for maximum efficiency.
- Extracts words and their surrounding line (context).
- Filters common words (stop-words) based on settings.
- Groups words by initial letter into separate vocabulary files.
- Lists all occurrences (concordances) for each word.
- Each occurrence includes:
    - The total count of that word across all documents.
    - A clickable link using: obsidian://search to jump to the exact line in the original file.
    - The word itself is bolded within the link text for clear identification.
    - A secondary link to the source file.
- Adds a "Minimum word length" setting in the plugin options.
*/

// Importa i componenti fondamentali dell'API di Obsidian per estendere le funzionalità dell'editor.
// Imports core components from the Obsidian API to extend editor functionality.
const { Plugin, PluginSettingTab, Setting, App, Notice, Modal, TFolder, MarkdownRenderer } = require('obsidian');
// Importa la funzione di gestione delle traduzioni dal file locale.
// Imports the translation management function from the local file.
const path = require('path');
const adapter = this.app.vault.adapter;
const vaultPath = adapter.getBasePath();
// Usa require.resolve per trovare il percorso del file.
// Questo funziona perché Node.js conosce la posizione di main.js
const translationsPath = path.join(vaultPath, '.obsidian/plugins/obsidian-build-vocabulary/translations.js');
// Carica il modulo traduzioni gestendo la cache di Node
const translationModule = require(translationsPath);
const getTranslations = translationModule.getTranslations;
// Richiede il modulo 'crypto' di Node.js per calcolare gli hash SHA-512
// Requires Node.js 'crypto' module to calculate SHA-512 hashes
const crypto = require('crypto');
// Rileva la lingua impostata in Obsidian
// Detect the language set in Obsidian
const obsidianLang = window.localStorage.getItem('language');
// Carica in memoria SOLO il blocco di lingua necessario
// Load ONLY the required language block into memory
const t = getTranslations(obsidianLang);
// Definisce il percorso fisico del file JSON delle entità composte.
// Defines the physical path of the compound entities JSON file.
const jsonPath = path.join(vaultPath, '.obsidian/plugins/obsidian-build-vocabulary/compound_entities_index.json');
// Carica il modulo del file system di Node.js per la lettura sincrona.
// Loads the Node.js file system module for synchronous reading.
const fs = require('fs');
// Legge il file JSON in modo sincrono e lo parsa in un oggetto.
// Reads the JSON file synchronously and parses it into an object.
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
// Estrae la stringa di informazione da utilizzare come sottotitolo nel Modal.
// Extracts the info string to be used as a subtitle in the Modal.
const infoSubtitle = jsonData._info;
// Carica la lista delle parole e le ordina per lunghezza decrescente (Longest Match First).
// Loads the word list and sorts them by descending length (Longest Match First).
const listaEntita = jsonData.PAROLE_COMPOSTE.sort((a, b) => b.length - a.length);

// === COSTANTI ===
// === CONSTANTS ===

// Liste di stop-word per il filtraggio
// Stop-word lists for filtering
const ARTICOLI_DETERMINATIVI = ['il', 'lo', 'la', 'i', 'gli', 'le', "l'"]; //DEFINITE_ARTICLES
const ARTICOLI_INDETERMINATIVI = ['un', 'uno', 'una', "un'"]; //INDEFINITE_ARTICLES
const PREPOSIZIONI_SEMPLICI = ['di', "d'", 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra']; //SIMPLE_PREPOSITIONS
const PREPOSIZIONI_ARTICOLATE = [
    'del', 'dello', 'della', "dell'", 'dei', 'degli', 'delle',
    'al', 'allo', 'alla', "all'", 'ai', 'agli', 'alle',
    'dal', 'dallo', 'dalla', "dall'", 'dai', 'dagli', 'dalle',
    'nel', 'nello', 'nella', "nell'", 'nei', 'negli', 'nelle',
    'sul', 'sullo', 'sulla', "sull'", 'sui', 'sugli', 'sulle',
    'col', 'collo', "coll'", 'colla', 'coi', 'cogli', 'colle',
    'pel', 'pello', 'pella', "pell'", 'pei', 'pegli', 'pelle'
]; //PREPOSITIONAL_ARTICLES

// ========================
// === DEFAULT_SETTINGS ===
// ========================

// Impostazioni predefinite del plugin
// Default settings for the plugin
const DEFAULT_SETTINGS = {
    // Cartelle da cui iniziare la scansione. Se vuoto, scansiona l'intero vault.
    // Folders to start scanning from. If empty, scans the entire vault.
    startFolders: [],
    // Cartelle da ignorare completamente. Ha la priorità su 'startFolders'.
    // Folders to ignore completely. Takes priority over 'startFolders'.
    exclusionFolders: [],
    // La cartella dove verranno creati i file del vocabolario (.md e .json).
    // The folder where vocabulary files (.md and .json) will be created.
    outputFolder: "Vocaboli",
    // Aggiunge l'icona alla barra laterale (richiede ricarica del plugin).
    // Adds the icon to the sidebar (requires plugin reload).
    addRibbonIcon: false,
    // Lunghezza minima di una parola per essere inclusa nel vocabolario.
    // Minimum length for a word to be included in the vocabulary.
    minWordLength: 2,
    // Flag per includere parole accentate (sempre consigliato).
    // Flag to include accented words (always recommended).
    includeAccented: true,
    // Flags per includere/escludere le stop-word.
    // Flags to include/exclude stop-words.
    includeArticoliDeterminativi: false,
    includeArticoliIndeterminativi: false,
    includePreposizioniSemplici: false,
    includePreposizioniArticolate: false,
    // Pattern di esclusione per file/cartelle, separati da virgola. Supporta '*' come jolly.
    // Exclusion patterns for files/folders, comma-separated. Supports '*' as a wildcard.
    exclusionPatterns: "_*",
};

// === FUNZIONI DI SUPPORTO ===
// === SUPPORT FUNCTIONS ===

/**
 **********************************************************************************
 *                                                                                *
 * Si assicura che una cartella esista al percorso dato, creandola se necessario. *
 *                                                                                *
 * Ensures a folder exists at the given path, creating it if necessary.           *
 *                                                                                *
 **********************************************************************************
 *
 * @param {string} folderPath
 * Il percorso della cartella da controllare/creare.
 * The path of the folder to check/create.
 *
 * @param {App} app
 * L'istanza dell'applicazione Obsidian.
 * The Obsidian App instance.
 *
 * @returns {Promise<boolean>}
 * True se la cartella esiste o è stata creata, false in caso di errore.
 * True if the folder exists or was created, false on error.
 *
 */
async function ensureFolderExists(folderPath, app) {
    // Ottiene l'adapter del vault di Obsidian per l'accesso al file system.
    // Gets the Obsidian vault adapter for file system access.
    const adapter = app.vault.adapter;
    // Inizia un blocco di gestione degli errori per le operazioni di I/O sulle cartelle.
    // Starts an error handling block for folder I/O operations.
    try {
        // Verifica se la cartella esiste già al percorso specificato.
        // Checks if the folder already exists at the specified path.
        const folderExists = await adapter.exists(folderPath);
        // Se la cartella non viene trovata, procede con la sua creazione.
        // If the folder is not found, proceeds with its creation.
        if (!folderExists) {
            // Crea la cartella se non è presente.
            // Creates the folder if it is not present.
            await adapter.mkdir(folderPath);
            // Mostra una notifica all'utente per confermare la creazione.
            // Shows a notice to the user to confirm creation.
            new Notice(`${t.FOLDER_CREATED}"${folderPath}"`);
        }
        // Operazione riuscita.
        // Operation successful.
        return true;
    }
    catch (error) {
        // Registra l'errore dettagliato nella console di sviluppo.
        // Logs the detailed error in the developer console.
        console.error(`${t.CALL_ERROR}`, error, `\n`);
        // Avvisa l'utente del fallimento tramite l'interfaccia di Obsidian.
        // Alerts the user of the failure via the Obsidian interface.
        new Notice(`${t.FOLDER_ERROR}"${folderPath}"${t.CHECK_CONSOLE}`);
        // Restituisce false per indicare che l'operazione è fallita.
        // Returns false to indicate the operation failed.
        return false;
    }
}

/**
 **********************************************************************************************
 *                                                                                            *
 * Scrive del contenuto in un file, creandolo se non esiste o sovrascrivendolo se esiste già. *
 *                                                                                            *
 * Writes content to a file, creating it if it doesn't exist or overwriting it if it does.    *
 *                                                                                            *
 **********************************************************************************************
 *
 * @param {App} app
 * L'istanza dell'applicazione Obsidian.
 * The Obsidian App instance.
 *
 * @param {string} filePath
 * Il percorso del file su cui scrivere.
 * The path of the file to write to.
 *
 * @param {string} content
 * Il contenuto da scrivere.
 * The content to write.
 *
 * @returns {Promise<boolean>}
 * True in caso di successo, false in caso di fallimento.
 * True on success, false on failure.
 *
 */
async function writeDataToFile(app, filePath, content) {
    // Inizia il blocco di gestione degli errori per l'operazione di scrittura.
    // Starts the error handling block for the write operation.
    try {
        // Tenta di ottenere un riferimento astratto al file dal percorso.
        // Attempts to get an abstract reference to the file from the path.
        const file = app.vault.getAbstractFileByPath(filePath);
        // Verifica se il riferimento al file è stato trovato nel vault.
        // Checks if the file reference was found in the vault.
        if (file) {
            // Se il file esiste, lo modifica con il nuovo contenuto (sovrascrittura).
            // If the file exists, modifies it with the new content (overwrites).
            await app.vault.modify(file, content);
        }
        // Gestisce il caso in cui il file non esista ancora nel percorso specificato.
        // Handles the case where the file does not yet exist at the specified path.
        else {
            // Se il file non esiste, lo crea con il contenuto specificato.
            // If the file does not exist, creates it with the specified content.
            await app.vault.create(filePath, content);
        }
        // Restituisce true se l'operazione è riuscita.
        // Returns true if the operation was successful.
        return true;
    }
    catch (error) {
        // Registra l'errore in console per il debug.
        // Logs the error to the console for debugging.
        console.error(`${t.FILE_WRITE_ERROR} "${filePath}":`, error, `\n`);
        // Mostra una notifica di errore all'utente.
        // Shows an error notification to the user.
        new Notice(`${t.FILE_WRITE_ERROR} "${filePath}"${t.CHECK_CONSOLE}`);
        // Restituisce false se l'operazione è fallita.
        // Returns false if the operation failed.
        return false;
    }
}

/**
 ***************************************************
 *                                                 *
 * Calcola l'hash SHA-512 di una stringa di testo. *
 *                                                 *
 * Calculates the SHA-512 hash of a text string.   *
 *                                                 *
 ***************************************************
 *
 * @param {string} text
 * Il contenuto di cui calcolare l'hash.
 * The content for which to calculate the hash.
 *
 * @returns {string}
 * L'hash SHA-512 in formato esadecimale.
 * The SHA-512 hash in hexadecimal format.
 *
 */
function calculateHash(text) {
    // Calcola e restituisce l'hash SHA-512 in formato esadecimale.
    // Calculates and returns the SHA-512 hash in hex format.
    return crypto.createHash('sha512').update(text).digest('hex');
}

/**
 **************************************************************************
 *                                                                        *
 * Legge e fa il parsing di un file JSON in modo sicuro.                  *
 * Se il file non esiste o è invalido, restituisce il valore di fallback. *
 *                                                                        *
 * Reads and safely parses a JSON file.                                   *
 * If the file does not exist or is invalid, returns the fallback value.  *
 *                                                                        *
 **************************************************************************
 *
 * @param {App} app
 * L'istanza dell'applicazione Obsidian.
 * The Obsidian App instance.
 *
 * @param {string} filePath
 * Il percorso del file JSON da leggere.
 * The path of the JSON file to read.
 *
 * @param {any} fallback
 * Il valore da restituire in caso di errore.
 * The value to return in case of error.
 *
 * @returns {Promise<any>}
 * I dati del file JSON o il valore di fallback.
 * The JSON file data or the fallback value.
 *
 */
async function readJsonFile(app, filePath, fallback = {}) {
    try {
        // Legge il contenuto grezzo del file dal vault tramite l'adapter.
        // Reads the raw file content from the vault using the adapter.
        const content = await app.vault.adapter.read(filePath);
        // Tenta di convertire la stringa in un oggetto JavaScript.
        // Attempts to parse the string into a JavaScript object.
        return JSON.parse(content);
    }
    catch (error) {
        // Se il file non esiste o c'è un errore di parsing, restituisce il valore di fallback.
        // If the file does not exist or a parsing error occurs, returns the fallback value.
        return fallback;
    }
}

/**
 **************************************
 *                                    *
 * Scrive un oggetto in un file JSON. *
 * Writes an object to a JSON file.   *
 *                                    *
 **************************************
 *
 * @param {App} app
 * L'istanza dell'applicazione Obsidian.
 * The Obsidian App instance.
 *
 * @param {string} filePath
 * Il percorso del file JSON da scrivere.
 * The path of the JSON file to write to.
 *
 * @param {object} data
 * L'oggetto da serializzare e scrivere.
 * The object to serialize and write.
 *
 * @returns {Promise<boolean>}
 * True in caso di successo, false in caso di fallimento.
 * True on success, false on failure.
 *
 */
async function writeJsonFile(app, filePath, data) {
    try {
        // Converte l'oggetto in stringa JSON formattata e lo scrive sul file system.
        // Converts the object to a formatted JSON string and writes it to the file system.
        await app.vault.adapter.write(filePath, JSON.stringify(data, null, 2)); // Il 2 formatta il JSON per essere leggibile
        // Operazione completata con successo.
        // Operation completed successfully.
        return true;
    }
    catch (error) {
        // Registra l'errore tecnico dettagliato nella console.
        // Logs the detailed technical error to the console.
        console.error(`${t.JSON_WRITE_ERROR} "${filePath}":`, error, `\n`);
        // Mostra una notifica di errore bilingue all'utente.
        // Shows a bilingual error notification to the user.
        new Notice(`${t.JSON_WRITE_ERROR} "${filePath}"${t.CHECK_CONSOLE}`);
        // Restituisce false per indicare il fallimento dell'operazione.
        // Returns false to indicate the operation failed.
        return false;
    }
}

/**
 ************************************************************
 *                                                          *
 * Pulisce una cartella da tutti i file con estensione .md. *
 * Clears all files with .md extension from a folder.       *
 *                                                          *
 ************************************************************
 *
 * @param {App} app
 * L'istanza dell'applicazione Obsidian.
 * The Obsidian App instance.
 *
 * @param {string} folderPath
 * Il percorso della cartella da pulire.
 * The path of the folder to be cleared.
 *
 */
async function clearMarkdownFiles(app, folderPath) {
    try {
        // Elenca tutti i file presenti nella cartella specificata.
        // Lists all files present in the specified folder.
        const filesInFolder = await app.vault.adapter.list(folderPath);
        // Ciclo attraverso ogni file trovato nella cartella.
        // Loops through each file found in the folder.
        for (const filePath of filesInFolder.files) {
            // Controlla se il file ha estensione .md (case-insensitive).
            // Checks if the file has a .md extension (case-insensitive).
            if (filePath.toLowerCase().endsWith('.md')) {
                // Rimuove il file dal vault.
                // Removes the file from the vault.
                await app.vault.adapter.remove(filePath);
            }
        }
    }
    catch (error) {
        // Ignora l'errore se la cartella non esiste, ma logga altri tipi di errori.
        // Ignores the error if the folder doesn't exist, but logs other error types.
        if (!error.message.includes('no such file or directory')) {
            // Registra l'errore tecnico nella console.
            // Logs the technical error to the console.
            console.error(`${t.CLEAR_ERROR} "${folderPath}":`, error, `\n`);
        }
    }
}

// === CLASSE PRINCIPALE DEL PLUGIN ===
// === MAIN PLUGIN CLASS ===

// Esporta la classe principale del plugin per renderla disponibile ad Obsidian.
// Exports the main plugin class to make it available to Obsidian.
module.exports = class BuildVocabularyPlugin extends Plugin {
    // Metodo chiamato all'attivazione del plugin.
    // Method called when the plugin is enabled.
    async onload() {
        // Logga l'avvio del plugin nella console.
        // Logs the plugin startup to the console.
        console.log(t.PLUGIN_LOADING);
        // Carica le impostazioni salvate unendole a quelle predefinite.
        // Loads saved settings merging them with the default ones.
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        // Aggiunge il comando principale alla palette dei comandi di Obsidian.
        // Add the main command to the Obsidian command palette.
        this.addCommand({
            // Identificativo univoco del comando all'interno di Obsidian.
            // Unique identifier for the command within Obsidian.
            id: 'build-vocabulary-intratext',
            // Nome del comando.
            // Command name.
            name: t.COMMAND_NAME,
            // Azione eseguita al richiamo del comando.
            // Action performed when the command is called.
            callback: () => this.buildVocabulary()
        });
        // Registra la scheda delle impostazioni nel menu di Obsidian.
        // Registers the settings tab in the Obsidian menu.
        this.addSettingTab(new BuildVocabularySettingTab(this.app, this));
        // Verifica se l'icona della barra laterale (ribbon) deve essere mostrata.
        // Checks if the sidebar icon (ribbon) should be displayed.
        if (this.settings.addRibbonIcon) {
            // Definisce l'icona SVG personalizzata 'BV'.
            // Defines the custom 'BV' SVG icon.
            const bvIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="var(--icon-color-interactive, #5c5c5c)"/>
                <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-size="13" font-family="Arial, sans-serif" fill="white" font-weight="bold">BV</text>
            </svg>`;
            // Crea l'icona nel ribbon con un tooltip (addRibbonIcon inserisce un'icona temporanea).
            // Creates the ribbon icon with a tooltip (addRibbonIcon inserts a temporary icon).
            const ribbonEl = this.addRibbonIcon('book-open', t.RIBBON_TOOLTIP, () => {
                // La funzione ci restituisce l'elemento DOM che è stato aggiunto alla barra.
                // It returns the DOM element that was added to the sidebar.
                this.buildVocabulary();
            });
            // Sostituisce l'HTML interno dell'icona standard con l'SVG personalizzato.
            // Replaces internal HTML of the standard icon with the custom SVG.
            ribbonEl.innerHTML = bvIcon;
        }
        // Mostra una notifica di conferma attivazione.
        // Shows an activation confirmation notice.
        new Notice(t.NOTICE_ENABLED);
    }
    // Metodo chiamato alla disattivazione del plugin.
    // Method called when the plugin is disabled.
    onunload() {
        // Logga la disattivazione nella console.
        // Logs the unloading to the console.
        console.log(t.PLUGIN_UNLOADING);
        // Notifica l'utente che il plugin è stato disattivato.
        // Notifies the user that the plugin has been disabled.
        new Notice(t.NOTICE_DISABLED);
    }
    // Salva le impostazioni correnti nel file di configurazione del plugin.
    // Saves current settings to the plugin's configuration file.
    async saveSettings() {
        // Salva in modo asincrono i dati delle impostazioni correnti nel file data.json.
        // Asynchronously saves the current setting data to the data.json file.
        await this.saveData(this.settings);
    }

    /**
    ******************************************************************************
    *                                                                            *
    * La funzione principale del plugin. Legge i file, estrae parole e contesti, *
    * e scrive i file strutturati del vocabolario.                               *
    *                                                                            *
    * The core function of the plugin. Reads files, extracts words and contexts, *
    * and writes the structured vocabulary files.                                *
    *                                                                            *
    ******************************************************************************
    *
    */
    async buildVocabulary() {
        // Registra il timestamp di inizio per calcolare la durata totale.
        // Records the start timestamp to calculate the total duration.
        const startTime = Date.now();
        // Notifica l'utente dell'inizio del processo.
        // Notifies the user that the process has started.
        new Notice(t.BUILD_START, 3000);

        // --- 1. SETUP INIZIALE E CARICAMENTO DATABASE ---
        // --- 1. INITIAL SETUP AND DATABASE LOADING ---

        // Recupera la cartella di destinazione dalle impostazioni.
        // Retrieves the output folder from settings.
        const outputFolder = this.settings.outputFolder || '';
        // Si assicura che la cartella di output esista prima di procedere.
        // Ensures the output folder exists before proceeding.
        if (!(await ensureFolderExists(outputFolder, this.app))) {
            // Notifica l'errore critico e interrompe l'esecuzione.
            // Notifies the critical error and stops execution.
            new Notice(`${t.CRITICAL_FOLDER_ERROR} "${outputFolder}"${t.PROCESS_ABORTED}`, 10000);
            // Interrompe l'esecuzione se non è possibile creare la cartella di output
            // Stop if we can't create the output folder
            return;
        }
        // Definisce i percorsi per i file JSON di cache e database.
        // Defines the paths for the cache and database JSON files.
        const SOURCE_CACHE_FILE = `${outputFolder}/_source_cache.json`;
        const VOCABULARY_DB_FILE = `${outputFolder}/_vocabulary_database.json`;
        // Carica i dati esistenti dai file JSON o inizializza oggetti vuoti.
        // Loads existing data from JSON files or initializes empty objects.
        let fileHashes = await readJsonFile(this.app, SOURCE_CACHE_FILE, {});
        let vocabulary = await readJsonFile(this.app, VOCABULARY_DB_FILE, {});
        // Flag per determinare se i database necessitano di un aggiornamento su disco.
        // Flag to determine if databases need to be rewritten to disk.
        let dbNeedsRewrite = false;
        // Ottiene il nome del vault corrente.
        // Gets the name of the current vault.
        const vaultName = this.app.vault.getName();

        // --- 2. FILTRAGGIO FILE ---
        // --- 2. FILE FILTERING ---

        // Determina le cartelle da cui iniziare la scansione.
        // Determines the folders from which to start the scan.
        const startFolders = this.settings.startFolders.length > 0 ? this.settings.startFolders : ['/'];
        // Recupera la lista delle cartelle da escludere.
        // Retrieves the list of folders to exclude.
        const exclusionFolders = this.settings.exclusionFolders || [];
        // Converte i pattern di esclusione testuali in espressioni regolari.
        // Converts textual exclusion patterns into regular expressions.
        const exclusionRegexps = (this.settings.exclusionPatterns || '')
            .split(',').map(p => p.trim()).filter(p => p).map(p => new RegExp('^' + p.replace(/\*/g, '.*') + '$'));
        // Recupera tutti i file Markdown presenti nel vault.
        // Retrieves all Markdown files present in the vault.
        const allMarkdownFiles = this.app.vault.getMarkdownFiles();
        // Filtra la lista dei file in base alle regole di inclusione ed esclusione.
        // Filters the file list based on inclusion and exclusion rules.
        const filesToProcess = allMarkdownFiles.filter(file => {
            // Esclude i file interni alla cartella di output del plugin.
            // Excludes files inside the plugin's output folder.
            if (file.path.startsWith(outputFolder + '/')) return false;
            // Esclude i file presenti nelle cartelle di esclusione.
            // Excludes files present in the exclusion folders.
            if (exclusionFolders.some(folder => file.path.startsWith(folder + '/'))) return false;
            // Esclude i file i cui nomi corrispondono ai pattern definiti.
            // Excludes files whose names match the defined patterns.
            if (file.path.split('/').some(part => exclusionRegexps.some(rx => rx.test(part)))) return false;
            // Include solo i file che si trovano nelle cartelle di partenza specificate.
            // Only includes files located in the specified starting folders.
            return startFolders.some(folder => folder === '/' || file.path.startsWith(folder + '/'));
        });

        // --- 3. IDENTIFICAZIONE MODIFICHE ---
        // --- 3. CHANGE IDENTIFICATION ---

        // Crea un set dei percorsi file attuali per un confronto rapido.
        // Creates a set of current file paths for fast comparison.
        const currentFilePaths = new Set(filesToProcess.map(f => f.path));
        // Crea un set dei percorsi file già noti nel database di cache.
        // Creates a set of file paths already known in the cache database.
        const knownFilePaths = new Set(Object.keys(fileHashes));
        // Identifica i file che sono stati eliminati dal vault rispetto all'ultima scansione.
        // Identifies files that have been deleted from the vault since the last scan.
        const deletedFilePaths = [...knownFilePaths].filter(p => !currentFilePaths.has(p));
        // Array che conterrà i file nuovi o modificati da processare.
        // Array that will contain new or modified files to be processed.
        const filesToUpdate = [];
        // Ciclo dei file attuali per determinare quali necessitano di aggiornamento.
        // Loops through current files to determine which ones need updating.
        for (const file of filesToProcess) {
            // Se il file non è presente nella cache, lo aggiunge alla lista di aggiornamento.
            // If the file is not in the cache, adds it to the update list.
            if (!knownFilePaths.has(file.path)) {
                // Aggiunge il file all'elenco di quelli che necessitano di essere processati.
                // Adds the file to the list of those that need to be processed.
                filesToUpdate.push(file);
                // Passa immediatamente all'iterazione successiva del ciclo.
                // Immediately moves to the next iteration of the loop.
                continue;
            }
            // Legge il contenuto del file (sfruttando la cache di Obsidian per velocità).
            // Reads file content (leveraging Obsidian's cache for speed).
            const content = await this.app.vault.cachedRead(file);
            // Calcola l'hash SHA-512 del contenuto attuale.
            // Calculates the SHA-512 hash of the current content.
            const currentHash = calculateHash(content);
            // Se l'hash è diverso da quello salvato, il file è stato modificato.
            // If the hash differs from the saved one, the file has been modified.
            if (fileHashes[file.path] !== currentHash) {
                // Inserisce il file nell'elenco degli elementi che richiedono una nuova analisi.
                // Adds the file to the list of items requiring a new analysis.
                filesToUpdate.push(file);
            }
        }

        // --- 4. GESTIONE FILE CANCELLATI ---
        // --- 4. DELETED FILE MANAGEMENT ---

        // Se sono stati rilevati file cancellati, aggiorna il vocabolario.
        // If deleted files are detected, updates the vocabulary.
        if (deletedFilePaths.length > 0) {
            // Attiva il flag per riscrivere i database su disco.
            // Sets the flag to rewrite databases to disk.
            dbNeedsRewrite = true;
            // Notifica l'utente dell'operazione di pulizia.
            // Notifies the user of the cleanup operation.
            new Notice(`${t.REMOVING_DELETED}${deletedFilePaths.length}${t.FILES_FROM_VOCABULARY}`, 3000);
            // Rimuove ogni riferimento ai file cancellati dalle occorrenze delle parole.
            // Removes every reference to deleted files from word occurrences.
            for (const word in vocabulary) {
                // Rimuove i record associati ai percorsi dei file che sono stati eliminati.
                // Removes records associated with file paths that have been deleted.
                vocabulary[word] = vocabulary[word].filter(occ => !deletedFilePaths.includes(occ.file));
                // Se una parola non ha più occorrenze, la elimina dal vocabolario.
                // If a word has no more occurrences, removes it from the vocabulary.
                if (vocabulary[word].length === 0) delete vocabulary[word];
            }
            // Rimuove i percorsi dei file cancellati dal database della cache.
            // Removes the deleted file paths from the cache database.
            for (const path of deletedFilePaths) delete fileHashes[path];
        }

        // --- 5. GESTIONE FILE NUOVI O MODIFICATI ---
        // --- 5. NEW OR MODIFIED FILE MANAGEMENT ---

        // Solo se ci sono file nuovi o modificati, procede con l'analisi.
        // Only if there are new or modified files, proceeds with analysis.
        if (filesToUpdate.length > 0) {
            // Segnala la necessità di riscrivere i database JSON alla fine del processo.
            // Signals the need to rewrite the JSON databases at the end of the process.
            dbNeedsRewrite = true;
            // Notifica l'utente del numero di file in fase di analisi.
            // Notifies the user of the number of files being analyzed.
            new Notice(`${t.ANALYZING_FILES}${filesToUpdate.length}${t.NEW_MODIFIED_FILES}`, 3000);
            // Ciclo per ogni file che necessita di un aggiornamento.
            // Loops through each file that needs an update.
            for (const file of filesToUpdate) {
                // Purga le vecchie occorrenze di questo file specifico dal vocabolario in memoria.
                // Purges old occurrences of this specific file from the vocabulary in memory.
                for (const word in vocabulary) {
                    // Filtra via le occorrenze associate al percorso del file corrente.
                    // Filters out occurrences associated with the current file path.
                    vocabulary[word] = vocabulary[word].filter(occ => occ.file !== file.path);
                    // Se l'array delle occorrenze della parola è vuoto, lo elimina.
                    // If the word's occurrences array is empty, deletes it.
                    if (vocabulary[word].length === 0) {
                        // Rimuove la parola dal vocabolario per mantenere pulito il database.
                        // Removes the word from the vocabulary to keep the database clean.
                        delete vocabulary[word];
                    }
                }
                // Legge il contenuto del file tramite la cache di Obsidian.
                // Reads the file content via the Obsidian cache.
                const content = await this.app.vault.cachedRead(file);
                // Calcola l'hash per i futuri confronti.
                // Calculates the hash for future comparisons.
                const currentHash = calculateHash(content);
                // Aggiorna l'hash del file nel database della cache.
                // Updates the file hash in the cache database.
                fileHashes[file.path] = currentHash;
                // Divide il contenuto in righe per l'analisi contestuale.
                // Splits the content into lines for contextual analysis.
                const lines = content.split('\n');
                // Analizza ogni riga singolarmente tenendo traccia dell'indice.
                // Analyzes each line individually while keeping track of the index.
                lines.forEach((line, lineIndex) => {
                    // Ignora le righe vuote o composte solo da spazi.
                    // Ignores empty lines or those consisting only of whitespace.
                    if (!line.trim()) return;
                    // Variabile per contenere il testo effettivo da elaborare.
                    // Variable to hold the actual text to be processed.
                    let textToProcess = '';
                    // Gestione specifica per le note a piè di pagina (Footnotes).
                    // Specific handling for footnotes.
                    if (line.trim().startsWith('[^') && line.includes(']:')) {
                        // Estrae il contenuto della definizione della nota.
                        // Extracts the content of the footnote definition.
                        const definitionContent = line.split(/\[\^.*?\]:/)[1];
                        // Se presenti, pulisce gli spazi bianchi.
                        // If present, trims whitespace.
                        if (definitionContent) textToProcess = definitionContent.trim();
                    }
                    else {
                        // Rimuove i riferimenti alle note e gestisce eventuali testi tra parentesi quadre.
                        // Removes footnote references and handles any text within square brackets.
                        const lineWithoutReferences = line.replaceAll(/\[\^.*?\]/g, ' ');
                        // Cerca una corrispondenza per il testo tra parentesi quadre (traduzioni).
                        // Searches for a match for text within square brackets (translations).
                        const translationMatch = lineWithoutReferences.match(/\[(.*?)\]/);
                        // Seleziona il match o l'intera riga pulita.
                        // Selects the match or the entire cleaned line.
                        textToProcess = translationMatch ? translationMatch[1].trim() : lineWithoutReferences.trim();
                    }
                    // Se non c'è testo utile dopo la pulizia, interrompe l'iterazione sulla riga.
                    // If there is no useful text after cleaning, stops the line iteration.
                    if (!textToProcess) return;
                    // Pulizia finale da tag HTML, abbreviazioni comuni e simboli speciali.
                    // Final cleaning of HTML tags, common abbreviations, and special symbols.
                    textToProcess = textToProcess.replaceAll(/<[^>]+>/g, ' ').replaceAll(/\bcfr\.?\b/gi, ' ').replaceAll(/[()§*]/g, ' ');
                    // Estrazione delle parole tramite Regex Unicode e normalizzazione selettiva.
                    // Word extraction via Unicode Regex and selective normalization.
                    const wordsInLine = (textToProcess.match(/(?<!\p{L})[\p{L}']+(?!\p{L})/gu) || []).map(word => {
                        // Se una parola è in TUTTO MAIUSCOLO (es. "CEI" o "AMEN"),
                        // la normalizziamo in "Title Case" (es. "Cei", "Amen").
                        // Questo è il compromesso scelto per gestire sigle e parole enfatizzate.
                        // Normalizza le sigle o parole in tutto maiuscolo in "Title Case".
                        // Normalizes acronyms or all-caps words to "Title Case".
                        if (word.length > 1 && word === word.toUpperCase()) {
                            // Converte la sigla (es. "CEI") in formato leggibile (es. "Cei").
                            // Converts the acronym (e.g., "CEI") into readable format (e.g., "Cei").
                            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                        }
                        // Preserva la capitalizzazione originale per i termini rilevanti ("Padre", "Chiesa", "Nostra", etc.).
                        // Preserves original capitalization for relevant terms.
                        return word;
                    });
                    // Ciclo delle parole estratte per filtrarle e salvarle.
                    // Loops through extracted words to filter and save them.
                    for (const word of wordsInLine) {
                        // Filtra in base alla lunghezza minima e alla validità del carattere iniziale.
                        // Filters based on minimum length and validity of the initial character.
                        if (word.length < this.settings.minWordLength || !/^\p{L}/u.test(word)) continue;
                        // Filtra le stop-word (articoli e preposizioni) in base alle impostazioni dell'utente.
                        // Filters stop-words (articles and prepositions) based on user settings.
                        if (!this.settings.includeArticoliDeterminativi && ARTICOLI_DETERMINATIVI.includes(word)) continue;
                        if (!this.settings.includeArticoliIndeterminativi && ARTICOLI_INDETERMINATIVI.includes(word)) continue;
                        if (!this.settings.includePreposizioniSemplici && PREPOSIZIONI_SEMPLICI.includes(word)) continue;
                        if (!this.settings.includePreposizioniArticolate && PREPOSIZIONI_ARTICOLATE.includes(word)) continue;
                        // Inizializza l'array della parola se non esiste e aggiunge l'occorrenza.
                        // Initializes the word array if it doesn't exist and adds the occurrence.
                        if (!vocabulary[word]) vocabulary[word] = [];
                        // Aggiunge l'occorrenza con il riferimento al file, riga e contesto.
                        // Adds the occurrence with reference to file, line, and context.
                        vocabulary[word].push({
                            // Registra il percorso del file in cui è stata individuata la parola.
                            // Records the path of the file where the word was identified.
                            file: file.path,
                            // Salva il numero di riga (1-based).
                            // Saves the line number (1-based).
                            lineNumber: lineIndex + 1,
                            // Contesto originale della riga.
                            // Original line context.
                            context: line.trim()
                        });
                    }
                });
            }
        }

        // --- 6. SCRITTURA DEI FILE FINALI ---
        // --- 6. FINAL FILE WRITING ---

        // Verifica se è necessario aggiornare i file su disco.
        // Checks if it is necessary to update files on disk.
        if (!dbNeedsRewrite) {
            // Notifica l'utente che non ci sono modifiche rilevate.
            // Notifies the user that no changes were detected.
            new Notice(t.ALREADY_UPDATED, 3000);
        }
        else {
            // Notifica l'inizio della fase di scrittura e salvataggio.
            // Notifies the start of the writing and saving phase.
            new Notice(t.SAVING_DATABASE, 5000);
            // Salva i database JSON di cache e vocabolario.
            // Saves the JSON cache and vocabulary databases.
            await writeJsonFile(this.app, SOURCE_CACHE_FILE, fileHashes);
            await writeJsonFile(this.app, VOCABULARY_DB_FILE, vocabulary);
            // Rimuove i vecchi file Markdown prima di generare i nuovi.
            // Removes old Markdown files before generating new ones.
            await clearMarkdownFiles(this.app, outputFolder);
            // Raggruppa le parole del vocabolario in base alla lettera iniziale.
            // Groups vocabulary words based on their initial letter.
            const letterGroups = {};
            // Ordina le parole alfabeticamente usando le regole linguistiche italiane.
            // Sorts words alphabetically using Italian linguistic rules.
            const sortedWords = Object.keys(vocabulary).sort((a, b) => a.localeCompare(b, 'it'));
            // Ciclo attraverso le parole ordinate per assegnarle ai rispettivi gruppi.
            // Loops through sorted words to assign them to their respective groups.
            for (const word of sortedWords) {
                // Ottiene la prima lettera in maiuscolo.
                // Gets the first letter in uppercase.
                const firstLetter = word.charAt(0).toUpperCase();
                // Inizializza il gruppo della lettera se non esiste.
                // Initializes the letter group if it doesn't exist.
                if (!letterGroups[firstLetter]) letterGroups[firstLetter] = [];
                // Aggiunge la parola all'array del gruppo corrispondente.
                // Adds the word to the corresponding group's array.
                letterGroups[firstLetter].push(word);
            }
            // Ciclo attraverso ogni gruppo di lettere per generare i file Markdown.
            // Loops through each letter group to generate Markdown files.
            for (const letter of Object.keys(letterGroups).sort()) {
                // Recupera l'elenco delle parole associate alla lettera corrente.
                // Retrieves the list of words associated with the current letter.
                const wordsForLetter = letterGroups[letter];
                // Inizializza il contenuto del file Markdown con il titolo della lettera.
                // Initializes the Markdown file content with the letter title.
                let markdownContent = `# ${letter}\n\n`;
                // Ciclo attraverso ogni parola del gruppo per generare il contenuto Markdown.
                // Loops through each word in the group to generate Markdown content.
                for (const word of wordsForLetter) {
                    // Recupera l'array di tutte le occorrenze per la parola specifica.
                    // Retrieves the array of all occurrences for the specific word.
                    const occurrences = vocabulary[word];
                    // Aggiunge l'intestazione della parola e il conteggio delle occorrenze.
                    // Adds the word header and the occurrence count.
                    markdownContent += `### ${word}\n`;
                    // Aggiunge al contenuto Markdown il numero totale di occorrenze trovate per la parola.
                    // Adds the total number of found occurrences for the word to the Markdown content.
                    markdownContent += `###### ${t.OCCURRENCES_FOUND}${occurrences.length}\n`;
                    // Itera attraverso ogni singola occorrenza della parola per generare il relativo link e contesto.
                    // Iterates through each individual word occurrence to generate its link and context.
                    occurrences.forEach((occ, index) => {
                        // Estrae il nome del file dal percorso completo.
                        // Extracts the file name from the full path.
                        const fileName = occ.file.substring(occ.file.lastIndexOf('/') + 1);
                        // Suddivide il contesto in parole per l'estrazione del frammento.
                        // Splits the context into words for fragment extraction.
                        const contextWords = occ.context.split(/\s+/).filter(w => w); // Filtra spazi vuoti
                        // Normalizza le parole del contesto per trovare la posizione della parola chiave.
                        // Normalizes context words to find the position of the keyword.
                        const cleanContextWords = contextWords.map(w => w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""));
                        // Trova la posizione (indice) della parola chiave all'interno dell'array del contesto normalizzato.
                        // Finds the position (index) of the keyword within the normalized context array.
                        const wordIndexInContext = cleanContextWords.indexOf(word.toLowerCase());
                        // Se la parola chiave viene trovata nel contesto normalizzato.
                        // If the keyword is found within the normalized context.
                        if (wordIndexInContext !== -1) {
                            // Definisce l'intervallo del frammento (4 parole prima e dopo).
                            // Defines the fragment range (4 words before and after).
                            const start = Math.max(0, wordIndexInContext - 4);
                            // Calcola l'indice di fine per il frammento (4 parole dopo + la parola stessa).
                            // Calculates the end index for the fragment (4 words after + the keyword itself).
                            const end = Math.min(contextWords.length, wordIndexInContext + 5);
                            // Estrae la porzione di parole che compongono il frammento visibile.
                            // Extracts the portion of words that make up the visible fragment.
                            const fragmentWords = contextWords.slice(start, end);
                            // Evidenzia in grassetto la parola chiave nel frammento.
                            // Bolds the keyword within the fragment.
                            const finalFragment = fragmentWords.map((w, i) => (start + i) === wordIndexInContext ? `**${w}**` : w).join(' ');
                            // Costruisce il link URI per la ricerca mirata in Obsidian.
                            // Builds the URI link for targeted search within Obsidian.
                            const queryFragment = fragmentWords.join(' ').replace(/"/g, '\"');
                            // Genera l'URI di ricerca specifico per Obsidian per localizzare l'occorrenza.
                            // Generates the specific Obsidian search URI to locate the occurrence.
                            const searchURI = `obsidian://search?vault=${encodeURIComponent(vaultName)}&query=path:"${encodeURIComponent(occ.file)}"%20"${encodeURIComponent(queryFragment)}"`;
                            // Aggiunge la riga dell'occorrenza al contenuto Markdown.
                            // Adds the occurrence line to the Markdown content.
                            markdownContent += `${t.OCCURRENCE}${index + 1}\t[[${occ.file}|${fileName}]]\t[${finalFragment}](${searchURI})\n`;
                        }
                        else {
                            // Fallback in caso la parola non sia identificabile nel contesto (dovrebbe essere raro).
                            // Fallback in case the word is not identifiable within the context (should be rare).
                            const searchURI = `obsidian://search?vault=${encodeURIComponent(vaultName)}&query=path:"${encodeURIComponent(occ.file)}"`;
                            // Aggiunge una riga di ripiego al Markdown se il contesto specifico non è stato identificato.
                            // Adds a fallback line to the Markdown if the specific context was not identified.
                            markdownContent += `${t.OCCURRENCE}${index + 1}\t[[${occ.file}|${fileName}]]\t[${t.CONTEXT_NOT_FOUND}${word}${t.IN_FILE}](${searchURI})\n`;
                        }
                    });
                    // Aggiunge un separatore tra le parole.
                    // Adds a separator between words.
                    markdownContent += '\n---\n';
                }
                // Scrive il file Markdown finale per la lettera corrente.
                // Writes the final Markdown file for the current letter.
                await writeDataToFile(this.app, `${outputFolder}/${letter}.md`, markdownContent);
            }
        }
        // Calcola la durata totale dell'operazione.
        // Calculates the total duration of the operation.
        const duration = (Date.now() - startTime) / 1000;
        // Notifica il completamento con il tempo impiegato.
        // Notifies completion with the time elapsed.
        new Notice(`${t.BUILD_COMPLETE}${duration.toFixed(2)}${t.SECONDS}`, 10000);
    }
};

// === CLASSE PER LA SCHEDA IMPOSTAZIONI ===
// === SETTINGS TAB CLASS ===

/**
 * Classe che gestisce la scheda delle impostazioni del plugin nell'interfaccia di Obsidian.
 * Class that manages the plugin settings tab within the Obsidian interface.
 */
class BuildVocabularySettingTab extends PluginSettingTab {
    /**
     * Costruttore della classe che inizializza l'applicazione e il riferimento al plugin.
     * Class constructor that initializes the application and the plugin reference.
     *
     * @param {App} app
     * L'istanza dell'applicazione Obsidian.
     * The Obsidian App instance.
     *
     * @param {BuildVocabularyPlugin} plugin
     * Il riferimento all'istanza del plugin.
     * The reference to the plugin instance.
     *
     */
    constructor(app, plugin) {
        // Chiama il costruttore della classe base PluginSettingTab.
        // Calls the constructor of the base PluginSettingTab class.
        super(app, plugin);
        // Memorizza il riferimento al plugin per accedere alle impostazioni e ai metodi.
        // Stores the reference to the plugin to access settings and methods.
        this.plugin = plugin;
    }
    // Metodo principale per visualizzare e renderizzare l'interfaccia delle impostazioni.
    // Main method to display and render the settings interface.
    display() {
        // Estrae l'elemento contenitore della scheda impostazioni.
        // Extracts the container element of the settings tab.
        const { containerEl } = this;
        // Svuota il contenitore prima di ogni renderizzazione.
        // Empties the container before each rendering.
        containerEl.empty();
        // Crea il titolo principale della scheda impostazioni.
        // Creates the main title of the settings tab.
        containerEl.createEl('h1', { text: t.SETTINGS_TITLE });

        // --- IMPOSTAZIONI DI BASE ---
        // --- BASIC SETTINGS ---

        // Crea un sottotitolo per la sezione delle impostazioni di base.
        // Creates a subtitle for the basic settings section.
        containerEl.createEl('h2', { text: t.BASIC_SETTINGS });
        // Impostazione per l'icona nella barra laterale.
        // Setting for Ribbon Icon.
        const ribbonSetting = new Setting(containerEl)
            // Imposta il nome dell'opzione.
            // Sets the option name.
            .setName(t.RIBBON_ICON_NAME)
            // Aggiunge un interruttore (toggle) per attivare o disattivare l'opzione.
            // Adds a toggle switch to enable or disable the option.
            .addToggle(toggle => toggle
                // Imposta il valore iniziale basato sulle impostazioni caricate.
                // Sets the initial value based on loaded settings.
                .setValue(this.plugin.settings.addRibbonIcon)
                // Gestisce il cambiamento di stato salvando la nuova impostazione.
                // Handles the state change by saving the new setting.
                .onChange(async (value) => {
                    // Assegna il nuovo valore booleano alla proprietà corrispondente nelle impostazioni.
                    // Assigns the new boolean value to the corresponding property in the settings.
                    this.plugin.settings.addRibbonIcon = value;
                    // Esegue il salvataggio asincrono dei dati.
                    // Performs asynchronous data saving.
                    await this.plugin.saveSettings();
                }));
        // Ora che l'impostazione (ribbonSetting) è completa di nome e toggle,
        // usiamo MarkdownRenderer per popolarne l'elemento descrizione (descEl).
        // In questo modo la descrizione complessa appare sotto il nome,
        // ma all'interno dello stesso blocco dell'impostazione.
        // Utilizza il MarkdownRenderer per visualizzare la descrizione complessa sotto l'impostazione.
        // Uses the MarkdownRenderer to display the complex description under the setting.
        MarkdownRenderer.renderMarkdown(
            t.RIBBON_ICON_DESC,
            // Destinazione della descrizione all'interno dell'elemento impostazione.
            // Description destination within the setting element.
            ribbonSetting.descEl,
            '',
            // Passa l'istanza del plugin come contesto per il rendering.
            // Passes the plugin instance as context for rendering.
            this.plugin
        );

        // --- FILTRI DI INCLUSIONE / ESCLUSIONE ---
        // --- INCLUSION / EXCLUSION FILTERS ---

        // Crea un sottotitolo per la sezione dedicata ai filtri di scansione.
        // Creates a subtitle for the section dedicated to scan filters.
        containerEl.createEl('h2', { text: t.FILES_FOLDERS_FILTERS });
        // Definisce l'impostazione per la scelta della cartella di output del plugin.
        // Defines the setting for choosing the plugin's output folder.
        const outputSetting = new Setting(containerEl)
            // Imposta il nome dell'opzione.
            // Sets the option name.
            .setName(t.OUTPUT_FOLDER_NAME)
            // Aggiunge un campo di testo per visualizzare il percorso selezionato.
            // Adds a text field to display the selected path.
            .addText(text => {
                // Mostra il percorso corrente o il segnaposto per la radice del vault ma non è modificabile direttamente.
                // Shows the current path or the placeholder for the vault root but is not directly editable.
                text.setValue(this.plugin.settings.outputFolder || t.ROOT_VAULT)
                    // Disabilita l'input manuale per forzare l'uso del selettore visuale.
                    // Disables manual input to force the use of the visual selector.
                    .setDisabled(true);
                // Imposta una larghezza fissa per migliorare la visualizzazione dell'interfaccia.
                // Sets a fixed width to improve the interface layout.
                text.inputEl.style.width = '250px';
            })
            // Aggiunge un pulsante per aprire il selettore di cartelle personalizzato.
            // Adds a button to open the custom folder selector.
            .addButton(btn => btn
                // Imposta il testo del pulsante.
                // Sets the button text.
                .setButtonText(t.CHOOSE_BUTTON)
                // Gestisce il click aprendo la modale di selezione.
                // Handles the click by opening the selection modal.
                .onClick(() => {
                    // Apre la modale 'SingleFolderSelectModal' definita più avanti nel codice.
                    // Opens the 'SingleFolderSelectModal' defined later in the code.
                    new SingleFolderSelectModal(this.app, (selectedPath) => {
                        // Aggiorna il percorso di output nelle impostazioni.
                        // Updates the output path in the settings.
                        this.plugin.settings.outputFolder = selectedPath;
                        // Salva permanentemente le nuove impostazioni.
                        // Permanently saves the new settings.
                        this.plugin.saveSettings();
                        // Ricarica la scheda impostazioni per riflettere il cambiamento.
                        // Reloads the settings tab to reflect the change.
                        this.display(); // Ridisegna la tab per mostrare il nuovo valore
                    }).open();
                }));
        // Utilizza il MarkdownRenderer per la descrizione complessa del blocco appena creato.
        // Uses the MarkdownRenderer for the complex description of the newly created block.
        MarkdownRenderer.renderMarkdown(
            // Imposta la descrizione dell'opzione.
            // Sets the option description.
            t.OUTPUT_FOLDER_DESC,
            // Specifica l'elemento HTML di destinazione per la descrizione.
            // Specifies the target HTML element for the description.
            outputSetting.descEl,
            '',
            // Passa l'istanza del plugin come contesto per il rendering.
            // Passes the plugin instance as context for rendering.
            this.plugin
        );
        // Aggiunge una linea orizzontale di separazione visiva nell'interfaccia.
        // Adds a horizontal separator line to the interface.
        containerEl.createEl('hr');
        // Definisce l'impostazione per selezionare le cartelle da cui iniziare la scansione.
        // Defines the setting to select the folders where the scan should start.
        const startFoldersSetting = new Setting(containerEl)
            // Imposta il nome dell'impostazione.
            // Sets the setting name.
            .setName(t.START_FOLDERS_NAME)
            // Aggiunge un pulsante per aprire la modale di selezione multipla.
            // Adds a button to open the multi-selection modal.
            .addButton(btn => btn
                // Imposta il testo del pulsante.
                // Sets the button text.
                .setButtonText(t.CHOOSE_FOLDERS_BTN)
                // Gestisce l'apertura della modale di selezione multipla al click.
                // Handles opening the multi-selection modal on click.
                .onClick(() => {
                    // Apre la modale MultiFolderSelectModal per le cartelle da includere.
                    // Opens the MultiFolderSelectModal for folders to include.
                    new MultiFolderSelectModal(this.app, t.MODAL_TITLE_INCLUDE, this.plugin.settings.startFolders, (selectedFolders) => {
                        // Salva la lista delle cartelle selezionate nelle impostazioni.
                        // Saves the list of selected folders in the settings.
                        this.plugin.settings.startFolders = selectedFolders;
                        // Salva permanentemente le impostazioni sul disco.
                        // Permanently saves the settings to disk.
                        this.plugin.saveSettings();
                        // Ridisegna la scheda per mostrare immediatamente le cartelle scelte.
                        // Redraws the tab to immediately show the chosen folders.
                        this.display();
                    }).open();
                }));
        // Utilizza il MarkdownRenderer per la descrizione complessa del blocco appena creato.
        // Uses the MarkdownRenderer for the complex description of the newly created block.
        MarkdownRenderer.renderMarkdown(
            // Imposta la descrizione dell'impostazione.
            // Sets the setting description.
            t.START_FOLDERS_DESC,
            // Specifica l'elemento HTML di destinazione per la descrizione.
            // Specifies the target HTML element for the description.
            startFoldersSetting.descEl,
            '',
            // Passa l'istanza del plugin come contesto per il rendering.
            // Passes the plugin instance as context for rendering.
            this.plugin
        );
        // Crea un elemento div per visualizzare l'elenco testuale delle cartelle attualmente incluse.
        // Creates a div element to display the text list of currently included folders.
        const includedFoldersDiv = containerEl.createEl('div', {
            cls: 'setting-item-description',
        });
        // Applica un margine a sinistra e sotto l'elemento.
        // Applies a margin to the left and bottom of the element.
        Object.assign(includedFoldersDiv.style, {
            marginLeft: '10px',
            marginBottom: '10px'
        });
        // Definisce il colore e altri parametri per il testo dell'etichetta.
        // Defines color and others parameters for label text.
        const includedFoldersLabelColor = 'color: #41b06f; font-weight: bold; font-size: 1.25em;';
        // Prepara la lista delle cartelle in formato Markdown. Se non ci sono cartelle, mostra "Tutto il Vault".
        // Prepares the list of folders in Markdown format. If no folders are present, it shows "Entire Vault".
        const foldersList = this.plugin.settings.startFolders.length > 0
            ? "\n- " + this.plugin.settings.startFolders.join("\n- ")
            : " " + t.ALL_VAULT;
        // Combina l'etichetta con la lista e renderizza in Markdown.
        // Combines the label with the list and renders in Markdown.
        MarkdownRenderer.renderMarkdown(
            `<span style="${includedFoldersLabelColor}">${t.INCLUDED_FOLDERS_LABEL}</span>` + foldersList,
            includedFoldersDiv,
            '',
            // Passa l'istanza del plugin come contesto per il rendering.
            // Passes the plugin instance as context for rendering.
            this.plugin
        );
        // Impostazione per selezionare le cartelle da escludere completamente dalla scansione.
        // Setting to select folders to be completely excluded from scanning.
        const exclusionFoldersSetting = new Setting(containerEl)
            // Imposta il nome dell'impostazione.
            // Sets the setting name.
            .setName(t.EXCLUSION_FOLDERS_NAME)
            // Aggiunge un pulsante per aprire la modale di selezione multipla.
            // Adds a button to open the multi-selection modal.
            .addButton(btn => btn
                // Imposta il testo del pulsante.
                // Sets the button text.
                .setButtonText(t.CHOOSE_FOLDERS_BTN)
                // Gestisce l'apertura della modale di esclusione al click.
                // Handles opening the exclusion modal on click.
                .onClick(() => {
                    // Apre la modale MultiFolderSelectModal per le cartelle da escludere.
                    // Opens the MultiFolderSelectModal for folders to exclude.
                    new MultiFolderSelectModal(this.app, t.MODAL_TITLE_EXCLUDE, this.plugin.settings.exclusionFolders, (selectedFolders) => {
                        // Aggiorna l'elenco delle cartelle escluse nelle impostazioni.
                        // Updates the list of excluded folders in the settings.
                        this.plugin.settings.exclusionFolders = selectedFolders;
                        // Salva permanentemente le modifiche.
                        // Permanently saves the changes.
                        this.plugin.saveSettings();
                        // Ridisegna la scheda per aggiornare la visualizzazione.
                        // Redraws the tab to update the display.
                        this.display();
                    }).open();
                }));
        // Utilizza il MarkdownRenderer per la descrizione complessa del blocco appena creato.
        // Uses the MarkdownRenderer for the complex description of the newly created block.
        MarkdownRenderer.renderMarkdown(
            // Imposta la descrizione spiegando la priorità del filtro.
            // Sets the description explaining the filter priority.
            t.EXCLUSION_FOLDERS_DESC,
            // Specifica l'elemento HTML di destinazione per la descrizione.
            // Specifies the target HTML element for the description.
            exclusionFoldersSetting.descEl,
            '',
            // Passa l'istanza del plugin come contesto per il rendering.
            // Passes the plugin instance as context for rendering.
            this.plugin
        );
        // Crea un elemento per visualizzare l'elenco delle cartelle attualmente escluse.
        // Creates an element to display the list of currently excluded folders.
        const excludedFoldersDiv = containerEl.createEl('div', {
            cls: 'setting-item-description'
        });
        // Applica un margine a sinistra e sotto l'elemento.
        // Applies a margin to the left and bottom of the element.
        Object.assign(excludedFoldersDiv.style, {
            marginLeft: '10px',
            marginBottom: '10px'
        });
        // Definisce il colore e altri parametri per il testo dell'etichetta.
        // Defines color and others parameters for label text.
        const excludedFoldersLabelColor = 'color: #c64c4c; font-weight: bold; font-size: 1.25em;';
        // Prepara la lista delle cartelle in formato Markdown. Se non ci sono cartelle, mostra "Nessuna".
        // Prepares the list of folders in Markdown format. If no folders are present, it shows "None".
        const excludedFoldersList = this.plugin.settings.exclusionFolders.length > 0
            ? "\n- " + this.plugin.settings.exclusionFolders.join("\n- ")
            : "\n- " + t.NONE;
        // Combina l'etichetta con la lista e renderizza in Markdown.
        // Combines the label with the list and renders in Markdown.
        MarkdownRenderer.renderMarkdown(
            `<span style="${excludedFoldersLabelColor}">${t.EXCLUDED_FOLDERS_LABEL}</span>` + excludedFoldersList,
            excludedFoldersDiv,
            '',
            // Passa l'istanza del plugin come contesto per il rendering.
            // Passes the plugin instance as context for rendering.
            this.plugin
        );
        // Impostazione per definire pattern testuali di esclusione tramite caratteri jolly.
        // Setting to define textual exclusion patterns using wildcards.
        const exclusionPatternsSetting = new Setting(containerEl)
            // Imposta il nome dell'impostazione per i pattern.
            // Sets the name for the patterns setting.
            .setName(t.EXCLUSION_PATTERNS_NAME)
            // Aggiunge un campo di testo per l'inserimento dei pattern.
            // Adds a text field for entering patterns.
            .addText(text => text
                // Imposta il valore predefinito come suggerimento.
                // Sets the default value as a placeholder.
                .setPlaceholder(DEFAULT_SETTINGS.exclusionPatterns)
                // Imposta il valore attuale salvato nelle impostazioni.
                // Sets the current value saved in settings.
                .setValue(this.plugin.settings.exclusionPatterns)
                // Salva ogni modifica apportata dall'utente.
                // Saves every change made by the user.
                .onChange(async (value) => {
                    // Aggiorna il pattern nelle impostazioni del plugin.
                    // Updates the pattern in the plugin settings.
                    this.plugin.settings.exclusionPatterns = value;
                    // Esegue il salvataggio asincrono dei dati.
                    // Performs asynchronous data saving.
                    await this.plugin.saveSettings();
                }));
        // Utilizza il MarkdownRenderer per la descrizione complessa del blocco appena creato.
        // Uses the MarkdownRenderer for the complex description of the newly created block.
        MarkdownRenderer.renderMarkdown(
            // Imposta la descrizione con esempi d'uso dei jolly.
            // Sets the description with wildcard usage examples.
            t.EXCLUSION_PATTERNS_DESC,
            // Specifica l'elemento HTML di destinazione per la descrizione.
            // Specifies the target HTML element for the description.
            exclusionPatternsSetting.descEl,
            '',
            // Passa l'istanza del plugin come contesto per il rendering.
            // Passes the plugin instance as context for rendering.
            this.plugin
        );
        // Aggiunge una linea orizzontale di separazione visiva nell'interfaccia.
        // Adds a horizontal separator line to the interface.
        containerEl.createEl('hr');

        // --- FILTRI VOCABOLARIO ---
        // --- VOCABULARY FILTERS ---

        // Crea un titolo di terzo livello per la sezione dei filtri linguistici del vocabolario.
        // Creates a level 3 heading for the vocabulary linguistic filters section.
        containerEl.createEl('h2', { text: t.VOCABULARY_FILTERS });
        // Impostazione per definire la lunghezza minima delle parole da indicizzare.
        // Setting to define the minimum length of words to be indexed.
        new Setting(containerEl)
            // Imposta il nome dell'impostazione.
            // Sets the setting name.
            .setName(t.MIN_WORD_LENGTH_NAME)
            // Imposta la descrizione spiegando l'effetto del filtro sulla scansione.
            // Sets the description explaining the filter's effect on the scan.
            .setDesc(t.MIN_WORD_LENGTH_DESC)
            // Aggiunge un campo di testo per l'inserimento del valore numerico.
            // Adds a text field for entering the numerical value.
            .addText(text => text
                // Imposta il valore predefinito come suggerimento nel campo.
                // Sets the default value as a placeholder in the field.
                .setPlaceholder(String(DEFAULT_SETTINGS.minWordLength))
                // Imposta il valore attuale recuperato dalle impostazioni del plugin.
                // Sets the current value retrieved from the plugin settings.
                .setValue(String(this.plugin.settings.minWordLength))
                // Gestisce il cambiamento del valore inserito dall'utente.
                // Handles the change of the value entered by the user.
                .onChange(async (value) => {
                    // Converte la stringa inserita in un numero intero base 10.
                    // Converts the entered string into a base-10 integer.
                    const numValue = parseInt(value, 10);
                    // Verifica che il valore sia un numero valido e maggiore di zero.
                    // Checks that the value is a valid number and greater than zero.
                    if (!isNaN(numValue) && numValue > 0) {
                        // Aggiorna la preferenza nelle impostazioni del plugin.
                        // Updates the preference in the plugin settings.
                        this.plugin.settings.minWordLength = numValue;
                        // Salva permanentemente le impostazioni aggiornate.
                        // Permanently saves the updated settings.
                        await this.plugin.saveSettings();
                    }
                }));

        // --- FILTRI STOP-WORD ---
        // --- STOP-WORD FILTERS ---

        // Crea l'impostazione per includere o escludere gli articoli determinativi.
        // Creates the setting to include or exclude definite articles.
        new Setting(containerEl)
            // Imposta il nome dell'opzione (articoli determinativi).
            // Sets the option name (definite articles).
            .setName(t.INC_DEF_ART_NAME)
            // Imposta la descrizione dell'opzione con esempi di parole escluse.
            // Sets the option description with examples of excluded words.
            .setDesc(t.INC_DEF_ART_DESC)
            // Aggiunge il toggle per l'attivazione/disattivazione.
            // Adds the toggle for enabling/disabling.
            .addToggle(toggle => toggle
                // Configura il valore iniziale recuperato dalle impostazioni salvate.
                // Configures the initial value retrieved from the saved settings.
                .setValue(this.plugin.settings.includeArticoliDeterminativi)
                // Salva la nuova impostazione ogni volta che l'interruttore viene azionato.
                // Saves the new setting every time the toggle is operated.
                .onChange(async (value) => {
                    // Aggiorna la preferenza specifica nelle impostazioni del plugin.
                    // Updates the specific preference in the plugin settings.
                    this.plugin.settings.includeArticoliDeterminativi = value;
                    // Salva permanentemente le impostazioni aggiornate sul disco.
                    // Permanently saves the updated settings to disk.
                    await this.plugin.saveSettings();
                }));
        // Crea l'impostazione per includere o escludere gli articoli indeterminativi.
        // Creates the setting to include or exclude indefinite articles.
        new Setting(containerEl)
            // Imposta il nome dell'opzione (articoli indeterminativi).
            // Sets the option name (indefinite articles).
            .setName(t.INC_IND_ART_NAME)
            // Imposta la descrizione dell'opzione con esempi di parole escluse.
            // Sets the option description with examples of excluded words.
            .setDesc(t.INC_IND_ART_DESC)
            // Aggiunge il toggle per l'attivazione/disattivazione.
            // Adds the toggle for enabling/disabling.
            .addToggle(toggle => toggle
                // Configura il valore iniziale recuperato dalle impostazioni salvate.
                // Configures the initial value retrieved from the saved settings.
                .setValue(this.plugin.settings.includeArticoliIndeterminativi)
                // Salva la nuova impostazione ogni volta che l'interruttore viene azionato.
                // Saves the new setting every time the toggle is operated.
                .onChange(async (value) => {
                    // Aggiorna la preferenza specifica nelle impostazioni del plugin.
                    // Updates the specific preference in the plugin settings.
                    this.plugin.settings.includeArticoliIndeterminativi = value;
                    // Salva permanentemente le impostazioni aggiornate sul disco.
                    // Permanently saves the updated settings to disk.
                    await this.plugin.saveSettings();
                }));
        // Crea l'impostazione per includere o escludere le preposizioni semplici.
        // Creates the setting to include or exclude simple prepositions.
        new Setting(containerEl)
            // Imposta il nome dell'opzione (preposizioni semplici).
            // Sets the option name (simple prepositions).
            .setName(t.INC_SIM_PREP_NAME)
            // Imposta la descrizione dell'opzione con esempi di parole escluse.
            // Sets the option description with examples of excluded words.
            .setDesc(t.INC_SIM_PREP_DESC)
            // Aggiunge il toggle per l'attivazione/disattivazione.
            // Adds the toggle for enabling/disabling.
            .addToggle(toggle => toggle
                // Configura il valore iniziale recuperato dalle impostazioni salvate.
                // Configures the initial value retrieved from the saved settings.
                .setValue(this.plugin.settings.includePreposizioniSemplici)
                // Salva la nuova impostazione ogni volta che l'interruttore viene azionato.
                // Saves the new setting every time the toggle is operated.
                .onChange(async (value) => {
                    // Aggiorna la preferenza specifica nelle impostazioni del plugin.
                    // Updates the specific preference in the plugin settings.
                    this.plugin.settings.includePreposizioniSemplici = value;
                    // Salva permanentemente le impostazioni aggiornate sul disco.
                    // Permanently saves the updated settings to disk.
                    await this.plugin.saveSettings();
                }));
        // Crea l'impostazione per includere o escludere le preposizioni articolate.
        // Creates the setting to include or exclude prepositional articles.
        new Setting(containerEl)
            .setDesc('Se disattivato, esclude parole come "del", "nella", "sugli", ecc.')
            // Imposta il nome dell'opzione (preposizioni articolate).
            // Sets the option name (prepositional articles).
            .setName(t.INC_ART_PREP_NAME)
            // Imposta la descrizione dell'opzione con esempi di parole escluse.
            // Sets the option description with examples of excluded words.
            .setDesc(t.INC_ART_PREP_DESC)
            // Aggiunge il toggle per l'attivazione/disattivazione.
            // Adds the toggle for enabling/disabling.
            .addToggle(toggle => toggle
                // Configura il valore iniziale recuperato dalle impostazioni salvate.
                // Configures the initial value retrieved from the saved settings.
                .setValue(this.plugin.settings.includePreposizioniArticolate)
                // Salva la nuova impostazione ogni volta che l'interruttore viene azionato.
                // Saves the new setting every time the toggle is operated.
                .onChange(async (value) => {
                    // Aggiorna la preferenza specifica nelle impostazioni del plugin.
                    // Updates the specific preference in the plugin settings.
                    this.plugin.settings.includePreposizioniArticolate = value;
                    // Salva permanentemente le impostazioni aggiornate sul disco.
                    // Permanently saves the updated settings to disk.
                    await this.plugin.saveSettings();
                }));
        // Aggiunge una linea orizzontale di separazione visiva nell'interfaccia.
        // Adds a horizontal separator line to the interface.
        containerEl.createEl('hr');

        // --- GESTIONE ENTITÀ COMPOSTE ---
        // --- COMPOUND ENTITIES MANAGEMENT ---

        // Crea un titolo di secondo livello per la sezione delle parole composte.
        // Creates a level 2 heading for the compound words section.
        containerEl.createEl('h2', { text: t.COMPOUND_WORDS_SECTION });
        // Crea una nuova impostazione per la gestione delle entità e la assegna a una costante.
        // Creates a new setting for entity management and assigns it to a constant.
        const compoundManagement = new Setting(containerEl)
            // Imposta il nome dell'opzione.
            // Sets the option name.
            .setName(t.COMPOUND_WORDS_NAME)
            // Aggiunge un pulsante all'impostazione.
            // Adds a button to the setting.
            .addButton(btn => btn
                // Imposta il testo del pulsante.
                // Sets the button text.
                .setButtonText(t.EDIT_BTN)
                // Gestisce l'apertura della modale di modifica al click.
                // Handles opening the edit modal on click.
                .onClick(() => {
                    // Crea una nuova istanza della modale per gestire le entità composte.
                    // Creates a new instance of the modal to manage compound entities.
                    new CompoundEntitiesManagerModal(this.app, infoSubtitle, listaEntita, async (updatedList) => {
                        // Aggiorna la lista locale in memoria con i nuovi dati ricevuti dalla modale.
                        // Updates the local in-memory list with the new data received from the modal.
                        listaEntita = updatedList;
                        // Ricostruisce l'oggetto JSON completo mantenendo la riga di informazioni.
                        // Reconstructs the complete JSON object keeping the info line.
                        const dataToSave = {
                            "_info": infoSubtitle,
                            "PAROLE_COMPOSTE": listaEntita
                        };
                        // Scrive fisicamente il file JSON aggiornato nella cartella del plugin.
                        // Physically writes the updated JSON file into the plugin folder.
                        await this.app.vault.adapter.write(jsonPath, JSON.stringify(dataToSave, null, 4));
                        // Invia una notifica di conferma all'utente.
                        // Sends a confirmation notice to the user.
                        new Notice(t.SAVE_BTN);
                    }).open();
                }));
        // Utilizza il MarkdownRenderer per la descrizione complessa del blocco appena creato.
        // Uses the MarkdownRenderer for the complex description of the newly created block.
        MarkdownRenderer.renderMarkdown(
            // Imposta la descrizione dell'impostazione.
            // Sets the setting description.
            t.COMPOUND_WORDS_DESC,
            // Specifica l'elemento HTML di destinazione per la descrizione.
            // Specifies the target HTML element for the description.
            compoundManagement.descEl,
            '',
            // Passa l'istanza del plugin come contesto per il rendering.
            // Passes the plugin instance as context for rendering.
            this.plugin
        );
    }
}

// === MODALE PER LA SELEZIONE DI UNA SINGOLA CARTELLA ===
// === MODAL FOR SINGLE FOLDER SELECTION ===

/**
 * Modale che permette all'utente di selezionare una cartella dal vault.
 * Modal that allows the user to select a folder from the vault.
 */
class SingleFolderSelectModal extends Modal {
    /**
     * Costruttore della modale di selezione cartella singola.
     * Constructor for the single folder selection modal.
     *
     * @param {App} app
     * L'istanza dell'applicazione Obsidian.
     * The Obsidian App instance.
     *
     * @param {function} onSelectCallback
     * Funzione di richiamo eseguita al momento della selezione.
     * Callback function executed upon selection.
     *
     */
    constructor(app, onSelectCallback) {
        // Chiama il costruttore della classe base Modal di Obsidian.
        // Calls the constructor of the Obsidian base Modal class.
        super(app);
        // Memorizza la funzione di callback per restituire il percorso selezionato.
        // Stores the callback function to return the selected path.
        this.onSelectCallback = onSelectCallback;
    }
    // Metodo chiamato quando la modale viene aperta dall'utente.
    // Method called when the modal is opened by the user.
    onOpen() {
        // Estrae l'elemento contenitore del contenuto della modale.
        // Extracts the container element for the modal content.
        const { contentEl } = this;
        // Crea l'intestazione della modale.
        // Creates the modal header.
        contentEl.createEl('h2', { text: t.SELECT_OUTPUT_TITLE });
        // Funzione ricorsiva per creare la visualizzazione ad albero delle cartelle.
        // Recursive function to create the folder tree view.
        const createTree = (folder, parentEl) => {
            // Filtra i figli per ottenere solo le cartelle e le ordina alfabeticamente.
            // Filters children to get only folders and sorts them alphabetically.
            const sortedChildren = folder.children
                .filter(child => child instanceof TFolder)
                .sort((a, b) => a.name.localeCompare(b.name));
            // Ciclo attraverso ogni cartella figlia individuata.
            // Loops through each identified child folder.
            for (const child of sortedChildren) {
                // Crea un elemento HTML 'details' per permettere l'espansione della cartella.
                // Creates a 'details' HTML element to allow folder expansion.
                const details = parentEl.createEl('details');
                // Crea l'elemento 'summary' che funge da testata cliccabile per il 'details'.
                // Creates the 'summary' element which acts as a clickable header for the 'details'.
                const summary = details.createEl('summary');
                // Crea un contenitore div per l'elemento della cartella con una classe specifica.
                // Creates a div container for the folder item with a specific class.
                const item = summary.createDiv({ cls: 'folder-item' });
                // Aggiunge il nome della cartella all'interno di uno span per lo stile.
                // Adds the folder name inside a span for styling.
                item.createEl('span', {
                    text: child.name,
                    cls: 'folder-name'
                });
                // Aggiunge il pulsante di selezione per confermare la cartella scelta.
                // Adds the select button to confirm the chosen folder.
                const selectButton = item.createEl('button', { text: t.SELECT_FOLDER_BTN });
                // Gestisce l'evento di click sul pulsante di selezione.
                // Handles the click event on the select button.
                selectButton.onClickEvent(evt => {
                    // Ferma la propagazione del click per evitare di espandere/chiudere il 'details'.
                    // Stops click propagation to prevent expanding/collapsing the 'details' element.
                    evt.stopPropagation();
                    // Esegue la funzione di callback passando il percorso della cartella selezionata.
                    // Executes the callback function passing the selected folder path.
                    this.onSelectCallback(child.path);
                    // Chiude la finestra modale dopo la selezione.
                    // Closes the modal window after selection.
                    this.close();
                });
                // Verifica se la cartella corrente contiene altre sottocartelle continua la ricorsione.
                // Checks if the current folder contains other subfolders continue for recursion.
                if (child.children.some(c => c instanceof TFolder)) {
                    // Richiama ricorsivamente la funzione per costruire i rami inferiori dell'albero.
                    // Recursively calls the function to build the lower branches of the tree.
                    createTree(child, details);
                }
            }
        };
        // Aggiunge la radice del vault come prima opzione selezionabile nell'elenco.
        // Adds the vault root as the first selectable option in the list.
        const rootContainer = contentEl.createDiv('folder-item');
        // Crea uno span per visualizzare il nome della radice del vault.
        // Creates a span to display the name of the vault root.
        rootContainer.createEl('span', {
            text: t.ROOT_VAULT,
            cls: 'folder-name'
        });
        // Aggiunge il pulsante di selezione specifico per la radice del vault.
        // Adds the specific select button for the vault root.
        const selectRootButton = rootContainer.createEl('button', { text: t.SELECT_FOLDER_BTN });
        // Gestisce il click sul pulsante per selezionare la radice del vault.
        // Handles the button click to select the vault root.
        selectRootButton.onClickEvent(() => {
            // Invia una stringa vuota alla funzione di richiamo per indicare la radice.
            // Sends an empty string to the callback function to indicate the root.
            this.onSelectCallback('');
            // Chiude la finestra modale dopo aver confermato la selezione.
            // Closes the modal window after confirming the selection.
            this.close();
        });
        // Avvia la creazione ricorsiva dell'albero delle cartelle partendo dalla radice.
        // Starts the recursive creation of the folder tree starting from the root.
        createTree(this.app.vault.getRoot(), contentEl);
    }
    // Metodo chiamato quando la modale viene chiusa per pulire le risorse.
    // Method called when the modal is closed to clean up resources.
    onClose() {
        // Svuota completamente l'elemento del contenuto per liberare memoria.
        // Completely empties the content element to free up memory.
        this.contentEl.empty();
    }
}

// === MODALE PER LA SELEZIONE DELLE CARTELLE ===
// === MODAL FOR FOLDER SELECTION ===

/**
 * Modale che permette all'utente di selezionare più cartelle dal vault contemporaneamente.
 * Modal that allows the user to select multiple folders from the vault at once.
 */
class MultiFolderSelectModal extends Modal {
    /**
     * Costruttore della modale di selezione multipla.
     * Constructor for the multi-selection modal.
     *
     * @param {App} app
     * L'istanza dell'applicazione Obsidian.
     * The Obsidian App instance.
     *
     * @param {string} title
     * Il titolo da visualizzare nella modale.
     * The title to display in the modal.
     *
     * @param {string[]} selectedFoldersArray
     * L'elenco delle cartelle già selezionate.
     * The list of already selected folders.
     *
     * @param {function} onSaveCallback
     * Funzione eseguita al salvataggio della selezione.
     * Function executed when saving the selection.
     *
     */
    constructor(app, title, selectedFoldersArray, onSaveCallback) {
        // Chiama il costruttore della classe base Modal di Obsidian.
        // Calls the constructor of the Obsidian base Modal class.
        super(app);
        // Imposta il titolo della modale passato come argomento.
        // Sets the modal title passed as an argument.
        this.title = title;
        // Memorizza una COPIA dell'array per poterla modificare senza effetti collaterali immediati.
        // Stores a COPY of the array to modify it without immediate side effects.
        this.selectedFolders = [...selectedFoldersArray];
        // Memorizza la funzione di richiamo per salvare le modifiche finali.
        // Stores the callback function to save final changes.
        this.onSaveCallback = onSaveCallback;
    }
    // Metodo chiamato all'apertura della modale per inizializzare l'interfaccia.
    // Method called when the modal opens to initialize the interface.
    onOpen() {
        // Estrae l'elemento contenitore del contenuto della modale.
        // Extracts the container element for the modal content.
        const { contentEl } = this;
        // Crea l'intestazione della modale utilizzando il titolo passato al costruttore.
        // Creates the modal header using the title passed to the constructor.
        contentEl.createEl('h2', { text: this.title });
        // Funzione ricorsiva per creare la lista delle cartelle selezionabili.
        // Recursive function to create the list of selectable folders.
        const createTree = (folder, parentEl) => {
            // Filtra solo le cartelle e le ordina alfabeticamente.
            // Filters only folders and sorts them alphabetically.
            const children = folder.children
                // Filtra gli elementi per includere esclusivamente le istanze di tipo cartella.
                // Filters elements to exclusively include folder-type instances.
                .filter(c => c instanceof TFolder)
                // Ordina le cartelle alfabeticamente basandosi sul nome e sulla localizzazione.
                // Sorts folders alphabetically based on name and localization.
                .sort((a, b) => a.name.localeCompare(b.name));
            // Ciclo attraverso ogni cartella individuata per creare un'impostazione.
            // Loops through each identified folder to create a setting.
            for (const child of children) {
                // Crea una nuova riga di impostazione per la cartella corrente.
                // Creates a new setting row for the current folder.
                const setting = new Setting(parentEl)
                    // Imposta il nome visualizzato come il nome della cartella.
                    // Sets the display name as the folder name.
                    .setName(child.name)
                    // Imposta il percorso completo come descrizione.
                    // Sets the full path as the description.
                    .setDesc(child.path)
                    // Aggiunge un interruttore per gestire la selezione multipla.
                    // Adds a toggle to manage multiple selection.
                    .addToggle(toggle => {
                        // Imposta lo stato iniziale dell'interruttore verificando la presenza nell'array.
                        // Sets the initial toggle state by checking presence in the array.
                        toggle.setValue(this.selectedFolders.includes(child.path))
                            // Gestisce il cambiamento di stato dell'interruttore.
                            // Handles the change of the toggle state.
                            .onChange((value) => {
                                // Memorizza il percorso della cartella corrente.
                                // Stores the current folder path.
                                const path = child.path;
                                // Se l'interruttore viene attivato.
                                // If the toggle is enabled.
                                if (value) {
                                    // Aggiunge il percorso all'array se non è già presente.
                                    // Adds the path to the array if it is not already present.
                                    if (!this.selectedFolders.includes(path)) {
                                        // Inserisce il nuovo percorso nell'elenco delle cartelle selezionate.
                                        // Inserts the new path into the list of selected folders.
                                        this.selectedFolders.push(path);
                                    }
                                }
                                // Se l'interruttore viene disattivato.
                                // If the toggle is disabled.
                                else {
                                    // Rimuove il percorso filtrando l'array esistente.
                                    // Removes the path by filtering the existing array.
                                    this.selectedFolders = this.selectedFolders.filter(p => p !== path);
                                }
                                // NOTA: Non salviamo le impostazioni qui, lo faremo alla chiusura.
                                // NOTE: We do not save the settings here, we will do it at the end.
                            });
                    });
                // Aggiunge una classe CSS personalizzata all'elemento della riga.
                // Adds a custom CSS class to the row element.
                setting.settingEl.addClass('folder-selection-setting');
            }
        }
        // Avvia la creazione dell'albero delle cartelle partendo dalla radice del vault.
        // Starts the folder tree creation starting from the vault root.
        createTree(this.app.vault.getRoot(), contentEl);
        // Crea un contenitore div per i pulsanti d'azione nella parte inferiore della modale.
        // Creates a div container for action buttons at the bottom of the modal.
        const buttonContainer = contentEl.createDiv({ cls: 'modal-button-container' });
        // Crea il pulsante di salvataggio con lo stile primario di Obsidian (mod-cta).
        // Creates the save button with the primary Obsidian style (mod-cta).
        const saveButton = buttonContainer.createEl('button', {
            // Imposta il testo del pulsante utilizzando la traduzione localizzata.
            // Sets the button text using the localized translation.
            text: t.SAVE_BTN,
            cls: 'mod-cta'
        });
        // Gestisce l'evento di click sul pulsante di salvataggio.
        // Handles the click event on the save button.
        saveButton.onClickEvent(() => {
            // Esegue la funzione di callback passando l'array delle cartelle selezionate.
            // Executes the callback function passing the array of selected folders.
            this.onSaveCallback(this.selectedFolders);
            // Chiude la finestra modale dopo il salvataggio.
            // Closes the modal window after saving.
            this.close();
        });
    }
    // Metodo chiamato alla chiusura della modale per la gestione della memoria.
    // Method called when the modal closes for memory management.
    onClose() {
        // Svuota il contenuto della modale per liberare le risorse DOM.
        // Empties the modal content to release DOM resources.
        this.contentEl.empty();
    }
}

// === MODALE PER LA GESTIONE DELLE ENTITÀ COMPOSTE ===
// === MODAL FOR COMPOUND ENTITIES MANAGEMENT ===

/**
 * Modale che permette all'utente di aggiungere, modificare ed eliminare le entità composte.
 * Modal that allows the user to add, edit, and delete compound entities.
 */
class CompoundEntitiesManagerModal extends Modal {
    /**
     * Costruttore della modale di gestione delle entità composte.
     * Constructor for the compound entities management modal.
     *
     * @param {App} app
     * L'istanza dell'applicazione Obsidian.
     * The Obsidian App instance.
     *
     * @param {string} infoSubtitle
     * Il sottotitolo descrittivo estratto dal file JSON (_info).
     * The descriptive subtitle extracted from the JSON file (_info).
     *
     * @param {string[]} entitiesList
     * L'elenco delle entità attualmente memorizzate.
     * The list of currently stored entities.
     *
     * @param {function} onSaveCallback
     * Funzione eseguita al salvataggio per aggiornare il file JSON e la UI.
     * Function executed on save to update the JSON file and the UI.
     */
    constructor(app, infoSubtitle, entitiesList, onSaveCallback) {
        // Chiama il costruttore della classe base Modal di Obsidian.
        // Calls the constructor of the Obsidian base Modal class.
        super(app);
        // Memorizza il sottotitolo descrittivo.
        // Stores the descriptive subtitle.
        this.infoSubtitle = infoSubtitle;
        // Memorizza una COPIA dell'array delle entità per modificarla localmente.
        // Stores a COPY of the entities array for local modification.
        this.entitiesList = [...entitiesList];
        // Memorizza la funzione di richiamo per salvare le modifiche finali.
        // Stores the callback function to save final changes.
        this.onSaveCallback = onSaveCallback;
    }
    // Metodo chiamato all'apertura della modale per inizializzare l'interfaccia.
    // Method called when the modal opens to initialize the interface.
    onOpen() {
        // Estrae l'elemento di contenuto della modale.
        // Extracts the content element of the modal.
        const { contentEl } = this;
        // Imposta il titolo principale della modale.
        // Sets the main title of the modal.
        contentEl.createEl('h1', { text: t.COMPOUND_WORDS_NAME });
        // Crea un contenitore per il sottotitolo informativo.
        // Creates a container for the informative subtitle.
        const subtitleEl = contentEl.createEl('div', { cls: 'setting-item-description' });
        // Applica uno spazio sotto il sottotitolo.
        // Applies a margin below the subtitle.
        subtitleEl.style.marginBottom = '20px';
        // Utilizza il MarkdownRenderer per visualizzare il sottotitolo (supporta formattazione).
        // Uses the MarkdownRenderer to display the subtitle (supports formatting).
        MarkdownRenderer.renderMarkdown(
            // Il testo informativo estratto dalla chiave _info del JSON.
            // The informative text extracted from the _info key of the JSON.
            this.infoSubtitle,
            // Elemento di destinazione per il rendering.
            // Target element for rendering.
            subtitleEl,
            '',
            // Passa l'istanza del plugin (disponibile tramite l'app o passata al costruttore).
            // Passes the plugin instance (available via app or passed to the constructor).
            this.app.plugins.plugins['obsidian-build-vocabulary']
        );
        // Crea un'area scorrevole per contenere la lista delle entità.
        // Creates a scrollable area to contain the entities list.
        this.listContainer = contentEl.createEl('div');
        // Imposta l'altezza massima e lo scorrimento per la lista.
        // Sets the maximum height and scrolling for the list.
        Object.assign(this.listContainer.style, {
            maxHeight: '400px',
            overflowY: 'auto',
            marginBottom: '20px',
            paddingRight: '10px'
        });
        // Chiama il metodo per popolare la lista delle entità.
        // Calls the method to populate the entities list.
        this.renderEntitiesList();
    }
    // Metodo per renderizzare o aggiornare la lista delle entità all'interno della modale.
    // Method to render or refresh the entities list inside the modal.
    renderEntitiesList() {
        // Svuota il contenitore della lista per prepararlo al nuovo rendering.
        // Empties the list container to prepare it for new rendering.
        this.listContainer.empty();
        // --- 1. SEZIONE AGGIUNTA (IN ALTO) ---
        // --- 1. ADDITION SECTION (TOP) ---
        // Crea una nuova impostazione per l'inserimento di una nuova entità.
        // Creates a new setting for inserting a new entity.
        const addSection = new Setting(this.listContainer)
            // Imposta l'etichetta della sezione di aggiunta.
            // Sets the label for the addition section.
            .setName(t.ADD_NEW_ENTITY_LABEL)
            // Aggiunge un campo di testo per inserire la nuova stringa.
            // Adds a text field to enter the new string.
            .addText(text => {
                // Imposta il testo segnaposto nel campo di input.
                // Sets the placeholder text in the input field.
                text.setPlaceholder(t.NEW_ENTITY_PLACEHOLDER);
                // Memorizza il riferimento all'input per recuperarne il valore successivamente.
                // Stores the input reference to retrieve its value later.
                this.newEntityInput = text;
                // Imposta la larghezza del campo di input al 100%.
                // Sets the input field width to 100%.
                text.inputEl.style.width = '100%';
            })
            // Aggiunge il pulsante per confermare l'inserimento.
            // Adds the button to confirm the insertion.
            .addButton(btn => btn
                // Imposta il testo del pulsante recuperandolo dalle traduzioni.
                // Sets the button text by retrieving it from translations.
                .setButtonText(t.ADD_BTN)
                // Applica lo stile "Call to Action" per evidenziare il pulsante.
                // Applies the "Call to Action" style to highlight the button.
                .setCta()
                // Definisce l'azione da eseguire al clic sul pulsante.
                // Defines the action to be performed when the button is clicked.
                .onClick(() => {
                    // Recupera il valore inserito rimuovendo gli spazi superflui.
                    // Retrieves the entered value by removing unnecessary spaces.
                    const newValue = this.newEntityInput.getValue().trim();
                    // Se il valore non è vuoto, lo aggiunge all'array e rinfresca la lista.
                    // If the value is not empty, adds it to the array and refreshes the list.
                    if (newValue) {
                        // Aggiunge la nuova entità alla lista in memoria.
                        // Adds the new entity to the in-memory list.
                        this.entitiesList.push(newValue);
                        // Esegue nuovamente il rendering per mostrare la nuova voce.
                        // Performs the rendering again to show the new entry.
                        this.renderEntitiesList();
                    }
                }));
        // --- 2. SEZIONE RICERCA (FILTRO IN TEMPO REALE) ---
        // --- 2. SEARCH SECTION (REAL-TIME FILTER) ---
        // Crea una nuova impostazione dedicata alla funzionalità di ricerca.
        // Creates a new setting dedicated to the search functionality.
        const searchSection = new Setting(this.listContainer)
            // Aggiunge un campo di testo per filtrare le entità esistenti.
            // Adds a text field to filter existing entities.
            .addText(text => {
                // Imposta il segnaposto con l'icona della lente e il testo tradotto.
                // Sets the placeholder with the magnifying glass icon and translated text.
                text.setPlaceholder("🔍 " + t.SEARCH_PLACEHOLDER)
                    // Gestisce il cambiamento del testo inserito per filtrare la lista.
                    // Handles the change of the entered text to filter the list.
                    .onChange(value => {
                        // Converte il testo in minuscolo e aggiorna solo l'area scorrevole.
                        // Converts the text to lowercase and updates only the scrollable area.
                        this.renderScrollArea(value.toLowerCase());
                    });
                // Estende il campo di ricerca per occupare tutta la larghezza disponibile.
                // Extends the search field to occupy all available width.
                text.inputEl.style.width = '100%';
            });
        // Aggiunge una linea orizzontale di separazione prima della lista.
        // Adds a horizontal separator line before the list.
        this.listContainer.createEl('hr');
        // --- 3. AREA SCORREVOLE DELLA LISTA ---
        // --- 3. SCROLLABLE LIST AREA ---
        // Crea un elemento div che conterrà la lista dinamica filtrabile.
        // Creates a div element that will contain the dynamic filterable list.
        this.scrollArea = this.listContainer.createEl('div');
        // Applica gli stili per limitare l'altezza e permettere lo scorrimento.
        // Applies styles to limit height and allow scrolling.
        Object.assign(this.scrollArea.style, {
            // Imposta l'altezza massima dell'area della lista.
            // Sets the maximum height of the list area.
            maxHeight: '400px',
            // Abilita lo scorrimento verticale automatico.
            // Enables automatic vertical scrolling.
            overflowY: 'auto',
            // Aggiunge un rientro a destra per non coprire i pulsanti con la scrollbar.
            // Adds a right indent so as not to cover buttons with the scrollbar.
            paddingRight: '10px'
        });
        // Esegue il caricamento iniziale della lista senza alcun filtro.
        // Performs the initial loading of the list without any filter.
        this.renderScrollArea("");
        // --- 3. SEZIONE PULSANTI FINALI (FOOTER) ---
        // --- 3. FINAL BUTTONS SECTION (FOOTER) ---
        // Crea un contenitore div per i pulsanti di azione finali.
        // Creates a div container for the final action buttons.
        const footerButtons = this.listContainer.createEl('div');
        // Applica stili flessibili per allineare i pulsanti a destra con spaziatura.
        // Applies flex styles to align buttons to the right with spacing.
        Object.assign(footerButtons.style, {
            // Utilizza il layout flexbox.
            // Uses flexbox layout.
            display: 'flex',
            // Allinea il contenuto verso la fine (destra).
            // Aligns content towards the end (right).
            justifyContent: 'flex-end',
            // Imposta uno spazio di 10 pixel tra i pulsanti.
            // Sets a 10-pixel gap between buttons.
            gap: '10px',
            // Aggiunge un margine superiore per distanziarlo dalla lista.
            // Adds a top margin to space it from the list.
            marginTop: '20px'
        });
        // Aggiunge il pulsante per annullare le modifiche correnti.
        // Adds the button to cancel current changes.
        new Setting(footerButtons)
            .addButton(btn => btn
                // Imposta il testo del pulsante "Annulla".
                // Sets the "Cancel" button text.
                .setButtonText(t.CANCEL_BTN)
                // Chiude la modale senza eseguire alcuna azione di salvataggio.
                // Closes the modal without performing any save action.
                .onClick(() => this.close()))
            // Aggiunge il pulsante per confermare e salvare le modifiche.
            // Adds the button to confirm and save changes.
            .addButton(btn => btn
                // Imposta il testo del pulsante "Salva".
                // Sets the "Save" button text.
                .setButtonText(t.SAVE_BTN)
                // Applica lo stile CTA per evidenziare l'azione di salvataggio.
                // Applies CTA style to highlight the save action.
                .setCta()
                // Esegue la callback di salvataggio e chiude la modale.
                // Executes the save callback and closes the modal.
                .onClick(() => {
                    // Passa l'array aggiornato alla funzione di richiamo definita nel main.js.
                    // Passes the updated array to the callback function defined in main.js.
                    this.onSaveCallback(this.entitiesList);
                    // Chiude definitivamente la finestra modale.
                    // Permanently closes the modal window.
                    this.close();
                }));
    } // <--- Fine definitiva del metodo renderEntitiesList

    /**
     * Metodo dedicato al rendering filtrato della lista delle entità.
     * Method dedicated to the filtered rendering of the entities list.
     * @param {string} query - Il testo inserito nel campo di ricerca.
     */
    renderScrollArea(query) {
        // Svuota l'area scorrevole prima di ogni nuovo filtraggio.
        // Empties the scrollable area before each new filtering.
        this.scrollArea.empty();
        // Filtra l'array originale verificando se la query è inclusa nel testo.
        // Filters the original array by checking if the query is included in the text.
        const filteredList = this.entitiesList.filter(item =>
            item.toLowerCase().includes(query)
        );
        // Verifica se la ricerca non ha prodotto alcun risultato.
        // Checks if the search produced no results.
        if (filteredList.length === 0) {
            // Crea un paragrafo per comunicare l'assenza di risultati.
            // Creates a paragraph to communicate the absence of results.
            const noResults = this.scrollArea.createEl('p', {
                text: t.NO_ENTITIES_FOUND
            });
            // Imposta il colore del testo in rosso (colore di errore di Obsidian).
            // Sets the text color to red (Obsidian error color).
            noResults.style.color = 'var(--text-error)';
            // Interrompe l'esecuzione del metodo.
            // Stops the execution of the method.
            return;
        }
        // Ciclo attraverso gli elementi filtrati per creare le righe della lista.
        // Loops through the filtered items to create the list rows.
        filteredList.forEach((entity) => {
            // Recupera l'indice originale nell'array non filtrato per gestire correttamente le azioni.
            // Retrieves the original index in the unfiltered array to handle actions correctly.
            const originalIndex = this.entitiesList.indexOf(entity);
            // Crea una riga di impostazione per ogni entità trovata.
            // Creates a setting row for each entity found.
            new Setting(this.scrollArea)
                // Imposta il nome della riga con il testo dell'entità.
                // Sets the row name with the entity text.
                .setName(entity)
                // Aggiunge il pulsante per la modifica.
                // Adds the edit button.
                .addButton(btn => btn
                    .setButtonText(t.EDIT_BTN)
                    .onClick(() => this.editEntity(originalIndex)))
                // Aggiunge il pulsante per l'eliminazione.
                // Adds the delete button.
                .addButton(btn => btn
                    .setButtonText(t.DELETE_BTN)
                    .setWarning()
                    .onClick(() => {
                        // Rimuove l'elemento dall'array principale usando l'indice corretto.
                        // Removes the item from the main array using the correct index.
                        this.entitiesList.splice(originalIndex, 1);
                        // Riesegue il rendering totale per aggiornare i conteggi e la vista.
                        // Re-performs total rendering to update counts and view.
                        this.renderEntitiesList();
                    }));
        });
    }
    // Metodo per aprire una micro-modale di modifica per una specifica entità.
    // Method to open a micro-modal to edit a specific entity.
    editEntity(index) {
        // Crea e apre la modale di modifica passandogli il valore attuale e la funzione di salvataggio.
        // Creates and opens the edit modal passing the current value and the save function.
        new EditEntityModal(this.app, this.entitiesList[index], (newValue) => {
            // Aggiorna l'entità nell'array locale.
            // Updates the entity in the local array.
            this.entitiesList[index] = newValue;
            // Ricarica la lista per mostrare la modifica appena effettuata.
            // Refreshes the list to show the modification just made.
            this.renderEntitiesList();
        }).open();
    }
}
/**
 * Micro-modale per la modifica rapida di una singola entità.
 * Micro-modal for quick editing of a single entity.
 */
class EditEntityModal extends Modal {
    /**
     * Costruttore della micro-modale di modifica.
     * Constructor for the edit micro-modal.
     * @param {App} app - Istanza di Obsidian.
     * @param {string} currentVal - Valore attuale da modificare.
     * @param {function} onSave - Callback per restituire il nuovo valore.
     */
    constructor(app, currentVal, onSave) {
        // Chiama il costruttore della classe base Modal.
        // Calls the base Modal class constructor.
        super(app);
        this.currentVal = currentVal;
        this.onSave = onSave;
    }
    // Metodo chiamato all'apertura della modale.
    // Method called when the modal opens.
    onOpen() {
        const { contentEl } = this;
        // Imposta il titolo della micro-modale.
        // Sets the micro-modal title.
        contentEl.createEl('h2', { text: t.EDIT_ENTITY_TITLE });
        // Crea il campo di testo pre-popolato.
        // Creates the pre-populated text field.
        new Setting(contentEl)
            .addText(text => text
                .setValue(this.currentVal)
                .onChange(value => this.currentVal = value));
        // Aggiunge il pulsante di conferma.
        // Adds the confirmation button.
        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText(t.SAVE_BTN)
                .setCta()
                .onClick(() => {
                    if (this.currentVal.trim()) {
                        // Invia il valore modificato alla modale principale.
                        // Sends the modified value to the main modal.
                        this.onSave(this.currentVal.trim());
                        this.close();
                    }
                }));
    }
}
