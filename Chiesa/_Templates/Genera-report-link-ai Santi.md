---
licenza-nota: Copyright © 2026 Emanuele Tinari under Creative Commons BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
ideatore: "Emanuele Tinari"
sviluppatore: ["Emanuele Tinari", "Gemini Web App"]
nomeFile: "Genera-report-link-ai-Santi.md"
creato: 2026/08/28 15:13:33
modificato: 2026/08/28 15:13:33
---

<%*
/*
===============================================================================
📌 GENERA REPORT LINK IN GRASSETTO AI SANTI (OBSIDIAN SCRIPT PER TEMPLATER)
===============================================================================

ITA
--------
DESCRIZIONE:
Questo script per Templater genera un report in formato Markdown nella radice (`/`) della Vault di Obsidian, analizzando e raggruppando tutti i link interni ai Santi e ai Beati formattati in grassetto (`**[[...]]**`).

FUNZIONALITÀ PRINCIPALI:
1. Gestione Smart del Frontmatter (Previene Duplicati):
   Legge il file in uso per estrarre le proprietà temporali (`creato`, `modificato`) se già esistenti, rigenerando un blocco YAML pulito integrato con licenza, autore e campo `nomeFile`.
2. Scansione Vault ed Esclusione Automatica dei Vecchi Report:
   Scansiona i file Markdown della vault ignorando automaticamente tutti i report generati in precedenza (tramite la costante del suffisso `REPORT_SUFFIX`), evitando auto-analisi e falsi positivi.
3. Estrazione Regex Mirata (Santi e Beati):
   Intercetta i link interni formattati in grassetto riconducibili a Santi o Beati nel formato `**[[Target|Alias]]**` o `**[[Target]]**`.
4. Struttura a Schede per Nota Target:
   Raggruppa i risultati in schede con intestazione H3 per ciascuna nota di destinazione, mostrando il conteggio totale delle ricorrenze trovate nell'intera vault.
5. Dettaglio per Singolo Alias e Conteggio per File:
   Sotto ogni scheda, suddivide i riscontri per singolo alias fornendo:
   - Un conteggio dedicato delle ricorrenze dell'alias e dei file unici in cui compare.
   - Un blocco di codice copiabile contenente la sintassi esatta del wikilink in grassetto (`**[[...]]**`).
   - L'elenco puntato dei file sorgente con la relativa frequenza dell'alias all'interno della singola nota.
   - Gestione grammaticale automatica delle diciture al singolare/plurale (*ricorrenza/ricorrenze*, *file*).
6. Ridenominazione e Posizionamento Automatico:
   Assegna al file un nome univoco composto da timestamp e costante di suffisso (es. `YYYY-MM-DD_HH-mm-ss-Report-link-grassetto-ai-Santi.md`) e lo sposta nella radice della Vault (`/`).

REQUISITI:
- Obsidian MD
- Community Plugin: Templater (con esecuzione di script JavaScript abilitata)

=================================================================================================================================

ENG
-------
DESCRIPTION:
This Templater script generates a Markdown report in the root directory (`/`) of your Obsidian Vault, analyzing and grouping all internal links to Saints and Blesseds formatted in bold (`**[[...]]**`).

KEY FEATURES:
1. Smart Frontmatter Parsing (Prevents Duplication):
   Reads the active file to extract existing timestamp properties (`creato`, `modificato`), rebuilding a clean YAML block integrated with license, author, and `nomeFile`.
2. Vault Scan & Automatic Exclusion of Old Reports:
   Scans Markdown files in the vault while automatically skipping all previously generated report files (via the `REPORT_SUFFIX` constant), preventing self-analysis and false positives.
3. Targeted Regex Extraction (Saints & Blesseds):
   Captures bold internal links referencing Saints or Blesseds in `**[[Target|Alias]]**` or `**[[Target]]**` format.
4. Card Structure by Target Note:
   Groups results into cards with H3 headings for each target note, displaying total occurrence counts across the entire vault.
5. Detailed Breakdown per Alias & File Counts:
   Subdivides matches per alias under each card, providing:
   - A dedicated count of alias occurrences and unique files where it appears.
   - A copyable code block containing the exact bold wikilink syntax (`**[[...]]**`).
   - A bulleted list of source files with their respective per-file occurrence frequencies.
   - Automatic handling of singular/plural wording (*ricorrenza/ricorrenze*, *file*).
6. Automatic Renaming & Relocation:
   Assigns a unique filename composed of a timestamp and suffix constant (e.g., `YYYY-MM-DD_HH-mm-ss-Report-link-grassetto-ai-Santi.md`) and moves the note to the vault root (`/`).

REQUIREMENTS:
- Obsidian MD
- Community Plugin: Templater (with User JavaScript execution enabled)

=================================================================================================================================
*/

// [ITA] Ottiene il riferimento al file target in fase di creazione da Templater oppure al file attualmente attivo nel workspace.
// [ENG] Retrieves the reference to the target file being created by Templater or the currently active file in the workspace.
const file = tp.config.target_file || app.workspace.getActiveFile();
// [ITA] Inizializza una variabile stringa vuota destinata a contenere l'eventuale testo già presente nel file.
// [ENG] Initializes an empty string variable to hold any existing text found in the file.
let existingText = "";
// [ITA] Verifica che l'oggetto file sia stato recuperato correttamente prima di tentare la lettura.
// [ENG] Checks if the file object was successfully retrieved before attempting to read it.
if (file) {
    // [ITA] Legge in modo asincrono il contenuto testuale del file dalla vault e lo assegna alla variabile.
    // [ENG] Asynchronously reads the text content of the file from the vault and assigns it to the variable.
    existingText = await app.vault.read(file);
// [ITA] Chiude il blocco condizionale di verifica del file.
// [ENG] Closes the conditional file check block.
}
// [ITA] Cerca la chiave 'creato:' nel testo esistente tramite espressione regolare per estrarne il valore.
// [ENG] Searches for the 'creato:' key in the existing text using a regular expression to extract its value.
const creatoMatch = existingText.match(/^creato:\s*(.*)$/m);
// [ITA] Cerca la chiave 'modificato:' nel testo esistente tramite espressione regolare per estrarne il valore.
// [ENG] Searches for the 'modificato:' key in the existing text using a regular expression to extract its value.
const modificatoMatch = existingText.match(/^modificato:\s*(.*)$/m);
// [ITA] Genera la data e ora corrente nel formato ISO (AAAA/MM/GG HH:mm:ss) tramite la funzione tp.date.now di Templater.
// [ENG] Generates the current timestamp in ISO format (YYYY/MM/DD HH:mm:ss) using Templater's tp.date.now function.
const nowFormatted = tp.date.now("YYYY/MM/DD HH:mm:ss");
// [ITA] Genera la data e ora corrente nel formato italiano (GG/MM/AAAA HH:mm:ss) tramite Templater.
// [ENG] Generates the current timestamp in Italian format (DD/MM/YYYY HH:mm:ss) using Templater.
const nowFormattedITA = tp.date.now("DD/MM/YYYY HH:mm:ss");
// [ITA] Assegna il valore di 'creato' estratto e ripulito da spazi, oppure la data attuale come ripiego se non trovato.
// [ENG] Assigns the extracted and trimmed 'creato' value, or defaults to the current date if absent.
const creatoVal = creatoMatch ? creatoMatch[1].trim() : nowFormatted;
// [ITA] Assegna il valore di 'modificato' estratto e ripulito da spazi, oppure la data attuale come ripiego se non trovato.
// [ENG] Assigns the extracted and trimmed 'modificato' value, or defaults to the current date if absent.
const modificatoVal = modificatoMatch ? modificatoMatch[1].trim() : nowFormatted;
// [ITA] Definisce la costante del suffisso univoco per i file di report generati.
// [ENG] Defines the unique suffix constant for generated report files.
const REPORT_SUFFIX = "-Report-link-grassetto-ai-Santi";
// [ITA] Recupera l'elenco di tutti i file Markdown (.md) presenti all'interno della vault di Obsidian.
// [ENG] Retrieves the list of all Markdown (.md) files present within the Obsidian vault.
const allMarkdownFiles = app.vault.getMarkdownFiles();
// [ITA] Inizializza una Map per associare ciascun link unico all'insieme (Set) dei file sorgente in cui viene trovato.
// [ENG] Initializes a Map to associate each unique link with the Set of source files in which it is found.
const linkMap = new Map();
// [ITA] Definisce l'espressione regolare per intercettare la sintassi specifica **[[...]]**.
// [ENG] Defines the regular expression to match the specific **[[...]]** syntax.
const linkRegex = /\*\*\[\[(\s*(?:San|Bea)[^\]\r\n]*)\]\]\*\*/g;
// [ITA] Avvia un ciclo for...of per elaborare individualmente ogni file Markdown della vault.
// [ENG] Starts a for...of loop to process each Markdown file in the vault individually.
for (const mdFile of allMarkdownFiles) {
    // [ITA] Salta l'elaborazione se il file corrente è un report precedentemente generato (contiene il suffisso).
    // [ENG] Skips processing if the current file is a previously generated report (contains the suffix).
    if (mdFile.name.includes(REPORT_SUFFIX)) continue;
    // [ITA] Legge in modo ottimizzato il contenuto testuale del file Markdown corrente.
    // [ENG] Optimally reads the text content of the current Markdown file.
    const content = await app.vault.cachedRead(mdFile);
    // [ITA] Trova tutti i riscontri della regex all'interno del contenuto del file corrente.
    // [ENG] Finds all matches of the regex within the current file content.
    const matches = [...content.matchAll(linkRegex)];
    // [ITA] Avvia un ciclo per iterare su ciascun match trovato nel file corrente.
    // [ENG] Starts a loop to iterate through each match found in the current file.
    for (const match of matches) {
		// [ITA] Estrae il testo interno al link (gruppo 1) rimuovendo eventuali spazi ai margini.
		// [ENG] Extracts the inner text of the link (group 1) trimming any leading or trailing spaces.
		const rawContent = match[1].trim();
		// [ITA] Separa la nota di destinazione dall'alias dividendo la stringa al carattere pipe.
		// [ENG] Separates the target note from the alias by splitting the string at the pipe character.
		const parts = rawContent.split("|");
		// [ITA] Estrae il nome della nota target (prima del pipe) rimuovendo gli spazi.
		// [ENG] Extracts the target note name (before the pipe) trimming spaces.
		const targetNote = parts[0].trim();
		// [ITA] Assegna l'alias (dopo il pipe) oppure usa la nota target se l'alias non è presente.
		// [ENG] Assigns the alias (after the pipe) or uses the target note if no alias is present.
		const alias = parts.length > 1 ? parts[1].trim() : targetNote;
		// [ITA] Verifica se la nota target non è ancora presente nella mappa dei link.
		// [ENG] Checks if the target note is not yet present in the link map.
		// [ITA] Inizializza l'oggetto della nota target con il conteggio totale e la mappa degli alias se non presente.
        // [ENG] Initializes target note object with total count and alias map if not present.
        if (!linkMap.has(targetNote)) {
            linkMap.set(targetNote, {
                totalCount: 0,
                aliasMap: new Map()
            });
        // [ITA] Chiude il blocco condizionale di inizializzazione della nota target.
        // [ENG] Closes target note initialization conditional block.
        }
		// [ITA] Recupera l'oggetto contenente i Set associati alla nota target corrente.
		// [ENG] Retrieves the object containing the Sets associated with the current target note.
		const entry = linkMap.get(targetNote);
		// [ITA] Incrementa di 1 il contatore totale delle ricorrenze trovate nel vault.
        // [ENG] Increments the total recurrence counter found in the vault by 1.
        entry.totalCount++;
		// [ITA] Memorizza la stringa esatta del wikilink in grassetto così come estratta dal file.
        // [ENG] Stores exact bold wikilink string as extracted from file.
        const rawLink = match[0];
        // [ITA] Inizializza i dati per l'alias se non presente, usando una Map per tracciare le ricorrenze per singolo file.
        // [ENG] Initializes alias data if not present, using a Map to track occurrences per individual file.
        if (!entry.aliasMap.has(rawLink)) {
            // [ITA] Crea l'oggetto alias con conteggio totale e mappa dei file associati.
            // [ENG] Creates alias object with total count and associated files map.
            entry.aliasMap.set(rawLink, {
                count: 0,
                filesMap: new Map()
            });
        // [ITA] Chiude il blocco condizionale di inizializzazione dell'alias.
        // [ENG] Closes alias initialization conditional block.
        }
        // [ITA] Recupera l'oggetto dati relativo al singolo alias corrente.
        // [ENG] Retrieves data object for current single alias.
        const aliasEntry = entry.aliasMap.get(rawLink);
        // [ITA] Incrementa il conteggio totale delle ricorrenze di questo specifico alias.
        // [ENG] Increments total occurrence count for this specific alias.
        aliasEntry.count++;
        // [ITA] Costruisce il link al file sorgente.
        // [ENG] Constructs link to source file.
        const fileLink = `[[${mdFile.path}|${mdFile.basename}]]`;
        // [ITA] Recupera il conteggio attuale di questo alias all'interno del file sorgente corrente.
        // [ENG] Retrieves current count of this alias within current source file.
        const currentFileCount = aliasEntry.filesMap.get(fileLink) || 0;
        // [ITA] Aggiorna il conteggio delle ricorrenze dell'alias per questo specifico file.
        // [ENG] Updates alias occurrence count for this specific file.
        aliasEntry.filesMap.set(fileLink, currentFileCount + 1);
	// [ITA] Chiude il ciclo interno delle corrispondenze trovate nel file corrente.
    // [ENG] Closes inner loop for matches found in current file.
    }
// [ITA] Chiude il ciclo esterno di iterazione su tutti i file della vault.
// [ENG] Closes outer loop iterating over all vault files.
}
// [ITA] Estrae e ordina alfabeticamente tutte le note target dei Santi/Beati.
// [ENG] Extracts and alphabetically sorts all Saints/Blesseds target notes.
const sortedTargets = Array.from(linkMap.keys()).sort((a, b) => a.localeCompare(b));
// [ITA] Inizializza l'array per contenere i blocchi Markdown delle schede.
// [ENG] Initializes array to hold markdown card blocks.
let reportSections = [];
// [ITA] Cicla attraverso ogni nota target ordinata alfabeticamente.
// [ENG] Loops through each target note sorted alphabetically.
for (const target of sortedTargets) {
    // [ITA] Recupera l'oggetto contenente il totale e la mappa degli alias.
    // [ENG] Retrieves object containing total count and alias map.
    const entry = linkMap.get(target);
    // [ITA] Formatta la stringa del totale declinandola al singolare o al plurale in base al valore.
    // [ENG] Formats total string handling singular or plural form based on value.
    const totalLabel = entry.totalCount === 1 ? "1 ricorrenza totale trovata" : `${entry.totalCount} ricorrenze totali trovate`;
    // [ITA] Inizializza l'intestazione H3 e il conteggio delle ricorrenze della scheda.
    // [ENG] Initializes H3 header and occurrence count for the card.
    let cardContent = `### **[[${target}]]**\n*(${totalLabel})*\n\n`;
    // [ITA] Ottiene e ordina alfabeticamente la lista di tutti i wikilink alias registrati.
    // [ENG] Gets and alphabetically sorts list of all registered wikilink aliases.
    const sortedRawLinks = Array.from(entry.aliasMap.keys()).sort((a, b) => a.localeCompare(b));
    // [ITA] Inizializza il contatore progressivo degli alias per la numerazione.
    // [ENG] Initializes progressive alias counter for numbering.
    let aliasIndex = 1;
    // [ITA] Cicla attraverso ciascun alias registrato per la nota target.
    // [ENG] Loops through each registered alias for target note.
    for (const rawLink of sortedRawLinks) {
        // [ITA] Recupera i dati dell'alias (conteggio totale e mappa dei file).
        // [ENG] Retrieves alias data (total count and files map).
        const aliasData = entry.aliasMap.get(rawLink);
        // [ITA] Formatta la stringa delle ricorrenze dell'alias al singolare o al plurale.
        // [ENG] Formats alias occurrence string in singular or plural.
        const aliasCountLabel = aliasData.count === 1 ? "1 ricorrenza" : `${aliasData.count} ricorrenze`;
        // [ITA] Recupera il numero di file unici in cui compare l'alias.
        // [ENG] Retrieves number of unique files where alias appears.
        const totalFiles = aliasData.filesMap.size;
        // [ITA] Formatta l'etichetta del numero di file.
        // [ENG] Formats file count label.
        const fileCountLabel = totalFiles === 1 ? "in 1 file" : `in ${totalFiles} file`;
        // [ITA] Estrae e ordina alfabeticamente i link dei file sorgente.
        // [ENG] Extracts and alphabetically sorts source file links.
        const sortedFiles = Array.from(aliasData.filesMap.keys()).sort((a, b) => a.localeCompare(b));
        // [ITA] Formatta l'elenco dei file con il rispettivo conteggio di ricorrenze per singolo file.
        // [ENG] Formats file list with respective occurrence count per individual file.
        const filesList = sortedFiles.map(f => {
            // [ITA] Recupera il conteggio specifico dell'alias nel file corrente.
            // [ENG] Retrieves specific alias count in current file.
            const fCount = aliasData.filesMap.get(f);
            // [ITA] Definisce la stringa del conteggio per il singolo file (singolare/plurale).
            // [ENG] Defines count string for individual file (singular/plural).
            const fLabel = fCount === 1 ? "1 ricorrenza" : `${fCount} ricorrenze`;
            // [ITA] Restituisce la riga formattata dell'elenco puntato.
            // [ENG] Returns formatted bullet list row.
            return `* ${f} (${fLabel})`;
        // [ITA] Unisce tutte le righe dei file con un a capo.
        // [ENG] Joins all file rows with a newline.
        }).join("\n");
        // [ITA] Aggiunge il blocco dell'alias formattato con conteggio totale, file unici e dettaglio file.
        // [ENG] Appends formatted alias block with total count, unique files, and file details.
        cardContent += `**Alias ${aliasIndex}** (${aliasCountLabel}, ${fileCountLabel})\n\`\`\`text\n${rawLink}\n\`\`\`\n${filesList}\n\n`;
        // [ITA] Incrementa l'indice progressivo per l'alias successivo.
        // [ENG] Increments progressive index for next alias.
        aliasIndex++;
    // [ITA] Chiude il ciclo relativo al singolo alias.
    // [ENG] Closes loop for single alias.
    }
    // [ITA] Aggiunge la scheda completa della nota target all'array delle sezioni.
    // [ENG] Appends complete target note card to sections array.
    reportSections.push(cardContent.trim());
// [ITA] Chiude il ciclo per nota target.
// [ENG] Closes target note loop.
}
// [ITA] Genera una stringa con data e ora correnti nel formato YYYY-MM-DD_HH-mm-ss per rendere il nome del file unico.
// [ENG] Generates a timestamp string with current date and time in YYYY-MM-DD_HH-mm-ss format to ensure a unique filename.
const timestamp = tp.date.now("YYYY-MM-DD_HH-mm-ss");
// [ITA] Ottiene l'anno corrente nel formato YYYY.
// [ENG] Gets the current year in YYYY format.
const yearReport = tp.date.now("YYYY");
// [ITA] Costruisce il nome definitivo del file combinando il timestamp generato e la costante del suffisso.
// [ENG] Constructs the final filename by combining the generated timestamp and the suffix constant.
const newFileName = `${timestamp}${REPORT_SUFFIX}`;
// [ITA] Inizia la definizione della stringa multilinea 'finalContent' aprendo il blocco Frontmatter YAML con i tre trattini.
// [ENG] Begins defining the multiline string 'finalContent' by opening the YAML Frontmatter block with three dashes.
const finalContent = `---
licenza-nota: "Copyright © ${yearReport} Emanuele Tinari under Creative Commons BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/"
ideatore: "Emanuele Tinari"
sviluppatore: ["Emanuele Tinari", "Gemini Web App"]
template: "Genera-report-link-ai-Santi.md"
nomeFile: "${newFileName}.md"
creato: ${creatoVal}
modificato: ${modificatoVal}
---

# Report Link Interni ai Santi e Beati in Grassetto

*Generato il*: ${nowFormattedITA}

==**ITA:**== Il report seguente elenca tutti i link interni ai Santi e ai Beati formattati come \`**[[...]]**\` trovati nei file Markdown della Vault.
Ogni elemento è raggruppato in una scheda per nota di destinazione, contenente l'elenco completo degli alias rilevati (in blocco di codice copiabile) e l'elenco puntato dei file in cui compare.

**ENG:** *The following report lists all internal links to Saints and Blesseds formatted as \`**[[...]]**\` found within the Vault's Markdown files.
Each item is grouped into a card by target note, containing the full list of detected aliases (inside a copyable code block) and a bulleted list of source files.*

${reportSections.length > 0 ? reportSections.join("\n\n---\n\n") : "*Nessun Santo o Beato trovato.*"}
`;
// [ITA] Avvia il blocco per tentare la rinomina asincrona del file.
// [ENG] Starts the block to attempt asynchronous file renaming.
try {
    // [ITA] Esegue la rinomina del file impostando il nuovo nome generato.
    // [ENG] Executes the file rename setting the newly generated name.
    const rispRename = await tp.file.rename(newFileName);
// [ITA] Chiude il blocco di tentativo di rinomina.
// [ENG] Closes the rename attempt block.
}
// [ITA] Intercetta ed estrae l'eventuale eccezione verificatasi durante la rinomina.
// [ENG] Catches and extracts any exception that occurred during renaming.
catch (errRename) {
    // [ITA] Stampa l'errore di rinomina nella console dello sviluppatore.
    // [ENG] Logs the rename error to the developer console.
    console.error("LOG [CRASH RENAME]: Errore durante la rinomina:", errRename);
// [ITA] Chiude il blocco di gestione dell'errore di rinomina.
// [ENG] Closes the rename error handling block.
}
// [ITA] Avvia il blocco per tentare lo spostamento asincrono del file nella radice (root).
// [ENG] Starts the block to attempt asynchronous file movement to the root directory.
try {
    // [ITA] Sposta il file nella radice della vault assegnandogli il percorso definitivo.
    // [ENG] Moves the file to the vault root assigning its final path.
    const rispMove = await tp.file.move("/" + newFileName);
// [ITA] Chiude il blocco di tentativo di spostamento.
// [ENG] Closes the move attempt block.
}
// [ITA] Intercetta ed estrae l'eventuale eccezione verificatasi durante lo spostamento.
// [ENG] Catches and extracts any exception that occurred during moving.
catch (errMove) {
    // [ITA] Stampa l'errore di spostamento nella console dello sviluppatore.
    // [ENG] Logs the move error to the developer console.
    console.error("LOG [CRASH MOVE]: Errore durante lo spostamento:", errMove);
// [ITA] Chiude il blocco di gestione dell'errore di spostamento.
// [ENG] Closes the move error handling block.
}
// [ITA] Assegna la stringa contenente l'intero report alla variabile interna 'tR' di Templater per iniettare il contenuto nel file.
// [ENG] Assigns the string containing the complete report to Templater's internal 'tR' variable to inject the content into the file.
tR = finalContent;

-%>