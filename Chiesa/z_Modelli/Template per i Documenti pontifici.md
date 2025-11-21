<%*
// -------------------------------------
// --- Variabili iniziali (globali) --- 
// -------------------------------------
// Folder to start with to include
let folderDoc				= 'Documenti';
// File prefix to exclude
const excludedPrefix			= '_';
let NumeroProgressivoPrecedente	= '';
let NumeroDocumentoPrecedente	= '';
let AutorePrecedente			= '';
let TipoDocumentoPrecedente		= '';
let GiornoDocumentoPrecedente	= '';
let MeseDocumentoPrecedente		= '';
let AnnoDocumentoPrecedente		= '';
let DataDocumentoPrecedente		= '';
let LinguaDocumentoPrecedente	= '';
let LinguaOriginalePrecedente	= '';
// dichiarata a livello di template
let allFiles = [];
// Set per valori univoci
let allAutori = new Set();
let allTipiDoc = new Set();
let allLingueDoc = new Set();
let allLingueOrigDoc = new Set();
// Frontmatter Key lingua-doc che si sceglie
let linguaDocScelta				= '';
// Frontmatter Key lingua-orig che si sceglie
let linguaOrigScelta			= '';
const txt_licenzaDoc			= 'Copyright © Dicastero per la Comunicazione - Libreria Editrice Vaticana';
const txt_licenzaNota			= 'licenza-nota:  Copyright © 2025 Emanuele Tinari under Creative Commons BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/';
const urlDoc_p1			= 'url-documento: \"[Link al documento sul sito del Vaticano](';
let urlDoc_p2				= '';
const urlDoc_p3			= ')\"';
// default
let urlDoc				= 'x';
const txt_RigaChiusura			= 'creato\:\nmodificato\:\n---';
//		Lista autori
//		link  = valore da inserire nel frontmatter autore-doc
//		label = testo mostrato all'utente
//		lat   = nome latino (per firmaDoc)
const autori = [
	{
		link: '[[Scheda 247° papa - Benedetto XIV|Benedetto XIV]]',
		label: 'Benedetto XIV',
		lat: 'Benedictus XIV'
	},
	{
		link: '[[Scheda 248° papa - Clemente XIII|Clemente XIII]]',
		label: 'Clemente XIII',
		lat: 'Clemens XIII'
	},
	{
		link: '[[Scheda 249° papa - Clemente XIV|Clemente XIV]]',
		label: 'Clemente XIV',
		lat: 'Clemens XIV'
	},
	{
		link: '[[Scheda 250° papa - Pio VI|Pio VI]]',
		label: 'Pio VI',
		lat: 'Pius VI'
	},
	{
		link: '[[Scheda 251° papa - Pio VII|Pio VII]]',
		label: 'Pio VII',
		lat: 'Pius VII'
	},
	{
		link: '[[Scheda 252° papa - Leone XII|Leone XII]]',
		label: 'Leone XII',
		lat: 'Leo XII'
	},
	{
		link: '[[Scheda 253° papa - Pio VIII|Pio VIII]]',
		label: 'Pio VIII',
		lat: 'Pius VIII'
	},
	{
		link: '[[Scheda 254° papa - Gregorio XVI|Gregorio XVI]]',
		label: 'Gregorio XVI',
		lat: 'Gregorius XVI'
	},
	{
		link: '[[Scheda 255° papa - Pio IX|Pio IX]]',
		label: 'Pio IX',
		lat: 'Pius IX'
	},
	{
		link: '[[Scheda 256° papa - Leone XIII|Leone XIII]]',
		label: 'Leone XIII',
		lat: 'Leo XIII'
	},
	{
		link: '[[Scheda 257° papa - Pio X|Pio X]]',
		label: 'Pio X',
		lat: 'Pius X'
	},
	{
		link: '[[Scheda 258° papa - Benedetto XV|Benedetto XV]]',
		label: 'Benedetto XV',
		lat: 'Benedictus XV'
	},
	{
		link: '[[Scheda 259° papa - Pio XI|Pio XI]]',
		label: 'Pio XI',
		lat: 'Pius XI'
	},
	{
		link: '[[Scheda 260° papa - Pio XII|Pio XII]]',
		label: 'Pio XII',
		lat: 'Pius XII'
	},
	{
		link: '[[Scheda 261° papa - Giovanni XXIII|Giovanni XXIII]]',
		label: 'Giovanni XXIII',
		lat: 'Ioannes XXIII'
	},
	{
		link: '[[Scheda 262° papa - Paolo VI|Paolo VI]]',
		label: 'Paolo VI',
		lat: 'Paulus VI'
	},
	{
		link: '[[Scheda 263° papa - Giovanni Paolo I|Giovanni Paolo I]]',
		label: 'Giovanni Paolo I',
		lat: 'Ioannes Paulus I'
	},
	{
		link: '[[Scheda 264° papa - Giovanni Paolo II|Giovanni Paolo II]]',
		label: 'Giovanni Paolo II',
		lat: 'Ioannes Paulus II'
	},
	{
		link: '[[Scheda 265° papa - Benedetto XVI|Benedetto XVI]]',
		label: 'Benedetto XVI',
		lat: 'Benedictus XVI'
	},
	{
		link: '[[Scheda 266° papa - Francesco I|Francesco I]]',
		label: 'Francesco I',
		lat: 'Franciscus I'
	},
	{
		link: '[[Scheda 267° papa - Leone XIV|Leone XIV]]',
		label: 'Leone XIV',
		lat: 'Leo XIV'
	}
];

//--------------------------------------------------------------------
// --- FUNZIONE: ricorsiva: trova tutti i file .md nelle cartelle --- 
// --- il cui nome inizia con "Documenti" (incluse sottocartelle) --- 
//--------------------------------------------------------------------
function getDocumentFiles(folder) {
	let results = [];
	for (let item of folder.children) {
		if (item.children) {
			// esplora sottocartelle se la cartella o il padre cominciano con "Documenti"
			if (item.name.startsWith("Documenti pontifici") || folder.name.startsWith("Documenti pontifici")) {
				results.push(...getDocumentFiles(item));
			}
		}
		else if (item.extension === "md") {
			if (!item.name.startsWith(excludedPrefix)) {
				results.push(item);
			}
		}
	}
	return results;
}

//----------------------------------------------------------
// --- FUNZIONE: parsing wikilink [[Plurale|Singolare]] --- 
//----------------------------------------------------------
function parseTipoDoc(value) {
	const m = String(value || "").match(/^\[\[(.+?)\|(.+?)\]\]$/);
	return m ? { plurale: m[1], singolare: m[2] } : null;
}

//-------------------------------------------------------------------------
// --- FUNZIONE: recupera documento precedente ed esegue un unico scan --- 
//-------------------------------------------------------------------------
// Scan unico: riempi Set e (se richiesto) trova doc precedente
// targetProgrDoc: Number oppure null (null = non cercare)
// ------------------------------------------------------------------------
function getDocPrecedFillSet(allFiles, targetProgrDoc) {
	let datiPrec = null;
	for (const f of allFiles) {
		const fm = app.metadataCache.getFileCache(f)?.frontmatter;
		if (!fm) continue;
		//-----------------------------------------------------------
		// Documento precedente (solo se targetProgrDoc è un numero) 
		//-----------------------------------------------------------
		if (
			targetProgrDoc !== null &&
			datiPrec === null &&
			Number(fm["progr-doc"]) === targetProgrDoc
		) {
			datiPrec = {
				NumeroProgressivoPrecedente: fm["progr-doc"] || "x",
				NumeroDocumentoPrecedente:   fm["num-doc"]   || "x",
				AutorePrecedente:			fm["autore-doc"]|| "x",
				TipoDocumentoPrecedente:	 fm["tipo-doc"]  || "x",
				GiornoDocumentoPrecedente:   fm["giorno-doc"]|| "x",
				MeseDocumentoPrecedente:	 fm["mese-doc"]  || "x",
				AnnoDocumentoPrecedente:	 fm["anno-doc"]  || "x",
				DataDocumentoPrecedente:	 fm["data-doc"]  || "x",
				LinguaDocumentoPrecedente:   fm["lingua-doc"]|| "x",
				LinguaOriginalePrecedente:   fm["lingua-orig"]||"x"
			};
		}
		//-----------------------------------------------
		// Raccoglie i valori univoci per i suggerimenti 
		//-----------------------------------------------
		if (fm["autore-doc"])	 allAutori.add(fm["autore-doc"]);
		if (fm["tipo-doc"])	   allTipiDoc.add(fm["tipo-doc"]);
		if (fm["lingua-doc"])	 allLingueDoc.add(fm["lingua-doc"]);
		if (fm["lingua-orig"])	allLingueOrigDoc.add(fm["lingua-orig"]);
	}
	//----------------------------------------------------
	// Se nessun documento precedente trovato → tutti "x" 
	//----------------------------------------------------
	if (!datiPrec) {
		return {
			NumeroProgressivoPrecedente: "x",
			NumeroDocumentoPrecedente:   "x",
			AutorePrecedente:			"x",
			TipoDocumentoPrecedente:	 "x",
			GiornoDocumentoPrecedente:   "x",
			MeseDocumentoPrecedente:	 "x",
			AnnoDocumentoPrecedente:	 "x",
			DataDocumentoPrecedente:	 "x",
			LinguaDocumentoPrecedente:   "x",
			LinguaOriginalePrecedente:   "x"
		};
	}
	return datiPrec;
}

//--------------------
// --- ESECUZIONE --- 
//--------------------

// -------------------------------
// Ordine corretto
// 1) ottieni root + allFiles
// 2) input titolo
// 3) input progrDoc (validato)
// 4) calcola targetProgrDoc / forcePrevX
// 5) scan unico
// 6) se forcePrevX => forzare "x" nel risultato del doc precedente
// 7) assegnazioni globali
// -------------------------------

// 1) ottieni file
// otteniamo la radice del vault e cerchiamo tutte le cartelle Documenti*
const root = app.vault.getRoot();
allFiles = getDocumentFiles(root);

//------------------------------
// --- INPUT PER titolo-doc --- 
//------------------------------
// 2) titolo
let titoloDoc = await tp.system.prompt("Inserire Titolo Documento");
titoloDoc = titoloDoc ? titoloDoc.trim() : "x";

//-----------------------------
// --- INPUT PER progr-doc --- 
//-----------------------------
// 3) progrDoc (loop validazione)
let progrDoc;
while (true) {
	progrDoc = await tp.system.prompt("Inserire Numero Progressivo documento (vuoto = 'x')");
	// Caso: prompt chiuso o vuoto → assegna "x"
	if (progrDoc === null || progrDoc.trim() === "") {
		// Vuoto o chiuso → default "x"
		progrDoc = "x";
		break;
	}
	// Rimuove spazi e normalizza eventuale X maiuscola
	progrDoc = progrDoc.trim().toLowerCase();
	// Caso: input "x" → accettato
	if (progrDoc === "x") break;
	// Controllo se è un numero intero valido tra 1 e 150000
	const n = Number(progrDoc);
	if (/^\d+$/.test(progrDoc) && n >= 1 && n <= 150000) {
		// Valido → esce dal loop
		break;
	}
		// Non valido → avviso e ripeti
		await tp.system.alert("Inserire un numero intero da 1 a 150.000 senza lettere o simboli.");
}
// Alla fine, progrDoc contiene sempre:
//- "x" se vuoto, chiuso o digitato "x"/"X"
// - oppure un numero valido da 1 a 150.000
console.log("Numero Progressivo Documento valido:\n", progrDoc, "\n\n");

// 4) target e flag
let targetProgrDoc = null;
let forcePrevX = false;
if (progrDoc === "x") {
	// vogliamo comunque riempire Set ma il doc-prec è forzato a "x"
	forcePrevX = true;
}
else {
	targetProgrDoc = Number(progrDoc) - 1;
}

// 5) scan unico (riempie i Set)
let objDocPrecedente = getDocPrecedFillSet(allFiles, targetProgrDoc);

// 6) se forzare "x" sovrascriviamo il risultato (ma i set restano pieni)
if (forcePrevX) {
	objDocPrecedente = {
		NumeroProgressivoPrecedente: "x",
		NumeroDocumentoPrecedente:   "x",
		AutorePrecedente:			"x",
		TipoDocumentoPrecedente:	 "x",
		GiornoDocumentoPrecedente:   "x",
		MeseDocumentoPrecedente:	 "x",
		AnnoDocumentoPrecedente:	 "x",
		DataDocumentoPrecedente:	 "x",
		LinguaDocumentoPrecedente:   "x",
		LinguaOriginalePrecedente:   "x"
	};
}

// 7) assegna globali
NumeroProgressivoPrecedente = objDocPrecedente.NumeroProgressivoPrecedente;
NumeroDocumentoPrecedente   = objDocPrecedente.NumeroDocumentoPrecedente;
AutorePrecedente			= objDocPrecedente.AutorePrecedente;
TipoDocumentoPrecedente	 = objDocPrecedente.TipoDocumentoPrecedente;
GiornoDocumentoPrecedente   = objDocPrecedente.GiornoDocumentoPrecedente;
MeseDocumentoPrecedente	 = objDocPrecedente.MeseDocumentoPrecedente;
AnnoDocumentoPrecedente	 = objDocPrecedente.AnnoDocumentoPrecedente;
DataDocumentoPrecedente	 = objDocPrecedente.DataDocumentoPrecedente;
LinguaDocumentoPrecedente   = objDocPrecedente.LinguaDocumentoPrecedente;
LinguaOriginalePrecedente   = objDocPrecedente.LinguaOriginalePrecedente;

// Mostra in console i valori aggiornati delle variabili globali
console.log("NumeroProgressivoPrecedente:\n", NumeroProgressivoPrecedente, "\n\n");
console.log("NumeroDocumentoPrecedente:\n", NumeroDocumentoPrecedente, "\n\n");
console.log("AutorePrecedente:\n", AutorePrecedente, "\n\n");
console.log("TipoDocumentoPrecedente:\n", TipoDocumentoPrecedente, "\n\n");
console.log("GiornoDocumentoPrecedente:\n", GiornoDocumentoPrecedente, "\n\n");
console.log("MeseDocumentoPrecedente:\n", MeseDocumentoPrecedente, "\n\n");
console.log("AnnoDocumentoPrecedente:\n", AnnoDocumentoPrecedente, "\n\n");
console.log("DataDocumentoPrecedente:\n", DataDocumentoPrecedente, "\n\n");
console.log("LinguaDocumentoPrecedente:\n", LinguaDocumentoPrecedente, "\n\n");
console.log("LinguaOriginalePrecedente:\n", LinguaOriginalePrecedente, "\n\n");
// debug: set univoci (ordinati)
console.log("Autori:\n",	 Array.from(allAutori).sort(), "\n\n");
console.log("Tipi Doc:\n",	 Array.from(allTipiDoc).sort(), "\n\n");
console.log("Lingue Doc:\n", Array.from(allLingueDoc).sort(), "\n\n");
console.log("Lingue Orig:\n",Array.from(allLingueOrigDoc).sort(), "\n\n");

//----------------------------------------------------------------------------------
// --- INPUT num-doc (default = NumeroDocumentoPrecedente + 1, range 1..maxNum) --- 
//----------------------------------------------------------------------------------
// Calcolo del numero di default basato sul documento precedente
let defaultNumDoc = "x";
if (NumeroDocumentoPrecedente && NumeroDocumentoPrecedente !== "x") {
	defaultNumDoc = String(Number(NumeroDocumentoPrecedente) + 1);
}
let numDoc;
let maxNum = (progrDoc && progrDoc !== "x") ? Number(progrDoc) : 150000;
while (true) {
	// Prompt con valore di default
	numDoc = await tp.system.prompt(`Inserire Numero Progressivo Documento Autore (1 → ${maxNum}, vuoto = 'x')`, defaultNumDoc);
	// Prompt chiuso o vuoto → assegna "x"
	if (numDoc === null || numDoc.trim() === "") {
		numDoc = "x";
		break;
	}
	// Normalizza input
	numDoc = numDoc.trim().toLowerCase();
	// Accetta "x"
	if (numDoc === "x") break;
	// Controllo se è un numero intero positivo nel range
	if (/^\d+$/.test(numDoc)) {
		const numVal = Number(numDoc);
		if (numVal >= 1 && numVal <= maxNum) break;
	}
	// Non valido → alert
	await tp.system.alert("Inserire un numero intero positivo oppure 'x'.");
}
	// Log del numDoc
console.log("Numero Progressivo Documento Autore valido:\n", numDoc, "\n\n");

//------------------------------------------------------------------------------
// --- INPUT tipo-doc (suggester che mostra singolare ma mantiene wikilink) --- 
//------------------------------------------------------------------------------
const tipiArray = Array.from(allTipiDoc).sort((a,b) => {
	// tipiArray contiene wikilink completi. Esempio:
	//	[[pluraleTipoDocA|singolareTipoDocA]]
	//	[[pluraleTipoDocB|singolareTipoDocB]]
	//	[[pluraleTipoDocC|singolareTipoDocC]]
	const A = parseTipoDoc(a)?.singolare || a;
	const B = parseTipoDoc(b)?.singolare || b;
	return A.localeCompare(B);
});
const opzioneNuovo = "Aggiungi un nuovo tipo di documento…";
const listaSuggerimenti = [opzioneNuovo, ...tipiArray];
// mostra solo il singolare
const mostra = item => parseTipoDoc(item)?.singolare || item;

// default singolare preso dal documento precedente (se presente e nel formato wikilink)
let defaultTipoDocSingolare = null;
if (TipoDocumentoPrecedente && TipoDocumentoPrecedente !== "x") {
	defaultTipoDocSingolare = parseTipoDoc(TipoDocumentoPrecedente)?.singolare || null;
}
// mostra suggester con default singolare (true = allow empty)
let tipoDocSceltoSingolare = await tp.system.suggester(mostra, listaSuggerimenti, true, defaultTipoDocSingolare);

// risolvo valore finale (wikilink) in tipoDocScelto
let tipoDocScelto;
if (!tipoDocSceltoSingolare) {
	tipoDocScelto = "[[@ATTENZIONE|Manca_tipo_doc]]";
}
else if (tipoDocSceltoSingolare === opzioneNuovo) {
	const nuovoPlurale = await tp.system.prompt("Nome plurale (es. Encicliche, Bolle)");
	const nuovoSingolare = await tp.system.prompt("Nome singolare (es. Enciclica, Bolla)");
	if (!nuovoPlurale || !nuovoSingolare) {
		tipoDocScelto = "[[@ATTENZIONE|Manca_tipo_doc]]";
	} else {
		tipoDocScelto = `[[${nuovoPlurale.trim()}|${nuovoSingolare.trim()}]]`;
		// creazione cartella padre (opzionale)
		const rootFolders = root.children.filter(c => c.children && c.name.startsWith("Documenti"));
		const nomiRootFolders = rootFolders.map(c => c.name);
		const sceltaPadre = await tp.system.suggester(nomiRootFolders, nomiRootFolders);
		let cartellaPadre = root;
		if (sceltaPadre) cartellaPadre = rootFolders.find(c => c.name === sceltaPadre) || root;
		const tipoDocParsedTmp = parseTipoDoc(tipoDocScelto);
		const esistente = cartellaPadre.children.find(c => c.name === tipoDocParsedTmp.plurale);
		if (!esistente) await app.vault.createFolder(`${cartellaPadre.path}/${tipoDocParsedTmp.plurale}`);
	}
}
else {
	const tmp = tipiArray.find(t => parseTipoDoc(t)?.singolare === tipoDocSceltoSingolare);
	tipoDocScelto = tmp || tipoDocSceltoSingolare || "[[@ATTENZIONE|Manca_tipo_doc]]";
}
const tipoDocFrontmatter = `tipo-doc: "${tipoDocScelto}"`;
console.log("Tipo-doc scelto (wikilink):\n", tipoDocScelto, "\n\n");

//------------------------------
// --- INPUT PER autore-doc ---
//------------------------------
/* --- Ordinamento autori per numero Scheda (decrescente) --- */
autori.sort((a, b) => {
	const numA = parseInt(a.link.match(/Scheda (\d+)/)[1]);
	const numB = parseInt(b.link.match(/Scheda (\d+)/)[1]);
	return numB - numA;
});
/* Costruisce lista etichette per il suggester */
const labels = autori.map(a => a.label);
/* --- Default AUTORE e suggeritore (valori primitivi) --- */
// labels: testi mostrati all'utente; values: primitive (wikilink) usate come valore restituito
const values = autori.map(a => a.link);
// defaultValue deve essere la stringa link presente in AutorePrecedente (o null)
const defaultValue = (AutorePrecedente && AutorePrecedente !== "x") ? AutorePrecedente : null;
// Chiamata al suggester: passiamo labels e values (valori primitivi) e il default come stringa
let sceltaValue;
if (defaultValue) {
	sceltaValue = await tp.system.suggester(labels, values, false, defaultValue);
}
else {
	sceltaValue = await tp.system.suggester(labels, values);
}
/* --- Gestione scelta: 'sceltaValue' è ora una stringa (link) o null --- */
let autoreDoc, nomeAutorita, firmaDoc;
let chosenAuthorObj = null;
if (sceltaValue) {
	chosenAuthorObj = autori.find(a => a.link === sceltaValue) || null;
}
if (!chosenAuthorObj) {
	autoreDoc    = "[[x|x]]";
	nomeAutorita = "x";
	firmaDoc     = "x";
}
else {
	autoreDoc    = chosenAuthorObj.link;
	nomeAutorita = chosenAuthorObj.label;
	firmaDoc     = chosenAuthorObj.lat;
}
console.log("Autore selezionato (wikilink):\n", autoreDoc, "\n\n");
console.log("Autore selezionato (label):\n", nomeAutorita, "\n\n");
console.log("Autore selezionato (latino):\n", firmaDoc, "\n\n");

//-----------------------------------------
// --- INPUT Data (giorno, mese, anno) --- 
//-----------------------------------------
// Limiti anno
const annoMin = 1740;
const annoMax = new Date().getFullYear() + 1;
// --- GIORNO --- 
let defaultGiornoDoc = (GiornoDocumentoPrecedente && GiornoDocumentoPrecedente !== "x")
	? String(GiornoDocumentoPrecedente).trim()
	: "x";
let giornoDoc = "";
while (true) {
	let g = await tp.system.prompt("Inserire il giorno (1–31):", defaultGiornoDoc);
	// chiuso con X
	if (g === null) {
		giornoDoc = "x";
		break;
	}
	g = String(g).trim();
	// Invio senza input
	if (g === "") {
		giornoDoc = defaultGiornoDoc;
		break;
	}
	if (/^(?:[1-9]|[12][0-9]|3[01])$/.test(g)) {
		giornoDoc = g;
		break;
	}
}
// output giorno normalizzato
const gNum = Number(giornoDoc);
const gOut = (!Number.isNaN(gNum) && giornoDoc !== "x")
	? String(gNum).padStart(2, "0")
	: giornoDoc;
// --- MESE --- 
let defaultMeseDoc = (MeseDocumentoPrecedente && MeseDocumentoPrecedente !== "x")
	? String(MeseDocumentoPrecedente).trim()
	: "x";
let meseDoc = "";
while (true) {
	let m = await tp.system.prompt("Inserire il mese (1–12):", defaultMeseDoc);
	// chiuso con X
	if (m === null) {
		meseDoc = "x";
		break;
	}
	m = String(m).trim();
	// Invio
	if (m === "") {
		meseDoc = defaultMeseDoc;
		break;
	}
	if (/^(?:[1-9]|1[0-2])$/.test(m)) {
		meseDoc = m;
		break;
	}
}
// output mese normalizzato
const mNum = Number(meseDoc);
const mOut = (!Number.isNaN(mNum) && meseDoc !== "x")
	? String(mNum).padStart(2, "0")
	: meseDoc;
// --- ANNO ---
let defaultAnnoDoc = (AnnoDocumentoPrecedente && AnnoDocumentoPrecedente !== "x")
	? String(AnnoDocumentoPrecedente).trim()
	: "x";
let annoDoc = "";
while (true) {
	let a = await tp.system.prompt("Inserire l'anno:", defaultAnnoDoc);
	// chiuso con X
	if (a === null) {
		annoDoc = "x";
		break;
	}
	a = String(a).trim();
	// Invio
	if (a === "") {
		annoDoc = defaultAnnoDoc;
		break;
	}
	// se 2 cifre → inferenza automatica secolo
	if (/^\d{2}$/.test(a)) {
		const YY = Number(a);
		const current = new Date().getFullYear();
		let full = current - (current % 100) + YY;
		if (full > current + 1) full -= 100;
		a = String(full);
	}
	if (/^\d{4}$/.test(a) &&
		Number(a) >= annoMin &&
		Number(a) <= annoMax) {
		annoDoc = a;
		break;
	}
}
// annoDoc è valido oppure 'x'
// --- DATA COMPLETA --- 
let dataDoc = "";
// Normalizzazione per output
const outAnno = (annoDoc === "x") ? "xxxx" : annoDoc;
const outMese = (meseDoc === "x") ? "xx"   : mOut;
const outGior = (giornoDoc === "x") ? "xx" : gOut;
// Data sempre prodotta, con placeholder
dataDoc = `${outAnno}-${outMese}-${outGior}`;

console.log("DEBUG - Variabili Data Documento:");
console.log("giornoDoc: ", giornoDoc);
console.log("meseDoc: ", meseDoc);
console.log("annoDoc: ", annoDoc);
console.log("dataDoc: ", dataDoc, "\n\n");

//---------------------------
// --- INPUT lingua-doc  --- 
//---------------------------
// default sempre "Italiano" se precedente è x o mancante
let defaultLinguaDoc = (LinguaDocumentoPrecedente && LinguaDocumentoPrecedente !== "x")
	? String(LinguaDocumentoPrecedente).trim()
	: "Italiano";
// array opzioni ordinate alfabeticamente
const arrLingueDoc = Array.from(allLingueDoc).sort((a, b) => a.localeCompare(b));
// suggester per scegliere lingua del documento
linguaDocScelta = await tp.system.suggester(
	arrLingueDoc,
	arrLingueDoc,
	"Scegliere la lingua del documento oppure inserirne una nuova"
);
// se l’utente premi la X → null → diventa "x"
if (!linguaDocScelta) {
	linguaDocScelta = "x";
}
// se l’utente digita una nuova lingua → normalizza
if (typeof linguaDocScelta === "string") {
	const cleaned = linguaDocScelta.trim();
	if (cleaned === "" || cleaned.toLowerCase() === "x") {
		linguaDocScelta = "x";
	}
	else {
		linguaDocScelta = cleaned;
		// aggiunta al set
		allLingueDoc.add(cleaned);
	}
}
console.log("Lingua del documento scelta:\n", linguaDocScelta, "\n\n");

//----------------------------
// --- INPUT lingua-orig  --- 
//----------------------------
// default sempre "Italiano" se precedente è x o mancante
let defaultLinguaOrig = (LinguaOriginalePrecedente && LinguaOriginalePrecedente !== "x")
	? String(LinguaOriginalePrecedente).trim()
	: "Italiano";
// array opzioni ordinate alfabeticamente
const arrLingueOrig = Array.from(allLingueOrigDoc).sort((a, b) => a.localeCompare(b));
// suggester per scegliere lingua originale
linguaOrigScelta = await tp.system.suggester(
	arrLingueOrig,
	arrLingueOrig,
	"Scegliere la lingua originale del documento oppure inserirne una nuova"
);
// se l’utente premi la X → null → diventa "x"
if (!linguaOrigScelta) {
	linguaOrigScelta = "x";
}
// se l’utente digita una nuova lingua → normalizza
if (typeof linguaOrigScelta === "string") {
	const cleaned = linguaOrigScelta.trim();
	if (cleaned === "" || cleaned.toLowerCase() === "x") {
		linguaOrigScelta = "x";
	}
	else {
		linguaOrigScelta = cleaned;
		allLingueOrigDoc.add(cleaned); // aggiunta al set
	}
}
console.log("Lingua originale per il documento:\n", linguaOrigScelta, "\n\n");

// ----------------------------------------
// --- COSTRUZIONE TAG PER FRONTMATTER --- 
// ----------------------------------------
// 1) Tipo documento (singolare)
const tipoDocParsed = parseTipoDoc(tipoDocScelto);
const tagTipoDoc = (tipoDocParsed?.singolare || "x").trim().replace(/["']/g, "");
// 2) Autore (già presente in nomeAutorita, fallback = "x")
const tagAutore = (nomeAutorita?.trim() || "x").replace(/["']/g, "").replace(/\s+/g, "_");
// 3) Titolo documento -> parole unite con underscore (titoloDoc è chiesto inizialmente)
//usa Unicode lettere/numeri (\p{L}\p{N}), evita underscore doppi e rimuove estremi
const rawTitle = (titoloDoc || "").trim();
let tagTitolo;
if (!rawTitle) {
	  tagTitolo = "x";
}
else {
	// sostituisce una o più sequenze di caratteri non-lettera/numero unicode con _
	tagTitolo = rawTitle
		.normalize("NFKC")
		.replace(/[^\p{L}\p{N}]+/gu, "_")   // require `u` flag for Unicode
		.replace(/^_+|_+$/g, "")			// elimina underscore agli estremi
		.replace(/["']/g, "");			  // rimuove eventuali virgolette
		if (!tagTitolo) tagTitolo = "x";
}
// 4) Tag fisso
const tagFisso = "Documenti_pontifici";
// Output finale YAML
const bloccoTags =
`tags:
  - ${tagTipoDoc}
  - ${tagAutore}
  - ${tagTitolo}
  - ${tagFisso}`;

// --------------------------------------------
// --- COSTRUZIONE ALIASES PER FRONTMATTER --- 
// --------------------------------------------
// 1) Alias dal titolo: maiuscola solo sulla prima lettera
let primoAlias;
if (!titoloDoc || titoloDoc === "x") {
		primoAlias = "x";
}
else
{
	primoAlias = titoloDoc[0].toUpperCase() + titoloDoc.slice(1);
}
// 2) Alias concatenato tipo-doc + titolo: tagTipoDoc + tagTitolo, senza underscore, prima lettera del titolo minuscola
let secondoAlias;
if (!titoloDoc || titoloDoc === "x") {
	secondoAlias = tagTipoDoc + " x";
}
else {
	const titoloMinuscola = titoloDoc[0].toLowerCase() + titoloDoc.slice(1);
	secondoAlias = tagTipoDoc + " " + titoloMinuscola;
}
// Output finale YAML
const bloccoAliases =
`aliases:
  - ${primoAlias}
  - ${secondoAlias}`;

//-----------------------------
// --- INPUT URL DOCUMENTO --- 
//-----------------------------
const sceltaInserimentoUrlDocumento = await tp.system.suggester(
	['Si', 'No', 'Esci'],
	['Si', 'No', 'Esci'],
	false,
	"Vuoi inserire l'Indirizzo Internet (URL) per il Documento?"
);
if (sceltaInserimentoUrlDocumento === "Si") {
	urlDoc_p2 = await tp.system.prompt(
		"Incollare o inserire l'indirizzo Internet del Documento.",
	);
	// Normalizzazione: se null o vuoto → 'x'
	if (!urlDoc_p2 || urlDoc_p2.trim() === "") urlDoc_p2 = "x";
}

// In tutti i casi, concateniamo per frontmatter
urlDoc = urlDoc_p1 + urlDoc_p2 + urlDoc_p3;

console.log("URL Documento:\n", urlDoc, "\n\n");

// --- INPUT: incipit multi-riga --- 
let incipit = await tp.system.prompt("Inserire l'incipit del documento (più righe consentite):", null, false, true);
// Se l'utente ha scritto qualcosa
let incipitDoc;
if (incipit && incipit.trim().length > 0) {
	// Rimuove spazi iniziali/finali di ogni riga e filtra righe vuote
	const righe = incipit.split(/\r?\n/).map(r => r.trim()).filter(r => r.length > 0);
	// Se più righe → concatena con <br>, altrimenti usa la singola riga
	incipitDoc = righe.length > 1 ? righe.join("<br>") : righe[0];
}
else {
	// Nessun input → "x" minuscola
	incipitDoc = "x";
}
console.log("Incipit del docuento:\n", incipitDoc, "\n\n");

//----------------------------------
// --- INPUT luogo + data e ora --- 
//----------------------------------
// Prompt luogo documento (default vuoto)
let luogoDoc = await tp.system.prompt("Inserire il luogo del documento:", "");
// Array mesi e giorni della settimana
const mesi = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
const giorniSettimana = ["Domenica","Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"];
let giornoSettimana = "";
let meseLettere = "";
// Conversione anno in numero, gestendo 'x'
const aNum = (annoDoc !== "x") ? Number(annoDoc) : null;
// Calcolo giorno della settimana e mese in lettere
if (gNum !== null && mNum !== null && aNum !== null) {
	const dt = new Date(aNum, mNum-1, gNum);
	giornoSettimana = giorniSettimana[dt.getDay()];
	meseLettere = mesi[mNum-1];
}
// Sostituzione placeholder se valori mancanti
const gStr = gNum ? String(gNum) : "xx";
const mStr = mNum ? meseLettere : "xx";
const aStr = aNum ? String(aNum) : "xxxx";
// Costruzione stringa finale Luogo + Data
const LuogoDataDoc = `${luogoDoc}, ${giornoSettimana}, ${gStr} ${mStr} ${aStr}`;
const GiornoLettereDataDoc = `, ${giornoSettimana}, ${gStr} ${mStr} ${aStr}`;
console.log("Luogo Documento:\n", luogoDoc, "\n\n");
console.log("Giorno Settimana:\n", giornoSettimana, "\n\n");
console.log("Mese Lettere:\n", meseLettere, "\n\n");
console.log("Luogo + Data Documento:\n", LuogoDataDoc, "\n\n");

//-------------------------------------
// --- INPUT: note a piè di pagina --- 
//-------------------------------------
// Variabile finale da usare nel template
let noteFondoPagina = "";
noteFondoPagina = "";
// Prompt con suggester (default = "Si")
const sceltaInserireNote = await tp.system.suggester(
	["Si", "No"],   // opzioni visibili
	["Si", "No"],   // valori restituiti
	false,
	"Vuoi inserire le note a piè di pagina?",
	// valore di default
	"Si"
);
// Gestione risposta
if (sceltaInserireNote === "Si") {
	// chiedi numero note (0 = nessuna nota)
	let n;
	while (true) {
		const nStr = await tp.system.prompt("Quante note sono previste? (Inserire un numero intero da 0 a 200, 0 = nessuna nota)");
		// annulla/empty => 0
		if (nStr === null || nStr.trim() === "") {
			n = 0;
			break;
		}
		if (/^\d+$/.test(nStr.trim())) {
			n = Number(nStr.trim());
			if (n >= 0 && n <= 200) break;
		}
		await tp.system.alert("Inserire un numero intero compreso tra 0 e 200 (0 = nessuna nota).");
	}
	if (n === 0) {
		// comportamento attuale se l'utente sceglie SI ma mette 0
		noteFondoPagina = "***\n\n\nNOTE:\n\n\n\n\n\n";
	}
	else {
		// intestazione
		noteFondoPagina = "***\n\n\nNOTE:\n\n\n";
		// blocco numerato con parentesi quadre come richiesto
		for (let i = 1; i <= n; i++) {
			noteFondoPagina += `[${i}]: \n\n`;
		}
		// chiusura
		noteFondoPagina += "\n\n";
	}
}
else {
	// No o annulla: rimane vuota (come ora)
	noteFondoPagina = "";
	// "No" o chiusura → non fa nulla, noteFondoPagina rimane ""
}
console.log("noteFondoPagina =", noteFondoPagina);

//--------------------------------------
// --- INPUT NOME COMPLETO DEL FILE --- 
//--------------------------------------
newFileName = await tp.system.prompt("Inserire il nome completo del file:", "");
// Pulizia input (trim e rimozione di eventuali caratteri non validi)
newFileName = (newFileName || "").trim().replace(/[\/\\:*?"<>|]/g, "");
// --- Controllo: primi 10 caratteri devono corrispondere alla data --- 
const dataCheck = `${annoDoc}-${mOut}-${gOut}`;
if (!newFileName.startsWith(dataCheck)) {
	new Notice("Errore: i primi caratteri del nome file non corrispondono alla data!", 5000);
	console.log("Nome file non valido:\n", newFileName, "\n\n");
}
else {
	// --- Rinomina il file solo se ha ancora il titolo predefinito (Untitled o Senza nome) --- 
	let nomeFileCorrente = await tp.file.title;
	if (nomeFileCorrente.startsWith("Untitled") || nomeFileCorrente.startsWith("Senza nome")) {
		await tp.file.rename(newFileName);
		console.log("File rinominato:\n", newFileName, "\n\n");
	}
}

//----------------------------------------------------------
// --- SELEZIONE E SALVATAGGIO DOCUMENTO NELLA CARTELLA --- 
//----------------------------------------------------------
const allDocSubfolders = Array.from(
	new Set(
		allFiles
			.map(f => f.parent?.path)
			.filter(p => p && p.startsWith("Documenti pontifici"))
	)
);
// Default: plurale del tipo-doc scelto
const defaultFolder = tipoDocParsed?.plurale || "x";
// Presenta suggester con tutte le cartelle e default
const allChoices = allDocSubfolders.concat(["Crea nuova cartella..."]);
const defaultIndex = allChoices.findIndex(p => p.endsWith(defaultFolder));
const defaultChoice = defaultIndex >= 0 ? allChoices[defaultIndex] : null;
let sceltaCartella = await tp.system.suggester(
	allChoices,
	allChoices,
	false,
	defaultChoice
);
// Se annullato o chiusura finestra
if (!sceltaCartella) {
	folderDoc = `Documenti pontifici/${defaultFolder}`;
	await app.vault.createFolder(folderDoc);
	console.log("Cartella predefinita creata:", folderDoc);
}
else if (sceltaCartella === "Crea nuova cartella...") {
	// Chiede il nome della nuova cartella
	let nuovaCartella = await tp.system.prompt("Inserisci il nome della nuova cartella:");
	if (!nuovaCartella || nuovaCartella.trim() === "") {
		nuovaCartella = defaultFolder;
	}
	folderDoc = `Documenti pontifici/${nuovaCartella}`;
	await app.vault.createFolder(folderDoc);
	console.log("Nuova cartella creata:", folderDoc);
}
else {
	// Se la cartella scelta contiene già 'Documenti pontifici', non aggiungere di nuovo
	if (sceltaCartella.startsWith("Documenti pontifici")) {
		folderDoc = sceltaCartella;
	}
	else {
		folderDoc = `Documenti pontifici/${sceltaCartella}`;
	}
	console.log("Cartella scelta:", folderDoc);
}
// Sposta il file nella cartella corretta
const targetPath = `${folderDoc}/${newFileName}`;
if (tp.file.path !== targetPath) {
	await tp.file.move(targetPath);
	console.log("File spostato in:", targetPath);
}
	// 5. Notifica di successo
	const notice = new Notice("", 5000);
	notice.noticeEl.append(
	createEl("strong", { text: "Successo!\n", style: "color:red" }),
	"Nuovo documento caricato:\n", newFileName, "\nnella cartella:\n", folderDoc);
console.log("Nuovo documento caricato:\n", newFileName, "\nnella cartella:\n", folderDoc, "\n\n");

-%>
---
cssclasses: docVat
progr-doc: <% progrDoc %>
num-doc: <% numDoc %>
autore-doc: "<% autoreDoc %>"
<% tipoDocFrontmatter %>
titolo-doc: <% titoloDoc %><% GiornoLettereDataDoc %>
giorno-doc: <% giornoDoc %>
mese-doc: <% meseDoc %>
anno-doc: <% annoDoc %>
data-doc: <% dataDoc %>
lingua-doc: <% linguaDocScelta %>
lingua-orig: <% linguaOrigScelta %>
stato: false
<% bloccoTags %>
<% bloccoAliases %>
licenza-doc: <% txt_licenzaDoc %>
<% txt_licenzaNota %>
<% urlDoc %>
<% txt_RigaChiusura %>


***


<% tipoDocParsed?.singolare || "x" %> `class: tipoDoc`


del sommo pontefice `class: tipoAut`


<% nomeAutorita %> `class: nomeAut`


# <% titoloDoc %><% GiornoLettereDataDoc %>


<% incipitDoc %> `class: incipit`


x `class: paragrafoNorm`


<% LuogoDataDoc %> `class: dataLuogo`


<% firmaDoc %> `class: firmaC`


***


<% txt_licenzaDoc %>. `class: dirittiAut`


<% noteFondoPagina %>