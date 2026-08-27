<#
[ITA]
DESCRIZIONE
-----------
	Sincronizza i metadati YAML con le proprieta del file system dei file Markdown.
	1. ESTRAZIONE DATI: legge i campi 'creato:' e 'modificato:' nelle prime 50 righe del frontmatter YAML.
	2. PARSING FLESSIBILE: supporta i formati data italiani e ISO con separatori '/' oppure '-'.
	3. RIPRISTINO PROPRIETA: assegna le date estratte alle proprieta CreationTime e LastWriteTime del file.
	4. CULTURA ITALIANA: usa la cultura 'it-IT' per evitare l'inversione tra giorno e mese.
	5. FORMATI SUPPORTATI: dd/MM/yyyy, yyyy/MM/dd, dd-MM-yyyy e yyyy-MM-dd, tutti con ora, minuti e secondi.
	6. AMBITO DI ESECUZIONE: analizza soltanto i file .md presenti nella cartella corrente, senza sottocartelle.
	7. NOTA DI ESECUZIONE: se concatenato ad altri script, rimuovere 'Pause' per evitare una doppia conferma.

.AUTORE
"Emanuele Tinari"

.SVILUPPATORE
"Emanuele Tinari", "Gemini Web App"

.CREATO
2026/04/24 12:46:34

.MODIFICATO
2026/08/26 23:45:58

[ENG]
DESCRIPTION
-----------
	Synchronizes YAML metadata with the file system properties of Markdown files.
	1. DATA EXTRACTION: reads the 'creato:' and 'modificato:' fields from the YAML frontmatter's first 50 lines.
	2. FLEXIBLE PARSING: supports Italian and ISO date formats with either '/' or '-' separators.
	3. PROPERTY RESTORATION: assigns the extracted dates to the file's CreationTime and LastWriteTime properties.
	4. ITALIAN CULTURE: uses the 'it-IT' culture to prevent day/month inversion.
	5. SUPPORTED FORMATS: dd/MM/yyyy, yyyy/MM/dd, dd-MM-yyyy and yyyy-MM-dd, all including hours, minutes and seconds.
	6. EXECUTION SCOPE: processes only .md files in the current folder, without subfolders.
	7. EXECUTION NOTE: when concatenated with other scripts, remove 'Pause' to avoid a second confirmation.

.AUTHOR
"Emanuele Tinari"

.DEVELOPER
"Emanuele Tinari", "Gemini Web App"

.CREATED
2026/04/24 12:46:34

.MODIFIED
2026/08/26 23:45:58
#>

# [ITA] Recupera tutti i file Markdown presenti nella cartella corrente, escludendo le sottocartelle.
# [ENG] Retrieves all Markdown files in the current folder, excluding subfolders.
$files = Get-ChildItem -LiteralPath . -File -Filter "*.md"
# [ITA] Definisce i quattro formati di data accettati, tutti con precisione fino ai secondi.
# [ENG] Defines the four accepted date formats, all with precision down to seconds.
$formats = @("dd/MM/yyyy HH:mm:ss", "yyyy/MM/dd HH:mm:ss", "dd-MM-yyyy HH:mm:ss", "yyyy-MM-dd HH:mm:ss")
# [ITA] Mostra il numero di file Markdown che saranno analizzati.
# [ENG] Displays the number of Markdown files that will be analyzed.
Write-Host "Inizio analisi di $($files.Count) file..." -ForegroundColor Cyan
# [ITA] Avvia l'elaborazione di ogni file Markdown trovato nella cartella corrente.
# [ENG] Starts processing each Markdown file found in the current folder.
foreach ($file in $files) {
	# [ITA] Legge al massimo le prime 50 righe del file usando la codifica UTF-8.
	# [ENG] Reads at most the first 50 lines of the file using UTF-8 encoding.
	$content = Get-Content -LiteralPath $file.FullName -Head 50 -Encoding UTF8 -ErrorAction SilentlyContinue
	# [ITA] Salta il file corrente se non e stato possibile leggerlo o se e vuoto.
	# [ENG] Skips the current file if it could not be read or is empty.
	if (!$content) {
		# [ITA] Passa direttamente al file Markdown successivo.
		# [ENG] Moves directly to the next Markdown file.
		continue
	}
	# [ITA] Inizializza la variabile che conterra la data di creazione estratta.
	# [ENG] Initializes the variable that will contain the extracted creation date.
	$dtCreazione = $null
	# [ITA] Inizializza la variabile che conterra la data di modifica estratta.
	# [ENG] Initializes the variable that will contain the extracted modification date.
	$dtModifica = $null
	# [ITA] Analizza una alla volta le righe lette dal file Markdown.
	# [ENG] Analyzes the lines read from the Markdown file one at a time.
	foreach ($line in $content) {
		# [ITA] Cerca una riga con il campo 'creato:' o 'modificato:' e una data completa.
		# [ENG] Searches for a line containing the 'creato:' or 'modificato:' field and a complete date.
		if ($line -match "^(creato|modificato):\s*(\d{2,4}[/-]\d{2}[/-]\d{2,4}\s\d{2}:\d{2}:\d{2})") {
			# [ITA] Salva il nome del campo YAML catturato dalla prima parte dell'espressione regolare.
			# [ENG] Stores the YAML field name captured by the first part of the regular expression.
			$tipo = $matches[1]
			# [ITA] Salva la stringa della data catturata dalla seconda parte dell'espressione regolare.
			# [ENG] Stores the date string captured by the second part of the regular expression.
			$dateStr = $matches[2]
			# [ITA] Inizializza il valore di destinazione usato dal parsing della data.
			# [ENG] Initializes the destination value used by date parsing.
			$parsedDate = [datetime]::MinValue
			# [ITA] Seleziona la cultura italiana per interpretare correttamente giorno e mese.
			# [ENG] Selects the Italian culture to interpret the day and month correctly.
			$culture = [System.Globalization.CultureInfo]::GetCultureInfo("it-IT")
			# [ITA] Imposta lo stile di parsing senza regole aggiuntive di conversione.
			# [ENG] Sets the parsing style without additional conversion rules.
			$styles = [System.Globalization.DateTimeStyles]::None
			# [ITA] Tenta di convertire la stringa usando esclusivamente i formati dichiarati.
			# [ENG] Attempts to convert the string using only the declared formats.
			if ([DateTime]::TryParseExact($dateStr, [string[]]$formats, $culture, $styles, [ref]$parsedDate)) {
				# [ITA] Se il campo e 'creato', conserva la data nella variabile CreationTime.
				# [ENG] If the field is 'creato', stores the date in the CreationTime variable.
				if ($tipo -eq "creato") {
					# [ITA] Assegna la data convertita alla data di creazione del file.
					# [ENG] Assigns the converted date to the file creation date.
					$dtCreazione = $parsedDate
				}
				# [ITA] Se il campo e 'modificato', conserva la data nella variabile LastWriteTime.
				# [ENG] If the field is 'modificato', stores the date in the LastWriteTime variable.
				if ($tipo -eq "modificato") {
					# [ITA] Assegna la data convertita alla data di ultima modifica del file.
					# [ENG] Assigns the converted date to the file's last modification date.
					$dtModifica = $parsedDate
				}
			}
		}
	}
	# [ITA] Verifica se almeno una delle due date e stata estratta correttamente.
	# [ENG] Checks whether at least one of the two dates was extracted successfully.
	if ($dtCreazione -or $dtModifica) {
		# [ITA] Avvia un blocco protetto per gestire eventuali errori di accesso al file.
		# [ENG] Starts a protected block to handle possible file access errors.
		try {
			# [ITA] Recupera l'oggetto FileInfo corrispondente al file Markdown corrente.
			# [ENG] Retrieves the FileInfo object corresponding to the current Markdown file.
			$fileObj = Get-Item -LiteralPath $file.FullName
			# [ITA] Aggiorna la proprieta CreationTime se e stata trovata una data di creazione.
			# [ENG] Updates the CreationTime property if a creation date was found.
			if ($dtCreazione) {
				# [ITA] Scrive la data estratta nella proprieta di creazione del file.
				# [ENG] Writes the extracted date to the file creation property.
				$fileObj.CreationTime = $dtCreazione
			}
			# [ITA] Aggiorna la proprieta LastWriteTime se e stata trovata una data di modifica.
			# [ENG] Updates the LastWriteTime property if a modification date was found.
			if ($dtModifica) {
				# [ITA] Scrive la data estratta nella proprieta di ultima modifica del file.
				# [ENG] Writes the extracted date to the file last modification property.
				$fileObj.LastWriteTime = $dtModifica
			}
			# [ITA] Conferma in verde le date applicate al file, mostrando il formato italiano.
			# [ENG] Confirms in green the dates applied to the file, displaying the Italian format.
			Write-Host "OK: $($file.Name) [C: $($fileObj.CreationTime.ToString('dd/MM/yyyy HH:mm:ss')) M: $($fileObj.LastWriteTime.ToString('dd/MM/yyyy HH:mm:ss'))]" -ForegroundColor Green
		}
		# [ITA] Intercetta gli errori che si verificano durante il recupero o l'aggiornamento del file.
		# [ENG] Catches errors occurring while retrieving or updating the file.
		catch {
			# [ITA] Mostra in rosso il nome del file che non e stato possibile aggiornare.
			# [ENG] Displays in red the name of the file that could not be updated.
			Write-Host "Errore nell'impostazione date per: $($file.Name)" -ForegroundColor Red
		}
	}
}
# [ITA] Comunica in giallo la conclusione dell'operazione di sincronizzazione.
# [ENG] Reports in yellow that the synchronization operation has finished.
Write-Host "`nOperazione completata!" -ForegroundColor Yellow
# [ITA] Mantiene aperta la finestra della console fino alla conferma dell'utente.
# [ENG] Keeps the console window open until the user confirms.
Pause