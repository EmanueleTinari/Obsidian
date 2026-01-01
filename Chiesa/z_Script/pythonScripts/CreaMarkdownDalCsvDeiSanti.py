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
    1: "gennaio", 2: "febbraio", 3: "marzo", 4: "aprile", 5: "maggio", 6: "giugno",
    7: "luglio", 8: "agosto", 9: "settembre", 10: "ottobre", 11: "novembre", 12: "dicembre"
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
raw_day = input("Inserisci il giorno da elaborare nella forma gg/mm\n(es. 12/2 [12 febbraio] o 17-4 [17 aprile]).\nPremi Invio per usare riga iniziale/finale: ").strip()
filter_day = None
filter_month = None

if raw_day:
    raw_norm = raw_day.replace("-", "/")
    try:
        d, m = raw_norm.split("/")
        filter_day = int(d)
        filter_month = int(m)
        print(f"→ Filtrerò solo le righe del {filter_day}/{filter_month}.")
    except Exception:
        print("Formato giorno/mese non valido. Procedo a chiedere riga iniziale/finale.")
        raw_day = ""

if not raw_day:
    raw_start = input(f"Riga iniziale (Invio per default {START_ROW}): ").strip()
    raw_stop  = input(f"Riga finale   (Invio per default {STOP_ROW}): ").strip()
    startRow = int(raw_start) if raw_start else START_ROW
    endRow   = int(raw_stop)  if raw_stop  else STOP_ROW
    print(f"→ Elaborerò le righe da {startRow} a {endRow} (end non incluso).")

# ===== Lettura CSV ed elaborazione righe selezionate =====
ts_csv_bak = get_timestamp()
csv_base, csv_ext = os.path.splitext(CSV_FILE)
csv_bak_path = f"{csv_base}_bak{ts_csv_bak}{csv_ext}"
shutil.copyfile(CSV_FILE, csv_bak_path)
print(f"Backup CSV creato: {csv_bak_path}")

with open(CSV_FILE, newline='', encoding='utf-8') as f_in:
    reader = csv.DictReader(f_in, delimiter='§')
    rows = list(reader)
    fieldnames = reader.fieldnames if reader.fieldnames else COLS

j = 0
data_riga_precedente = None
righe_processate = 0

while j < len(rows):
    i = j + 2
    row = rows[j]

    if filter_day is not None:
        data_raw = row.get("Data", "").strip()
        try:
            day_s, month_s, year_s = data_raw.split("/")
            if int(day_s) != filter_day or int(month_s) != filter_month:
                j += 1
                continue
        except Exception:
            j += 1
            continue
    else:
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

    # --- Estrazione data ---
    data_raw = row.get("Data", "").strip()
    def _validate_and_parse_date(s):
        try:
            d, m, y = s.split("/")
            di, mi, yi = int(d), int(m), int(y)
            if not (1 <= mi <= 12 and 1 <= di <= 31): return None
            return (f"{di:02d}", mi, str(yi))
        except Exception:
            return None
    
    parsed = None
    if data_raw:
        parsed = _validate_and_parse_date(data_raw)
    
    if not parsed:
        if data_riga_precedente:
            prompt = input(f"Riga {i}: data mancante o malformata '{data_raw}'. Inserisci data gg/mm/aaaa [Invio = {data_riga_precedente}]: ").strip()
            use_date = prompt if prompt else data_riga_precedente
        else:
            use_date = input(f"Riga {i}: data mancante o malformata '{data_raw}'. Inserisci data gg/mm/aaaa (o 's' per saltare): ").strip()
            if use_date.lower() == 's' or not use_date:
                print(f"Riga {i}: nessuna data valida fornita. Salto la riga.")
                j += 1
                continue
        
        parsed = _validate_and_parse_date(use_date)
        if not parsed:
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
        data_raw = use_date

    data_giorno, data_mese, data_anno = parsed[0], parsed[1], parsed[2]
    data_mese_LETT = MESI.get(int(data_mese), "")
    data_riga_precedente = data_raw

    contenuti_riga = CONTENUTI.copy()
    contenuti_riga["giorno_memoria"] = contenuti_riga["giorno_memoria"].format(giorno_mem=f"{int(data_giorno):02d}")
    contenuti_riga["mese_memoria"] = contenuti_riga["mese_memoria"].format(mese_mem=f"{int(data_mese):02d}")
    contenuti_riga["data_morte"] = contenuti_riga["data_morte"].format(d_morte=f"{int(data_giorno):02d} {data_mese_LETT}")
    item_tag_val = f", giorno, {int(data_giorno):02d}, {data_mese_LETT}"
    contenuti_riga["tags"] = contenuti_riga["tags"].format(item_tag=item_tag_val)

    # --- Logica per il file markdown ---
    Num_Riga = row["Num"].strip()
    Colonna_13 = row["Scheda"].strip()
    Colonna_14 = row["Martirologio romano"].strip()
    numColonna_13 = Colonna_13.split("/")[-1] if Colonna_13 else ""
    numColonna_14 = Colonna_14.split("/")[-1] if Colonna_14 else ""
    url_na = f"https://www.santiebeati.it/dettaglio/{Num_Riga}" if numColonna_13 == Num_Riga or numColonna_14 == Num_Riga else "{url_na}"
    contenuti_riga["fonte_na"] = contenuti_riga["fonte_na"].format(url_na=url_na)

    Prefisso_Riga = row["Prefisso"].strip()
    PrefissoHaApostrofoFinale = Prefisso_Riga.endswith(("'", "’"))
    Apostrofato_Riga = row["Apostrofato"].strip().lower() in ("vero", "true", "1", "sì", "si")
    Nome_Riga = row["Nome"].strip()
    Tipo_Mem_Riga = row["Tipo"].strip()
_Riga = row["Martire"].strip()
    Dottore_Riga = row["Dottore della Chiesa"].strip()
    Categoria_Riga = row["Categoria"].strip()

    contenuti_riga["nome"] = contenuti_riga["nome"].format(nome=Nome_Riga)
    contenuti_riga["prefisso"] = contenuti_riga["prefisso"].format(prefisso=Prefisso_Riga)
    contenuti_riga["apostrofato"] = f"apostrofato: {str(Apostrofato_Riga).lower()}"

    valore_santo = "san" in Prefisso_Riga.lower()
    valore_beato = "bea" in Prefisso_Riga.lower()
    contenuti_riga["santo"] = f"santo: {str(valore_santo).lower()}"
    contenuti_riga["beato"] = f"beato: {str(valore_beato).lower()}"

    valore_martire = "mart" in Martire_Riga.lower()
    valore_dottore = "dot" in Dottore_Riga.lower()
    contenuti_riga["martire"] = contenuti_riga["martire"].format(valore_martire=str(valore_martire).lower())
    contenuti_riga["dottore"] = contenuti_riga["dottore"].format(valore_dottore=str(valore_dottore).lower())
    if Tipo_Mem_Riga:
        contenuti_riga["tipo_memoria"] = contenuti_riga["tipo_memoria"].format(tipo_mem=Tipo_Mem_Riga)

    scarti = ["martire", "mart", "dottore", "dott"]
    categoria_norm = re.sub(r"\s+e\s+", ",", Categoria_Riga, flags=re.I)
    valori = [v.strip() for v in categoria_norm.split(",") if v.strip()]
    valori_filtrati = [v for v in valori if all(s != v.lower() for s in scarti)]
    
    if valori_filtrati:
        contenuti_riga["titoli"] = "titoli:"
        valori_maiusc = [v[0].upper() + v[1:] for v in valori_filtrati]
        contenuti_riga["titolo_item"] = "\n".join(f"  - {v}" for v in valori_maiusc)
    else:
        contenuti_riga["titoli"] = "titoli: {titolo}"

    H1_val = f"{Prefisso_Riga}{Nome_Riga}" if PrefissoHaApostrofoFinale else f"{Prefisso_Riga} {Nome_Riga}" if Prefisso_Riga else Nome_Riga
    contenuti_riga["H1"] = contenuti_riga["H1"].format(H1=H1_val)

    markdown = "\n".join(contenuti_riga.values())
    
    nome_file_md = f"{int(data_mese):02d}-{int(data_giorno):02d}"
    if Prefisso_Riga:
        nome_file_md += f" - {Prefisso_Riga}{Nome_Riga}" if PrefissoHaApostrofoFinale else f" - {Prefisso_Riga} {Nome_Riga}"
    else:
        nome_file_md += f" - {Nome_Riga}"
    nome_file_md += ".md"

    cartella_mese = os.path.join(OUTPUT_ROOT, f"{int(data_mese):02d}")
    os.makedirs(cartella_mese, exist_ok=True)
    percorso_md = os.path.join(cartella_mese, nome_file_md)

    if os.path.exists(percorso_md):
        ts_md_bak = get_timestamp()
        md_base, md_ext = os.path.splitext(percorso_md)
        percorso_md_bak = f"{md_base}_bak{ts_md_bak}{md_ext}"
        shutil.move(percorso_md, percorso_md_bak)
        print(f"File esistente spostato in backup: {percorso_md_bak}")

    with open(percorso_md, "w", encoding="utf-8", newline="\n") as f_md:
        f_md.write(markdown)
    
    print(f"Elaboro riga {i}: {Nome_Riga} ({data_giorno}-{data_mese}-{data_anno})")
    print(f"Nome file MD generato: {nome_file_md}")

    # Rimuoviamo la riga processata dalla lista in memoria.
    # Il CSV verrà riscritto solo alla fine, fuori dal loop.
    rows.pop(j)
    righe_processate += 1

# ===== Riscrive il file CSV in una sola volta con tutte le righe rimanenti =====
if righe_processate > 0:
    print(f"\n...Elaborazione completata. Rimuovo {righe_processate} righe dal CSV...")
    with open(CSV_FILE, 'w', newline='', encoding='utf-8') as f_out:
        writer = csv.DictWriter(f_out, fieldnames=fieldnames, delimiter='§')
        writer.writeheader()
        writer.writerows(rows)
    print(f"File CSV aggiornato con successo: {CSV_FILE}")
else:
    print("\nNessuna riga è stata processata. Il file CSV non è stato modificato.")

# Decidi se aggiornare le costanti nello script sorgente.
script_path = os.path.abspath(__file__)
try:
    _ = startRow
    user_provided_range = True
except NameError:
    user_provided_range = False

if user_provided_range:
    print("Input utente rilevato (startRow/endRow). Non modifico START_ROW/STOP_ROW nel file.")
else:
    # ===== Aggiorna START_ROW / STOP_ROW =====
    ts = get_timestamp()
    bak_path = script_path.replace(".py", f"{SUFFIX_PY}{ts}.py")
    shutil.copyfile(script_path, bak_path)
    print(f"Backup dello script salvato in: {bak_path}")
    
    window = STOP_ROW - START_ROW
    new_start = STOP_ROW
    new_stop = STOP_ROW + window
    
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
