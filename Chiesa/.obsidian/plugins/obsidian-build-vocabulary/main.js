/*
QUESTO È IL NUOVO FILE MAIN.JS MIGLIORATO
Ultimo aggiornamento: 27-12-2025
Funzionalità:
- Legge tutti i file markdown specificati una sola volta per la massima efficienza.
- Estrae le parole e la riga circostante (il contesto).
- Filtra le parole comuni (stop-word) in base alle impostazioni.
- Raggruppa le parole per lettera iniziale in file di vocabolario separati.
- Per ogni parola, elenca tutte le occorrenze (concordanze).
- Ogni occorrenza include:
    - Il conteggio totale di quella parola in tutti i documenti.
    - Un link cliccabile che usa obsidian://search per saltare alla riga esatta nel file originale.
    - La parola stessa è in grassetto nel testo del link per una chiara identificazione.
    - Un link secondario al file sorgente.
- Tutta la vecchia logica per tracciare i file "già scansionati" è stata rimossa per un processo di costruzione più semplice e su richiesta.
- Aggiunge un'impostazione "Lunghezza minima della parola" nelle opzioni del plugin.

THIS IS THE NEW AND IMPROVED MAIN.JS FILE
Last updated: 2025-12-27
Features:
- Reads all specified markdown files only once for efficiency.
- Extracts words and their surrounding line (context).
- Filters out common stop words based on settings.
- Groups words by their starting letter into separate vocabulary files.
- For each word, it lists all occurrences (concordances).
- Each occurrence includes:
    - The total count of that word across all documents.
    - A clickable link that uses obsidian://search to jump to the exact line in the original file.
    - The word itself is bolded in the link text for clarity.
    - A secondary link to the source file.
- All old logic for tracking "already scanned" files has been removed for a simpler, on-demand build process.
- Adds a "Minimum word length" setting in the plugin options.
*/

const { Plugin, PluginSettingTab, Setting, App, Notice, Modal, TFolder, MarkdownRenderer } = require('obsidian');

// === COSTANTI ===
// === CONSTANTS ===

// Liste di stop-word per il filtraggio
// Stop-word lists for filtering
const ARTICOLI_DETERMINATIVI = ['il', 'lo', 'la', 'i', 'gli', 'le', "l'"];
const ARTICOLI_INDETERMINATIVI = ['un', 'uno', 'una', "un'"];
const PREPOSIZIONI_SEMPLICI = ['di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra'];
const PREPOSIZIONI_ARTICOLATE = [
    'del', 'dello', 'della', "dell'", 'dei', 'degli', 'delle',
    'al', 'allo', 'alla', "all'", 'ai', 'agli', 'alle',
    'dal', 'dallo', 'dalla', "dall'", 'dai', 'dagli', 'dalle',
    'nel', 'nello', 'nella', "nell'", 'nei', 'negli', 'nelle',
    'sul', 'sullo', 'sulla', "sull'", 'sui', 'sugli', 'sulle'
];

// Costanti di configurazione
// Configuration constants

// I file che iniziano con questo prefisso verranno ignorati
// Files starting with this will be ignored
const EXCLUDED_PREFIX = "_";
// Cartella di output per i file del vocabolario
// Output directory for vocabulary files
const OUTPUT_FOLDER = "Vocaboli";

// Impostazioni predefinite del plugin
// Default settings for the plugin
const DEFAULT_SETTINGS = {
    startFolders: [],
    addRibbonIcon: false,
    customStringsToExclude: '<br>,§',
    // Lunghezza minima che una parola deve avere per essere inclusa
    // Minimum length for a word to be included
    minWordLength: 2,
    includeAccented: true,
    includeArticoliDeterminativi: false,
    includeArticoliIndeterminativi: false,
    includePreposizioniSemplici: false,
    includePreposizioniArticolate: false,
};

// === FUNZIONI DI SUPPORTO ===
// === SUPPORT FUNCTIONS ===

/**
 * Si assicura che una cartella esista al percorso dato, creandola se necessario.
 * @param {string} folderPath - Il percorso della cartella da controllare/creare.
 * @param {App} app - L'istanza dell'applicazione Obsidian.
 * @returns {Promise<boolean>} - True se la cartella esiste o è stata creata, false in caso di errore.
 */
/**
 * Ensures a folder exists at the given path, creating it if necessary.
 * @param {string} folderPath - The path of the folder to check/create.
 * @param {App} app - The Obsidian App instance.
 * @returns {Promise<boolean>} - True if the folder exists or was created, false on error.
 */
async function ensureFolderExists(folderPath, app) {
    const adapter = app.vault.adapter;
    try {
        const folderExists = await adapter.exists(folderPath);
        if (!folderExists) {
            await adapter.mkdir(folderPath);
            new Notice(`Created folder: "${folderPath}"`);
        }
        return true;
    }
    catch (error) {
        console.error(`Error ensuring folder "${folderPath}" exists:`, error);
        new Notice(`Failed to create folder "${folderPath}". Check console for details.`);
        return false;
    }
}
/**
 * Scrive del contenuto in un file, creandolo se non esiste o sovrascrivendolo se esiste già.
 * @param {App} app - L'istanza dell'applicazione Obsidian.
 * @param {string} filePath - Il percorso del file su cui scrivere.
 * @param {string} content - Il contenuto da scrivere.
 * @returns {Promise<boolean>} - True in caso di successo, false in caso di fallimento.
 */
/**
 * Writes content to a file, creating it if it doesn't exist or overwriting it if it does.
 * @param {App} app - The Obsidian App instance.
 * @param {string} filePath - The path of the file to write to.
 * @param {string} content - The content to write.
 * @returns {Promise<boolean>} - True on success, false on failure.
 */
async function writeDataToFile(app, filePath, content) {
    try {
        const file = app.vault.getAbstractFileByPath(filePath);
        if (file) {
            await app.vault.modify(file, content);
        } else {
            await app.vault.create(filePath, content);
        }
        return true;
    }
    catch (error) {
        console.error(`Error writing to file "${filePath}":`, error);
        new Notice(`Error writing to "${filePath}".`);
        return false;
    }
}

// === CLASSE PRINCIPALE DEL PLUGIN ===
// === MAIN PLUGIN CLASS ===

module.exports = class BuildVocabularyPlugin extends Plugin {
    async onload() {
        console.log("Loading Build Vocabulary Plugin");
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        // Aggiunge il comando principale alla palette dei comandi
        // Add the main command to the command palette
        this.addCommand({
            id: 'estrai-vocabolario-intratext',
            name: 'Costruisci vocabolario (stile IntraText)',
            callback: () => this.buildVocabulary()
        });
        // Aggiunge la scheda delle impostazioni
        // Add the settings tab
        this.addSettingTab(new BuildVocabularySettingTab(this.app, this));
        // Aggiunge l'icona alla barra laterale solo se l'opzione è attiva
        // Add the ribbon icon if enabled
        if (this.settings.addRibbonIcon) {
            // Icona custom 'BV' come SVG inline
            const bvIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="var(--icon-color-interactive, #5c5c5c)"/>
            <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-size="13" font-family="Arial, sans-serif" fill="white" font-weight="bold">BV</text>
        </svg>`;
            // 1. Chiamiamo addRibbonIcon con un'icona temporanea.
            //    La funzione ci restituisce l'elemento DOM che è stato aggiunto alla barra.
            const ribbonEl = this.addRibbonIcon('book-open', 'Costruisci vocabolario', () => {
                this.buildVocabulary();
            });
            // 2. Sostituiamo l'HTML interno di quell'elemento con il nostro SVG personalizzato.
            ribbonEl.innerHTML = bvIcon;
        }
        new Notice('Plugin Build Vocabulary attivato!');
    }
    onunload() {
        console.log("Unloading Build Vocabulary Plugin");
        new Notice('Plugin Build Vocabulary disattivato.');
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }

    /**
     * La funzione principale del plugin. Legge i file, estrae parole e contesti,
     * e scrive i file strutturati del vocabolario.
     */
    /**
     * The core function of the plugin. Reads files, extracts words and contexts,
     * and writes the structured vocabulary files.
     */
    async buildVocabulary() {
        const startTime = Date.now();
        new Notice('Inizio costruzione vocabolario...', 5000);
        // 1. IMPOSTAZIONE
        // 1. SETUP
        if (!(await ensureFolderExists(OUTPUT_FOLDER, this.app))) {
            // Interrompe l'esecuzione se non è possibile creare la cartella di output
            // Stop if we can't create the output folder
            return;
        }
        // Struttura dati principale: { 'parola' => [ { file, contesto }, ... ] }
        // Main data structure: { 'word' => [ { file, context }, ... ] }
        const vocabulary = new Map();
        const vaultName = this.app.vault.getName();
        const startFolders = this.settings.startFolders && this.settings.startFolders.length > 0
            ? this.settings.startFolders
            : [this.app.vault.getRoot().path];
        // 2. RACCOLTA ED ELABORAZIONE FILE (Passaggio Singolo)
        // 2. FILE GATHERING & PROCESSING (Single Pass)
        const allFiles = this.app.vault.getMarkdownFiles();
        const filesToProcess = allFiles.filter(file => {
            const isExcluded = file.name.startsWith(EXCLUDED_PREFIX) || file.path.startsWith(OUTPUT_FOLDER);
            const isInStartFolder = startFolders.some(folder => file.path.startsWith(folder));
            return !isExcluded && isInStartFolder;
        });
        new Notice(`Trovati ${filesToProcess.length} file da analizzare...`, 3000);
        for (const file of filesToProcess) {
            const content = await this.app.vault.cachedRead(file);
            const lines = content.split('\n');
            for (const line of lines) {
                if (line.trim() === '') continue;
                // Regex per trovare le parole, inclusi i caratteri accentati.
                // Regex to find words, including accented characters.
                const wordsInLine = line.toLowerCase().match(/\b[\p{L}']+\b/gu) || [];
                for (const word of wordsInLine) {
                    const lw = word.toLowerCase();
                    // Logica di filtraggio
                    // Filtering logic
                    if (lw.length < this.settings.minWordLength) continue;
                    if (!/^\p{L}/u.test(lw)) continue; // Must contain at least one letter
                    if (this.settings.includeArticoliDeterminativi === false && ARTICOLI_DETERMINATIVI.includes(lw)) continue;
                    if (this.settings.includeArticoliIndeterminativi === false && ARTICOLI_INDETERMINATIVI.includes(lw)) continue;
                    if (this.settings.includePreposizioniSemplici === false && PREPOSIZIONI_SEMPLICI.includes(lw)) continue;
                    if (this.settings.includePreposizioniArticolate === false && PREPOSIZIONI_ARTICOLATE.includes(lw)) continue;
                    // Aggiunge alla mappa del vocabolario
                    // Add to vocabulary map
                    if (!vocabulary.has(lw)) {
                        vocabulary.set(lw, []);
                    }
                    vocabulary.get(lw).push({
                        file: file.path,
                        context: line.trim()
                    });
                }
            }
        }
        // 3. SCRITTURA DEI FILE DI OUTPUT
        // 3. WRITING OUTPUT FILES
        new Notice('Scrittura dei file di vocabolario in corso...', 5000);
        // Raggruppa le parole per lettera iniziale
        // Group words by starting letter
        const letterGroups = new Map();
        const sortedWords = Array.from(vocabulary.keys()).sort((a, b) => a.localeCompare(b, 'it'));
        for (const word of sortedWords) {
            const firstLetter = word.charAt(0).toUpperCase();
            if (!letterGroups.has(firstLetter)) {
                letterGroups.set(firstLetter, []);
            }
            letterGroups.get(firstLetter).push(word);
        }
        const sortedLetters = Array.from(letterGroups.keys()).sort();
        for (const letter of sortedLetters) {
            const wordsForLetter = letterGroups.get(letter);
            let markdownContent = `# ${letter}\n\n---\n`;
            for (const word of wordsForLetter) {
                const occurrences = vocabulary.get(word);
                markdownContent += `\n## ${word} (Trovate ${occurrences.length} occorrenze)\n\n`;
                for (const occ of occurrences) {
                    // Crea il testo in grassetto per la visualizzazione del link
                    // Create bolded text for the link display
                    const boldedContext = occ.context.replace(new RegExp(`\\b(${word})\\b`, 'gi'), '**$1**');
                    // Crea l'URI obsidian://search
                    // Create the obsidian://search URI
                    const searchQuery = `"${occ.context}"`;
                    const searchURI = `obsidian://search?vault=${encodeURIComponent(vaultName)}&query=${encodeURIComponent(searchQuery)}`;
                    markdownContent += `- [${boldedContext}](${searchURI})\n`;
                    markdownContent += `  - *Nel file: [[${occ.file}]]*\n`;
                }
                markdownContent += `\n---\n`;
            }
            await writeDataToFile(this.app, `${OUTPUT_FOLDER}/${letter}.md`, markdownContent);
        }
        const duration = (Date.now() - startTime) / 1000;
        new Notice(`Costruzione vocabolario completata in ${duration.toFixed(2)} secondi!`, 10000);
    }
};

// === CLASSE PER LA SCHEDA IMPOSTAZIONI ===
// === SETTINGS TAB CLASS ===

class BuildVocabularySettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h1', { text: 'Impostazioni Build Vocabulary' });
        // Impostazione per l'Icona nella Barra Laterale
        // Setting for Ribbon Icon
        // 1. Creiamo UNA SOLA impostazione e le assegnamo SIA il nome SIA il toggle.
        //    Salviamo il tutto in una costante per poterla usare dopo.
        const ribbonSetting = new Setting(containerEl)
            .setName('Aggiungi l\’icona alla barra laterale')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.addRibbonIcon)
                .onChange(async (value) => {
                    this.plugin.settings.addRibbonIcon = value;
                    await this.plugin.saveSettings();
                }));
        // 2. Ora che l'impostazione (ribbonSetting) è completa di nome e toggle,
        //    usiamo MarkdownRenderer per popolarne l'elemento descrizione (descEl).
        //    In questo modo la descrizione complessa appare sotto il nome,
        //    ma all'interno dello stesso blocco dell'impostazione.
        MarkdownRenderer.renderMarkdown(
            'Se attivo, mostra l\’icona del plugin nella barra laterale.' +
            '<br>' +
            'È necessario disattivare e riattivare il plugin per rendere effettiva la modifica.' +
            '<br>' +
            'Se l\’icona non viene utilizzata, per eseguire la costruzione del vocabolario eseguire' +
            '<br>' +
            'il Plugin dal riquadro comandi (CTRL + P o CMD + P) attivandolo con \“Estrai vocabolario\”',
            ribbonSetting.descEl,
            '',
            this.plugin
        );
        // Impostazione per le Cartelle di Partenza
        // Setting for Start Folders
        new Setting(containerEl)
            .setName('Cartelle di partenza')
            .setDesc('Seleziona le cartelle da includere nella scansione. Se vuoto, scansiona l\’intero vault.')
            .addButton(btn => btn
                .setButtonText('Scegli cartelle')
                .onClick(() => {
                    new MultiFolderSelectModal(this.app, this.plugin, () => this.display()).open();
                }));
        // Visualizzazione delle cartelle attualmente selezionate
        // Display for currently selected folders
        const foldersDiv = containerEl.createEl('div', { cls: 'setting-item-description' });
        foldersDiv.style.marginLeft = 'var(--setting-item-indent)';
        foldersDiv.style.marginBottom = '1em';
        const currentFolders = this.plugin.settings.startFolders;
        if (currentFolders && currentFolders.length > 0) {
            foldersDiv.innerHTML = '<strong>Cartelle attuali:</strong><br>' + currentFolders.join('<br>');
        } else {
            foldersDiv.innerHTML = '<strong>Cartelle attuali:</strong><br>Tutto il vault';
        }
        containerEl.createEl('hr');
        containerEl.createEl('h3', { text: 'Filtri del Vocabolario' });
        // Impostazione per la Lunghezza Minima della Parola
        // Setting for Minimum Word Length
        new Setting(containerEl)
            .setName('Lunghezza minima della parola')
            .setDesc('Le parole più corte di questo valore verranno ignorate.')
            .addText(text => text
                .setPlaceholder(String(DEFAULT_SETTINGS.minWordLength))
                .setValue(String(this.plugin.settings.minWordLength))
                .onChange(async (value) => {
                    const numValue = parseInt(value, 10);
                    if (!isNaN(numValue) && numValue > 0) {
                        this.plugin.settings.minWordLength = numValue;
                        await this.plugin.saveSettings();
                    }
                }));
        // Impostazioni per le stop-word (parole da ignorare)
        // Settings for stop words
        new Setting(containerEl)
            .setName('Includi articoli determinativi')
            .setDesc('Se disattivato, esclude parole come "il", "lo", "la", ecc.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.includeArticoliDeterminativi)
                .onChange(async (value) => {
                    this.plugin.settings.includeArticoliDeterminativi = value;
                    await this.plugin.saveSettings();
                }));
        new Setting(containerEl)
            .setName('Includi articoli indeterminativi')
            .setDesc('Se disattivato, esclude parole come "un", "uno", "una".')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.includeArticoliIndeterminativi)
                .onChange(async (value) => {
                    this.plugin.settings.includeArticoliIndeterminativi = value;
                    await this.plugin.saveSettings();
                }));
        new Setting(containerEl)
            .setName('Includi preposizioni semplici')
            .setDesc('Se disattivato, esclude parole come "di", "a", "da", ecc.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.includePreposizioniSemplici)
                .onChange(async (value) => {
                    this.plugin.settings.includePreposizioniSemplici = value;
                    await this.plugin.saveSettings();
                }));
        new Setting(containerEl)
            .setName('Includi preposizioni articolate')
            .setDesc('Se disattivato, esclude parole come "del", "nella", "sugli", ecc.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.includePreposizioniArticolate)
                .onChange(async (value) => {
                    this.plugin.settings.includePreposizioniArticolate = value;
                    await this.plugin.saveSettings();
                }));
        // --- IMPOSTAZIONE STRINGHE DA ESCLUDERE ---
        // 1. Creiamo l'impostazione con il nome e l'area di testo,
        //    salvandola in una costante per poterla usare dopo.
        const customStringsSetting = new Setting(containerEl)
            .setName('Stringhe personalizzate da escludere')
            .addTextArea(text => text
                .setPlaceholder('<br>,§,...')
                .setValue(this.plugin.settings.customStringsToExclude)
                .onChange(async (value) => {
                    this.plugin.settings.customStringsToExclude = value;
                    await this.plugin.saveSettings();
                }));
        // 2. Ora usiamo MarkdownRenderer per inserire la nostra descrizione complessa
        //    all'interno dello stesso blocco dell'impostazione.
        MarkdownRenderer.renderMarkdown(
            'Lista di stringhe (separate da virgola) da rimuovere dal testo prima dell\’analisi.' +
            '<br>' +
            'Utile per pulire tag HTML (es: `\<br\>`) o simboli speciali (es: `§`).',
            customStringsSetting.descEl,
            '',
            this.plugin
        );
    }
}

// === MODALE PER LA SELEZIONE DELLE CARTELLE ===
// === MODAL FOR FOLDER SELECTION ===

class MultiFolderSelectModal extends Modal {
    constructor(app, plugin, oncloseCallback) {
        super(app);
        this.plugin = plugin;
        this.oncloseCallback = oncloseCallback;
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: 'Seleziona cartelle da includere' });
        const createTree = (folder, parentEl) => {
            // Ordina gli elementi figli: prima le cartelle, poi i file, entrambi in ordine alfabetico
            // Sort children: folders first, then files, both alphabetically
            const children = folder.children.sort((a, b) => {
                const aIsFolder = a instanceof TFolder;
                const bIsFolder = b instanceof TFolder;
                if (aIsFolder && !bIsFolder) return -1;
                if (!aIsFolder && bIsFolder) return 1;
                return a.name.localeCompare(b.name);
            });
            for (const child of children) {
                if (child instanceof TFolder) {
                    const setting = new Setting(parentEl)
                        .setName(child.name)
                        .setDesc(child.path)
                        .addToggle(toggle => {
                            toggle.setValue(this.plugin.settings.startFolders.includes(child.path))
                                .onChange(async (value) => {
                                    const path = child.path;
                                    const currentFolders = this.plugin.settings.startFolders;
                                    if (value) {
                                        if (!currentFolders.includes(path)) {
                                            this.plugin.settings.startFolders.push(path);
                                        }
                                    }
                                    else {
                                        this.plugin.settings.startFolders = currentFolders.filter(p => p !== path);
                                    }
                                    await this.plugin.saveSettings();
                                });
                        });
                    setting.settingEl.addClass('folder-selection-setting');
                }
            }
        };
        createTree(this.app.vault.getRoot(), contentEl);
    }
    onClose() {
        this.contentEl.empty();
        if (this.oncloseCallback) {
            this.oncloseCallback();
        }
    }
}