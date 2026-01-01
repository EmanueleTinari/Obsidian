import csv
import os
import re
import shutil
from datetime import datetime
# ===== CONFIG =====
# Percorso cartella e CSV originale
OUTPUT_ROOT = r"D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\Santi"
CSV_FILE = os.path.join(OUTPUT_ROOT, "Calendario dei Santi, Martiri, Beati e Testimoni della Fede.csv")
# suffisso per file Python
SUFFIX_PY = "_bak"
# Riga da cui partire e dove fermarsi (STOP_ROW non inclusa)
START_ROW = 2
STOP_ROW = 11
# Colonne del CSV
COLS = [
    "Data", "Num", "Prefisso", "Apostrofato", "Nome", "Categoria",
    "Martire", "Sacerdote", "Vescovo", "Dottore della Chiesa",
    "Data2", "Tipo", "Scheda", "Martirologio romano"
]
PRE = {
    "Singolare_maschile": ["Santo", "San", "Sant’", "Beato"],
    "Plurale_maschile": ["Santi", "Beati"],
    "Singolare_femminile": ["Santa", "Sant’", "Beata"],
    "Plurale_femminile": ["Sante", "Beate"]
}
# ===== Mappa mese numerico -> mese in italiano =====
MESI = {
    1: "gennaio",
    2: "febbraio",
    3: "marzo",
    4: "aprile",
    5: "maggio",
    6: "giugno",
    7: "luglio",
    8: "agosto",
    9: "settembre",
    10: "ottobre",
    11: "novembre",
    12: "dicembre"
}
# ===== Mappa degli elementi del Markdown =====
CONTENUTI = {
    "open": "---",
    "cssclasses": "cssclasses: santi",
    "prefisso": "prefisso: {prefisso}",
    "apostrofato": "apostrofato: {apostrofato}",
    "nome": "nome: {nome}",
    "pseudonimo": "pseudonimo: {pseudonimo}",
    "nota": "nota: Santi",
    "titoli": "titoli: {titolo}",
    "beato": "beato: {valore_beato}",
    "santo": "santo: {valore_santo}",
    "martire": "martire: {valore_martire}",
    "dottore": "dottore_della_chiesa: {valore_dottore}",
    "giorno_memoria": "giorno memoria: {giorno_mem}",
    "mese_memoria": "mese memoria: {mese_mem}",
    "tipo_memoria": "tipo memoria: {tipo_mem}",
    "data_nascita": "data nascita: {d_nascita}",
    "citta_nascita": "città nascita: {c_nascita}",
    "paese_nascita": "paese nascita: {p_nascita}",
    "data_morte": "data morte: {d_morte}",
    "beat_data": "data beatificazione: {d_beat}",
    "beat_aut": "autorità beatificazione: {a_beat}",
    "canon_data": "data canonizzazione: {d_canon}",
    "canon_aut": "autorità canonizzazione: {a_canon}",
    "posizione": "posizione Martirologio: {pos_mart}",
    "genere": "genere: {genere}",
    "patronato": "patronato:",
    "patrono": "patrono:",
    "etimologia": "etimologia: {etimologia}",
    "emblema": "emblema: {emblema}",
    "tags": "tags: [{item_tag}]",
    "sintesi": "sintesi: {sintesi}",
    "stato": "stato: false",
    "completato": "completato: false",
    "licenza-nota": "licenza-nota: \"[Copyright © 2025 Emanuele Tinari under Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)\"",
    "creato": "creato:",
    "modificato": "modificato:",
    "close": "---",
    "H1": "\n\n# {H1}",
    "divisore1": "\n\n***\n\n",
    "callout_foto": "> [!foto]- Foto\n> {foto_item}",
    "divisore2": "\n\n***\n\n",
    "H2mart": "## Dal Martirologio",
    "testo_mart": "{testo_mart}",
    "fonte_mart": "[Fonte: Martirologio romano, Editore Libreria Editrice Vaticana, Copyright © Fondazione di religione Santi Francesco di Assisi e Caterina da Siena, Roma, 2004]",
    "divisore3": "\n\n***\n\n",
    "H2ia": "## Informazioni aggiuntive",
    "testo_ia": "{testo_ia}",
    "fonte_ia": "[Fonte: {nome_ia}]({url_ia})",
    "divisore4": "\n\n***\n\n",
    "H2na": "## Nota agiografica estesa",
    "testo_na": "{testo_na}",
    "fonte_na": "[Fonte Santi e Beati]({url_na})\n\n\n"
}
# ===== Funzione di costruzione timestamp per backup file =====
def get_timestamp():
    """Restituisce una stringa timestamp usata per i backup: AAAAMMGGHHMMSS"""
    return datetime.now().strftime("%Y%m%d%H%M%S")
# ===== Input opzionale: giorno/mese o range righe =====
# accetta sia 12/2 che 12-2
raw_day = input("Inserisci il giorno da elaborare nella forma gg/mm\n(es. 12/2 [12 febbraio] o 17-4 [17 aprile]).\nPremi Invio per usare riga iniziale/finale: ").strip()
filter_day = None
filter_month = None
if raw_day:
    # utente vuole filtrare per giorno/mese
    # normalizza tutti i separatori a "/" (accetta sia - che /)
    raw_norm = raw_day.replace("-", "/")
    try:
        d, m = raw_norm.split("/")
        filter_day = int(d)
        filter_month = int(m)
        print(f"→ Filtrerò solo le righe del {filter_day}/{filter_month}.")
    except Exception:
        print("Formato giorno/mese non valido. Procedo a chiedere riga iniziale/finale.")
        raw_day = ""  # cadremo nel ramo delle righe
if not raw_day:
    raw_start = input(f"Riga iniziale (Invio per default {START_ROW}): ").strip()
    raw_stop  = input(f"Riga finale   (Invio per default {STOP_ROW}): ").strip()
    startRow = int(raw_start) if raw_start else START_ROW
    endRow   = int(raw_stop)  if raw_stop  else STOP_ROW
    print(f"→ Elaborerò le righe da {startRow} a {endRow} (end non incluso).")
# ===== Lettura CSV ed elaborazione righe selezionate =====
# Prima di leggere il CSV, creiamo una copia di backup sullo stesso percorso
ts_csv_bak = get_timestamp()
csv_base, csv_ext = os.path.splitext(CSV_FILE)
csv_bak_path = f"{csv_base}_bak{ts_csv_bak}{csv_ext}"
shutil.copyfile(CSV_FILE, csv_bak_path)
print(f"Backup CSV creato: {csv_bak_path}")
# Carichiamo tutte le righe in memoria e poi iteriamo usando un indice
with open(CSV_FILE, newline='', encoding='utf-8') as f_in:
    reader = csv.DictReader(f_in, delimiter='§')
    rows = list(reader)
    fieldnames = reader.fieldnames if reader.fieldnames else COLS
# Iteriamo riga per riga rimuovendole dal CSV originale dopo l'elaborazione
j = 0
data_riga_precedente = None
while j < len(rows):
    # i corrisponde al numero di riga nel file originale (header=1, prima data=2)
    i = j + 2
    row = rows[j]
    # se abbiamo un filtro giorno/mese, usalo
    if filter_day is not None:
        data_raw = row.get("Data", "").strip()
        try:
            day_s, month_s, year_s = data_raw.split("/")
            if int(day_s) != filter_day or int(month_s) != filter_month:
                j += 1
                continue
        except Exception:
            # data malformata → salta la riga
            j += 1
            continue
    else:
        # filtro per range righe (endRow non incluso)
        try:
            sr = startRow
            er = endRow
        except NameError:
            sr = START_ROW
            er = STOP_ROW
        if i < sr:
            j += 1
            continue
        if i >= er:
            break
        # ===== Qui inserisci la logica per creare markdown =====
        # --- Estrazione data (con controllo e uso data_riga_precedente) ---
        data_raw = row.get("Data", "").strip()  # es: "03/11/2025"
        def _validate_and_parse_date(s):
            try:
                d, m, y = s.split("/")
                di = int(d)
                mi = int(m)
                yi = int(y)
                if not (1 <= mi <= 12 and 1 <= di <= 31):
                    return None
                return (f"{di:02d}", mi, str(yi))
            except Exception:
                return None
        parsed = None
        if data_raw:
            parsed = _validate_and_parse_date(data_raw)
        if not parsed:
            # se abbiamo una data precedente proponila come default
            if data_riga_precedente:
                prompt = input(f"Riga {i}: data mancante o malformata '{data_raw}'. Inserisci data gg/mm/aaaa [Invio = {data_riga_precedente}]: ").strip()
                if not prompt:
                    use_date = data_riga_precedente
                else:
                    use_date = prompt
            else:
                use_date = input(f"Riga {i}: data mancante o malformata '{data_raw}'. Inserisci data gg/mm/aaaa (o 's' per saltare): ").strip()
                if use_date.lower() == 's' or not use_date:
                    print(f"Riga {i}: nessuna data valida fornita. Salto la riga.")
                    j += 1
                    continue
            parsed = _validate_and_parse_date(use_date)
            if not parsed:
                # ripeti finché non otteniamo una data valida o l'utente digita 's'
                while True:
                    retry = input(f"Data '{use_date}' non valida. Reinserisci gg/mm/aaaa (o 's' per saltare): ").strip()
                    if retry.lower() == 's':
                        print(f"Riga {i}: salto per data non valida.")
                        parsed = None
                        break
                    parsed = _validate_and_parse_date(retry)
                    if parsed:
                        use_date = retry
                        break
                if not parsed:
                    j += 1
                    continue
            # se siamo qui parsed è valida
            data_raw = use_date
        # parsed è una tupla (giorno_str, mese_int, anno_str)
        data_giorno, data_mese, data_anno = parsed[0], parsed[1], parsed[2]
        data_mese = int(data_mese)
        data_mese_LETT = MESI.get(data_mese, "")
        # prepara valori giorno/mese per il frontmatter e inizializza il template
        Giorno_Mem_Riga = f"{int(data_giorno):02d}"
        Mese_Mem_Riga = f"{int(data_mese):02d}"
        # inizializziamo il dizionario dei contenuti subito dopo aver validato la data
        contenuti_riga = CONTENUTI.copy()
        # riempiamo subito i placeholder giorno/mese nel frontmatter
        contenuti_riga["giorno_memoria"] = contenuti_riga["giorno_memoria"].format(giorno_mem=Giorno_Mem_Riga)
        contenuti_riga["mese_memoria"] = contenuti_riga["mese_memoria"].format(mese_mem=Mese_Mem_Riga)
        # Impostiamo `data_morte` con formato zero-padded giorno (numero) + spazio + mese in lettere
        # Esempio: "03 gennaio" (giorno sempre su due cifre)
        d_morte_val = f"{int(data_giorno):02d} {data_mese_LETT}"
        contenuti_riga["data_morte"] = contenuti_riga["data_morte"].format(d_morte=d_morte_val)
        # Prepara `item_tag`: primo valore lasciato vuoto (verrà inserito più avanti),
        # secondo valore è la stringa letterale "giorno", terzo è il numero del giorno (zero-padded),
        # quarto è il mese in lettere. Verrà inserito dentro le parentesi quadre definite in CONTENUTI["tags"].
        item_tag_val = f", giorno, {int(data_giorno):02d}, {data_mese_LETT}"
        contenuti_riga["tags"] = contenuti_riga["tags"].format(item_tag=item_tag_val)
        # aggiorna data_riga_precedente
        data_riga_precedente = data_raw

        # --- Estrazione numero dell'elemento nel sito santiebeati.it ---
        Num_Riga            = row["Num"].strip()
        # Colonna 13 e 14: valori tipo "/dettaglio/12345" oppure vuoti
        Colonna_13 = row["Scheda"].strip()
        Colonna_14 = row["Martirologio romano"].strip()
        # Estrazione solo del numero finale dalle colonne
        numColonna_13 = Colonna_13.split("/")[-1] if Colonna_13 else ""
        numColonna_14 = Colonna_14.split("/")[-1] if Colonna_14 else ""
        # Condizioni:
        # - se numColonna_13 == Num_Riga → ok
        # - se numColonna_14 == Num_Riga → ok
        # - se entrambi combaciano → ok
        # - se solo uno combacia → ok
        # - se nessuno combacia → placeholder
        if numColonna_13 == Num_Riga or numColonna_14 == Num_Riga:
            url_na = f"https://www.santiebeati.it/dettaglio/{Num_Riga}"
        else:
            url_na = "{url_na}"
        # Inserimento nel dizionario frontmatter
        contenuti_riga["fonte_na"] = contenuti_riga["fonte_na"].format(url_na=url_na)

        # --- Estrazione del prefisso ---
        apostrofi = ("'", "’")  # entrambi accettati
        Prefisso_Riga       = row["Prefisso"].strip()
        # verifica apostrofo presente alla fine del prefisso
        PrefissoHaApostrofoFinale = Prefisso_Riga.endswith(apostrofi)
        # --- Estrazione del apostrofato vero o falso ---
        Apostrofato_Riga = row["Apostrofato"].strip().lower() in ("vero", "true", "1", "sì", "si")
        # --- Estrazione del nome dell'elemento ---
        Nome_Riga           = row["Nome"].strip()
        # --- Popolamento memoria ---
        Tipo_Mem_Riga       = row["Tipo"].strip()  # colonna 12
        # --- Estrazione colonne categoria ---
        Martire_Riga        = row["Martire"].strip()
        Dottore_Riga        = row["Dottore della Chiesa"].strip()
        # Categoria_Riga prende il valore della colonna 6
        Categoria_Riga      = row["Categoria"].strip()
        # (contenuti_riga è già stato inizializzato subito dopo la validazione della data)
        # --- Sostituzione solo dei placeholder necessari ---
        contenuti_riga["nome"] = contenuti_riga["nome"].format(nome=Nome_Riga)
        contenuti_riga["prefisso"] = contenuti_riga["prefisso"].format(prefisso=Prefisso_Riga)
        contenuti_riga["apostrofato"] = f"apostrofato: {str(Apostrofato_Riga).lower()}"
        # --- Determinazione beato / santo ---
        prefisso_lower = Prefisso_Riga.lower()  # per confronto case-insensitive
        if "san" in prefisso_lower:
            valore_santo = True
            valore_beato = False
        elif "bea" in prefisso_lower:
            valore_santo = False
            valore_beato = True
        else:
            valore_santo = False
            valore_beato = False
        # --- Aggiornamento dei placeholder nel dizionario per la riga corrente ---
        contenuti_riga["santo"] = f" - santo: {str(valore_santo).lower()}"
        contenuti_riga["beato"] = f" - beato: {str(valore_beato).lower()}"
        # --- Determinazione True/False per frontmatter ---
        valore_martire = "mart" in Martire_Riga.lower()
        valore_dottore = "dot" in Dottore_Riga.lower()
        # Aggiornamento dei placeholder nel dizionario per la riga corrente
        contenuti_riga["martire"] = contenuti_riga["martire"].format(valore_martire = "true" if valore_martire else "false")
        contenuti_riga["dottore"] = contenuti_riga["dottore"].format(valore_dottore = "true" if valore_dottore else "false")
        if Tipo_Mem_Riga:  # se la colonna non è vuota
            contenuti_riga["tipo_memoria"] = contenuti_riga["tipo_memoria"].format(tipo_mem=Tipo_Mem_Riga)
        # altrimenti lascia il placeholder {tipo_mem}
        # Lista dei termini da scartare (case-insensitive)
        scarti = ["martire", "mart", "dottore", "dott"]
        # Normalizzo separatori: virgola e " e " diventano tutti virgole
        categoria_norm = re.sub(r"\s+e\s+", ",", Categoria_Riga, flags=re.I)
        # Split sui separatori (virgola)
        valori = [v.strip() for v in categoria_norm.split(",") if v.strip()]
        # Elimino termini da scartare
        valori_filtrati = [v for v in valori if all(s != v.lower() for s in scarti)]
        # Preparazione del frontmatter per titoli
        if valori_filtrati:
            contenuti_riga["titoli"] = "titoli:"
            # Applico maiuscola alla prima lettera di ciascun valore
            valori_filtrati = [v[0].upper() + v[1:] for v in valori_filtrati]
            # Genero una riga per ciascun valore
            contenuti_riga["titolo_item"] = "\n".join(f"  - {v}" for v in valori_filtrati)
        else:
            # Mantengo placeholder se non ci sono titoli validi
            contenuti_riga["titoli"] = "titoli:"
            contenuti_riga["titolo_item"] = "{item_titolo}"
        # --- Preparazione H1 per markdown ---
        if Prefisso_Riga:
            if PrefissoHaApostrofoFinale:
                # esempio: Sant’ + Almachio → Sant’Almachio
                H1_val = f"{Prefisso_Riga}{Nome_Riga}"
            else:
                # esempio: Beato + Andrea → Beato Andrea
                H1_val = f"{Prefisso_Riga} {Nome_Riga}"
        else:
            H1_val = Nome_Riga
        contenuti_riga["H1"] = contenuti_riga["H1"].format(H1=H1_val)
        # --- Generazione markdown ---
        markdown = "\n".join(contenuti_riga.values())
        # --- Preparazione nome file MD ---
        nome_file_md = f"{int(data_mese):02d}-{int(data_giorno):02d}"  # MM-GG
        # --- Generazione markdown ---
        markdown = "\n".join(contenuti_riga.values())
        # --- Preparazione nome file MD ---
        nome_file_md = f"{int(data_mese):02d}-{int(data_giorno):02d}"  # MM-GG
        # Aggiungo Prefisso_Riga se presente e controllo Apostrofato_Riga per aggiungere apostrofo
        if Prefisso_Riga:
            if PrefissoHaApostrofoFinale:
                    # concateno prefisso direttamente al nome
                    # esempio: Sant’ + Almachio → Sant’Almachio
                    nome_file_md += f" - {Prefisso_Riga}{Nome_Riga}"
            else:
                # prefisso separato dal nome da uno spazio
                # esempio: Beato + Andrea → Beato Andrea
                nome_file_md += f" - {Prefisso_Riga} {Nome_Riga}"
        else:
            nome_file_md += f" - {Nome_Riga}"
        # aggiungo estensione .md
        nome_file_md += ".md"
        # ===== Creazione cartella del mese se non esiste =====
        cartella_mese = os.path.join(OUTPUT_ROOT, f"{int(data_mese):02d}")
        os.makedirs(cartella_mese, exist_ok=True)
        # ===== Percorso completo del file markdown =====
        percorso_md = os.path.join(cartella_mese, nome_file_md)
        # ===== Salvataggio del markdown =====
        # Prima di scrivere, se il file esiste, spostalo in backup con timestamp
        if os.path.exists(percorso_md):
            ts_md_bak = get_timestamp()
            md_base, md_ext = os.path.splitext(percorso_md)
            percorso_md_bak = f"{md_base}_bak{ts_md_bak}{md_ext}"
            shutil.move(percorso_md, percorso_md_bak)
            print(f"File esistente spostato in backup: {percorso_md_bak}")
        with open(percorso_md, "w", encoding="utf-8", newline="\n") as f_md:
            f_md.write(markdown)
        # --- Stampa di controllo ---
        print(f"Elaboro riga {i}: {Nome_Riga} ({data_giorno}-{data_mese}-{data_anno}, {data_mese_LETT})")
        print(f"Nome file MD generato: {nome_file_md}")
        # ===== Dopo aver scritto il file Markdown, rimuoviamo la riga processata
        # dalla lista in memoria e riscriviamo il CSV senza quella riga.
        # Non incrementiamo j: dopo il pop la lista è stata accorciata e all'indice j
        # c'è la riga successiva da processare.
        rows.pop(j)
        # Riscriviamo il CSV originale con le righe rimanenti
        with open(CSV_FILE, 'w', newline='', encoding='utf-8') as f_out:
            writer = csv.DictWriter(f_out, fieldnames=fieldnames, delimiter='§')
            writer.writeheader()
            writer.writerows(rows)
        print(f"Riga {i} rimossa dal CSV: {CSV_FILE}")
# Decidi se aggiornare le costanti nello script sorgente.
# Se l'utente ha fornito `startRow`/`endRow` durante l'esecuzione,
# non modifichiamo né creiamo backup: lasciamo intatte `START_ROW`/`STOP_ROW`.
script_path = os.path.abspath(__file__)
try:
    # verifica se startRow è definito (utente ha inserito un range manuale)
    _ = startRow  # noqa: F821
    user_provided_range = True
except NameError:
    user_provided_range = False
if user_provided_range:
    print("Input utente rilevato (startRow/endRow). Non modifico START_ROW/STOP_ROW nel file.")
else:
    # ===== Salvataggio backup script =====
    # Data e ora corrente nel formato AAAAMMGGHHMMSS
    ts = get_timestamp()
    # Costruzione del nome del backup
    bak_path = script_path.replace(".py", f"{SUFFIX_PY}{ts}.py")
    # Copia del file
    shutil.copyfile(script_path, bak_path)
    print(f"Backup dello script salvato in: {bak_path}")
    # ===== Aggiorna START_ROW / STOP_ROW =====
    window = STOP_ROW - START_ROW
    new_start = STOP_ROW
    new_stop = STOP_ROW + window
    # ===== Aggiornamento START_ROW e STOP_ROW nello script corrente =====
    with open(script_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    for idx, line in enumerate(lines):
        if line.strip().startswith("START_ROW"):
            lines[idx] = f"START_ROW = {new_start}\n"
        if line.strip().startswith("STOP_ROW"):
            lines[idx] = f"STOP_ROW = {new_stop}\n"
    with open(script_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print(f"Script aggiornato: START_ROW={new_start}, STOP_ROW={new_stop}")