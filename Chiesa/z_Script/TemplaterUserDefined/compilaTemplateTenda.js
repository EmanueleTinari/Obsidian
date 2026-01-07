module.exports = async (tp) => {
    const { app } = tp;
    // --- NUOVA LOGICA INIZIALE ---
    const annoCal = "2024";
    let dataPerNomeFile = "";
    let paginePerNomeFile = "";
    // 1. Richiesta data (giorno e mese)
    const resData = await promptPersonalizzato(tp, {
        titolo: "Inserisci la data della liturgia",
        placeholder: "Es: Giovedì 3 ottobre"
    });
    if (resData.action !== 'continua' || resData.value.trim() === "") {
        mostraNotificaPersonalizzata("❌ Operazione annullata.", "errore", 3);
        return;
    }
    const dataInserita = resData.value.trim();
    console.log(`Data inserita: ${dataInserita}\n`);
    // 2. Richiesta anno
    const resAnno = await promptPersonalizzato(tp, {
        titolo: "Inserisci l'anno",
        placeholder: "Es: 2024",
        valoreIniziale: annoCal
    });
    if (resAnno.action !== 'continua' || resAnno.value.trim() === "") {
        mostraNotificaPersonalizzata("❌ Operazione annullata.", "errore", 3);
        return;
    }
    const annoInserito = resAnno.value.trim();
    console.log(`Anno inserito: ${annoInserito}\n`);
    // 3. Composizione stringhe
    const dataCompleta = `${dataInserita} ${annoInserito}`;
    dataPerNomeFile = convertiDataItaliana(dataCompleta);
    if (dataPerNomeFile === "0000-00-00") {
        mostraNotificaPersonalizzata(`⚠️ Formato data non riconosciuto: "${dataCompleta}".\nIl nome del file userà '0000-00-00'.`, "attenzione", 8);
    }
    // 4. Richiesta Pagine
    const resPagine = await promptPersonalizzato(tp, {
        titolo: "Inserisci le pagine",
        placeholder: "Es: 54..61"
    });
    if (resPagine.action !== 'continua') {
        mostraNotificaPersonalizzata("❌ Operazione annullata.", "errore", 3);
        return;
    }
    let pagineInserite = resPagine.value.trim();
    let pagineEspanse = pagineInserite;
    if (pagineInserite.includes("..")) {
        const [inizio, fine] = pagineInserite.split("..").map(n => n.trim());
        paginePerNomeFile = `${inizio.padStart(4, '0')}-${fine.padStart(4, '0')}`;
        pagineEspanse = espandiPagine(inizio, fine);
    }
    console.log(`Pagine inserite: ${pagineInserite}\nPagine espanse: ${pagineEspanse}\n`);
    // 5. Preparazione dati per Frontmatter e corpo del testo
    let stringaDataHTML = "";
    let titoloDoc = "La Tenda, messalino quotidiano";
    let giornoDoc = "";
    let meseDoc = "";
    let annoDoc = "";
    let dataDoc = dataPerNomeFile;
    if (dataPerNomeFile !== "0000-00-00") {
        const [y, m, d] = dataPerNomeFile.split("-").map(Number);
        const dateObj = new Date(y, m - 1, d);
        const weekday = dateObj.toLocaleDateString('it-IT', { weekday: 'long' });
        const month = dateObj.toLocaleDateString('it-IT', { month: 'long' });
        // Per HTML string
        stringaDataHTML = `<span class="giorno_crb">${weekday} ${d} ${month}</span>\n`;
        // Per Frontmatter
        titoloDoc = `La Tenda, messalino quotidiano di ${weekday} ${d} ${month} ${y}`;
        giornoDoc = d.toString();
        meseDoc = m.toString();
        annoDoc = y.toString();
    } else {
        stringaDataHTML = `<span class="giorno_crb">${dataInserita}</span>\n`;
    }
    console.log(`Stringa data HTML: ${stringaDataHTML}\n`);
    // 6. Richiesta Celebrazione (Nuova Logica con Toggle)
    const resCelebrazione = await promptCelebrazione(tp);
    if (resCelebrazione.action !== 'continua') {
        mostraNotificaPersonalizzata("❌ Operazione annullata.", "errore", 3);
        return;
    }
    const stringaCelebrazione = resCelebrazione.value;
    // 7. Richiesta Blocco Ingresso
    const resIngresso = await promptIngresso(tp);
    if (resIngresso.action !== 'continua') {
        mostraNotificaPersonalizzata("❌ Operazione annullata.", "errore", 3);
        return;
    }
    const stringaIngresso = resIngresso.value;
    // 8. Richiesta Blocco Inizio Assemblea
    const resAssemblea = await promptAssemblea(tp);
    if (resAssemblea.action !== 'continua') {
        mostraNotificaPersonalizzata("❌ Operazione annullata.", "errore", 3);
        return;
    }
    const stringaAssemblea = resAssemblea.value;
    // 9. Richiesta Liturgia della Parola
    const resLiturgia = await promptLiturgiaDellaParola(tp, resCelebrazione.selectedType);
    if (resLiturgia.action !== 'continua') {
        mostraNotificaPersonalizzata("❌ Operazione annullata.", "errore", 3);
        return;
    }
    const stringaLiturgia = resLiturgia.value;
    // 10. Richiesta Antifona Dopo il Vangelo
    const resDopoVangelo = await promptDopoVangelo(tp);
    if (resDopoVangelo.action !== 'continua') {
        mostraNotificaPersonalizzata("❌ Operazione annullata.", "errore", 3);
        return;
    }
    const stringaDopoVangelo = resDopoVangelo.value;
    // 11. Richiesta Preghiera dei Fedeli
    const resPreghieraFedeli = await promptPreghieraDeiFedeli(tp);
    if (resPreghieraFedeli.action !== 'continua') {
        mostraNotificaPersonalizzata("❌ Operazione annullata.", "errore", 3);
        return;
    }
    const stringaPreghieraFedeli = resPreghieraFedeli.value;
    // 12. Richiesta A Conclusione della Liturgia
    const resConclusione = await promptConclusioneLiturgia(tp);
    if (resConclusione.action !== 'continua') {
        mostraNotificaPersonalizzata("❌ Operazione annullata.", "errore", 3);
        return;
    }
    const stringaConclusione = resConclusione.value;
    // 13. Richiesta Sui Doni
    const resSuiDoni = await promptSuiDoni(tp);
    if (resSuiDoni.action !== 'continua') {
        mostraNotificaPersonalizzata("❌ Operazione annullata.", "errore", 3);
        return;
    }
    const stringaSuiDoni = resSuiDoni.value;
    // 14. Richiesta Prefazio
    const resPrefazio = await promptPrefazio(tp);
    if (resPrefazio.action !== 'continua') {
        mostraNotificaPersonalizzata("❌ Operazione annullata.", "errore", 3);
        return;
    }
    const stringaPrefazio = resPrefazio.value;
    // 15. Richiesta Spezzare del Pane
    const resSpezzarePane = await promptSpezzarePane(tp);
    if (resSpezzarePane.action !== 'continua') {
        mostraNotificaPersonalizzata("❌ Operazione annullata.", "errore", 3);
        return;
    }
    const stringaSpezzarePane = resSpezzarePane.value;
    // 16. Richiesta Alla Comunione
    const resComunione = await promptAllaComunione(tp);
    if (resComunione.action !== 'continua') {
        mostraNotificaPersonalizzata("❌ Operazione annullata.", "errore", 3);
        return;
    }
    const stringaComunione = resComunione.value;
    // 17. Richiesta Dopo la Comunione
    const resDopoComunione = await promptDopoComunione(tp);
    if (resDopoComunione.action !== 'continua') {
        mostraNotificaPersonalizzata("❌ Operazione annullata.", "errore", 3);
        return;
    }
    const stringaDopoComunione = resDopoComunione.value;
    // 18. Richiesta Meditazione
    const resMeditazione = await promptMeditazione(tp, resCelebrazione.selectedType);
    if (resMeditazione.action !== 'continua') {
        mostraNotificaPersonalizzata("❌ Operazione annullata.", "errore", 3);
        return;
    }
    const stringaMeditazione = resMeditazione.value;
    // --- COSTRUZIONE CONTENUTO FINALE ---
    const frontmatter = `---
cssclasses: tenda
nota: La Tenda
titolo-doc: ${titoloDoc}
giorno-doc: ${giornoDoc}
mese-doc: ${meseDoc}
anno-doc: ${annoDoc}
data-doc: ${dataDoc}
pagine: ${pagineEspanse}
licenza-doc: Copyright © Dicastero per la Comunicazione - Libreria Editrice Vaticana
licenza-nota: Copyright © 2025 Emanuele Tinari under Creative Commons BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
creato: 
modificato: 
---

`;
    let contenutoFinale = frontmatter;
    const destinazionePath = "_00 - OCR/File MD creati con OCR";
    // 3. Data HTML
    contenutoFinale += stringaDataHTML + "\n";
    // 4. Celebrazione
    contenutoFinale += stringaCelebrazione;
    // Blocco Ingresso
    contenutoFinale += stringaIngresso;
    // Blocco Inizio Assemblea
    contenutoFinale += stringaAssemblea;
    // Liturgia della Parola
    contenutoFinale += stringaLiturgia;
    // Dopo il Vangelo
    contenutoFinale += stringaDopoVangelo;
    // Preghiera dei Fedeli
    contenutoFinale += stringaPreghieraFedeli;
    // A Conclusione della Liturgia
    contenutoFinale += stringaConclusione;
    // Sui Doni
    contenutoFinale += stringaSuiDoni;
    // Prefazio
    contenutoFinale += stringaPrefazio;
    // Allo Spezzare del Pane
    contenutoFinale += stringaSpezzarePane;
    // Alla Comunione
    contenutoFinale += stringaComunione;
    // Dopo la Comunione
    contenutoFinale += stringaDopoComunione;
    // Meditazione
    contenutoFinale += stringaMeditazione;
    // COSTRUZIONE NOME FILE
    const ts = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/[:]/g, '-').split(' ')[1]; // HH-mm-ss
    const dataF = dataPerNomeFile || "0000-00-00";
    const pagF = paginePerNomeFile || "0000-0000";
    const nuovoNome = `${dataF} - La Tenda pagine ${pagF} ${ts}.md`;
    const fullPath = `${destinazionePath}/${nuovoNome}`;
    try {
        await app.vault.create(fullPath, contenutoFinale);
        mostraNotificaPersonalizzata(`✅ File creato:\n${nuovoNome}`, "successo", 6);
    } catch (e) {
        mostraNotificaPersonalizzata("❌ Errore creazione file (duplicato o cartella mancante)", "errore", 10);
    }
};
// --- FUNZIONI DI SUPPORTO ---
function convertiDataItaliana(dataStr) {
    const mesi = {
        "gennaio": "01", "febbraio": "02", "marzo": "03", "aprile": "04",
        "maggio": "05", "giugno": "06", "luglio": "07", "agosto": "08",
        "settembre": "09", "ottobre": "10", "novembre": "11", "dicembre": "12"
    };
    try {
        const parti = dataStr.toLowerCase().split(" ").filter(p => p.trim() !== "");
        // Supporta sia "Giovedì 3 ottobre 2024" (4 parti) che "3 ottobre 2024" (3 parti)
        let giorno, meseKey, anno;
        if (parti.length === 4) {
            [, giorno, meseKey, anno] = parti;
        } else if (parti.length === 3) {
            [giorno, meseKey, anno] = parti;
        } else {
            throw new Error("Formato data non supportato");
        }
        giorno = giorno.padStart(2, '0');
        const mese = mesi[meseKey];
        if (!mese) throw new Error("Mese non valido");
        return `${anno}-${mese}-${giorno}`;
    } catch (e) {
        return "0000-00-00";
    }
}
function espandiPagine(start, end) {
    let s = parseInt(start);
    let e = parseInt(end);
    let result = [];
    // Mantiene lo zero iniziale se presente nell'input dell'utente
    const padding = start.startsWith("0") ? start.length : 0;
    for (let i = s; i <= e; i++) {
        result.push(i.toString().padStart(padding, '0'));
    }
    return result.join(",");
}
function formattaTestoConACapo(testo) {
    if (!testo || testo.trim() === '') {
        return '';
    }
    const placeholders = {};
    let i = 0;
    // Step 1: "Protegge" il contenuto dentro «...» rimpiazzandolo con un placeholder.
    const testoSenzaCitazioni = testo.replace(/«[^»]*»|\([^)]*\)/g, (match) => {
        const placeholder = `__PLACEHOLDER_${i}__`;
        placeholders[placeholder] = match;
        i++;
        return placeholder;
    });
    // Step 2: Applica la regola di formattazione al resto del testo.
    // La regola: aggiunge <br> dopo . ! ? se sono seguiti da uno spazio.
    const regex = /([.!?])\s/g;
    const testoFormattato = testoSenzaCitazioni.replace(regex, '$1<br>');
    // Step 3: Ripristina il contenuto "protetto".
    let testoFinale = testoFormattato;
    for (const placeholder in placeholders) {
        testoFinale = testoFinale.replace(placeholder, placeholders[placeholder]);
    }
    return testoFinale;
}
function formattaTestoMultiRiga(testo) {
    if (!testo || testo.trim() === '') return '';
    // Prima applica gli a-capo automatici a fine frase
    const testoConFrasiSeparate = formattaTestoConACapo(testo);
    // Poi converte gli a-capo manuali inseriti dall'utente
    return testoConFrasiSeparate.replace(/\n/g, '<br>');
}
// VI. Richiesta Celebrazione (Nuova Logica con Toggle)
async function promptCelebrazione(tp) {
    return new Promise((resolve) => {
        const modal = new tp.obsidian.Modal(tp.app);
        let value = "";
        let selectedType = "Feria"; // Default
        // Contenitore per gli input dinamici
        let inputContainer = null;
        // Riferimenti agli input per Memoria Facoltativa
        let inputsMemoria = { f1: null, f2: null, f3: null, f4: null, f5: null };
        // Riferimento all'input standard
        let inputStandard = null;
        // Stati dei toggle
        const types = {
            "Feria": true,
            "Festa": false,
            "Solennità": false,
            "Memoria": false,
            "Memoria facoltativa": false
        };
        const toggleComps = {};
        // Funzione per aggiornare i campi di input in base alla selezione
        const updateInputFields = () => {
            if (!inputContainer) return;
            inputContainer.empty();
            inputsMemoria = { f1: null, f2: null, f3: null, f4: null, f5: null };
            inputStandard = null;
            if (selectedType === "Memoria facoltativa") {
                // --- CAMPO 1: Settimana Liturgica ---
                inputContainer.createEl("div", { text: "Inserire la settimana liturgica", style: "font-weight:bold; margin-top:10px;" });
                inputsMemoria.f1 = inputContainer.createEl("textarea", { placeholder: "Es: Settimana della V domenica..." });
                inputsMemoria.f1.style.width = "100%";
                inputsMemoria.f1.style.height = "4.5em"; // ~3 righe
                // --- CAMPO 2: Nota a piè di pagina ---
                inputContainer.createEl("div", { text: "Inserire l'eventuale nota a piè di pagina", style: "font-weight:bold; margin-top:10px;" });
                inputsMemoria.f2 = inputContainer.createEl("textarea", { placeholder: "Opzionale. Es: Proprio dell’Arcidiocesi..." });
                inputsMemoria.f2.style.width = "100%";
                inputsMemoria.f2.style.height = "4.5em"; // ~3 righe
                // --- CAMPO 3: Santo/Beato ---
                inputContainer.createEl("div", { text: "Inserire il Beato o il Santo di cui ricorre la Memoria liturgica", style: "font-weight:bold; margin-top:10px;" });
                inputsMemoria.f3 = inputContainer.createEl("textarea", { placeholder: "Es: Beato Luigi Talamoni..." });
                inputsMemoria.f3.style.width = "100%";
                inputsMemoria.f3.style.height = "2.5em"; // ~1 riga
                // --- CAMPO 4: Biografia ---
                inputContainer.createEl("div", { text: "Inserire la biografia del Beato o del Santo", style: "font-weight:bold; margin-top:10px;" });
                inputsMemoria.f4 = inputContainer.createEl("textarea", { placeholder: "Es: Luigi Talamoni nacque a Monza..." });
                inputsMemoria.f4.style.width = "100%";
                inputsMemoria.f4.style.height = "15em"; // ~10 righe
                inputsMemoria.f4.style.marginBottom = "20px";
            }
            else if (selectedType === "Memoria") {
                // --- CAMPO 1: Settimana Liturgica ---
                inputContainer.createEl("div", { text: "Inserire la settimana liturgica", style: "font-weight:bold; margin-top:10px;" });
                inputsMemoria.f1 = inputContainer.createEl("textarea", { placeholder: "Es: Settimana della V domenica..." });
                inputsMemoria.f1.style.width = "100%";
                inputsMemoria.f1.style.height = "4.5em";
                // --- CAMPO 2: Nota a piè di pagina ---
                inputContainer.createEl("div", { text: "Inserire l'eventuale nota a piè di pagina", style: "font-weight:bold; margin-top:10px;" });
                inputsMemoria.f2 = inputContainer.createEl("textarea", { placeholder: "Opzionale. Es: Proprio dell’Arcidiocesi..." });
                inputsMemoria.f2.style.width = "100%";
                inputsMemoria.f2.style.height = "4.5em";
                // --- CAMPO 3: Santo/Beato ---
                inputContainer.createEl("div", { text: "Inserire il Beato o il Santo di cui ricorre la Memoria liturgica", style: "font-weight:bold; margin-top:10px;" });
                inputsMemoria.f3 = inputContainer.createEl("textarea", { placeholder: "Es: SAN GIOVANNI, apostolo ed evangelista" });
                inputsMemoria.f3.style.width = "100%";
                inputsMemoria.f3.style.height = "2.5em";
                // --- CAMPO 4: Tipo di giornata ---
                inputContainer.createEl("div", { text: "Tipo di giornata (opzionale)", style: "font-weight:bold; margin-top:10px;" });
                inputsMemoria.f4 = inputContainer.createEl("textarea", { placeholder: "Es: Giornata mondiale missionaria delle Religiose" });
                inputsMemoria.f4.style.width = "100%";
                inputsMemoria.f4.style.height = "3em";
                // --- CAMPO 5: Biografia ---
                inputContainer.createEl("div", { text: "Inserire la biografia del Beato o del Santo", style: "font-weight:bold; margin-top:10px;" });
                inputsMemoria.f5 = inputContainer.createEl("textarea", { placeholder: "Es: Luigi Talamoni nacque a Monza..." });
                inputsMemoria.f5.style.width = "100%";
                inputsMemoria.f5.style.height = "15em";
                inputsMemoria.f5.style.marginBottom = "20px";
            }
            else {
                // --- INPUT STANDARD (Feria, Festa, ecc.) ---
                inputContainer.createEl("div", { text: "Titolo della celebrazione", style: "font-weight:bold; margin-top:10px;" });
                inputStandard = inputContainer.createEl("textarea", {
                    placeholder: "Inserisci il titolo della celebrazione..."
                });
                inputStandard.style.width = "100%";
                inputStandard.style.height = "100px";
                inputStandard.style.marginBottom = "20px";
                inputStandard.focus();
                inputStandard.addEventListener("input", (e) => { value = e.target.value; });
            }
        };
        modal.onOpen = () => {
            const { contentEl } = modal;
            contentEl.empty();
            contentEl.createEl("h2", { text: "Tipologia e Titolo Celebrazione" });
            // Container per i toggle (2 colonne)
            const container = contentEl.createDiv();
            container.style.display = "flex";
            container.style.justifyContent = "space-between";
            container.style.marginBottom = "10px";
            const leftCol = container.createDiv();
            leftCol.style.width = "48%";
            const rightCol = container.createDiv();
            rightCol.style.width = "48%";
            const createToggle = (col, label) => {
                new tp.obsidian.Setting(col)
                    .setName(label)
                    .addToggle(toggle => {
                        toggle.setValue(types[label]);
                        toggleComps[label] = toggle;
                        toggle.onChange(val => {
                            if (val) {
                                // Se acceso, spegni gli altri
                                for (const key in types) {
                                    if (key !== label) {
                                        types[key] = false;
                                        if (toggleComps[key]) toggleComps[key].setValue(false);
                                    }
                                }
                                types[label] = true;
                                selectedType = label;
                                updateInputFields(); // Aggiorna i campi quando cambia il tipo
                            } else {
                                // Impedisci lo spegnimento se è l'unico attivo (comportamento radio)
                                if (types[label]) {
                                    toggle.setValue(true);
                                }
                            }
                        });
                    });
            };
            // Colonna Sinistra
            createToggle(leftCol, "Feria");
            createToggle(leftCol, "Festa");
            createToggle(leftCol, "Solennità");
            // Colonna Destra
            createToggle(rightCol, "Memoria");
            createToggle(rightCol, "Memoria facoltativa");
            // Container Input Dinamici
            inputContainer = contentEl.createDiv();
            updateInputFields(); // Inizializzazione
            // Bottoni
            const buttonContainer = contentEl.createDiv({ cls: "modal-button-container" });
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "space-between";
            const annullaBtn = buttonContainer.createEl("button", { text: "Annulla" });
            annullaBtn.onclick = () => { modal.close(); resolve({ action: 'annulla' }); };
            const rightButtons = buttonContainer.createDiv();
            rightButtons.style.display = "flex";
            const cancellaBtn = rightButtons.createEl("button", { text: "Cancella" });
            cancellaBtn.style.marginRight = "10px";
            cancellaBtn.onclick = () => {
                if (selectedType === "Memoria facoltativa" || selectedType === "Memoria") {
                    if (inputsMemoria.f1) inputsMemoria.f1.value = "";
                    if (inputsMemoria.f2) inputsMemoria.f2.value = "";
                    if (inputsMemoria.f3) inputsMemoria.f3.value = "";
                    if (inputsMemoria.f4) inputsMemoria.f4.value = "";
                    if (inputsMemoria.f5) inputsMemoria.f5.value = "";
                } else {
                    value = "";
                    if (inputStandard) { inputStandard.value = ""; inputStandard.focus(); }
                }
            };
            const continuaBtn = rightButtons.createEl("button", { text: "Continua", cls: "mod-cta" });
            continuaBtn.onclick = () => {
                modal.close();
                // Formattazione stringa in base al tipo selezionato
                let formatted = "";
                if (selectedType === "Memoria facoltativa") {
                    // Recupero valori
                    const v1 = inputsMemoria.f1 ? inputsMemoria.f1.value.trim() : "";
                    const v2 = inputsMemoria.f2 ? inputsMemoria.f2.value.trim() : "";
                    const v3 = inputsMemoria.f3 ? inputsMemoria.f3.value.trim() : "";
                    const v4 = inputsMemoria.f4 ? inputsMemoria.f4.value.trim() : "";
                    // CAMPO 1: Settimana (a capo -> <br>)
                    const stringa1 = formattaTestoMultiRiga(v1);
                    formatted += `<span class="normale_centrato">${stringa1}</span>\n`;
                    // CAMPO 2: Nota (se presente)
                    if (v2 !== "") {
                        formatted += `<span class="rn">* </span><span class="pn">${v2}</span><br>\n\n`;
                    }
                    // CAMPO 3: Santo (asterisco se c'è nota)
                    const asterisco = (v2 !== "") ? " \*" : "";
                    formatted += `<span class="centrato_rosso">${v3}${asterisco}</span>\n\n`;
                    // CAMPO 4: Biografia
                    formatted += `<span class="biografia">${formattaTestoMultiRiga(v4)}</span><br>\n`;
                }
                else if (selectedType === "Memoria") {
                    const v1 = inputsMemoria.f1 ? inputsMemoria.f1.value.trim() : "";
                    const v2 = inputsMemoria.f2 ? inputsMemoria.f2.value.trim() : "";
                    const v3 = inputsMemoria.f3 ? inputsMemoria.f3.value.trim() : "";
                    const v4 = inputsMemoria.f4 ? inputsMemoria.f4.value.trim() : ""; // Tipo giornata
                    const v5 = inputsMemoria.f5 ? inputsMemoria.f5.value.trim() : ""; // Biografia
                    const stringa1 = formattaTestoMultiRiga(v1);
                    formatted += `<span class="normale_centrato">${stringa1}</span>\n`;
                    if (v2 !== "") {
                        formatted += `<span class="rn">* </span><span class="pn">${v2}</span><br>\n\n`;
                    }
                    const asterisco = (v2 !== "") ? " \*" : "";
                    formatted += `<span class="centrato_rosso">${v3}${asterisco}</span>\n\n`;
                    if (v4 !== "") {
                        formatted += `<span class="normale_centrato">*${v4}*</span><br>\n\n`;
                    }
                    if (v5 !== "") {
                        formatted += `<span class="biografia">${formattaTestoMultiRiga(v5)}</span><br>\n`;
                    }
                }
                else {
                    // Logica Standard
                    const text = value.trim();
                    if (selectedType === "Feria") {
                        formatted = `<span class="normale_centrato">${text}</span>\n`;
                    } else if (selectedType === "Festa") {
                        formatted = `<span class="centrato_rosso">${text}</span>\n`;
                    } else {
                        // Default per gli altri casi (Solennità, Memoria)
                        formatted = `<span class="normale_centrato">${text}</span>\n`;
                    }
                }
                resolve({ action: 'continua', value: formatted, selectedType: selectedType });
            };
        };
        modal.onClose = () => {
            resolve({ action: 'annulla' });
        };
        modal.open();
    });
}
// VII. Richiesta Blocco Ingresso
async function promptIngresso(tp) {
    return new Promise((resolve) => {
        const modal = new tp.obsidian.Modal(tp.app);
        let includeCfr = false;
        let riferimento = "";
        let antifona = "";
        modal.onOpen = () => {
            const { contentEl } = modal;
            contentEl.empty();
            contentEl.createEl("h2", { text: "All'Ingresso" });
            // 1. Toggle per 'Cfr.'
            new tp.obsidian.Setting(contentEl)
                .setName("Includi 'Cfr.'")
                .setDesc("Aggiunge il prefisso 'Cfr.' prima del riferimento biblico.")
                .addToggle(toggle => {
                    toggle.setValue(includeCfr);
                    toggle.onChange(value => includeCfr = value);
                });
            // 2. Campo per Riferimento Biblico
            contentEl.createEl("div", { text: "Riferimento Biblico", style: "font-weight:bold; margin-top:15px;" });
            const rifInput = contentEl.createEl("input", { placeholder: "Es: Dt 32,10-12" });
            rifInput.style.width = "100%";
            rifInput.addEventListener("input", e => riferimento = e.target.value.trim());
            // 3. Campo per Testo Antifona
            contentEl.createEl("div", { text: "Testo dell'antifona", style: "font-weight:bold; margin-top:10px;" });
            const antifonaInput = contentEl.createEl("textarea", { placeholder: "Il Signore la protesse e ne ebbe cura..." });
            antifonaInput.style.width = "100%";
            antifonaInput.style.height = "10em";
            antifonaInput.style.marginBottom = "20px";
            antifonaInput.addEventListener("input", e => antifona = e.target.value.trim());
            // Bottoni
            const buttonContainer = contentEl.createDiv({ cls: "modal-button-container" });
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "flex-end";
            const annullaBtn = buttonContainer.createEl("button", { text: "Annulla" });
            annullaBtn.onclick = () => { modal.close(); resolve({ action: 'annulla' }); };
            const continuaBtn = buttonContainer.createEl("button", { text: "Continua", cls: "mod-cta" });
            continuaBtn.style.marginLeft = "10px";
            continuaBtn.onclick = () => {
                modal.close();
                let formatted = '';
                if (riferimento || antifona) {
                    const cfrPrefix = includeCfr ? "Cfr. " : "";
                    const rifFormatted = riferimento ? `*<span class="BibleRef">[[${riferimento}]]</span>*` : '';
                    const antifonaFormatted = formattaTestoMultiRiga(antifona);
                    formatted += `\n<span class="rb">ALL’INGRESSO</span> ${cfrPrefix}${rifFormatted}<br>\n`;
                    formatted += `<span class="rn">TUTTI:</span> **${antifonaFormatted}**<br>\n`;
                }
                resolve({ action: 'continua', value: formatted });
            };
        };
        modal.onClose = () => {
            resolve({ action: 'annulla' });
        };
        modal.open();
    });
}
// VIII. Richiesta Blocco Inizio Assemblea
async function promptAssemblea(tp) {
    return new Promise((resolve) => {
        const modal = new tp.obsidian.Modal(tp.app);
        let preghiera = "";
        modal.onOpen = () => {
            const { contentEl } = modal;
            contentEl.empty();
            contentEl.createEl("h2", { text: "All'inizio dell'assemblea liturgica" });
            // Campo per la preghiera del Sacerdote
            contentEl.createEl("div", { text: "Testo della preghiera del Sacerdote", style: "font-weight:bold; margin-top:15px;" });
            const preghieraInput = contentEl.createEl("textarea", { placeholder: "Signore Gesù, che hai promesso agli uomini il regno dei cieli..." });
            preghieraInput.style.width = "100%";
            preghieraInput.style.height = "15em";
            preghieraInput.style.marginBottom = "20px";
            preghieraInput.addEventListener("input", e => preghiera = e.target.value.trim());
            preghieraInput.focus();
            // Bottoni
            const buttonContainer = contentEl.createDiv({ cls: "modal-button-container" });
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "flex-end";
            const annullaBtn = buttonContainer.createEl("button", { text: "Annulla" });
            annullaBtn.onclick = () => { modal.close(); resolve({ action: 'annulla' }); };
            const continuaBtn = buttonContainer.createEl("button", { text: "Continua", cls: "mod-cta" });
            continuaBtn.style.marginLeft = "10px";
            continuaBtn.onclick = () => {
                modal.close();
                let formatted = '';
                if (preghiera) {
                    // Sostituisce lo spazio dopo . ! ? con <br> e uno spazio, come richiesto
                    const preghieraFormatted = formattaTestoMultiRiga(preghiera);
                    formatted += `\n<span class="rb">ALL’INIZIO DELL’ASSEMBLEA LITURGICA</span><br>\n`;
                    formatted += `<span class="rn">SACERDOTE:</span> ${preghieraFormatted}<br>\n`;
                    formatted += `<span class="rn">TUTTI:</span> **Amen**<br>\n`;
                }
                resolve({ action: 'continua', value: formatted });
            };
        };
        modal.onClose = () => {
            resolve({ action: 'annulla' });
        };
        modal.open();
    });
}
// IX. Richiesta Liturgia della Parola
async function promptLiturgiaDellaParola(tp, tipoCelebrazione) {
    return new Promise((resolve) => {
        const modal = new tp.obsidian.Modal(tp.app);
        const isMemoria = tipoCelebrazione === "Memoria" || tipoCelebrazione === "Memoria facoltativa";
        // Stato Globale
        let state = {
            giorno: {
                titolo: "Letture del giorno",
                primaLetturaTipo: "LETTURA",
                primaLetturaRif: "",
                primaLetturaIntro: "",
                primaLetturaHeader: "",
                primaLetturaTesto: "",
                salmoRif: "",
                salmoRit: "",
                salmoStanze: "",
                secondaLetturaAttiva: false,
                secondaLetturaRif: "",
                secondaLetturaIntro: "",
                secondaLetturaHeader: "",
                secondaLetturaTesto: "",
                cantoCfr: false,
                cantoRif: "",
                cantoAcclamazione: "Alleluia.",
                cantoVersetto: "",
                vangeloRif: "",
                vangeloHeader: "",
                vangeloTesto: ""
            },
            proprie: {
                titolo: "Letture proprie della memoria",
                attivo: false,
                primaLetturaTipo: "LETTURA",
                primaLetturaRif: "",
                primaLetturaIntro: "",
                primaLetturaHeader: "",
                primaLetturaTesto: "",
                salmoRif: "",
                salmoRit: "",
                salmoStanze: "",
                secondaLetturaAttiva: false,
                secondaLetturaRif: "",
                secondaLetturaIntro: "",
                secondaLetturaHeader: "",
                secondaLetturaTesto: "",
                cantoCfr: false,
                cantoRif: "",
                cantoAcclamazione: "Alleluia.",
                cantoVersetto: "",
                vangeloRif: "",
                vangeloHeader: "",
                vangeloTesto: ""
            }
        };
        // Funzione di rendering principale
        const render = () => {
            const { contentEl } = modal;
            contentEl.empty();
            contentEl.createEl("h2", { text: "Liturgia della Parola" });
            if (isMemoria) {
                new tp.obsidian.Setting(contentEl)
                    .setName("Aggiungi letture proprie della Memoria")
                    .setDesc("Mostra un secondo set di campi per le letture della memoria.")
                    .addToggle(toggle => {
                        toggle.setValue(state.proprie.attivo);
                        toggle.onChange(value => {
                            state.proprie.attivo = value;
                            render();
                        });
                    });
            }
            // Renderizza i campi per le letture del giorno
            renderSet(contentEl, 'giorno');
            // Renderizza i campi per le letture proprie, se attive
            if (isMemoria && state.proprie.attivo) {
                contentEl.createEl("hr");
                renderSet(contentEl, 'proprie');
            }
            // --- Stile e Bottoni Finali ---
            contentEl.style.maxHeight = "70vh";
            contentEl.style.overflowY = "auto";
            contentEl.style.paddingRight = "15px";
            const buttonContainer = contentEl.createDiv({ cls: "modal-button-container" });
            buttonContainer.style.marginTop = "20px";
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "flex-end";
            const annullaBtn = buttonContainer.createEl("button", { text: "Annulla" });
            annullaBtn.onclick = () => { modal.close(); resolve({ action: 'annulla' }); };
            const continuaBtn = buttonContainer.createEl("button", { text: "Continua", cls: "mod-cta" });
            continuaBtn.style.marginLeft = "10px";
            continuaBtn.onclick = () => {
                modal.close();
                let finaleGiorno = buildOutput('giorno');
                let finaleProprie = buildOutput('proprie');
                let formatted = finaleGiorno;
                if (finaleGiorno && finaleProprie) {
                    formatted += `\n***\n\n`;
                }
                if (finaleProprie) {
                    formatted += finaleProprie;
                }
                resolve({ action: 'continua', value: formatted });
            };
        };
        // Funzione che renderizza un SET di campi (giorno o proprie)
        const renderSet = (container, key) => {
            const setState = state[key];
            container.createEl("h3", { text: setState.titolo, style: "color: var(--text-accent);" });
            // --- Prima Lettura ---
            container.createEl("h4", { text: "Prima Lettura" });
            new tp.obsidian.Setting(container)
                .setName("Tipo di lettura")
                .addDropdown(dropdown => {
                    dropdown
                        .addOption("LETTURA", "LETTURA")
                        .addOption("EPISTOLA", "EPISTOLA")
                        .setValue(setState.primaLetturaTipo)
                        .onChange(value => setState.primaLetturaTipo = value);
                });
            creaInput(container, key, 'primaLetturaRif', 'Riferimento Biblico');
            creaTextarea(container, key, 'primaLetturaIntro', 'Testo introduttivo (opzionale)', '2em');
            creaTextarea(container, key, 'primaLetturaHeader', 'Intestazione (es. Lettura della lettera...)', '2em');
            creaTextarea(container, key, 'primaLetturaTesto', 'Testo biblico', '8em');
            // --- Salmo ---
            container.createEl("h4", { text: "Salmo Responsoriale" });
            creaInput(container, key, 'salmoRif', 'Riferimento Biblico');
            creaInput(container, key, 'salmoRit', 'Ritornello (completo, es. R. Il giusto fiorirà...)');
            creaTextarea(container, key, 'salmoStanze', 'Stanze (una per riga, senza ritornello)', '8em');
            // --- Seconda Lettura (condizionale) ---
            new tp.obsidian.Setting(container)
                .setName("Aggiungi Seconda Lettura")
                .addToggle(toggle => {
                    toggle.setValue(setState.secondaLetturaAttiva);
                    toggle.onChange(value => {
                        setState.secondaLetturaAttiva = value;
                        render();
                    });
                });
            if (setState.secondaLetturaAttiva) {
                container.createEl("h4", { text: "Seconda Lettura" });
                creaInput(container, key, 'secondaLetturaRif', 'Riferimento Biblico');
                creaTextarea(container, key, 'secondaLetturaIntro', 'Testo introduttivo (opzionale)', '2em');
                creaTextarea(container, key, 'secondaLetturaHeader', 'Intestazione', '2em');
                creaTextarea(container, key, 'secondaLetturaTesto', 'Testo biblico', '8em');
            }
            // --- Canto al Vangelo ---
            container.createEl("h4", { text: "Canto al Vangelo" });
            new tp.obsidian.Setting(container)
                .setName("Includi 'Cfr.'")
                .addToggle(toggle => {
                    toggle.setValue(setState.cantoCfr);
                    toggle.onChange(value => setState.cantoCfr = value);
                });
            creaInput(container, key, 'cantoRif', 'Riferimento Biblico');
            creaInput(container, key, 'cantoAcclamazione', 'Acclamazione (es. Alleluia.)');
            creaTextarea(container, key, 'cantoVersetto', 'Versetto/i', '4em');
            // --- Vangelo ---
            container.createEl("h4", { text: "Vangelo" });
            creaInput(container, key, 'vangeloRif', 'Riferimento Biblico');
            creaTextarea(container, key, 'vangeloHeader', 'Intestazione (es. Lettura del Vangelo...)', '2em');
            creaTextarea(container, key, 'vangeloTesto', 'Testo del Vangelo', '8em');
        };
        // Funzioni Helper per creare campi
        const creaInput = (container, key, id, label) => {
            container.createEl("div", { text: label, style: "font-weight:bold; margin-top:5px;" });
            const input = container.createEl("input", { value: state[key][id] });
            input.style.width = "100%";
            input.addEventListener("input", e => state[key][id] = e.target.value);
        };
        const creaTextarea = (container, key, id, label, height = '6em') => {
            container.createEl("div", { text: label, style: "font-weight:bold; margin-top:5px;" });
            const textarea = container.createEl("textarea", { text: state[key][id] });
            textarea.style.width = "100%";
            textarea.style.height = height;
            textarea.addEventListener("input", e => state[key][id] = e.target.value);
        };
        // Funzione che costruisce la stringa di output per un set
        const buildOutput = (key) => {
            const data = state[key];
            if (key === 'proprie' && !data.attivo) return "";
            let output = "";
            const hasAnyData = Object.values(data).some(v => (typeof v === 'string' && v.trim() !== "") || (typeof v === 'boolean' && v));
            if (!hasAnyData) return "";
            output += '\n'; // Aggiunge spaziatura prima del blocco intero
            if (isMemoria) {
                output += `<span class="centrato_rosso">${data.titolo}</span><br>\n`;
            }
            const formattaTestoBiblico = (testo) => {
                return formattaTestoMultiRiga(testo);
            }
            // Prima Lettura
            if (data.primaLetturaRif.trim() || data.primaLetturaHeader.trim() || data.primaLetturaTesto.trim()) {
                const rif = data.primaLetturaRif.trim() ? ` *<span class="BibleRef">[[${data.primaLetturaRif.trim()}]]</span>*` : '';
                output += `<span class="rb">${data.primaLetturaTipo}</span>${rif}\n`;
                if (data.primaLetturaIntro.trim()) output += `<span class="piccolo_rosso">${data.primaLetturaIntro.trim().toUpperCase()}</span>\n`;
                if (data.primaLetturaHeader.trim()) output += `**${data.primaLetturaHeader.trim()}**\n`;

                if (data.primaLetturaTesto.trim()) {
                    output += formattaTestoBiblico(data.primaLetturaTesto) + '<br>\n';
                }
                else {
                    output += `<span class="giorno_crb">TESTO BIBLICO MANCANTE</span><br>\n`;
                }
                output += `<span class="destra_rosso">Parola di Dio</span>\n`;
                output += `<span class="rn">TUTTI:</span> **Rendiamo grazie a Dio.**<br>\n`;
            }
            // Salmo
            if (data.salmoRif.trim() || data.salmoRit.trim() || data.salmoStanze.trim()) {
                const rif = data.salmoRif.trim() ? ` *<span class="BibleRef">[[${data.salmoRif.trim()}]]</span>*` : '';
                output += `<span class="rb">SALMO</span>${rif}<br>\n`;
                const ritornelloPulito = data.salmoRit.trim().replace(/^(R\.|A\.)\s*/, '');
                const ritornelloTutti = `**${ritornelloPulito}**`;
                if (ritornelloPulito) {
                    output += `<span class="rn">LETTORE:</span> ${ritornelloPulito}\n`;
                    output += `<span class="rn">TUTTI:</span> ${ritornelloTutti}<br>\n`;
                }
                if (data.salmoStanze.trim()) {
                    const stanze = data.salmoStanze.trim().split('\n').filter(s => s.trim() !== "");
                    stanze.forEach(stanza => {
                        output += `<span class="rn">LETTORE:</span> ${stanza.replace(/\n/g, '<br>')}<br>\n`;
                        if (ritornelloPulito) { // La chiusura (il ritornello) viene ripetuta solo se esiste
                            output += `<span class="rn">TUTTI:</span> ${ritornelloTutti}<br>\n`;
                        }
                    });
                }
                else {
                    // Se le stanze sono vuote, inseriamo il segnaposto
                    output += `<span class="giorno_crb">SALMO MANCANTE</span><br>\n`;
                    // E la "Chiusura SEMPRE" (se il ritornello esiste)
                    if (ritornelloPulito) {
                        output += `<span class="rn">TUTTI:</span> ${ritornelloTutti}<br>\n`;
                    }
                }
            }
            // Seconda Lettura
            if (data.secondaLetturaAttiva && (data.secondaLetturaRif.trim() || data.secondaLetturaHeader.trim() || data.secondaLetturaTesto.trim())) {
                const rif = data.secondaLetturaRif.trim() ? ` *<span class="BibleRef">[[${data.secondaLetturaRif.trim()}]]</span>*` : '';
                output += `<span class="rb">SECONDA LETTURA</span>${rif}\n`;
                if (data.secondaLetturaIntro.trim()) output += `<span class="piccolo_rosso">${data.secondaLetturaIntro.trim().toUpperCase()}</span>\n`;
                if (data.secondaLetturaHeader.trim()) output += `**${data.secondaLetturaHeader.trim()}**\n`;
                if (data.secondaLetturaTesto.trim()) {
                    output += formattaTestoBiblico(data.secondaLetturaTesto) + '<br>\n';
                }
                else {
                    output += `<span class="giorno_crb">TESTO BIBLICO MANCANTE</span><br>\n`;
                }
                output += `<span class="destra_rosso">Parola di Dio</span>\n`;
                output += `<span class="rn">TUTTI:</span> **Rendiamo grazie a Dio.**<br>\n`;
            }
            // Canto al Vangelo
            if (data.cantoRif.trim() || data.cantoVersetto.trim()) {
                const cfr = data.cantoCfr ? 'Cfr. ' : '';
                const rif = data.cantoRif.trim() ? `*<span class="BibleRef">[[${data.cantoRif.trim()}]]</span>*` : '';
                output += `<span class="rb">CANTO AL VANGELO</span> ${cfr}${rif}<br>\n`;
                const acclamazione = `**${data.cantoAcclamazione.trim()}**`;
                output += `<span class="rn">TUTTI:</span> ${acclamazione}\n`;
                output += `<span class="rn">LETTORE:</span> ${data.cantoVersetto.trim().replace(/\n/g, '<br>')}\n`;
                output += `<span class="rn">TUTTI:</span> ${acclamazione}<br>\n`;
            }
            // Vangelo
            if (data.vangeloRif.trim() || data.vangeloHeader.trim() || data.vangeloTesto.trim()) {
                const rif = data.vangeloRif.trim() ? ` *<span class="BibleRef">[[${data.vangeloRif.trim()}]]</span>*` : '';
                output += `<span class="rb">VANGELO</span>${rif}\n`;
                const header = data.vangeloHeader.trim() ? ` ${data.vangeloHeader.trim()}` : '';
                output += `<span class="rn">**✠**</span>**${header}**\n`;
                if (data.vangeloTesto.trim()) {
                    output += formattaTestoBiblico(data.vangeloTesto) + '<br>\n';
                }
                else {
                    output += `<span class="giorno_crb">TESTO EVANGELICO MANCANTE</span><br>\n`;
                }
                output += `<span class="destra_rosso">Parola del Signore</span>\n`;
                output += `<span class="rn">TUTTI:</span> **Lode a te o Cristo.**<br>\n`;
            }
            return output;
        };
        // Inizializza la modale
        modal.onOpen = () => {
            render();
        };
        modal.onClose = () => {
            resolve({ action: 'annulla' });
        };
        modal.open();
    });
}
// X. Richiesta Antifona Dopo il Vangelo
async function promptDopoVangelo(tp) {
    return new Promise((resolve) => {
        const modal = new tp.obsidian.Modal(tp.app);
        let includeCfr = false;
        let riferimenti = "";
        let testoAntifona = "";
        modal.onOpen = () => {
            const { contentEl } = modal;
            contentEl.empty();
            contentEl.createEl("h2", { text: "Antifona dopo il Vangelo" });
            // 1. Toggle per 'Cfr.'
            new tp.obsidian.Setting(contentEl)
                .setName("Includi 'Cfr.'")
                .addToggle(toggle => {
                    toggle.setValue(includeCfr);
                    toggle.onChange(value => includeCfr = value);
                });
            // 2. Campo per Riferimenti Biblici e testo extra
            contentEl.createEl("div", { text: "Riferimenti Biblici e testo extra (opzionale)", style: "font-weight:bold; margin-top:15px;" });
            const rifInput = contentEl.createEl("input", { placeholder: "Es: *[[Sal 20,4]]*; *[[Gb 31,18]]*" });
            rifInput.style.width = "100%";
            rifInput.addEventListener("input", e => riferimenti = e.target.value.trim());
            // 3. Campo per Testo Antifona
            contentEl.createEl("div", { text: "Testo dell'antifona di TUTTI", style: "font-weight:bold; margin-top:10px;" });
            const antifonaInput = contentEl.createEl("textarea", { placeholder: "Mi sei venuto incontro, o Dio..." });
            antifonaInput.style.width = "100%";
            antifonaInput.style.height = "10em";
            antifonaInput.style.marginBottom = "20px";
            antifonaInput.addEventListener("input", e => testoAntifona = e.target.value.trim());
            // Bottoni
            const buttonContainer = contentEl.createDiv({ cls: "modal-button-container" });
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "flex-end";
            const annullaBtn = buttonContainer.createEl("button", { text: "Annulla" });
            annullaBtn.onclick = () => { modal.close(); resolve({ action: 'annulla' }); };
            const continuaBtn = buttonContainer.createEl("button", { text: "Continua", cls: "mod-cta" });
            continuaBtn.style.marginLeft = "10px";
            continuaBtn.onclick = () => {
                modal.close();
                let formatted = '';
                if (testoAntifona) {
                    const cfrPrefix = includeCfr ? "Cfr. " : "";
                    const antifonaFormatted = formattaTestoMultiRiga(testoAntifona);
                    formatted += `\n<span class="rb">DOPO IL VANGELO</span> ${cfrPrefix}${riferimenti}<br>\n`;
                    formatted += `<span class="rn">TUTTI:</span> **${antifonaFormatted}**<br>\n`;
                }
                resolve({ action: 'continua', value: formatted });
            };
        };
        modal.onClose = () => {
            resolve({ action: 'annulla' });
        };
        modal.open();
    });
}
// XI. Richiesta Preghiera dei Fedeli
async function promptPreghieraDeiFedeli(tp) {
    return new Promise((resolve) => {
        const modal = new tp.obsidian.Modal(tp.app);
        let invocazione = "";
        let intenzioni = "";
        const staticHeader = `\n<span class="rb">PREGHIERA DEI FEDELI</span>\n<span class="piccolo_rosso">Introduzione del sacerdote.</span><br>\n<span class="pn">Se chi presiede non ha enunciato la risposta alla Preghiera dei fedeli, può farlo il lettore, invitando in questo o modo simile:</span>\n<span class="rn">LETTORE:</span> Alla Preghiera dei fedeli, rispondiamo insieme: `;
        modal.onOpen = () => {
            const { contentEl } = modal;
            contentEl.empty();
            contentEl.createEl("h2", { text: "Preghiera dei Fedeli" });
            // 1. Campo per Invocazione/Risposta
            contentEl.createEl("div", { text: "Invocazione / Risposta", style: "font-weight:bold; margin-top:15px;" });
            const invInput = contentEl.createEl("input", { placeholder: "Es: Ascoltaci, Padre buono" });
            invInput.style.width = "100%";
            invInput.addEventListener("input", e => invocazione = e.target.value.trim());
            // 2. Campo per le intenzioni
            contentEl.createEl("div", { text: "Intenzioni (una per riga)", style: "font-weight:bold; margin-top:10px;" });
            const intInput = contentEl.createEl("textarea", { placeholder: "Tu che sei giusto verso tutti, noi ti affidiamo il nostro desiderio che...\nTu che prepari il tuo regno, davanti a te noi ricordiamo quanti..." });
            intInput.style.width = "100%";
            intInput.style.height = "15em";
            intInput.style.marginBottom = "20px";
            intInput.addEventListener("input", e => intenzioni = e.target.value); // Mantiene i newline
            // Bottoni
            const buttonContainer = contentEl.createDiv({ cls: "modal-button-container" });
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "flex-end";
            const annullaBtn = buttonContainer.createEl("button", { text: "Annulla" });
            annullaBtn.onclick = () => { modal.close(); resolve({ action: 'annulla' }); };
            const continuaBtn = buttonContainer.createEl("button", { text: "Continua", cls: "mod-cta" });
            continuaBtn.style.marginLeft = "10px";
            continuaBtn.onclick = () => {
                modal.close();
                let formatted = '';
                if (invocazione || intenzioni) {
                    formatted += staticHeader;
                    const invocazionePulita = invocazione.replace(/[.,]$/, ''); // Rimuove punto/virgola alla fine
                    const invocazioneLettore = `*${invocazionePulita}.*`;
                    const invocazioneTutti = `**${invocazionePulita}.**`;
                    formatted += `${invocazioneLettore}\n`;
                    formatted += `<span class="rn">TUTTI:</span> ${invocazioneTutti}<br>\n`;
                    const stanze = intenzioni.trim().split('\n').filter(s => s.trim() !== "");
                    stanze.forEach(stanza => {
                        // Rimuove ", ti preghiamo" se l'utente lo ha inserito per errore
                        const intenzioneFormattata = formattaTestoMultiRiga(stanza.trim().replace(/, ti preghiamo\.?$/i, ''));
                        formatted += `<span class="rn">LETTORE:</span> ${intenzioneFormattata}, ti preghiamo.\n`;
                        formatted += `<span class="rn">TUTTI:</span> ${invocazioneTutti}<br>\n`;
                    });
                }
                resolve({ action: 'continua', value: formatted });
            };
        };
        modal.onClose = () => {
            resolve({ action: 'annulla' });
        };
        modal.open();
    });
}
// XII. Richiesta A Conclusione della Liturgia della Parola
async function promptConclusioneLiturgia(tp) {
    return new Promise((resolve) => {
        const modal = new tp.obsidian.Modal(tp.app);
        let preghiera = "";
        modal.onOpen = () => {
            const { contentEl } = modal;
            contentEl.empty();
            contentEl.createEl("h2", { text: "A Conclusione della Liturgia della Parola" });
            // Campo per la preghiera del Sacerdote
            contentEl.createEl("div", { text: "Testo della preghiera del Sacerdote", style: "font-weight:bold; margin-top:15px;" });
            const preghieraInput = contentEl.createEl("textarea", { placeholder: "O Dio, che apri le porte del tuo regno agli umili..." });
            preghieraInput.style.width = "100%";
            preghieraInput.style.height = "15em";
            preghieraInput.style.marginBottom = "20px";
            preghieraInput.addEventListener("input", e => preghiera = e.target.value.trim());
            preghieraInput.focus();
            // Bottoni
            const buttonContainer = contentEl.createDiv({ cls: "modal-button-container" });
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "flex-end";
            const annullaBtn = buttonContainer.createEl("button", { text: "Annulla" });
            annullaBtn.onclick = () => { modal.close(); resolve({ action: 'annulla' }); };
            const continuaBtn = buttonContainer.createEl("button", { text: "Continua", cls: "mod-cta" });
            continuaBtn.style.marginLeft = "10px";
            continuaBtn.onclick = () => {
                modal.close();
                let formatted = '';
                if (preghiera) {
                    const preghieraFormatted = formattaTestoMultiRiga(preghiera);
                    formatted += `\n<span class="rb">A CONCLUSIONE DELLA LITURGIA DELLA PAROLA</span><br>\n`;
                    formatted += `<span class="rn">SACERDOTE:</span> ${preghieraFormatted}<br>\n`;
                    formatted += `<span class="rn">TUTTI:</span> **Amen**<br>\n`;
                }
                resolve({ action: 'continua', value: formatted });
            };
        };
        modal.onClose = () => {
            resolve({ action: 'annulla' });
        };
        modal.open();
    });
}
// XIII. Richiesta Sui Doni
async function promptSuiDoni(tp) {
    return new Promise((resolve) => {
        const modal = new tp.obsidian.Modal(tp.app);
        let preghiera = "";
        modal.onOpen = () => {
            const { contentEl } = modal;
            contentEl.empty();
            contentEl.createEl("h2", { text: "Sui Doni" });
            contentEl.createEl("div", { text: "Testo della preghiera del Sacerdote", style: "font-weight:bold; margin-top:15px;" });
            const preghieraInput = contentEl.createEl("textarea", { placeholder: "O Dio, mirabile nei tuoi santi, accogli questi doni..." });
            preghieraInput.style.width = "100%";
            preghieraInput.style.height = "15em";
            preghieraInput.style.marginBottom = "20px";
            preghieraInput.addEventListener("input", e => preghiera = e.target.value.trim());
            preghieraInput.focus();
            const buttonContainer = contentEl.createDiv({ cls: "modal-button-container" });
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "flex-end";
            const annullaBtn = buttonContainer.createEl("button", { text: "Annulla" });
            annullaBtn.onclick = () => { modal.close(); resolve({ action: 'annulla' }); };
            const continuaBtn = buttonContainer.createEl("button", { text: "Continua", cls: "mod-cta" });
            continuaBtn.style.marginLeft = "10px";
            continuaBtn.onclick = () => {
                modal.close();
                let formatted = '';
                if (preghiera) {
                    const preghieraFormatted = formattaTestoMultiRiga(preghiera);
                    formatted += `\n<span class="rb">SUI DONI</span><br>\n`;
                    formatted += `<span class="rn">SACERDOTE:</span> ${preghieraFormatted}<br>\n`;
                    formatted += `<span class="rn">TUTTI:</span> **Amen**<br>\n`;
                }
                resolve({ action: 'continua', value: formatted });
            };
        };
        modal.onClose = () => {
            resolve({ action: 'annulla' });
        };
        modal.open();
    });
}
// XIV. Richiesta Prefazio
async function promptPrefazio(tp) {
    return new Promise((resolve) => {
        const modal = new tp.obsidian.Modal(tp.app);
        let preghiera = "";
        modal.onOpen = () => {
            const { contentEl } = modal;
            contentEl.empty();
            contentEl.createEl("h2", { text: "Prefazio" });
            contentEl.createEl("div", { text: "Testo del Prefazio (fino alla conclusione prima del Santo)", style: "font-weight:bold; margin-top:15px;" });
            const preghieraInput = contentEl.createEl("textarea", { placeholder: "È veramente cosa buona e giusta..." });
            preghieraInput.style.width = "100%";
            preghieraInput.style.height = "15em";
            preghieraInput.style.marginBottom = "20px";
            preghieraInput.addEventListener("input", e => preghiera = e.target.value.trim());
            preghieraInput.focus();
            const buttonContainer = contentEl.createDiv({ cls: "modal-button-container" });
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "flex-end";
            const annullaBtn = buttonContainer.createEl("button", { text: "Annulla" });
            annullaBtn.onclick = () => { modal.close(); resolve({ action: 'annulla' }); };
            const continuaBtn = buttonContainer.createEl("button", { text: "Continua", cls: "mod-cta" });
            continuaBtn.style.marginLeft = "10px";
            continuaBtn.onclick = () => {
                modal.close();
                let formatted = '';
                if (preghiera) {
                    const preghieraFormatted = formattaTestoMultiRiga(preghiera);
                    formatted += `\n<span class="rb">PREFAZIO</span><br>\n`;
                    formatted += `<span class="rn">SACERDOTE:</span> ${preghieraFormatted}\n`;
                    formatted += `**Santo...**<br>\n`;
                }
                resolve({ action: 'continua', value: formatted });
            };
        };
        modal.onClose = () => {
            resolve({ action: 'annulla' });
        };
        modal.open();
    });
}
// XV. Richiesta Allo Spezzare del Pane
async function promptSpezzarePane(tp) {
    return new Promise((resolve) => {
        const modal = new tp.obsidian.Modal(tp.app);
        let riferimento = "";
        let antifona = "";
        modal.onOpen = () => {
            const { contentEl } = modal;
            contentEl.empty();
            contentEl.createEl("h2", { text: "Allo Spezzare del Pane" });
            // 1. Campo per Riferimento Biblico (opzionale)
            contentEl.createEl("div", { text: "Riferimento Biblico (opzionale, senza parentesi)", style: "font-weight:bold; margin-top:15px;" });
            const rifInput = contentEl.createEl("input", { placeholder: "Es: Es 23,20-21" });
            rifInput.style.width = "100%";
            rifInput.addEventListener("input", e => riferimento = e.target.value.trim());
            // 2. Campo per Testo Antifona
            contentEl.createEl("div", { text: "Testo dell'antifona di TUTTI", style: "font-weight:bold; margin-top:10px;" });
            const antifonaInput = contentEl.createEl("textarea", { placeholder: "Per te mi conservo pura..." });
            antifonaInput.style.width = "100%";
            antifonaInput.style.height = "10em";
            antifonaInput.style.marginBottom = "20px";
            antifonaInput.addEventListener("input", e => antifona = e.target.value.trim());
            antifonaInput.focus();
            // Bottoni
            const buttonContainer = contentEl.createDiv({ cls: "modal-button-container" });
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "flex-end";
            const annullaBtn = buttonContainer.createEl("button", { text: "Annulla" });
            annullaBtn.onclick = () => { modal.close(); resolve({ action: 'annulla' }); };
            const continuaBtn = buttonContainer.createEl("button", { text: "Continua", cls: "mod-cta" });
            continuaBtn.style.marginLeft = "10px";
            continuaBtn.onclick = () => {
                modal.close();
                let formatted = '';
                if (riferimento || antifona) {
                    const rifFormatted = riferimento ? ` *<span class="BibleRef">[[${riferimento}]]</span>*` : '';
                    const antifonaFormatted = formattaTestoMultiRiga(antifona);
                    formatted += `\n<span class="rb">ALLO SPEZZARE DEL PANE</span>${rifFormatted}<br>\n`;
                    formatted += `<span class="rn">TUTTI:</span> **${antifonaFormatted}**<br>\n`;
                }
                resolve({ action: 'continua', value: formatted });
            };
        };
        modal.onClose = () => {
            resolve({ action: 'annulla' });
        };
        modal.open();
    });
}
// XVI. Richiesta Alla Comunione
async function promptAllaComunione(tp) {
    return new Promise((resolve) => {
        const modal = new tp.obsidian.Modal(tp.app);
        let includeCfr = false;
        let riferimenti = "";
        let testoAntifona = "";
        modal.onOpen = () => {
            const { contentEl } = modal;
            contentEl.empty();
            contentEl.createEl("h2", { text: "Alla Comunione" });
            // 1. Toggle per 'Cfr.'
            new tp.obsidian.Setting(contentEl)
                .setName("Includi 'Cfr.'")
                .addToggle(toggle => {
                    toggle.setValue(includeCfr);
                    toggle.onChange(value => includeCfr = value);
                });
            // 2. Campo per Riferimenti Biblici
            contentEl.createEl("div", { text: "Riferimenti Biblici e testo extra (opzionale)", style: "font-weight:bold; margin-top:15px;" });
            const rifInput = contentEl.createEl("input", { placeholder: "Es: *[[Sal 30,20]]*; *[[Eb 9,15]]*" });
            rifInput.style.width = "100%";
            rifInput.addEventListener("input", e => riferimenti = e.target.value.trim());
            // 3. Campo per Testo Antifona
            contentEl.createEl("div", { text: "Testo dell'antifona di TUTTI", style: "font-weight:bold; margin-top:10px;" });
            const antifonaInput = contentEl.createEl("textarea", { placeholder: "Quanto è grande, o Dio, la misura della tua dolcezza..." });
            antifonaInput.style.width = "100%";
            antifonaInput.style.height = "10em";
            antifonaInput.style.marginBottom = "20px";
            antifonaInput.addEventListener("input", e => testoAntifona = e.target.value.trim());
            antifonaInput.focus();
            // Bottoni
            const buttonContainer = contentEl.createDiv({ cls: "modal-button-container" });
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "flex-end";
            const annullaBtn = buttonContainer.createEl("button", { text: "Annulla" });
            annullaBtn.onclick = () => { modal.close(); resolve({ action: 'annulla' }); };
            const continuaBtn = buttonContainer.createEl("button", { text: "Continua", cls: "mod-cta" });
            continuaBtn.style.marginLeft = "10px";
            continuaBtn.onclick = () => {
                modal.close();
                let formatted = '';
                // Il blocco viene creato solo se è presente l'antifona.
                if (testoAntifona) {
                    let extraPart = '';
                    if (riferimenti) {
                        extraPart = includeCfr ? ` Cfr. ${riferimenti}` : ` ${riferimenti}`;
                    }
                    const antifonaFormatted = formattaTestoMultiRiga(testoAntifona);
                    formatted += `\n<span class="rb">ALLA COMUNIONE</span>${extraPart}<br>\n`;
                    formatted += `<span class="rn">TUTTI:</span> **${antifonaFormatted}**<br>\n`;
                }
                resolve({ action: 'continua', value: formatted });
            };
        };
        modal.onClose = () => {
            resolve({ action: 'annulla' });
        };
        modal.open();
    });
}
// XVII. Richiesta Dopo la Comunione
async function promptDopoComunione(tp) {
    return new Promise((resolve) => {
        const modal = new tp.obsidian.Modal(tp.app);
        let preghiera = "";
        modal.onOpen = () => {
            const { contentEl } = modal;
            contentEl.empty();
            contentEl.createEl("h2", { text: "Dopo la Comunione" });
            contentEl.createEl("div", { text: "Testo della preghiera del Sacerdote", style: "font-weight:bold; margin-top:15px;" });
            const preghieraInput = contentEl.createEl("textarea", { placeholder: "La comunione al tuo sacramento accenda in noi, o Padre..." });
            preghieraInput.style.width = "100%";
            preghieraInput.style.height = "15em";
            preghieraInput.style.marginBottom = "20px";
            preghieraInput.addEventListener("input", e => preghiera = e.target.value.trim());
            preghieraInput.focus();
            const buttonContainer = contentEl.createDiv({ cls: "modal-button-container" });
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "flex-end";
            const annullaBtn = buttonContainer.createEl("button", { text: "Annulla" });
            annullaBtn.onclick = () => { modal.close(); resolve({ action: 'annulla' }); };
            const continuaBtn = buttonContainer.createEl("button", { text: "Continua", cls: "mod-cta" });
            continuaBtn.style.marginLeft = "10px";
            continuaBtn.onclick = () => {
                modal.close();
                let formatted = '';
                if (preghiera) {
                    const preghieraFormatted = formattaTestoMultiRiga(preghiera);
                    formatted += `\n<span class="rb">DOPO LA COMUNIONE</span><br>\n`;
                    formatted += `<span class="rn">SACERDOTE:</span> ${preghieraFormatted}<br>\n`;
                    formatted += `<span class="rn">TUTTI:</span> **Amen**<br>\n`;
                }
                resolve({ action: 'continua', value: formatted });
            };
        };
        modal.onClose = () => {
            resolve({ action: 'annulla' });
        };
        modal.open();
    });
}
// XVIII. Richiesta Meditazione
async function promptMeditazione(tp, tipoCelebrazione) {
    return new Promise((resolve) => {
        const modal = new tp.obsidian.Modal(tp.app);
        const isMemoria = tipoCelebrazione === "Memoria" || tipoCelebrazione === "Memoria facoltativa";
        let state = {
            giorno: { sottotitolo: "", testo: "" },
            proprie: { attivo: false, sottotitolo: "sulle letture proprie della memoria", testo: "" }
        };
        const buildSection = (container, key, titolo, placeholderSottotitolo, placeholderTesto) => {
            container.createEl("h4", { text: titolo, style: "color: var(--text-accent); margin-top: 15px;" });
            container.createEl("div", { text: "Sottotitolo (opzionale)", style: "font-weight:bold;" });
            const subInput = container.createEl("input", { placeholder: placeholderSottotitolo, value: state[key].sottotitolo });
            subInput.style.width = "100%";
            subInput.addEventListener("input", e => state[key].sottotitolo = e.target.value);
            container.createEl("div", { text: "Testo della meditazione", style: "font-weight:bold; margin-top: 10px;" });
            const testoInput = container.createEl("textarea", { placeholder: placeholderTesto, text: state[key].testo });
            testoInput.style.width = "100%";
            testoInput.style.height = "12em";
            testoInput.addEventListener("input", e => state[key].testo = e.target.value);
        };
        const render = () => {
            const { contentEl } = modal;
            contentEl.empty();
            contentEl.createEl("h2", { text: "Meditazione" });
            buildSection(contentEl, 'giorno', "Meditazione principale", "Es: sulle letture del giorno", "Incolla qui il testo della meditazione...");
            if (isMemoria) {
                new tp.obsidian.Setting(contentEl)
                    .setName("Aggiungi meditazione per le letture proprie")
                    .setDesc("Mostra un secondo campo per la meditazione legata alla memoria.")
                    .addToggle(toggle => {
                        toggle.setValue(state.proprie.attivo).onChange(value => {
                            state.proprie.attivo = value;
                            render();
                        });
                    });
                if (state.proprie.attivo) {
                    contentEl.createEl("hr");
                    buildSection(contentEl, 'proprie', "Meditazione per le letture proprie", "sulle letture proprie della memoria", "Incolla qui il testo della seconda meditazione...");
                }
            }
            contentEl.style.maxHeight = "70vh";
            contentEl.style.overflowY = "auto";
            contentEl.style.paddingRight = "15px";
            const buttonContainer = contentEl.createDiv({ cls: "modal-button-container" });
            buttonContainer.style.marginTop = "20px";
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "flex-end";
            const annullaBtn = buttonContainer.createEl("button", { text: "Annulla" });
            annullaBtn.onclick = () => { modal.close(); resolve({ action: 'annulla' }); };
            const continuaBtn = buttonContainer.createEl("button", { text: "Continua", cls: "mod-cta" });
            continuaBtn.style.marginLeft = "10px";
            continuaBtn.onclick = () => {
                modal.close();
                const buildOutput = (key) => {
                    const data = state[key];
                    const testo = data.testo.trim();
                    if (!testo) return '';
                    let output = '\n\n***\n\n\n<span class="cri">MEDITAZIONE</span>';
                    const sottotitolo = data.sottotitolo.trim();
                    if (sottotitolo) {
                        output += `<span class="centrato_rosso">${sottotitolo}</span>`;
                    }
                    output += '<br>\n';
                    output += formattaTestoMultiRiga(testo);
                    output += '\n\n\n***\n\n\n';
                    return output;
                };
                let formatted = buildOutput('giorno');
                if (isMemoria && state.proprie.attivo) {
                    formatted += buildOutput('proprie');
                }
                resolve({ action: 'continua', value: formatted });
            };
        };
        modal.onOpen = render;
        modal.onClose = () => resolve({ action: 'annulla' });
        modal.open();
    });
}
async function promptPersonalizzato(tp, { titolo, placeholder, valoreIniziale = "" }) {
    return new Promise((resolve) => {
        const modal = new tp.obsidian.Modal(tp.app);
        let value = valoreIniziale;
        let resolved = false;
        const doResolve = (action, val) => {
            if (resolved) return;
            resolved = true;
            modal.close();
            resolve({ action, value: val });
        };
        modal.onOpen = () => {
            const { contentEl } = modal;
            contentEl.empty();
            contentEl.createEl("h2", { text: titolo });
            const inputEl = contentEl.createEl("input", {
                type: "text",
                placeholder: placeholder,
                value: valoreIniziale
            });
            inputEl.style.width = "100%";
            inputEl.style.marginBottom = "20px";
            inputEl.focus();
            inputEl.addEventListener("input", (e) => { value = e.target.value; });
            inputEl.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    doResolve('continua', value);
                }
            });
            const buttonContainer = contentEl.createDiv({ cls: "modal-button-container" });
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "space-between";
            // Pulsante a sinistra
            const annullaBtn = buttonContainer.createEl("button", { text: "Annulla" });
            annullaBtn.onclick = () => doResolve('annulla', value);
            // Contenitore per pulsanti a destra
            const rightButtons = buttonContainer.createDiv();
            rightButtons.style.display = "flex";
            const cancellaBtn = rightButtons.createEl("button", { text: "Cancella" });
            cancellaBtn.style.marginRight = "10px";
            cancellaBtn.onclick = () => {
                value = "";
                inputEl.value = "";
                inputEl.focus();
            };
            const continuaBtn = rightButtons.createEl("button", { text: "Continua", cls: "mod-cta" });
            continuaBtn.onclick = () => doResolve('continua', value);
        };
        modal.onClose = () => {
            doResolve('annulla', ''); // Risolve come 'annulla' se la modale viene chiusa con Esc
        };
        modal.open();
    });
}
function mostraNotificaPersonalizzata(messaggio, tipo = "successo", durataSec = 5) {
    // Trasforma i secondi passati (es. 2 o 8) in millisecondi (2000 o 8000)
    const n = new Notice(messaggio, durataSec * 1000);
    // Iniezione diretta degli stili sull'elemento DOM
    const el = n.noticeEl;
    // Colori in base al tipo
    const coloreVerde = "rgb(126, 163, 5)";
    const coloreRosso = "#ff4444";
    const coloreGiallo = "#ffcc00"; // Giallo deciso per "attenzione"
    let coloreBordo;
    if (tipo === "errore") {
        coloreBordo = coloreRosso;
    }
    else if (tipo === "attenzione") {
        coloreBordo = coloreGiallo;
    }
    else {
        coloreBordo = coloreVerde;
    }
    // --- STILE CORRETTO PER BORDI PERFETTI ---
    // Usiamo il colore del tema per lo sfondo invece di lasciarlo vuoto
    el.style.backgroundColor = "var(--background-primary)";
    el.style.backgroundImage = "none";
    // Assicuriamo che il bordo sia disegnato correttamente
    el.style.border = `2px solid ${coloreBordo}`;
    el.style.borderRadius = "8px"; // Arrotonda leggermente per evitare tagli netti
    el.style.boxShadow = "0 4px 10px rgba(0,0,0,0.5)"; // Ombra più marcata per staccare dal fondo
    el.style.boxSizing = "border-box"; // Garantisce che il bordo sia incluso nel calcolo dello spazio
    // FIX: Impedisce al bordo di sparire a sinistra durante lo scale
    el.style.display = "block";
    el.style.color = "white";
    el.style.filter = "none";
    el.style.fontFamily = "monospace";
    el.style.fontSize = "1.2em"; // Ingrandimento testo
    el.style.fontWeight = "600";
    el.style.marginLeft = "20px";
    el.style.opacity = "1";
    el.style.overflow = "visible";
    el.style.padding = "20px";
    // Ridotto leggermente lo scale per evitare collisioni con i bordi dello schermo
    el.style.transform = "scale(1.1)";
    el.style.transformOrigin = "top right"; // Leggero ingrandimento box
    el.style.whiteSpace = "pre-wrap"; // Fondamentale per vedere i \n (a capo)
    // Forza il colore del testo per tutti i figli interni (se presenti)
    const coloreTesto = "white";
    el.querySelectorAll('*').forEach(child => {
        child.style.color = coloreTesto;
    });
}