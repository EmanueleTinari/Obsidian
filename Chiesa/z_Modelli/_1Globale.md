<%*

// Folder to start with to include
const folder					= 'Documenti';
// File prefix to exclude
const excludedPrefix			= '_'
// Frontmatter Key autore-doc
const aKey						= 'autore-doc';
const txt_autoreDocumento		= 'autore-doc: ';
var autoreDoc					= '';
// Frontmatter Key tipo-doc
const tKey						= 'tipo-doc';
const txt_tipoDocumento			= 'tipo-doc: ';
var tipoDoc						= '';
const txt_titoloDocumento		= 'titolo-doc: ';
var titoloDoc					= '';
var dayDoc						= '';
var monthDoc					= '';
var yearDoc						= '';
// Frontmatter Key lingua-doc
const ldKey						= 'lingua-doc';
const txt_linguaDocumento		= 'lingua-doc: ';
var linguaDoc					= '';
// Frontmatter Key lingua-orig
const loKey						= 'lingua-orig';
const txt_linguaOrigDocumento	= 'lingua-orig: ';
var linguaOrig					= '';




const txt_licenzaDocumento		= 'licenza-doc: Copyright © Dicastero per la Comunicazione - Libreria Editrice Vaticana';
var licenzaDocumento			= '';
const txt_licenzaNota			= 'licenza-nota: Copyright © 2025 Emanuele Tinari under Creative Commons BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/';
var licenzaNota					= '';
const urlDocumento_p1			= 'url-documento:  \"[Link al documento sul sito del Vaticano](';
var urlDocumento_p2				= '';
const urlDocumento_p3			= '\)\"';
var urlDocumento				= '';

const txt_RigaChiusura			= '---';

let isDayDocCorrect				= true;
let isMonthDocCorrect			= true;
let isYearDocCorrect			= true;




// returns the next year
var nextYear					= new Date().getFullYear() + 1
console.log('nextYear var value: ' + nextYear);

const files = app.vault.getMarkdownFiles();
// inFolder'll contain all files extracted
const inFolder = new Array();
files.forEach((file) => {
    if( file.path.includes( folder ) &&  !file.path.includes( excludedPrefix )) {
	    // Push the file object
        inFolder.push(file)
    };
})

// Extract unique 'autore-doc' values
let autoreDocValues = new Set();
for (const file of inFolder) {
  const cache = app.metadataCache.getFileCache(file);
  if (cache && cache.frontmatter && cache.frontmatter[aKey]) {
    autoreDocValues.add(cache.frontmatter[aKey]);
  }
}
const uniqueAutoreDocValues = Array.from(autoreDocValues);

// Extract unique 'tipo-doc' values
let tipoDocValues = new Set();
for (const file of inFolder) {
  const cache = app.metadataCache.getFileCache(file);
  if (cache && cache.frontmatter && cache.frontmatter[tKey]) {
    tipoDocValues.add(cache.frontmatter[tKey]);
  }
}
const uniqueTipoDocValues = Array.from(tipoDocValues);

// Extract unique 'lingua-doc' values
let linguaDocValues = new Set();
for (const file of inFolder) {
  const cache = app.metadataCache.getFileCache(file);
  if (cache && cache.frontmatter && cache.frontmatter[ldKey]) {
    linguaDocValues.add(cache.frontmatter[ldKey]);
  }
}
const uniqueLinguaDocValues = Array.from(linguaDocValues);

// Extract unique 'lingua-orig' values
let linguaOrigDocValues = new Set();
for (const file of inFolder) {
  const cache = app.metadataCache.getFileCache(file);
  if (cache && cache.frontmatter && cache.frontmatter[loKey]) {
    linguaOrigDocValues.add(cache.frontmatter[loKey]);
  }
}
const uniqueLinguaOrigDocValues = Array.from(linguaOrigDocValues);

// Suggester options, including 'Add New author'
const suggesterOptionsAutoreDoc = ['Aggiungi un nuovo autore per il documento', ...uniqueAutoreDocValues];

// Create the suggester
const selectedAutoreDocValue = await tp.system.suggester(
  (item) => item,
  suggesterOptionsAutoreDoc,
  true // Allow empty selection
);

// Handle the selected value
if (selectedAutoreDocValue === 'Aggiungi un nuovo autore per il documento') {
	// Prompt the user for a new value
	const newAutoreValue = await tp.system.prompt('Inserisci un nuovo autore per il documento che si sta caricando');
	if (newAutoreValue) {
		// Set the template result to the new value
	    autoreDoc = txt_autoreDocumento + '\"' + newAutoreValue + '\"';
console.log('Content of variable autoreDoc da newAutoreValue: ' + autoreDoc);
	}
	else {
		// Handle cancellation
		autoreDoc = '';
	  }
}
else if (selectedAutoreDocValue) {
	// Set the template result to the selected value
	autoreDoc = txt_autoreDocumento + '\"' + selectedAutoreDocValue + '\"';
console.log('Content of variable autoreDoc dal suggester selectedAutoreDocValue: ' + autoreDoc);
}
else {
	// Handle no selection
	autoreDoc = '';
}

// Suggester options, including 'Add New doc Type'
const suggesterOptionsTipoDoc = ['Aggiungi un nuovo tipo di documento', ...uniqueTipoDocValues];

// Create the suggester
const selectedTipoDocValue = await tp.system.suggester(
  (item) => item,
  suggesterOptionsTipoDoc,
  true // Allow empty selection
);

// Handle the selected value
if (selectedTipoDocValue === 'Aggiungi un nuovo tipo di documento') {
	// Prompt the user for a new value
	const newTipoDocValue = await tp.system.prompt('Inserisci una nuova tipologia per il documento che si sta caricando:');
	if (newTipoDocValue) {
		// Set the template result to the new value
	    tipoDoc = txt_tipoDocumento + '\"' + newTipoDocValue + '\"';
console.log('Content of variable tipoDoc da newTipoDocValue: ' + tipoDoc);
	}
	else {
		// Handle cancellation
		tipoDoc = '';
	  }
}
else if (selectedTipoDocValue) {
	// Set the template result to the selected value
	tipoDoc = txt_tipoDocumento + '\"' + selectedTipoDocValue + '\"';
console.log('Content of variable tipoDoc dal suggester selectedTipoDocValue: ' + tipoDoc);
}
else {
	// Handle no selection
	tipoDoc = '';
}




// Ask for title of document
const newTitleDocValue = await tp.system.prompt('Inserisci il titolo del documento che si sta caricando:');
	if (newTitleDocValue) {
		// Set the template result to the new value
	    titoloDoc = txt_titoloDocumento + newTitleDocValue;
console.log('Content of variable titoloDoc da newTitleDocValue: ' + titoloDoc);
	}
	else {
		// Handle cancellation
		titoloDoc = '';
	  }

// Ask for document day issue
while (isDayDocCorrect) {
	// wait for user input
	var tmpDay = await tp.system.prompt('Insert document publication day');
	// tmpDay variable contains user answer
	console.log('tmpDay var value: ' + tmpDay);
	// https://stackoverflow.com/a/14636638/4805093
	// check tmpDay var value, this should be an integer number from 1 to 31
	if ( tmpDay === '' || !tmpDay ) {
		// user not insert nothing
		console.log('tmpDay is empty: ' + tmpDay);
		var question = 'Day value is empty. Do you want to repeat, leave field empty or exit?';
		console.log('const question: ' + question);
		var chose = await tp.system.suggester(['Repeat ask for day document', 'Leave field empty', 'Exit'],['Repeat ask for day document', 'Leave field empty', 'Exit'], false, question);
		console.log('const answer: ' + chose);
		if (chose === 'Repeat ask for day document')
		{
			console.log('const chose: ' + chose);
			chose		= '';
			question	= '';
		}
		else if (chose === 'Leave field empty')
		{
			console.log('const chose: ' + chose);
			dayDoc			= tmpDay;
			chose			= '';
			question		= '';
			isDayDocCorrect	= false;
		}
		else if (chose === 'Exit')
		{
			console.log('const chose: ' + chose);
			chose			= '';
			question		= '';
			isDayDocCorrect	= false;
			return;
		}
	}
	else if ( isNaN(tmpDay) ) {
		// no it is NOT numeric
		console.log('tmpDay is NOT numeric: ' + tmpDay);
	}
	else {
		// yes it is numeric
		if ( tmpDay % 1 === 0 ) {
			// yes it's an integer
			if ( tmpDay >= 1 && tmpDay <= 31 ) {
				// yes it's in range 1-31
				// https://stackoverflow.com/a/6454237/4805093
				if ( tmpDay <= 9 ) {
					// if value in var start with one or more 0, remove it
					while(tmpDay.charAt(0) === '0') {
						tmpDay = tmpDay.substring(1);
					}
					// yes is a number less or equal than 9
					console.log('tmpDay less or equal than 9: ' + tmpDay);
					dayDoc			= '0' + tmpDay;
					tmpDay			= '';
					isDayDocCorrect	= false;
				}
				else if ( tmpDay >= 10 ) {
					// if value in var start with one or more 0, remove it
					while(tmpDay.charAt(0) === '0') {
						tmpDay = tmpDay.substring(1);
					}
					// yes is a number more or equal than 10
					console.log('tmpDay more or equal than 10: ' + tmpDay);
					dayDoc			= tmpDay;
					tmpDay			= '';
					isDayDocCorrect	= false;
				}
			}
			else {
				// no it is NOT in range 1-31
				console.log('tmpDay is NOT in range 1 - 31: ' + tmpDay);
			}
		}
		else {
			// no it is NOT an integer
			console.log('tmpDay is NOT an integer: ' + tmpDay);
		}
	}
}

console.log('Content of variable dayDoc: ' + dayDoc);

// Ask for document month issue
while (isMonthDocCorrect) {
	// wait for user input
	var tmpMonth = await tp.system.prompt('Insert document publication month');
	// tmpMonth variable contains user answer
	console.log('tmpMonth var value: ' + tmpMonth);
	// check tmpMonth var value, this should be an integer number from 1 to 12
	if ( tmpMonth === '' || !tmpMonth ) {
		// user not insert nothing
		console.log('tmpMont is empty: ' + tmpMonth);
		var question = 'Month value is empty. Do you want to repeat, leave field empty or exit?';
		console.log('const question: ' + question);
		var chose = await tp.system.suggester(['Repeat ask for month document', 'Leave field empty', 'Exit'],['Repeat ask for month document', 'Leave field empty', 'Exit'], false, question);
		console.log('const answer: ' + chose);
		if (chose === 'Repeat ask for month document')
		{
			console.log('const chose: ' + chose);
			chose		= '';
			question	= '';
		}
		else if (chose === 'Leave field empty')
		{
			console.log('const chose: ' + chose);
			monthDoc			= tmpMonth;
			chose				= '';
			question			= '';
			isMonthDocCorrect	= false;
		}
		else if (chose === 'Exit')
		{
			console.log('const chose: ' + chose);
			chose				= '';
			question			= '';
			isMonthDocCorrect	= false;
			return;
		}
	}
	else if (isNaN(tmpMonth)) {
		// no it is NOT numeric
		console.log('tmpMonth is NOT numeric: ' + tmpMonth);
	}
	else {
		// yes it is numeric
		if ( tmpMonth % 1 === 0 ) {
			// yes it's an integer
			if ( tmpMonth >= 1 && tmpMonth <= 12 ) {
				// yes it's in range 1-12
				if ( tmpMonth <= 9 ) {
					// if value in var start with one or more 0, remove it
					while(tmpMonth.charAt(0) === '0') {
						tmpMonth = tmpMonth.substring(1);
					}
					// yes is a number less or equal than 9
					console.log('tmpMonth less or equal than 9: ' + tmpMonth);
					monthDoc			= '0' + tmpMonth;
					tmpMonth			= '';
					isMonthDocCorrect	= false;
				}
				else if ( tmpMonth >= 10 ) {
					// if value in var start with one or more 0, remove it
					while(tmpMonth.charAt(0) === '0') {
						tmpMonth = tmpMonth.substring(1);
					}
					// yes is a number more or equal than 10
					console.log('tmpMonth more or equal than 10: ' + tmpMonth);
					monthDoc			= tmpMonth;
					tmpMonth			= '';
					isMonthDocCorrect	= false;
				}
			}
			else {
				// no it is NOT in range 1-12
				console.log('tmpMonth is NOT in range 1 - 12: ' + tmpMonth);
			}
		}
		else {
			// no it is NOT an integer
			console.log('tmpMonth is NOT an integer: ' + tmpMonth);
		}
	}
}

console.log('Content of variable monthDoc: ' + monthDoc);

// Ask for document year issue (beetween 50 and this year + 1)
while (isYearDocCorrect) {
	// wait for user input
	var tmpYear = await tp.system.prompt('Insert document publication year');
	// tmpYear variable contains user answer
	console.log('tmpYear var value: ' + tmpYear);
	// check tmpYear var value, this should be an integer number from 50 to next year
	if ( tmpYear === '' || !tmpYear ) {
		// user not insert nothing
		console.log('tmpYear is empty: ' + tmpYear);
		var question = 'Year value is empty. Do you want to repeat, leave field empty or exit?';
		console.log('const question: ' + question);
		var chose = await tp.system.suggester(['Repeat ask for year document', 'Leave field empty', 'Exit'],['Repeat ask for year document', 'Leave field empty', 'Exit'], false, question);
		console.log('const answer: ' + chose);
		if (chose === 'Repeat ask for year document')
		{
			console.log('const chose: ' + chose);
			chose		= '';
			question	= '';
		}
		else if (chose === 'Leave field empty')
		{
			console.log('const chose: ' + chose);
			yearDoc				= tmpYear;
			chose				= '';
			question			= '';
			isYearDocCorrect	= false;
		}
		else if (chose === 'Exit')
		{
			console.log('const chose: ' + chose);
			chose				= '';
			question			= '';
			isYearDocCorrect	= false;
			return;
		}
	}
	if (isNaN(tmpYear)) {
		// no it is NOT numeric
		console.log('tmpYear is NOT numeric: ' + tmpYear);
	}
	else {
		// yes it is numeric
		if ( tmpYear % 1 === 0 ) {
			// yes it's an integer
			if ( tmpYear >= 50 && tmpYear <= nextYear ) {
					// if value in var start with one or more 0, remove it
					while(tmpYear.charAt(0) === '0') {
						tmpYear = tmpYear.substring(1);
					}
					// yes it's in range 50 - next year
					console.log('tmpYear is in range 50 - ' + nextYear + ': ' + tmpYear);
					yearDoc				= tmpYear;
					tmpYear				= '';
					isYearDocCorrect	= false;
			}
			else {
				// no it is NOT in range 50 - next year
				console.log('tmpYear is NOT in range 50 - ' + nextYear + ': ' + tmpYear);
			}
		}
		else {
			// no it is NOT an integer
			console.log('tmpYear is NOT an integer: ' + tmpYear);
		}
	}
}

console.log('Content of variable yearDoc: ' + yearDoc);

if (dayDoc){
	if (monthDoc){
		if (yearDoc){
			var dateDoc = yearDoc + '/' + monthDoc + '/' + dayDoc
			console.log('Content of variable dateDoc: ' + dateDoc);
		}
	}
}












// Suggester options, including 'Add new language'
const suggesterOptionsLinguaDoc = ['Aggiungi una nuova lingua per il documento', ...uniqueLinguaDocValues];

// Create the suggester
const selectedLinguaDocValue = await tp.system.suggester(
  (item) => item,
  suggesterOptionsLinguaDoc,
  true // Allow empty selection
);

// Handle the selected value
if (selectedLinguaDocValue === 'Aggiungi una nuova lingua per il documento') {
	// Prompt the user for a new value
	const newLinguaDocValue = await tp.system.prompt('Inserisci una nuova lingua per il documento che si sta caricando:');
	if (newLinguaDocValue) {
		// Set the template result to the new value
	    linguaDoc = txt_linguaDocumento + newLinguaDocValue;
console.log('Content of variable linguaDoc da newLinguaDocValue: ' + linguaDoc);
	}
	else {
		// Handle cancellation
		linguaDoc = '';
	  }
}
else if (selectedLinguaDocValue) {
	// Set the template result to the selected value
	linguaDoc = txt_linguaDocumento + selectedLinguaDocValue;
console.log('Content of variable linguaDoc dal suggester selectedLinguaDocValue: ' + linguaDoc);
}
else {
	// Handle no selection
	linguaDoc = '';
}

// Suggester options, including 'Add new original language'
const suggesterOptionsLinguaOrigDoc = ['Aggiungi una nuova lingua originale per il documento', ...uniqueLinguaOrigDocValues];

// Create the suggester
const selectedLinguaOrigDocValue = await tp.system.suggester(
  (item) => item,
  suggesterOptionsLinguaOrigDoc,
  true // Allow empty selection
);

// Handle the selected value
if (selectedLinguaOrigDocValue === 'Aggiungi una nuova lingua originale per il documento') {
	// Prompt the user for a new value
	const newLinguaOrigDocValue = await tp.system.prompt('Inserisci una nuova lingua originale per il documento che si sta caricando:');
	if (newLinguaOrigDocValue) {
		// Set the template result to the new value
	    linguaOrig = txt_linguaOrigDocumento + newLinguaOrigDocValue;
console.log('Content of variable linguaOrig da newLinguaOrigDocValue: ' + linguaOrig);
	}
	else {
		// Handle cancellation
		linguaOrig = '';
	  }
}
else if (selectedLinguaOrigDocValue) {
	// Set the template result to the selected value
	linguaOrig = txt_linguaOrigDocumento + selectedLinguaOrigDocValue;
console.log('Content of variable linguaOrig dal suggester selectedLinguaOrigDocValue: ' + linguaOrig);
}
else {
	// Handle no selection
	linguaOrig = '';
}

if (autoreDoc === ''){
	autoreDoc = txt_autoreDocumento + '@ ATTENZIONE !!! Manca l\'autore del documento, inserirlo successivamente!!!'
}
if (tipoDoc === ''){
	tipoDoc = txt_tipoDocumento + '@ ATTENZIONE !!! Manca il tipo di documento, inserirlo successivamente!!!'
}
if (titoloDoc === ''){
	titoloDoc = txt_titoloDocumento + '@ ATTENZIONE !!! Manca il titolo del documento, inserirlo successivamente!!!'
}
if (linguaDoc === ''){
	linguaDoc = txt_linguaDocumento + '@ ATTENZIONE !!! Manca la lingua del documento, inserirla successivamente!!!'
}
if (linguaOrig === ''){
	linguaOrig = txt_linguaOrigDocumento + '@ ATTENZIONE !!! Manca la lingua originale del documento, inserirla successivamente!!!'
}

const domandaInserimentoLicenzaDocumento= "Vuoi inserire la Licenza per il documento?";
	console.log("const domandaInserimentoLicenzaDocumento: " +
				 domandaInserimentoLicenzaDocumento);

const sceltaInserimentoLicenzaDocumento= await tp.system.suggester(['Si', 'No', 'Esci'],['Si', 'No', 'Esci'], false, domandaInserimentoLicenzaDocumento);
	console.log("const sceltaInserimentoLicenzaDocumento: " +
				 sceltaInserimentoLicenzaDocumento);

	if ( sceltaInserimentoLicenzaDocumento === "Si") {
		licenzaDocumento	=	txt_licenzaDocumento;
		console.log("Content of variable licenzaDocumento: " +
						 licenzaDocumento);
	}
	else if ( sceltaInserimentoLicenzaDocumento === "No" ) {
		licenzaDocumento	= "";		
	}
	else if ( sceltaInserimentoLicenzaDocumento === "Esci" ) {
		return;		
	}

const domandaInserimentoLicenzaNota = "Vuoi inserire la Licenza per la nota?";
	console.log("const domandaInserimentoLicenzaNota: " +
				 domandaInserimentoLicenzaNota);

const sceltaInserimentoLicenzaNota = await tp.system.suggester(['Si', 'No', 'Esci'],['Si', 'No', 'Esci'], false, domandaInserimentoLicenzaNota);
	console.log("const sceltaInserimentoLicenzaNota: " +
				 sceltaInserimentoLicenzaNota);

	if ( sceltaInserimentoLicenzaNota === "Si") {
		licenzaNota		= txt_licenzaNota;
			console.log("Content of variable licenzaNota: " +
						 licenzaNota);
	}
	else if ( sceltaInserimentoLicenzaNota === "No") {
		licenzaNota		= "";		
	}
	else if ( sceltaInserimentoLicenzaNota === "Esci" ) {
		return;		
	}

const domandaInserimentoUrlDocumento = "Vuoi inserire l'Indirizzo Internet (URL) per il documento?";
	console.log("const domandaInserimentoUrlDocumento: " +
				 domandaInserimentoUrlDocumento);

const sceltaInserimentoUrlDocumento = await tp.system.suggester(['Si', 'No', 'Esci'],['Si', 'No', 'Esci'], false, domandaInserimentoUrlDocumento);
	console.log("const sceltaInserimentoUrlDocumento: " +
				 sceltaInserimentoUrlDocumento);

	if ( sceltaInserimentoUrlDocumento === "Si") {
		
		tmpUrlDocumento = await tp.system.prompt('Incollare o inserire l\'indirizzo Internet del documento.');
		urlDocumento_p2 = tmpUrlDocumento;
		urlDocumento = urlDocumento_p1 + urlDocumento_p2 + urlDocumento_p3;
			console.log("Content of variable urlDocumento: " +
						 urlDocumento);
	}
	else if ( sceltaInserimentoUrlDocumento === "No" ) {
		urlDocumento = "";		
	}
	else if ( sceltaInserimentoUrlDocumento === "Esci" ) {
		return;		
	}

-%>
---
cssclasses: docVat
<% autoreDoc %>
<% tipoDoc %>
<% titoloDoc %>
giorno-doc: <% dayDoc %>
mese-doc: <% monthDoc %>
anno-doc: <% yearDoc %>
data-doc: <% dateDoc %>
<% linguaDoc %>
<% linguaOrig %>
<% licenzaDocumento%>
<% licenzaNota %>
<% urlDocumento %>
<% txt_RigaChiusura %>
