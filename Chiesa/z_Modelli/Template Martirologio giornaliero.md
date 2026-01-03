---
creato: 2025/12/12 00:01:47
modificato: 2025/12/13 00:35:06
---


```dataviewjs
// Dizionario per convertire numeri del mese in nomi
const NomiMesi = [
	"Gennaio",
	"Febbraio",
	"Marzo",
	"Aprile",
	"Maggio",
	"Giugno",
	"Luglio",
	"Agosto",
	"Settembre",
	"Ottobre",
	"Novembre",
	"Dicembre"
];
// --- Trova il file Attivo/Ospitante ---
// Questo hack ci permette di accedere al file che *contiene* la transclusione, 
const activeFile = app.workspace.getActiveFile();
// Rimuove l'estensione .md dal nome del file attivo immediatamente
// Es. "07-27"
const fileName = activeFile.basename.replace('.md', ''); 
const noteTitle = "Santi e Beati per il giorno\<br\>";
// Assumiamo che il nome del file sia sempre MM-GG
const parts = fileName.split('-'); 
// "07"
const NumeroMese = parts[0];
// "27"
const NumeroGiorno = parts[1];
const NomeMese = NomiMesi[parseInt(NumeroMese, 10) - 1];
const searchString = `${NumeroMese}-${NumeroGiorno}`;
const TitoloFormattato = `${noteTitle} ${NumeroGiorno} ${NomeMese}`;
// --- Output Intestazione Principale ---
dv.header(1, TitoloFormattato.replace('.md', ''));
if (NumeroGiorno && NumeroMese && searchString) {
	// Costruisci il percorso dinamico esatto: "Santi/01", "Santi/07", etc.
	const cartellaMese = `"Santi/${NumeroMese}"`;
	// Esegui la query per trovare le pagine dei santi SOLO in quella cartella
	const pages = dv.pages(cartellaMese)
		// Condizione 1: Il nome del file deve includere "MM-GG" (es. "07-27 - Nome Santo.md")
		.where(p => p.file.name.includes(searchString))
		// Condizione 2: NON deve essere il file attualmente aperto (esclude 07-27.md)
		.where(p => p.file.path !== activeFile.path)
		.sort(p => p['posizione martirologio'], 'asc');
	// --- Logica di Visualizzazione per ogni Santo ---
	if (pages.length > 0) {
		// Iterazione sui santi
		for (const p of pages) {
			const prefisso = p.prefisso || '';
			const nome = p.nome;
			let nomeCompleto;
			// Controlla il campo 'apostrofato' (che deve essere un booleano: true/false)
			if (p.apostrofato === true) {
				// Concatenazione con apostrofo curvo, senza spazi: es. L’Aquila
				nomeCompleto = `${prefisso}${nome}`; 
			}
			else {
				// Concatenazione con spazio: es. San Pantaleone
				nomeCompleto = `${prefisso} ${nome}`;
			}
			// Crea l'H2 con il link cliccabile e il nome formattato
			dv.header(2, `[[${p.file.path}|${nomeCompleto}]]`);
			// --- ESTRAZIONE E GESTIONE DEI BLOCCHI TESTUALI ---
			const file = app.vault.getAbstractFileByPath(p.file.path);
			const content = await app.vault.read(file);
			const cleanContent = content.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
			// Variabili per i 3 blocchi
			let testo_mar = "";
			let testo_iag = "";
			let testo_nae = "";
			// Funzione helper per estrarre il testo con una regex specifica
			const estraiTesto = (titolo, contenuto) => {
				// Regex tollerante: cattura da "## Titolo" fino alla fine del file, senza vincoli
				const regex = new RegExp(`##\\s*${titolo}\\s*\\n([\\s\\S]*?)$`, 'gm');
				const match = regex.exec(contenuto);
				if (match && match.length > 0) {
					// Correzione: match[1] è la stringa catturata dal primo gruppo
					let cleanedText = match[1].trim(); 
					// 1. Pulisci la fonte [Testo](URL) (ignora spazi/newline che la seguono)
					cleanedText = cleanedText.replace(/\[.*?\]\(.*\)\s*$/gm, '').trim();
					// 2. Pulisci la riga orizzontale (***) (ignora spazi/newline che la seguono)
					cleanedText = cleanedText.replace(/^[*\-]{3,}\s*$/gm, '').trim();
					// 3. Normalizza righe vuote in eccesso
					cleanedText = cleanedText.replace(/\n\s*\n/g, "\n\n").trim();
					return cleanedText;
				}
				return "";
			};
			// Popola le 3 variabili
			testo_mar = estraiTesto("Dal Martirologio", cleanContent);
			testo_iag = estraiTesto("Informazioni aggiuntive", cleanContent);
			testo_nae = estraiTesto("Nota agiografica estesa", cleanContent);
			// --- Logica di visualizzazione complessa e prioritaria ---
			// Funzione helper per formattare il testo per i callout annidati
			const formatForCallout = (text) => {
				if (!text) return "";
				// Assicura che ogni riga abbia il "> " necessario per essere nel callout
				return text.replace(/\n/g, "\n> ");
			};
			// 1. Priorità massima: testo_mar (visualizzato normale)
			if (testo_mar.length > 0) {
				dv.paragraph(testo_mar);
				// Se testo_mar esiste, controlliamo se ci sono gli altri due per un UNICO callout annidato
				if (testo_iag.length > 0 || testo_nae.length > 0) {
					let contenuto_annidato = "";
					if (testo_iag.length > 0) {
						// Creiamo un sotto-callout per IAG
						// Nota: per l'annidamento serve "> > "
						contenuto_annidato += `>> [!Info]- Informazioni aggiuntive\n> > ${formatForCallout(testo_iag)}\n`;
						// Riga vuota per chiudere il blocco IAG prima del prossimo blocco o della fine del contenitore
						contenuto_annidato += `>>\n>\n`; 
					}
					if (testo_nae.length > 0) {
						// Creiamo un sotto-callout per NAE
						// Nota: per l'annidamento serve "> > "
						contenuto_annidato += `>> [!Note]- Nota agiografica estesa\n> > ${formatForCallout(testo_nae)}\n`;
						// Riga vuota per chiudere il blocco NAE
						contenuto_annidato += `>>\n>\n`;
					}
					// Avvolgiamo tutto nel callout principale Martirologio
					const calloutPrincipale = `> [!Martirologio]- Dettagli aggiuntivi\n${contenuto_annidato}\n`;
					dv.paragraph(calloutPrincipale);
				}
			} 
			// 2. Seconda priorità: testo_iag (visualizzato normale, NAE in callout)
			else if (testo_iag.length > 0) {
				dv.paragraph(testo_iag);
				if (testo_nae.length > 0) {
					// Solo NAE in un singolo callout (non annidato)
					const calloutNAE = `> [!Note]- Nota agiografica estesa\n> ${formatForCallout(testo_nae)}`;
					dv.paragraph(calloutNAE);
				}
			} 
			// 3. Terza priorità: testo_nae (visualizzato normale, nessun callout)
			else if (testo_nae.length > 0) {
				dv.paragraph(testo_nae);
			} 
			// 4. Nessun testo disponibile
			else {
				dv.paragraph("*Nessuna informazione testuale disponibile per questo santo.*");
			}
		} // Chiusura del loop for (const p of pages)
	}
	else {
		dv.paragraph(`Nessun santo trovato per il giorno ${NumeroGiorno} ${NomeMese}.`);
	}
	
}
else {
	dv.paragraph("Errore: impossibile estrarre giorno e mese dal nome del file: " + fileName);
}
```
