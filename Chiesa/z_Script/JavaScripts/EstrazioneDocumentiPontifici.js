// --- Estrazione e formattazione testo dal documento Vaticano ---
// Funziona coi testi suddivisi in paragrafi numerati.
// Es. 1. Testo
//     2. Testo
// Se ci sono sottoparagrafi li unisce con un doppio <br> facendo proseguire il testo senza fine riga.
// Alla fine di ogni paragrafo mette la classe `class: paragrafoNorm`
// Funziona per le Encicliche ma va anche bene per le Udienze.

(() => {
    // Estrae il contenuto tra <!-- TESTO --> e <!-- /TESTO -->
    let doc = document.querySelector('.documento');
    if (!doc) {
        alert("Nessun elemento .documento trovato!");
        return;
    }
    let html = doc.innerHTML;
    let match = html.match(/<!-- TESTO -->([\s\S]*?)<!-- \/TESTO -->/);
    if (!match) {
        alert("Sezione TESTO non trovata!");
        return;
    }
    let testo = match[1];
    // Rimuove tutto tranne i <p>, <i>, <em>, &nbsp;
    testo = testo
        .replace(/<\/?(div|span|strong|b|u|a|h\d|section|article|blockquote|ul|ol|li|figure|figcaption)[^>]*>/gi, '');
    // Gestione &nbsp;
    testo = testo
        .replace(/&nbsp;(?=\s*<\/p>)/g, '').replace(/&nbsp;/g, ' ');
    // Markdown per italic
    testo = testo
        .replace(/<i>(.*?)<\/i>/gi, '*$1*').replace(/<em>(.*?)<\/em>/gi, '*$1*');
    // Estrae i paragrafi
    let paragrafi = [...testo.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m => m[1].trim());
    let risultato = '';
    let bufferBlocco = ''; // accumula i paragrafi di un blocco numerato
    for (let i = 0; i < paragrafi.length; i++) {
        let curr = paragrafi[i];
        let matchNum = curr.match(/^(\d+)\.\s+/);
        if (matchNum) {
            // Prima di iniziare un nuovo blocco, svuota bufferBlocco precedente
            if (bufferBlocco) {
                risultato += bufferBlocco + ' `class: paragrafoNorm`\n\n';
                bufferBlocco = '';
            }
            let numero = matchNum[1];
            let testoPar = curr.replace(/^(\d+)\.\s+/, '').trim();
            bufferBlocco = '\n###### ' + numero + '.\n\n' + testoPar;
        } else {
            // Paragrafo non numerato → unisci con <br><br>
            if (bufferBlocco) {
                bufferBlocco += '<br><br>' + curr;
            } else {
                // Primo paragrafo non numerato prima di qualsiasi numero
                bufferBlocco = curr;
            }
        }
    }
    // Aggiunge l’ultimo blocco
    if (bufferBlocco) {
        risultato += bufferBlocco + ' `class: paragrafoNorm`\n';
    }
    // Non rimuove <br>, rimuove altri tag residui
    risultato = risultato.replace(/<(?!br\s*\/?)[^>]+>/gi, '');
    // Crea textarea
    let existing = document.getElementById('MioTestoEstratto');
    if (existing) existing.remove();
    const textarea = document.createElement('textarea');
    textarea.id = 'MioTestoEstratto';
    textarea.value = risultato.trim();
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
