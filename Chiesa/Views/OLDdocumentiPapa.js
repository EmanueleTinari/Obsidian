module.exports = async (dv, input) => {
    // Nome del file corrente (passato via input)
    const currentFile = input.autore;
    // Prende tutti gli alias del file corrente, o fallback al nome del file
    let autoreAliases = input.aliases && input.aliases.length > 0 
        ? input.aliases 
        : [currentFile];

    // Funzione per normalizzare autore-doc
    function normalizeAutore(val) {
        if (!val) return "";
        if (typeof val === "string") {
            const match = val.match(/\[\[.*?\|(.*?)\]\]/);
            return match ? match[1].trim() : val.replace(/\[\[|\]\]/g, "").trim();
        }
        if (val && (val.path || val.display)) {
            return val.display ? val.display.trim() : val.path.trim();
        }
        return String(val).trim();
    }

    // Helper per attributi HTML
    function escAttr(s) {
        return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    // Helper per inserire stringhe dentro onclick JS (escape backslash e apostrofi)
    function escJs(s) {
        return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    }

    // Filtra i file nella cartella Documenti per autore-doc
    const allDocs = dv.pages()
        .where(p => 
            p.file.ext === "md" &&
            !p.file.name.startsWith("_") &&
            p.file.folder && p.file.folder.startsWith("Documenti") &&
            p["autore-doc"] &&
            autoreAliases.some(alias => {
                const ad = p["autore-doc"];
                if (Array.isArray(ad)) return ad.some(a => normalizeAutore(a) === alias);
                return normalizeAutore(ad) === alias;
            })
        );

    if (!allDocs || allDocs.length === 0) {
        dv.paragraph(`> [!warning] Nessun documento trovato per ${autoreAliases.join(", ")}`);
    } else {
        // Raggruppa e ordina tipi-doc
        const grouped = {};
        allDocs.forEach(p => {
            let tipo = p["tipo-doc"] || "Altro";
            if (!grouped[tipo]) grouped[tipo] = [];
            grouped[tipo].push(p);
        });
        const tipiOrdinati = Object.keys(grouped).sort((a,b) => a.localeCompare(b, undefined, {sensitivity:'base'}));
        // --- Costruzione blocco unico ---
        let tableBlock = `> [!seealso]- Scritti di **${autoreAliases[0]}**:\n`;
        tipiOrdinati.forEach(tipo => {
            const docs = grouped[tipo].sort((a,b) => a["data-doc"] && b["data-doc"] ? dv.date(a["data-doc"]).epoch - dv.date(b["data-doc"]).epoch : 0);
            tableBlock += `> > [!seealso]- **${tipo}**\n`; // titolo sotto-callout
            tableBlock += `> > | Stato | Progr. | Num | Titolo | Data | File name |\n`;
            tableBlock += `| :------------------------------------------: | -----: | --: | ---------------------------------------- | ------------------- | --------------------------------- |\n`;
            docs.forEach((p,index) => {
                const pathEsc = escAttr(p.file.path);
                const fnameEsc = escAttr(p.file.name);
                const statoIcon = p["stato"] === "completato" ? "✅" : "⬜";
                const progr = (p["progr-doc"] || "").toString().replace(/\|/g,'\\|');
                const num = index + 1;
                const titolo = (p["titolo-doc"] || "").toString().replace(/\|/g,'\\|');
                const dataStr = p["data-doc"] ? dv.date(p["data-doc"]).toFormat("dd-MM-yyyy") : "";
                // link: usiamo input.origin come file chiamante (passato dal dataviewjs)
                const a = `<a href="#" onclick="app.workspace.openLinkText('${escJs(p.file.path)}','${escJs(input.origin)}',false)">${escAttr(p.file.name)}</a>`;
                tableBlock += `| <span class="dv-autocb" data-path="${pathEsc}" data-fname="${fnameEsc}">${statoIcon}</span> | ${progr} | ${num} | ${titolo} | ${dataStr} | ${a} |\n`;
            });
            tableBlock += `> \n`; // chiude sotto-callout
        });
        // Una sola chiamata di output alla fine
        dv.paragraph(tableBlock);
        // --- Trasformazione checkbox ---
        setTimeout(async () => {
            const spans = document.querySelectorAll('.dv-autocb');
            for (const span of spans) {
                const path = span.dataset.path;
                const pages = dv.pages().where(p => p.file.path === path);
                const page = (pages && pages.length) ? pages[0] : null;
                const checked = page && page["stato"] === "completato";
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.checked = !!checked;
                cb.style.marginRight = '6px';
                cb.addEventListener('change', async () => {
                    try {
                        const file = await dv.app.vault.getAbstractFileByPath(path);
                        if(file && file instanceof dv.app.vault.MarkdownFile) {
                            let content = await dv.app.vault.read(file);
                            const newVal = cb.checked ? "completato" : "";
                            const fmRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
                            const fmMatch = content.match(fmRegex);
                            if(fmMatch) {
                                let fm = fmMatch[1];
                                if(/^stato:.*$/m.test(fm)) fm = fm.replace(/^stato:.*$/m, `stato: ${newVal}`);
                                else fm = `stato: ${newVal}\n` + fm;
                                const newContent = content.replace(fmRegex, `---\n${fm}\n---\n`);
                                await dv.app.vault.modify(file, newContent);
                            } else {
                                const newContent = `---\nstato: ${newVal}\n---\n` + content;
                                await dv.app.vault.modify(file, newContent);
                            }
                        }
                    } catch(e) { console.error(e); }
                });
                span.innerHTML = '';
                span.appendChild(cb);
            }
        }, 200);
    }
};
