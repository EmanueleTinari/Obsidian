---
creato: 23/05/2025 01:12:06
modificato: 09/07/2025 00:16:15
---


<%*
// Frammento per dare priorità ai tag utilizzati di frequente e ai tag nella stessa cartella
try {
  // Ottieni il percorso del file e la cartella correnti
  const currentFilePath = tp.file.path(true);
  const currentFolder = currentFilePath.substring(0, currentFilePath.lastIndexOf('/'));
 
  // Un oggetto che contiene un elenco di tag e il conteggio delle loro occorrenze
  const tagObj = app.metadataCache.getTags();
  const tagCounts = {};
  const folderTags = new Set();
 
  // Esegui un ciclo attraverso tutti i file markdown
  const files = app.vault.getMarkdownFiles();
  for (const file of files) {
    // Ottieni la cache dei file
    const fileCache = app.metadataCache.getFileCache(file);
    if (!fileCache || !fileCache.tags) continue;
   
    // Elabora tutti i tag in questo file
    for (const tagObj of fileCache.tags) {
      const tag = tagObj.tag;
      // Contare il numero di occorrenze di un tag
      if (!tagCounts[tag]) {
        tagCounts[tag] = 1;
      } else {
        tagCounts[tag]++;
      }
     
      // Contrassegna i tag per i file nella stessa cartella
      if (file.path.startsWith(currentFolder + '/')) {
        folderTags.add(tag);
      }
    }
  }
 
  // Converti i tag in un elenco e rimuovi il #
  let tags = Object.keys(tagCounts).map(tag => {
    return {
      name: tag.replace('#', ''),
      count: tagCounts[tag],
      inFolder: folderTags.has(tag)
    };
  });
 
  // Ordina i tag: dai priorità ai tag nella stessa cartella, quindi ordina in base al numero di occorrenze in ordine decrescente
  tags.sort((a, b) => {
    // Dai priorità ai tag nella stessa cartella
    if (a.inFolder && !b.inFolder) return -1;
    if (!a.inFolder && b.inFolder) return 1;
   
    // Se la cartella è la stessa, ordina in base al conteggio delle occorrenze in ordine decrescente
    return b.count - a.count;
  });
 
  // Crea un elenco di nomi di tag visualizzati e un elenco di nomi di tag effettivi
  const tagDisplayNames = tags.map(tag => {
    let displayName = tag.name;
    // I tag nella stessa cartella sono contrassegnati con un segno 🔷
    // e i tag utilizzati di frequente sono contrassegnati con il numero di volte in cui compaiono.
    if (tag.inFolder) {
      displayName = `🔷 ${displayName}`;
    }
    return `${displayName} (${tag.count})`;
  });
 
  const tagNames = tags.map(tag => tag.name);
 
  // Cosa fare se il tag è mancante
  if (tagNames.length === 0) {
    new Notice("Tag non trovato");
    return "Nessun tag trovato. Aggiungi prima i tag ad alcune note.";
  }
 
  // Un array per memorizzare i tag selezionati
  const selectedTags = [];
  let continue_adding = true;
 
  // Un ciclo per selezionare i tag
  while (continue_adding) {
    // Seleziona tag (visualizza il nome nel suggester, ottieni tagNames come valore effettivo)
    const selectedTag = await tp.system.suggester(tagDisplayNames, tagNames);
   
    // Se è selezionato un tag valido
    if (selectedTag !== null) {
      selectedTags.push(selectedTag);
      // Conferma per aggiungere altri tag
      continue_adding = await tp.system.suggester(
        ["Aggiungi tag", "Fatto"],
        [true, false]
      );
    } else {
      // Se annullato
      continue_adding = false;
    }
  }
 
  // Restituisce il tag selezionato
	if (selectedTags.length > 0) {
		return selectedTags.map(t => '#' + t).join(' ');
	}
	else {
		// Se non è selezionato alcun tag
		return "";
  }
}
catch (error) {
  // Se si verifica un errore
  console.error("Errore di selezione del tag:", error);
  new Notice("Si è verificato un errore durante il recupero dei tag: " + error.message);
  return "Si è verificato un errore, controllare la console.";
}
%>

