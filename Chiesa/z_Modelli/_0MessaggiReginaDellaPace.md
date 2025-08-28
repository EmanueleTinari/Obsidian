<%*
// Tutto ok. Il template Templater funziona bene. Tenere d'occhio le note (messaggi) creati.

// Folder to start with to include
const folderMess				= 'Messaggi';
// File prefix to exclude
const excludedPrefix			= '_'
const generatedFile				= 'Untitled.md';
var newFileName					= '';

// Se si aggiungono destinatari ricordarsi di sistemare lo switch case nella PARTE DESTINATARIO MESSAGGIO
const destinatari				= ['Parrocchia', 'Gruppo di preghiera', 'Mondo'];
const txt_destinatarioMess		= 'destinatario: ';
var destinatarioMess			= '';
const veggenti					= ['Marija', 'Mirijana', 'Ivan', 'Jakov', 'Vicka', 'Ivanka'];
const txt_Veggente				= 'veggente: ';
var veggenteMessaggio			= '';
var dayMess						= '';
var tmpDay						= '';
var monthMess					= '';
var tmpMonth					= '';
var yearMess					= '';
var tmpYear						= '';
let isDayMessCorrect			= true;
let isMonthMessCorrect			= true;
let isYearMessCorrect			= true;
//var dayPrevMess					= '';
//var monthPrevMess				= '';
//var yearPrevMess				= '';
//let isPreviousDayCorrect		= true;
//let isPreviousMonthCorrect		= true;
//let isPreviousYearCorrect		= true;
// Frontmatter Key lingua-mess
const lmKey						= 'lingua-mess';
const txt_linguaMessaggio		= 'lingua-mess: ';
var linguaMess					= '';
// Frontmatter Key lingua-orig
const loKey						= 'lingua-orig';
const txt_linguaOrigMessaggio	= 'lingua-orig: ';
var linguaOrig					= '';
const approvazioni				= ['false', 'true'];
const txt_approvazione			= 'approvazione: ';
var approvazione				= '';
const txt_licenzaNota			= 'licenza-nota:  Copyright © 2025 Emanuele Tinari under Creative Commons BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/';
var licenzaNota					= '';
const urlMessaggio_p1			= 'url-messaggio:  \"[Link al messaggio](';
var urlMessaggio_p2				= '';
const urlMessaggio_p3			= '\)\"';
var urlMessaggio				= '';
const txt_Titolo_p1				= 'Messaggio della Regina della Pace\<br\>';
var txt_Titolo_p2				= '';
var txt_Titolo_p3				= '';
var txt_Titolo_p4				= '';
var titoloMess					= '';
var tmpMess_1					= '';
var tmpMess_2					= '';
let isMessageFieldFill			= true;
var testoMess					= '';

								//
								// PARTE DESTINATARIO MESSAGGIO
								//

// Handle the selected value
let selectedDestinatario = await tp.system.suggester(item => item, destinatari);

switch (selectedDestinatario) {

	case "Parrocchia":
	destinatarioMess	= txt_destinatarioMess + selectedDestinatario;
	txt_Titolo_p2		= 'alla Parrocchia\<br\>';
	newFileName			= 'Messaggio alla Parrocchia';
	break;

	case "Mondo":
	destinatarioMess	= txt_destinatarioMess + selectedDestinatario;
	txt_Titolo_p2		= 'al mondo\<br\>';	
	newFileName			= 'Messaggio al mondo';
	break;

	case "Gruppo di preghiera":
	destinatarioMess	= txt_destinatarioMess + selectedDestinatario;
	txt_Titolo_p2		= 'al gruppo di preghiera\<br\>';	
	newFileName			= 'Messaggio al gruppo di preghiera';
	break;
	// Se variano i destinatari modificare lo switch case qui sopra
}

								//
								// PARTE SCELTA VEGGENTE
								//

// Handle the selected value
let selectedVeggente = await tp.system.suggester(item => item, veggenti);
switch (selectedVeggente) {

	case "Mirijana":
	veggenteMessaggio = txt_Veggente + '\"\[\[1 1 info ' + selectedVeggente + '|' + selectedVeggente + '\]\]\"';
	txt_Titolo_p3 = 'tramite la veggente ' + selectedVeggente + '\<br\>';	
	break;

	case "Ivanka":
	veggenteMessaggio = txt_Veggente + '\"\[\[1 2 info ' + selectedVeggente + '|' + selectedVeggente + '\]\]\"';
	txt_Titolo_p3 = 'tramite la veggente ' + selectedVeggente + '\<br\>';	
	break;

	case "Jakov":
	veggenteMessaggio = txt_Veggente + '\"\[\[1 3 info ' + selectedVeggente + '|' + selectedVeggente + '\]\]\"';
	txt_Titolo_p3 = 'tramite il veggente ' + selectedVeggente + '\<br\>';	
	break;

	case "Ivan":
	veggenteMessaggio = txt_Veggente + '\"\[\[1 4 info ' + selectedVeggente + '|' + selectedVeggente + '\]\]\"';
	txt_Titolo_p3 = 'tramite il veggente ' + selectedVeggente + '\<br\>';	
	break;

	case "Vicka":
	veggenteMessaggio = txt_Veggente + '\"\[\[1 5 info ' + selectedVeggente + '|' + selectedVeggente + '\]\]\"';
	txt_Titolo_p3 = 'tramite la veggente ' + selectedVeggente + '\<br\>';	
	break;

	case "Marija":
	veggenteMessaggio = txt_Veggente + '\"\[\[1 6 info ' + selectedVeggente + '|' + selectedVeggente + '\]\]\"';
	txt_Titolo_p3 = 'tramite la veggente ' + selectedVeggente + '\<br\>';	
	break;
}

								//
								// INSERIMENTO GIORNO, MESE, ANNO E LA DATA COMPLETA DEL MESSAGGIO
								//

// returns actual year
var thisYear					= new Date().getFullYear()

// Ask for messagge day issue
while (isDayMessCorrect) {
	// wait for user input
	tmpDay = await tp.system.prompt('Inserire il giorno del messaggio');
	// tmpDay variable contains user answer
 	// https://stackoverflow.com/a/14636638/4805093
	// check tmpDay var value, this should be an integer number from 1 to 31
	if ( tmpDay === '' || !tmpDay ) {
		// user not insert nothing
 		var question = 'Il valore del giorno è vuoto. Vuoi ripeterne l\'inserimento, lasciare il campo vuoto o uscire?';
 		var chose = await tp.system.suggester(['Ripeti la domanda di inserimento giorno', 'Lascia vuoto il campo', 'Esci'],['Ripeti la domanda di inserimento mese', 'Lascia vuoto il campo', 'Esci'], false, question);
 		if (chose === 'Ripeti la domanda di inserimento giorno')
		{
 		chose				= '';
			question			= '';
		}
		else if (chose === 'Lascia vuoto il campo')
		{
 		dayMess				= tmpDay;
			chose				= '';
			question			= '';
			isDayMessCorrect	= false;
		}
		else if (chose === 'Esci')
		{
 		chose				= '';
			question			= '';
			isDayMessCorrect	= false;
			return;
		}
	}
	else if ( isNaN(tmpDay) ) {
		// no it is NOT numeric
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
 				dayMess				= '0' + tmpDay;
					isDayMessCorrect	= false;
				}
				else if ( tmpDay >= 10 ) {
					// if value in var start with one or more 0, remove it
					while(tmpDay.charAt(0) === '0') {
						tmpDay = tmpDay.substring(1);
					}
					// yes is a number more or equal than 10
 				dayMess				= tmpDay;
					isDayMessCorrect	= false;
				}
			}
			else {
				// no it is NOT in range 1-31
 			}
		}
		else {
			// no it is NOT an integer
 		}
	}
}

// Ask for messagge month issue
while (isMonthMessCorrect) {
	// wait for user input
	tmpMonth = await tp.system.prompt('Inserire il mese del messaggio');
	// tmpMonth variable contains user answer
 	// check tmpMonth var value, this should be an integer number from 1 to 12
	if ( tmpMonth === '' || !tmpMonth ) {
		// user not insert nothing
 		var question = 'Il valore del mese è vuoto. Vuoi ripeterne l\'inserimento, lasciare il campo vuoto o uscire?';
 		var chose = await tp.system.suggester(['Ripeti la domanda di inserimento mese', 'Lascia vuoto il campo', 'Esci'],['Ripeti la domanda di inserimento mese', 'Lascia vuoto il campo', 'Esci'], false, question);
 		if (chose === 'Ripeti la domanda di inserimento mese')
		{
 		chose				= '';
			question			= '';
		}
		else if (chose === 'Lascia vuoto il campo')
		{
 		monthMess			= tmpMonth;
			chose				= '';
			question			= '';
			isMonthMessCorrect	= false;
		}
		else if (chose === 'Esci')
		{
 		chose				= '';
			question			= '';
			isMonthMessCorrect	= false;
			return;
		}
	}
	else if (isNaN(tmpMonth)) {
		// no it is NOT numeric
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
 				monthMess			= '0' + tmpMonth;
					isMonthMessCorrect	= false;
				}
				else if ( tmpMonth >= 10 ) {
					// if value in var start with one or more 0, remove it
					while(tmpMonth.charAt(0) === '0') {
						tmpMonth = tmpMonth.substring(1);
					}
					// yes is a number more or equal than 10
 				monthMess			= tmpMonth;
					isMonthMessCorrect	= false;
				}
			}
			else {
				// no it is NOT in range 1-12
 			}
		}
		else {
			// no it is NOT an integer
 		}
	}
}

// Ask for messagge year issue (beetween 1981 and this year + 1)
while (isYearMessCorrect) {
	// wait for user input
	tmpYear = await tp.system.prompt('Inserire l\'anno del messaggio');
	// tmpYear variable contains user answer
 	// check tmpYear var value, this should be an integer number from 50 to next year
	if ( tmpYear === '' || !tmpYear ) {
		// user not insert nothing
 		var question = 'Il valore del mese è vuoto. Vuoi ripeterne l\'inserimento, lasciare il campo vuoto o uscire?';
 		var chose = await tp.system.suggester(['Ripeti la domanda di inserimento anno', 'Lascia vuoto il campo', 'Esci'],['Ripeti la domanda di inserimento anno', 'Lascia vuoto il campo', 'Esci'], false, question);
 		if (chose === 'Ripeti la domanda di inserimento anno')
		{
 		chose		= '';
			question	= '';
		}
		else if (chose === 'Lascia vuoto il campo')
		{
 		yearMess			= tmpYear;
			chose				= '';
			question			= '';
			isYearMessCorrect	= false;
		}
		else if (chose === 'Esci')
		{
 		chose				= '';
			question			= '';
			isYearMessCorrect	= false;
			return;
		}
	}
	if (isNaN(tmpYear)) {
		// no it is NOT numeric
 	}
	else {
		// yes it is numeric
		if ( tmpYear % 1 === 0 ) {
			// yes it's an integer
			if ( tmpYear >= 1981 && tmpYear <= thisYear ) {
					// if value in var start with one or more 0, remove it
					while(tmpYear.charAt(0) === '0') {
						tmpYear = tmpYear.substring(1);
					}
					// yes it's in range 1981 - this year
 				yearMess			= tmpYear;
					isYearMessCorrect	= false;
			}
			else {
				// no it is NOT in range 50 - next year
 			}
		}
		else {
			// no it is NOT an integer
 		}
	}
}

if (dayMess){
	if (monthMess){
		if (yearMess){
			var dateMess = yearMess + '-' + monthMess + '-' + dayMess
 		}
	}
}
if ( dayMess == '01' || dayMess == '02' || dayMess == '03' || dayMess == '04' || dayMess == '05' || dayMess == '06' || dayMess == '07' || dayMess == '08' || dayMess == '09' ) {
	tmpDay = dayMess.replace(/^0/, "");
}
else {
	tmpDay = dayMess;
}

switch (monthMess) {
	case "01":
	txt_Titolo_p4 = 'del ' + tmpDay + ' gennaio ' + yearMess;	
	break;
	case "02":
	txt_Titolo_p4 = 'del ' + tmpDay + ' febbraio ' + yearMess;	
	break;
	case "03":
	txt_Titolo_p4 = 'del ' + tmpDay + ' marzo ' + yearMess;	
	break;
	case "04":
	txt_Titolo_p4 = 'del ' + tmpDay + ' aprile ' + yearMess;	
	break;
	case "05":
	txt_Titolo_p4 = 'del ' + tmpDay + ' maggio ' + yearMess;	
	break;
	case "06":
	txt_Titolo_p4 = 'del ' + tmpDay + ' giugno ' + yearMess;	
	break;
	case "07":
	txt_Titolo_p4 = 'del ' + tmpDay + ' luglio ' + yearMess;	
	break;
	case "08":
	txt_Titolo_p4 = 'del ' + tmpDay + ' agosto ' + yearMess;	
	break;
	case "09":
	txt_Titolo_p4 = 'del ' + tmpDay + ' settembre ' + yearMess;	
	break;
	case "10":
	txt_Titolo_p4 = 'del ' + tmpDay + ' ottobre ' + yearMess;	
	break;
	case "11":
	txt_Titolo_p4 = 'del ' + tmpDay + ' novembre ' + yearMess;	
	break;
	case "12":
	txt_Titolo_p4 = 'del ' + tmpDay + ' dicembre ' + yearMess;	
	break;
}

								//
								// PARTE CALLOUTS X LO SPOSTAMENTO TRA MESSAGGI E TRA GLI ANNI
								//

//txt_Callout_p1 = '\> \[\!2colonne\]\- \[\[';
//console.log('var tmpDay: ' + tmpDay);

// Gestione del giorno del messaggio precedente
//while (isPreviousDayCorrect) {
	// wait for user input
	//var tmpPrevDay = await tp.system.prompt('Inserire il giorno del messaggio precedente, premere Invio per accettare il valore proposto', tmpDay);
	// tmpPrevDay variable contains user answer
	// check tmpPrevDay var value, this should be an integer number from 1 to 31
	//if ( tmpPrevDay === '' || !tmpPrevDay ) {
		// user not insert nothing
 		//var question = 'Il valore del giorno del messaggio precedente è vuoto. Vuoi ripeterne l\'inserimento, lasciare il campo vuoto o uscire?';
 		//var chose = await tp.system.suggester(['Ripeti la domanda di inserimento giorno del messaggio precedente', 'Lascia vuoto il campo', 'Esci'],['Ripeti la domanda di inserimento giorno del messaggio precedente', 'Lascia vuoto il campo', 'Esci'], false, question);
 		//if (chose === 'Ripeti la domanda di inserimento giorno del messaggio precedente')
		//{
 		//chose					= '';
			//question				= '';
		//}
		//else if (chose === 'Lascia vuoto il campo')
		//{
 		//dayPrevMess				= tmpDay;
			//chose					= '';
			//question				= '';
			//isPreviousDayCorrect	= false;
		//}
		//else if (chose === 'Esci')
		//{
 		//chose					= '';
			//question				= '';
			//isPreviousDayCorrect	= false;
			//return;
		//}
	//}
	//else if ( isNaN(tmpPrevDay) ) {
		// no it is NOT numeric
 	//}
	//else {
		// yes it is numeric
		//if ( tmpPrevDay % 1 === 0 ) {
			// yes it's an integer
			//if ( tmpPrevDay >= 1 && tmpPrevDay <= 31 ) {
				// yes it's in range 1-31
				//if ( tmpPrevDay <= 9 ) {
					// if value in var start with one or more 0, remove it
					//while(tmpPrevDay.charAt(0) === '0') {
						//tmpPrevDay = tmpPrevDay.substring(1);
					//}
					// yes is a number less or equal than 9
 				//dayPrevMess				= '0' + tmpPrevDay;
					//tmpDay					= '';
					//tmpPrevDay				= '';
					//isPreviousDayCorrect	= false;
				//}
				//else if ( tmpPrevDay >= 10 ) {
					// if value in var start with one or more 0, remove it
					//while(tmpPrevDay.charAt(0) === '0') {
						//tmpPrevDay = tmpPrevDay.substring(1);
					//}
					// yes is a number more or equal than 10
 				//dayPrevMess				= tmpPrevDay;
					//tmpDay					= '';
					//tmpPrevDay				= '';
					//isPreviousDayCorrect	= false;
				//}
			//}
			//else {
				// no it is NOT in range 1-31
 			//}
		//}
		//else {
			// no it is NOT an integer
 		//}
	//}
//}

//console.log('Var dayPrevMess: ' + dayPrevMess);
//console.log('var tmpMonth: ' + tmpMonth);
//console.log('var tmpYear: ' + tmpYear);
//tmpMonth = (+(tmpMonth))-1
//console.log('var tmpMonth dopo la sottrazione: ' + tmpMonth);

// Ask for messagge month issue
//while (isPreviousMonthCorrect) {
	// wait for user input
	//tmpPrevMonth = await tp.system.prompt('Inserire il mese del messaggio precedente, premere Invio per accettare il valore proposto', tmpMonth);
//console.log('Var tmpPrevMonth dopo il prompt: ' + tmpPrevMonth);
	// tmpPrevMonth variable contains user answer
 	// check tmpPrevMonth var value, this should be an integer number from 1 to 12
	//if ( tmpPrevMonth === '' || !tmpPrevMonth ) {
		// user not insert nothing
 		//var question = 'Il valore del mese del messaggio precedente è vuoto. Vuoi ripeterne l\'inserimento, lasciare il campo vuoto o uscire?';
 		//var chose = await tp.system.suggester(['Ripeti la domanda di inserimento mese del messaggio precedente', 'Lascia vuoto il campo', 'Esci'],['Ripeti la domanda di inserimento mese', 'Lascia vuoto il campo', 'Esci'], false, question);
 		//if (chose === 'Ripeti la domanda di inserimento mese del messaggio precedente')
		//{
 		//chose					= '';
			//question				= '';
		//}
		//else if (chose === 'Lascia vuoto il campo')
		//{
 		//monthPrevMess			= tmpMonth;
			//chose					= '';
			//question				= '';
			//isPreviousMonthCorrect	= false;
		//}
		//else if (chose === 'Esci')
		//{
 		//chose					= '';
			//question				= '';
			//isPreviousMonthCorrect	= false;
			//return;
		//}
	//}
	//else if (isNaN(tmpPrevMonth)) {
		// no it is NOT numeric
 	//}
	//else {
//console.log('Var tmpPrevMonth dentro l\'else: ' + tmpPrevMonth);
		// yes it is numeric
		//if ( tmpPrevMonth % 1 === 0 ) {
			// yes it's an integer
//console.log('Var tmpPrevMonth è un intero: ' + tmpPrevMonth);
			//if ( tmpPrevMonth >= 1 && tmpPrevMonth <= 12 ) {
//console.log('Var tmpPrevMonth è nel range 1-12: ' + tmpPrevMonth);
				// yes it's in range 1-12
				//if ( tmpPrevMonth <= 9 ) {
//console.log('Var tmpPrevMonth è inferiore o uguale a 9: ' + tmpPrevMonth);
					// if value in var start with one or more 0, remove it
					//while(tmpPrevMonth.charAt(0) === '0') {
						//tmpPrevMonth = tmpPrevMonth.substring(1);
					//}
					// yes is a number less or equal than 9
 				//monthPrevMess			= '0' + tmpPrevMonth;
					//isPreviousMonthCorrect	= false;
				//}
				//else if ( tmpPrevMonth >= 10 ) {
//console.log('Var tmpPrevMonth è maggiore o uguale a 10: ' + tmpPrevMonth);
					// if value in var start with one or more 0, remove it
					//while(tmpPrevMonth.charAt(0) === '0') {
						//tmpPrevMonth = tmpPrevMonth.substring(1);
					//}
					// yes is a number more or equal than 10
 				//monthPrevMess			= tmpPrevMonth;
					//isPreviousMonthCorrect	= false;
				//}
			//}
			//else {
				// no it is NOT in range 1-12
 			//}
		//}
		//else {
			// no it is NOT an integer
 		//}
	//}
//}

//console.log('Var monthPrevMess: ' + monthPrevMess);












								//
								// PARTE ESTRAZIONE FILE NELLA CARTELLA
								//

const files = app.vault.getMarkdownFiles();
// inFolder'll contain all files extracted
const inFolder = new Array();
files.forEach((file) => {
    if( file.path.includes( folderMess ) &&  !file.path.includes( excludedPrefix )) {
	    // Push the file object
        inFolder.push(file)
    };
})

								//
								// PARTE SCELTA LINGUA MESSAGGIO
								//

// Extract unique 'lingua-mess' values
let uniqueLinguaMessValues = new Set();
for (const file of inFolder) {
  const cache = app.metadataCache.getFileCache(file);
  if (cache && cache.frontmatter && cache.frontmatter[lmKey]) {
    uniqueLinguaMessValues.add(cache.frontmatter[lmKey]);
  }
}
// Suggester options, including 'Add new language'
const suggesterOptionslinguaMess = ['Aggiungi una nuova lingua per il messaggio', ...uniqueLinguaMessValues];
// Create the suggester
const selectedlinguaMessValue = await tp.system.suggester(
  (item) => item,
  suggesterOptionslinguaMess,
  true // Allow empty selection
);

// Handle the selected value
if (selectedlinguaMessValue === 'Aggiungi una nuova lingua per il messaggio') {
	// Prompt the user for a new value
	const newlinguaMessValue = await tp.system.prompt('Inserisci una nuova lingua per il messaggio che si sta caricando:');
	if (newlinguaMessValue) {
		// Set the template result to the new value
		linguaMess = txt_linguaMessaggio + newlinguaMessValue;
 	}
	else {
		// Handle cancellation
		linguaMess = '';
	}
}
else if (selectedlinguaMessValue) {
	// Set the template result to the selected value
	linguaMess = txt_linguaMessaggio + selectedlinguaMessValue;
}
else {
	// Handle no selection
	linguaMess = '';
}
// SE LA VARIABILE linguaMess È VUOTA, INSERISCE UN MESSAGGIO NEL CAMPO YALM CHE SBALLA LA SUA VISUALIZZAZIONE
if (linguaMess === ''){
	linguaMess = txt_linguaMessaggio + '@ ATTENZIONE !!! Manca la lingua del messaggio, inserirla successivamente!!!'
}

								//
								// PARTE SCELTA LINGUA ORIGINALE DEL MESSAGGIO
								//

// Extract unique 'lingua-orig' values
let linguaOrigMessValues = new Set();
for (const file of inFolder) {
  const cache = app.metadataCache.getFileCache(file);
  if (cache && cache.frontmatter && cache.frontmatter[loKey]) {
    linguaOrigMessValues.add(cache.frontmatter[loKey]);
  }
}
const uniqueLinguaOrigMessValues = Array.from(linguaOrigMessValues);
// Suggester options, including 'Add new original language'
const suggesterOptionsLinguaOrigMess = ['Aggiungi una nuova lingua originale per il messaggio', ...uniqueLinguaOrigMessValues];
// Create the suggester
const selectedLinguaOrigMessValue = await tp.system.suggester(
  (item) => item,
  suggesterOptionsLinguaOrigMess,
  true // Allow empty selection
);

// Handle the selected value
if (selectedLinguaOrigMessValue === 'Aggiungi una nuova lingua originale per il messaggio') {
	// Prompt the user for a new value
	const newLinguaOrigMessValue = await tp.system.prompt('Inserisci una nuova lingua originale per il messaggio che si sta caricando:');
	if (newLinguaOrigMessValue) {
		// Set the template result to the new value
	    linguaOrig = txt_linguaOrigMessaggio + newLinguaOrigMessValue;
 	}
	else {
		// Handle cancellation
		linguaOrig = '';
	  }
}
else if (selectedLinguaOrigMessValue) {
	// Set the template result to the selected value
	linguaOrig = txt_linguaOrigMessaggio + selectedLinguaOrigMessValue;
 }
else {
	// Handle no selection
	linguaOrig = '';
}
// SE LA VARIABILE linguaOrig È VUOTA, INSERISCE UN MESSAGGIO NEL CAMPO YALM CHE SBALLA LA SUA VISUALIZZAZIONE
if (linguaOrig === ''){
	linguaOrig = txt_linguaOrigMessaggio + '@ ATTENZIONE !!! Manca la lingua originale del messaggio, inserirla successivamente!!!'
}

								//
								// PARTE OPZIONE APPROVAZIONE
								//

// Handle the selected value
let selectedApprovazione = await tp.system.suggester(item => item, approvazioni, 2);
approvazione = txt_approvazione + selectedApprovazione;

								//
								// PARTE INSERIMENTO LICENZA PER LA NOTA
								//

const domandaInserimentoLicenzaNota = "Vuoi inserire la Licenza per la nota?";
const sceltaInserimentoLicenzaNota = await tp.system.suggester(['Si', 'No', 'Esci'],['Si', 'No', 'Esci'], false, domandaInserimentoLicenzaNota);
	if ( sceltaInserimentoLicenzaNota === "Si") {
		licenzaNota		= txt_licenzaNota;
	}
	else if ( sceltaInserimentoLicenzaNota === "No") {
		licenzaNota		= "";		
	}
	else if ( sceltaInserimentoLicenzaNota === "Esci" ) {
		return;		
	}

								//
								// PARTE INSERIMENTO URL MESSAGGIO
								//

const domandaInserimentoUrlMessaggio = "Vuoi inserire l'Indirizzo Internet (URL) per il messaggio?";
const sceltaInserimentoUrlMessaggio = await tp.system.suggester(['Si', 'No', 'Esci'],['Si', 'No', 'Esci'], false, domandaInserimentoUrlMessaggio);
	if ( sceltaInserimentoUrlMessaggio === "Si") {
		tmpUrlMessaggio = await tp.system.prompt('Incollare o inserire l\'indirizzo Internet del messaggio.');
		urlMessaggio_p2 = tmpUrlMessaggio;
		urlMessaggio = urlMessaggio_p1 + urlMessaggio_p2 + urlMessaggio_p3;
	}
	else if ( sceltaInserimentoUrlMessaggio === "No" ) {
		urlMessaggio = "";		
	}
	else if ( sceltaInserimentoUrlMessaggio === "Esci" ) {
		return;		
	}

								//
								// CHIUDE IL FRONTMATTER
								//

const txt_RigaChiusura			= 'creato\:\nmodificato\:\n---';
const txt_RigaMenu			= '\>\> \<span class\=\"verde\"\>Vai all\'anno\:\<\/span\>\n\>\> \- 2029\n\>\> \- 2028\n\>\> \- 2027\n\>\> \- 2026\n\>';

								//
								// TITOLO DEL MESSAGGIO
								//

titoloMess = txt_Titolo_p1 + txt_Titolo_p2 + txt_Titolo_p3 + txt_Titolo_p4;

								//
								// TESTO DEL MESSAGGIO
								//

// Funzione asincrona per formattare il testo del messaggio incollato
async function replaceText(str_1) {
 	// Testa se ci siano più caratteri di terminazione riga nel testo e li elimina
	var str_2 = str_1.replace(/[\r\n]+/g, ' ');
	str_1 = '';
 	// Testa se ci siano punti di domanda, punti esclamativi o punti di interruzione nel testo
	// https://stackoverflow.com/a/23380842/4805093
	if( str_2.indexOf('?') != -1 || str_2.indexOf('!') != -1 || str_2.indexOf('.') != -1 ) {
		// se nel messaggio ci sono punti di domanda, punti esclamativi, punti di interruzione, li sostituisce aggiungendo un <br>
		str_1 = str_2.replaceAll('?', '?<br>').replaceAll('!', '!<br>').replaceAll('.', '.<br>');
		// clear str_2 var
		str_2 = '';
	}
	
	else {
		// Se non ci sono punti di domanda, punti esclamativi o punti di interruzione nel testo sposta comunque la stringa tra variabili
		str_1 = str_2;
		// clear str_2 var
		str_2 = '';
	}
	// Testa se ci siano più spazi nel testo e li elimina
	if( str_1.indexOf('  ') != -1 ) {
		str_2 = str_1.replace(/\s+/g, ' ');
		// clear str_1 var
		str_1 = '';
	}
	else {
		// Se non ci sono più spazi nel testo sposta comunque la stringa tra variabili
		str_2 = str_1;
		// clear str_1 var
		str_1 = '';
	}
	// Testa se ci siano spazi dopo il <br> e li elimina
	if( str_2.indexOf('<br> ') != -1 ) {
		// se nel messaggio ci sono spazi dopo il <br> li elimina
		str_1 = str_2.replaceAll('<br> ', '<br>');
		// clear str_2 var
		str_2 = '';
	}
	else {
		// Se non ci sono spazi dopo il tag <br> nel testo sposta comunque la stringa tra variabili
		str_1 = str_2;
		// clear str_2 var
		str_2 = '';
	 }
	// Rimuove ogni carattere dopo l'ultimo punto
	// https://stackoverflow.com/a/14462451/4805093
	str_2 = str_1.substr(0, str_1.lastIndexOf("\.") + 1);
	replaceText = str_2;
	return replaceText;
}
// Wait till tmpMess_1 <> ''
while (isMessageFieldFill) {
	// Using a Multiline prompt waiting for user input
	tmpMess_1 = await tp.system.prompt("Inserire il testo del messaggio", null, false, true);
	// tmpMess_1 variable contains user answer
 	if ( tmpMess_1 === '' || !tmpMess_1 ) {
		// user not insert nothing
 		var question = 'Il testo del messaggio non è stato inserito. Vuoi ripeterne l\'inserimento, lasciare il campo vuoto o uscire?';
 		var chose = await tp.system.suggester(['Ripeti la domanda di inserimento messaggio', 'Lascia vuoto il campo', 'Esci'],['Ripeti la domanda di inserimento mese', 'Lascia vuoto il campo', 'Esci'], false, question);
 		if (chose === 'Ripeti la domanda di inserimento messaggio')
		{
 		chose				= '';
			question			= '';
		}
		else if (chose === 'Lascia vuoto il campo')
		{
 		tmpMess_1			= tmpMess_1;
			chose				= '';
			question			= '';
			isMessageFieldFill	= false;
		}
		else if (chose === 'Esci')
		{
 		tmpMess_1			= tmpMess_1;
			chose				= '';
			question			= '';
			isMessageFieldFill	= false;
			return;
		}
	 }
	 else {
		// Message has been inserted
 		isMessageFieldFill		= false;
	 }
}

// Elaborazione testo temporaneo messaggio solo se questo non è vuoto
if ( !tmpMess_1 == '' ) {
	// Testa se ci siano più caratteri di terminazione riga nel testo e li elimina
	tmpMess_2 = await replaceText(tmpMess_1);
	// clear tmpMess_1 var
	tmpMess_1 = '';
	testoMess = tmpMess_2;
 }
else {
	// se tmpMess_1 è vuoto
	testoMess = tmpMess_1;
 }

var tmpFileName = dateMess + ' - ' + newFileName + '-' + selectedVeggente;
newFileName = tmpFileName;
let nomeFile = await tp.file.title;
if (nomeFile.startsWith("Untitled") || nomeFile.startsWith("Senza nome")) {
	await tp.file.rename(newFileName)
console.log('File rinominato, contenuto var newFileName : ' + newFileName);
}
else {

}

if (!tp.file.path == folderMess) {
	await tp.file.move("/folderMess/" + title)
}

// 5000 = 5 secondi
const notice = new Notice("", 5000)
notice.noticeEl.append(
  createEl("strong", { text: "Successo!\n", style: "color:red"}),
  "Nuovo messaggio caricato:\n" + newFileName,
);
-%>
---
cssclasses: messaggio
<% destinatarioMess %>
<% veggenteMessaggio %>
giorno-mess: <% dayMess %>
mese-mess: <% monthMess %>
anno-mess: <% yearMess %>
data-mess: <% dateMess %>
<% linguaMess %>
<% linguaOrig %>
<% approvazione %>
<% licenzaNota %>
<% urlMessaggio %>
<% txt_RigaChiusura %>

<% txt_RigaMenu %>

# <% titoloMess %>

## <% testoMess %>

