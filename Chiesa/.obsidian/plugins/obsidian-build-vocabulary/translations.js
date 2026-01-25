/**
*******************************************************************************
***                                                                         ***
***                          ISTRUZIONI / INSTRUCTIONS                      ***
***                                                                         ***
***  Per aggiungere una nuova lingua:                                       ***
***  1. Crea una nuova costante (es. const es = { ... }).                   ***
***  2. Aggiungi il relativo 'case' nella funzione getTranslations.         ***
***                                                                         ***
***  To add a new language:                                                 ***
***  1. Create a new constant (e.g., const es = { ... }).                   ***
***  2. Add the corresponding 'case' to the getTranslations function.        ***
***                                                                         ***
*******************************************************************************
*/

/**
*************************************
***                               ***
***          Traduzioni:          ***
***          Translations:        ***
***                               ***
*************************************
*/

// LANG = en (INGLESE)
// LANG = en (ENGLISH)
const en = {
    FOLDER_CREATED: "✅ Created folder:\n",
    CALL_ERROR: "❌ Error:\n",
    FOLDER_ERROR: "❌ Error.\nFailed to create folder:\n",
    CHECK_CONSOLE: "\n⚠️ Check console for details.\n",
    FILE_WRITE_ERROR: "❌ Error writing to file:\n",
    JSON_WRITE_ERROR: "❌ Error writing to JSON file:\n",
    CLEAR_ERROR: "❌ Error clearing markdown files from:\n",
    PLUGIN_LOADING: "Loading Build Vocabulary Plugin...",
    PLUGIN_UNLOADING: "Unloading Build Vocabulary Plugin.",
    COMMAND_NAME: "Build vocabulary (IntraText style)",
    RIBBON_TOOLTIP: "Build vocabulary",
    NOTICE_ENABLED: "✅ Build Vocabulary Plugin enabled!",
    NOTICE_DISABLED: "❌ Build Vocabulary Plugin disabled.",
    BUILD_START: "⚙️ Vocabulary building started...",
    CRITICAL_FOLDER_ERROR: "❌ CRITICAL ERROR: Cannot access or create the folder:\n",
    PROCESS_ABORTED: "\nProcess aborted.",
    REMOVING_DELETED: "🗑️ Removing ",
    FILES_FROM_VOCABULARY: " deleted files from vocabulary...",
    ANALYZING_FILES: "🔄 Analyzing ",
    NEW_MODIFIED_FILES: " new or modified files...",
    ALREADY_UPDATED: "👍 Vocabulary is already up to date.",
    SAVING_DATABASE: "✍️ Saving database and writing files...",
    OCCURRENCES_FOUND: "Found occurrences: ",
    OCCURRENCE: "Occurrence ",
    CONTEXT_NOT_FOUND: "Context not found for **",
    IN_FILE: "** in file.",
    BUILD_COMPLETE: "✅ Vocabulary construction completed in ",
    SECONDS: " seconds!",
    SETTINGS_TITLE: "Build Vocabulary Settings",
    BASIC_SETTINGS: "Basic Settings",
    RIBBON_ICON_NAME: "Add icon to the sidebar",
    RIBBON_ICON_DESC: "If active, shows the plugin icon in the sidebar.<br>You must disable and re-enable the plugin for changes to take effect.<br>If the icon is not used, run the vocabulary construction from the command palette (CTRL + P or CMD + P) by searching for '<strong>Build vocabulary</strong>'.",
    FILES_FOLDERS_FILTERS: "File and Folder Filters",
    OUTPUT_FOLDER_NAME: "Vocabulary output folder",
    OUTPUT_FOLDER_DESC: "The folder where vocabulary files (.md) and databases (.json) will be saved.",
    ROOT_VAULT: "(Vault Root)",
    CHOOSE_BUTTON: "Choose",
    START_FOLDERS_NAME: "Folders to include (Start Folders)",
    START_FOLDERS_DESC: "Select the folders to include in the scan. If left empty, the entire vault will be scanned (respecting exclusions).",
    CHOOSE_FOLDERS_BTN: "Choose folders",
    MODAL_TITLE_INCLUDE: "Select folders to INCLUDE",
    INCLUDED_FOLDERS_LABEL: "Included folders: ",
    ALL_VAULT: "Entire vault",
    EXCLUSION_FOLDERS_NAME: "Folders to exclude",
    EXCLUSION_FOLDERS_DESC: "All files and subfolders within these folders will be ignored.<br>This filter takes priority over '<strong>Folders to include</strong>'.",
    MODAL_TITLE_EXCLUDE: "Select folders to EXCLUDE",
    EXCLUDED_FOLDERS_LABEL: "Excluded folders: ",
    NONE: "None",
    EXCLUSION_PATTERNS_NAME: "File/Folder exclusion patterns",
    EXCLUSION_PATTERNS_DESC: "Comma-separated list of patterns.<br>Files or folders matching any of these patterns will be ignored.<br>Use * as a wildcard (e.g., _*, *.template.md, Diary*).",
    VOCABULARY_FILTERS: "Vocabulary Filters",
    MIN_WORD_LENGTH_NAME: "Minimum word length",
    MIN_WORD_LENGTH_DESC: "Words shorter than this value will be ignored.",
    INC_DEF_ART_NAME: "Include definite articles",
    INC_DEF_ART_DESC: "If disabled, excludes words like 'the', 'il', 'la', etc.",
    INC_IND_ART_NAME: "Include indefinite articles",
    INC_IND_ART_DESC: "If disabled, excludes words like 'a', 'an', 'un', 'una', etc.",
    INC_SIM_PREP_NAME: "Include simple prepositions",
    INC_SIM_PREP_DESC: "If disabled, excludes words like 'of', 'to', 'di', 'a', 'da', etc.",
    INC_ART_PREP_NAME: "Include prepositional articles",
    INC_ART_PREP_DESC: "If disabled, excludes words like 'of the', 'del', 'nella', 'sugli', etc.",
    SELECT_OUTPUT_TITLE: "Select output folder",
    SELECT_FOLDER_BTN: "Select",
    SAVE_BUTTON: "Save"
};

// LANG = it (ITALIANO)
// LANG = it (ITALIAN)
const it = {
    FOLDER_CREATED: "✅ Cartella creata:\n",
    CALL_ERROR: "❌ Errore:\n",
    FOLDER_ERROR: "❌ Errore!\nImpossibile creare la cartella:\n",
    CHECK_CONSOLE: "\n⚠️ Controlla la console per i dettagli.\n",
    FILE_WRITE_ERROR: "❌ Errore durante la scrittura del file:\n",
    JSON_WRITE_ERROR: "❌ Errore durante la scrittura del file JSON:\n",
    CLEAR_ERROR: "❌ Errore durante la pulizia dei file markdown da:\n",
    PLUGIN_LOADING: "Caricamento Plugin Build Vocabulary...",
    PLUGIN_UNLOADING: "Disattivazione Plugin Build Vocabulary.",
    COMMAND_NAME: "Costruisci vocabolario (stile IntraText)",
    RIBBON_TOOLTIP: "Costruisci vocabolario",
    NOTICE_ENABLED: "✅ Plugin Build Vocabulary attivato!",
    NOTICE_DISABLED: "❌ Plugin Build Vocabulary disattivato.",
    BUILD_START: "⚙️ Inizio costruzione vocabolario...",
    CRITICAL_FOLDER_ERROR: "❌ ERRORE CRITICO: Impossibile creare o accedere alla cartella:\n",
    PROCESS_ABORTED: "\nProcesso interrotto.",
    REMOVING_DELETED: "🗑️ Rimozione di ",
    FILES_FROM_VOCABULARY: " file cancellati dal vocabolario...",
    ANALYZING_FILES: "🔄 Analisi di ",
    NEW_MODIFIED_FILES: " file nuovi o modificati...",
    ALREADY_UPDATED: "👍 Il vocabolario è già aggiornato.",
    SAVING_DATABASE: "✍️ Salvataggio database e scrittura file in corso...",
    OCCURRENCES_FOUND: "Occorrenze trovate: ",
    OCCURRENCE: "Occorrenza ",
    CONTEXT_NOT_FOUND: "Contesto non trovato per **",
    IN_FILE: "** nel file.",
    BUILD_COMPLETE: "✅ Costruzione vocabolario completata in ",
    SECONDS: " secondi!",
    SETTINGS_TITLE: "Impostazioni Build Vocabulary",
    BASIC_SETTINGS: "Impostazioni di base",
    RIBBON_ICON_NAME: "Aggiungi l’icona alla barra laterale",
    RIBBON_ICON_DESC: "Se attivo, mostra l’icona del plugin nella barra laterale.<br>È necessario disattivare e riattivare il plugin per rendere effettiva la modifica.<br>Se l’icona non viene utilizzata, per eseguire la costruzione del vocabolario eseguire il Plugin dal riquadro comandi (CTRL + P o CMD + P) cercandolo con “<strong>Costruisci vocabolario</strong>”.",
    FILES_FOLDERS_FILTERS: "Filtri File e Cartelle",
    OUTPUT_FOLDER_NAME: "Cartella di output del vocabolario",
    OUTPUT_FOLDER_DESC: "La cartella dove verranno salvati i file del vocabolario (.md) e i database (.json).",
    ROOT_VAULT: "(Radice del Vault)",
    CHOOSE_BUTTON: "Scegli",
    START_FOLDERS_NAME: "Cartelle da includere (Start Folders)",
    START_FOLDERS_DESC: "Seleziona le cartelle da includere nella scansione. Se lasciato vuoto, verrà scansionato l’intero vault (rispettando le esclusioni).",
    CHOOSE_FOLDERS_BTN: "Scegli cartelle",
    MODAL_TITLE_INCLUDE: "Seleziona cartelle da INCLUDERE",
    INCLUDED_FOLDERS_LABEL: "Cartelle incluse: ",
    ALL_VAULT: "Tutto il vault",
    EXCLUSION_FOLDERS_NAME: "Cartelle da escludere",
    EXCLUSION_FOLDERS_DESC: "Tutti i file e le sottocartelle all'interno di queste cartelle verranno ignorati.<br>Questo filtro ha la priorità su “<strong>Cartelle da includere</strong>”.",
    MODAL_TITLE_EXCLUDE: "Seleziona cartelle da ESCLUDERE",
    EXCLUDED_FOLDERS_LABEL: "Cartelle escluse: ",
    NONE: "Nessuna",
    EXCLUSION_PATTERNS_NAME: "Pattern di esclusione file/cartelle",
    EXCLUSION_PATTERNS_DESC: "Lista di pattern separati da virgola.<br>I file o le cartelle che corrispondono a uno di questi pattern verranno ignorati.<br>Usa * come jolly (es. _*, *.template.md, Diario*).",
    VOCABULARY_FILTERS: "Filtri del Vocabolario",
    MIN_WORD_LENGTH_NAME: "Lunghezza minima della parola",
    MIN_WORD_LENGTH_DESC: "Le parole più corte di questo valore verranno ignorate.",
    INC_DEF_ART_NAME: "Includi articoli determinativi",
    INC_DEF_ART_DESC: "Se disattivato, esclude parole come 'il', 'lo', 'la', ecc.",
    INC_IND_ART_NAME: "Includi articoli indeterminativi",
    INC_IND_ART_DESC: "Se disattivato, esclude parole come 'un', 'uno', 'una'.",
    INC_SIM_PREP_NAME: "Includi preposizioni semplici",
    INC_SIM_PREP_DESC: "Se disattivato, esclude parole come 'di', 'a', 'da', ecc.",
    INC_ART_PREP_NAME: "Includi preposizioni articolate",
    INC_ART_PREP_DESC: "Se disattivato, esclude parole come 'del', 'nella', 'sugli', ecc.",
    SELECT_OUTPUT_TITLE: "Seleziona la cartella di output",
    SELECT_FOLDER_BTN: "Seleziona",
    SAVE_BUTTON: "Salva"
};

// Aggiungere ulteriori lingue (traduzioni) qui sotto seguendo lo stesso formato.
// Add additional languages (translations) below following the same format.
// LANG = xx (XXXXX)
// LANG = xx (XXXXX)
// const xx = {...};

/**
 * Restituisce le traduzioni in base alla lingua di Obsidian.
 * Returns translations based on Obsidian's language.
 * 
 * @param {string} lang
 * Il codice della lingua (es. 'it', 'en', 'de').
 * The language code (e.g., 'it', 'en', 'de').
 * 
 * @returns {Object}
 * L'oggetto contenente tutte le stringhe nella lingua selezionata.
 * The object containing all strings in the selected language.
 * 
 */
export function getTranslations(lang) {
    // Inizia il controllo della lingua tramite lo switch.
    // Starts the language check using a switch statement.
    switch (lang) {
        // Se la lingua rilevata è l'Italiano, restituisce il blocco 'it'.
        // If the detected language is Italian, returns the 'it' block.
        case 'it':
            return it;
        // Se la lingua rilevata è xxxxx, restituisce il blocco 'xx'.
        // If the detected language is xxxxx, returns the 'xx' block.
        //case 'xx': 
        //return xx;
        // Esempio per nuove lingue (nell'esempio, Spagnolo):
        // Example for new languages (in the example, Spanish):
        /*
        case 'es':
            return es;
        */
        // Se la lingua non è supportata, restituisce l'Inglese come fallback.
        // If the language is not supported, returns English as a fallback.
        default:
            return en;
    }
}
