---
creato: 2026/01/03 18:44:23
modificato: 2026/01/03 18:45:40
---


```dataviewjs
// Definisci la classe CSS specifica per questo report mensile
dv.container.classList.add("martirologio-mensile");
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
// --- Determinazione del Mese ---
// Assumiamo che il file ospitante si chiami "Martirologio gennaio.md"
const activeFile = app.workspace.getActiveFile();
console.log(activeFile.basename);
const fileNameLower = activeFile.basename.toLowerCase();
console.log(fileNameLower);
let MeseCorrente = "";
let NumeroMeseCorrente = "";
// Cerca il nome del mese nel nome del file ospitante
for (let i = 0; i < NomiMesi.length; i++) {
    if (fileNameLower.includes(NomiMesi[i].toLowerCase())) {
        MeseCorrente = NomiMesi[i];
		console.log(MeseCorrente);
        // Formatta il numero del mese come stringa "01", "02", ecc.
        NumeroMeseCorrente = (i + 1).toString().padStart(2, '0');
		console.log(NumeroMeseCorrente);
        break;
    }
}
if (!MeseCorrente) {
    dv.paragraph("Errore: impossibile determinare il mese dal nome del file ospitante. Assicurati che il nome contenga il nome del mese, es: 'Martirologio gennaio.md'");
}
else {
    // --- Query Dataview Principale ---
    const cartellaMese = `"Santi/${NumeroMeseCorrente}"`;
    const tutteLePagineDelMese = dv.pages(cartellaMese)
        // Esclude i file indice giornalieri (es. 01-01.md) che sono esattamente di 5 caratteri
        .where(p => p.file.name.length > 5); 
    // --- Raggruppamento per Giorno ---
    const santiPerGiorno = {};
    tutteLePagineDelMese.forEach(p => {
        // Estrae la stringa MM-GG dal nome del file (primi 5 caratteri)
        const sString = p.file.name.substring(0, 5);
        // Verifica che la stringa estratta sia nel formato corretto MM-GG
        if (!/^\d{2}-\d{2}/.test(sString)) {
            return; // Salta questo file se il nome non inizia con MM-GG
        }
        // Estrae il giorno "01", "02" dalla stringa MM-GG (caratteri dopo il trattino)
        const giorno = sString.substring(3);
        if (giorno) {
            if (!santiPerGiorno[giorno]) {
                santiPerGiorno[giorno] = [];
            }
            // Funzione per trovare l'alias più lungo
            const getLongestAlias = (aliases) => {
                if (!aliases || aliases.length === 0) return p.file.name;
                return aliases.reduce((a, b) => a.length > b.length ? a : b);
            };
            const nomeVisualizzato = getLongestAlias(p.aliases) || p.nome || p.file.name;
            santiPerGiorno[giorno].push({
                nome: nomeVisualizzato,
                path: p.file.path,
                // Assicura che la posizione esista per l'ordinamento
                posizione: p['posizione martirologio'] || 999 
            });
        }
    });
	// --- Generazione della Lista Mensile con Tabella HTML a 3 Colonne ---
	// --- Generazione della Tabella/Lista Finale ---
    dv.header(1, `Santi del Mese di<br>${MeseCorrente.charAt(0).toUpperCase() + MeseCorrente.slice(1)}`);
    // Ordina i giorni (le chiavi dell'oggetto santiPerGiorno)
    const giorniOrdinati = Object.keys(santiPerGiorno).sort();
    // Iterazione per visualizzare i risultati
    for (const giorno of giorniOrdinati) {
        // Costruisce il percorso completo alla nota del giorno (es. Santi/01/01-01.md)
        const pathGiorno = `Santi/Martirologio/${NumeroMeseCorrente}/${NumeroMeseCorrente}-${giorno}`;
        // Crea il link al file del giorno (es. [[01-01|01 gennaio]])
		const linkGiorno = `<a href="${pathGiorno}" class="internal-link">${giorno} ${MeseCorrente}</a>`;
        // --- ORDINAMENTO COMPLESSO ---
        // Ordina i santi all'interno del giorno...
        santiPerGiorno[giorno].sort((a, b) => {
            // 1. Confronta prima la posizione martirologio
            if (a.posizione !== b.posizione) {
				return a.posizione - b.posizione;
			}	
            // 2. Se le posizioni sono uguali (es. entrambi 999), ordina alfabeticamente per nome
            // localeCompare gestisce correttamente lettere accentate e differenze San/Santa/Santi
            return a.nome.localeCompare(b.nome);
        });
        let htmlTable = `<table style="border:none; border-collapse:collapse; background:transparent; width:100%; margin-bottom:20px; font-size: 0.95em;">`;
        santiPerGiorno[giorno].forEach((santo, index) => {
            // Colonna 1: Mostra il giorno SOLO nella prima riga del gruppo
            const colGiorno = (index === 0) ? `${linkGiorno} :` : "";
            // Colonna 2: Numero martirologio (vuoto se 999)
            const posCell = santo.posizione === 999 ? "" : `${santo.posizione}`;
            // Colonna 3: Nome del santo
            const linkSanto = `<a href="${santo.path}" class="internal-link">${santo.nome}</a>`;
            htmlTable += `
                <tr style="border:none; background:transparent; vertical-align: top;">
                    <td style="border:none; padding: 2px 15px 2px 0; white-space: nowrap; width: 150px;">${colGiorno}</td>
					<td style="border:none; padding: 4px 10px 2px 0; text-align: right; width: 30px; color: lightgray; font-size: 0.85em; vertical-align: bottom;">${posCell}</td>
                    <td style="border:none; padding: 2px 0;">${linkSanto}</td>
                </tr>`;
        });
        htmlTable += `</table>`;
		dv.paragraph(htmlTable);
    }
}
```
