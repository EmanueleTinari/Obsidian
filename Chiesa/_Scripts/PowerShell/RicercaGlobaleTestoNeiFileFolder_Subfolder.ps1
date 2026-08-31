<#
[ITA]
DESCRIZIONE
-----------
	Motore di ricerca testuale globale con interfaccia interattiva e apertura automatica dei risultati.
	1. INTERFACCIA E INPUT: utilizza una finestra di dialogo (InputBox) per inserire la stringa di ricerca e mantiene il ciclo di ricerca aperto finché l'utente lo desidera.
	2. AMBITO DI SCANSIONE: filtra i file in base a un insieme di estensioni specifiche e percorre ricorsivamente la cartella corrente.
	3. MOTORE DI RICERCA: usa Select-String con -SimpleMatch per cercare il testo esatto senza interpretare caratteri speciali come espressioni regolari.
	4. AZIONI SUI RISULTATI: apre automaticamente i file trovati in Notepad e stampa il percorso assoluto di ogni occorrenza rilevata.
	5. OTTIMIZZAZIONE E PULIZIA: gestisce eventuali errori di accesso alle cartelle, mantiene la console leggibile e supporta più sessioni di ricerca.

.AUTORE
"Emanuele Tinari"

.SVILUPPATORE
"Emanuele Tinari", "Gemini Web App"

.CREATO
2026/03/31 16:55:01

.MODIFICATO
2026/08/31 09:35:00

[ENG]
DESCRIPTION
-----------
	Global text search engine with interactive interface and automatic result opening.
	1. INTERFACE AND INPUT: uses an InputBox dialog to insert the search string and keeps the search loop open as long as the user wants.
	2. SCAN SCOPE: filters files based on a set of specific extensions and recursively traverses the current folder.
	3. SEARCH ENGINE: uses Select-String with -SimpleMatch to search for the exact text without interpreting special characters as regex.
	4. RESULT ACTIONS: automatically opens found files in Notepad and prints the absolute path of each detected match.
	5. OPTIMIZATION AND CLEANUP: handles access errors to folders, keeps the console readable, and supports multiple search sessions.

.AUTHOR
"Emanuele Tinari"

.DEVELOPER
"Emanuele Tinari", "Gemini Web App"

.CREATED
2026/03/31 16:55:01

.MODIFIED
2026/08/31 09:35:00
#>

# [ITA] Importa le classi di sistema di Microsoft Visual Basic necessarie per usare la finestra di input.
# [ENG] Imports the Microsoft Visual Basic system classes needed to use the input dialog.
Add-Type -AssemblyName Microsoft.VisualBasic
# [ITA] Avvia un ciclo di ricerca ripetuto finché l'utente decide di continuare.
# [ENG] Starts a repeated search loop until the user decides to continue.
do {
    # [ITA] Pulisce la console prima di iniziare una nuova ricerca.
    # [ENG] Clears the console before starting a new search.
    Clear-Host
    # [ITA] Imposta il titolo della finestra di input per la ricerca globale.
    # [ENG] Sets the title of the input dialog for the global search.
    $titolo = "Ricerca Globale Contenuto"
    # [ITA] Imposta il messaggio mostrato nella finestra di input.
    # [ENG] Sets the prompt shown in the input dialog.
    $prompt = "Inserisci la stringa da cercare (qualsiasi carattere/simbolo):"
    # [ITA] Apre la finestra di input e memorizza il testo inserito dall'utente.
    # [ENG] Opens the input dialog and stores the text entered by the user.
    $testoCercato = [Microsoft.VisualBasic.Interaction]::InputBox($prompt, $titolo, "")
    # [ITA] Controlla se l'utente ha annullato la ricerca o lasciato il campo vuoto.
    # [ENG] Checks whether the user canceled the search or left the field empty.
    if ([string]::IsNullOrWhiteSpace($testoCercato)) {
        # [ITA] Informa l'utente che la ricerca è stata annullata.
        # [ENG] Informs the user that the search was canceled.
        Write-Host "Ricerca annullata." -ForegroundColor Yellow
        # [ITA] Termina immediatamente l'esecuzione dello script.
        # [ENG] Exits the script immediately.
        exit
    }
    # [ITA] Definisce le estensioni dei file da includere nella scansione globale.
    # [ENG] Defines the file extensions to include in the global scan.
    $estensioni = @("*.md", "*.txt", "*.ps1", "*.py", "*.vbs", "*.css", "*.js", "*.html", "*.json", "*.vba")
    # [ITA] Recupera i file della cartella corrente secondo le estensioni selezionate.
    # [ENG] Retrieves files from the current folder according to the selected extensions.
    $fileDaScansionare = Get-ChildItem -Path . -Include $estensioni -File -Recurse -ErrorAction SilentlyContinue
    # [ITA] Calcola il numero totale dei file da esaminare.
    # [ENG] Calculates the total number of files to inspect.
    $totaleFile = $fileDaScansionare.Count
    # [ITA] Inizializza il contatore dei risultati trovati.
    # [ENG] Initializes the counter of matches found.
    $fileTrovati = 0
    # [ITA] Stampa il messaggio iniziale della scansione e il testo da cercare.
    # [ENG] Prints the scan start message and the text to search for.
    Write-Host "Inizio scansione di $totaleFile file..." -ForegroundColor Cyan
    Write-Host "Cerca: '$testoCercato'" -ForegroundColor Yellow
    # [ITA] Inizia il ciclo che itera su ciascun file da controllare.
    # [ENG] Starts the loop that iterates through each file to inspect.
    for ($i = 0; $i -lt $totaleFile; $i++) {
        # [ITA] Recupera il file corrente nell'iterazione.
        # [ENG] Gets the current file in the iteration.
        $fileCorrente = $fileDaScansionare[$i]
        # [ITA] Calcola il numero progressivo del file attuale.
        # [ENG] Calculates the current file's sequential number.
        $numeroCorrente = $i + 1
        # [ITA] Aggiorna la barra di avanzamento della scansione in tempo reale.
        # [ENG] Updates the scan progress bar in real time.
        Write-Progress -Activity "Scansione in corso" -Status "File $numeroCorrente di $totaleFile" -PercentComplete (($numeroCorrente / $totaleFile) * 100)
        # [ITA] Esegue la ricerca del testo esatto nel file corrente senza usare regex.
        # [ENG] Searches for the exact text in the current file without using regex.
        $match = Select-String -LiteralPath $fileCorrente.FullName -Pattern $testoCercato -SimpleMatch -Quiet
        # [ITA] Se la corrispondenza è stata trovata nel file, procede con la segnalazione.
        # [ENG] If the match was found in the file, proceeds with the notification.
        if ($match) {
            # [ITA] Incrementa il contatore dei file trovati.
            # [ENG] Increments the counter of files found.
            $fileTrovati++
            # [ITA] Mostra il messaggio che indica il file trovato all'interno della scansione.
            # [ENG] Shows the message indicating the file found during the scan.
            Write-Host "`n[TROVATO] File $numeroCorrente di $totaleFile" -ForegroundColor Green
            # [ITA] Stampa il percorso assoluto del file trovato.
            # [ENG] Prints the absolute path of the found file.
            Write-Host "Percorso: $($fileCorrente.FullName)" -ForegroundColor White
            # [ITA] Apre automaticamente il file rilevato in Notepad.
            # [ENG] Automatically opens the detected file in Notepad.
            Start-Process "notepad.exe" -ArgumentList "`"$($fileCorrente.FullName)`""
        }
    }
    # [ITA] Stampa una linea di separazione prima del resoconto finale.
    # [ENG] Prints a separator line before the final summary.
    Write-Host "`n---------------------------------------" -ForegroundColor Cyan
    # [ITA] Mostra il numero totale dei file trovati nella sessione corrente.
    # [ENG] Shows the total number of files found in the current session.
    Write-Host "Ricerca terminata. File totali trovati: $fileTrovati" -ForegroundColor Yellow
    # [ITA] Chiede all'utente se vuole avviare una nuova ricerca.
    # [ENG] Asks the user whether they want to start a new search.
    $risposta = Read-Host "`nNuova ricerca? (si/no)"
# [ITA] Ripete il blocco di ricerca finché l'utente risponde in modo positivo.
# [ENG] Repeats the search block while the user answers positively.
} while ($risposta -eq "si" -or $risposta -eq "s")
# [ITA] Informa l'utente che lo script è terminato correttamente.
# [ENG] Informs the user that the script ended successfully.
Write-Host "Script terminato." -ForegroundColor White
# [ITA] Attende che l'utente prema INVIO prima di chiudere il terminale.
# [ENG] Waits for the user to press Enter before closing the terminal.
Read-Host "`nPremere INVIO per uscire definitivamente..."