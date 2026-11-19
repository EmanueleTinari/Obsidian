(async () => {
    console.log("Estrazione dizionari ufficiali dalle REST API di Grocy...");
    // Incolla qui la tua API-Key attiva (quella dell'app Android)
    const GROCY_API_KEY = "47a9cf0a2d4290ef846427fdaecc62738025a2923bac9a05";
    const netFetch = require('electron').remote ? require('electron').remote.net.fetch : require('electron').net.fetch;
    // Configurazione accurata basata sulla documentazione GitHub di Grocy
    const tabelleGrocy = [
		// Tabelle di Grocy.
        { endpoint: "tasks",				file: "_00-EsselungaScraper/tbl-grocy-attivita.json",				nome: "Attività" },
        { endpoint: "batteries",			file: "_00-EsselungaScraper/tbl-grocy-batterie.json",				nome: "Batterie" },
        { endpoint: "chores", 				file: "_00-EsselungaScraper/tbl-grocy-faccende-domestiche.json",	nome: "Faccende domestiche" },
        { endpoint: "product_groups",		file: "_00-EsselungaScraper/tbl-grocy-gruppi-di-prodotti.json",		nome: "Gruppi di prodotti" },
        { endpoint: "shopping_list",		file: "_00-EsselungaScraper/tbl-grocy-lista-degli-acquisti.json",	nome: "Lista degli acquisti" },
        { endpoint: "shopping_locations",	file: "_00-EsselungaScraper/tbl-grocy-negozi.json",					nome: "Negozi" },
        { endpoint: "userfields",			file: "_00-EsselungaScraper/tbl-grocy-personal-campi.json",			nome: "Personalizzazione campi" },
        { endpoint: "userobjects",			file: "_00-EsselungaScraper/tbl-grocy-personal-oggetti.json",		nome: "Personalizzazione oggetti" },
        { endpoint: "userentities",			file: "_00-EsselungaScraper/tbl-grocy-personal-entita.json",		nome: "Personalizzazione entità" },
        { endpoint: "locations",			file: "_00-EsselungaScraper/tbl-grocy-posizioni.json",				nome: "Posizioni" },
        { endpoint: "products",				file: "_00-EsselungaScraper/tbl-grocy-prodotti.json",				nome: "Prodotti" },
        { endpoint: "recipes",				file: "_00-EsselungaScraper/tbl-grocy-ricette.json",				nome: "Ricette" },
        { endpoint: "quantity_units",		file: "_00-EsselungaScraper/tbl-grocy-unita-misura.json",			nome: "Unità di Misura" }
    ];
    for (const tab of tabelleGrocy) {
        try {
            const response = await netFetch(`http://localhost:8080/api/objects/${tab.endpoint}`, {
                "method": "GET",
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "GROCY-API-KEY": GROCY_API_KEY // Autenticazione corretta per REST API
                }
            });
            if (response.ok) {
                const datiTabella = await response.json();
                const stringaJson = JSON.stringify(datiTabella, null, 2);
                const fileEsistente = app.vault.getAbstractFileByPath(tab.file);
                if (fileEsistente) {
                    await app.vault.modify(fileEsistente, stringaJson);
                }
				else {
                    await app.vault.create(tab.file, stringaJson);
                }
                console.log(`    ✅ Scaricata tabella '${tab.nome}' -> Trovati ${datiTabella.length} elementi.`);
            }
			else {
                console.error(` ❌ Fallito endpoint /api/objects/${tab.endpoint}. Stato server: ${response.status}`);
            }
        }
		catch (err) {
            console.error(` ❌ Errore critico su ${tab.endpoint}:`, err.message);
        }
    }
    console.log("\n[COMPLETATO] Controlla i 3 file creati nella cartella '_00-EsselungaScraper'.");
})();