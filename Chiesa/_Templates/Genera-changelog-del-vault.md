---
licenza-nota: Copyright © 2026 Emanuele Tinari under Creative Commons BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
ideatore: "Emanuele Tinari"
sviluppatore: ["Emanuele Tinari", "Gemini Web App"]
nomeFile: "Genera-changelog-del-vault.md"
creato: 2026/08/29 07:46:21
modificato: 2026/08/29 07:46:21
---

<%*

/**
 * [ITA] Converte una stringa di data dal formato ISO al formato italiano (DD-MM-YYYY).
 * [ENG] Converts a date string from ISO format to Italian format (DD-MM-YYYY).
 *
 * @param {string} isoDateStr
 * [ITA] La stringa della data nel formato ISO (es. YYYY-MM-DD).
 * [ENG] The date string in ISO format (e.g. YYYY-MM-DD).
 *
 * @returns {string}
 * [ITA] La data formattata secondo lo standard italiano DD-MM-YYYY.
 * [ENG] The formatted date matching Italian standard DD-MM-YYYY.
 */
function convertDateIsoToIta(isoDateStr) {
    // [ITA] Crea un oggetto Date di JavaScript parsing la stringa ISO ricevuta in ingresso.
    // [ENG] Creates a JavaScript Date object parsing the incoming ISO date string.
    const dateObj = new Date(isoDateStr);
    // [ITA] Estrae il giorno del mese e forza la formattazione a due cifre con lo zero iniziale.
    // [ENG] Extracts day of month and enforces two-digit format with leading zero padding.
    const day = String(dateObj.getDate()).padStart(2, '0');
    // [ITA] Estrae il mese (0-11, per cui aggiunge 1) e forza il formato a due cifre.
    // [ENG] Extracts month (0-11, adding 1) and enforces two-digit format with padding.
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    // [ITA] Estrae l'anno a quattro cifre completo dall'oggetto data.
    // [ENG] Extracts full four-digit year from the date object.
    const year = dateObj.getFullYear();
    // [ITA] Restituisce la stringa formattata nel formato italiano giorno-mese-anno.
    // [ENG] Returns the formatted string matching Italian day-month-year standard.
    return `${day}-${month}-${year}`;
    // [ITA] Chiude il corpo della funzione di conversione della data.
    // [ENG] Closes body of the date conversion function.
}

/**
 * [ITA] Converte e formatta un timestamp ISO completo nel formato italiano esteso con orario e fuso orario.
 * [ENG] Converts and formats a full ISO timestamp into extended Italian format with time and timezone.
 *
 * @param {string} isoDateStr
 * [ITA] La stringa del timestamp completo nel formato ISO.
 * [ENG] The full timestamp string in ISO format.
 *
 * @returns {string}
 * [ITA] La stringa formattata contenente data italiana, orario (HH:mm:ss) ed eventuale fuso orario.
 * [ENG] The formatted string containing Italian date, time (HH:mm:ss) and optional timezone.
 */
function convertFullDateIsoToIta(isoDateStr) {
    // [ITA] Crea un oggetto Date basato sulla stringa ISO completa ricevuta in ingresso.
    // [ENG] Creates a Date object based on the full incoming ISO date string.
    const dateObj = new Date(isoDateStr);
    // [ITA] Converte la porzione di data calendariale usando la funzione di conversione base.
    // [ENG] Converts calendar date portion using the base conversion function.
    const formattedDay = convertDateIsoToIta(isoDateStr);
    // [ITA] Estrae le ore e imposta il formato a due cifre con padStart.
    // [ENG] Extracts hours and applies two-digit format using padStart.
    const hours = String(dateObj.getHours()).padStart(2, '0');
    // [ITA] Estrae i minuti e imposta il formato a due cifre con padStart.
    // [ENG] Extracts minutes and applies two-digit format using padStart.
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    // [ITA] Estrae i secondi e imposta il formato a due cifre con padStart.
    // [ENG] Extracts seconds and applies two-digit format using padStart.
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    // [ITA] Estrae la differenza di fuso orario (offset) dalla stringa ISO tramite RegEx.
    // [ENG] Extracts timezone difference offset from ISO string using RegEx matching.
    const tzMatch = isoDateStr.match(/([+-]\d{4})$/);
    // [ITA] Memorizza l'offset di fuso orario se presente, altrimenti imposta stringa vuota.
    // [ENG] Stores timezone offset string if matched, otherwise assigns empty string.
    const tz = tzMatch ? tzMatch[1] : '';
    // [ITA] Restituisce la stringa completa formattata con data italiana, ora e fuso orario.
    // [ENG] Returns full formatted string containing Italian date, time, and timezone.
    return `${formattedDay} ${hours}:${minutes}:${seconds} ${tz}`.trim();
    // [ITA] Chiude la funzione di formattazione completa della data ed ora.
    // [ENG] Closes full date and time formatting utility function.
}

/**
 * [ITA] Converte un timestamp Git ISO completo in millisecondi per ordinare correttamente date e ore.
 * [ENG] Converts a full Git ISO timestamp into milliseconds so dates and times are sorted correctly.
 *
 * @param {string} value
 * [ITA] La stringa di data completa in formato Git, es. "YYYY-MM-DD HH:mm:ss +0200".
 * [ENG] The full Git timestamp string, e.g. "YYYY-MM-DD HH:mm:ss +0200".
 *
 * @returns {number}
 * [ITA] Il timestamp espresso in millisecondi, oppure 0 se il valore non è valido.
 * [ENG] The timestamp expressed in milliseconds, or 0 if the value is invalid.
 */
function parseGitDateToMs(value) {
    // [ITA] Verifica che il valore in input non sia vuoto o nullo prima di tentare il parsing.
    // [ENG] Checks that the input value is not empty or null before attempting to parse it.
    if (!value) return 0;
    // [ITA] Normalizza la stringa Git da "YYYY-MM-DD HH:mm:ss +0200" in una versione ISO-8601 gestita da JavaScript.
    // [ENG] Normalizes the Git string from "YYYY-MM-DD HH:mm:ss +0200" into an ISO-8601 version handled by JavaScript.
    const normalized = normalizeGitDateToIso(value);
    // [ITA] Se la normalizzazione fallisce, restituisce 0 per mantenere la logica di ordinamento deterministica.
    // [ENG] If normalization fails, returns 0 to keep the sorting logic deterministic.
    if (!normalized) return 0;
    // [ITA] Converte la stringa normalizzata in millisecondi usando il parser nativo di JavaScript.
    // [ENG] Converts the normalized string into milliseconds using JavaScript's native parser.
    const parsed = Date.parse(normalized);
    // [ITA] Restituisce 0 se il parsing fallisce, così la logica di ordinamento resta stabile.
    // [ENG] Returns 0 if parsing fails so the sorting logic remains stable.
    return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * [ITA] Normalizza un timestamp Git o una stringa di data visibile nel formato tabella in un valore ISO-8601 compatibile con Date.parse().
 * [ENG] Normalizes a Git timestamp or a display date string into an ISO-8601 value compatible with Date.parse().
 *
 * @param {string} value
 * [ITA] Il valore da convertire, in formato Git oppure nel formato visibile della tabella.
 * [ENG] The value to convert, in Git format or in the table display format.
 *
 * @returns {string|null}
 * [ITA] La stringa normalizzata in formato ISO-8601 oppure null se il valore non è valido.
 * [ENG] The normalized ISO-8601 string or null if the value is invalid.
 */
function normalizeGitDateToIso(value) {
    // [ITA] Controlla subito se il valore in input è vuoto o nullo per evitare errori di parsing.
    // [ENG] Immediately checks whether the input value is empty or null to avoid parse errors.
    if (!value) return null;
    // [ITA] Rimuove spazi iniziali e finali per evitare problemi di formattazione con stringhe non pulite.
    // [ENG] Removes leading and trailing spaces to avoid formatting issues with unclean strings.
    const trimmed = String(value).trim();
    // [ITA] Converte il formato Git "YYYY-MM-DD HH:mm:ss +0200" nel formato ISO-8601 compatibile.
    // [ENG] Converts Git format "YYYY-MM-DD HH:mm:ss +0200" into a JavaScript-compatible ISO-8601 format.
    const gitMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}:\d{2}:\d{2})\s+([+-]\d{2})(\d{2})$/);
    // [ITA] Se il formato Git è corretto, restituisce una stringa ISO con offset orario esplicitamente formattato.
    // [ENG] If the Git format is valid, returns an ISO string with the time offset explicitly formatted.
    if (gitMatch) {
        const [, year, month, day, time, tzHour, tzMinute] = gitMatch;
        return `${year}-${month}-${day}T${time}${tzHour}:${tzMinute}`;
    }
    // [ITA] Converte anche il formato di visualizzazione italiano "DD-MM-YYYY HH:mm:ss +0200" in una stringa ISO valida.
    // [ENG] Also converts the Italian display format "DD-MM-YYYY HH:mm:ss +0200" into a valid ISO string.
    const displayMatch = trimmed.match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}:\d{2}:\d{2})\s+([+-]\d{2})(\d{2})$/);
    // [ITA] Se il formato visuale è corretto, ricostruisce il valore ISO con data, ora e offset.
    // [ENG] If the display format is correct, rebuilds the ISO value with date, time, and offset.
    if (displayMatch) {
        const [, day, month, year, time, tzHour, tzMinute] = displayMatch;
        return `${year}-${month}-${day}T${time}${tzHour}:${tzMinute}`;
    }
    // [ITA] Restituisce null se nessun pattern valido corrisponde al valore ricevuto.
    // [ENG] Returns null if no valid pattern matches the received value.
    return null;
}

/**
 * [ITA] Ordina i record dal più recente al più vecchio confrontando i timestamp in millisecondi.
 * [ENG] Sorts records from newest to oldest by comparing the timestamps in milliseconds.
 *
 * @param {{ timestampMs?: number }} a
 * [ITA] Il primo record da confrontare nel passaggio di ordinamento.
 * [ENG] The first record to compare during the sorting pass.
 *
 * @param {{ timestampMs?: number }} b
 * [ITA] Il secondo record da confrontare nel passaggio di ordinamento.
 * [ENG] The second record to compare during the sorting pass.
 *
 * @returns {number}
 * [ITA] Un valore positivo, zero o negativo in base all'ordine richiesto.
 * [ENG] A positive, zero, or negative value based on the requested order.
 */
function sortByTimestampDesc(a, b) {
    // [ITA] Confronta i timestamp in millisecondi così il record più recente viene sempre prima del più vecchio.
    // [ENG] Compares timestamps in milliseconds so the newest record always comes before the oldest one.
    return (b.timestampMs || 0) - (a.timestampMs || 0);
}

/**
 * [ITA] Rimuove il blocco H2 e la tabella già esistenti per una specifica data, così la data viene ricostruita come sezione consolidata.
 * [ENG] Removes the existing H2 block and table for a specific date so the date can be rebuilt as a consolidated section.
 *
 * @param {string} text
 * [ITA] Il contenuto completo del file attuale da cui rimuovere il blocco della data.
 * [ENG] The full file content from which the date block should be removed.
 *
 * @param {string} dayStrITA
 * [ITA] La data nel formato italiano da cercare nel blocco da eliminare.
 * [ENG] The date in Italian format to look for in the block to remove.
 *
 * @returns {string}
 * [ITA] Il testo senza il blocco esistente della data specifica.
 * [ENG] The text without the existing block for the specified date.
 */
function removeExistingDaySection(text, dayStrITA) {
    // [ITA] Escapa i caratteri speciali della data per rendere sicuro il pattern regex usato per la rimozione.
    // [ENG] Escapes special characters in the date so the regex used for removal is safe.
    const escapedDay = dayStrITA.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // [ITA] Rimuove tutti i blocchi H2 della stessa data, così una ri-esecuzione non lascia sezioni vecchie e duplicate.
    // [ENG] Removes all H2 blocks for the same date so a re-run does not leave stale duplicate sections behind.
    const pattern = new RegExp(`^## Changelog del ${escapedDay}\\s*\\n\\n[\\s\\S]*?(?=^##\\s+|\\Z)`, 'gm');
    // [ITA] Restituisce il testo senza nessun blocco già esistente per la data corrente.
    // [ENG] Returns the text without any existing block for the current date.
    return text.replace(pattern, '').trim();
}

/**
 * [ITA] Raccoglie le righe già presenti nel file per una data specifica e le trasforma in record leggibili.
 * [ENG] Collects the rows already present in the file for a specific date and transforms them into readable records.
 *
 * @param {string} text
 * [ITA] Il contenuto completo del file da analizzare.
 * [ENG] The full file content to analyze.
 *
 * @param {string} dayStrITA
 * [ITA] La data nel formato italiano per individuare il blocco di riferimento.
 * [ENG] The Italian-formatted date used to locate the reference block.
 *
 * @returns {string[]}
 * [ITA] L'array delle righe di tabella valide presenti nel blocco della data.
 * [ENG] The array of valid table rows present in the date block.
 */
function collectExistingDayRows(text, dayStrITA) {
    // [ITA] Escapa i caratteri speciali della data per costruire un pattern per il blocco H2 corretto.
    // [ENG] Escapes special characters in the date to build a safe regex for the correct H2 block.
    const escapedDay = dayStrITA.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // [ITA] Cerca tutti i blocchi H2 della stessa data nel testo esistente, non solo il primo.
    // [ENG] Searches for all H2 blocks of the same date in the existing text, not just the first one.
    const dayBlockPattern = new RegExp(`^## Changelog del ${escapedDay}\\s*\\n\\n([\\s\\S]*?)(?=^##\\s+|\\Z)`, 'gm');
    // [ITA] Recupera tutti i blocchi che corrispondono alla data specifica.
    // [ENG] Retrieves all blocks matching the specified date.
    const matches = Array.from(text.matchAll(dayBlockPattern));
    // [ITA] Se la data non è presente, restituisce una lista vuota.
    // [ENG] If the date is not present, returns an empty array.
    if (matches.length === 0) return [];
    // [ITA] Estrae tutte le righe tabellari da tutti i blocchi della data e le unisce in un unico array.
    // [ENG] Extracts all table rows from every block of the date and merges them into a single array.
    const rows = matches.flatMap(match => {
        const blockBody = match[1] || '';
        return blockBody.match(/^\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*)\s*\|$/gm) || [];
    });
    // [ITA] Esclude la riga di intestazione della tabella e la riga separatrice, perché non sono record di changelog veri e propri.
    // [ENG] Excludes the table header row and separator row because they are not real changelog records.
    return rows.filter(row => /^\|\s*\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}:\d{2}\s+[+-]\d{4}/.test(row));
}

/**
 * [ITA] Converte il testo visibile nel file in un timestamp numerico per ordinare correttamente le righe di una stessa data.
 * [ENG] Converts the visible text in the file into a numeric timestamp so rows from the same date are ordered correctly.
 *
 * @param {string} rowDateText
 * [ITA] La stringa con data e ora nel formato visibile della tabella.
 * [ENG] The date-and-time string in the table display format.
 *
 * @returns {number}
 * [ITA] Il timestamp espresso in millisecondi oppure zero se il valore non è valido.
 * [ENG] The timestamp in milliseconds or zero if the value is invalid.
 */
function parseDisplayRowToMs(rowDateText) {
    // [ITA] Verifica che la stringa rappresenti una data e un orario nel formato visibile nella tabella.
    // [ENG] Checks whether the string represents a date and time in the display format used by the table.
    const match = rowDateText.match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}:\d{2}:\d{2})\s+([+-]\d{4})$/);
    // [ITA] Se il formato non corrisponde, restituisce zero per evitare errori di parsing.
    // [ENG] If the format does not match, returns zero to avoid parse errors.
    if (!match) return 0;
    // [ITA] Estrae i componenti di data, ora e offset del fuso orario dalla stringa di visualizzazione.
    // [ENG] Extracts the date, time, and timezone offset components from the display string.
    const [, day, month, year, time, tzWithSign] = match;
    // [ITA] Ricostruisce la stringa in formato ISO-8601 per il parsing corretto del timestamp.
    // [ENG] Rebuilds the string in ISO-8601 format for correct timestamp parsing.
    const isoValue = `${year}-${month}-${day}T${time}${tzWithSign.slice(0, 3)}:${tzWithSign.slice(3)}`;
    // [ITA] Ritorna il timestamp in millisecondi per il confronto ordinato delle righe.
    // [ENG] Returns the timestamp in milliseconds for ordered comparison of rows.
    return parseGitDateToMs(isoValue);
}

/**
 * [ITA] Riscrive il frontmatter in modo canonico, forzando il formato richiesto e aggiornando la data di modifica finale.
 * [ENG] Rewrites the frontmatter in a canonical way, forcing the required format and updating the final modification date.
 *
 * @param {string} text
 * [ITA] Contenuto completo del file da normalizzare.
 * [ENG] Full file content to normalize.
 *
 * @param {string} fileName
 * [ITA] Nome del file da usare nel frontmatter.
 * [ENG] File name to use in the frontmatter.
 *
 * @returns {string}
 * [ITA] Il testo con frontmatter standardizzato in cima.
 * [ENG] The text with standardized frontmatter at the top.
 */
function normalizeFrontmatter(text, fileName) {
    // [ITA] Estrae il body senza alcun frontmatter vecchio, eventualmente presente all'inizio del file.
    // [ENG] Extracts the body without any outdated frontmatter that may already exist at the start of the file.
    const body = String(text || '').replace(/^---\n[\s\S]*?\n---\s*/m, '').replace(/^\n+/, '');
    // [ITA] Ricava una data di modifica nel formato richiesto YYYY/MM/DD HH:mm:ss.
    // [ENG] Builds the modification timestamp in the required YYYY/MM/DD HH:mm:ss format.
    const now = new Date();
    const pad2 = (n) => String(n).padStart(2, '0');
    const modifiedDate = `${now.getFullYear()}/${pad2(now.getMonth() + 1)}/${pad2(now.getDate())} ${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
    // [ITA] Costruisce sempre lo stesso frontmatter canonico, senza eccezioni.
    // [ENG] Builds the same canonical frontmatter every time, with no exceptions.
    const frontmatter = [
        '---',
        'cssclasses: changelog',
        'licenza-nota: Copyright © 2026 Emanuele Tinari under Creative Commons BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/',
        'ideatore: "Emanuele Tinari"',
        'sviluppatore: ["Emanuele Tinari", "Gemini Web App"]',
        'template: "Genera-changelog-del-vault.md"',
        `nomeFile: "${fileName}"`,
        'creato: 2026/08/29 07:58:48',
        `modificato: ${modifiedDate}`,
        '---',
        ''
    ].join('\n');
    // [ITA] Restituisce il contenuto con frontmatter standardizzato e corpo originale ripristinato sotto.
    // [ENG] Returns the content with standardized frontmatter at top and the original body preserved below it.
    return `${frontmatter}${body}`;
}

// [ITA] Importa il modulo file system nativo di Node.js per la gestione dei file.
// [ENG] Imports Node.js native file system module for file management.
const fs = require('fs');
// [ITA] Importa il modulo path di Node.js per la manipolazione dei percorsi.
// [ENG] Imports Node.js path module for path manipulation.
const path = require('path');
// [ITA] Importa la funzione execSync per eseguire comandi di shell in modo sincrono.
// [ENG] Imports execSync function to run shell commands synchronously.
const { execSync } = require('child_process');
// [ITA] Ottiene il percorso assoluto della radice della Vault di Obsidian.
// [ENG] Gets the absolute root path of the Obsidian Vault.
const vaultPath = app.vault.adapter.getBasePath();
// [ITA] Definisce il nome stabile del changelog in root della Vault, così il file si aggiorna sempre nello stesso punto e GitHub lo mostra come pagina iniziale della cartella.
// [ENG] Defines the stable changelog name in the vault root, so the file is always updated in the same place and GitHub shows it as the folder landing page.
const targetFileName = "README.md";
// [ITA] Costruisce il percorso completo del file di changelog combinando la radice e il nome file fisso.
// [ENG] Builds the full changelog file path by combining the vault root and the fixed file name.
const targetFilePath = path.join(vaultPath, targetFileName);
// [ITA] Definisce l'URL base del repository GitHub per la composizione dei link.
// [ENG] Defines base URL of GitHub repository for constructing links.
const ghBaseUrl = "https://github.com/EmanueleTinari/Obsidian/blob/main/";
// [ITA] Definisce i nomi dei file di sistema da escludere dal changelog.
// [ENG] Defines exact file names to be excluded from the changelog.
const excludedFileNames = ['.gitignore', '.gitattributes'];
// [ITA] Definisce le estensioni dei file da escludere dal changelog.
// [ENG] Defines file extensions to exclude from the changelog.
const excludedFileExtensions = ['.pdf'];
// [ITA] Inizializza la stringa per contenere l'eventuale contenuto preesistente del file.
// [ENG] Initializes string variable to store any pre-existing file content.
let existingContent = "";
// [ITA] Inizializza la variabile per la data dell'ultimo aggiornamento presente nel file.
// [ENG] Initializes variable for last update date found in file.
let lastDateStr = null;
// [ITA] Verifica se il file di changelog esiste già nella radice della Vault.
// [ENG] Checks if changelog file already exists in vault root.
if (fs.existsSync(targetFilePath)) {
    // [ITA] Legge il contenuto intero del file esistente codificato in UTF-8.
    // [ENG] Reads entire content of existing file encoded in UTF-8.
    existingContent = fs.readFileSync(targetFilePath, 'utf8');
    // [ITA] Cerca la prima intestazione H2 per estrarre la data dell'ultimo changelog scritto.
    // [ENG] Searches for first H2 header to extract date of last written changelog.
    const match = existingContent.match(/## Changelog del (\d{2}-\d{2}-\d{4})/);
    // [ITA] Verifica se la ricerca della data H2 ha prodotto un risultato valido.
    // [ENG] Checks if H2 date regex search produced a valid match.
    if (match) {
        // [ITA] Memorizza la stringa della data trovata per filtrare i commit successivi.
        // [ENG] Stores found date string to filter subsequent commits.
        lastDateStr = match[1];
    // [ITA] Chiude il blocco condizionale di match trovato.
    // [ENG] Closes conditional block for match found.
    }
// [ITA] Chiude il blocco condizionale di verifica esistenza file.
// [ENG] Closes conditional block for file existence check.
}
// [ITA] Definisce il comando Git log per estrarre la cronologia completa in ordine temporale, disattivando la quotatura dei path UTF-8.
// [ENG] Defines Git log command to extract full history in chronological order, disabling UTF-8 path quoting.
const gitCmd = 'git -c core.quotepath=false --no-pager log --date-order --reverse --name-status --date=iso --format="COMMIT|%cd|%s"';
// [ITA] Esegue il comando Git nel percorso della Vault e cattura l'output testuale.
// [ENG] Executes Git command in vault directory and captures text output.
const rawLog = execSync(gitCmd, { cwd: vaultPath, encoding: 'utf8' });
// [ITA] Suddivide l'output grezzo di Git in un array di righe di testo individuali.
// [ENG] Splits raw Git output into an array of individual text lines.
const lines = rawLog.split('\n');
// [ITA] Crea una struttura Map per raggruppare i record dei commit per singola giornata.
// [ENG] Creates a Map structure to group commit records by single day.
const commitsByDay = new Map();
// [ITA] Crea un array separato per raccogliere tutti i record e ordinarli per timestamp reale prima del raggruppamento giornaliero.
// [ENG] Creates a separate array to collect all records and sort them by real timestamp before grouping by day.
const allCommitRecords = [];
// [ITA] Inizializza la variabile di stato per il commit attualmente in elaborazione.
// [ENG] Initializes the state variable for the commit currently being processed.
let currentCommit = null;
// [ITA] Inizia il ciclo di scorrimento riga per riga di tutto il log estratto.
// [ENG] Starts loop iterating line by line through all extracted log lines.
for (let i = 0; i < lines.length; i++) {
    // [ITA] Rimuove spazi vuoti e caratteri speciali dai bordi della riga corrente.
    // [ENG] Trims whitespace and special characters from ends of current line.
    const line = lines[i].trim();
    // [ITA] Salta la riga corrente se risulta vuota.
    // [ENG] Skips current line if it is empty.
    if (!line) continue;
		// [ITA] Controlla se la riga rappresenta l'intestazione di un nuovo commit.
		// [ENG] Checks if line represents header of a new commit.
        if (line.startsWith('COMMIT|')) {
        // [ITA] Separa i blocchi della riga dell'intestazione usando il delimitatore pipe.
        // [ENG] Splits header line components using pipe delimiter.
        const parts = line.split('|');
        // [ITA] Estrae il secondo elemento che contiene la stringa data in formato ISO.
        // [ENG] Extracts second element containing ISO date string.
        const isoDateStr = parts[1];
        // [ITA] Ricompone il messaggio di commit unendo le parti successive al secondo pipe.
        // [ENG] Recombines commit message joining parts after second pipe.
        const rawMsg = parts.slice(2).join('|');
        // [ITA] Sostituisce eventuali caratteri pipe presenti nel messaggio con l'escape per Markdown.
        // [ENG] Escapes any pipe characters in message for Markdown compatibility.
        const commitMsg = rawMsg ? rawMsg.replace(/\|/g, '\\|') : '';
        // [ITA] Salva il commit memorizzando la data ISO sia per il giorno che per il timestamp completo.
        // [ENG] Saves commit storing ISO date for both the day key and full timestamp.
        currentCommit = { isoDateDay: isoDateStr.substring(0, 10), fullIsoDate: isoDateStr, msg: commitMsg };
    // [ITA] Controlla se la riga rappresenta un cambio stato file e se esiste un commit attivo.
    // [ENG] Checks if line represents file state change and an active commit exists.
    }
	// [ITA] Gestisce le righe di file aggiunti, modificati o eliminati da Git.
	// [ENG] Handles file lines added, modified, or deleted by Git execution.
    else if (currentCommit && (line.startsWith('A\t') || line.startsWith('M\t') || line.startsWith('D\t') || line.startsWith('A ') || line.startsWith('M ') || line.startsWith('D '))) {
		// [ITA] Estrae il percorso relativo del file isolandolo dal prefisso di stato Git.
		// [ENG] Extracts relative file path stripping away Git status letter prefix.
        let gitFilePath = line.substring(1).trim();
		// [ITA] Rimuove eventuali virgolette di quoting e decodifica le escape UTF-8 emesse da Git per path con caratteri speciali.
		// [ENG] Removes any surrounding quotes and decodes UTF-8 octal escapes emitted by Git for paths with special characters.
        gitFilePath = gitFilePath.replace(/^"|"$/g, '');
        gitFilePath = gitFilePath.replace(/\\([0-7]{3})/g, (_, octal) => String.fromCharCode(parseInt(octal, 8)));
		// [ITA] Estrae solo il nome del file completo di estensione dal percorso.
		// [ENG] Extracts only base filename with extension from full path string.
        const fileName = path.basename(gitFilePath);
		// [ITA] Estrae il nome della cartella padre da una stringa Git path, così anche i nomi Unicode restano integri nel label visivo.
		// [ENG] Extracts the parent folder name from the Git path string so Unicode folder names stay intact in the visible label.
        const gitPathParts = gitFilePath.split('/');
		// [ITA] Se esiste una cartella padre, la usa come contesto visivo; altrimenti lascia stringa vuota.
		// [ENG] If a parent folder exists, it is used as visual context; otherwise an empty string is returned.
        const parentFolderName = gitPathParts.length > 1 ? gitPathParts[gitPathParts.length - 2] : '';
		// [ITA] Costruisce il testo visibile con cartella padre, spazio, barra e nome file completo con estensione.
		// [ENG] Builds the visible label with parent folder, spaces, slash, and filename including extension.
        const displayFileName = `${parentFolderName} / ${fileName}`;
		// [ITA] Calcola l'estensione del file in minuscolo per confrontarla con le estensioni escluse.
		// [ENG] Computes the file extension in lowercase so it can be checked against the excluded extensions list.
        const fileExtension = path.extname(fileName).toLowerCase();
        if (excludedFileNames.includes(fileName) || excludedFileExtensions.includes(fileExtension)) {
			// [ITA] Salta l'elaborazione corrente se il file è nella blacklist.
			// [ENG] Skips current loop processing if the file is in the blacklist.
            continue;
		// [ITA] Chiude il blocco di controllo per l'esclusione dei file di sistema.
		// [ENG] Closes conditional block controlling system files blacklist check.
        }
		// [ITA] Applica l'escape del carattere pipe per non spezzare le tabelle Markdown.
		// [ENG] Applies pipe character escaping to avoid breaking Markdown tables.
        const escapedDisplayName = displayFileName.replace(/\|/g, '\\|');
		// [ITA] Codifica ogni segmento del percorso file per renderlo valido negli URL web.
		// [ENG] Encodes each file path segment to format valid web URLs.
        const encodedPath = gitFilePath.split('/').map(encodeURIComponent).join('/');
		// [ITA] Costruisce l'URL completo verso il repository remoto su GitHub.
		// [ENG] Constructs full absolute URL pointing to remote GitHub repository.
        const ghUrl = ghBaseUrl + encodedPath;
		// [ITA] Genera la sintassi del link formattato in Markdown per il file.
		// [ENG] Generates Markdown formatted link syntax structure for the file.
        const markdownLink = `[${escapedDisplayName}](${ghUrl})`;
		// [ITA] Crea l'oggetto record memorizzando la data ISO nativa e il timestamp numerico per l'ordinamento cronologico reale.
		// [ENG] Creates the record object storing the native ISO date and a numeric timestamp for real chronological ordering.
        const record = {
            isoFullDate: currentCommit.fullIsoDate,
            link: markdownLink,
            msg: currentCommit.msg,
            timestampMs: parseGitDateToMs(currentCommit.fullIsoDate)
        };
		// [ITA] Aggiunge il record all'array globale per ordinare tutti i commit in modo cronologico prima del raggruppamento finale.
		// [ENG] Adds the record to the global array so all commits can be sorted chronologically before the final grouping step.
        allCommitRecords.push(record);
	// [ITA] Chiude il blocco di gestione delle righe contenenti i file Git.
	// [ENG] Closes the block handling Git file lines.
    }
// [ITA] Chiude il ciclo for che scandisce le righe del log Git.
// [ENG] Closes the loop iterating through the Git log lines.
}
// [ITA] Ordina tutti i record globali per timestamp reale, così l'ordinamento cronologico non dipende più da stringhe o da Map.
// [ENG] Sorts all global records by real timestamp so chronological ordering no longer depends on strings or Map iteration order.
allCommitRecords.sort(sortByTimestampDesc);
// [ITA] Raggruppa i record ordinati per giorno, usando la data estratta dal timestamp completo.
// [ENG] Groups the sorted records by day, using the date extracted from the full timestamp.
for (const record of allCommitRecords) {
    // [ITA] Estrae la chiave del giorno dal timestamp completo del record.
    // [ENG] Extracts the day key from the full timestamp of the record.
    const dayKey = record.isoFullDate.substring(0, 10);
    // [ITA] Inizializza il bucket del giorno se non esiste ancora nella mappa finale.
    // [ENG] Initializes the day bucket if it does not yet exist in the final map.
    if (!commitsByDay.has(dayKey)) {
        // [ITA] Crea un array vuoto per il nuovo giorno.
        // [ENG] Creates an empty array for the new day.
        commitsByDay.set(dayKey, []);
    }
    // [ITA] Inserisce il record nel bucket del suo giorno, mantenendo l'ordine già corretto.
    // [ENG] Inserts the record into its day bucket while preserving the already-correct order.
    commitsByDay.get(dayKey).push(record);
}
// [ITA] Estrae le chiavi ISO dei giorni e le ordina in modo decrescente per data reale.
// [ENG] Extracts ISO day keys and sorts them in descending order according to the actual date value.
const sortedDays = Array.from(commitsByDay.keys()).sort((a, b) => {
    // [ITA] Converte il giorno A e il giorno B in timestamp UTC di mezzanotte per confrontarli correttamente.
    // [ENG] Converts day A and day B into midnight UTC timestamps so they can be compared correctly.
    const timeA = Date.parse(`${a}T00:00:00Z`);
    const timeB = Date.parse(`${b}T00:00:00Z`);
    // [ITA] Ordina dal giorno più recente al più vecchio.
    // [ENG] Sorts from newest day to oldest day.
    return timeB - timeA;
});
// [ITA] Inizializza la stringa per accumulare il nuovo testo Markdown generato.
// [ENG] Initializes string variable to store newly generated Markdown output.
let newMarkdown = "";
// [ITA] Inizializza la variabile per memorizzare il testo del file root se già esistente.
// [ENG] Initializes variable to store the root file content if it already exists.
let existingText = "";
// [ITA] Inizializza l'oggetto Date per il filtro incrementale della data precedente.
// [ENG] Initializes Date object for incremental filtering of previous date.
let parseLastDate = null;
// [ITA] Controlla se il file di changelog esiste già nella root della vault e, in tal caso, legge il contenuto.
// [ENG] Checks if the changelog file already exists in the vault root and, if so, reads its content.
if (fs.existsSync(targetFilePath)) {
    existingText = fs.readFileSync(targetFilePath, 'utf8');
    // [ITA] Controlla se è stata trovata una data valida nel file di changelog esistente.
    // [ENG] Checks if a valid date string was found in existing changelog file.
    if (lastDateStr) {
        // [ITA] Separa la stringa giorno-mese-anno nei tre componenti numerici.
        // [ENG] Splits day-month-year string into three numeric components.
        const p = lastDateStr.split('-');
        // [ITA] Istanzia un oggetto Date nel formato standard AAAA-MM-GG per i confronti.
        // [ENG] Instantiates Date object in standard YYYY-MM-DD format for comparisons.
        parseLastDate = new Date(`${p[2]}-${p[1]}-${p[0]}`);
    // [ITA] Chiude il blocco di conversione dell'ultima data del changelog.
    // [ENG] Closes conversion block for last changelog date.
    }
}
// [ITA] Inizializza un set di chiavi univoche per tenere traccia dei record già presenti nel changelog.
// [ENG] Initializes a set of unique keys to track records already present in the changelog.
const existingKeys = new Set();
// [ITA] Estrae tutte le righe della tabella già presenti nel file per costruire un set di duplicati da evitare.
// [ENG] Extracts every existing table row from the file to build a duplicate set to avoid.
const existingRows = existingText.match(/^\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*)\s*\|$/gm) || [];
// [ITA] Scorre tutte le righe già presenti nel file e le normalizza in una chiave unica per il confronto.
// [ENG] Iterates over all rows already present in the file and normalizes them into a unique key for comparison.
for (const row of existingRows) {
    // [ITA] Controlla se la riga esistente rispetta il formato di tabella atteso.
    // [ENG] Checks whether the existing row matches the expected table format.
    const match = row.match(/^\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*)\s*\|$/);
    // [ITA] Salta eventuali righe non valide che non rispettano lo schema atteso.
    // [ENG] Skips any invalid rows that do not match the expected schema.
    if (!match) continue;
    // [ITA] Estrae i tre campi della riga: data, link e messaggio del commit.
    // [ENG] Extracts the three fields from the row: date, link, and commit message.
    const [, dateText, linkText, msgText] = match;
    // [ITA] Ignora righe incomplete che mancano di uno o più valori essenziali.
    // [ENG] Ignores incomplete rows that are missing one or more required values.
    if (!dateText || !linkText || !msgText) continue;
    // [ITA] Ignora header e separator di tabella, perché non sono record reali del changelog.
    // [ENG] Ignores table header and separator rows because they are not real changelog entries.
    if (!/^\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}:\d{2}\s+[+-]\d{4}$/.test(dateText.trim())) continue;
    // [ITA] Normalizza la riga in una chiave unica per verificare se il record è già stato inserito.
    // [ENG] Normalizes the row into a unique key to verify whether the record is already inserted.
    existingKeys.add(`${dateText.trim()}|${linkText.trim()}|${msgText.trim()}`);
}

// [ITA] Inizializza una variabile di base per le modifiche da inserire, così il blocco esistente per una data viene sostituito prima del reinserimento finale.
// [ENG] Initializes a base variable for the changes to insert so the existing block for a date is replaced before the final re-insertion.
let insertionBaseText = existingText;
// [ITA] Avvia il ciclo sui giorni ordinati in senso decrescente.
// [ENG] Begins loop over days sorted in descending order.
for (const dayIsoStr of sortedDays) {
    // [ITA] Converte la data ISO del giorno nel formato italiano per la visualizzazione dell'intestazione H2.
    // [ENG] Converts day ISO date into Italian format for H2 header display.
    const dayStrITA = convertDateIsoToIta(dayIsoStr);
    // [ITA] Salta i giorni strettamente precedenti all'ultimo changelog registrato, ma non quello stesso giorno, per non perdere record nuovi dello stesso giorno.
    // [ENG] Skips days strictly before the last recorded changelog, but not the same day, so new records from the same day are not lost.
    if (parseLastDate) {
        // [ITA] Converte il giorno corrente in un oggetto Date per confrontarlo con l'ultima data nota.
        // [ENG] Converts the current day to a Date object so it can be compared with the last known date.
        const currentDayDate = new Date(dayIsoStr);
        // [ITA] Salta il giorno se è antecedente alla data più recente già presente nel file.
        // [ENG] Skips the day if it is older than the most recent date already present in the file.
        if (currentDayDate < parseLastDate) {
            // [ITA] Interrompe l'elaborazione del giorno corrente perché è già stato coperto dal changelog esistente.
            // [ENG] Stops processing the current day because it is already covered by the existing changelog.
            continue;
        }
    }
    // [ITA] Recupera l'array di record di commit per la giornata corrente.
    // [ENG] Retrieves the array of commit records for the current day.
    const records = commitsByDay.get(dayIsoStr);
    // [ITA] Ordina i record della singola giornata dal commit più recente a quello meno recente usando timestamp reali.
    // [ENG] Sorts the records for the single day from newest to oldest using real timestamps.
    records.sort(sortByTimestampDesc);
    // [ITA] Raccoglie le righe già presenti nel file per lo stesso giorno così possono essere unite con le nuove.
    // [ENG] Collects rows already present in the file for the same day so they can be merged with the new ones.
    const existingDayRows = collectExistingDayRows(insertionBaseText, dayStrITA);
    // [ITA] Inizializza un array per il giorno completo, unendo i record già presenti e i record nuovi.
    // [ENG] Initializes an array for the complete day by merging already-present and newly-added records.
    const mergedRows = [];
    // [ITA] Crea un set temporaneo per evitare duplicati già esistenti nel blocco del giorno.
    // [ENG] Creates a temporary set to avoid duplicates already present in the current day block.
    const seenRowKeys = new Set();
    // [ITA] Aggiunge prima le righe già presenti nel blocco esistente della stessa data per preservare i contenuti precedenti.
    // [ENG] Adds the rows already present in the existing same-day block first to preserve previous content.
    for (const row of existingDayRows) {
        // [ITA] Converte la riga del file in una tripla di valori validi per il confronto.
        // [ENG] Converts the file row into a valid three-value tuple for comparison.
        const match = row.match(/^\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*)\s*\|$/);
        // [ITA] Salta righe non valide o incompleti per mantenere la logica robusta.
        // [ENG] Skips invalid or incomplete rows to keep the logic robust.
        if (!match) continue;
        // [ITA] Estrae data, link e messaggio dalla riga esistente.
        // [ENG] Extracts date, link, and message from the existing row.
        const [, dateText, linkText, msgText] = match;
        // [ITA] Ignora righe incomplete che non hanno tutti i campi richiesti.
        // [ENG] Ignores incomplete rows that do not have all required fields.
        if (!dateText || !linkText || !msgText) continue;
        // [ITA] Ignora intestazioni e separatori di tabella, perché non sono record di commit.
        // [ENG] Ignores table headers and separators because they are not commit records.
        if (!/^\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}:\d{2}\s+[+-]\d{4}$/.test(dateText.trim())) continue;
        // [ITA] Costruisce la chiave univoca della riga per evitare duplicati.
        // [ENG] Builds the unique row key to avoid duplicates.
        const rowKey = `${dateText.trim()}|${linkText.trim()}|${msgText.trim()}`;
        // [ITA] Salta la riga se è già stata inserita dal blocco esistente o dai record nuovi.
        // [ENG] Skips the row if it has already been inserted by the existing block or by new records.
        if (seenRowKeys.has(rowKey)) continue;
        // [ITA] Registra la chiave nel set temporaneo.
        // [ENG] Registers the key in the temporary set.
        seenRowKeys.add(rowKey);
        // [ITA] Aggiunge la riga esistente al merge già in corso per il giorno corrente.
        // [ENG] Adds the existing row to the merge currently being assembled for the current day.
        mergedRows.push({
            fullDateITA: dateText.trim(),
            link: linkText.trim(),
            msg: msgText.trim(),
            timestampMs: parseDisplayRowToMs(dateText.trim())
        });
    }
    // [ITA] Aggiunge poi i record nuovi del giorno, evitando duplicati già presenti nel blocco esistente.
    // [ENG] Adds the new day records afterward, skipping duplicates already present in the existing block.
    for (const rec of records) {
        // [ITA] Costruisce la chiave del record usando data, link e messaggio del commit.
        // [ENG] Builds the record key using the date, link, and commit message.
        const recordKey = `${convertFullDateIsoToIta(rec.isoFullDate)}|${rec.link}|${rec.msg}`;
        // [ITA] Salta il record se la chiave è già stata usata nelle righe precedenti.
        // [ENG] Skips the record if its key has already been used in earlier rows.
        if (seenRowKeys.has(recordKey)) continue;
        // [ITA] Inserisce la chiave nel set temporaneo per prevenire duplicati futuri.
        // [ENG] Inserts the key into the temporary set to prevent future duplicates.
        seenRowKeys.add(recordKey);
        // [ITA] Aggiunge il nuovo record al blocco unificato della data.
        // [ENG] Adds the new record to the unified block for the date.
        mergedRows.push({
            fullDateITA: convertFullDateIsoToIta(rec.isoFullDate),
            link: rec.link,
            msg: rec.msg,
            timestampMs: rec.timestampMs
        });
    }
    // [ITA] Ordina il blocco consolidato dal record più recente al più vecchio, così la prima riga della tabella è l'ultima voce di quel giorno.
    // [ENG] Sorts the merged block from most recent record to oldest one so the first row in the table is the latest entry of that day.
    mergedRows.sort(sortByTimestampDesc);
    // [ITA] Se il giorno non ha alcuna riga dopo il merge, salta l'inserimento.
    // [ENG] If the day has no rows after merging, skips insertion.
    if (mergedRows.length === 0) continue;
    // [ITA] Rimuove il blocco H2 e la tabella già presenti per la data corrente, così il giorno viene ricostruito come singolo blocco.
    // [ENG] Removes the existing H2 block and table for the current date so the day is rebuilt as a single block.
    insertionBaseText = removeExistingDaySection(insertionBaseText, dayStrITA);
    // [ITA] Aggiunge l'intestazione H2 per il giorno consolidato.
    // [ENG] Appends the H2 heading for the consolidated day.
    newMarkdown += `## Changelog del ${dayStrITA}\n\n`;
    // [ITA] Aggiunge la riga di intestazione delle colonne della tabella.
    // [ENG] Appends the table-column header row.
    newMarkdown += `| Data e orario | Nome file | Commit |\n`;
    // [ITA] Aggiunge la riga separatrice della tabella Markdown.
    // [ENG] Appends the separator row for the Markdown table.
    newMarkdown += `| --- | --- | --- |\n`;
    // [ITA] Scorre ogni riga unita del giorno e la inserisce nella tabella in ordine cronologico decrescente.
    // [ENG] Iterates through each merged row of the day and inserts it into the table in descending chronological order.
    for (const row of mergedRows) {
        // [ITA] Formatta la riga con data italiana, link e messaggio del commit.
        // [ENG] Formats the row with Italian date, link, and commit message.
        newMarkdown += `| ${row.fullDateITA} | ${row.link} | ${row.msg} |\n`;
    }
    // [ITA] Aggiunge un a capo di separazione tra i diversi blocchi di giorni.
    // [ENG] Adds a blank line separator between different day blocks.
    newMarkdown += `\n`;
// [ITA] Chiude il ciclo sui giorni ordinati del changelog.
// [ENG] Closes the loop over sorted changelog days.
}
// [ITA] Legge il file di changelog root dal filesystem, perché la nota reale da aggiornare è sempre la stessa nella root della vault.
// [ENG] Reads the root changelog file from disk, because the real note to update is always the same one in the vault root.
if (!fs.existsSync(targetFilePath)) {
    // [ITA] Prepara il messaggio di avviso quando il file target non esiste nella root della vault.
    // [ENG] Prepares the warning message when the target file does not exist in the vault root.
    const warningMessage = `Il file "${targetFileName}" non esiste nella root della vault. Nessun aggiornamento eseguito. Crearlo manualmente prima di eseguire il template.`;
    // [ITA] Logga il messaggio di warning nel terminale per tracciare il problema in fase di debug.
    // [ENG] Logs the warning message to the terminal to trace the issue during debugging.
    console.warn(warningMessage);
    // [ITA] Mostra un avviso all'utente in Obsidian per segnalare che il file target manca.
    // [ENG] Shows a notice to the user in Obsidian to indicate that the target file is missing.
    new Notice(warningMessage);
    // [ITA] Svuota l'output del template perché il file non esiste e quindi non è possibile aggiornare nulla.
    // [ENG] Clears the template output because the file does not exist and nothing can be updated.
    tR = "";
    // [ITA] Interrompe subito l'esecuzione del template senza generare contenuti.
    // [ENG] Stops the template execution immediately without producing content.
    return;
}
// [ITA] Rilegge il file target dal filesystem per lavorare sul contenuto reale da aggiornare.
// [ENG] Reads the target file from disk again to work on the actual content to update.
existingText = fs.readFileSync(targetFilePath, 'utf8');
// [ITA] Se non ci sono nuovi commit da registrare, lascia il file invariato.
// [ENG] If there are no new commits to append, keep the file unchanged.
if (newMarkdown.trim() === "") {
    // [ITA] Restituisce il contenuto corrente senza modifiche, così il template non altera il file.
    // [ENG] Returns the current content unchanged so the template does not modify the file.
    tR = existingText;
    // [ITA] Esce subito dalla funzione perché non vi sono dati nuovi da inserire.
    // [ENG] Exits immediately because there are no new entries to insert.
    return;
}
// [ITA] Trova la posizione del primo H2 presente nella nota per inserire i nuovi aggiornamenti prima di quel blocco.
// [ENG] Finds the position of the first H2 heading in the note so the new updates are inserted before that section.
const contentForFinalUpdate = (insertionBaseText || existingText).replace(/\s*$/, '');
const firstH2Index = contentForFinalUpdate.search(/^##\s+/m);
// [ITA] Definisce il titolo principale da cercare come punto di inserimento alternativo se non esiste nessun H2.
// [ENG] Defines the main title to search for as a fallback insertion point if no H2 heading exists.
const h1Tag = "# Changelog Vault Chiesa";
// [ITA] Cerca l'H1 a riga intera, così il punto di inserimento resta corretto anche senza newline finale o con molte newline finali.
// [ENG] Searches for the H1 as a full line so the insertion point stays correct even without a trailing newline or with multiple trailing newlines.
const h1Match = contentForFinalUpdate.match(/^#\s*Changelog Vault Chiesa\s*$/m);
const h1Index = h1Match ? h1Match.index : -1;
// [ITA] Inizializza il contenuto finale con la versione già consolidata del file, così i blocchi precedenti vengono sostituiti e non duplicati.
// [ENG] Initializes the final content with the already-consolidated file version so previous blocks are replaced instead of duplicated.
let finalOutput = contentForFinalUpdate;
// [ITA] Se esiste un H2, inserisce i nuovi blocchi prima del primo H2 preservando il resto della nota.
// [ENG] If an H2 exists, inserts the new blocks before the first H2 while preserving the rest of the note.
if (firstH2Index !== -1) {
    // [ITA] Salva il contenuto precedente al primo H2 e tronca eventuali spazi finali in eccesso.
    // [ENG] Saves content before the first H2 and trims any excess trailing whitespace.
    const beforeFirstH2 = contentForFinalUpdate.substring(0, firstH2Index).trimEnd();
    // [ITA] Salva il contenuto da quel primo H2 in poi per riportarlo dopo i nuovi inserimenti, rimuovendo eventuali newline iniziali extra.
    // [ENG] Saves content from that first H2 onward to reattach it after the new insertions, removing any extra leading newlines.
    const afterFirstH2 = contentForFinalUpdate.substring(firstH2Index).replace(/^\n+/, '');
    // [ITA] Ricostruisce il file con i nuovi changelog inseriti prima del primo H2 esistente.
    // [ENG] Rebuilds the file with the new changelog inserted before the first existing H2.
    finalOutput = `${beforeFirstH2}\n\n${newMarkdown.trim()}\n\n${afterFirstH2}`;
}
// [ITA] Se non esiste nessun H2, usa l'H1 come punto di ancoraggio se presente.
// [ENG] If no H2 exists, uses the H1 as anchor point when present.
else if (h1Index !== -1) {
    // [ITA] Prepara il testo prima dell'H1 e mantiene il titolo principale in posizione iniziale, anche se l'H1 termina con zero, una o più newline.
    // [ENG] Prepares the text before the H1 and keeps the main title in its initial position, even if the H1 ends with zero, one, or multiple newlines.
    const beforeH1 = contentForFinalUpdate.substring(0, h1Index + h1Match[0].length).trimEnd();
    // [ITA] Salva il contenuto che segue l'H1 per inserirlo dopo i nuovi blocchi aggiunti, rimuovendo eventuali newline iniziali extra.
    // [ENG] Saves the content that follows the H1 to insert it after the newly added blocks, removing any extra leading newlines.
    const afterH1 = contentForFinalUpdate.substring(h1Index + h1Match[0].length).replace(/^\n+/, '');
    // [ITA] Inserisce i nuovi record subito dopo l'H1, preservando tutto il resto del file.
    // [ENG] Inserts the new records immediately after the H1 while preserving the rest of the file.
    finalOutput = `${beforeH1}\n\n${newMarkdown.trim()}\n\n${afterH1}`;
}
// [ITA] Se nessun punto di inserimento strutturato esiste, inserisce i nuovi record all'inizio del file.
// [ENG] If no structured insertion point exists, inserts the new records at the beginning of the file.
else {
    // [ITA] Aggiunge i nuovi changelog prima del contenuto esistente, preservando il resto del file.
    // [ENG] Adds the new changelog before the existing content while preserving the rest of the file.
    finalOutput = `${newMarkdown.trim()}\n\n${contentForFinalUpdate.trim()}`;
}
// [ITA] Normalizza il frontmatter finale in modo da rispettare sempre il formato richiesto, indipendentemente da ciò che c'era prima.
// [ENG] Normalizes the final frontmatter so it always respects the required format, regardless of what was there before.
const finalContentWithCanonicalFrontmatter = normalizeFrontmatter(finalOutput, targetFileName);
// [ITA] Scrive il contenuto finale sul file di changelog, aggiornando la nota con i nuovi record e il frontmatter canonico.
// [ENG] Writes the final content to the changelog file, updating the note with the new records and the canonical frontmatter.
fs.writeFileSync(targetFilePath, finalContentWithCanonicalFrontmatter, 'utf8');
// [ITA] Assegna l'output finale con frontmatter standardizzato al risultato del template da restituire all'editor.
// [ENG] Assigns the final output with standardized frontmatter to the template result to return it to the editor.
tR = finalContentWithCanonicalFrontmatter;

-%>
