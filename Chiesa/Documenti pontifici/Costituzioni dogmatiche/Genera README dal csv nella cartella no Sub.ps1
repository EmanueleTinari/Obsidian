<#
[ITA]
DESCRIZIONE
-----------
    Genera un file README.md contenente una tabella Markdown formattata a partire da un file CSV.
    1. VERIFICA CSV: Cerca nella cartella corrente il file .csv con lo stesso nome della cartella (convertito in minuscolo).
    2. CONSERVAZIONE HEADER: Mantiene le prime 8 righe del README.md esistente (o aggiunge righe vuote se < 8).
    3. STRUTTURA FISSA: Inserisce le righe prescritte (modificato:, ---, titolo '# File già presenti in questa cartella').
    4. PARSING TABELLA: Legge il CSV usando il separatore pipe ('|') ed estrae le colonne 8, 9, 17, 19 e 27.
    5. LINK GITHUB: Costruisce l'URL completo su GitHub convertendo gli spazi in %20.
    6. SALVATAGGIO: Scrive il file README.md finale in codifica UTF-8.

.AUTORE
"Emanuele Tinari"

.SVILUPPATORE
"Emanuele Tinari", "Gemini Web App"

.CREATO
2026/09/01 00:17:28

.MODIFICATO
2026/09/01 10:06:30

[ENG]
DESCRIPTION
-----------
    Generates a README.md file containing a formatted Markdown table from a CSV file.
    1. CSV CHECK: Looks in the current folder for a .csv file matching the folder name (in lowercase).
    2. HEADER PRESERVATION: Keeps the first 8 lines of an existing README.md (or fills blank ones if < 8).
    3. FIXED STRUCTURE: Inserts prescribed lines (modificato:, ---, title '# File già presenti in questa cartella').
    4. TABLE PARSING: Reads the CSV using pipe ('|') delimiter and extracts columns 8, 9, 17, 19, and 27.
    5. GITHUB LINKS: Constructs the full GitHub URL converting spaces to %20.
    6. SAVING: Writes the final README.md file using UTF-8 encoding.

.AUTHOR
"Emanuele Tinari"

.DEVELOPER
"Emanuele Tinari", "Gemini Web App"

.CREATO
2026/09/01 00:17:28

.MODIFICATO
2026/09/01 10:06:30
#>

# [ITA] Imposta il comportamento in caso di errore per interrompere lo script.
# [ENG] Sets error action preference to stop execution on error.
$ErrorActionPreference = "Stop"

try {
	# [ITA] Definisce l'URL base del repository GitHub per la composizione dei link.
	# [ENG] Defines base URL of GitHub repository for constructing links.
	$ghBaseUrl = "https://github.com/EmanueleTinari/Obsidian/blob/main/"
	# [ITA] Ottiene il percorso della cartella in cui risiede lo script corrente.
	# [ENG] Gets path of folder where current script resides.
	$currentDir = $PSScriptRoot
	# [ITA] Controlla se la variabile del percorso è vuota e in tal caso usa la directory corrente.
	# [ENG] Checks if path variable is empty and if so uses current directory.
	if (-not $currentDir) { $currentDir = (Get-Location).Path }
	# [ITA] Estrae il solo nome della cartella dal percorso completo.
	# [ENG] Extracts only folder name from full path.
	$folderName = Split-Path -Path $currentDir -Leaf
	# [ITA] Converte il nome della cartella in lettere minuscole e aggiunge l'estensione .csv.
	# [ENG] Converts folder name to lowercase and appends .csv extension.
	$csvFileName = "$($folderName.ToLower()).csv"
	# [ITA] Combina il percorso della directory corrente con il nome del file CSV.
	# [ENG] Combines current directory path with CSV file name.
	$csvFilePath = Join-Path -Path $currentDir -ChildPath $csvFileName
	# [ITA] Verifica se il file CSV esiste nella cartella di lavoro.
	# [ENG] Checks whether CSV file exists in working folder.
	if (-not (Test-Path -Path $csvFilePath)) {
		# [ITA] Interrompe l'esecuzione e mostra un errore se il file CSV non esiste.
		# [ENG] Stops execution and displays error if CSV file does not exist.
		throw "File CSV non trovato: $csvFilePath"
	# [ITA] Chiusura della condizione di controllo esistenza CSV.
	# [ENG] Closing brace for CSV existence check condition.
	}
	# [ITA] Definisce il percorso completo per il file README.md.
	# [ENG] Defines full path for README.md file.
	$readmeFilePath = Join-Path -Path $currentDir -ChildPath "README.md"
	# [ITA] Versione ottimizzata con apici singoli: gestisce le virgolette doppie.
	# [ENG] Optimized version with single quotes: handles double quotes.
	$defaultHeader = @(
		'---',
		'cssclasses: changelog',
		'licenza-nota: Copyright © 2026 Emanuele Tinari under Creative Commons BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/',
		'ideatore: "Emanuele Tinari"',
		'sviluppatore: ["Emanuele Tinari", "Gemini Web App"]',
		'template: "Genera README dal csv nella cartella no Sub.ps1"',
		'nomeFile: "README.md"',
		'creato:'
	)
	# [ITA] Aggiunge il blocco di note e l'intestazione H1 tramite una costante multi-riga (Here-String).
    # [ENG] Appends notes block and H1 header using a multi-line string constant (Here-String).
    $bodyText = @"

# $folderName già presenti in questa cartella

N.B.:

- Di ogni testo nei file markdown.md è presente ANCHE la relativa versione PDF scaricata in originale dal sito del Vaticano.
- Ogni file PDF ha lo stesso nome del testo markdown.md con estensione .pdf
- Durante la generazione dei file PDF è stata applicata una diversa marginazione e sono state eliminate le intestazioni e i piè di pagina contenenti i menù del sito stesso.
- Ogni riga nel file $folderName.csv rappresenta un testo caricato su GitHub.
- La colonna 1 e 2 di tale CSV, sempre con valore 'true', sono riferite al fatto che il documento è stato creato in markdown.md e anche il relativo .PDF è presente su GitHub

"@
	# [ITA] Inizializza l'array per l'intestazione finale.
	# [ENG] Initializes array for final header.
	$headerLines = @()
	# [ITA] Verifica se il file README.md esiste ed ha una dimensione superiore a 0 byte.
	# [ENG] Checks whether README.md file exists and has a size greater than 0 bytes.
	if ((Test-Path -Path $readmeFilePath) -and ((Get-Item -Path $readmeFilePath).Length -gt 0)) {
		# [ITA] Legge le prime 8 righe dal file README.md esistente.
		# [ENG] Reads first 8 lines from existing README.md file.
		$headerLines = @(Get-Content -Path $readmeFilePath -Encoding UTF8 | Select-Object -First 8)
		# [ITA] Completa con righe vuote se il file esistente ha meno di 8 righe.
		# [ENG] Fills with empty lines if existing file has fewer than 8 lines.
		while ($headerLines.Count -lt 8) {
			# [ITA] Aggiunge una riga vuota all'array dell'intestazione.
			# [ENG] Appends an empty line to header array.
			$headerLines += ""
		# [ITA] Chiusura del ciclo mentre le righe sono inferiori a sette.
		# [ENG] Closing brace for loop while lines are fewer than seven.
		}
	# [ITA] Gestisce il caso in cui il file non esista o sia vuoto.
	# [ENG] Handles case where file does not exist or is empty.
	} else {
		# [ITA] Assegna il blocco di 8 righe predefinite alla variabile dell'intestazione.
		# [ENG] Assigns default 8-line block to header variable.
		$headerLines = $defaultHeader
	# [ITA] Chiusura del blocco condizionale per gestione file non esistente o vuoto.
	# [ENG] Closing brace for conditional block handling missing or empty file.
	}
	# [ITA] Istanzia un oggetto StringBuilder per assemblare efficientemente il testo.
	# [ENG] Instantiates a StringBuilder object to efficiently assemble text.
	$sb = New-Object -TypeName System.Text.StringBuilder
	# [ITA] Scorre ciascuna delle prime sette righe memorizzate dall'intestazione.
	# [ENG] Iterates through each of first seven stored header lines.
	foreach ($line in $headerLines) {
		# [ITA] Aggiunge la riga corrente all'oggetto StringBuilder.
		# [ENG] Appends current line to StringBuilder object.
		[void]$sb.AppendLine($line)
	# [ITA] Chiusura del ciclo foreach per le righe d'intestazione.
	# [ENG] Closing brace for foreach loop for header lines.
	}
	# [ITA] Aggiunge la nona riga prescritta con il testo 'modificato:'.
	# [ENG] Appends ninth prescribed line with text 'modificato:'.
	[void]$sb.AppendLine("modificato:")
	# [ITA] Aggiunge la decima riga prescritta con la linea divisoria Markdown.
	# [ENG] Appends tenth prescribed line with Markdown separator line.
	[void]$sb.AppendLine("---")
	# [ITA] Aggiunge l'intero blocco di testo multiriga (Here-String) del corpo del file allo StringBuilder.
    # [ENG] Appends the entire multi-line body text block (Here-String) to the StringBuilder.
    [void]$sb.AppendLine($bodyText)
	# [ITA] Aggiunge la riga con le intestazioni delle colonne della tabella Markdown.
	# [ENG] Appends row with Markdown table column headers.
	[void]$sb.AppendLine("| AUTORE | DATA | TITOLO | LINK |")
	# [ITA] Aggiunge la riga di formattazione del separatore delle colonne della tabella.
	# [ENG] Appends column separator formatting row of table.
	[void]$sb.AppendLine("| --- | --- | --- | --- |")
	# [ITA] Inizializza la variabile per il percorso relativo del repository.
	# [ENG] Initializes variable for repository relative path.
	$relPath = ""
	# [ITA] Verifica se il percorso della cartella contiene il nome della vault 'Obsidian'.
	# [ENG] Checks if folder path contains vault name 'Obsidian'.
	if ($currentDir -match "Obsidian[\\/](.*)") {
		# [ITA] Estrae la porzione di percorso successiva a 'Obsidian' convertendo i separatori.
		# [ENG] Extracts path portion after 'Obsidian' converting separators.
		$relPath = $Matches[1].Replace("\", "/")
	# [ITA] Chiusura della condizione di estrazione percorso relativo.
	# [ENG] Closing brace for relative path extraction condition.
	}
	else {
		# [ITA] Assegna il nome della cartella come percorso relativo se non si trova all'interno di Obsidian.
		# [ENG] Assigns folder name as relative path if not located within Obsidian.
		$relPath = $folderName
	# [ITA] Chiusura del ramo else per la gestione del percorso alternativo.
	# [ENG] Closing brace for else branch handling fallback path.
	}
	# [ITA] Si assicura che il percorso relativo non inizi o termini con uno slash superfluo.
	# [ENG] Ensures relative path does not start or end with leading or trailing slash.
	$relPath = $relPath.Trim('/')
	# [ITA] Importa i dati dal file CSV specificato in un oggetto strutturato, usando il pipe '|' come separatore.
	# [ENG] Imports data from specified CSV file into a structured object, using pipe '|' as delimiter.
	$csvData = Import-Csv -Path $csvFilePath -Delimiter '|'
	# [ITA] Scorre ogni riga presente all'interno del file CSV importato.
	# [ENG] Iterates through each row present within imported CSV file.
	foreach ($row in $csvData) {
		# [ITA] Estrae i valori di tutte le proprietà della riga forzando la conversione ad array per l'indicizzazione posizionale.
		# [ENG] Extracts values of all row properties forcing array conversion for positional indexing.
		$cols = @($row.PSObject.Properties.Value)
		# [ITA] Memorizza il valore della colonna 8 [Nome latino] del CSV indicizzata a 7.
		# [ENG] Stores value of CSV column 8 [Nome latino] indexed at 7.
		$col8 = $cols[7]
		# [ITA] Memorizza il valore della colonna 9 [Autore IT] del CSV indicizzata a 8.
		# [ENG] Stores value of CSV column 9 [Autore IT] indexed at 8.
		$col9 = $cols[8]
		# [ITA] Memorizza il valore della colonna 17 [Titolo] del CSV indicizzata a 16.
		# [ENG] Stores value of CSV column 17 [Titolo] indexed at 16.
		$col17 = $cols[16]
		# [ITA] Memorizza il valore della colonna 19 [NOME FILE] del CSV indicizzata a 18.
		# [ENG] Stores value of CSV column 19 [NOME FILE] indexed at 18.
		$col19 = $cols[18]
		# [ITA] Memorizza il valore della colonna 27 [Data 1] del CSV indicizzata a 26.
		# [ENG] Stores value of CSV column 27 [Data 1] indexed at 26.
		$col20 = $cols[26]
		# [ITA] Formatta la colonna dell'autore combinando colonna 9 [Autore IT] e colonna 8 [Nome latino] tra parentesi.
		# [ENG] Formats author column combining column 9 [Autore IT] and column 8 [Nome latino] in parentheses.
		$authorCell = "$col9 ($col8)"
		# [ITA] Converte il percorso in stringa e sostituisce gli spazi con il codice percentuale %20 per il percorso della cartella.
		# [ENG] Converts path to string and replaces spaces with percent code %20 for folder path.
		$cleanRelPath = ([string]$relPath).Replace(" ", "%20")
		# [ITA] Converte il valore in stringa, sostituisce gli spazi con %20 ed aggiunge l'estensione .md per l'URL di GitHub.
		# [ENG] Converts value to string, replaces spaces with %20, and appends the .md extension for the GitHub URL.
		$cleanFileName = ([string]$col19).Replace(" ", "%20") + ".md"
		# [ITA] Assembla l'URL completo del file su GitHub concatenando le varie parti.
		# [ENG] Assembles full file URL on GitHub by concatenating various parts.
		$fullUrl = "$ghBaseUrl$cleanRelPath/$cleanFileName"
		# [ITA] Crea la stringa formattata del link Markdown [NomeFile](URL).
		# [ENG] Creates formatted string of Markdown link [FileName](URL).
		$linkCell = "[$col19]($fullUrl)"
		# [ITA] Assegna la data alla variabile per la seconda colonna della tabella.
		# [ENG] Assigns date to variable for second table column.
		$dateCell = $col20
		# [ITA] Assegna il titolo alla variabile per la terza colonna della tabella.
		# [ENG] Assigns title to variable for third table column.
		$titleCell = $col17
		# [ITA] Costruisce la riga completa in formato tabella Markdown con i delimitatori pipe.
		# [ENG] Constructs complete row in Markdown table format with pipe delimiters.
		$markdownRow = "| $authorCell | $dateCell | $titleCell | $linkCell |"
		# [ITA] Aggiunge la riga formattata allo StringBuilder.
		# [ENG] Appends formatted row to StringBuilder.
		[void]$sb.AppendLine($markdownRow)
	# [ITA] Chiusura del ciclo foreach per l'elaborazione del file CSV.
	# [ENG] Closing brace for foreach loop processing CSV file.
	}
	# [ITA] Scrive il contenuto accumulato nello StringBuilder all'interno del file README.md.
	# [ENG] Writes accumulated content in StringBuilder to README.md file.
	[System.IO.File]::WriteAllText($readmeFilePath, $sb.ToString(), [System.Text.Encoding]::UTF8)
}
catch {
    Write-Host "`n[ERRORE] $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    pause
}