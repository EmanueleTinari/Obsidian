---
creato: 2025/07/10 13:37:40
modificato: 2026/01/05 16:57:34
---

```dataviewjs
// 1. Recupero dati generale
let allPages = dv.pages('"Santi"');
// 2. Funzione per generare la tabella HTML pulita
function generaTabellaSanti(titolo, filtroRegex, intestazioneColonna) {
	let filtered = allPages.filter(p => p.file.name.match(filtroRegex));
	let total = filtered.length;
	// Titolo H1 Rosso
	dv.el("div", `<h1 style="color: #FF0000 !important; font-size: 150% !important; text-align: center !important; margin-top: 20px !important;">${titolo} (File creati: ${total})</h1>`);
	let groups = filtered.groupBy(p => {
		let m = p.file.name.match(/^(\d{1,2})-(\d{1,2})/);
		return m ? m[1] + "-" + m[2] : "0-0";
	}).sort(g => {
		let p = g.key.split("-").map(Number);
		return (p[0] * 100) + p[1];
	}, "asc");
	let html = `<table class="dataview table-view-table">
		<thead>
			<tr>
				<th style="color: var(--text-accent); text-align: center;">Giorno<br>e Mese</th>
				<th style="color: var(--text-accent); text-align: center;">${intestazioneColonna}</th>
				<th style="color: var(--text-accent); text-align: center;">File del<br>Giorno</th>
			</tr>
		</thead>
		<tbody>`;
			let rigaContatore = 0; // Contatore globale per l'alternanza colori

	groups.forEach((g) => {
		let p = g.key.split("-").map(Number);
		let mesi = ["", "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
		let dataFormattata = p[1] + " " + mesi[p[0]];

		let sortedRows = [...g.rows].sort((a, b) => {
			let nameA = a.file ? a.file.name : "";
			let nameB = b.file ? b.file.name : "";
			if (nameA.includes(" - S") && nameB.includes(" - B")) return -1;
			if (nameA.includes(" - B") && nameB.includes(" - S")) return 1;
			return nameA.localeCompare(nameB);
		});
		sortedRows.forEach((r, i) => {
			// Definisce il colore: azzurrino per righe dispari, trasparente per pari
			let bgColor = (rigaContatore % 2 !== 0) ? "rgba(173, 216, 230, 0.04)" : "transparent";
			// Data e totale appaiono solo sulla prima riga del gruppo giorno
			let cellaData = (i === 0) ? `<td style="white-space: nowrap; vertical-align: top; padding: 8px 5px; font-weight: bold; border-bottom: 0.1px solid rgba(128, 128, 128, 0.1);">${dataFormattata}</td>` : `<td style="border-bottom: 0.1px solid rgba(128, 128, 128, 0.1);"></td>`;
			let cellaTotale = (i === 0) ? `<td style="text-align: center; vertical-align: top; padding: 8px 5px; font-weight: bold; border-bottom: 0.1px solid rgba(128, 128, 128, 0.1);">${g.rows.length}</td>` : `<td style="border-bottom: 0.1px solid rgba(128, 128, 128, 0.1);"></td>`;
			// Bordo inferiore: più marcato se è l'ultimo file del giorno
			let borderStyle = (i === sortedRows.length - 1) 
				? "border-bottom: 2px solid var(--background-modifier-border);" 
				: "border-bottom: 0.1px solid rgba(128, 128, 128, 0.2);";

			html += `<tr style="background-color: ${bgColor}; ${borderStyle}">
				${cellaData}
				<td style="padding: 8px 5px; border-bottom: inherit;"><a class="internal-link" href="${r.file.name}">${r.file.name}</a></td>
				${cellaTotale}
			</tr>`;
			rigaContatore++; // Incrementa per il file successivo
		});
	});
	html += `</tbody></table>`;
	dv.el("div", html);
}
// 3. Esecuzione delle tre tabelle
generaTabellaSanti("Santi e Beati", /^\d{1,2}-\d{1,2} - [SB]/, "File dei Santi e dei Beati<br>già creati");
generaTabellaSanti("Santi", /^\d{1,2}-\d{1,2} - S/, "File dei Santi<br>già creati");
generaTabellaSanti("Beati", /^\d{1,2}-\d{1,2} - B/, "File dei Beati<br>già creati");
```


