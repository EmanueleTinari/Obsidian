// Rimuove elementi superflui dalle pagine vaticane per una stampa più pulita
// ed inietta header e footer con logo
let tab = document.querySelector('#corpo table');
if (tab) tab.remove();
document.querySelectorAll('div.abstract.text.parbase.vaticanrichtext')
    .forEach(el => el.remove());
document.querySelectorAll('div.translation-field')
    .forEach(el => el.remove());
let hr = document.querySelector('hr');
if (hr) {
    // salva il div successivo *prima* di rimuovere l’hr
    let divSucc = hr.nextElementSibling?.tagName === 'DIV' ? hr.nextElementSibling : null;
    hr.remove();
    if (divSucc) divSucc.remove();
}
document.querySelectorAll('br[style="clear: both;"]').forEach(br => br.remove());
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
// elimina quei 2 commenti
document.documentElement.innerHTML =
    document.documentElement.innerHTML
        .replace('<!-- CONTENUTO DOCUMENTO -->', '')
        .replace('<!-- /CONTENUTO DOCUMENTO -->', '')
        .replace('<!-- BEGIN: body.jsp -->', '')
        .replace('<!-- END: body.jsp -->', '');
let doc = document.querySelector('div.documento');
if (doc) {
    let topHTML = `<table><tbody><tr><td width="5%"><p align="center"><a href="/content/vatican/it.html"><img border="0" src="/etc/designs/vatican/library/images/logo-vatican.png" width="64" height="78"></a></p></td></tr></tbody></table><hr>`;
    let bottomHTML = `<table><tbody><tr><td width="5%"><p align="center"><a href="/content/vatican/it.html"><img border="0" src="/etc/designs/vatican/library/images/logo-vatican.png" width="64" height="78"></a></p></td></tr></tbody></table>`;
    doc.insertAdjacentHTML('afterbegin', topHTML);
    doc.insertAdjacentHTML('beforeend', bottomHTML);
}
setTimeout(() => window.print(), 100);