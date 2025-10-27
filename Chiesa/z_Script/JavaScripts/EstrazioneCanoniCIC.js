// ================================
// Variabili globali principali
// ================================

// Conterrà il numero del primo canone trovato
let primoCanone = null;
// Numero dell’ultimo Canone trovato
let ultimoCanone = null;
// Conterrà il testo grezzo del Canone in elaborazione
let bloccoCanone = '';
// Numero totale di caratteri del testo
let CharTot = 0;
// Html compreso tra gli <hr>
let paginaHtml = '';
// Testo formattato di tutta la pagina
let testoFinale = '';

// =================================================
// Funzione 1: Estrai il codice HTML tra <hr> e <hr>
// =================================================
function estraiHtmlTraHr() {
    const hrs = document.querySelectorAll('hr');
    if (hrs.length < 2) return '';
    // Prendi tutto il codice HTML tra i due <hr>
    let nodoIniziale = hrs[0].nextSibling;
    let htmlEstratto = '';
    while (nodoIniziale && nodoIniziale !== hrs[1]) {
        if (nodoIniziale.outerHTML) {
            htmlEstratto += nodoIniziale.outerHTML;
        } else if (nodoIniziale.nodeValue) {
            htmlEstratto += nodoIniziale.nodeValue;
        }
        nodoIniziale = nodoIniziale.nextSibling;
    }
    return htmlEstratto;
}

// =================================================
// Funzione 2: Sostituzioni iniziali nel codice HTML
// =================================================
function sostituisciTag(html) {
    if (!html) return '';
    return html
        .replace(/<i>([\s\S]*?)<\/i>/gi, '*$1*')
        .replace(/<em>([\s\S]*?)<\/em>/gi, '*$1*')
        .replace(/<p>|<\/p>/gi, '[[#]]')
}

// ===============================
// Funzione 3: Ottenere plain text
// ===============================
function htmlToPlainText(html) {
    if (!html) return '';
    // Rimuove tutti i tag HTML residui e riduce spazi multipli
    return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

// ===========================
// Funzione 4: Conta caratteri
// ===========================
function contaCaratteri(txt) {
    return txt.length;
}

// =================================
// Funzione 5: Trova il primo canone
// =================================
// Trova il primo canone valido nel testo.
// @param {string} str - Testo da analizzare
// @param {boolean} log - Se true, stampa messaggi di debug
// @returns {number|null} - Numero del primo canone valido o null se non trovato
function trovaPrimoCanone(str, log = false) {
    if (!str) return null; // Protezione input null/undefined
    const regex = /Can\.\s([1-9][0-9]{0,3})/g;
    let match;
    while ((match = regex.exec(str)) !== null) {
        const num = parseInt(match[1], 10);
        if (num >= 1 && num <= 1752) {
            // Salva variabile globale
            primoCanone = num;
            if (log) console.log('Primo canone trovato:', primoCanone, 'alla posizione', match.index);
            return primoCanone;
        } else if (log) {
            console.log('Canone trovato ma fuori range (1-1752):', num, 'alla posizione', match.index);
        }
    }
    if (log) console.log('Nessun canone valido trovato.');
    return null;
}

// ================================
// Script principale
// ================================
function estraiCanoni() {
    // 1. Estrarre HTML tra <hr>
    let paginaHtml = estraiHtmlTraHr();

    // 2. Sostituire <i>/<em> con *
    paginaHtml = sostituisciTag(paginaHtml);

    // 3. Ottenere plain text
    const testoPlain = htmlToPlainText(paginaHtml);

    // 4. Contare i caratteri
    CharTot = contaCaratteri(testoPlain);
    console.log('Numero totale caratteri:', CharTot);

    // 5. Trovare il primo canone
    primoCanone = trovaPrimoCanone(testoPlain);
    console.log('Primo canone trovato:', primoCanone);

    // 6. Salvo testo completo in bloccoCanone (inizialmente tutto)
    bloccoCanone = testoPlain;
}

// ================================
// Avvio
// ================================
estraiCanoni();






// --- Estrazione Canoni + § da una pagina del Vaticano ---

let testo = [...document.querySelectorAll('p')]
    .map(p => p.innerText.trim())
    .join('\n')
    .replace(/\s+/g, ' ')
    .trim();

// Divide il testo in blocchi a partire da ogni "Can. {numero}"
const blocchi = testo.split(/(?=Can\.\s*\d+)/g);

const risultato = blocchi
    .map(b => {
        const match = b.match(/^Can\.\s*(\d+)/);
        if (!match) return null;
        const num = match[1];
        let corpo = b.replace(/^Can\.\s*\d+\s*[-–]?\s*/, '').trim();

        // Se il canone ha paragrafi interni (§)
        if (/§\s*\d+\./.test(corpo)) {
            const sezioni = corpo.split(/(?=§\s*\d+\.)/g).map(sez => {
                const par = sez.match(/§\s*(\d+)\./);
                if (!par) return null;
                const parNum = par[1];
                const clean = sez.replace(/^§\s*\d+\.\s*/, '').trim();
                return `§ ${parNum}. ${clean} ^ccar-cic-c${num}-c${parNum}`;
            }).filter(Boolean);

            return [
                `###### Canone ${num}`,
                sezioni.join('\n\n')
            ].join('\n\n');
        } else {
            return `###### Canone ${num}\n\n${corpo}`;
        }
    })
    .filter(Boolean)
    .join('\n\n\n');
// --- Output in una textarea per copia rapida ---
let existing = document.getElementById('MioTestoEstratto');
if (existing) existing.remove();
const textarea = document.createElement('textarea');
textarea.id = 'MioTestoEstratto';
textarea.value = '\n\n' + risultato + '\n';
textarea.style.width = '90%';
textarea.style.height = '300px';
textarea.style.display = 'block';
textarea.style.margin = '20px auto';
document.body.appendChild(textarea);
textarea.focus();
textarea.select();

// --- Estrazione Canoni + § da qualsiasi struttura HTML (compatibile con la pagina indicata) ---
// Incolla ed esegui questo script nella console del browser sulla pagina desiderata.

(function () {
    // Prendi tutto il testo visibile della pagina in un unico flusso
    let raw = document.body.innerText || "";
    // Normalizza i caratteri se la pagina dovesse contenere varianti di '§' e spazi strani
    raw = raw.replace(/\u00A7/g, '§');       // § non-breaking -> normale
    raw = raw.replace(/\r/g, '');            // rimuovi CR
    // Collassa righe e spazi multipli in uno spazio singolo, mantenendo il testo leggibile
    let testo = raw.split('\n').map(s => s.trim()).join(' ');
    testo = testo.replace(/\s+/g, ' ').trim();
    // Split in blocchi a partire da ogni occorrenza di "Can. {numero}"
    const blocchi = testo.split(/(?=Can\.\s*\d+)/g);
    const risultato = blocchi
        .map(b => {
            const match = b.match(/^Can\.\s*(\d+)/);
            if (!match) return null;
            const num = match[1];
            // Corpo: testo dopo "Can. {num}" (eventuali trattini o simboli subito dopo vengono tolti)
            let corpo = b.replace(/^Can\.\s*\d+\s*[-–—:]?\s*/, '').trim();
            // Rileva sezioni con il simbolo § (accetta sia '§' sia l'entity normalizzata)
            const sezPattern = /(?=[\u00A7§]\s*\d+\.)/g;
            if (/[\u00A7§]\s*\d+\./.test(corpo)) {
                // Splitta mantenendo le sezioni che iniziano con § n.
                const sezioni = corpo.split(sezPattern).map(sez => {
                    // Estrai il numero di paragrafo dalla sezione
                    const parMatch = sez.match(/^[\u00A7§]\s*(\d+)\.\s*/);
                    if (!parMatch) return null;
                    const parNum = parMatch[1];
                    // Rimuovi l'intestazione "§ n." dal contenuto della sezione
                    const clean = sez.replace(/^[\u00A7§]\s*\d+\.\s*/, '').trim();
                    // Costruisci la riga della sezione con ancora formattata alla fine
                    return `§ ${parNum}. ${clean} ^ccar-cic-c${num}-c${parNum}`;
                }).filter(Boolean);
                return [
                    `###### Canone ${num}`,
                    sezioni.join('\n\n')
                ].join('\n\n');
            } else {
                // Nessuna sezione §: restituire il corpo intero sotto il canone
                return `###### Canone ${num}\n\n${corpo}`;
            }
        })
        .filter(Boolean)
        .join('\n\n\n');
    // Crea una textarea per copia rapida (sovrascrive se già esistente)
    let existing = document.getElementById('MioTestoEstratto');
    if (existing) existing.remove();
    const textarea = document.createElement('textarea');
    textarea.id = 'MioTestoEstratto';
    textarea.value = '\n\n' + risultato + '\n';
    textarea.style.width = '90%';
    textarea.style.height = '420px';
    textarea.style.display = 'block';
    textarea.style.margin = '20px auto';
    textarea.style.fontFamily = 'monospace';
    textarea.style.whiteSpace = 'pre-wrap';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
})();