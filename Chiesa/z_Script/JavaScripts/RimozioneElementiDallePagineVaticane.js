// Rimuove elementi superflui dalle pagine vaticane per una stampa più pulita
// ed inietta header e footer con logo
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

let c = document.querySelector('div.logo.doc-copyright');
if (c) c.remove();

// elimina i 4 commenti
let html = document.documentElement.innerHTML;
html = html
    .replace('<!-- CONTENUTO DOCUMENTO -->', '')
    .replace('<!-- /CONTENUTO DOCUMENTO -->', '')
    .replace('<!-- BEGIN: body.jsp -->', '')
    .replace('<!-- END: body.jsp -->', '');
document.documentElement.innerHTML = html;

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

setTimeout(() => window.print(), 100);