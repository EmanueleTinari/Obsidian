# Modal for Bible references

Plugin Obsidian che apre un modal al passaggio del mouse su riferimenti biblici.

- Mostra versetto in modal con titolo libro + capitolo, versetto
- Usa i file markdown CEI 1974 in locale (configurato per percorso fisso)
- Supporta abbreviazioni italiane libri biblici
- Chiudi modal cliccando la X o spostando il mouse fuori (da implementare)

## Installazione

1. Scompatta la cartella obsidian-modal-4bible-refs in `.obsidian/plugins/`
2. Abilita il plugin da Impostazioni → Plugin Comunitari
3. Apri un file markdown con riferimenti biblici con questo formato `<span class="BibleRef">[[Mt 1,1|Mt 1,1]]</span>`
4. Passa il mouse sul riferimento per vedere il versetto

## Personalizzazioni

- Modifica `main.js` per cambiare percorso o comportamento modal
- Aggiungi gestione chiusura modal su mouseleave

---

Creato da Emanuele Tinari + ChatGPT
