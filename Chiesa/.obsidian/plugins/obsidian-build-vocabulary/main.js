// Legge e parse la tabella markdown di _already_scanned.md, ignorando il frontmatter
async function readScannedFilesTable(app) {
    const filePath = `${outputFolder}/${alreadyScannedFiles}`;
    const abstractFile = app.vault.getAbstractFileByPath(filePath);
    if (!abstractFile || !abstractFile.extension) return [];
    const content = await app.vault.read(abstractFile);
    const lines = content.split('\n');
    let inTable = false;
    const result = [];
    for (let line of lines) {
        if (line.trim().startsWith('| File ')) { inTable = true; continue; }
        if (!inTable) continue;
        if (line.trim().startsWith('|---')) continue;
        if (!line.trim().startsWith('|')) break;
        // | [nome](path) | data | data |
        const cols = line.split('|').map(s => s.trim());
        if (cols.length < 5) continue;
        // Estrai path dal markdown link
        const match = cols[1].match(/\]\((.*?)\)/);
        const path = match ? match[1].replace(/^\//, '') : '';
        const ctime = cols[2];
        const mtime = cols[3];
        result.push({ path, ctime, mtime });
    }
    return result;
}

// Pulisce il file _already_scanned.md mantenendo solo il frontmatter (se presente)
async function clearScannedFilesTable(app) {
    const filePath = `${outputFolder}/${alreadyScannedFiles}`;
    const abstractFile = app.vault.getAbstractFileByPath(filePath);
    if (!abstractFile || !abstractFile.extension) return;
    const content = await app.vault.read(abstractFile);
    let newContent = '';
    if (content.startsWith('---')) {
        // Mantieni il frontmatter
        const end = content.indexOf('---', 3);
        if (end !== -1) newContent = content.substring(0, end + 3) + '\n';
    }
    await app.vault.modify(abstractFile, newContent);
}

// Esempio di ciclo di confronto tra array e file attuali
// filesInfoArray: array di oggetti { path, ctime, mtime } dei file attuali
// scannedArray: array di oggetti { path, ctime, mtime } letti dal file md
function getFilesToRescan(filesInfoArray, scannedArray) {
    // Crea una mappa per lookup veloce
    const scannedMap = new Map();
    for (const entry of scannedArray) {
        scannedMap.set(entry.path, entry);
    }
    // Restituisci solo i file che hanno ctime o mtime diversi
    return filesInfoArray.filter(f => {
        const old = scannedMap.get(f.path);
        return !old || old.ctime !== f.ctime || old.mtime !== f.mtime;
    });
}

// === INIZIO REQUIRE E COSTANTI ===
const { Plugin, Setting, App, Notice } = require('obsidian');
const fs = require('fs');
const path = require('path');

// List of Italian definite articles
const ARTICOLI_DET = [
    'il', 'lo', 'la', 'i', 'gli', 'le', "l'"
];
// List of Italian indefinite articles
const ARTICOLI_INDET = [
    'un', 'uno', 'una', "un'"
];
// List of Italian simple prepositions
const PREP_SEMPLICI = [
    'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra'
];
// List of Italian articulated prepositions (including apostrophe forms)
const PREP_ARTICOLATE = [
    'del', 'dello', 'della', "dell'", 'dei', 'degli', 'delle',
    'al', 'allo', 'alla', "all'", 'ai', 'agli', 'alle',
    'dal', 'dallo', 'dalla', "dall'", 'dai', 'dagli', 'dalle',
    'nel', 'nello', 'nella', "nell'", 'nei', 'negli', 'nelle',
    'sul', 'sullo', 'sulla', "sull'", 'sui', 'sugli', 'sulle'
];
// Prefisso (case-sensitive) dei file da escludere
// Case-sensitive prefix for files to exclude
const excludedPrefix = "_";
// Plugin default settings
const DEFAULT_SETTINGS = {
    startFolders: [],
    includeAccented: true,
    includeArticoliDet: true,
    includeArticoliIndet: true,
    includePrepSemplici: true,
    includePrepArticolate: true,
};

// Cartella dove verranno creati i file di output
// Folder where the output files will be created
const outputFolder = "Vocaboli";
// File per tracciare i file già scansionati
// File to track already scanned files
const alreadyScannedFiles = "_already_scanned.md";


// === FUNZIONI DI SUPPORTO E GESTIONE FILE ===

// Estrae le parole da un testo secondo i criteri definiti, includendo lettere accentate
// Extracts words from a text according to defined criteria, including accented letters
function getWordsFromText(text, minWordLength = 3) {
    if (!text || typeof text !== 'string') {
        return [];
    }
    const wordsArray = text.toLowerCase().match(/\b[\p{L}']+\b/gu);
    if (!wordsArray) {
        return [];
    }
    return wordsArray.filter(word =>
        word.length >= minWordLength &&
        !/^\d+$/.test(word) &&
        /\p{L}/u.test(word)
    );
}





// Assicura che la cartella esista, altrimenti la crea
async function ensureFolderExists(folderPath, app) {
    const adapter = app.vault.adapter;
    try {
        const folderExists = await adapter.exists(folderPath);
        if (folderExists) {
            const stat = await adapter.stat(folderPath);
            if (stat.type === 'folder') {
                return true;
            } else {
                console.error(`"${folderPath}" exists but is a file, not a folder.`);
                new Notice(`Error: "${folderPath}" is a file. Expected a folder.`);
                return false;
            }
        } else {
            await adapter.mkdir(folderPath);
            console.log(`Successfully created folder "${folderPath}".`);
            return true;
        }
    } catch (error) {
        console.error(`Error ensuring folder "${folderPath}" exists:`, error);
        new Notice(`Failed to ensure folder "${folderPath}". Check console.`);
        return false;
    }
}

// Funzione per ottenere i file già scansionati
async function getAlreadyScannedFiles(app) {
    const filePath = `${outputFolder}/${alreadyScannedFiles}`;
    try {
        const abstractFile = app.vault.getAbstractFileByPath(filePath);
        if (abstractFile && abstractFile.extension) {
            const content = await app.vault.read(abstractFile);
            return new Set(content.split("\n").map(line => line.trim()).filter(line => line !== ""));
        } else if (!abstractFile) {
            return new Set();
        } else {
            return new Set();
        }
    } catch (e) {
        return new Set();
    }
}

// Funzione per scrivere dati su un file
async function writeDataToFile(app, filePath, content) {
    const abstractFile = app.vault.getAbstractFileByPath(filePath);
    if (abstractFile && abstractFile.extension) {
        await app.vault.modify(abstractFile, content);
    } else if (!abstractFile) {
        await app.vault.create(filePath, content);
    } else {
        console.error(`Cannot write to "${filePath}" as it is a folder.`);
        new Notice(`Error: Cannot write to "${filePath}", it's a folder.`);
        return false;
    }
    return true;
}


// Funzione per scrivere l'elenco dei file già scansionati in formato markdown tabellare
// Ogni riga: | [Nome file](percorso) | data creazione | data modifica |
// Date in formato dd-MM-yyyy hh:mm:ss
async function writeAlreadyScannedFiles(app, filesInfoArray) {
    const filePath = `${outputFolder}/${alreadyScannedFiles}`;
    // Ordina per percorso completo (alfabetico, rispetta struttura cartelle)
    filesInfoArray.sort((a, b) => a.path.localeCompare(b.path));


    // Intestazione tabella markdown
    let content = '| File | Data creazione | Data modifica |\n';
    content += '|---|---|---|\n';
    for (const info of filesInfoArray) {
        // Percorso completo dal vault
        const link = `[${info.name}](/${info.path})`;
        // Date formattate
        const created = formatDateTime(info.ctime);
        const modified = formatDateTime(info.mtime);
        content += `| ${link} | ${created} | ${modified} |\n`;
    }
    await writeDataToFile(app, filePath, content);
}

// Funzione di utilità per formattare la data/ora come dd-MM-yyyy hh:mm:ss
function formatDateTime(epochMillis) {
    const d = new Date(epochMillis);
    const pad = n => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ` +
        `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
async function writeWordsToLetterFile(app, letter, wordsSet) {
    const filePath = `${outputFolder}/${letter}.md`;
    const content = Array.from(wordsSet).sort().join("\n");
    await writeDataToFile(app, filePath, content);
}
// === FINE FUNZIONI DI SUPPORTO ===

// Classe principale del plugin / Main plugin class
module.exports = class BuildVocabularyPlugin extends Plugin {
    async onload() {
        new Notice('Plugin Build Vocabulary attivato!');
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        if (!this.settings.startFolders || this.settings.startFolders.length === 0) {
            this.settings.startFolders = [this.app.vault.adapter.basePath];
            await this.saveSettings();
        }
        this.addSettingTab(new BuildVocabularySettingTab(this.app, this));
        this.addCommand({
            id: 'estrai-vocabolario',
            name: 'Estrai vocabolario',
            callback: () => this.extractVocabulary()
        });
        // Icona custom 'BV' come SVG inline
        const bvIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="6" fill="var(--icon-color, #4b4b4b)"/>
                <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-size="13" font-family="Arial, sans-serif" fill="white" font-weight="bold" style="fill:white;">BV</text>
            </svg>`;
        this.addRibbonIcon('book-open', 'Estrai vocabolario', () => {
            this.extractVocabulary();
        }).innerHTML = bvIcon;
    }

    onunload() {
        new Notice('Plugin Build Vocabulary disattivato!');
    }

    async extractVocabulary() {
        let folders = (this.settings.startFolders && this.settings.startFolders.length > 0)
            ? this.settings.startFolders
            : [this.app.vault.adapter.basePath];
        new Notice('Estrazione vocabolario in corso...');
        let testo = "Il cane dall'uomo sull'albero l'acqua dell'acqua un'idea";
        let minLen = this.settings.minWordLength || 3;
        let parole = testo.split(/\s+/)
            .map(w => w.split("'"))
            .flat()
            .map(w => w.trim())
            .filter(w => w.length >= minLen);
        parole = parole.filter(word => {
            const lw = word.toLowerCase();
            if (!this.settings.includeArticoliDet && ARTICOLI_DET.includes(lw)) return false;
            if (!this.settings.includeArticoliIndet && ARTICOLI_INDET.includes(lw)) return false;
            if (!this.settings.includePrepSemplici && PREP_SEMPLICI.includes(lw)) return false;
            if (!this.settings.includePrepArticolate && PREP_ARTICOLATE.includes(lw)) return false;
            return true;
        });
        new Notice('Cartelle iniziali: ' + folders.join(', '));
        new Notice('Parole trovate: ' + parole.join(', '));
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
};

// Scheda impostazioni del plugin / Plugin settings tab
class BuildVocabularySettingTab extends require('obsidian').PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    // Mostra la UI delle impostazioni / Display settings UI
    display() {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Impostazioni Build Vocabulary' });

        // Pulsante Aggiorna per forzare il refresh della UI
        const refreshBtn = containerEl.createEl('button', { text: '🔄 Aggiorna' });
        refreshBtn.style.margin = '8px 0 16px 0';
        refreshBtn.onclick = () => {
            this.display();
        };

        // Cartella iniziale con browser
        // Start folder with browser

        // Calcola il path attuale da mostrare
        // Compute the current path to display
        let currentPath = this.plugin.settings.startFolder && this.plugin.settings.startFolder.trim().length > 0
            ? this.plugin.settings.startFolder
            : this.app.vault.adapter.basePath;

        // Setting per le cartelle iniziali (multi-cartella)
        // Setting for start folders (multi-folder)
        new Setting(containerEl)
            .setName('Cartelle iniziali')
            .setDesc('Scegli una o più cartelle di partenza nel Vault')
            .addButton(btn => btn
                .setButtonText('Aggiungi cartella')
                .onClick(async () => {
                    new MultiFolderSelectModal(this.app, this.plugin).open();
                })
            );

        // Mostra le cartelle attualmente selezionate
        // Show currently selected folders
        const foldersDiv = containerEl.createEl('div');
        foldersDiv.style.margin = '4px 0 12px 0';
        foldersDiv.style.fontSize = '0.95em';
        foldersDiv.style.color = 'var(--text-muted)';
        foldersDiv.innerHTML = '<strong>Cartelle attuali:</strong><br>' +
            (this.plugin.settings.startFolders && this.plugin.settings.startFolders.length > 0
                ? this.plugin.settings.startFolders.map(f => `<span style="margin-right:8px">${f} <a href="#" data-folder="${f}" style="color:var(--text-accent)">[Rimuovi]</a></span>`).join('<br>')
                : 'Nessuna cartella selezionata');

        // Gestione rimozione cartella
        // Handle folder removal
        Array.from(foldersDiv.querySelectorAll('a[data-folder]')).forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const folderToRemove = link.getAttribute('data-folder');
                this.plugin.settings.startFolders = this.plugin.settings.startFolders.filter(f => f !== folderToRemove);
                await this.plugin.saveSettings();
                this.display();
            });
        });
        // Modale per selezionare più cartelle iniziali con tree view e switch Obsidian
        // Modal to select multiple start folders with tree view and Obsidian switches
        class MultiFolderSelectModal extends require('obsidian').Modal {
            constructor(app, plugin) {
                super(app);
                this.plugin = plugin;
            }

            onOpen() {
                const { contentEl } = this;
                contentEl.createEl('h2', { text: 'Seleziona una o più cartelle' });

                // Funzione ricorsiva per creare la treeview con Setting.addToggle

                const createTree = (folder, parentEl, level = 0) => {
                    // Wrapper per indentazione
                    const wrapper = parentEl.createEl('div');
                    wrapper.style.marginLeft = (level * 18) + 'px';

                    // Riga flex: bottone espansione, nome, toggle
                    const row = wrapper.createEl('div');
                    row.style.display = 'flex';
                    row.style.alignItems = 'center';
                    row.style.gap = '8px';

                    // Espandi/collassa figli (solo se ci sono subfolder)
                    let expandBtn = null;
                    let childrenDiv = null;
                    if (folder.children && folder.children.some(f => f instanceof require('obsidian').TFolder)) {
                        let expanded = false;
                        expandBtn = row.createEl('button', { text: '▶' });
                        expandBtn.style.width = '22px';
                        expandBtn.onclick = () => {
                            expanded = !expanded;
                            expandBtn.textContent = expanded ? '▼' : '▶';
                            if (childrenDiv) childrenDiv.style.display = expanded ? '' : 'none';
                        };
                    } else {
                        // Spazio per allineare
                        row.createEl('span').style.width = '22px';
                    }

                    // Nome cartella
                    const nameSpan = row.createEl('span', { text: folder.name });
                    nameSpan.style.flex = '1';

                    // Toggle nativo Obsidian montato su contenitore custom
                    const toggleContainer = row.createEl('div');
                    let toggleValue = this.plugin.settings.startFolders.includes(folder.path);
                    new Setting(toggleContainer)
                        .addToggle(toggle => {
                            toggle.setValue(toggleValue)
                                .onChange(async (value) => {
                                    if (value) {
                                        if (!this.plugin.settings.startFolders.includes(folder.path)) {
                                            this.plugin.settings.startFolders.push(folder.path);
                                        }
                                    } else {
                                        this.plugin.settings.startFolders = this.plugin.settings.startFolders.filter(f => f !== folder.path);
                                    }
                                    await this.plugin.saveSettings();
                                    // NIENTE close/riapri: la modale resta aperta
                                });
                        });

                    // Crea i figli se ci sono
                    if (folder.children && folder.children.some(f => f instanceof require('obsidian').TFolder)) {
                        childrenDiv = wrapper.createEl('div');
                        childrenDiv.style.display = 'none';
                        folder.children.forEach(child => {
                            if (child instanceof require('obsidian').TFolder) {
                                createTree(child, childrenDiv, level + 1);
                            }
                        });
                    }
                };

                // Treeview dalla root
                createTree(this.app.vault.getRoot(), contentEl);
            }

            onClose() {
                this.contentEl.empty();
                // Forza il refresh della maschera settings richiamando display() direttamente
                if (this.plugin && this.plugin.app && this.plugin.app.setting) {
                    const settingApp = this.plugin.app.setting;
                    const tabs = settingApp.tabs;
                    const myTab = tabs && tabs.find(tab => tab.plugin === this.plugin);
                    if (myTab && typeof myTab.display === 'function') {
                        myTab.display();
                    }
                }
            }
        }

        // Switch lettere accentate
        // Toggle for accented letters
        new Setting(containerEl)
            .setName('Includi lettere accentate')
            .setDesc('Considera anche le lettere accentate come separate')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.includeAccented)
                .onChange(async (value) => {
                    this.plugin.settings.includeAccented = value;
                    await this.plugin.saveSettings();
                })
            );

        // Switch articoli determinativi
        // Toggle for definite articles
        new Setting(containerEl)
            .setName('Includi articoli determinativi')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.includeArticoliDet)
                .onChange(async (value) => {
                    this.plugin.settings.includeArticoliDet = value;
                    await this.plugin.saveSettings();
                })
            );

        // Switch articoli indeterminativi
        // Toggle for indefinite articles
        new Setting(containerEl)
            .setName('Includi articoli indeterminativi')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.includeArticoliIndet)
                .onChange(async (value) => {
                    this.plugin.settings.includeArticoliIndet = value;
                    await this.plugin.saveSettings();
                })
            );

        // Switch preposizioni semplici
        // Toggle for simple prepositions
        new Setting(containerEl)
            .setName('Includi preposizioni semplici')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.includePrepSemplici)
                .onChange(async (value) => {
                    this.plugin.settings.includePrepSemplici = value;
                    await this.plugin.saveSettings();
                })
            );

        // Switch preposizioni articolate
        // Toggle for articulated prepositions
        new Setting(containerEl)
            .setName('Includi preposizioni articolate')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.includePrepArticolate)
                .onChange(async (value) => {
                    this.plugin.settings.includePrepArticolate = value;
                    await this.plugin.saveSettings();
                })
            );
    }
}

// --- Main Logic ---

// 1. Ensure the output folder exists

// 2. Load the list of already scanned files

// 3. Prompt the user to rescan or not

// 4. Get all pages that are in a folder starting with the folderPrefix

// 5. Filter out already scanned files (if not rescanning)

// 6. Create a map to store words for each letter

// 7. Process each page

// 8. Write words to separate files

// 9. Update the list of already scanned files
