<#
.SYNOPSIS
    [ITA]> Script di aggiornamento massivo del campo "progr-doc" nei file Markdown.
    [ENG]> Bulk update script for the "progr-doc" field in Markdown files.
.DESCRIPTION
    [ITA]> Lo script scansiona ricorsivamente la cartella in cui si trova e tutte le sottocartelle cercando file .md. Per ogni file legge il contenuto completo, individua la riga che inizia con "progr-doc:" e, se il numero trovato è maggiore o uguale alla soglia Y, applica l'incremento K. La modifica coinvolge solo il valore numerico di quella riga, lasciando intatti il resto del file e il tipo di fine riga originale.
    [ENG]> The script recursively scans its current folder and all subfolders for .md files. For each file it reads the full content, finds the line beginning with "progr-doc:", and if the number found is greater than or equal to the threshold Y, it applies the increment K. The change affects only the numeric value of that line, leaving the rest of the file and the original line ending style untouched.
.PARAMETER Y
    [ITA]> (Soglia) Il valore numerico minimo. Tutti i file con un 'progr-doc' uguale o superiore a questo numero verranno modificati. I file con valori inferiori saranno ignorati.
    [ENG]> (Threshold) The minimum numeric value. All files with a 'progr-doc' equal to or greater than this number will be modified. Files with lower values will be ignored.
.PARAMETER K
    [ITA]> (Incremento/Decremento) Il numero da sommare al valore trovato. Usare numeri POSITIVI (es. 1, 5, 10) per aumentare la numerazione. Usare numeri NEGATIVI (es. -1, -5) per scalare la numerazione all'indietro (funzione Undo).
    [ENG]> (Increment/Decrement) The number to add to the found value. Use POSITIVE numbers (e.g., 1, 5, 10) to increase numbering. Use NEGATIVE numbers (e.g., -1, -5) to decrease numbering backward (Undo function).
.EXAMPLE
    [ITA]> Se progr-doc è 199, Y è 199 e K è 1  => Il nuovo valore sarà 200.
    [ENG]> If progr-doc is 199, Y is 199 and K is 1  => The new value will be 200.
.EXAMPLE
    [ITA]> Se progr-doc è 199, Y è 199 e K è -1 => Il nuovo valore sarà 198.
    [ENG]> If progr-doc is 199, Y is 199 and K is -1 => The new value will be 198.
.NOTES
    [ITA]> - Il file viene letto interamente per preservare l'originale contenuto e i newline esistenti.
    [ITA]> - Viene modificato solo il valore numerico della riga "progr-doc:".
    [ITA]> - Il log finale è compatto per evitare output gigantesco su centinaia di file.
    [ENG]> - The file is read entirely to preserve the original content and existing line endings.
    [ENG]> - Only the numeric value of the "progr-doc:" line is modified.
    [ENG]> - The final log is compact to avoid huge output across hundreds of files.

.AUTHOR (AUTORE)
"Emanuele Tinari"

.DEVELOPER (SVILUPPATORE)
"Emanuele Tinari", "Gemini Web App"

.CREATED (CREATO)
2026/05/08 16:10:59

.MODIFIED (MODIFICATO)
2026/09/02 09:26:00
#>

# -------------------------------
# [ITA]> Configurazione fissa che stabilisce il percorso di partenza impostandolo sulla cartella fisica in cui risiede lo script.
# [ENG]> Fixed setup that establishes the starting path by setting it to the physical folder where the script resides.
$TargetFolder = $PSScriptRoot
# [ITA]> **DATO DA MODIFICARE (SOGLIA)**: Imposta il limite numerico. Modifica solo i file con "progr-doc" maggiore o uguale a questo valore.
# [ENG]> **DATA TO MODIFY (THRESHOLD)**: Sets the numerical limit. Only modifies files with a "progr-doc" greater than or equal to this value.
$Y = 30410
# [ITA]> **DATO DA MODIFICARE (AZIONE)**: Valore matematico da sommare. Usare numeri positivi per aumentare e negativi per decrementare.
# [ENG]> **DATA TO MODIFY (ACTION)**: Mathematical value to add. Use positive numbers to increase and negative numbers to decrease.
$K = 16
# -------------------------------

# [ITA]> Recupera tutti i file con estensione .md presenti nella cartella di partenza e in tutte le sue sottocartelle in modo ricorsivo.
# [ENG]> Retrieves all files with a .md extension inside the target folder and all its subfolders in a recursive manner.
$files = Get-ChildItem -Path $TargetFolder -Filter *.md -File -Recurse
# [ITA]> Inizializza il contatore dei file modificati.
# [ENG]> Initializes the counter for files that were modified.
$modifiedCount = 0
# [ITA]> Inizializza il contatore dei file scansionati.
# [ENG]> Initializes the counter for files scanned.
$scannedCount = 0
# [ITA]> Avvia un ciclo di iterazione per esaminare singolarmente ogni file Markdown recuperato dalla scansione del disco.
# [ENG]> Starts a loop iteration to examine each Markdown file retrieved from disk one by one.
foreach ($file in $files) {
    # [ITA]> Incrementa il contatore di scansione per tenere traccia del numero totale di file processati.
    # [ENG]> Increments the scan counter to keep track of the total number of files processed.
    $scannedCount++
    # [ITA]> Legge l'intero file in memoria come testo puro per preservare esattamente il formato originale, inclusi \n e \r\n del documento.
    # [ENG]> Reads the entire file into memory as plain text to preserve the original format exactly, including the document's \n and \r\n endings.
    $content = [System.IO.File]::ReadAllText($file.FullName)
    # [ITA]> Cerca la riga 'progr-doc' nel testo completo usando una regex che preserva il fine riga originale e lascia inalterate le altre righe.
    # [ENG]> Searches for the 'progr-doc' line in the full text using a regex that preserves the original line ending and leaves all other lines untouched.
    # [ITA]> Se trova una riga del tipo 'progr-doc: 12345', la condizione è vera e il numero viene convertito in intero per il confronto.
    # [ENG]> If it finds a line like 'progr-doc: 12345', the condition is true and the number is converted to an integer for comparison.
    if ($content -match '(?m)^(\s*progr-doc\s*:\s*)(\d+)([ \t]*)(\r?\n|$)') {
        # [ITA]> $Matches[2] contiene il numero estratto dopo 'progr-doc:'; lo converte in un intero per confrontarlo con $Y.
        # [ENG]> $Matches[2] contains the number extracted after 'progr-doc:'; it converts it to an integer so it can be compared with $Y.
        $valoreAttuale = [int]$Matches[2]
        # [ITA]> Verifica condizionalmente se il numero estratto dal documento è maggiore o uguale alla soglia di sicurezza impostata.
        # [ENG]> Conditionally verifies whether the extracted number is greater than or equal to the configured safety threshold.
        # [ITA]> Se il numero supera o eguaglia la soglia, si calcola il nuovo valore e si procede alla modifica del file.
        # [ENG]> If the number is equal to or exceeds the threshold, the new value is calculated and the file update proceeds.
        if ($valoreAttuale -ge $Y) {
            # [ITA]> Calcola il nuovo valore numerico applicando l'incremento o decremento configurato nella costante K.
            # [ENG]> Calculates the new numeric value by applying the increment or decrement configured in the K constant.
            $nuovoValore = $valoreAttuale + $K
            # [ITA]> Rimpiazza solo il valore numerico della riga 'progr-doc', lasciando invariati spazi, indentazione e fine riga originali.
            # [ENG]> Replaces only the numeric value of the 'progr-doc' line, leaving indentation, spaces, and original line endings unchanged.
            $updatedContent = [regex]::Replace($content, '(?m)^(\s*progr-doc\s*:\s*)(\d+)([ \t]*)(\r?\n|$)', "`${1}$nuovoValore`${3}`${4}", 1)
            # [ITA]> Salva il file senza normalizzare i newline: il documento mantiene lo stesso stile di fine riga usato prima della modifica.
            # [ENG]> Saves the file without normalizing newline characters: the document keeps the same line-ending style used before the modification.
            [System.IO.File]::WriteAllText($file.FullName, $updatedContent, [System.Text.UTF8Encoding]::new($false))
            # [ITA]> Incrementa il contatore dei file davvero modificati.
            # [ENG]> Increments the counter for files that were actually modified.
            $modifiedCount++
        }
    }
}
# [ITA]> Stampa un riepilogo finale compatto: questo evita un log enorme su centinaia di file e mantiene la console leggibile.
# [ENG]> Prints a compact final summary: this avoids a huge log across hundreds of files and keeps the console readable.
Write-Host ("`nScansionati: {0} | Modificati: {1}" -f $scannedCount, $modifiedCount) -ForegroundColor Green
# [ITA]> Sospende provvisoriamente lo script in attesa che l'utente prema il tasto Invio sulla tastiera.
# [ENG]> Temporarily suspends the script waiting for the user to press the Enter key on the keyboard.
Pause