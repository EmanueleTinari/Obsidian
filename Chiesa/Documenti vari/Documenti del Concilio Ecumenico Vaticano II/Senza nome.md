---
creato: 2025/06/22 23:53:15
modificato: 2025/11/23 22:27:31
---

# DOCUMENTI DEL CONCILIO VATICANO II

![[_02 - Allegati/Concilio_Ecumenico_Vaticano_II.jpg|Concilio Vaticano II|370]]



```dataviewjs
async function main() {
	// Formatta data
	function formatDate(d){
		if(!d) return "";
		const dt = new Date(d);
		if(isNaN(dt)) return d;
		return dt.toLocaleDateString("it-IT",{ day:"2-digit", month:"long", year:"numeric"});
	}
	// Estrae testo dopo il frontmatter e prima del primo H2 ("##")
	function extractPreH1Text(fileContent) {
		if (!fileContent) return "";
		const lines = fileContent.split(/\r?\n/);
		let startIndex = 0;
		// Se il file inizia con frontmatter '---', trova la chiusura
		if (lines[0] && lines[0].trim() === '---') {
			let fmEnd = -1;
			for (let i = 1; i < lines.length; i++) {
				if (lines[i].trim() === '---') {
					fmEnd = i;
					break;
				}
			}
			startIndex = (fmEnd === -1) ? 0 : fmEnd + 1;
		}
		// Raccogli tutte le righe fino alla prima riga che inizia con '# '
		const out = [];
		for (let i = startIndex; i < lines.length; i++) {
			const line = lines[i];
			if (/^#\s/.test(line)) break; // stop al primo H1
			out.push(line);
		}
		// Trim righe vuote iniziali/finali
		while (out.length && out[0].trim() === '') out.shift();
		while (out.length && out[out.length - 1].trim() === '') out.pop();
		return out.join('\n').trim();
	}
	// Recupera e normalizza le pagine in array
	const pages = Array.from(dv.pages('"Documenti vari/Documenti del Concilio Ecumenico Vaticano II"')
		.where(p => p["titolo-doc"] || p.file));
	// Crea righe semplificate
	const rows = pages.map(p => ({
		titolo: p["titolo-doc"],
		data: p["data-doc"],
		file: p.file,
		tipo: p["tipo-doc"]
	}));
	// Funzione helper: ottiene il nome del gruppo da diversi formati di input
	function resolveTipoGroup(tipo) {
		if (!tipo) return "Altro";
		// caso: oggetto link Dataview (ha .path)
		if (typeof tipo === "object" && tipo.path) {
			return String(tipo.path).split("|")[0] || String(tipo);
		}
		// caso: stringa wikilink tipo "[[Costituzioni|Costituzione]]" o semplice stringa
		if (typeof tipo === "string") {
			// prova a estrarre la parte sinistra di wikilink [[left|right]]
			const m = tipo.match(/\[\[([^|\]]+)(?:\|[^]]+)?\]\]/);
			if (m) return m[1];
			// prova se è già "Costituzioni|Costituzione"
			if (tipo.includes("|")) return tipo.split("|")[0].trim();
			return tipo.trim();
		}
		// fallback generico
		return String(tipo);
	}
	// Raggruppa in modo robusto
	const grouped = {};
	try {
		rows.forEach(r => {
			let groupName = resolveTipoGroup(r.tipo) || "Altro";
			// unisci i gruppi che contengono "Costituzioni"
			if (groupName.includes("Costituzioni")) groupName = "Costituzioni";
			if (!grouped[groupName]) grouped[groupName] = [];
			grouped[groupName].push(r);
		});
	} catch (err) {
		console.error("Errore nel raggruppamento dei documenti:", err);
		// In caso di errore, metti tutto in "Altro"
		grouped["Altro"] = rows;
	}
	// Ordina i gruppi alfabeticamente
	const sortedGroups = Object.keys(grouped).sort((a, b) => a.localeCompare(b, "it"));
	// Per ogni gruppo, ordina le righe per titolo e poi per data
	for (const group of sortedGroups) {
		const items = grouped[group];
		if (!items) continue;
		// Ordinamento: titolo asc, poi data asc
		items.sort((x, y) => {
			const titleCompare = x.titolo.localeCompare(y.titolo, "it");
			if (titleCompare !== 0) return titleCompare;
			return new Date(x.data) - new Date(y.data);
		});
		// ...qui costruisci la tabella o visualizzazione come prima
	}
	// Crea tabella HTML per ogni gruppo
	for(const group of sortedGroups){
		const items = grouped[group];
		if(!items) continue;
		dv.header(3, `${group} (${items.length})`);
		dv.paragraph("***");
		// crea tabella HTML
		const table = document.createElement("table");
		table.style.border = "0px"; // rimuove il bordo esterno
		table.style.borderCollapse = "collapse";
		table.style.width = "100%";
		// THEAD con stile
		const thead = table.createTHead();
		const headerRow = thead.insertRow();
		["Titolo","Data","File","Testo iniziale"].forEach(h=>{
			const th = document.createElement("th");
			th.textContent = h;
			th.style.border = "0px solid #ddd";
			th.style.padding = "4px";
			th.style.textAlign = "center"; // testo centrato
			th.style.color = "#cce5ff"; // blu chiaro
			th.style.fontWeight = "bold";
			headerRow.appendChild(th);
		});
		const tbody = table.createTBody();
		for(const i of items){
			const row = tbody.insertRow();
			// Titolo (usa i campi normalizzati, fallback al frontmatter se necessario)
			const cellTit = row.insertCell();
			cellTit.style.border = "0px solid #ddd";
			cellTit.style.padding = "4px";
			const resolvedTipo = resolveTipoGroup(i.tipo || (i.file && i.file.frontmatter && i.file.frontmatter["tipo-doc"]));
			const titoloVal = i.titolo ?? (i.file && i.file.frontmatter && i.file.frontmatter["titolo-doc"]) ?? "";
			cellTit.innerHTML = resolvedTipo.includes("Dogmatica")
				? `<strong>Dogmatica ${titoloVal}</strong>`
				: titoloVal;
			// Data
			const cellData = row.insertCell();
			cellData.style.textAlign = "center";
			cellData.style.border = "0px solid #ddd";
			cellData.style.padding = "4px";
			cellData.textContent = formatDate(i.data);
			// File
			const cellFile = row.insertCell();
			cellFile.style.textAlign = "center";
			cellFile.style.border = "0px solid #ddd";
			cellFile.style.padding = "4px";
			const fileName = i.file.name.replace(/\.md$/,"");
			cellFile.innerHTML = `<a href="obsidian://open?vault=${encodeURIComponent(app.vault.getName())}&file=${encodeURIComponent(i.file.path)}">${fileName}</a>`;
			// Testo prima di H1 (usando await)
			const content = await i.file.read();
			const cellPreH1 = row.insertCell();
			cellPreH1.style.border = "0px solid #ddd";
			cellPreH1.style.padding = "4px";
			cellPreH1.textContent = extractPreH1Text(content);
		}
		dv.el("div", table); // <---- fuori dal ciclo delle righe
	}
}
main();
```



[[Documenti vari/Documenti del Concilio Ecumenico Vaticano I/1870-04-24_cevi-cos-def|Dei Filius]] (24 aprile 1870)
[[Documenti vari/Documenti del Concilio Ecumenico Vaticano I/1870-04-24_cevi-cos-def#CAPITOLO I.<BR>DIO CREATORE DI TUTTE LE COSE|Dei Filius, Cap. I]] (24 aprile 1870)
[[Documenti vari/Documenti del Concilio Ecumenico Vaticano I/1870-04-24_cevi-cos-def#CAPITOLO II.<BR>LA RIVELAZIONE|Dei Filius, Cap. II]] (24 aprile 1870)
[[Documenti vari/Documenti del Concilio Ecumenico Vaticano I/1870-04-24_cevi-cos-def#CAPITOLO III.<br>LA FEDE|Dei Filius, Cap. III]] (24 aprile 1870)
[[Documenti vari/Documenti del Concilio Ecumenico Vaticano I/1870-04-24_cevi-cos-def#CAPITOLO IV.<br>DELLA FEDE E DELLA RAGIONE|Dei Filius, Cap. IV]] (24 aprile 1870)
[[Documenti vari/Documenti del Concilio Ecumenico Vaticano I/1870-04-24_cevi-cos-def#Canone I.<br>Di Dio creatore di tutte le cose|Dei Filius, Canone 1]] (24 aprile 1870)
[[Documenti vari/Documenti del Concilio Ecumenico Vaticano I/1870-04-24_cevi-cos-def#Canone II.<br>Della Rivelazione|Dei Filius, Canone 2]] (24 aprile 1870)
[[Documenti vari/Documenti del Concilio Ecumenico Vaticano I/1870-04-24_cevi-cos-def#Canone III.<br>Della Fede|Dei Filius, Canone 3]] (24 aprile 1870)
[[Documenti vari/Documenti del Concilio Ecumenico Vaticano I/1870-04-24_cevi-cos-def#Canone IV.<br>Fede e Ragione|Dei Filius, Canone 4]] (24 aprile 1870)


[[Documenti vari/Documenti del Concilio Ecumenico Vaticano I/1870-07-18_cevi-cos-paa|Pastor Aeternus]] (18 luglio 1870)
[[Documenti vari/Documenti del Concilio Ecumenico Vaticano I/1870-07-18_cevi-cos-paa#CAPITOLO II.<BR>PERPETUITÀ DEL PRIMATO DEL BEATO PIETRO NEI ROMANI PONTEFICI|Pastor Aeternus, capitolo 2]] (18 luglio 1870)
[[Documenti vari/Documenti del Concilio Ecumenico Vaticano I/1870-07-18_cevi-cos-paa#CAPITOLO III.<BR>DELLA FORZA E DELLA NATURA DEL PRIMATO DEL ROMANO PONTEFICE|Pastor Aeternus, capitolo 3]] (18 luglio 1870)
[[Documenti vari/Documenti del Concilio Ecumenico Vaticano I/1870-07-18_cevi-cos-paa#CAPITOLO IV.<BR>DEL MAGISTERO INFALLIBILE DEL ROMANO PONTEFICE|Pastor Aeternus, capitolo 4]] (18 luglio 1870)
