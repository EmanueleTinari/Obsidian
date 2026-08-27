<#
.SYNOPSIS
    [ITA]> Script di aggiornamento massivo per Frontmatter YAML in file Markdown.
    [ENG]> Bulk update script for YAML Frontmatter in Markdown files.
.DESCRIPTION
    [ITA]> Lo script scansiona ricorsivamente la cartella in cui si trova e tutte le sottocartelle cercando file .md. Analizza le prime 10 righe di ogni file alla ricerca della chiave "progr-doc:". Se il valore trovato è maggiore o uguale a una soglia stabilita (Y), lo script somma un valore (K).
    [ENG]> The script recursively scans its current folder and all subfolders looking for .md files. It analyzes the first 10 rows of each file searching for the "progr-doc:" key. If the found value is greater than or equal to a set threshold (Y), the script adds a value (K).
.PARAMETER Y
    [ITA]> (Soglia) Il valore numerico "limite". Tutti i file con un 'progr-doc' uguale o superiore a questo numero verranno modificati. I file con valori inferiori saranno ignorati.
    [ENG]> (Threshold) The "limit" numeric value. All files with a 'progr-doc' equal to or higher than this number will be modified. Files with lower values will be ignored.
.PARAMETER K
    [ITA]> (Incremento/Decremento) Il numero da sommare al valore trovato. Usare numeri POSITIVI (es. 1, 5, 10) per aumentare la numerazione. Usare numeri NEGATIVI (es. -1, -5) per scalare la numerazione all'indietro (funzione Undo).
    [ENG]> (Increment/Decrement) The number to be added to the found value. Use POSITIVE numbers (e.g., 1, 5, 10) to increase the numbering. Use NEGATIVE numbers (e.g., -1, -5) to scale the numbering backward (Undo function).
.EXAMPLE
    [ITA]> Se progr-doc è 199, Y è 199 e K è 1  => Il nuovo valore sarà 200.
    [ENG]> If progr-doc is 199, Y is 199 and K is 1  => The new value will be 200.
.EXAMPLE
    [ITA]> Se progr-doc è 199, Y è 199 e K è -1 => Il nuovo valore sarà 198.
    [ENG]> If progr-doc is 199, Y is 199 and K is -1 => The new value will be 198.
.NOTES
    [ITA]> - Lo script agisce solo sulle prime 10 righe (ottimizzazione per file grandi).
    [ITA]> - Mantiene la formattazione originale del frontmatter.
    [ITA]> - Mostra un log colorato in colonne per monitorare le modifiche in tempo reale.
    [ENG]> - The script only acts on the first 10 rows (optimization for large files).
    [ENG]> - Preserves the original layout of the frontmatter.
    [ENG]> - Displays a colored column log to monitor modifications in real time.

.AUTHOR (AUTORE)
"Emanuele Tinari"

.DEVELOPER (SVILUPPATORE)
"Emanuele Tinari", "Gemini Web App"

.CREATED (CREATO)
2026/05/08 16:10:59

.MODIFIED (MODIFICATO)
2026/08/27 09:56:03
#>

# -------------------------------
# [ITA]> Configurazione fissa che stabilisce il percorso di partenza impostandolo sulla cartella fisica in cui risiede lo script.
# [ENG]> Fixed setup that establishes the starting path by setting it to the physical folder where the script resides.
$TargetFolder = $PSScriptRoot
# [ITA]> **DATO DA MODIFICARE (SOGLIA)**: Imposta il limite numerico. Modifica solo i file con "progr-doc" maggiore o uguale a questo valore.
# [ENG]> **DATA TO MODIFY (THRESHOLD)**: Sets the numerical limit. Only modifies files with a "progr-doc" greater than or equal to this value.
$Y = 199
# [ITA]> **DATO DA MODIFICARE (AZIONE)**: Valore matematico da sommare. Usare numeri positivi per aumentare e negativi per decrementare.
# [ENG]> **DATA TO MODIFY (ACTION)**: Mathematical value to add. Use positive numbers to increase and negative numbers to decrease.
$K = -1
# -------------------------------

# [ITA]> Recupera tutti i file con estensione .md presenti nella cartella di partenza e in tutte le sue sottocartelle in modo ricorsivo.
# [ENG]> Retrieves all files with a .md extension inside the target folder and all its subfolders in a recursive manner.
$files = Get-ChildItem -Path $TargetFolder -Filter *.md -Recurse
# [ITA]> Stampa l'intestazione della tabella di log formattata in colonne di colore ciano per monitorare visivamente i dati.
# [ENG]> Prints the log table header formatted in cyan columns to visually monitor data.
Write-Host ("`n{0,-90} | {1,-10} | {2,-10}" -f "PATH E FILE", "VECCHIO", "NUOVO") -ForegroundColor Cyan
# [ITA]> Stampa una linea divisoria di trattini di colore ciano per separare visivamente i titoli della tabella dai record.
# [ENG]> Prints a cyan dashed separator line to visually split the table titles from the records.
Write-Host ("-" * 115) -ForegroundColor Cyan
# [ITA]> Avvia un ciclo di iterazione per esaminare singolarmente ogni file Markdown recuperato dalla scansione del disco.
# [ENG]> Starts a loop iteration to examine individually each Markdown file retrieved from the disk scan.
foreach ($file in $files) {
    # [ITA]> Legge esclusivamente le prime 10 righe del file corrente per ottimizzare drasticamente i tempi di esecuzione e la memoria.
    # [ENG]> Reads exclusively the first 10 rows of the current file to drastically optimize execution times and memory.
    $content = Get-Content -Path $file.FullName -TotalCount 10
    # [ITA]> Inizializza una variabile booleana a falso per tracciare se il file corrente subirà modifiche strutturali.
    # [ENG]> Initializes a boolean variable to false to track whether the current file will undergo structural changes.
    $found = $false
    # [ITA]> Avvia un ciclo numerico for per scansionare una alla volta le prime 10 righe memorizzate nell'array content.
    # [ENG]> Starts a numeric for loop to scan one by one the first 10 rows stored inside the content array.
    for ($i = 0; $i -lt $content.Count; $i++) {
        # [ITA]> Esegue una verifica tramite espressione regolare per individuare la chiave progr-doc estraendone il valore numerico.
        # [ENG]> Performs a regular expression check to locate the progr-doc key, extracting its numeric value.
        if ($content[$i] -match "progr-doc:\s*(\d+)") {
            # [ITA]> Converte il valore testuale catturato dalla regex in un numero intero e lo assegna alla variabile valoreAttuale.
            # [ENG]> Converts the textual value captured by the regex into an integer and assigns it to the valoreAttuale variable.
            $valoreAttuale = [int]$matches[1]
            # [ITA]> Verifica condizionalmente se il numero estratto dal documento è maggiore o uguale alla soglia di sicurezza impostata.
            # [ENG]> Conditionally verifies if the number extracted from the document is greater than or equal to the set safety threshold.
            if ($valoreAttuale -ge $Y) {
                # [ITA]> Calcola il nuovo valore numerico applicando l'incremento o decremento configurato nella costante K.
                # [ENG]> Calculates the new numeric value by applying the increment or decrement configured in the K constant.
                $nuovoValore = $valoreAttuale + $K
                # [ITA]> Rimpiazza la vecchia stringa del campo progr-doc con il nuovo valore calcolato.
                # [ENG]> Replaces the old string of the progr-doc field with the newly calculated value.
                $content[$i] = $content[$i] -replace "progr-doc:\s*\d+", "progr-doc: $nuovoValore"
                # [ITA]> Imposta la variabile booleana di controllo a vero per confermare l'avvenuta modifica del testo in memoria.
                # [ENG]> Sets the control boolean variable to true to confirm the text modification in memory.
                $found = $true
                # [ITA]> Isola il nome dell'ultima sottocartella che contiene il file per abbreviare il percorso visivo nel log.
                # [ENG]> Isolates the name of the last subfolder containing the file to shorten the visual path in the log.
                $nomeRelativo = Split-Path $file.FullName -Parent | Split-Path -Leaf
                # [ITA]> Combina il nome della sottocartella appena isolato con il nome del file per generare la stringa di log finale.
                # [ENG]> Combines the newly isolated subfolder name with the file name to generate the final log string.
                $fileLog = Join-Path $nomeRelativo $file.Name
                # [ITA]> Stampa in console una riga di colore giallo con il percorso relativo del file, il vecchio valore e il nuovo valore.
                # [ENG]> Prints a yellow row in the console showing the file relative path, the old value, and the new value.
                Write-Host ("{0,-90} | {1,-10} | {2,-10}" -f $fileLog, $valoreAttuale, $nuovoValore) -ForegroundColor Yellow
            # [ITA]> Chiude il blocco condizionale di verifica della soglia numerica limite.
            # [ENG]> Closes the conditional block checking the numerical limit threshold.
            }
            # [ITA]> Interrompe immediatamente il ciclo di scansione for poiché la riga progr-doc è già stata trovata ed elaborata.
            # [ENG]> Immediately interrupts the for scanning loop since the progr-doc row has already been found and processed.
            break
        # [ITA]> Chiude il blocco condizionale di verifica della corrispondenza regex sulla riga corrente.
        # [ENG]> Closes the conditional block checking the regex match on the current row.
        }
    # [ITA]> Passa all'indice successivo del ciclo for per analizzare la riga seguente del documento in esame.
    # [ENG]> Moves to the next index of the for loop to analyze the following row of the examined document.
    Next
	# [ITA]> Chiude il ciclo numerico for interno dopo aver completato l'analisi delle righe disponibili in memoria.
	# [ENG]> Closes the internal numeric for loop after completing the analysis of the rows available in memory.
    }
    # [ITA]> Controlla se la variabile booleana found è vera per decidere se procedere alla sovrascrittura fisica del documento.
    # [ENG]> Checks if the found boolean variable is true to decide whether to proceed with the physical overwrite of the document.
    if ($found) {
        # [ITA]> Legge il resto del file originale escludendo le prime 10 righe già elaborate in memoria.
        # [ENG]> Reads the rest of the original file excluding the first 10 rows already processed in memory.
        $restOfContent = Get-Content -Path $file.FullName -Stream -ErrorAction SilentlyContinue | Select-Object -Skip 10
        # [ITA]> Se il file originale aveva meno di 10 righe, si assicura che la variabile non sia un oggetto nullo.
        # [ENG]> If the original file had fewer than 10 rows, ensures the variable is not a null object.
        if ($null -eq $restOfContent) { $restOfContent = @() }
        # [ITA]> Unisce l'array delle prime 10 righe modificate con l'array del testo rimanente del documento.
        # [ENG]> Merges the array of the first 10 modified rows with the array of the remaining document text.
        $finalContent = $content + $restOfContent
        # [ITA]> Scrive l'intero blocco sul disco in formato UTF-8 nativo senza BOM ("No BOM"), proteggendo Obsidian.
        # [ENG]> Writes the entire block to disk in native UTF-8 format without BOM ("No BOM"), protecting Obsidian.
        [System.IO.File]::WriteAllLines($file.FullName, $finalContent)
    }
}
# [ITA]> Stampa a schermo un messaggio finale di successo di colore verde per segnalare il termine delle operazioni.
# [ENG]> Prints a final green success message on the screen to signal the completion of operations.
Write-Host "`nOperazione completata!" -ForegroundColor Green
# [ITA]> Sospende provvisoriamente lo script in attesa che l'utente prema il tasto Invio sulla tastiera.
# [ENG]> Temporarily suspends the script waiting for the user to press the Enter key on the keyboard.
Pause