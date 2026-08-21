---
licenza-nota: Copyright © 2026 Emanuele Tinari under Creative Commons BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
nomeFile: Genera-report-stato-Plugin.md
creato: 2026/08/16 19:47:06
modificato: 2026/08/21 15:57:46
---

<%*
/*
===============================================================================
📌 GENERA REPORT STATO PLUGIN (OBSIDIAN SCRIPT PER TEMPLATER)
===============================================================================

ITA
--------
DESCRIZIONE:
Questo script per il plugin Templater genera un report completo in formato Markdown
nella radice (root) della Vault di Obsidian, mostrando lo stato aggiornato di tutti
i plugin installati.

FUNZIONALITÀ PRINCIPALI:
1. Gestione Smart del Frontmatter (Previene Duplicati):
   Legge il file appena creato per rilevare ed estrarre eventuali proprietà di data
   (`creato`, `modificato`) inserite automaticamente da altri plugin (es. Linter,
   Update Time on Edit). Ricostruisce poi un unico blocco YAML pulito contenente anche
   il campo `nomeFile`.
2. Estrazione Plugin Core (Ufficiali) & Community (Terze Parti):
   Interroga le API interne di Obsidian (`app.internalPlugins` e `app.plugins`) per
   elencare tutti i plugin presenti nella vault.
3. Formattazione Tabellare:
   Genera due tabelle Markdown distinte indicando:
   - Stato di attivazione (✅ Abilitato / ❌ Disabilitato)
   - Nome del plugin (in **grassetto** se attivo, ed **==evidenziato==** se essenziale per il Vault)
   - ID univoco del plugin
   - Versione installata (solo per i plugin Community)
4. Ridenominazione e Posizionamento Automatico:
   Assegna al file un nome univoco basato su data e ora
   (es. YYYY-MM-DD_HH-mm-ss-Report-Plugin-abilitati.md) e lo sposta
   automaticamente nella radice della Vault (`/`).

REQUISITI:
- Obsidian MD
- Community Plugin: Templater (con esecuzione di script JavaScript abilitata)


===============================================================================

ENG
-------
DESCRIPTION:
This Templater script generates a comprehensive Markdown report in the root
folder of your Obsidian Vault, detailing the current status of all installed plugins.

KEY FEATURES:
1. Smart Frontmatter Parsing (Prevents Duplication):
   Reads the newly created note to extract existing metadata keys (`creato`, `modificato`)
   injected by auto-formatting plugins (e.g., Linter, Update Time on Edit). It then
   rebuilds a single, clean YAML frontmatter block that includes the `nomeFile` property.
2. Core & Community Plugin Extraction:
   Queries Obsidian's internal APIs (`app.internalPlugins` and `app.plugins`) to retrieve
   both official (Core) and third-party (Community) plugins.
3. Markdown Table Output:
   Renders two formatted tables displaying:
   - Activation status (✅ Enabled / ❌ Disabled)
   - Plugin Name (**bolded** if active, and **==highlighted==** if essential for the Vault)
   - Unique Plugin ID
   - Installed Version (for Community plugins)
4. Automatic Renaming & Location Handling:
   Generates a unique timestamped filename
   (e.g., YYYY-MM-DD_HH-mm-ss-Report-Plugin-abilitati.md) and automatically
   moves the newly created file to the vault's root directory (`/`).

REQUIREMENTS:
- Obsidian MD
- Community Plugin: Templater (with User JavaScript execution enabled)


===============================================================================
*/

// [ITA] Definisce l'insieme degli ID dei plugin essenziali per il Vault 'Chiesa'.
// [ENG] Defines the Set of IDs for the essential plugins for the 'Chiesa' Vault.
const essentialPlugins = new Set([
	// Abbreviations and Acronyms
	"abbreviations-mark",
	// Custom Classes
    "custom-classes",
    // Dataview
    "dataview",
    // Homepage
    "homepage",
    // Templater
    "templater-obsidian"
]);
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
// [ITA] Accede all'oggetto interno di Obsidian contenente tutti i plugin Core ufficiali.
// [ENG] Accesses Obsidian's internal object containing all official Core plugins.
const corePlugins = app.internalPlugins?.plugins || {};
// [ITA] Inizializza un array vuoto per memorizzare le righe formattate della tabella dei plugin Core.
// [ENG] Initializes an empty array to store the formatted table rows for Core plugins.
let coreRows = [];
// [ITA] Estrae le chiavi dell'oggetto dei plugin Core e avvia l'ordinamento alfabetico basato sui loro nomi.
// [ENG] Extracts the keys of the Core plugins object and starts sorting them alphabetically based on their names.
const sortedCoreKeys = Object.keys(corePlugins).sort((a, b) => {
	// [ITA] Recupera il nome visualizzato o l'istanza del primo plugin da confrontare, usando l'ID come ripiego.
	// [ENG] Retrieves the display name or instance name of the first plugin to compare, defaulting to the ID.
	const nameA = corePlugins[a]?.display || corePlugins[a]?.instance?.name || a;
	// [ITA] Recupera il nome visualizzato o l'istanza del secondo plugin da confrontare, usando l'ID come ripiego.
	// [ENG] Retrieves the display name or instance name of the second plugin to compare, defaulting to the ID.
	const nameB = corePlugins[b]?.display || corePlugins[b]?.instance?.name || b;
	// [ITA] Confronta alfabeticamente i due nomi tenendo conto delle regole della lingua corrente.
	// [ENG] Alphabetically compares the two names considering current locale rules.
	return nameA.localeCompare(nameB);
// [ITA] Chiude la funzione di ordinamento dell'array di chiavi dei plugin Core.
// [ENG] Closes the sorting function for the Core plugin keys array.
});
// [ITA] Avvia un ciclo for...of per iterare su ciascun ID di plugin Core ordinato.
// [ENG] Starts a for...of loop to iterate through each sorted Core plugin ID.
for (const id of sortedCoreKeys) {
	// [ITA] Ottiene l'oggetto del plugin corrispondente all'ID corrente dall'elenco dei plugin Core.
	// [ENG] Retrieves the plugin object corresponding to the current ID from the Core plugins list.
	const plugin = corePlugins[id];
	// [ITA] Verifica se l'oggetto del plugin non esiste o è nullo.
    // [ENG] Checks if the plugin object does not exist or is null.
    if (!plugin) {
        // [ITA] Salta l'iterazione corrente e passa al plugin successivo se l'oggetto non è valido.
        // [ENG] Skips the current iteration and moves to the next plugin if the object is invalid.
        continue;
    // [ITA] Chiude il blocco condizionale di verifica di validità del plugin.
    // [ENG] Closes the plugin validity check conditional block.
    }
	// [ITA] Verifica se il plugin corrente è attualmente abilitato leggendone la proprietà 'enabled'.
	// [ENG] Checks if the current plugin is enabled by reading its 'enabled' property.
	const isEnabled = plugin.enabled;
	// [ITA] Determina il nome leggibile del plugin, dando priorità al nome visualizzato rispetto all'ID.
	// [ENG] Determines the human-readable name of the plugin, prioritizing the display name over the ID.
	const rawName = plugin.display || plugin.instance?.name || id;
	// [ITA] Applica la formattazione in grassetto al nome se il plugin è attivo, altrimenti mantiene il testo normale.
	// [ENG] Formats the name in bold if the plugin is active, otherwise keeps plain text.
	const name = isEnabled ? `**${rawName}**` : rawName;
	// [ITA] Assegna l'emoji spunta verde se il plugin è attivo o la crocetta rossa se è disattivato.
	// [ENG] Assigns a green checkmark emoji if active or a red cross emoji if disabled.
	const status = isEnabled ? "✅" : "❌";
	// [ITA] Aggiunge la riga formattata in sintassi tabella Markdown all'array delle righe Core.
	// [ENG] Appends the formatted Markdown table row to the Core rows array.
	coreRows.push(`| ${status} | ${name} | \`${id}\` |`);
// [ITA] Chiude il ciclo di iterazione dei plugin Core.
// [ENG] Closes the Core plugins iteration loop.
}
// [ITA] Recupera l'oggetto dei manifest di tutti i plugin Community installati, usando un oggetto vuoto come ripiego.
// [ENG] Retrieves the manifests object of all installed Community plugins, defaulting to an empty object.
const communityManifests = app.plugins?.manifests || {};
// [ITA] Recupera l'insieme (Set) dei plugin Community attualmente abilitati in Obsidian.
// [ENG] Retrieves the Set of currently enabled Community plugins in Obsidian.
const enabledCommunity = app.plugins?.enabledPlugins || new Set();
// [ITA] Inizializza un array vuoto per raccogliere le righe della tabella dei plugin Community.
// [ENG] Initializes an empty array to store the table rows for Community plugins.
let communityRows = [];
// [ITA] Estrae le chiavi (ID) dei plugin Community e avvia l'ordinamento alfabetico basato sul loro nome.
// [ENG] Extracts Community plugin keys (IDs) and starts sorting them alphabetically by name.
const sortedCommunityKeys = Object.keys(communityManifests).sort((a, b) => {
	// [ITA] Ottiene il nome del primo plugin Community da confrontare, usando l'ID come ripiego.
	// [ENG] Gets the name of the first Community plugin to compare, defaulting to its ID.
	const nameA = communityManifests[a]?.name || a;
	// [ITA] Ottiene il nome del secondo plugin Community da confrontare, usando l'ID come ripiego.
	// [ENG] Gets the name of the second Community plugin to compare, defaulting to its ID.
	const nameB = communityManifests[b]?.name || b;
	// [ITA] Confronta alfabeticamente i nomi dei due plugin considerando le regole della lingua corrente.
	// [ENG] Alphabetically compares the two plugin names considering current locale rules.
	return nameA.localeCompare(nameB);
// [ITA] Chiude la funzione di ordinamento dell'array di chiavi dei plugin Community.
// [ENG] Closes the sorting function for the Community plugin keys array.
});
// [ITA] Avvia un ciclo for...of per iterare su ciascun ID di plugin Community nell'ordine alfabetico stabilito.
// [ENG] Starts a for...of loop to iterate through each Community plugin ID in sorted alphabetical order.
for (const id of sortedCommunityKeys) {
	// [ITA] Recupera il manifest contenente i metadati del plugin Community corrispondente all'ID corrente.
	// [ENG] Retrieves the manifest containing metadata for the Community plugin matching the current ID.
	const manifest = communityManifests[id];
	// [ITA] Salta l'iterazione corrente se il manifest del plugin non è presente o valido.
    // [ENG] Skips the current iteration if the plugin manifest is missing or invalid.
    if (!manifest) continue;
	// [ITA] Verifica se l'ID del plugin è presente nell'insieme dei plugin Community abilitati.
	// [ENG] Checks if the plugin ID exists within the Set of enabled Community plugins.
	const isEnabled = (typeof enabledCommunity.has === 'function') ? enabledCommunity.has(id) : Object.values(enabledCommunity).includes(id);
	// [ITA] Estrae il nome dal manifest oppure impiega l'ID come valore predefinito.
	// [ENG] Extracts the name from the manifest or uses the ID as a fallback.
	const rawName = manifest.name || id;
	// [ITA] Imposta il testo in grassetto se abilitato, e aggiunge '==' SOLO se il plugin è presente tra gli 'essenziali', altrimenti lascia il testo semplice.
	// [ENG] Formats text in bold if enabled, and adds '==' ONLY if the plugin is among the 'essential' ones, otherwise leaves plain text.
	let formattedName = isEnabled ? `**${rawName}**` : rawName;
	// [ITA] Verifica se l'ID del plugin rientra nel Set dei plugin definiti come essenziali.
	// [ENG] Checks if the plugin ID is included in the Set of defined essential plugins.
	if (essentialPlugins.has(id)) {
		// [ITA] Applica l'evidenziazione Markdown (==) al nome formattato del plugin.
		// [ENG] Applies Markdown highlighting (==) to the formatted plugin name.
		formattedName = `==${formattedName}==`;
	// [ITA] Chiude il blocco condizionale di verifica del plugin essenziale.
	// [ENG] Closes the essential plugin check conditional block.
	}
	// [ITA] Legge la versione del plugin dal manifest oppure imposta "N/D" se non disponibile.
	// [ENG] Reads the plugin version from the manifest or sets "N/D" if unavailable.
	const version = manifest.version || "N/D";
	// [ITA] Assegna l'emoji della spunta verde per lo stato abilitato o la crocetta rossa per disabilitato.
	// [ENG] Assigns a green checkmark emoji for enabled status or a red cross for disabled.
	const status = isEnabled ? "✅" : "❌";
	// [ITA] Aggiunge la riga formattata in sintassi tabella Markdown all'array delle righe dei plugin Community.
	// [ENG] Appends the formatted Markdown table row to the Community rows array.
	communityRows.push(`| ${status} | ${formattedName} | \`${id}\` | \`${version}\` |`);
// [ITA] Chiude il ciclo di iterazione dei plugin Community.
// [ENG] Closes the Community plugins iteration loop.
}
// [ITA] Genera una stringa con data e ora correnti nel formato YYYY-MM-DD_HH-mm-ss per rendere il nome del file unico.
// [ENG] Generates a timestamp string with current date and time in YYYY-MM-DD_HH-mm-ss format to ensure a unique filename.
const timestamp = tp.date.now("YYYY-MM-DD_HH-mm-ss");
// [ITA] Ottiene l'anno corrente nel formato YYYY.
// [ENG] Gets the current year in YYYY format.
const yearReport = tp.date.now("YYYY");
// [ITA] Costruisce la stringa con il nome definitivo del file combinando il timestamp generato con il prefisso descrittivo.
// [ENG] Constructs the final filename string by combining the generated timestamp with the descriptive prefix.
const newFileName = `${timestamp}-Report-stato-Plugin`;
// [ITA] Inizia la definizione della stringa multilinea 'finalContent' aprendo il blocco Frontmatter YAML con i tre trattini.
// [ENG] Begins defining the multiline string 'finalContent' by opening the YAML Frontmatter block with three dashes.
const finalContent = `---
licenza-nota: "Copyright © ${yearReport} Emanuele Tinari under Creative Commons BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/"
nomeFile: "${newFileName}.md"
creato: ${creatoVal}
modificato: ${modificatoVal}
---

# Report stato Plugin

*Generato il*: ${nowFormattedITA}

## 🔌 Plugin Core (Ufficiali)


==**ITA:**==  I plugin seguenti, che fanno parte del 'Core' di Obsidian, sono da me abilitati o disabilitati.
⚙️ Le impostazioni di ciascun plugin 'Core' sono già preconfigurate per il corretto funzionamento del Vault.
Per qualsiasi dubbio o per richiedere spiegazioni su configurazioni specifiche, contattatemi in privato.


**ENG:**  *The following plugins, which are part of Obsidian's 'Core', are enabled or disabled by me.*
⚙️ *Settings for each 'Core' plugin are already preconfigured for the proper functioning of the Vault.*
*For any questions or to request explanations regarding specific configurations, please contact me privately.*


| Abilitato? | Nome Plugin | ID |
| :---: | :--- | :--- |
${coreRows.join("\n")}

***

## 🧩 Plugin Community (Terze Parti)


==**ITA:**==  I plugin seguenti della 'Comunità' sono da me abilitati o disabilitati.
Evidenziati (\`\=\=\`) ci sono quelli attivi ed essenziali alla corretta visualizzazione dei file .md o all'esecuzione degli script presenti nel Vault 'Chiesa'.
⚙️ Le impostazioni di ciascun plugin della 'Comunità' sono già preconfigurate per il corretto funzionamento del Vault.
Per qualsiasi dubbio o per richiedere spiegazioni su configurazioni specifiche, contattatemi in privato.


**ENG:**  *The following 'Community' plugins are enabled or disabled by me.
Highlighted (\`\=\=\`) are those active and essential for the correct display of .md files or the execution of scripts within the 'Chiesa' Vault.*
⚙️ *Settings for each 'Community' plugin are already preconfigured for the proper functioning of the Vault.*
*For any questions or to request explanations regarding specific configurations, please contact me privately.*


| Abilitato? | Nome Plugin | ID | Versione |
| :---: | :--- | :--- | :--- |
${communityRows.join("\n")}
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
