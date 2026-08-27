<#
[ITA]
DESCRIZIONE
-----------
Questo script PowerShell esegue una scansione ricorsiva della cartella corrente e di tutte
le sue sottocartelle per allineare i file PDF ai rispettivi file sorgente Markdown (.md).

Cosa fa nello specifico:
1. Cerca tutti i file .md, escludendo quelli che iniziano con '_Indice', '_tmp' o 'test'.
2. Per ogni file .md valido, verifica se esiste un file .pdf con lo stesso identico nome.
3. Se il PDF esiste, si assicura che abbia gli attributi "Nascosto" (Hidden) e "Sola Lettura"
   (ReadOnly). Se mancano, li applica mantenendo invariati gli altri attributi.
4. Se il PDF NON esiste, stampa a schermo in VERDE il percorso relativo del file .md mancante.
5. Al termine, mantiene aperta la finestra della console (Pause).

.AUTORE
"Emanuele Tinari"

.SVILUPPATORE
"Emanuele Tinari", "Gemini Web App"

.CREATO
2026/07/06 21:26:00

.MODIFICATO
2026/08/27 08:22:30

[ENG]
DESCRIPTION
-----------
This PowerShell script recursively scans the current folder and all its subfolders to
align PDF files with their corresponding Markdown (.md) source files.

What it does specifically:
1. Searches for all .md files, excluding those starting with '_Indice', '_tmp', or 'test'.
2. For each valid .md file, checks if a .pdf file with the exact same name exists.
3. If the PDF exists, ensures it has the "Hidden" and "ReadOnly" attributes. If they
   are missing, it applies them while preserving any other existing attributes.
4. If the PDF DOES NOT exist, it prints the relative path of the missing .md file in GREEN.
5. Upon completion, it keeps the console window open (Pause).

.AUTHOR
"Emanuele Tinari"

.DEVELOPER
"Emanuele Tinari", "Gemini Web App"

.CREATED
2026/07/06 21:26:00

.MODIFIED
2026/08/27 08:22:30
#>

# [ITA] Recupera la cartella in cui si trova lo script in esecuzione.
# [ENG] Retrieves the folder containing the script currently being executed.
$currentDir = $PSScriptRoot
# [ITA] Usa la cartella di lavoro corrente se lo script non possiede un percorso radice.
# [ENG] Uses the current working folder if the script has no root path.
if ([string]::IsNullOrEmpty($currentDir)) {
    # [ITA] Assegna la posizione corrente alla cartella di analisi.
    # [ENG] Assigns the current location to the analysis folder.
    $currentDir = Get-Location
}
# [ITA] Cerca ricorsivamente tutti i file Markdown nella cartella e nelle sottocartelle.
# [ENG] Recursively searches for all Markdown files in the folder and its subfolders.
$mdFiles = Get-ChildItem -Path $currentDir -Filter "*.md" -Recurse
# [ITA] Elabora ogni file Markdown trovato dalla scansione ricorsiva.
# [ENG] Processes every Markdown file found by the recursive scan.
foreach ($mdFile in $mdFiles) {
    # [ITA] Verifica se il nome inizia con '_Indice', '_tmp' oppure 'test'.
    # [ENG] Checks whether the name starts with '_Indice', '_tmp', or 'test'.
    if ($mdFile.Name -match "^(_Indice|_tmp|test)") {
        # [ITA] Salta il file escluso e passa al successivo elemento della scansione.
        # [ENG] Skips the excluded file and moves to the next item in the scan.
        continue
    }
    # [ITA] Costruisce il percorso del file PDF atteso nella stessa cartella del Markdown.
    # [ENG] Builds the expected PDF path in the same folder as the Markdown file.
    $pdfPath = Join-Path -Path $mdFile.DirectoryName -ChildPath ($mdFile.BaseName + ".pdf")
    # [ITA] Verifica se il file PDF corrispondente esiste.
    # [ENG] Checks whether the corresponding PDF file exists.
    if (Test-Path -Path $pdfPath) {
        # [ITA] Recupera il file PDF esistente includendo anche gli elementi nascosti.
        # [ENG] Retrieves the existing PDF file, including hidden items.
        $pdfFile = Get-Item -Path $pdfPath -Force
        # [ITA] Controlla se manca almeno uno degli attributi Hidden o ReadOnly.
        # [ENG] Checks whether at least one of the Hidden or ReadOnly attributes is missing.
        if (-not ($pdfFile.Attributes.HasFlag([System.IO.FileAttributes]::Hidden)) -or
            -not ($pdfFile.Attributes.HasFlag([System.IO.FileAttributes]::ReadOnly))) {
            # [ITA] Applica Hidden e ReadOnly mantenendo invariati gli altri attributi, come Archive.
            # [ENG] Applies Hidden and ReadOnly while preserving other attributes, such as Archive.
            $pdfFile.Attributes = $pdfFile.Attributes -bor [System.IO.FileAttributes]::Hidden -bor [System.IO.FileAttributes]::ReadOnly
        }
    }
	# [ITA] Gestisce il caso in cui il PDF corrispondente non esista.
	# [ENG] Handles the case where the corresponding PDF does not exist.
    else {
        # [ITA] Converte il percorso completo del Markdown in un percorso relativo.
        # [ENG] Converts the Markdown full path into a relative path.
        $relativePath = Resolve-Path -Path $mdFile.FullName -Relative
        # [ITA] Stampa in verde il percorso relativo del Markdown privo del PDF corrispondente.
        # [ENG] Prints in green the relative path of the Markdown missing its corresponding PDF.
        Write-Host $relativePath -ForegroundColor Green
    }
}
# [ITA] Comunica all'utente che la scansione e terminata.
# [ENG] Informs the user that the scan has finished.
Write-Host "`nEsecuzione completata."
# [ITA] Mantiene aperta la finestra della console fino alla conferma dell'utente.
# [ENG] Keeps the console window open until the user confirms.
Pause