// Rimuove elementi superflui dalle pagine vaticane per una stampa più pulita
// ed inietta header e footer con logo

// elimina i 4 commenti
let html = document.documentElement.innerHTML;
html = html
    .replace('<!-- CONTENUTO DOCUMENTO -->', '')
    .replace('<!-- /CONTENUTO DOCUMENTO -->', '')
    .replace('<!-- BEGIN: body.jsp -->', '')
    .replace('<!-- END: body.jsp -->', '');
document.documentElement.innerHTML = html;

// --- Pulizia e preparazione HTML ---
let tab = document.querySelector('#corpo table');
if (tab) tab.remove();

let oldContainer = document.querySelector('div.siv-innercontainer.rounded#corpo');
let newContainer = document.querySelector('div.container.va-main-document');
// controllo
if (oldContainer && newContainer) {
    console.warn('ERRORE: trovati entrambi i contenitori (improbabile)');
} else if (!oldContainer && !newContainer) {
    console.warn('ERRORE: non trovato né oldContainer né newContainer');
}
// eliminazione abstract
let absts = document.querySelectorAll('div.abstract.text.parbase.vaticanrichtext');
if (absts.length && oldContainer && !newContainer) {
    absts.forEach(el => el.remove());
}

let trans = document.querySelectorAll('div.translation-field');
if (trans.length) trans.forEach(el => el.remove());

let hr = document.querySelector('hr');
if (hr) {
    // salva il div successivo *prima* di rimuovere l’hr
    let divSucc = hr.nextElementSibling?.tagName === 'DIV' ? hr.nextElementSibling : null;
    hr.remove();
    if (divSucc) divSucc.remove();
}

let brs = document.querySelectorAll('br[style="clear: both;"]');
if (brs.length) brs.forEach(br => br.remove());

let keep = document.querySelector('div.documento');
if (!keep) console.warn('manca div.documento');
let chain = new Set();
let cur = keep;
while (cur && cur !== document.body) {
    chain.add(cur);
    cur = cur.parentElement;
}
chain.add(document.body);
[...document.body.children].forEach(el => {
    if (!chain.has(el)) el.remove();
});
void 0;

let h = document.querySelector('header.va-header.container');
if (h) h.remove();

let t = document.querySelector('div.va-tools.col-12.d-flex.flex-row-reverse');
if (t) t.remove();

document.querySelectorAll('script, style')
    .forEach(el => el.remove());

(function () {
    // seleziona qualsiasi <p> che contiene "Multimedia" in testo o anchor
    const pMultimedia = Array.from(document.querySelectorAll('p'))
        .find(p => /multimedia/i.test(p.textContent));

    if (!pMultimedia) {
        console.log('MULTIMEDIA: nessun paragrafo trovato');
        return;
    }

    console.log('MULTIMEDIA: rimuovo paragrafo:', pMultimedia);
    const pNext = (() => {
        let el = pMultimedia.nextSibling;
        while (el && el.nodeType !== Node.ELEMENT_NODE) el = el.nextSibling;
        if (el?.tagName === 'P') return el;
        return null;
    })();

    pMultimedia.remove();

    if (!pNext) {
        console.log('UNDERSCORE: nessun paragrafo successivo trovato');
        return;
    }

    // controlla se è linea di underscore
    const cleaned = (pNext.textContent || '').replace(/[\s\u00A0]/g, '').replace(/[^_]/g, '');
    if (cleaned.length >= 3) {
        pNext.outerHTML = '<p>&nbsp;</p><p>&nbsp;</p>';
        console.log('UNDERSCORE: sostituito con due paragrafi vuoti');
    } else {
        console.log('UNDERSCORE: paragrafo successivo non è linea di underscore significativa');
    }
})();

// robust: rimuove solo il <p> "Multimedia" (varie forme di href o testo) e sostituisce il <p> di underscore immediatamente dopo
(function () {
    const selAnchors = [
        'a[href*="/vaticanevents/"]',
        'a[href*="event.dir.html"]'
    ].join(',');

    // cerca anchor valide dentro div.abstract prima, poi ovunque; fallback su testo "Multimedia"
    let mp = document.querySelector('div.abstract.text.parbase.vaticanrichtext ' + selAnchors)
        || document.querySelector(selAnchors)
        || Array.from(document.querySelectorAll('a')).find(a => /\bMultimedia\b/i.test(a.textContent));

    if (!mp) {
        console.log('MULTIMEDIA: nessun link trovato.');
        return;
    }

    let p1 = mp.closest('p');
    if (!p1) {
        console.log('MULTIMEDIA: trovato anchor ma non è in un <p>. Anchor:', mp);
        mp.remove(); // rimuovo comunque l'anchor se presente fuori da <p>
        return;
    }

    // --- BLOCCO MULTIMEDIA + UNDERSCORE ---
    // selettore robusto che copre tutti i casi precedenti
    console.log('MULTIMEDIA: rimuovo paragrafo:', p1);
    p1.remove();

    // trova il prossimo <p> reale dopo p1 (salta nodi non-elemento o elementi diversi)
    let p2 = p1.nextElementSibling;
    while (p2 && p2.tagName !== 'P') {
        p2 = p2.nextElementSibling;
    }

    if (!p2) {
        console.log('UNDERSCORE: nessun paragrafo successivo trovato.');
        return;
    }

    if (p2) {
        // normalizza
        let raw = p2.textContent;
        raw = raw
            .replace(/\u200B/g, '')     // zero width
            .replace(/[\s\xa0]/g, '');  // tutti gli spazi e NBSP

        if (/^_+$/.test(raw)) {
            p2.outerHTML = '<p>&nbsp;</p><p>&nbsp;</p>';
        }
    }

    // normalizza: rimuove spazi, NBSP, ritorni, altri caratteri non underscore
    const raw = p2.textContent || '';
    const cleaned = raw.replace(/[\s\u00A0]/g, '').replace(/[^_]/g, '');
    console.log('UNDERSCORE: testo raw:', JSON.stringify(raw));
    console.log('UNDERSCORE: cleaned underscores:', cleaned.length);

    // se ci sono almeno 3 underscore contigue (dopo pulizia) -> sostituisci con due <p>&nbsp;</p>
    if (cleaned.length >= 3) {
        p2.outerHTML = '<p>&nbsp;</p><p>&nbsp;</p>';
        console.log('UNDERSCORE: sostituito con due paragrafi vuoti.');
    } else {
        console.log('UNDERSCORE: paragrafo successivo non è linea di underscore significativa; non modifico.');
    }
})();

// --- Blocco di COPYRIGHT ---
document.querySelectorAll('div.logo.doc-copyright')
    .forEach(el => el.remove());

// --- HEADER / FOOTER LOGO ---
let doc = document.querySelector('div.documento');
if (doc) {
    let topHTML = `<table><tbody><tr><td width="5%"><p align="center"><a href="/content/vatican/it.html"><img border="0" src="/etc/designs/vatican/library/images/logo-vatican.png" width="64" height="78"></a></p></td></tr></tbody></table><hr>`;
    let bottomHTML = `<table><tbody><tr><td width="5%"><p align="center"><a href="/content/vatican/it.html"><img border="0" src="/etc/designs/vatican/library/images/logo-vatican.png" width="64" height="78"></a></p></td></tr></tbody></table>`;
    doc.insertAdjacentHTML('afterbegin', topHTML);
    doc.insertAdjacentHTML('beforeend', bottomHTML);
}

let addHr = document.querySelector('hr');
if (addHr) {
    addHr.insertAdjacentHTML('beforebegin', '<p>&nbsp;</p>');
    addHr.insertAdjacentHTML('afterend', '<p>&nbsp;</p>');
}

// --- STAMPA ---
setTimeout(() => window.print(), 100);