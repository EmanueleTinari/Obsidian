
// Parametri
const API_KEY = "Insert here Google API KEY";           // la tua Google API Key
const PSE_ID = "Insert here Google PSE ID";             // il tuo Search Engine ID (PSE ID)
const query = "Insert here your query";                 // la tua query di ricerca

// Costruisco l'URL della richiesta
const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${PSE_ID}&q=${encodeURIComponent(query)}`;

// Eseguo la richiesta HTTP GET
fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Risultato grezzo:", data);

        // Se ci sono risultati, stampo titolo e link dei primi
        if (data.items && data.items.length > 0) {
            data.items.forEach((item, i) => {
                console.log(`${i + 1}. ${item.title}\n${item.link}\n`);
            });
        } else {
            console.log("Nessun risultato trovato.");
        }
    })
    .catch(error => console.error("Errore nella richiesta:", error));
