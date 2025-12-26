
// Importa le classi Plugin e Modal da Obsidian
// Import Plugin and Modal classes from Obsidian
const { Plugin, Modal, Setting } = require('obsidian');
// Importa il modulo filesystem per leggere file
// Import filesystem module to read files
const fs = require('fs');
// Importa il modulo path per gestire i percorsi
// Import path module to handle file paths
const path = require('path');


// Percorsi cartelle:
const ObsidianPath = "D:/Documents/GitHub/EmanueleTinari/Obsidian";
console.log("ObsidianPath:", ObsidianPath);
const WorkingVaultPath = ObsidianPath + "/Chiesa";
console.log("WorkingVaultPath:", WorkingVaultPath);
const BibbiaPath = WorkingVaultPath + "/La Sacra Bibbia";
console.log("BibbiaPath:", BibbiaPath);
const settingsPath = WorkingVaultPath + "/.obsidian/plugins/Modal4BibleRefs/settings.json";
console.log("Settings path:", settingsPath);
// default attive
const DEFAULT_ACTIVE_VERSIONS = ["CEI 1974", "Vulgata Latina"];
const SETTINGS_FILE = settingsPath;

// Lista delle versioni disponibili (stessa sequenza dei toggle) e Mappa dei prefissi per i nomi dei file markdown delle versioni bibliche
// List of available Bible versions (used for toggle order) and file name prefixes for each Bible version
const fileNamePrefixes = {
	"Vulgata Latina": "VL",
	"Nova Vulgata": "NV",
	"CEI 1974": "CEI 74",
	"CEI 2008": "CEI 08",
	"Interconfessionale": "INT",
	"Ricciotti": "RCT",
	"Martini": "MRT",
	"Diodati": "D",
	"Riveduta": "RIV",
	"Nuova Diodati": "ND",
	"Nuova Riveduta": "NRIV",
	"Nuova Riveduta 2020": "RIV 20"
};

// Definizione array LibriBibbia con dati completi
// Definition of LibriBibbia array with full data
const LibriBibbia = [
	{
		// Ogni elemento contiene dati sul libro: numero, testamento, gruppo, nome IT, abbreviazioni, nome LT, nome EN, ecc.
		// Each element contains book data: number, testament, group, Italian name, abbreviations, Latin name, English name, etc.
		num: 1, testamento: "AT", gruppo: "Pentateuco", nomeIT: "Genesi", abbrevIT: "Gn;Gen", nomeLT: "Genesis", abbrevLT: "Gn", nomeEN: "Genesis", abbrevEN: "Gen"
	},
	{
		num: 2, testamento: "AT", gruppo: "Pentateuco", nomeIT: "Esodo", abbrevIT: "Es;Esd", nomeLT: "Exodus", abbrevLT: "Es", nomeEN: "Exodus", abbrevEN: "Exod"
	},
	{
		num: 3, testamento: "AT", gruppo: "Pentateuco", nomeIT: "Levitico", abbrevIT: "Lv;Lev", nomeLT: "Leviticus", abbrevLT: "Lv", nomeEN: "Leviticus", abbrevEN: "Lev"
	},
	{
		num: 4, testamento: "AT", gruppo: "Pentateuco", nomeIT: "Numeri", abbrevIT: "Nm;Num", nomeLT: "Numeri", abbrevLT: "Nm", nomeEN: "Numbers", abbrevEN: "Num"
	},
	{
		num: 5, testamento: "AT", gruppo: "Pentateuco", nomeIT: "Deuteronomio", abbrevIT: "Dt;Deut", nomeLT: "Deuteronomium", abbrevLT: "Dt", nomeEN: "Deuteronomy", abbrevEN: "Deut"
	},
	{
		num: 6, testamento: "AT", gruppo: "Libri Storici", nomeIT: "Giosuè", abbrevIT: "Gs;Gio", nomeLT: "Josue", abbrevLT: "Jos", nomeEN: "Joshua", abbrevEN: "Josh"
	},
	{
		num: 7, testamento: "AT", gruppo: "Libri Storici", nomeIT: "Giudici", abbrevIT: "Gdc;Gd", nomeLT: "Judices", abbrevLT: "Jdgs", nomeEN: "Judges", abbrevEN: "Judg"
	},
	{
		num: 8, testamento: "AT", gruppo: "Libri Storici", nomeIT: "Rut", abbrevIT: "Rt;Rut", nomeLT: "Ruth", abbrevLT: "Rth", nomeEN: "Ruth", abbrevEN: "Ruth"
	},
	{
		num: 9, testamento: "AT", gruppo: "Libri Storici", nomeIT: "1 Samuele", abbrevIT: "1Sam;1Samuele;1S", nomeLT: "1 Samuel", abbrevLT: "1Sam", nomeEN: "1 Samuel", abbrevEN: "1Sam"
	},
	{
		num: 10, testamento: "AT", gruppo: "Libri Storici", nomeIT: "2 Samuele", abbrevIT: "2Sam;2Samuele;2S", nomeLT: "2 Samuel", abbrevLT: "2Sam", nomeEN: "2 Samuel", abbrevEN: "2Sam"
	},
	{
		num: 11, testamento: "AT", gruppo: "Libri Storici", nomeIT: "1 Re", abbrevIT: "1Re;1Re;1R", nomeLT: "1 Regum", abbrevLT: "1Kgs", nomeEN: "1 Kings", abbrevEN: "1Kgs"
	},
	{
		num: 12, testamento: "AT", gruppo: "Libri Storici", nomeIT: "2 Re", abbrevIT: "2Re;2Re;2R", nomeLT: "2 Regum", abbrevLT: "2Kgs", nomeEN: "2 Kings", abbrevEN: "2Kgs"
	},
	{
		num: 13, testamento: "AT", gruppo: "Libri Storici", nomeIT: "1 Cronache", abbrevIT: "1Cr;1Cron;1Cr", nomeLT: "1 Paralipomenon", abbrevLT: "1Chr", nomeEN: "1 Chronicles", abbrevEN: "1Chr"
	},
	{
		num: 14, testamento: "AT", gruppo: "Libri Storici", nomeIT: "2 Cronache", abbrevIT: "2Cr;2Cron;2Cr", nomeLT: "2 Paralipomenon", abbrevLT: "2Chr", nomeEN: "2 Chronicles", abbrevEN: "2Chr"
	},
	{
		num: 15, testamento: "AT", gruppo: "Libri Storici", nomeIT: "Esdra", abbrevIT: "Esd;Esdra", nomeLT: "Esdra", abbrevLT: "Ezr", nomeEN: "Ezra", abbrevEN: "Ezra"
	},
	{
		num: 16, testamento: "AT", gruppo: "Libri Storici", nomeIT: "Neemia", abbrevIT: "Ne;Neemia", nomeLT: "Nehemias", abbrevLT: "Neh", nomeEN: "Nehemiah", abbrevEN: "Neh"
	},
	{
		num: 17, testamento: "AT", gruppo: "Libri Storici", nomeIT: "Tobia", abbrevIT: "Tb;Tobia", nomeLT: "Tobias", abbrevLT: "Tb", nomeEN: "Tobit", abbrevEN: "Tob"
	},
	{
		num: 18, testamento: "AT", gruppo: "Libri Storici", nomeIT: "Giuditta", abbrevIT: "Gdt;Giuditta", nomeLT: "Judith", abbrevLT: "Jdt", nomeEN: "Judith", abbrevEN: "Jdt"
	},
	{
		num: 19, testamento: "AT", gruppo: "Libri Storici", nomeIT: "Ester", abbrevIT: "Est;Ester", nomeLT: "Esther", abbrevLT: "Est", nomeEN: "Esther", abbrevEN: "Est"
	},
	{
		num: 20, testamento: "AT", gruppo: "Libri Storici", nomeIT: "1 Maccabei", abbrevIT: "1Mac;1Macc", nomeLT: "1 Machabæorum", abbrevLT: "1Macc", nomeEN: "1 Maccabees", abbrevEN: "1Macc"
	},
	{
		num: 21, testamento: "AT", gruppo: "Libri Storici", nomeIT: "2 Maccabei", abbrevIT: "2Mac;2Macc", nomeLT: "2 Machabæorum", abbrevLT: "2Macc", nomeEN: "2 Maccabees", abbrevEN: "2Macc"
	},
	{
		num: 22, testamento: "AT", gruppo: "Libri Poetici", nomeIT: "Giobbe", abbrevIT: "Gb;Giobbe", nomeLT: "Iob", abbrevLT: "Job", nomeEN: "Job", abbrevEN: "Job"
	},
	{
		num: 23, testamento: "AT", gruppo: "Libri Poetici", nomeIT: "Salmi", abbrevIT: "Sal;Salmi;Ps", nomeLT: "Psalmi", abbrevLT: "Ps", nomeEN: "Psalms", abbrevEN: "Ps"
	},
	{
		num: 24, testamento: "AT", gruppo: "Libri Poetici", nomeIT: "Proverbi", abbrevIT: "Prv;Prov", nomeLT: "Proverbia", abbrevLT: "Prv", nomeEN: "Proverbs", abbrevEN: "Prov"
	},
	{
		num: 25, testamento: "AT", gruppo: "Libri Poetici", nomeIT: "Ecclesiaste", abbrevIT: "Qo;Eccl", nomeLT: "Ecclesiastes", abbrevLT: "Eccl", nomeEN: "Ecclesiastes", abbrevEN: "Eccl"
	},
	{
		num: 26, testamento: "AT", gruppo: "Libri Poetici", nomeIT: "Cantico dei Cantici", abbrevIT: "Ct;Cant", nomeLT: "Canticum Canticorum", abbrevLT: "Cant", nomeEN: "Song of Songs", abbrevEN: "Song"
	},
	{
		num: 27, testamento: "AT", gruppo: "Profeti Maggiori", nomeIT: "Isaia", abbrevIT: "Is;Isa", nomeLT: "Isaias", abbrevLT: "Isa", nomeEN: "Isaiah", abbrevEN: "Isa"
	},
	{
		num: 28, testamento: "AT", gruppo: "Profeti Maggiori", nomeIT: "Geremia", abbrevIT: "Ger;Jr", nomeLT: "Jeremias", abbrevLT: "Jer", nomeEN: "Jeremiah", abbrevEN: "Jer"
	},
	{
		num: 29, testamento: "AT", gruppo: "Profeti Maggiori", nomeIT: "Lamentazioni", abbrevIT: "Lm;Lam", nomeLT: "Lamentationes", abbrevLT: "Lam", nomeEN: "Lamentations", abbrevEN: "Lam"
	},
	{
		num: 30, testamento: "AT", gruppo: "Profeti Maggiori", nomeIT: "Baruc", abbrevIT: "Bar;Baruc", nomeLT: "Baruch", abbrevLT: "Bar", nomeEN: "Baruch", abbrevEN: "Bar"
	},
	{
		num: 31, testamento: "AT", gruppo: "Profeti Maggiori", nomeIT: "Ezechiele", abbrevIT: "Ez;Ezec", nomeLT: "Ezechiel", abbrevLT: "Ezek", nomeEN: "Ezekiel", abbrevEN: "Ezek"
	},
	{
		num: 32, testamento: "AT", gruppo: "Profeti Minori", nomeIT: "Osea", abbrevIT: "Os;Osea", nomeLT: "Osee", abbrevLT: "Hos", nomeEN: "Hosea", abbrevEN: "Hos"
	},
	{
		num: 33, testamento: "AT", gruppo: "Profeti Minori", nomeIT: "Gioele", abbrevIT: "Gl;Gioele", nomeLT: "Joel", abbrevLT: "Joel", nomeEN: "Joel", abbrevEN: "Joel"
	},
	{
		num: 34, testamento: "AT", gruppo: "Profeti Minori", nomeIT: "Amos", abbrevIT: "Am;Amos", nomeLT: "Amos", abbrevLT: "Amos", nomeEN: "Amos", abbrevEN: "Amos"
	},
	{
		num: 35, testamento: "AT", gruppo: "Profeti Minori", nomeIT: "Abdia", abbrevIT: "Abd;Abdia", nomeLT: "Abdias", abbrevLT: "Obad", nomeEN: "Obadiah", abbrevEN: "Obad"
	},
	{
		num: 36, testamento: "AT", gruppo: "Profeti Minori", nomeIT: "Giona", abbrevIT: "Gn;Giona", nomeLT: "Jonas", abbrevLT: "Jon", nomeEN: "Jonah", abbrevEN: "Jon"
	},
	{
		num: 37, testamento: "AT", gruppo: "Profeti Minori", nomeIT: "Michea", abbrevIT: "Mi;Mich", nomeLT: "Micha", abbrevLT: "Mic", nomeEN: "Micah", abbrevEN: "Mic"
	},
	{
		num: 38, testamento: "AT", gruppo: "Profeti Minori", nomeIT: "Naum", abbrevIT: "Na;Naum", nomeLT: "Nahum", abbrevLT: "Nah", nomeEN: "Nahum", abbrevEN: "Nah"
	},
	{
		num: 39, testamento: "AT", gruppo: "Profeti Minori", nomeIT: "Abacuc", abbrevIT: "Ab;Abacuc", nomeLT: "Habacuc", abbrevLT: "Hab", nomeEN: "Habakkuk", abbrevEN: "Hab"
	},
	{
		num: 40, testamento: "AT", gruppo: "Profeti Minori", nomeIT: "Sofonia", abbrevIT: "So;Sofonia", nomeLT: "Sophonias", abbrevLT: "Zeph", nomeEN: "Zephaniah", abbrevEN: "Zeph"
	},
	{
		num: 41, testamento: "AT", gruppo: "Profeti Minori", nomeIT: "Aggeo", abbrevIT: "Ag;Aggeo", nomeLT: "Aggeus", abbrevLT: "Hag", nomeEN: "Haggai", abbrevEN: "Hag"
	},
	{
		num: 42, testamento: "AT", gruppo: "Profeti Minori", nomeIT: "Zaccaria", abbrevIT: "Zc;Zacc", nomeLT: "Zacharias", abbrevLT: "Zech", nomeEN: "Zechariah", abbrevEN: "Zech"
	},
	{
		num: 43, testamento: "AT", gruppo: "Profeti Minori", nomeIT: "Malachia", abbrevIT: "Ml;Mal", nomeLT: "Malachias", abbrevLT: "Mal", nomeEN: "Malachi", abbrevEN: "Mal"
	},
	{
		num: 44, testamento: "AT", gruppo: "Libri Sapienziali", nomeIT: "Sapienza", abbrevIT: "Sap;Sapienza", nomeLT: "Sapientia", abbrevLT: "Wis", nomeEN: "Wisdom", abbrevEN: "Wis"
	},
	{
		num: 45, testamento: "AT", gruppo: "Libri Sapienziali", nomeIT: "Siracide", abbrevIT: "Sir;Eccli", nomeLT: "Ecclesiasticus", abbrevLT: "Sir", nomeEN: "Ecclesiasticus", abbrevEN: "Sir"
	},
	{
		num: 46, testamento: "AT", gruppo: "Libri Profetici", nomeIT: "Baruch", abbrevIT: "Bar;Baruc", nomeLT: "Baruch", abbrevLT: "Bar", nomeEN: "Baruch", abbrevEN: "Bar"
	},
	{
		num: 47, testamento: "NT", gruppo: "I Vangeli", nomeIT: "Matteo", abbrevIT: "Mt;Mat", nomeLT: "Evangelium secundum Matthæum", abbrevLT: "Matth", nomeEN: "Matthew", abbrevEN: "Matt"
	},
	{
		num: 48, testamento: "NT", gruppo: "I Vangeli", nomeIT: "Marco", abbrevIT: "Mc;Mar;Mr", nomeLT: "Evangelium secundum Marcum", abbrevLT: "Mar", nomeEN: "Mark", abbrevEN: "Mark"
	},
	{
		num: 49, testamento: "NT", gruppo: "I Vangeli", nomeIT: "Luca", abbrevIT: "Lc;Luc", nomeLT: "Evangelium secundum Lucam", abbrevLT: "Luc", nomeEN: "Luke", abbrevEN: "Luke"
	},
	{
		num: 50, testamento: "NT", gruppo: "I Vangeli", nomeIT: "Giovanni", abbrevIT: "Gv;Gio", nomeLT: "Evangelium secundum Ioannem", abbrevLT: "John", nomeEN: "John", abbrevEN: "John"
	},
	{
		num: 51, testamento: "NT", gruppo: "Atti", nomeIT: "Atti degli Apostoli", abbrevIT: "At;Att", nomeLT: "Actus Apostolorum", abbrevLT: "Act", nomeEN: "Acts", abbrevEN: "Acts"
	},
	{
		num: 52, testamento: "NT", gruppo: "Epistole Paoline", nomeIT: "Romani", abbrevIT: "Rm;Rom", nomeLT: "Epistula ad Romanos", abbrevLT: "Rom", nomeEN: "Romans", abbrevEN: "Rom"
	},
	{
		num: 53, testamento: "NT", gruppo: "Epistole Paoline", nomeIT: "1 Corinzi", abbrevIT: "1Cor;1Co", nomeLT: "Epistula 1 ad Corinthios", abbrevLT: "1Cor", nomeEN: "1 Corinthians", abbrevEN: "1Cor"
	},
	{
		num: 54, testamento: "NT", gruppo: "Epistole Paoline", nomeIT: "2 Corinzi", abbrevIT: "2Cor;2Co", nomeLT: "Epistula 2 ad Corinthios", abbrevLT: "2Cor", nomeEN: "2 Corinthians", abbrevEN: "2Cor"
	},
	{
		num: 55, testamento: "NT", gruppo: "Epistole Paoline", nomeIT: "Galati", abbrevIT: "Gal;Ga", nomeLT: "Epistula ad Galatas", abbrevLT: "Gal", nomeEN: "Galatians", abbrevEN: "Gal"
	},
	{
		num: 56, testamento: "NT", gruppo: "Epistole Paoline", nomeIT: "Efesini", abbrevIT: "Ef;Efe", nomeLT: "Epistula ad Ephesios", abbrevLT: "Eph", nomeEN: "Ephesians", abbrevEN: "Eph"
	},
	{
		num: 57, testamento: "NT", gruppo: "Epistole Paoline", nomeIT: "Filippesi", abbrevIT: "Fil;Php", nomeLT: "Epistula ad Philippenses", abbrevLT: "Phil", nomeEN: "Philippians", abbrevEN: "Phil"
	},
	{
		num: 58, testamento: "NT", gruppo: "Epistole Paoline", nomeIT: "Colossesi", abbrevIT: "Col;Colo", nomeLT: "Epistula ad Colossenses", abbrevLT: "Col", nomeEN: "Colossians", abbrevEN: "Col"
	},
	{
		num: 59, testamento: "NT", gruppo: "Epistole Paoline", nomeIT: "1 Tessalonicesi", abbrevIT: "1Ts;1Tes", nomeLT: "Epistula 1 ad Thessalonicenses", abbrevLT: "1Thess", nomeEN: "1 Thessalonians", abbrevEN: "1Thess"
	},
	{
		num: 60, testamento: "NT", gruppo: "Epistole Paoline", nomeIT: "2 Tessalonicesi", abbrevIT: "2Ts;2Tes", nomeLT: "Epistula 2 ad Thessalonicenses", abbrevLT: "2Thess", nomeEN: "2 Thessalonians", abbrevEN: "2Thess"
	},
	{
		num: 61, testamento: "NT", gruppo: "Epistole Paoline", nomeIT: "1 Timoteo", abbrevIT: "1Tm;1Tim", nomeLT: "Epistula 1 ad Timotheum", abbrevLT: "1Tim", nomeEN: "1 Timothy", abbrevEN: "1Tim"
	},
	{
		num: 62, testamento: "NT", gruppo: "Epistole Paoline", nomeIT: "2 Timoteo", abbrevIT: "2Tm;2Tim", nomeLT: "Epistula 2 ad Timotheum", abbrevLT: "2Tim", nomeEN: "2 Timothy", abbrevEN: "2Tim"
	},
	{
		num: 63, testamento: "NT", gruppo: "Epistole Paoline", nomeIT: "Tito", abbrevIT: "Ti;Tit", nomeLT: "Epistula ad Titum", abbrevLT: "Titus", nomeEN: "Titus", abbrevEN: "Titus"
	},
	{
		num: 64, testamento: "NT", gruppo: "Epistole Paoline", nomeIT: "Filemone", abbrevIT: "Fm;File", nomeLT: "Epistula ad Philemonem", abbrevLT: "Phlm", nomeEN: "Philemon", abbrevEN: "Phlm"
	},
	{
		num: 65, testamento: "NT", gruppo: "Epistole Generali", nomeIT: "Ebrei", abbrevIT: "Eb;Heb", nomeLT: "Epistula ad Hebraeos", abbrevLT: "Heb", nomeEN: "Hebrews", abbrevEN: "Heb"
	},
	{
		num: 66, testamento: "NT", gruppo: "Epistole Generali", nomeIT: "Giacomo", abbrevIT: "Gc;Giac", nomeLT: "Epistula Iacobi", abbrevLT: "Jas", nomeEN: "James", abbrevEN: "Jas"
	},
	{
		num: 67, testamento: "NT", gruppo: "Epistole Generali", nomeIT: "1 Pietro", abbrevIT: "1Pt;1Pe", nomeLT: "Epistula 1 Petri", abbrevLT: "1Pet", nomeEN: "1 Peter", abbrevEN: "1Pet"
	},
	{
		num: 68, testamento: "NT", gruppo: "Epistole Generali", nomeIT: "2 Pietro", abbrevIT: "2Pt;2Pe", nomeLT: "Epistula 2 Petri", abbrevLT: "2Pet", nomeEN: "2 Peter", abbrevEN: "2Pet"
	},
	{
		num: 69, testamento: "NT", gruppo: "Epistole Generali", nomeIT: "1 Giovanni", abbrevIT: "1Gv;1Gi", nomeLT: "Epistula 1 Ioannis", abbrevLT: "1John", nomeEN: "1 John", abbrevEN: "1John"
	},
	{
		num: 70, testamento: "NT", gruppo: "Epistole Generali", nomeIT: "2 Giovanni", abbrevIT: "2Gv;2Gi", nomeLT: "Epistula 2 Ioannis", abbrevLT: "2John", nomeEN: "2 John", abbrevEN: "2John"
	},
	{
		num: 71, testamento: "NT", gruppo: "Epistole Generali", nomeIT: "3 Giovanni", abbrevIT: "3Gv;3Gi", nomeLT: "Epistula 3 Ioannis", abbrevLT: "3John", nomeEN: "3 John", abbrevEN: "3John"
	},
	{
		num: 72, testamento: "NT", gruppo: "Epistole Generali", nomeIT: "Giuda", abbrevIT: "Gd;Giuda", nomeLT: "Epistula Iudae", abbrevLT: "Jude", nomeEN: "Jude", abbrevEN: "Jude"
	},
	{
		num: 73, testamento: "NT", gruppo: "Apocalisse", nomeIT: "Apocalisse", abbrevIT: "Ap;Apoc", nomeLT: "Apocalypsis", abbrevLT: "Rev", nomeEN: "Revelation", abbrevEN: "Rev"
	}
];

// Funzione per ottenere il nome completo del libro in italiano dalla sigla
// Function to get the full Italian book name from abbreviation
function getNomeLibroCompleto(sigla) {
	sigla = sigla.trim();
	// Cicla tutti i libri di LibriBibbia
	// Loop through all books in LibriBibbia
	for (const libro of LibriBibbia) {
		const abbrevList = libro.abbrevIT.split(";").map(s => s.trim());
		if (abbrevList.includes(sigla)) {
			return libro.nomeIT;
		}
	}
	// se non trovato ritorna sigla originale
	// if not found return original abbreviation
	return sigla;
}
function getActiveVersions() {
	try {
		if (fs.existsSync(SETTINGS_FILE)) {
			const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
			return data.activeVersions || DEFAULT_ACTIVE_VERSIONS;
		}
	}
	catch (e) {
		console.warn("Errore lettura settings.json:", e);
	}
	return DEFAULT_ACTIVE_VERSIONS;
}
// Funzione per creare e aprire il modal con il versetto
// Function to create and open the modal with the verse
class BibleRefModal extends Modal {
	constructor(app, reference, content, onGearClick) {
		super(app);
		this.reference = reference;
		// Ora è un array di {versione, testo}
		this.content = content;
		this.onGearClick = onGearClick;
	}

	// Funzione chiamata all'apertura del modal per creare il contenuto
	// Function called on modal open to create content
	onOpen() {
		const { contentEl, titleEl } = this;

		titleEl.empty();
		contentEl.empty();

		// Barra superiore del modal con ingranaggio, titolo e chiusura
		// Top bar of the modal with gear, title, and close button
		const topBar = document.createElement("div");
		topBar.style.cssText = `
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 32px;
		padding: 8px 12px;
		background-color: #1e1e1e;
		color: #fff;
		font-weight: bold;
		font-size: 16px;
		`;

		// Apre le impostazioni
		// Opens settings
		const gear = document.createElement("span");
		gear.innerText = "⚙️";
		gear.title = "Impostazioni Modal for Bible References";
		gear.style.cursor = "pointer";
		gear.style.fontSize = "18px";
		gear.style.marginRight = "10px";
		gear.onclick = () => this.onGearClick?.();

		const title = document.createElement("div");
		title.style.flexGrow = "1";
		title.style.textAlign = "center";
		title.textContent = this.reference;

		const closeBtn = document.createElement("button");
		closeBtn.textContent = "×";
		closeBtn.style.cssText = `
			font-size: 20px;
			background: none;
			border: none;
			color: white;
			cursor: pointer;
			width: 32px;
			height: 32px;
			display: flex;
			align-items: center;
			justify-content: center;
		`;
		closeBtn.onclick = () => this.close();

		topBar.appendChild(gear);
		topBar.appendChild(title);
		topBar.appendChild(closeBtn);
		titleEl.appendChild(topBar);

		// Corpo principale con tanti div quanti sono le versioni attive
		// Main body with as many divs as active versions
		const mainContent = document.createElement("div");
		mainContent.style.padding = "12px 20px";

		// this.content è un array di oggetti {version, text}
		for (const item of this.content) {
			const divVersion = document.createElement("div");
			divVersion.style.marginBottom = "12px";
			divVersion.style.borderBottom = "1px solid #666";
			divVersion.style.paddingBottom = "6px";

			// Titolo versione
			const versionTitle = document.createElement("div");
			versionTitle.textContent = item.version;
			versionTitle.style.fontWeight = "bold";
			versionTitle.style.marginBottom = "6px";
			versionTitle.style.color = "#ccc";
			divVersion.appendChild(versionTitle);

			// Testo del versetto
			const verseTextDiv = document.createElement("div");
			verseTextDiv.innerHTML = item.text;
			divVersion.appendChild(verseTextDiv);

			mainContent.appendChild(divVersion);
		}
		contentEl.appendChild(mainContent);
	}
}

// Corpo principale del modal con il testo del versetto
// Main content of the modal with the verse text
module.exports = class Modal4BibleRefs extends Plugin {

	// Flag temporaneo in RAM per evitare attivazioni ripetute della CEI 1974 di default
	autoActivatedCEI = false;

	// Funzione onload del plugin, si registra l'evento mouseover
	// Plugin onload function, registers mouseover event
	async onload() {
		console.log("Modal4BibleRefs plugin loaded");
		console.log("Settings path:" + settingsPath);
		// Versioni attive all'avvio (di default CEI 1974 e Vulgata Latina)
		// Active versions on load (default: CEI 1974 and Vulgata Latina)
		await this.loadSettings();

		// Fallback di sicurezza nel caso activeVersions non sia definito o se non esiste ancora, assegna default come Array
		if (!this.activeVersions) {
			this.activeVersions = DEFAULT_ACTIVE_VERSIONS;
		}

		// Aggiunta evento per mostrare il modal al passaggio del mouse sui riferimenti
		// Add event to show modal on hover over BibleRef
		this.registerDomEvent(document, "mouseover", async (evt) => {
			const target = evt.target;
			// Controlla se il target ha classe BibleRef e ottiene il riferimento
			// Checks if target has BibleRef class and gets the reference
			if (target instanceof HTMLElement && target.classList.contains("BibleRef")) {
				const match = target.innerText.match(/\[\[(.*?)\|/);
				if (match) {
					const reference = match[1].trim();
					const refMatch = reference.match(/^([A-Za-z]+)\s?(\d+),(\d+)$/);
					// Parsing del riferimento biblico in sigla, capitolo e versetto
					// Parsing the biblical reference into abbreviation, chapter, and verse
					if (!refMatch) return;

					const sigla = refMatch[1];
					const capitolo = refMatch[2];
					const versetto = refMatch[3];
					const titoloCompleto = `${getNomeLibroCompleto(sigla)} ${capitolo},${versetto}`;

					// Ottiene i testi di tutte le versioni attive (array di {version, text})
					const verseTexts = [];
					for (const versioni of this.activeVersions) {
						const text = await this.lookupVerseTextVersion(versioni, sigla, capitolo, versetto);
						if (text) {
							verseTexts.push({ versioni: versioni, text: text });
						}
					}

					if (verseTexts.length > 0) {
						new BibleRefModal(this.app, titoloCompleto, verseTexts, () => this.openSettingsModal()).open();
					}
				}
			}
		});
	}

	// Caricamento delle impostazioni utente
	// User settings loading
	async loadSettings() {
		try {
			if (fs.existsSync(settingsPath)) {
				const data = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
				this.activeVersions = data.activeVersions || DEFAULT_ACTIVE_VERSIONS;
			}
			else {
				this.activeVersions = DEFAULT_ACTIVE_VERSIONS;
			}
		}
		catch (err) {
			console.error("Errore caricamento impostazioni:", err);
			this.activeVersions = DEFAULT_ACTIVE_VERSIONS;
		}
	}
	// Salvataggio delle impostazioni utente
	// User settings saving
	async saveSettings() {
		try {
			fs.writeFileSync(settingsPath, JSON.stringify({ activeVersions: this.activeVersions }, null, 2));
		}
		catch (err) {
			console.error("Errore salvataggio impostazioni:", err);
		}
	}

	onunload() {
		console.log("Modal4BibleRefs plugin unloaded");
	}

	// Pannello impostazioni con toggle versioni
	// Settings panel with version toggles
	openSettingsModal() {
		const modal = new Modal(this.app);
		modal.titleEl.setText("Impostazioni versioni bibliche");

		// Contenitore per il messaggio di fallback e il bottone di chiusura
		// Container for fallback message and close button
		const container = document.createElement("div");

		// copia temporanea per i toggle
		// temporary copy for toggles
		const tempActive = new Set(this.activeVersions);

		Object.keys(fileNamePrefixes).forEach((versioni) => {
			new Setting(modal.contentEl)
				.setName(versioni)
				.addToggle((toggle) => {
					toggle.setValue(tempActive.has(versioni)).onChange((value) => {
						if (value) tempActive.add(versioni);
						else tempActive.delete(versioni);
					});
				});
		});

		// Messaggio per fallback automatico
		// Message for automatic fallback
		const msg = document.createElement("div");
		msg.id = "fallback-message";
		msg.style.color = "#999";
		msg.style.marginTop = "14px";
		msg.style.fontStyle = "italic";
		container.appendChild(msg);

		// Bottone di chiusura con salvataggio e verifica
		// Close button with save and check
		const closeBtn = document.createElement("button");
		closeBtn.textContent = "Chiudi";
		closeBtn.style.marginTop = "16px";
		closeBtn.addEventListener("click", async () => {
			if (tempActive.size === 0) {
				tempActive.add("CEI 1974");
				this.autoActivatedCEI = true;
				msg.textContent = "Nessuna versione attiva: attivata automaticamente la CEI 1974.";
			}
			else {
				this.autoActivatedCEI = false;
				msg.textContent = "";
			}
			this.activeVersions = Array.from(tempActive);
			await this.saveSettings();
			modal.close();
		});

		container.appendChild(closeBtn);
		modal.contentEl.appendChild(container);
		modal.open();
	}

	// Funzione di lookup del testo dei versetti da file locali in base alla versione
	// Verse text lookup function from local files based on version
	async lookupVerseTextVersion(versione, sigla, capitolo, versetto) {
		try {
			const libro = LibriBibbia.find(l => l.abbrevIT.split(";").map(s => s.trim()).includes(sigla));
			if (!libro) {
				console.warn("Libro non trovato per sigla:", sigla);
				return null;
			}

			// Percorso base per la versione (sostituisci qui se versioni hanno cartelle diverse)
			// Base path for the version (replace here if versions have different folders)
			const numLibro = libro.num.toString().padStart(2, "0");
			const testamento = libro.testamento === "AT" ? "AT" : "NT";
			const nomeCartella = `${testamento} - ${numLibro} ${libro.nomeIT}`;

			let baseFolder;

			switch (versione) {
				case "Vulgata Latina":
					baseFolder = `${BibbiaPath}/Vulgata Latina/${nomeCartella}`;
					break;
				case "Nova Vulgata":
					baseFolder = `${BibbiaPath}/Nova Vulgata/${nomeCartella}`;
					break;
				case "CEI 1974":
					baseFolder = `${BibbiaPath}/CEI 1974/${nomeCartella}`;
					break;
				case "CEI 2008":
					baseFolder = `${BibbiaPath}/CEI 2008/${nomeCartella}`;
					break;
				case "Interconfessionale":
					baseFolder = `${BibbiaPath}/Interconfessionale/${nomeCartella}`;
					break;
				case "Ricciotti":
					baseFolder = `${BibbiaPath}/Ricciotti/${nomeCartella}`;
					break;
				case "Martini":
					baseFolder = `${BibbiaPath}/Martini/${nomeCartella}`;
					break;
				case "Diodati":
					baseFolder = `${BibbiaPath}/Diodati/${nomeCartella}`;
					break;
				case "Riveduta":
					baseFolder = `${BibbiaPath}/Riveduta/${nomeCartella}`;
					break;
				case "Nuova Diodati":
					baseFolder = `${BibbiaPath}/Nuova Diodati/${nomeCartella}`;
					break;
				case "Nuova Riveduta":
					baseFolder = `${BibbiaPath}/Nuova Riveduta/${nomeCartella}`;
					break;
				case "Nuova Riveduta 2020":
					baseFolder = `${BibbiaPath}/Nuova Riveduta 2020/${nomeCartella}`;
					break;
				default:
					return null;
			}
			const prefix = fileNamePrefixes[versione];
			if (!prefix) return null;
			const fileName = `${prefix} ${sigla} ${capitolo.padStart(2, "0")}.md`;
			const filePath = path.join(baseFolder, fileName);
			console.log("Looking for:", filePath);
			// Lettura contenuto file markdown
			// Reads markdown file content
			const content = fs.readFileSync(filePath, "utf-8");

			// Regex per estrarre il testo del versetto specifico
			// Regex to extract the specific verse text
			const regex = new RegExp(
				`######\\s*${versetto}\\s*[\\r\\n]+(?:.*?)<span class=vrs>${versetto}</span>([\\s\\S]*?)(?=\\n######|$)`,
				"m"
			);

			// Restituisce il testo del versetto oppure null se non trovato
			// Returns the verse text or null if not found
			const match = content.match(regex);
			if (match) {
				return match[1].trim();
			}
			// Gestione errori nella lettura o parsing del file
			// Error handling for file reading or parsing
			else {
				console.warn("Versetto non trovato nel file:", filePath);
				return null;
			}
		}
		catch (err) {
			console.error("Errore lookupVerseText:", err);
			return null;
		}
	}
};