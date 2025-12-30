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
        new Notice('⚙️ Inizio costruzione vocabolario...', 3000);
        // --- 1. SETUP INIZIALE E CARICAMENTO DATABASE ---
        const outputFolder = this.settings.outputFolder || '';
        if (!(await ensureFolderExists(outputFolder, this.app))) {
            new Notice(`❌ ERRORE CRITICO: Impossibile creare o accedere alla cartella "${outputFolder}". Processo interrotto.`, 10000);
            // Interrompe l'esecuzione se non è possibile creare la cartella di output
            // Stop if we can't create the output folder
            return;
        }
        // Definiamo i percorsi dei file di database QUI, usando le impostazioni caricate.
        const SOURCE_CACHE_FILE = `${outputFolder}/_source_cache.json`;
        const VOCABULARY_DB_FILE = `${outputFolder}/_vocabulary_database.json`;
        let fileHashes = await readJsonFile(this.app, SOURCE_CACHE_FILE, {});
        let vocabulary = await readJsonFile(this.app, VOCABULARY_DB_FILE, {});
        let dbNeedsRewrite = false; // Flag per sapere se dobbiamo riscrivere i database alla fine
        const vaultName = this.app.vault.getName();
        // --- 2. FILTRAGGIO FILE ---
        const startFolders = this.settings.startFolders.length > 0 ? this.settings.startFolders : ['/'];
        const exclusionFolders = this.settings.exclusionFolders || [];
        const exclusionRegexps = (this.settings.exclusionPatterns || '')
            .split(',').map(p => p.trim()).filter(p => p).map(p => new RegExp('^' + p.replace(/\*/g, '.*') + '$'));
        const allMarkdownFiles = this.app.vault.getMarkdownFiles();

        const filesToProcess = allMarkdownFiles.filter(file => {
            if (file.path.startsWith(outputFolder + '/')) return false;
            if (exclusionFolders.some(folder => file.path.startsWith(folder + '/'))) return false;
            if (file.path.split('/').some(part => exclusionRegexps.some(rx => rx.test(part)))) return false;
            return startFolders.some(folder => folder === '/' || file.path.startsWith(folder + '/'));
        });
        // --- 3. IDENTIFICAZIONE MODIFICHE ---
        const currentFilePaths = new Set(filesToProcess.map(f => f.path));
        const knownFilePaths = new Set(Object.keys(fileHashes));
        const deletedFilePaths = [...knownFilePaths].filter(p => !currentFilePaths.has(p));
        const newOrModifiedFilePaths = filesToProcess.filter(f => !knownFilePaths.has(f.path) || fileHashes[f.path] !== calculateHash(this.app.vault.cachedReadSync(f))).map(f => f.path);
        // --- 4. GESTIONE FILE CANCELLATI ---
        if (deletedFilePaths.length > 0) {
            dbNeedsRewrite = true;
            new Notice(`🗑️ Rimozione di ${deletedFilePaths.length} file cancellati dal vocabolario...`, 3000);
            for (const word in vocabulary) {
                vocabulary[word] = vocabulary[word].filter(occ => !deletedFilePaths.includes(occ.file));
                if (vocabulary[word].length === 0) delete vocabulary[word];
            }
            for (const path of deletedFilePaths) delete fileHashes[path];
        }
        // --- 5. GESTIONE FILE NUOVI O MODIFICATI ---
        if (newOrModifiedFilePaths.length > 0) {
            dbNeedsRewrite = true;
            new Notice(`🔄 Analisi di ${newOrModifiedFilePaths.length} file nuovi o modificati...`, 3000);
            for (const filePath of newOrModifiedFilePaths) {
                const file = allMarkdownFiles.find(f => f.path === filePath);
                if (!file) continue; // File non trovato (dovrebbe essere gestito da deletedFilePaths ma per sicurezza)
                const content = await this.app.vault.cachedRead(file);
                fileHashes[file.path] = calculateHash(content); // Aggiorna l'hash del file
                // Purga le vecchie occorrenze di questo file dal vocabolario in memoria
                for (const word in vocabulary) {
                    vocabulary[word] = vocabulary[word].filter(occ => occ.file !== file.path);
                    if (vocabulary[word].length === 0) delete vocabulary[word];
                }
                // Ora, analizza il file da capo e aggiungi i nuovi dati.
                const lines = content.split('\n');
                lines.forEach((line, lineIndex) => {
                    if (!line.trim()) return;
                    // --- BLOCCO DI PULIZIA E SELEZIONE CONTESTO (v4.0) ---
                    let textToProcess = '';
                    if (line.trim().startsWith('[^') && line.includes(']:')) {
                        const definitionContent = line.split(/\[\^.*?\]:/)[1];
                        if (definitionContent) textToProcess = definitionContent.trim();
                    }
                    else {
                        const lineWithoutReferences = line.replaceAll(/\[\^.*?\]/g, ' ');
                        const translationMatch = lineWithoutReferences.match(/\[(.*?)\]/);
                        textToProcess = translationMatch ? translationMatch[1].trim() : lineWithoutReferences.trim();
                    }
                    if (!textToProcess) return;
                    textToProcess = textToProcess.replaceAll(/<[^>]+>/g, ' ').replaceAll(/\bcfr\.?\b/gi, ' ').replaceAll(/[()§*]/g, ' ');
                    const wordsInLine = textToProcess.toLowerCase().match(/\b[\p{L}']+\b/gu) || [];
                    for (const word of wordsInLine) {
                        if (word.length < this.settings.minWordLength || !/^[\p{L}]/u.test(word)) continue;
                        if (!this.settings.includeArticoliDeterminativi && ARTICOLI_DETERMINATIVI.includes(word)) continue;
                        if (!this.settings.includeArticoliIndeterminativi && ARTICOLI_INDETERMINATIVI.includes(word)) continue;
                        if (!this.settings.includePreposizioniSemplici && PREPOSIZIONI_SEMPLICI.includes(word)) continue;
                        if (!this.settings.includePreposizioniArticolate && PREPOSIZIONI_ARTICOLATE.includes(word)) continue;
                        if (!vocabulary[word]) vocabulary[word] = [];
                        vocabulary[word].push({
                            file: file.path,
                            lineNumber: lineIndex + 1, // Salva il numero di riga (1-based)
                            context: line.trim() // Contesto originale della riga
                        });
                    }
                });
            }
        }
        // --- 6. SCRITTURA DEI FILE FINALI ---
        if (!dbNeedsRewrite) {
            new Notice('👍 Il vocabolario è già aggiornato.', 3000);
        }
        else {
            new Notice('✍️ Salvataggio database e scrittura file in corso...', 5000);
            await writeJsonFile(this.app, hashesFilePath, fileHashes);
            await writeJsonFile(this.app, vocabularyFilePath, vocabulary);
            await clearMarkdownFiles(this.app, outputFolder);
            const letterGroups = {};
            const sortedWords = Object.keys(vocabulary).sort((a, b) => a.localeCompare(b, 'it'));
            for (const word of sortedWords) {
                const firstLetter = word.charAt(0).toUpperCase();
                if (!letterGroups[firstLetter]) letterGroups[firstLetter] = [];
                letterGroups[firstLetter].push(word);
            }
            for (const letter of Object.keys(letterGroups).sort()) {
                const wordsForLetter = letterGroups[letter];
                let markdownContent = `# ${letter}\n\n`;
                for (const word of wordsForLetter) {
                    const occurrences = vocabulary[word];
                    markdownContent += `### ${word}\n`;
                    markdownContent += `###### Occorrenze trovate: ${occurrences.length}\n`;
                    occurrences.forEach((occ, index) => {
                        // Estrazione contesto (4 parole prima, parola, 4 parole dopo)
                        const contextWords = occ.context.split(/\s+/).filter(w => w); // Filtra spazi vuoti
                        const wordIndexInContext = contextWords.map(w => w.toLowerCase()).indexOf(word);
                        let fragmentWords = [];
                        if (wordIndexInContext !== -1) {
                            const start = Math.max(0, wordIndexInContext - 4);
                            const end = Math.min(contextWords.length, wordIndexInContext + 5); // 4 dopo + la parola stessa
                            fragmentWords = contextWords.slice(start, end);
                            // Rimetto la parola al centro in grassetto
                            const finalFragment = fragmentWords.map(w => w.toLowerCase() === word ? `**${w}**` : w).join(' ');
                            // Costruisco il link di ricerca mirato al file e al frammento
                            const queryFragment = fragmentWords.join(' ').replace(/"/g, '\\"'); // Escape for query string
                            const searchURI = `obsidian://search?vault=${encodeURIComponent(vaultName)}&query=path:"${encodeURIComponent(occ.file)}"%20"${encodeURIComponent(queryFragment)}"`;
                            markdownContent += `Occorrenza ${index + 1}\t[[${occ.file}#L${occ.lineNumber}|${occ.fileName}]]\t[${finalFragment}](${searchURI})\n`;
                        }
                        else {
                            // Fallback se la parola non viene trovata nel contesto (dovrebbe essere raro)
                            markdownContent += `Occorrenza ${index + 1}\t[[${occ.file}#L${occ.lineNumber}|${occ.fileName}]]\t[Contesto non trovato per **${word}**](${searchURI})\n`;
                        }
                    });
                    markdownContent += '\n---\n';
                }
                await writeDataToFile(this.app, `${outputFolder}/${letter}.md`, markdownContent);
            }
        }
        const duration = (Date.now() - startTime) / 1000;
        new Notice(`✅ Costruzione vocabolario completata in ${duration.toFixed(2)} secondi!`, 10000);
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
                text.setValue(this.plugin.settings.outputFolder || '(Radice del Vault)').setDisabled(true); // Mostra il percorso ma non è modificabile direttamente
                text.inputEl.style.width = '250px';
            })
            .addButton(btn => btn
                .setButtonText('Scegli')
                .onClick(() => {
                    new SingleFolderSelectModal(this.app, (selectedPath) => {
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
                    new MultiFolderSelectModal(this.app, 'Seleziona cartelle da INCLUDERE', this.plugin.settings.startFolders, (selectedFolders) => {
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
                    new MultiFolderSelectModal(this.app, 'Seleziona cartelle da ESCLUDERE', this.plugin.settings.exclusionFolders, (selectedFolders) => {
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
    constructor(app, onSelectCallback) {
        super(app);
        this.onSelectCallback = onSelectCallback;
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: 'Seleziona la cartella di output' });
        const createTree = (folder, parentEl) => {
            const sortedChildren = folder.children
                .filter(child => child instanceof TFolder)
                .sort((a, b) => a.name.localeCompare(b.name));
            for (const child of sortedChildren) {
                const details = parentEl.createEl('details');
                const summary = details.createEl('summary');
                const item = summary.createDiv({ cls: 'folder-item' });
                item.createEl('span', { text: child.name, cls: 'folder-name' });
                const selectButton = item.createEl('button', { text: 'Seleziona' });
                selectButton.onClickEvent(evt => {
                    evt.stopPropagation();
                    this.onSelectCallback(child.path);
                    this.close();
                });
                // Se la cartella ha sottocartelle, continua la ricorsione
                if (child.children.some(c => c instanceof TFolder)) {
                    createTree(child, details);
                }
            }
        };
        // Aggiunge la root del vault come prima opzione selezionabile
        const rootContainer = contentEl.createDiv('folder-item');
        rootContainer.createEl('span', { text: '(Radice del Vault)', cls: 'folder-name' });
        const selectRootButton = rootContainer.createEl('button', { text: 'Seleziona' });
        selectRootButton.onClickEvent(() => {
            this.onSelectCallback(''); // Usa stringa vuota per indicare la radice
            this.close();
        });
        // Avvia la creazione dell'albero dalla radice del vault
        createTree(this.app.vault.getRoot(), contentEl);
    }
    onClose() {
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