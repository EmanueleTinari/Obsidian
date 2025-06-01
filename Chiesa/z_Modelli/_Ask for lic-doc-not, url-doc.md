<%*

const txt_licenzaDocumento	= 'licenza-doc: Copyright © Dicastero per la Comunicazione - Libreria Editrice Vaticana';
const txt_licenzaNota  = 'licenza-nota:  Copyright © 2025 Emanuele Tinari under Creative Commons BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/';
const urlDocumento_p1= 'url-documento:  "[Link al documento sul sito del Vaticano](';
const urlDocumento_p3= '\)\"';

var licenzaDocumento	= "";
var licenzaNota			= "";
var urlDocumento_p2		= "";
var urlDocumento		= "";

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

`<% sceltaInserimentoLicenzaDocumento%>`
`<% licenzaDocumento%>`

`<% sceltaInserimentoLicenzaNota %>`
`<% licenzaNota %>`

`<% sceltaInserimentoUrlDocumento %>`
`<% urlDocumento %>`

