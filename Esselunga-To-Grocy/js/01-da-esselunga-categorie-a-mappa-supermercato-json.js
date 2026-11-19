// Questa è da far girare nella Console di Obsidian.
// Prende i dati dal file json delle categorie di Esselunga (EsselungaCategorie.json)
// nel menù laterale a scomparsa e crea un nuovo json (mappa_supermercato.json) con solo i dati necessari

(async () => {
	// Legge il file direttamente dal Vault di Obsidian
	const fileGrezzo = app.vault.getAbstractFileByPath("_00-EsselungaScraper/01-esselunga-categorie.json");
	if (!fileGrezzo) {
		console.error("Errore: Il file 'EsselungaCategorie.json' non si trova nel Vault!");
		return;
	}
	const testoFile = await app.vault.read(fileGrezzo);
	const jsonGrezzo = JSON.parse(testoFile);
	const vociMenu = jsonGrezzo.leftMenuItems;
    // 1. CARICAMENTO DEL JSON MASTER
    if (!jsonGrezzo || !jsonGrezzo.leftMenuItems) {
        console.error("Errore: Assicurati che il JSON enorme sia caricato");
        return;
    }
    const dizionarioGlobaledelleCategorie = {};
    console.log("Inizio mappatura globale di tutte le categorie...");
    // Funzione di supporto per ricostruire il percorso (es: "Dispensa > Pasta, Riso e Sughi > Pasta")
    function costruisciPercorso(itemId) {
        let percorsi = [];
        let raggio = vociMenu.find(i => i.id === itemId);
        while (raggio) {
            percorsi.unshift(raggio.label);
            raggio = vociMenu.find(i => i.id === raggio.parentMenuItemId);
        }
        return percorsi.join(" > ");
    }
    // 2. Scansione chirurgica di tutto l'array
    for (const voce of vociMenu) {
        // Estraiamo i famosi productSetId nascosti dentro la sottostruttura menuItemProductSets
        let setIdsEstratti = [];
        if (voce.menuItemProductSets && voce.menuItemProductSets.length > 0) {
            setIdsEstratti = voce.menuItemProductSets
                .map(set => set.pk && set.pk.productSetId)
                .filter(id => id !== undefined && id !== null);
        }
        // Se una categoria non ha productSetIds e non ha figli, non contiene prodotti fisici (es: link istituzionali)
        if (setIdsEstratti.length === 0) {
            // Controlliamo se fa da contenitore a dei figli (es: macro-categoria "Pasta, Riso e Sughi")
            const haFigli = vociMenu.some(i => i.parentMenuItemId === voce.id);
            if (!haFigli) continue; // Salta i rami morti senza prodotti
        }
        // Generiamo il percorso gerarchico completo per Grocy
        const percorsoCompleto = costruisciPercorso(voce.id);
        // Popoliamo la mappa globale usando l'ID categoria come Chiave univoca
        dizionarioGlobaledelleCategorie[voce.id] = {
            menuItemId: voce.id,
            tag_pulito: voce.sanitizeDescription || voce.cssStyle || "categoria",
            nome_italiano: voce.label,
            struttura_gerarchica: percorsoCompleto,
            productSetIds: setIdsEstratti
        };
    }
    // 3. SALVATAGGIO DEI DATI IN OBSIDIAN
    // Mettiamo la mappa in una variabile globale così puoi ispezionarla al volo in console scrivendo window.mappaSupermercato
    window.mappaSupermercato = dizionarioGlobaledelleCategorie;
    const stringaJsonFinale = JSON.stringify(dizionarioGlobaledelleCategorie, null, 2);
    const nomeFile = "_00-EsselungaScraper/02-mappa-supermercato.json";
    try {
        // Sfrutta le API native del Vault di Obsidian per scrivere il file fisico sul tuo hard disk
        const fileEsistente = app.vault.getAbstractFileByPath(nomeFile);
        if (fileEsistente) {
            await app.vault.modify(fileEsistente, stringaJsonFinale);
            console.log(`\n[SUCCESSO] File '${nomeFile}' AGGIORNATO nel tuo Vault di Obsidian!`);
        } else {
            await app.vault.create(nomeFile, stringaJsonFinale);
            console.log(`\n[SUCCESSO] File '${nomeFile}' CREATO da zero nel tuo Vault di Obsidian!`);
        }
        console.log(`Mappate con successo ${Object.keys(dizionarioGlobaledelleCategorie).length} categorie totali.`);
    } catch (fsErr) {
        console.error("Errore durante il salvataggio del file nel Vault:", fsErr);
    }
})();
