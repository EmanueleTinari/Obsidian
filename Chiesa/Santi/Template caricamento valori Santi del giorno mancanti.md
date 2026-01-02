---
creato: 2026/01/01 14:56:50
modificato: 2026/01/02 11:24:49
---


```dataviewjs
const button = this.container.createEl('button', { text: "✍️ Seleziona un Santo o Beato da completare" });
button.addEventListener('click', async () => {
		// Definiamo la classe per il Suggester Modal DENTRO l'evento click
		class FileSuggester extends obsidian.FuzzySuggestModal {
				constructor(app, items, callback) {
						super(app);
						this.items = items;
						this.callback = callback;
				}
				getItems() {
						return this.items;
				}
				getItemText(item) {
						// Mostriamo il path del file come testo per ogni opzione
						return item.path;
				}
				onChooseItem(item, evt) {
						// Quando un item è scelto, eseguiamo il callback con il file selezionato
						this.callback(item);
				}
		}// Estende la classe Modal prelevandola dall'oggetto globale 'obsidian'
	class CompleterModal extends obsidian.Modal {
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
								new obsidian.Setting(contentEl)
										.addButton((btn) =>
												btn.setButtonText("Chiudi")
														.setCta()
														.onClick(() => this.close())
										);
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
						const buttonContainer = contentEl.createDiv({ attr: { style: "display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;" } });
						const leftButtons = buttonContainer.createEl("div");
							new obsidian.Setting(leftButtons)
								.addButton((btn) =>
									btn.setButtonText("Annulla")
									.onClick(() => this.close())
								)
								.addButton((btn) =>
									btn.setButtonText("Salta")
									.onClick(() => {
										new obsidian.Notice(`Campo "${currentPlaceholder}" saltato.`);
										this.currentIndex++;
										this.display();
									})
								)
								.addButton((btn) =>
									btn.setButtonText("Eliminalo e salta al prossimo")
									.onClick(async () => {
										const lines = this.fileContent.split('\n');
										let replacementHappened = false;
										const newContentLines = lines.map(line => {
											if (line.includes(currentPlaceholder)) {
												const colonIndex = line.indexOf(':');
												if (colonIndex > -1) {
													replacementHappened = true;
													return line.substring(0, colonIndex + 1);
												}
											}
											return line;
											if (replacementHappened) {
												this.fileContent = newContentLines.join('\n');
												try {
													await this.app.vault.modify(this.file, this.fileContent);
													new obsidian.Notice(`Placeholder "${currentPlaceholder}" rimosso e file salvato.`);
													this.currentIndex++;
													this.display();
												}
												catch (err) {
													new obsidian.Notice("Errore durante il salvataggio del file: " + err);
													this.close();
												}
											}
											else {
												new obsidian.Notice(`Impossibile trovare il placeholder "${currentPlaceholder}" su una riga contenente ':'.`);
											}
										})
									});
								);
						const rightButtons = buttonContainer.createEl("div");
						new obsidian.Setting(rightButtons)
								.addButton((btn) =>
										btn.setButtonText("Svuota")
												.onClick(() => {
													inputArea.value = "";
													inputArea.focus();
												})
								)
								.addButton((btn) =>
										btn.setButtonText("Salva e Prosegui →")
												.setCta()
												.onClick(async () => {
														const userInput = inputArea.value;
														this.fileContent = this.fileContent.replaceAll(currentPlaceholder, userInput);
														try {
															await this.app.vault.modify(this.file, this.fileContent);
															new obsidian.Notice(`"${currentPlaceholder}" aggiornato in "${this.file.basename}"`);
															this.currentIndex++;
															this.display();
														}
														catch (err) {
															new obsidian.Notice("Errore durante il salvataggio del file: " + err);
															this.close();
														}
												})
								);
				}
				// Metodo eseguito alla chiusura del modale
				onClose() {
						const { contentEl } = this;
						contentEl.empty();
						new obsidian.Notice("Operazione terminata.");
				}
		}
		// 1. Ottiene TUTTI i file markdown nel vault
		const allFiles = app.vault.getMarkdownFiles();
		if (!allFiles || allFiles.length === 0) {
				new obsidian.Notice("Nessun file Markdown trovato nel vault.");
				return;
		}
						// 2. Usa una Promise per attendere la selezione dell'utente dal Suggester
				const chosenFile = await new Promise((resolve) => {
						new FileSuggester(app, allFiles, (result) => {
								resolve(result);
						}).open();
				});
		// 3. Se non selezioni un file, interrompe l'operazione
		if (!chosenFile) {
				new obsidian.Notice("Nessun file selezionato. Operazione annullata.");
				return;
		}
		// 4. Legge il contenuto del file scelto e cerca i placeholder {dato}
		const content = await app.vault.read(chosenFile);
		const placeholderRegex = /\{[^{}]+\}/g;
		const placeholders = content.match(placeholderRegex);
		// 5. Se non trova placeholder, ti avvisa e si ferma
		if (!placeholders || placeholders.length === 0) {
				new obsidian.Notice(`Il file "${chosenFile.basename}" non contiene placeholder del tipo {dato}.`);
				return;
		}
		// 6. Se trova placeholder, apre il modale per la compilazione
		new CompleterModal(app, chosenFile, placeholders).open();
});

```