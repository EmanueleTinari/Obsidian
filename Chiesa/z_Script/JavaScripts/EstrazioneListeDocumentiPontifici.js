// Estrae dati da file Html. Da far girare nella Consolle.
// Estrapola data, titolo e link IT.
// La variabile $elements contiene i dati estratti, separati da tabulazioni e con ogni record su una nuova riga.
// Rimuove eventuale textarea esistente
// Incollare speciale in Excel facendo importazione guidata testo e scegliere testo delimitato da tabulazioni.

const oldTA = document.querySelector('#MioTestoEstratto');
if (oldTA) oldTA.remove();
let $elements = '';
// Funzione per estrarre la data dall'Href
function estraiDataDaHref(href) {
    const match = href.match(/(\d{8})/);
    if (!match) return '';
    const num = match[1];
    let giorno, mese, anno;
    // Prova YYYYMMDD
    let anno1 = parseInt(num.slice(0, 4));
    let mese1 = parseInt(num.slice(4, 6));
    let giorno1 = parseInt(num.slice(6, 8));
    if (anno1 > 1900 && mese1 <= 12 && giorno1 <= 31) {
        [anno, mese, giorno] = [anno1, mese1, giorno1];
    } else {
        // altrimenti DDMMYYYY
        giorno = parseInt(num.slice(0, 2));
        mese = parseInt(num.slice(2, 4));
        anno = parseInt(num.slice(4, 8));
    }
    const mesiIT = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
        "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
    return `${giorno} ${mesiIT[mese - 1]} ${anno}`;
}
document.querySelectorAll('li').forEach(li => {
    // cerca link IT in .translation-field o in h2 o in h1
    let linkIT = li.querySelector('.translation-field a[href*="/it/"]') ||
        li.querySelector('h2 a[href*="/it/"]') ||
        li.querySelector('h1 a[href*="/it/"]');
    if (!linkIT) return; // salta se non c'è IT
    // testo del titolo (h2 o h1)
    let titoloEl = li.querySelector('h2') || li.querySelector('h1');
    if (!titoloEl) return;
    // testo completo (senza markup HTML)
    let text = titoloEl.textContent.trim();
    // 🔹 Rimuove il carattere "°" (es. "1° gennaio 1970" → "1 gennaio 1970")
    text = text.replace(/°/g, '');
    let data = '';
    let titolo = text;
    // 1️⃣ Data tra parentesi, es. "(1 ottobre 1975)"
    let match = text.match(/\((\d{1,2}\s+\w+\s+\d{4})\)/);
    // 2️⃣ Al centro o fine del testo: ", 1 gennaio 1964," oppure ", 1 gennaio 1964"
    if (!match) match = text.match(/,\s*(\d{1,2}\s+\w+\s+\d{4})(?:,|$)/);
    // 3️⃣ All’inizio del testo: "1 gennaio 1964, Angelus..."
    if (!match) match = text.match(/^(\d{1,2}\s+\w+\s+\d{4}),/);
    if (match) {
        data = match[1].trim();
        titolo = text.replace(match[0], '').trim().replace(/\s+/g, ' ');
    }
    // 4️⃣ Se nessuno dei precedenti match ha funzionato, prova con l'Href
    if (!match) {
        data = estraiDataDaHref(linkIT.href);
        // Prova a rimuovere la data dal titolo se presente
        if (data) {
            // Crea pattern dinamico per gg mese aaaa, escape caratteri speciali
            const pattern = new RegExp(data.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
            titolo = text.replace(pattern, '').trim().replace(/\s+/g, ' ');
        }
    }
    $elements += `${data}\t${titolo}\t${linkIT.href}\n`;
});
const textarea = document.createElement('textarea');
// nome univoco
textarea.id = 'MioTestoEstratto';
textarea.value = $elements;
textarea.style.width = '90%';
textarea.style.height = '200px';
document.body.appendChild(textarea);
textarea.focus();
textarea.select(); // seleziona tutto



// ATTENZIONE
// La seguente versione cattura i dati nelle pagine dei papi del 1800 e prima su vatican.va 
// Elimina la scritta [Italiano] presente sotto ai link

const oldTA = document.querySelector('#MioTestoEstratto');
if (oldTA) oldTA.remove();
let $elements = '';

// Estrae data dall'href (gestisce YYYYMMDD, DDMMYYYY, "2-luglio-1826" e "%20" codificato)
function estraiDataDaHref(href) {
    if (!href) return '';
    const mesiIT = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
        "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
    const monthsMap = {
        // inglese breve/lungo -> italiano
        jan: "gennaio", feb: "febbraio", mar: "marzo", apr: "aprile", may: "maggio", jun: "giugno", jul: "luglio", aug: "agosto", sep: "settembre", oct: "ottobre", nov: "novembre", dec: "dicembre",
        january: "gennaio", february: "febbraio", march: "marzo", april: "aprile", may: "maggio", june: "giugno", july: "luglio", august: "agosto", september: "settembre", october: "ottobre", november: "novembre", december: "dicembre",
        // italiano -> italiano (pass-through)
        gennaio: "gennaio", febbraio: "febbraio", marzo: "marzo", aprile: "aprile", maggio: "maggio", giugno: "giugno", luglio: "luglio", agosto: "agosto", settembre: "settembre", ottobre: "ottobre", novembre: "novembre", dicembre: "dicembre"
    };

    // 8 cifre (YYYYMMDD o DDMMYYYY)
    let m = href.match(/(\d{8})/);
    if (m) {
        const num = m[1];
        // prova YYYYMMDD
        let anno1 = parseInt(num.slice(0, 4), 10);
        let mese1 = parseInt(num.slice(4, 6), 10);
        let giorno1 = parseInt(num.slice(6, 8), 10);
        if (anno1 > 1900 && mese1 >= 1 && mese1 <= 12 && giorno1 >= 1 && giorno1 <= 31) {
            return `${giorno1} ${mesiIT[mese1 - 1]} ${anno1}`;
        }
        // prova DDMMYYYY
        let giorno2 = parseInt(num.slice(0, 2), 10);
        let mese2 = parseInt(num.slice(2, 4), 10);
        let anno2 = parseInt(num.slice(4, 8), 10);
        if (anno2 > 1900 && mese2 >= 1 && mese2 <= 12 && giorno2 >= 1 && giorno2 <= 31) {
            return `${giorno2} ${mesiIT[mese2 - 1]} ${anno2}`;
        }
    }

    // 2-luglio-1826 o 02_luglio_1826 (anche %20)
    m = href.match(/(\d{1,2})[-_](?:%20)?([a-zàèéìòù]+)[-_](\d{4})/i);
    if (m) {
        const day = parseInt(m[1], 10);
        const monthRaw = decodeURIComponent(m[2].toLowerCase());
        const monthIt = monthsMap[monthRaw] || monthRaw;
        return `${day} ${monthIt} ${m[3]}`;
    }

    // 2%20luglio%201826
    m = href.match(/(\d{1,2})%20([a-zàèéìòù]+)%20(\d{4})/i);
    if (m) {
        const day = parseInt(m[1], 10);
        const monthRaw = decodeURIComponent(m[2].toLowerCase());
        const monthIt = monthsMap[monthRaw] || monthRaw;
        return `${day} ${monthIt} ${m[3]}`;
    }

    return '';
}

document.querySelectorAll('li').forEach(li => {
    // includi solo se esiste un link IT nel li
    if (!li.querySelector('a[href*="/it/"]')) return;

    const anchors = Array.from(li.querySelectorAll('a'));
    const mainAnchor = li.querySelector('h1 a')
        || anchors.find(a => !/^\s*(?:\[)?\s*(?:Italiano|Italian)\s*(?:\])?\s*$/i.test(a.textContent))
        || anchors.find(a => a.getAttribute('href') && a.getAttribute('href').includes('/it/'))
        || anchors[0];
    if (!mainAnchor) return;

    let text = mainAnchor.textContent.trim().replace(/\s+/g, ' ');
    text = text.replace(/°/g, '');

    let data = '';
    let titolo = text;

    // 1) (2 luglio 1826)
    let match = text.match(/\((\d{1,2}\s+[A-Za-zàèéìòù]+(?:\s+[A-Za-z]+)?\s+\d{4})\)/i);
    // 2) , 2 luglio 1826,  oppure finale dopo comma
    if (!match) match = text.match(/,\s*(\d{1,2}\s+[A-Za-zàèéìòù]+(?:\s+[A-Za-z]+)?\s+\d{4})(?:,|$)/i);
    // 3) inizio "2 luglio 1826, Titolo..."
    if (!match) match = text.match(/^(\d{1,2}\s+[A-Za-zàèéìòù]+(?:\s+[A-Za-z]+)?\s+\d{4}),/i);

    if (match) {
        data = match[1].trim();
        titolo = text.replace(match[0], '').trim().replace(/\s+/g, ' ');
    } else {
        // prova estrarre dalla href del mainAnchor
        data = estraiDataDaHref(mainAnchor.getAttribute('href') || mainAnchor.href);
        if (data) {
            // rimuove pattern data eventualmente presente tra parentesi o dopo una virgola
            titolo = text.replace(/\(\s*\d{1,2}\s+[A-Za-zàèéìòù]+(?:\s+[A-Za-z]+)?\s+\d{4}\s*\)/i, '')
                .replace(/,\s*\d{1,2}\s+[A-Za-zàèéìòù]+(?:\s+[A-Za-z]+)?\s+\d{4}/i, '')
                .trim();
        }
    }

    // pulizie finali: rimuovi eventuali [Italiano] o altre parentesi quadre e spazi extra
    titolo = titolo.replace(/\[.*?\]/g, '').replace(/^[\s\-\–\:]+|[\s\-\–\:]+$/g, '').replace(/\s+/g, ' ').trim();

    let href = mainAnchor.getAttribute('href') || '';
    try { href = new URL(href, location.origin).href; } catch (e) { }

    $elements += `${data}\t${titolo}\t${href}\n`;
});

// output + textarea per copia
const textarea = document.createElement('textarea');
textarea.id = '\n\n' + MioTestoEstratto + '\n';
textarea.value = $elements;
textarea.style.width = '90%';
textarea.style.height = '200px';
document.body.appendChild(textarea);
textarea.focus();
textarea.select();