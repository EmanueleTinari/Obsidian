/*
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
- Aggiunge un'impostazione "Lunghezza minima della parola" nelle opzioni del plugin.
*/

const { Plugin, PluginSettingTab, Setting, App, Notice, Modal, TFolder, MarkdownRenderer } = require('obsidian');
// Richiede il modulo 'crypto' di Node.js per calcolare gli hash SHA-512
const crypto = require('crypto');

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

// ========================
// === DEFAULT_SETTINGS ===
// ========================
// Impostazioni predefinite del plugin
// Default settings for the plugin

// Impostazioni predefinite del plugin
const DEFAULT_SETTINGS = {
    // Cartelle da cui iniziare la scansione.
    // Se vuoto, scansiona l'intero vault.
    startFolders: [],
    // Cartelle da ignorare completamente.
    // Ha la priorità su 'startFolders'.
    exclusionFolders: [],
    // La cartella dove verranno creati i file del vocabolario (.md e .json).
    outputFolder: "Vocaboli",
    // Aggiunge l'icona alla barra laterale (richiede ricarica del plugin).
    addRibbonIcon: false,
    // Lunghezza minima di una parola per essere inclusa nel vocabolario.
    // Minimum length for a word to be included
    minWordLength: 2,
    // Flag per includere parole accentate (sempre consigliato).
    includeAccented: true,
    // Flags per includere/escludere le stop-word.
    includeArticoliDeterminativi: false,
    includeArticoliIndeterminativi: false,
    includePreposizioniSemplici: false,
    includePreposizioniArticolate: false,
    // Pattern di esclusione per file/cartelle, separati da virgola. Supporta '*' come jolly.
    exclusionPatterns: "_*",
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
        }
        else {
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

/**
 * Calcola l'hash SHA-512 di una stringa di testo.
 * @param {string} text - Il contenuto di cui calcolare l'hash.
 * @returns {string} - L'hash SHA-512 in formato esadecimale.
 */
function calculateHash(text) {
    return crypto.createHash('sha512').update(text).digest('hex');
}

/**
 * Legge e fa il parsing di un file JSON in modo sicuro.
 * Se il file non esiste o è invalido, restituisce il valore di fallback.
 * @param {App} app - L'istanza dell'applicazione Obsidian.
 * @param {string} filePath - Il percorso del file JSON da leggere.
 * @param {any} fallback - Il valore da restituire in caso di errore.
 * @returns {Promise<any>} - I dati del file JSON o il valore di fallback.
 */
async function readJsonFile(app, filePath, fallback = {}) {
    try {
        const content = await app.vault.adapter.read(filePath);
        return JSON.parse(content);
    }
    catch (error) {
        // Se il file non esiste o c'è un errore di parsing, restituisce il fallback
        return fallback;
    }
}

/**
 * Scrive un oggetto in un file JSON.
 * @param {App} app - L'istanza dell'applicazione Obsidian.
 * @param {string} filePath - Il percorso del file JSON da scrivere.
 * @param {object} data - L'oggetto da serializzare e scrivere.
 * @returns {Promise<boolean>} - True in caso di successo, false in caso di fallimento.
 */
async function writeJsonFile(app, filePath, data) {
    try {
        await app.vault.adapter.write(filePath, JSON.stringify(data, null, 2)); // Il 2 formatta il JSON per essere leggibile
        return true;
    }
    catch (error) {
        console.error(`Error writing to JSON file "${filePath}":`, error);
        new Notice(`Error writing to "${filePath}".`);
        return false;
    }
}

/**
 * Pulisce una cartella da tutti i file con estensione .md.
 * @param {App} app - L'istanza dell'applicazione Obsidian.
 * @param {string} folderPath - Il percorso della cartella da pulire.
 */
async function clearMarkdownFiles(app, folderPath) {
    try {
        const filesInFolder = await app.vault.adapter.list(folderPath);
        for (const filePath of filesInFolder.files) {
            if (filePath.toLowerCase().endsWith('.md')) {
                await app.vault.adapter.remove(filePath);
            }
        }
    }
    catch (error) {
        // Ignora l'errore se la cartella non esiste, ma logga altri errori
        if (!error.message.includes('no such file or directory')) {
            console.error(`Error clearing markdown files from "${folderPath}":`, error);
        }
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
        // --- 1. SETUP INIZIALE E CARICAMENTO DATABASE ---
        if (!(await ensureFolderExists(outputFolder, this.app))) {
            // Interrompe l'esecuzione se non è possibile creare la cartella di output
            // Stop if we can't create the output folder
            return;
        }
        // Struttura dati principale: { 'parola' => [ { file, contesto }, ... ] }
        // Main data structure: { 'word' => [ { file, context }, ... ] }
        const vocabulary = new Map();
        const vaultName = this.app.vault.getName();
        // --- 2. RACCOLTA FILE E FILTRAGGIO AVANZATO ---
        const startFolders = this.settings.startFolders.length > 0 ? this.settings.startFolders : ['/'];
        const exclusionFolders = this.settings.exclusionFolders || [];
        const outputFolder = this.settings.outputFolder;
        // Prepara i pattern di esclusione convertendoli in Regex
        const exclusionRegexps = (this.settings.exclusionPatterns || '')
            .split(',')
            .map(p => p.trim())
            .filter(p => p)
            .map(p => new RegExp('^' + p.replace(/\*/g, '.*') + '$'));
        const allFiles = this.app.vault.getMarkdownFiles();
        const filesToProcess = allFiles.filter(file => {
            // Regola 1: Deve essere nella cartella di output? -> ESCLUDI
            if (file.path.startsWith(outputFolder)) {
                return false;
            }
            // Regola 2: È in una delle cartelle esplicitamente escluse? -> ESCLUDI
            if (exclusionFolders.some(folder => file.path.startsWith(folder))) {
                return false;
            }
            // Regola 3: Corrisponde a un pattern di esclusione? -> ESCLUDI
            // Controlliamo sia il nome del file che ogni segmento del percorso
            const pathParts = file.path.split('/');
            if (pathParts.some(part => exclusionRegexps.some(rx => rx.test(part)))) {
                return false;
            }
            // Regola 4: È in una delle cartelle di inclusione? -> INCLUDI
            // Questa regola si applica solo se `startFolders` non è vuoto.
            const isInStartFolder = startFolders.some(folder => file.path.startsWith(folder));
            return isInStartFolder;
        });
        new Notice(`Trovati ${filesToProcess.length} file. Sincronizzazione in corso...`, 3000);
        for (const file of filesToProcess) {
            const content = await this.app.vault.cachedRead(file);
            const lines = content.split('\n');
            for (const line of lines) {
                if (line.trim() === '') continue;
                // =================================================================
                // --- INIZIO BLOCCO DI PULIZIA ---
                // Obiettivo: Isolare la porzione di testo corretta da cui estrarre le parole.
                // La logica opera con una priorità precisa:
                // 1. Prima controlla se la riga è una DEFINIZIONE di footnote.
                //    Se sì, estrae solo il testo della nota.
                // 2. Altrimenti, tratta la riga come testo normale,
                //    la sanifica dai RIFERIMENTI e poi cerca eventuali TRADUZIONI.
                // =================================================================
                // Questa variabile conterrà il testo "pulito" finale da analizzare.
                let textToProcess = '';
                // --- Fase 1: Gestione delle DEFINIZIONI di Footnote ---
                // Controlliamo se la riga è una DEFINIZIONE di nota (es. `[^1]: Testo...`).
                // Questa è la parte che gestisce l'estrazione delle parole dal "tesoro" delle note.
                if (line.trim().startsWith('[^') && line.includes(']:')) {
                    // La riga è una DEFINIZIONE.
                    // Usiamo .split() con una regex per dividere la riga al marcatore `[^...]:`.
                    // Prendiamo il secondo elemento ([1]), che è tutto il testo DOPO il marcatore.
                    const definitionContent = line.split(/\[\^.*?\]:/)[1];
                    if (definitionContent) {
                        textToProcess = definitionContent.trim();
                        // Ora `textToProcess` contiene solo il puro testo della nota.
                    }
                }
                else {
                    // --- Fase 2: Gestione del Testo Normale (che può contenere RIFERIMENTI o TRADUZIONI) ---
                    // Se la riga non è una definizione di nota, è testo normale.
                    // Passo 2a: Sanificazione dei RIFERIMENTI
                    // Rimuoviamo preventivamente qualsiasi RIFERIMENTO a footnote (es. `[^1]`, `[^abc]`).
                    // Questo ripulisce il contesto principale dal "rumore" dei puntatori.
                    const lineWithoutReferences = line.replaceAll(/\[\^.*?\]/g, ' ');
                    // Passo 2b: Isolamento della TRADUZIONE
                    // Sulla riga già sanificata dai riferimenti, cerchiamo il pattern di una traduzione `[...]`.
                    const translationMatch = lineWithoutReferences.match(/\[(.*?)\]/);
                    if (translationMatch && translationMatch[1]) {
                        // Se troviamo una traduzione, il nostro testo di interesse è SOLO il contenuto tra le parentesi.
                        textToProcess = translationMatch[1].trim();
                    }
                    else {
                        // Se non c'è una traduzione, usiamo l'intera riga (che è già stata pulita dai riferimenti).
                        textToProcess = lineWithoutReferences.trim();
                    }
                }
                // --- Fase 3: Pulizia Finale sul Testo Selezionato ---
                // A questo punto, `textToProcess` contiene la porzione di testo corretta (o è vuota).
                // Applichiamo la pulizia finale per rimuovere elementi come tag HTML, "cfr.", etc.
                // Questa pulizia si applica uniformemente sia al testo normale, sia alle traduzioni, sia alle definizioni delle note.
                if (textToProcess) {
                    // Rimuove qualsiasi tag HTML residuo (es. <span>, <br>)
                    textToProcess = textToProcess.replaceAll(/<[^>]+>/g, ' ');
                    // Rimuove le varianti di "cfr." (case-insensitive, con o senza punto)
                    textToProcess = textToProcess.replaceAll(/\bcfr\.?\b/gi, ' ');
                    // Rimuove parentesi tonde, asterischi, e altri simboli specifici che non sono parole.
                    // Ho aggiunto l'asterisco (*) perché spesso delimita il testo straniero scartato.
                    textToProcess = textToProcess.replaceAll(/[()§*]/g, ' ');
                }
                // Se `textToProcess` non è vuoto, ora possiamo passarlo all'estrattore di parole.
                // if (textToProcess) { const wordsInLine = textToProcess.toLowerCase()... }
                // --- FINE BLOCCO DI PULIZIA ---
                // Regex per trovare le parole, inclusi i caratteri accentati.
                // Regex to find words, including accented characters.
                const wordsInLine = textToProcess.toLowerCase().match(/\b[\p{L}']+\b/gu) || [];
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
            await writeDataToFile(this.app, `${outputFolder}/${letter}.md`, markdownContent);
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
        // --- IMPOSTAZIONI DI BASE ---
        containerEl.createEl('h2', { text: 'Impostazioni di Base' });
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
        // --- FILTRI DI INCLUSIONE / ESCLUSIONE ---
        containerEl.createEl('h2', { text: 'Filtri File e Cartelle' });
        // Impostazione Cartella di Output
        new Setting(containerEl)
            .setName('Cartella di output del vocabolario')
            .setDesc('La cartella dove verranno salvati i file del vocabolario (.md) e i database (.json).')
            .addText(text => {
                text.setValue(this.plugin.settings.outputFolder).setDisabled(true); // Mostra il percorso ma non è modificabile direttamente
                text.inputEl.style.width = '250px';
            })
            .addButton(btn => btn
                .setButtonText('Scegli')
                .onClick(() => {
                    new SingleFolderSelectModal(this.app, this.plugin, (selectedPath) => {
                        this.plugin.settings.outputFolder = selectedPath;
                        this.plugin.saveSettings();
                        this.display(); // Ridisegna la tab per mostrare il nuovo valore
                    }).open();
                }));
        containerEl.createEl('hr');
        // Impostazione per le Cartelle di Partenza
        // Setting for Start Folders
        new Setting(containerEl)
            .setName('Cartelle da includere (Start Folders)')
            .setDesc('Seleziona le cartelle da includere nella scansione. Se lasciato vuoto, verrà scansionato l\’intero vault (rispettando le esclusioni).')
            .addButton(btn => btn
                .setButtonText('Scegli cartelle')
                .onClick(() => {
                    new MultiFolderSelectModal(this.app, this.plugin.settings.startFolders, (selectedFolders) => {
                        this.plugin.settings.startFolders = selectedFolders;
                        this.plugin.saveSettings();
                        this.display();
                    }).open();
                }));
        // Visualizzazione cartelle incluse
        const includedFoldersDiv = containerEl.createEl('div', { cls: 'setting-item-description', text: 'Cartelle incluse: ' + (this.plugin.settings.startFolders.join(', ') || 'Tutto il vault') });
        includedFoldersDiv.style.marginLeft = 'var(--setting-item-indent)';
        // Impostazione Cartelle da Escludere
        new Setting(containerEl)
            .setName('Cartelle da escludere')
            .setDesc('Tutti i file e le sottocartelle all\'interno di queste cartelle verranno ignorati. Questo filtro ha la priorità su "Cartelle da includere".')
            .addButton(btn => btn
                .setButtonText('Scegli cartelle')
                .onClick(() => {
                    new MultiFolderSelectModal(this.app, this.plugin.settings.exclusionFolders, (selectedFolders) => {
                        this.plugin.settings.exclusionFolders = selectedFolders;
                        this.plugin.saveSettings();
                        this.display();
                    }).open();
                }));
        // Visualizzazione cartelle escluse
        const excludedFoldersDiv = containerEl.createEl('div', { cls: 'setting-item-description', text: 'Cartelle escluse: ' + (this.plugin.settings.exclusionFolders.join(', ') || 'Nessuna') });
        excludedFoldersDiv.style.marginLeft = 'var(--setting-item-indent)';
        // Impostazione Pattern di Esclusione
        new Setting(containerEl)
            .setName('Pattern di esclusione file/cartelle')
            .setDesc('Lista di pattern separati da virgola. I file o le cartelle che corrispondono a uno di questi pattern verranno ignorati. Usa * come jolly (es. _*, *.template.md, Diario*).')
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.exclusionPatterns)
                .setValue(this.plugin.settings.exclusionPatterns)
                .onChange(async (value) => {
                    this.plugin.settings.exclusionPatterns = value;
                    await this.plugin.saveSettings();
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
        // --- FILTRI VOCABOLARIO ---
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
    }
}
// === MODALE PER LA SELEZIONE DI UNA SINGOLA CARTELLA ===
// === MODAL FOR SINGLE FOLDER SELECTION ===
class SingleFolderSelectModal extends Modal {
    constructor(app, plugin, onSelectCallback) {
        super(app);
        this.plugin = plugin;
        this.onSelectCallback = onSelectCallback;
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: 'Seleziona una cartella' });
        const createFolderItem = (folder, parentEl) => {
            const container = parentEl.createDiv('folder-item');
            container.createEl('span', { text: folder.name, cls: 'folder-name' });

            const selectButton = container.createEl('button', { text: 'Seleziona' });
            selectButton.addEventListener('click', () => {
                this.onSelectCallback(folder.path);
                this.close();
            });
        };
        const createTree = (folder, parentEl) => {
            const children = folder.children.filter(c => c instanceof TFolder).sort((a, b) => a.name.localeCompare(b.name));
            for (const child of children) {
                const details = parentEl.createEl('details');
                details.createEl('summary', { text: child.name });
                createTree(child, details);
            }
        };
        // Aggiunge la root del vault come prima opzione selezionabile
        const rootContainer = contentEl.createDiv('folder-item');
        rootContainer.createEl('span', { text: '(Radice del Vault)', cls: 'folder-name' });
        const selectRootButton = rootContainer.createEl('button', { text: 'Seleziona' });
        selectRootButton.addEventListener('click', () => {
            this.onSelectCallback('/');
            this.close();
        });
        createTree(this.app.vault.getRoot(), contentEl);
    }
    onClose() {
        this.contentEl.empty();
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