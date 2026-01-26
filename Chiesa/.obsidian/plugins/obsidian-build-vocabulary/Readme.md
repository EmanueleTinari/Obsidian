# Build Vocabulary

Plugin per Obsidian progettato per analizzare i file di una cartella specifica ed estrarne il lessico completo, facilitando la creazione di glossari o lo studio terminologico.

## Caratteristiche

Il plugin permette di filtrare l'estrazione delle parole attraverso diverse opzioni configurabili:

- **Parole accentate**: inclusione o esclusione dei termini con accento.
- **Articoli Determinativi**: filtro per escludere (il, lo, la, i, gli, le).
- **Articoli Indeterminativi**: filtro per escludere (un, uno, una).
- **Preposizioni Semplici**: filtro per escludere (di, a, da, in, con, su, per, tra, fra).
- **Preposizioni Articolate**: filtro per escludere le combinazioni di preposizioni e articoli.

## Installazione

1. Scarica i file della release e scompatta la cartella `obsidian-build-vocabulary` nel percorso `.obsidian/plugins/` della tua cassaforte (vault).
2. Apri Obsidian e vai in **Impostazioni** → **Plugin comunitari**.
3. Clicca su "Aggiorna" (se necessario) e abilita il plugin **Build Vocabulary**.

## Utilizzo

1. Configura le preferenze di filtraggio nelle **Impostazioni** del plugin.
2. Apri la Command Palette (`Ctrl+P` o `Cmd+P`).
3. Cerca e seleziona il comando: `Build vocabulary: Esegui estrazione`.

## Personalizzazioni

È possibile regolare il comportamento del plugin (come il percorso della cartella di scansione e le liste di esclusione) direttamente dal pannello delle impostazioni all'interno di Obsidian, senza dover modificare manualmente il file `main.js`.

---

Creato da Emanuele Tinari + GitHub Copilot AI + Google Gemini in Firebase AI
