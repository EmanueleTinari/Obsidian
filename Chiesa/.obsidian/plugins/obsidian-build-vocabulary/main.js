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
import { Plugin, PluginSettingTab, Setting, App, Notice, Modal, TFolder, MarkdownRenderer } from 'obsidian';
// Importa la funzione di gestione delle traduzioni dal file locale.
// Imports the translation management function from the local file.
import { getTranslations } from './translations';
// Richiede il modulo 'crypto' di Node.js per calcolare gli hash SHA-512
// Requires Node.js 'crypto' module to calculate SHA-512 hashes
import * as crypto from 'crypto';
// Rileva la lingua impostata in Obsidian
// Detect the language set in Obsidian
const obsidianLang = window.localStorage.getItem('language');
// Carica in memoria SOLO il blocco di lingua necessario
// Load ONLY the required language block into memory
const t = getTranslations(obsidianLang);

// === COSTANTI ===
// === CONSTANTS ===

// Liste di stop-word per il filtraggio
// Stop-word lists for filtering
const ARTICOLI_DETERMINATIVI = ['il', 'lo', 'la', 'i', 'gli', 'le', "l'"]; //DEFINITE_ARTICLES
const ARTICOLI_INDETERMINATIVI = ['un', 'uno', 'una', "un'"]; //INDEFINITE_ARTICLES
const PREPOSIZIONI_SEMPLICI = ['di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra']; //SIMPLE_PREPOSITIONS
const PREPOSIZIONI_ARTICOLATE = [
    'del', 'dello', 'della', "dell'", 'dei', 'degli', 'delle',
    'al', 'allo', 'alla', "all'", 'ai', 'agli', 'alle',
    'dal', 'dallo', 'dalla', "dall'", 'dai', 'dagli', 'dalle',
    'nel', 'nello', 'nella', "nell'", 'nei', 'negli', 'nelle',
    'sul', 'sullo', 'sulla', "sull'", 'sui', 'sugli', 'sulle'
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
    try {
        // Verifica se la cartella esiste già al percorso specificato.
        // Checks if the folder already exists at the specified path.
        const folderExists = await adapter.exists(folderPath);
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
    try {
        // Tenta di ottenere un riferimento astratto al file dal percorso.
        // Attempts to get an abstract reference to the file from the path.
        const file = app.vault.getAbstractFileByPath(filePath);
        if (file) {
            // Se il file esiste, lo modifica con il nuovo contenuto (sovrascrittura).
            // If the file exists, modifies it with the new content (overwrites).
            await app.vault.modify(file, content);
        }
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
                filesToUpdate.push(file);
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
            this.plugin
        );

        // --- FILTRI DI INCLUSIONE / ESCLUSIONE ---
        // --- INCLUSION / EXCLUSION FILTERS ---

        // Crea un sottotitolo per la sezione dedicata ai filtri di scansione.
        // Creates a subtitle for the section dedicated to scan filters.
        containerEl.createEl('h2', { text: t.FILES_FOLDERS_FILTERS });
        // Definisce l'impostazione per la scelta della cartella di output del plugin.
        // Defines the setting for choosing the plugin's output folder.
        new Setting(containerEl)
            // Imposta il nome dell'opzione.
            // Sets the option name.
            .setName(t.OUTPUT_FOLDER_NAME)
            // Imposta la descrizione dell'opzione.
            // Sets the option description.
            .setDesc(t.OUTPUT_FOLDER_DESC)
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
        // Aggiunge una linea orizzontale di separazione visiva nell'interfaccia.
        // Adds a horizontal separator line to the interface.
        containerEl.createEl('hr');
        // Definisce l'impostazione per selezionare le cartelle da cui iniziare la scansione.
        // Defines the setting to select the folders where the scan should start.
        new Setting(containerEl)
            // Imposta il nome dell'impostazione.
            // Sets the setting name.
            .setName(t.START_FOLDERS_NAME)
            // Imposta la descrizione dell'impostazione.
            // Sets the setting description.
            .setDesc(t.START_FOLDERS_DESC)
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
        // Crea un elemento div per visualizzare l'elenco testuale delle cartelle attualmente incluse.
        // Creates a div element to display the text list of currently included folders.
        const includedFoldersDiv = containerEl.createEl('div', {
            cls: 'setting-item-description',
            text: t.INCLUDED_FOLDERS_LABEL + (this.plugin.settings.startFolders.join(', ') || t.ALL_VAULT)
        });
        // Applica un rientro a sinistra per allineare visivamente la lista alle descrizioni.
        // Applies a left indent to visually align the list with the descriptions.
        includedFoldersDiv.style.marginLeft = 'var(--setting-item-indent)';
        // Impostazione per selezionare le cartelle da escludere completamente dalla scansione.
        // Setting to select folders to be completely excluded from scanning.
        new Setting(containerEl)
            // Imposta il nome dell'impostazione.
            // Sets the setting name.
            .setName(t.EXCLUSION_FOLDERS_NAME)
            // Imposta la descrizione spiegando la priorità del filtro.
            // Sets the description explaining the filter priority.
            .setDesc(t.EXCLUSION_FOLDERS_DESC)
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
        // Crea un elemento per visualizzare l'elenco delle cartelle attualmente escluse.
        // Creates an element to display the list of currently excluded folders.
        const excludedFoldersDiv = containerEl.createEl('div', {
            cls: 'setting-item-description',
            text: t.EXCLUDED_FOLDERS_LABEL + (this.plugin.settings.exclusionFolders.join(', ') || t.NONE)
        });
        // Applica il margine di rientro standard di Obsidian.
        // Applies the standard Obsidian indent margin.
        excludedFoldersDiv.style.marginLeft = 'var(--setting-item-indent)';
        // Impostazione per definire pattern testuali di esclusione tramite caratteri jolly.
        // Setting to define textual exclusion patterns using wildcards.
        new Setting(containerEl)
            // Imposta il nome dell'impostazione per i pattern.
            // Sets the name for the patterns setting.
            .setName(t.EXCLUSION_PATTERNS_NAME)
            // Imposta la descrizione con esempi d'uso dei jolly.
            // Sets the description with wildcard usage examples.
            .setDesc(t.EXCLUSION_PATTERNS_DESC)
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
        // Aggiunge una linea orizzontale di separazione visiva nell'interfaccia.
        // Adds a horizontal separator line to the interface.
        containerEl.createEl('hr');

        // --- FILTRI VOCABOLARIO ---
        // --- VOCABULARY FILTERS ---

        // Crea un titolo di terzo livello per la sezione dei filtri linguistici del vocabolario.
        // Creates a level 3 heading for the vocabulary linguistic filters section.
        containerEl.createEl('h3', { text: t.VOCABULARY_FILTERS });
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
    }
}

// === MODALE PER LA SELEZIONE DI UNA SINGOLA CARTELLA ===
// === MODAL FOR SINGLE FOLDER SELECTION ===

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

class MultiFolderSelectModal extends Modal {
    // Accetta l'array di cartelle attualmente selezionate (es. startFolders o exclusionFolders)
    // e una callback da eseguire al salvataggio.
    constructor(app, title, selectedFoldersArray, onSaveCallback) {
        super(app);
        this.title = title;
        // Memorizza una COPIA dell'array per poterla modificare senza effetti collaterali
        this.selectedFolders = [...selectedFoldersArray];
        this.onSaveCallback = onSaveCallback;
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: this.title });
        const createTree = (folder, parentEl) => {
            // Ordina gli elementi figli: prima le cartelle, poi i file, entrambi in ordine alfabetico
            // Sort children: folders first, then files, both alphabetically
            const children = folder.children
                .filter(c => c instanceof TFolder)
                .sort((a, b) => a.name.localeCompare(b.name));
            for (const child of children) {
                const setting = new Setting(parentEl)
                    .setName(child.name)
                    .setDesc(child.path)
                    .addToggle(toggle => {
                        // Controlla se il percorso è nell'array generico che abbiamo ricevuto
                        toggle.setValue(this.selectedFolders.includes(child.path))
                            .onChange((value) => {
                                const path = child.path;
                                if (value) {
                                    // Aggiunge il percorso se non è già presente
                                    if (!this.selectedFolders.includes(path)) {
                                        this.selectedFolders.push(path);
                                    }
                                }
                                else {
                                    // Rimuove il percorso
                                    this.selectedFolders = this.selectedFolders.filter(p => p !== path);
                                }
                                // NOTA: Non salviamo le impostazioni qui, lo faremo alla chiusura.
                            });
                    });
                setting.settingEl.addClass('folder-selection-setting');
            }
        }
        createTree(this.app.vault.getRoot(), contentEl);
        const buttonContainer = contentEl.createDiv({ cls: 'modal-button-container' });
        const saveButton = buttonContainer.createEl('button', { text: 'Salva', cls: 'mod-cta' });
        saveButton.onClickEvent(() => {
            this.onSaveCallback(this.selectedFolders);
            this.close();
        });
    }
    onClose() {
        this.contentEl.empty();
    }
}