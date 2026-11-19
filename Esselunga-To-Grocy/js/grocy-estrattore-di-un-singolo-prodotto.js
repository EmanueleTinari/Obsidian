// Estrae un singolo prodotto da Grocy e lo copia nella Clipboard di Windows
// pronto da fare 'Incolla' in un file .json
(async () => {
    console.log("Tentativo di connessione autorizzata a Grocy...");
    // INSERISCI QUI LA TUA CHIAVE API DI GROCY
    const GROCY_API_KEY = "47a9cf0a2d4290ef846427fdaecc62738025a2923bac9a05";
    const netFetch = require('electron').remote ? require('electron').remote.net.fetch : require('electron').net.fetch;
    try {
        const response = await netFetch("http://localhost:8080/api/objects/products", {
            "method": "GET",
            "headers": {
                "Accept": "application/json",
                "GROCY-API-KEY": GROCY_API_KEY // <--- Chiave di sblocco passata negli headers
            }
        });
        if (response.ok) {
            const arrayProdotti = await response.json();
            if (arrayProdotti.length > 0) {
                // Isola il primo prodotto reale dell'array (indice 0)
                const primoProdotto = arrayProdotti[0];
                const stringaOutput = JSON.stringify(primoProdotto, null, 2);
                // Iniezione diretta nella clipboard di Windows tramite le API di Electron
                require('electron').clipboard.writeText(stringaOutput);
                console.log("\n[SUCCESSO] Il prodotto numero 1 è stato COPIATO negli appunti! Fai Ctrl+V qui nella chat.");
            }
            else {
                console.log("Nessun prodotto trovato nel database di Grocy.");
            }
        }
        else {
            console.error("Errore server Grocy:", response.status);
        }
    }
    catch (err) {
        console.error("Errore di connessione:", err.message);
    }
})();
