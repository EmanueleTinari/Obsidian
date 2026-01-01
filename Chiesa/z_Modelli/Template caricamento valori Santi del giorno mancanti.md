---
creato:
modificato:
---


```dataviewjs
const button = this.container.createEl('button', { text: "✍️ Seleziona un file da compilare" });

button.addEventListener('click', async () => {
	// 1. Ottiene TUTTI i file markdown nel vault
	const allFiles = this.app.vault.getMarkdownFiles();
	if (!allFiles || allFiles.length === 0) {
		new Notice("Nessun file Markdown trovato nel vault.");
		return;
	}

	// 2. Mostra un menu di selezione (suggester) per farti scegliere il file
	const chosenFile = await this.app.suggester(
		allFiles.map(f => f.path), // Lista di percorsi da mostrare
		allFiles                   // Oggetti file corrispondenti
	);

	// 3. Se non selezioni un file, interrompe l'operazione
	if (!chosenFile) {
        new Notice("Nessun file selezionato. Operazione annullata.");
        return;
    }

    // 4. Legge il contenuto del file scelto e cerca i placeholder {dato}
    const content = await this.app.vault.read(chosenFile);
    const placeholderRegex = /\{[^{}]+\}/g;
    const placeholders = content.match(placeholderRegex);

    // 5. Se non trova placeholder, ti avvisa e si ferma
    if (!placeholders || placeholders.length === 0) {
        new Notice(`Il file "${chosenFile.basename}" non contiene placeholder del tipo {dato}.`);
        return;
    }

    // 6. Se trova placeholder, apre il modale per la compilazione
    new CompleterModal(this.app, chosenFile, placeholders).open();
});

/**
 * Classe che definisce il Modale per la compilazione dei campi.
 */
class CompleterModal extends this.app.Modal {
    constructor(app, file, placeholders) {
        super(app);
        this.file = file;
        // Rimuove placeholder duplicati per processare ogni tipo una sola volta
        this.placeholders = [...new Set(placeholders)];
        this.currentIndex = 0;
        this.fileContent = null;
    }

    // Metodo eseguito all'apertura del modale
    async onOpen() {
        this.fileContent = await this.app.vault.read(this.file);
        this.display();
    }

    // Metodo che costruisce e mostra l'interfaccia del modale
    display() {
        const { contentEl } = this;
        contentEl.empty(); // Pulisce il modale prima di mostrare il campo successivo

        // Se tutti i placeholder sono stati processati, mostra messaggio finale
        if (this.currentIndex >= this.placeholders.length) {
            contentEl.createEl("h2", { text: "Completato!" });
            contentEl.createEl("p", { text: `Tutti i placeholder nel file "${this.file.basename}" sono stati compilati.` });
            const closeButton = contentEl.createEl("button", { text: "Chiudi", cls: "mod-cta" });
            closeButton.onclick = () => this.close();
            return;
        }

        const currentPlaceholder = this.placeholders[this.currentIndex];
        
        // Intestazione del modale
        contentEl.createEl("h3", { text: "Compila il seguente campo" });
        contentEl.createEl("p", { text: `File: ${this.file.path}` });
        contentEl.createEl("p", { text: `Campo ${this.currentIndex + 1} di ${this.placeholders.length}` });

        // Mostra il placeholder corrente
        contentEl.createEl("strong", { text: `Placeholder: ${currentPlaceholder}` });

        // Area di testo per l'input
        const inputArea = contentEl.createEl("textarea", {
            attr: { rows: 4, style: "width: 100%; margin: 10px 0;" }
        });
        inputArea.focus();

        // Contenitore per i bottoni con layout flessibile
        const buttonContainer = contentEl.createDiv({ attr: { style: "display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;" } });

        // --- Bottoni a sinistra ---
        const cancelButton = buttonContainer.createEl("button", { text: "Annulla" });
        cancelButton.onclick = () => this.close();

        // --- Bottoni a destra ---
        const rightButtons = buttonContainer.createEl("div");
        
        const clearButton = rightButtons.createEl("button", { text: "Svuota" });
        clearButton.style.marginRight = "8px"; // Spazio tra i bottoni
        clearButton.onclick = () => {
            inputArea.value = "";
            inputArea.focus();
        };

        const nextButton = rightButtons.createEl("button", { text: "Salva e Prosegui →", cls: "mod-cta" });
        nextButton.onclick = async () => {
            const userInput = inputArea.value;
            
            // Sostituisce TUTTE le occorrenze di questo placeholder nel contenuto
            this.fileContent = this.fileContent.replaceAll(currentPlaceholder, userInput);
            
            try {
                // Salva il contenuto aggiornato nel file
                await this.app.vault.modify(this.file, this.fileContent);
                new Notice(`"${currentPlaceholder}" aggiornato in "${this.file.basename}"`);
                
                // Passa al placeholder successivo
                this.currentIndex++;
                this.display(); // Ricarica l'interfaccia del modale
            } catch (err) {
                new Notice("Errore durante il salvataggio del file: " + err);
                this.close();
            }
        };
    }

    // Metodo eseguito alla chiusura del modale
    onClose() {
        this.contentEl.empty();
        new Notice("Operazione terminata.");
    }
}

```


