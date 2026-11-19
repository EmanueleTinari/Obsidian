// Questa è da far girare nella Console di Obsidian.
// Prende i dati dal file json dei prodotti di Esselunga (03-prodotti-grezzi.json)
// e crea un nuovo json (04-prodotti-dettaglio.json) contenente per ogni articolo il codice a barre, le kCal e il link alla foto.
// Inizialmente il test verrà effettuato su UNA SOLA CATEGORIA (pasta).
(async () => {
    console.log("Avvio PASSO 3: Scraping del Barcode e KCal per ogni prodotto...");
    // 1. CARICAMENTO DEI PRODOTTI GREZZI DAL VAULT
    const percorsoInput = "_00-EsselungaScraper/03-prodotti-grezzi.json";
    const fileInput = app.vault.getAbstractFileByPath(percorsoInput);
    if (!fileInput) {
        console.error(`Errore: Il file '${percorsoInput}' non esiste nel Vault!`);
        return;
    }
    const testoInput = await app.vault.read(fileInput);
    const prodottiGrezzi = JSON.parse(testoInput);
    const netFetch = require('electron').remote ? require('electron').remote.net.fetch : require('electron').net.fetch;
    let prodottiFinali = [];
    console.log(`Trovati ${prodottiGrezzi.length} prodotti da elaborare. Inizio ciclo...`);
    // Funzione interna per estrarre le calorie dal blocco HTML dei valori nutrizionali
    function estraiCalorie(arrayInformazioni) {
        if (!arrayInformazioni || arrayInformazioni.length === 0) return null;
        // Cerca il blocco che contiene i valori nutrizionali
        const bloccoNutrizionale = arrayInformazioni.find(info => info.label && info.label.toLowerCase().includes("nutrizionali"));
        if (!bloccoNutrizionale || !bloccoNutrizionale.value) return null;
        const htmlTabella = bloccoNutrizionale.value;
        // Regex chirurgica per cercare il numero che precede la scritta "kcal" nella tabella
        const matchKcal = htmlTabella.match(/(\d+)\s*k_?cal/i);
        if (matchKcal && matchKcal[1]) {
            // Restituisce il numero puro (es. 356)
            return Number(matchKcal[1]);
        }
        return null;
    }
    // 2. LOOP DI ESTRAZIONE DETTAGLI PRODOTTI RIGA PER RIGA
    let contatore = 0;
    for (const prod of prodottiGrezzi) {
        contatore++;
        console.log(`[${contatore}/${prodottiGrezzi.length}] Richiesta dettagli per: ${prod.description}`);
        try {
            // Interroghiamo l'endpoint del singolo prodotto usando il suo codice numerico
            const response = await netFetch(`https://spesaonline.esselunga.it/commerce/resources/displayable/detail/code/${prod.code}`, {
                "credentials": "include",
                "method": "GET",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:159.0) Gecko/20100101 Firefox/159.0",
                    "Accept": "application/json, text/plain, */*",
                    "X-PAGE-PATH": "supermercato"
                },
                "referrer": `https://spesaonline.esselunga.it/commerce/nav/supermercato/store/prodotto/${prod.code}/${prod.sanitizeDescription}`
            });
            if (!response.ok) {
                console.error(` ❌ Impossibile recuperare dettagli per codice ${prod.code}. Stato: ${response.status}`);
                // In caso di errore manteniamo il prodotto base senza barcode/kcal per non perdere la riga
                prodottiFinali.push(prod);
                continue;
            }
            const payloadSingolo = await response.json();
            const datiDettaglio = payloadSingolo.displayableProduct || {};
            // Estrazione a cascata dell'URL dell'immagine (Big -> Medium -> Small -> Fallback)
            let urlFotoTrovata = null;
            if (datiDettaglio.images && datiDettaglio.images.length > 0) {
                const primaImmagine = datiDettaglio.images[0]; // Isola il primo oggetto d'immagine dell'array
                if (primaImmagine.big) {
                    urlFotoTrovata = primaImmagine.big;
                }
                else if (primaImmagine.medium) {
                    urlFotoTrovata = primaImmagine.medium;
                }
                else if (primaImmagine.small) {
                    urlFotoTrovata = primaImmagine.small;
                }
                else {
                    urlFotoTrovata = datiDettaglio.imageURL || null;
                }
            }
            else {
                // Fallback estremo se l'array images è vuoto
                urlFotoTrovata = datiDettaglio.imageURL || null;
            }
            // Assegnazione della colonna per il CSV finale
            prod.url_foto_master = urlFotoTrovata;
            // 3. AGGANCIO DEI DATI MANCANTI SULL'OGGETTO ORIGINALE
            prod.barcode = datiDettaglio.barcode || null; // Sovrascriviamo il 'null' precedente col barcode reale
            prod.kcal_100g = estraiCalorie(payloadSingolo.informations); // Estraiamo le calorie pulite via Regex
            prodottiFinali.push(prod);
            console.log(`    ✅ Barcode: ${prod.barcode} | KCal: ${prod.kcal_100g} | URL Foto: ${prod.url_foto_master}`);
            console.log(`prodotto ${contatore} di ${prodottiGrezzi.length} di prodotti`);
        }
        catch (err) {
            console.error(` ❌ Errore durante la chiamata per codice ${prod.code}:`, err.message);
            prodottiFinali.push(prod);
        }
        // Pausa precauzionale anti-ban di 300 millisecondi prima del prossimo prodotto
        await new Promise(res => setTimeout(res, 300));
    }
    // 4. SALVATAGGIO DEL FILE DETTAGLIO PRODOTTI NEL VAULT
    const percorsoOutput = "_00-EsselungaScraper/04-prodotti-dettaglio.json";
    const stringaJsonFinale = JSON.stringify(prodottiFinali, null, 2);
    try {
        const fileEsistente = app.vault.getAbstractFileByPath(percorsoOutput);
        if (fileEsistente) {
            await app.vault.modify(fileEsistente, stringaJsonFinale);
            console.log(`\n[SUCCESSO] File '${percorsoOutput}' AGGIORNATO nel Vault con Barcode e KCal!`);
        }
        else {
            await app.vault.create(percorsoOutput, stringaJsonFinale);
            console.log(`\n[SUCCESSO] File '${percorsoOutput}' CREATO nel Vault con Barcode e KCal!`);
        }
    }
    catch (saveErr) {
        console.error("Errore durante il salvataggio del file arricchito:", saveErr);
    }
})();
