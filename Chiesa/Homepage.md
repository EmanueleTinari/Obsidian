---
cssclasses: interfaccia
nomeFile: "Homepage.md"
creato: 2026/03/16 13:59:55
modificato: 2026/07/18 08:39:09
---


```dataviewjs
// Mappa delle estensioni Windows-style
const winNames = {
	// Documenti e Testo
	"md": ["File di Markdown", "(*.md)"],
	"pdf": ["File di Adobe Acrobat", "(*.pdf)"],
	"txt": ["Documento di testo", "(*.txt)"],
	"docx": ["File di Microsoft Word", "(*.docx)"],
	"doc": ["File di Microsoft Word 97-2003", "(*.doc)"],
	"xlsx": ["File di Microsoft Excel", "(*.xlsx)"],
	"xlsm": ["File di Microsoft Excel con attivazione macro", "(*.xlsm)"],
	"xls": ["File di Microsoft Excel 97-2003", "(*.xls)"],
	"csv": ["File di valori separati da virgola Microsoft Excel", "(*.csv)"],
	"pub": ["File di Microsoft Publisher", "(*.pub)"],
	"rtf": ["Formato Rich Text", "(*.rtf)"],
	"epub": ["File EPUB", "(*.epub)"],
	// Immagini e Media
	"jpg": ["Immagine JPEG", "(*.jpg)"],
	"jpeg": ["Immagine JPEG", "(*.jpeg)"],
	"png": ["Immagine PNG", "(*.png)"],
	"gif": ["Immagine GIF", "(*.gif)"],
	"svg": ["Immagine Scalable Vector Graphics", "(*.svg)"],
	"webp": ["Immagine WebP", "(*.webp)"],
	"mp3": ["File MP3", "(*.mp3)"],
	"mp4": ["Video MP4", "(*.mp4)"],
	// Programmazione e Web
	"py": ["File di script Python", "(*.py)"],
	"js": ["File di script JavaScript", "(*.js)"],
	"html": ["Firefox HTML Document", "(*.html)"],
	"css": ["Foglio di stile", "(*.css)"],
	"json": ["File JSON", "(*.json)"],
	"ps1": ["Script di Windows PowerShell", "(*.ps1)"],
	"bat": ["File batch di Windows", "(*.bat)"],
	"cpp": ["C++ Source File", "(*.cpp)"],
	// Archivi e Sistema
	"7z": ["Archivio 7Zip", "(*.7z)"],
	"zip": ["Archivio Zip", "(*.zip)"],
	"rar": ["Archivio WinRAR", "(*.rar)"],
	"tmp": ["File temporaneo", "(*.tmp)"],
	"canvas": ["Obsidian Canvas", "(*.canvas)"]
};
const comandiRapidi = [
	{	id: "app:toggle-left-sidebar",
		label: "Apri/Chidi barra laterale SINISTRA" },
	{	id: "file-explorer:new-file",
		label: "Crea nuovo file (Ctrl + N)" },
	{	id: "app:toggle-right-sidebar",
		label: "Apri/Chidi barra laterale DESTRA" },
	{	id: "switcher:open",
		label: "Vai al file (Ctrl + O)" },
	{	id: "webviewer:open",
		label: "Visualizzatore web"	},
	{	id: "workspace:close",
		label: "Chiudi" },
	{	id: "app:open-settings",
		label: "Impostazioni" }
];
(async () => {
	// Funzione principale per aggiornare le statistiche
	const updateStats = async () => {
		// Recupera tutti i file del vault
		const allFiles = app.vault.getFiles();
		const stats = {};
		allFiles.forEach(f => {
			const ext = (f.extension || "N. A.").toLowerCase();
			if (!stats[ext]) stats[ext] = { count: 0, size: 0 };
			stats[ext].count++;
			stats[ext].size += f.stat.size;
		});
		// Costruzione contenuto interno
		let htmlContent = "";
		const sortedStats = Object.entries(stats).sort((a, b) => b[1].count - a[1].count);
		// Inizio contenitore
		// Usiamo display: grid per simulare la tabella senza rompere il parser
		htmlContent = `> <div style="border: 0.05rem solid var(--background-modifier-border); display: grid; grid-template-columns: auto 1fr auto auto; margin-left: 1.2rem; margin-top: 2rem; width: fit-content;">\n`;
		// Ordina le estensioni per numero di file decrescente
		for (const [ext, data] of sortedStats) {
			// Micro-delay mantenuto per stabilità rendering
			await new Promise(r => setTimeout(r, 25));
			const [nome, estensione] = winNames[ext] || [`File ${ext.toUpperCase()}`, `*.${ext}` ];
			// Calcolo dimensioni
			const sizeKb = Math.round(data.size / 1024).toLocaleString('it-IT');
			const sizeMb = (data.size / (1024 * 1024)).toLocaleString('it-IT', {
				minimumFractionDigits: 3,
				maximumFractionDigits: 3
			});
			// Celle simulate con i div (Bordi interni inclusi)
			htmlContent += `> <div style="border: 0.05rem solid var(--background-modifier-border); padding: 0.4rem 1rem; text-align: right;">${data.count}</div>`;
			htmlContent += `<div style="border: 0.05rem solid var(--background-modifier-border); padding: 0.4rem 1rem; text-align: left;">${nome}</div>`;
			htmlContent += `<div style="border: 0.05rem solid var(--background-modifier-border); padding: 0.4rem 1rem; text-align: center;">${estensione}</div>`;
			// Colonna Dimensioni
			htmlContent += `<div style="align-items: center; border: 0.05rem solid var(--background-modifier-border); display: flex; font-family: monospace; font-size: 0.8em; justify-content: flex-end; padding: 0.5rem 1rem 0.3rem 1rem; text-align: right;">${sizeMb} MB (${sizeKb} KB)</div>\n`;
		} // Fine ciclo for
		htmlContent += `> </div>\n`;
		// Render finale (con dv.el per la stabilità del Callout)
		const totalSize = allFiles.reduce((acc, f) => acc + f.stat.size, 0);
		const totalMb = (totalSize / (1024 * 1024)).toLocaleString('it-IT', { minimumFractionDigits: 2 });
		const badge = `<span style="background: rgba(0,0,0,0.2); border-radius: 4px; color: white !important; font-weight: 400; margin-left: 0.5rem; padding: 0 1rem;">${allFiles.length} file&nbsp;&nbsp;&nbsp;&nbsp;⟶&nbsp;&nbsp;&nbsp;&nbsp;${totalMb} MB</span>`;
		// Pulisce prima di riscrivere
		dv.container.innerHTML = "";
		// Render nativo del Callout tramite dv.el
		await dv.el("div", `> [!info]- Numero totale file nel vault: ${badge}\n${htmlContent}`);
	}
// Esecuzione immediata all'apertura
(async () => {
	// Seleziona l'elemento workspace
	const workspace = document.querySelector('.workspace');
	if (!workspace) return;
	// Controlla gli stati individualmente
	const isLeftOpen = workspace.classList.contains('is-left-sidedock-open');
	const isRightOpen = workspace.classList.contains('is-right-sidedock-open');
	// Esegue le azioni necessarie
	if (isLeftOpen) {
		app.commands.executeCommandById('app:toggle-left-sidebar');
	}
	if (isRightOpen) {
		app.commands.executeCommandById('app:toggle-right-sidebar');
	}
	// Esegue le righe comuni
	await new Promise(r => setTimeout(r, 50));
	if (typeof updateStats === 'function') {
		await updateStats();
	}
	// Registrazione eventi sul componente per evitare memory leak
	const component = dv.container.component;
	if (component) {
		component.registerDomEvent(window, 'focus', () => updateStats());
		component.registerDomEvent(window, 'blur', () => updateStats());
	}
	// --- BLOCCO LINK STATICI ---
	const containerAzioni = dv.container.createEl("div", {
		cls: `empty-state-container`,
		attr: {
			style: `
				border: 0.1rem solid var(--background-modifier-border);
				margin: 0.5rem auto;
				max-width: 100%;
				padding: 1rem;
				width: fit-content;
			`
		}
	});
	// Iniezione nel DOM della nota
	const listActions = containerAzioni.createEl("div", {
		cls: `empty-state-action-list`,
		attr: {
			style: `
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 0rem 1rem;
				text-align: left;
			`
		}
	});
	comandiRapidi.forEach(cmd => {
		const btn = listActions.createEl("div", {
			cls: "empty-state-action tappable",
			text: cmd.label,
			attr: {
				"data-id": cmd.id,
				style: `
					align-items: center;
					color: var(--text-accent);
					cursor: pointer;
					font-size: 0.9em;
					display: flex;
				`
			}
		});
		// Aggiunge il bullet manuale prima del testo
		btn.innerHTML = `<span style="color: var(--text-muted); margin-right: 0.5rem;">•</span> ${cmd.label}`;
		// Attacco del Listener agli elementi appena creati
		btn.addEventListener('click', (e) => {
			e.preventDefault();
			// Esegue il comando intercettato prima
			app.commands.executeCommandById(cmd.id);
		});
	});
	// --- FINE BLOCCO LINK STATICI ---
})();
})();
```


> [!info]+ Operazioni quotidiane<div style="position: absolute; left: 50%; transform: translateX(-50%); color: white !important; white-space: nowrap;"><font style="font-size: 1.5em;"></font></div>
> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-left: 5em; margin-top: 0em;">
>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] [[_Utilità Dataviewjs/Scraper per i documenti Leone XIV su vatican-va|Nuovo documento Papa Leone XIV]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] [[_Utilità Dataviewjs/Scraper per i documenti pontefici passati su vatican-va|Nuovo documento pontefice passato]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] [[_Utilità Dataviewjs/Caricamento nuovo canto|Nuovo canto per le Liturgie]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] [[_Utilità Dataviewjs/Caricamento nuovo messaggio|Nuovo messaggio di Medjugorje]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] Santo del giorno
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] Messalino del giorno
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] Carica un nuovo capitolo della Sacra Bibbia
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] [[_Utilità Dataviewjs/Scraper per i testi su augustinus-it|Nuovo scritto Sant’Agostino]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] [[_Utilità Dataviewjs/Scraper per i documenti pontefici passati su vatican-va valori dalla Clipboard|Nuovo documento pontificio, valori dalla Clipboard]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [ ] [[_Utilità Dataviewjs/Scraper per il sito valtortamaria-it|Nuovo capitolo Opera Maria Valtorta]]
>
> </div></div>
> </div>


<figure style="border-left: 2px solid var(--interactive-accent); margin: 2.5rem 0; padding-left: 1rem;">
	<blockquote style="border: none; color: rgb(255, 190, 92); font-family: 'citazioneCorsivo', serif; font-size: 2rem; font-style: normal; letter-spacing: 0.1rem; line-height: 1.1; margin: 0; padding: 0;">
		“Io non perseguito l’eretico nel corpo, ma gli faccio guerra con le parole – e non contro l’eretico, ma solo contro la sua eresia: non disprezzo l’uomo; è l’errore che odio, e che cerco di espellere da lui…<br>Sono abituato a essere perseguitato, non a perseguitare gli altri…<br>Così ha trionfato Cristo; Lui non ha crocifisso, ma è Lui invece che è stato crocifisso.<br>Non ha percosso gli altri, ma è Lui ad essere stato percosso.”
	</blockquote>
	<figcaption style="color: var(--text-muted); font-size: 1rem; font-weight: 400; margin-top: 0.8rem; text-align: right;">
	<span style="font-weight: 400;">– San Giovanni Crisostomo<br></span>
		<cite style="font-style: italic; opacity: 0.8;">PG 50, 701</cite>
	</figcaption>
</figure>


> [!info]+ Indici dei documenti pontifici<div style="position: absolute; left: 50%; transform: translateX(-50%); color: white !important; white-space: nowrap;"><font style="font-size: 1.5em;"></font></div>
> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-left: 5em; margin-top: 0em;">
>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Allocuzioni/_Indice Allocuzioni#Indice di tutte le Allocuzioni pontificie|Allocuzioni]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Angelus/_Indice Angelus#Indice di tutti gli Angelus pontifici|Angelus]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Bolle/_Indice Bolle#Indice di tutte le Bolle pontificie|Bolle]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Brevi/_Indice Brevi#Indice di tutti i Brevi pontifici|Brevi]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Brevi Encicliche/_Indice Brevi Encicliche#Indice di tutte le Brevi Encicliche pontificie|Brevi Encicliche]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Chirografi/_Indice Chirografi#Indice di tutti i Chirografi pontifici|Chirografi]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Costituzioni apostoliche/_Indice Costituzioni apostoliche#Indice di tutte le Costituzioni apostoliche pontificie|Costituzioni apostoliche]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Costituzioni Dogmatiche/_Indice Costituzioni Dogmatiche#Indice di tutte le Costituzioni Dogmatiche pontificie|Costituzioni Dogmatiche]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Decreti/_Indice Decreti#Indice di tutti i Decreti pontifici|Decreti]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Dichiarazioni/_Indice Dichiarazioni#Indice di tutte le Dichiarazioni pontificie|Dichiarazioni]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Discorsi/_Indice Discorsi#Indice di tutti i Discorsi pontifici|Discorsi]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Editti/_Indice Editti#Indice di tutti gli Editti pontifici|Editti]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Encicliche/_Indice Encicliche#Indice di tutte le Encicliche pontificie|Encicliche]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Epistole/_Indice Epistole#Indice di tutte le Epistole pontificie|Epistole]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Esortazioni apostoliche/_Indice Esortazioni apostoliche#Indice di tutte le Esortazioni apostoliche pontificie|Esortazioni apostoliche]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Istruzioni/_Indice Istruzioni#Indice di tutte le Istruzioni pontificie|Istruzioni]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Lettere/_Indice Lettere#Indice di tutte le Lettere pontificie|Lettere]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Lettere apostoliche/_Indice Lettere apostoliche#Indice di tutte le Lettere apostoliche pontificie|Lettere apostoliche]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Meditazioni quotidiane/_Indice Meditazioni quotidiane#Indice di tutte le Meditazioni quotidiane pontificie|Meditazioni quotidiane]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Messaggi/_Indice Messaggi#Indice di tutti i Messaggi pontifici|Messaggi]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Motu proprio/_Indice Motu proprio#Indice di tutti i Motu proprio pontifici|Motu proprio]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Omelie/_Indice Omelie#Indice di tutte le Omelie pontificie|Omelie]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Preghiere/_Indice Preghiere#Indice di tutte le Preghiere pontificie|Preghiere]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Proclami/_Indice Proclami#Indice di tutti i Proclami pontifici|Proclami]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Proteste/_Indice Proteste#Indice di tutte le Proteste pontificie|Proteste]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Radiomessaggi/_Indice Radiomessaggi#Indice di tutti i Radiomessaggi pontifici|Radiomessaggi]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Regina Caeli/_Indice Regina Caeli#Indice di tutti i Regina Caeli pontifici|Regina Caeli]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Udienze/_Indice Udienze#Indice di tutte le Udienze pontificie|Udienze]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Viaggi apostolici/_Indice Viaggi apostolici#Indice di tutti i Viaggi apostolici pontifici|Viaggi apostolici]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Visite pastorali/_Indice Visite pastorali#Indice di tutte le Visite pastorali|Visite pastorali]]
>
> </div></div>
> <div style="background: rgba(255,165,0,0.1); border: 1px solid orange; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - [[Documenti pontifici/Videomessaggi/_Indice Videomessaggi#Indice di tutti i Videomessaggi pontifici|Videomessaggi]]
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - @
>
> </div></div>
> <div style="background: rgba(0,255,0,0.1); border: 1px solid green; border-radius: 6px; padding: 0px 8px; height: fit-content; line-height: 1.2;"><div style="margin: -14px 0;">
>
> - @
>
> </div></div>
> </div>





```dataviewjs
/** ATTENZIONE !!!
IL BLOCCO SUCCESSIVO COMMENTATO
(eliminare il commento da VSCode-->Modifica)
CREA UN CALLOUT PER OBSIDIAN.
**/

/*		 let calloutCheck = `
		<details class="callout is-collapsible" data-callout="info" open style="border: 0.08rem solid var(--interactive-accent); box-sizing: border-box !important; display: block; margin: 1rem 0; min-width: 100%; overflow: hidden; width: 100%;">
			<summary class="callout-title" style="align-items: center; display: flex; min-height: 3rem; padding-left: 3.5rem; position: relative; width: 100%;">
				<div class="callout-icon" style="align-items: center; display: flex; height: 2rem; justify-content: center; left: 0.5rem; position: absolute; top: 50%; transform: translateY(-50%); width: 2rem;">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-info" style="width: 2rem; height: 2rem;">
						<circle cx="12" cy="12" r="10"></circle>
						<path d="M12 16v-4"></path>
						<path d="M12 8h.01"></path></svg>
				</div>
				<div class="callout-title-inner">Numero totale file nel vault:
					<span style="background: rgba(0,0,0,0.2); border-radius: 4px; color: white !important; font-weight: 400; padding: 0 1rem;">
						${allFiles.length}
					</span>
				</div>
				<div class="callout-fold">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-chevron-down">
						<path d="m6 9 6 6 6-6"></path>
					</svg>
				</div>
			</summary>
			<div class="callout-content" style="box-sizing: border-box; display: block; min-width: 100%; padding: 1.5rem; width: 100%;">
				${htmlContent}
			</div>
		</details>`;
		dv.container.innerHTML = `<hr>` + calloutCheck;
 */
```


