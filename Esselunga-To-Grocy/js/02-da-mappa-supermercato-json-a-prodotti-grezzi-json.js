// Questa è da far girare nella Console di Obsidian.
// Prende i dati dal file json delle categorie PULITE di Esselunga (mappa_supermercato.json)
// e crea un nuovo json (prodotti_grezzi.json) contenente già gli articoli per le categorie estratti dal file.
// Inizialmente il test verrà effettuato su UNA SOLA CATEGORIA (pasta).
(async () => {
    console.log("Avvio PASSO 2: Estrazione massiva prodotti...");
    // 1. CARICAMENTO DELLA MAPPA CATEGORIE DAL VAULT
    const percorsoMappa = "_00-EsselungaScraper/02-mappa-supermercato.json";
    const fileMappa = app.vault.getAbstractFileByPath(percorsoMappa);
    if (!fileMappa) {
        console.error(`Errore: Il file '${percorsoMappa}' non esiste nel Vault!`);
        return;
    }
    const testoMappa = await app.vault.read(fileMappa);
    // Requisito di rete desktop Electron
    const netFetch = require('electron').remote ? require('electron').remote.net.fetch : require('electron').net.fetch;
    // Array globale dove accumuleremo tutti i prodotti estratti
    let tuttiIProdottiGrezzi = [];
    const mappaCategorie = JSON.parse(testoMappa);
    // 2. LOOP SULLE CATEGORIE (Gira su 1 nel test, su 850 nella realtà)
    for (const [idCategoria, info] of Object.entries(mappaCategorie)) {
        if (!info.productSetIds || info.productSetIds.length === 0) continue;
        console.log(`\n[ELABORAZIONE] Corsia: ${info.struttura_gerarchica}`);
        let start = 0;
        // Dimensione blocco per alleggerire la memoria
        let length = 100;
        let continuaPaginazione = true;
        // 3. SOTTO-CICLO DINAMICO PER GESTIRE LA PAGINAZIONE (rowCount)
        while (continuaPaginazione) {
            console.log(` -> Richiesta prodotti da indice ${start} a ${start + length}...`);
            try {
                const response = await netFetch("https://spesaonline.esselunga.it/commerce/resources/displayable/productset", {
                    "credentials": "include",
                    "method": "POST",
                    "headers": {
                        "Accept": "application/json, text/plain, */*",
                        "Content-Type": "application/json;charset=utf-8",
                        "X-PAGE-PATH": "supermercato",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:159.0) Gecko/20100101 Firefox/159.0"
                    },
                    "referrer": `https://spesaonline.esselunga.it/commerce/nav/supermercato/store/menu/${info.menuItemId}/${info.tag_pulito}`,
                    "body": JSON.stringify({
                        "productSetIds": info.productSetIds.map(Number),
                        "start": Number(start),
                        "length": Number(length),
                        "sort": null,
                        "filters": [],
                        "menuItemId": Number(info.menuItemId),
                        "rmtCookieAllowed": false
                    })
                });
                if (!response.ok) {
                    console.error(`❌ Errore Server ${response.status} sulla categoria ${info.nome_italiano}`);
                    break;
                }
                const payload = await response.json();
                // L'endpoint productset ha l'array direttamente sotto 'entities'
                const entitaTrovate = payload.entities || [];
                // Se la corsia è vuota o abbiamo finito i record, interrompe il loop di paginazione
                if (entitaTrovate.length === 0) {
                    // Uscita di sicurezza se non tornano dati
                    break;
                }
                // Iniezione dei prodotti estratti nell'array globale, iniettando la categoria di origine
                for (let prodotto of entitaTrovate) {
                    prodotto.categoria_assegnata_italiano = info.nome_italiano;
                    prodotto.percorso_gerarchico_grocy = info.struttura_gerarchica;
                    tuttiIProdottiGrezzi.push(prodotto);
                }
                console.log(`    ✅ Catturati ${entitaTrovate.length} prodotti in questo blocco.`);
                // Se il blocco restituito è inferiore a 100, significa che non ci sono altre pagine per questa categoria
                if (entitaTrovate.length < length) {
                    // Abbiamo scaricato tutta la corsia
                    continuaPaginazione = false;
                }
                else {
                    // Avanza il cursore per la prossima pagina
                    start += length;
                }
                // Piccolo delay precauzionale per non martellare il server (150ms)
                await new Promise(res => setTimeout(res, 200));
            }
            catch (fetchErr) {
                console.error(`❌ Errore di rete critico sulla categoria ${info.nome_italiano}:`, fetchErr.message);
                continuaPaginazione = false;
            }
        }
    }
    // 4. SCRITTURA DEL FILE PRODOTTI COMPLETO NEL VAULT
    const percorsoOutput = "_00-EsselungaScraper/03-prodotti-grezzi.json";
    const stringaJsonProdotti = JSON.stringify(tuttiIProdottiGrezzi, null, 2);
    try {
        const fileEsistente = app.vault.getAbstractFileByPath(percorsoOutput);
        if (fileEsistente) {
            await app.vault.modify(fileEsistente, stringaJsonProdotti);
            console.log(`\n[SUCCESSO] File '${percorsoOutput}' AGGIORNATO nel Vault!`);
        }
        else {
            await app.vault.create(percorsoOutput, stringaJsonProdotti);
            console.log(`\n[SUCCESSO] File '${percorsoOutput}' CREATO nel Vault!`);
        }
        console.log(`Estratti in totale ${tuttiIProdottiGrezzi.length} articoli.`);
    }
    catch (saveErr) {
        console.error("Errore durante il salvataggio dei prodotti grezzi:", saveErr);
    }
})();
