---
creato: 2025/09/05 07:18:08
modificato: 2025/09/05 07:30:57
---

Ti invio questo spezzone in HTML:



### 📌 Prompt ottimizzato per estrazione da HTML (Markdown + regole di formattazione)

**Obiettivo:** Estrai tutto il testo contenuto nei tag `<p>` della pagina HTML, formattato in Markdown, in un blocco di codice continuo.

---

#### 📄 Formattazione Markdown

- Inserisci **tutto il testo** in un **blocco di codice** Markdown (```) per permettere copia/incolla.
- Il testo deve essere **una stringa continua**, **salvo dove indicato di andare a capo**.
- Usa il carattere di fine riga **solo** per separare paragrafi `<p>` o intestazioni numerate.

---

#### 🔢 Numerazione paragrafi

- Se ci sono **paragrafi numerati** (numeri arabi o numeri romani), usa questa struttura:

```
{Qui inserisci una RIGA VUOTA}
###### [numero].{Qui inserisci il FINE RIGA}
{Qui inserisci una RIGA VUOTA}
[testo del paragrafo]{Qui inserisci il FINE RIGA}
```

- Non inserire `<br>` dopo il punto che segue il numero di paragrafo/capitolo (es. `4.`).

---

#### 🚫 Regole di punteggiatura

**Inserisci `<br>` solo dopo:**
- Punto `.`
- Punto esclamativo `!`
- Punto interrogativo `?`

**NON inserire `<br>` dopo:**
- Virgole `,`
- Punto e virgola `;`
- Punto dopo il numero del paragrafo (es. `4.`)
- Se il punto chiude un paragrafo e il successivo è numerato, **non** inserire `<br>`

**Dopo ogni chiusura di `<p>` e apertura di nuovo `<p>`, inserisci due `<br>` consecutivi.**

---

#### ✨ Corsivo

- Il testo in corsivo (tag `<i>`) deve essere racchiuso tra **asterischi**: `*testo*`
- se il testo in corsivo è racchiuso tra virgolette (`"`), l'asterisco (`*`) va messo DOPO le virgolette di apertura e prima di quelle di chiusura (es. `"*testo*"`)
- se il testo in corsivo è racchiuso tra parentesi (`( )`), l'asterisco (`*`) va messo DOPO la parentesi di apertura e prima di quella di chiusura (es. `(*testo*)`)

---

#### ❗ Importante

1. Non omettere **nessuna riga** contenuta nei tag `<p>`
2. Non aggiungere **numeri arbitrari**
3. Non inserire **ritorni a capo** dopo `<br>` (niente `\n` dopo `<br>`)
4. Il testo dopo `<br>` deve **continuare sulla stessa riga**
5. Quando finisce un <p> nel codice, andare a capo
6. ricorda di trasformare gli <i>...</i> in *...* come il Markdown esige
7. Ad ogni punto di interruzione FRASE, inserire un <br> (es xxx.[Inserire qui il <br>]Xxxxxxx