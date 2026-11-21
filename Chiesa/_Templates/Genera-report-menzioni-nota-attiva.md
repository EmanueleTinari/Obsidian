---
licenza-nota: [Copyright © 2026 Emanuele Tinari under, "[Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)"]
ideatore:
  - "Emanuele Tinari"
sviluppatore:
  - "Emanuele Tinari"
  - "Google Gemini in Google Search AI mode"
nomeFile: "Genera-report-menzioni-nota-attiva.md"
creato: 2026/11/20 21:17:06
modificato: 2026/11/20 21:23:37
---

<%*

/*
===============================================================================
📌 GENERA REPORT MENZIONI NOTA ATTIVA (OBSIDIAN SCRIPT PER TEMPLATER)
===============================================================================

ITA
--------
DESCRIZIONE:
Questo script Templater analizza la nota Markdown attualmente aperta e attiva nel workspace, individua le menzioni collegate e scollegate all'interno delle cartelle configurate e genera un nuovo report nella stessa cartella della nota di origine.

FUNZIONALITÀ PRINCIPALI:
1. Verifica immediata (Fail-Fast): controlla che sia aperta e attiva una nota Markdown (.md) prima di allocare memoria o leggere il vault.
2. Estrazione metadati: recupera il nome del file, gli eventuali alias (aliases/alias) e il campo frontmatter 'titolo-doc' sia della nota attiva sia dei documenti trovati.
3. Filtraggio avanzato: limita la scansione alle cartelle e sottocartelle specificate in INCLUDE_FOLDERS (supportando "/" per la root) ed esclude i file con i prefissi indicati in EXCLUDE_PREFIXES nonché i report già generati (-Menzioni).
4. Menzioni collegate e scollegate: rileva i backlink espliciti tramite la metadataCache e cerca nel corpo del testo (escludendo frontmatter e link già esistenti) le ricorrenze non collegate del nome file e dei suoi alias.
5. Output strutturato e interattivo: genera un report con elenchi numerati, conteggio delle ricorrenze e blocchi query nativi richiudibili (<details>) per ciascun termine o alias trovato.
6. Gestione schede e focus: crea il report accanto alla nota originale, lo apre in una nuova scheda in background mantenendo il focus sul documento di origine e notifica l'utente tramite Notice.

MODALITÀ DI ESECUZIONE CONSIGLIATA:
Eseguire tramite "Templater: Open Insert Template modal" oppure tramite scorciatoia diretta (Template Hotkeys) per evitare la creazione di file "Untitled.md" vuoti.

REQUISITI:
- Obsidian MD
- Community Plugin: Templater (con esecuzione di script JavaScript abilitata)

=================================================================================================================================

ENG
-------
DESCRIPTION:
This Templater script analyzes the currently open and active Markdown note in the workspace, detects linked and unlinked mentions across configured folders, and generates a new report inside the same folder as the source note.

KEY FEATURES:
1. Immediate Check (Fail-Fast): verifies that a Markdown (.md) note is open and active before allocating memory or scanning the vault.
2. Metadata Extraction: retrieves the filename, optional aliases (aliases/alias), and the 'titolo-doc' frontmatter field for both the active note and matched documents.
3. Advanced Filtering: restricts scanning to folders and subfolders defined in INCLUDE_FOLDERS (supporting "/" for the vault root) and excludes files matching EXCLUDE_PREFIXES as well as previously generated reports (-Menzioni).
4. Linked & Unlinked Mentions: detects explicit backlinks via metadataCache and scans the body text (stripping frontmatter and existing links) for unlinked occurrences of the filename and its aliases.
5. Structured & Interactive Output: generates a report featuring ordered lists, occurrence counts, and collapsible native query blocks (<details>) for each matched term or alias.
6. Tab & Focus Management: saves the report alongside the source note, opens it in a new background tab while keeping focus on the original document, and notifies the user via Notice.

RECOMMENDED EXECUTION:
Trigger via "Templater: Open Insert Template modal" or a dedicated Template Hotkey to avoid creating empty "Untitled.md" files.

REQUIREMENTS:
- Obsidian MD
- Community Plugin: Templater (with User JavaScript execution enabled)

=================================================================================================================================
*/

// ============================================================================
// 1. CONTROLLO IMMEDIATO DELLA NOTA APERTA (FAIL-FAST)
// ============================================================================

// [ITA}> Recupera il riferimento al file attualmente attivo nel workspace di Obsidian.
// [ENG]> Retrieves the reference to the currently active file in the Obsidian workspace.
const activeFile = app.workspace.getActiveFile();
// [ITA}> Verifica che esista un file attivo e che sia effettivamente una nota Markdown (.md).
// [ENG]> Checks that an active file exists and that it is indeed a Markdown (.md) note.
if (!activeFile || activeFile.extension !== "md") {
    // [ITA}> Mostra una notifica a schermo informando l'utente che non c'è una nota Markdown aperta.
    // [ENG]> Displays an on-screen notice informing the user that no Markdown note is open.
    new Notice("⚠️ Nessuna nota Markdown (.md) aperta e attiva. Operazione annullata.", 5000);
    // [ITA}> Interrompe immediatamente l'esecuzione dello script prima di qualsiasi operazione in memoria o su disco.
    // [ENG]> Immediately aborts script execution before any memory or disk operation.
    return;
}

// ============================================================================
// 2. COSTANTI E PARAMETRI DI CONFIGURAZIONE
// ============================================================================

// [ITA}> Array delle cartelle da includere nella scansione (include automaticamente le sottocartelle; usa "/" per la root).
// [ENG]> Array of folders to include in the scan (automatically includes subfolders; use "/" for the vault root).
const INCLUDE_FOLDERS = [
    "Documenti pontifici",
    "Documenti vari"
];
// [ITA}> Array dei prefissi dei nomi file da escludere dalla scansione (es. file di servizio che iniziano con "_").
// [ENG]> Array of filename prefixes to exclude from the scan (e.g., service files starting with "_").
const EXCLUDE_PREFIXES = [
    "_"
];
// [ITA}> Suffisso univoco usato per riconoscere ed escludere eventuali report di menzioni già generati in precedenza.
// [ENG]> Unique suffix used to identify and exclude any previously generated mention reports.
const REPORT_SUFFIX = "-Menzioni";
// [ITA}> Salva il riferimento alla leaf (scheda) attualmente attiva per potervi riportare il focus a fine esecuzione.
// [ENG]> Saves the reference to the currently active leaf (tab) to restore focus to it upon completion.
const originLeaf = app.workspace.activeLeaf;
// [ITA}> Recupera il percorso della cartella padre della nota aperta (es. "" se nella root o "Cartella/Sottocartella").
// [ENG]> Retrieves the parent folder path of the open note (e.g., "" if in root or "Folder/Subfolder").
const parentFolderPath = activeFile.parent ? activeFile.parent.path : "/";
// [ITA}> Genera le date formattate per il frontmatter e per il contenuto leggibile del report.
// [ENG]> Generates formatted timestamps for the frontmatter and human-readable report content.
const nowFormatted = tp.date.now("YYYY/MM/DD HH:mm:ss");
const nowFormattedITA = tp.date.now("DD/MM/YYYY HH:mm:ss");
const timestampFile = tp.date.now("YYYY-MM-DD_HH-mm-ss");
const yearReport = tp.date.now("YYYY");
// [ITA}> Costruisce il nome definitivo del file di report (es. NomeNota_2026-11-20_21-16-00-Menzioni.md).
// [ENG]> Constructs the final filename for the report (e.g., NoteName_2026-11-20_21-16-00-Menzioni.md).
const reportBaseName = `${activeFile.basename}_${timestampFile}${REPORT_SUFFIX}`;
const reportFileName = `${reportBaseName}.md`;
// [ITA}> Costruisce il percorso completo di salvataggio nella stessa cartella della nota aperta.
// [ENG]> Constructs the full save path inside the same folder as the open note.
const reportFullPath = (parentFolderPath === "/" || parentFolderPath === "")
    ? reportFileName
    : `${parentFolderPath}/${reportFileName}`;

// ============================================================================
// 3. LETTURA METADATI NOTA ATTIVA E FUNZIONI DI SUPPORTO
// ============================================================================

// [ITA}> Funzione helper per estrarre in modo sicuro il campo frontmatter 'titolo-doc' di un qualsiasi TFile.
// [ENG]> Helper function to safely extract the 'titolo-doc' frontmatter field from any TFile.
function getTitoloDoc(targetFile) {
    // [ITA}> Recupera la cache dei metadati del file passato come argomento.
    // [ENG]> Retrieves the metadata cache for the passed file.
    const cache = app.metadataCache.getFileCache(targetFile);
    // [ITA}> Verifica che esistano il frontmatter e la chiave 'titolo-doc' con un valore valido.
    // [ENG]> Checks that frontmatter and the 'titolo-doc' key exist with a valid value.
    if (cache && cache.frontmatter && cache.frontmatter["titolo-doc"]) {
        // [ITA}> Converte in stringa e rimuove eventuali spazi superflui ai margini.
        // [ENG]> Converts to string and trims any leading or trailing whitespace.
        const val = String(cache.frontmatter["titolo-doc"]).trim();
        // [ITA}> Restituisce il valore solo se non è una stringa vuota.
        // [ENG]> Returns the value only if it is not an empty string.
        if (val.length > 0) return val;
    }
    // [ITA}> Restituisce null se il campo è assente o vuoto.
    // [ENG]> Returns null if the field is missing or empty.
    return null;
}

// [ITA}> Recupera la cache dei metadati della nota attualmente aperta.
// [ENG]> Retrieves the metadata cache of the currently open note.
const activeCache = app.metadataCache.getFileCache(activeFile);
// [ITA}> Estrae il 'titolo-doc' della nota aperta (oppure null se assente).
// [ENG]> Extracts the 'titolo-doc' of the open note (or null if missing).
const activeTitoloDoc = getTitoloDoc(activeFile);
// [ITA}> Prepara la stringa formattata per l'intestazione H1 (nome file + eventuale titolo-doc).
// [ENG]> Prepares the formatted string for the H1 heading (filename + optional titolo-doc).
const activeHeaderLabel = activeTitoloDoc
    ? `${activeFile.basename} — ${activeTitoloDoc}`
    : activeFile.basename;
// [ITA}> Inizializza un Set per raccogliere tutti i termini da cercare (nome file + tutti gli alias senza duplicati).
// [ENG]> Initializes a Set to collect all terms to search for (filename + all aliases without duplicates).
const searchTermsSet = new Set();
// [ITA}> Aggiunge sempre il nome base del file aperto tra i termini di ricerca.
// [ENG]> Always adds the basename of the open file to the search terms.
searchTermsSet.add(activeFile.basename);
// [ITA}> Verifica se nel frontmatter della nota aperta sono presenti 'aliases' o 'alias'.
// [ENG]> Checks if 'aliases' or 'alias' are present in the open note's frontmatter.
if (activeCache && activeCache.frontmatter) {
    const rawAliases = activeCache.frontmatter.aliases || activeCache.frontmatter.alias;
    // [ITA}> Se gli alias sono un array, li aggiunge uno per uno dopo averli ripuliti.
    // [ENG]> If aliases are an array, adds them one by one after trimming.
    if (Array.isArray(rawAliases)) {
        for (const a of rawAliases) {
            if (a !== null && a !== undefined && String(a).trim().length > 0) {
                searchTermsSet.add(String(a).trim());
            }
        }
    // [ITA}> Se l'alias è una singola stringa, lo aggiunge al Set.
    // [ENG]> If alias is a single string, adds it to the Set.
    }
	else if (typeof rawAliases === "string" && rawAliases.trim().length > 0) {
        searchTermsSet.add(rawAliases.trim());
    }
}

// ============================================================================
// 4. FILTRAGGIO DEI FILE DEL VAULT (INCLUDE_FOLDERS & EXCLUDE_PREFIXES)
// ============================================================================

// [ITA}> Normalizza i percorsi delle cartelle incluse (converte "\" in "/" e rimuove eventuali prefissi "root/").
// [ENG]> Normalizes included folder paths (converts "\" to "/" and strips optional "root/" prefixes).
const normalizedIncludes = INCLUDE_FOLDERS.map(folder => {
    let clean = folder.replace(/\\/g, "/").trim();
    if (clean === "/" || clean.toLowerCase() === "root" || clean.toLowerCase() === "root/") {
        return "/";
    }
    clean = clean.replace(/^root\//i, "").replace(/^\/+|\/+$/g, "");
    return clean;
});
// [ITA}> Recupera tutti i file Markdown del vault e applica i filtri di inclusione ed esclusione.
// [ENG]> Retrieves all Markdown files in the vault and applies inclusion and exclusion filters.
const candidateFiles = app.vault.getMarkdownFiles().filter(mdFile => {
    // [ITA}> Esclude la nota attualmente aperta.
    // [ENG]> Excludes the currently open note.
    if (mdFile.path === activeFile.path) return false;
    // [ITA}> Esclude eventuali report delle menzioni generati in precedenza.
    // [ENG]> Excludes any previously generated mention reports.
    if (mdFile.basename.endsWith(REPORT_SUFFIX)) return false;
    // [ITA}> Esclude i file il cui nome inizia con uno dei prefissi configurati in EXCLUDE_PREFIXES.
    // [ENG]> Excludes files whose name starts with any prefix configured in EXCLUDE_PREFIXES.
    for (const prefix of EXCLUDE_PREFIXES) {
        if (prefix && mdFile.basename.startsWith(prefix)) return false;
    }
    // [ITA}> Se INCLUDE_FOLDERS è vuoto, considera validi tutti i file rimanenti.
    // [ENG]> If INCLUDE_FOLDERS is empty, considers all remaining files valid.
    if (normalizedIncludes.length === 0) return true;
    // [ITA}> Verifica se il percorso del file rientra in almeno una delle cartelle configurate (inclusa la root "/").
    // [ENG]> Checks if the file path falls within at least one configured folder (including root "/").
    const fileParent = mdFile.parent ? mdFile.parent.path : "/";
    return normalizedIncludes.some(inc => {
        if (inc === "/") {
            return fileParent === "/" || fileParent === "";
        }
        return mdFile.path === inc || mdFile.path.startsWith(inc + "/");
    });
});

// ============================================================================
// 5. ESTRAZIONE MENZIONI COLLEGATE E RICERCA MENZIONI SCOLLEGATE
// ============================================================================

// [ITA}> Crea una mappa veloce dei file candidati (chiave: percorso, valore: oggetto TFile).
// [ENG]> Creates a fast lookup map of candidate files (key: path, value: TFile object).
const candidateMap = new Map(candidateFiles.map(f => [f.path, f]));
// [ITA}> Inizializza le liste per raccogliere gli oggetti risultato (file, totale ricorrenze e mappa termini trovati).
// [ENG]> Initializes lists to collect result objects (file, total occurrences, and map of matched terms).
const linkedNotes = [];
const unlinkedNotes = [];
// [ITA}> Recupera la mappa globale dei link risolti da Obsidian (sourcePath -> { targetPath: count }).
// [ENG]> Retrieves Obsidian's global resolved links map (sourcePath -> { targetPath: count }).
const resolvedLinks = app.metadataCache.resolvedLinks;
// [ITA}> Funzione helper per eseguire l'escape dei caratteri speciali nelle espressioni regolari.
// [ENG]> Helper function to escape special characters for regular expressions.
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// [ITA}> Ordina i termini di ricerca dal più lungo al più corto per evitare match parziali prematuri.
// [ENG]> Sorts search terms from longest to shortest to avoid premature partial matches.
const sortedTerms = Array.from(searchTermsSet).sort((a, b) => b.length - a.length);
// [ITA}> Precompila una RegEx globale case-insensitive per ciascun singolo termine/alias.
// [ENG]> Precompiles a global case-insensitive RegEx for each individual term/alias.
const termRegexList = sortedTerms.map(term => ({
    term: term,
    regex: new RegExp(`(?<![\\w\\u00C0-\\u024F])${escapeRegExp(term)}(?![\\w\\u00C0-\\u024F])`, "gi")
}));
// [ITA}> Individua tra i file candidati quelli che contengono almeno un link esplicito alla nota aperta.
// [ENG]> Identifies among candidate files those containing at least one explicit link to the open note.
for (const [sourcePath, mdFile] of candidateMap.entries()) {
    const linksInFile = resolvedLinks[sourcePath];
    if (linksInFile && linksInFile[activeFile.path] > 0) {
        const totalLinkedCount = linksInFile[activeFile.path];
        const termCounts = new Map();
        // [ITA}> Analizza i link nella cache del file per contare quale nome/alias è stato usato nei wikilink.
        // [ENG]> Inspects links in the file cache to count which name/alias was used in wikilinks.
        const fileCache = app.metadataCache.getFileCache(mdFile);
        if (fileCache && Array.isArray(fileCache.links)) {
            for (const linkObj of fileCache.links) {
                const destFile = app.metadataCache.getFirstLinkpathDest(linkObj.link, sourcePath);
                if (destFile && destFile.path === activeFile.path) {
                    const matchedTerm = (linkObj.displayText || activeFile.basename).trim();
                    termCounts.set(matchedTerm, (termCounts.get(matchedTerm) || 0) + 1);
                }
            }
        }
        // [ITA}> Ripiego di sicurezza nel caso la cache dei link non restituisse voci dettagliate.
        // [ENG]> Fallback safeguard in case the link cache does not return detailed entries.
        if (termCounts.size === 0) {
            termCounts.set(activeFile.basename, totalLinkedCount);
        }
        linkedNotes.push({
            file: mdFile,
            totalCount: totalLinkedCount,
            termCounts: termCounts
        });
    }
}
// [ITA}> Crea un Set dei percorsi già collegati per non duplicarli tra le menzioni scollegate.
// [ENG]> Creates a Set of already linked paths so they are not duplicated in unlinked mentions.
const linkedPathsSet = new Set(linkedNotes.map(item => item.file.path));
// [ITA}> Scansiona i file candidati rimanenti alla ricerca di menzioni scollegate nel corpo del testo.
// [ENG]> Scans remaining candidate files searching for unlinked mentions in the body text.
for (const [sourcePath, mdFile] of candidateMap.entries()) {
    // [ITA}> Salta il file se ha già un collegamento esplicito alla nota aperta.
    // [ENG]> Skips the file if it already has an explicit link to the open note.
    if (linkedPathsSet.has(sourcePath)) continue;
    // [ITA}> Legge il contenuto testuale del file dalla cache veloce di Obsidian.
    // [ENG]> Reads the text content of the file from Obsidian's fast cache.
    let bodyText = await app.vault.cachedRead(mdFile);
    // [ITA}> Rimuove l'eventuale blocco frontmatter YAML iniziale usando le coordinate della metadataCache.
    // [ENG]> Strips the initial YAML frontmatter block using metadataCache coordinates.
    const fileCache = app.metadataCache.getFileCache(mdFile);
    if (fileCache && fileCache.frontmatterPosition) {
        bodyText = bodyText.slice(fileCache.frontmatterPosition.end.offset);
    }
    // [ITA}> Rimuove tutti i wikilink [[...]] e i link Markdown [...](...) per evitare falsi positivi già collegati.
    // [ENG]> Removes all wikilinks [[...]] and Markdown links [...](...) to avoid already-linked false positives.
    const cleanBody = bodyText
        .replace(/\[\[[^\]]+\]\]/g, " ")
        .replace(/\[[^\]]+\]\([^)]+\)/g, " ");
    // [ITA}> Conta le ricorrenze scollegate separatamente per ogni singolo termine/alias.
    // [ENG]> Counts unlinked occurrences separately for each individual term/alias.
    let totalUnlinkedCount = 0;
    const termCounts = new Map();
    for (const { term, regex } of termRegexList) {
        const matches = [...cleanBody.matchAll(regex)];
        if (matches.length > 0) {
            termCounts.set(term, matches.length);
            totalUnlinkedCount += matches.length;
        }
    }
    // [ITA}> Se ha trovato almeno una ricorrenza scollegata, salva il file e i relativi conteggi.
    // [ENG]> If at least one unlinked occurrence was found, saves the file and its counts.
    if (totalUnlinkedCount > 0) {
        unlinkedNotes.push({
            file: mdFile,
            totalCount: totalUnlinkedCount,
            termCounts: termCounts
        });
    }
}

// ============================================================================
// 6. ORDINAMENTO E FORMATTAZIONE DEL REPORT MARKDOWN
// ============================================================================

// [ITA}> Ordina alfabeticamente entrambe le liste per nome file in lingua italiana.
// [ENG]> Alphabetically sorts both lists by filename using Italian locale rules.
linkedNotes.sort((a, b) => a.file.basename.localeCompare(b.file.basename, "it"));
unlinkedNotes.sort((a, b) => a.file.basename.localeCompare(b.file.basename, "it"));
// [ITA}> Funzione helper per formattare una lista come OL con conteggio ricorrenze e blocchi query per alias.
// [ENG]> Helper function to format a list as an OL with occurrence counts and per-alias query blocks.
function formatOrderedList(itemsArray, emptyMessage) {
    if (itemsArray.length === 0) {
        return emptyMessage;
    }
    return itemsArray.map((item, index) => {
        const f = item.file;
        const docTitle = getTitoloDoc(f);
        const linkPart = `[[${f.path}|${f.basename}]]`;
        const titlePart = docTitle ? ` — ${docTitle}` : "";
        const countLabel = item.totalCount === 1 ? "1 ricorrenza" : `${item.totalCount} ricorrenze`;
        // [ITA}> Genera un blocco query separato e rientrato per ciascun termine/alias trovato in questo file.
        // [ENG]> Generates a separate indented query block for each term/alias found in this file.
        const queryBlocks = Array.from(item.termCounts.entries()).map(([term, termCount]) => {
            const safePath = f.path.replace(/"/g, '\\"');
            const safeTerm = term.replace(/"/g, '\\"');
            const termCountLabel = termCount === 1 ? "1 ricorrenza" : `${termCount} ricorrenze`;
            return `\t<details>\n\t<summary><strong>Termine / Alias:</strong> <code>${term}</code> (${termCountLabel})</summary>\n\n\t\`\`\`query\n\tpath:"${safePath}" "${safeTerm}"\n\t\`\`\`\n\n\t</details>`;
        }).join("\n");
        return `${index + 1}. ${linkPart}${titlePart} *(${countLabel})*\n${queryBlocks}`;
    }).join("\n\n");
}
// [ITA}> Genera gli elenchi numerati per entrambe le sezioni.
// [ENG]> Generates the ordered lists for both sections.
const linkedListMarkdown = formatOrderedList(linkedNotes, "*Nessuna menzione collegata trovata nelle cartelle selezionate.*");
const unlinkedListMarkdown = formatOrderedList(unlinkedNotes, "*Nessuna menzione scollegata trovata nelle cartelle selezionate.*");
// [ITA}> Costruisce il contenuto completo del nuovo file Markdown incluso il frontmatter richiesto.
// [ENG]> Builds the complete content of the new Markdown file including the required frontmatter.
const finalReportContent = `---
licenza-nota:
  - Copyright © ${yearReport} Emanuele Tinari under
  - "[Creative Commons BY-NC-SA 4.0](https://creativecommons.org)"
ideatore:
  - "Emanuele Tinari"
sviluppatore:
  - "Emanuele Tinari"
  - "Google Gemini in Google Search AI mode"
template: "Genera-report-menzioni-nota-attiva.md"
nomeFile: "${reportFileName}"
creato:
modificato:
---

# Menzioni nel file: ${activeHeaderLabel}

*Report generato il*: ${nowFormattedITA}

***

## Menzioni COLLEGATE:

${linkedListMarkdown}

***

## Menzioni SCOLLEGATE:

${unlinkedListMarkdown}
`;

// ============================================================================
// 7. CREAZIONE FILE, APERTURA IN NUOVA SCHEDA E RIPRISTINO FOCUS
// ============================================================================

try {
    // [ITA}> Crea fisicamente la nuova nota Markdown nella stessa cartella della nota aperta.
    // [ENG]> Physically creates the new Markdown note inside the same folder as the open note.
    const createdFile = await app.vault.create(reportFullPath, finalReportContent);
    // [ITA}> Apre una nuova scheda (tab) e vi carica il report appena creato.
    // [ENG]> Opens a new tab (leaf) and loads the newly created report into it.
    const newTabLeaf = app.workspace.getLeaf("tab");
    await newTabLeaf.openFile(createdFile);
    // [ITA}> Riporta immediatamente il focus sulla scheda della nota di origine.
    // [ENG]> Immediately restores focus back to the original note's tab.
    if (originLeaf) {
        app.workspace.setActiveLeaf(originLeaf, { focus: true });
    }
    // [ITA}> Mostra una notifica di conferma con il nome del file creato e il conteggio dei risultati.
    // [ENG]> Displays a confirmation notice with the created filename and result counts.
    const totalLinkedOcc = linkedNotes.reduce((sum, item) => sum + item.totalCount, 0);
    const totalUnlinkedOcc = unlinkedNotes.reduce((sum, item) => sum + item.totalCount, 0);
    new Notice(
        `✅ Report creato e aperto in nuova scheda:\n"${reportFileName}"\n(Collegate: ${linkedNotes.length} file / ${totalLinkedOcc} ric. | Scollegate: ${unlinkedNotes.length} file / ${totalUnlinkedOcc} ric.)`,
        6000
    );
}
catch (errCreate) {
    // [ITA}> Registra eventuali errori in console e avvisa l'utente tramite Notice.
    // [ENG]> Logs any errors to console and alerts the user via Notice.
    console.error("LOG [CRASH CREATE REPORT MENZIONI]:", errCreate);
    new Notice(`❌ Errore durante la creazione del report:\n${errCreate.message}`, 6000);
}
-%>
