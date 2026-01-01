import csv
import os

# Percorso cartella e CSV originale
OUTPUT_ROOT = r"D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\Santi"
CSV_FILE = os.path.join(OUTPUT_ROOT, "Calendario dei Santi, Martiri, Beati e Testimoni della Fede.csv")

# Colonne del CSV
cols = [
    "Data", "Num", "Prefisso", "Apostrofato", "Nome", "Categoria",
    "Martire", "Sacerdote", "Vescovo", "Dottore della Chiesa",
    "K", "L", "Scheda", "Martirologio romano"
]

# Funzione per trovare nome file con _num incrementale
def next_available_file(base_path):
    base, ext = os.path.splitext(base_path)
    num = 1
    new_path = f"{base}_{num}{ext}"
    while os.path.exists(new_path):
        num += 1
        new_path = f"{base}_{num}{ext}"
    return new_path

# File di output
output_csv = next_available_file(CSV_FILE)

with open(CSV_FILE, newline='', encoding='utf-8') as f_in, \
     open(output_csv, 'w', newline='', encoding='utf-8') as f_out:

    reader = csv.DictReader(f_in, fieldnames=cols, delimiter='§')
    writer = csv.DictWriter(f_out, fieldnames=cols, delimiter='§')
    writer.writeheader()

    # Salta header originale se presente
    next(reader)

    for row in reader:
        # Trim dei valori nella colonna "Data"
        row["Data"] = row["Data"].strip()
        prefisso = row["Prefisso"].strip()  # trim anche per Prefisso
        if prefisso == "":  # se colonna 3 vuota, salto la riga
            writer.writerow(row)
            continue
        if not prefisso.startswith("**"):
            # shift dei valori
            row["K"] = row["Nome"]         # colonna 5 → colonna 11
            row["Nome"] = "**" + row["Prefisso"]  # colonna 3 → colonna 5
            row["Prefisso"] = ""           # opzionale: pulisco colonna 3
        writer.writerow(row)

print(f"CSV corretto salvato in: {output_csv}")

with open(output_csv, newline='', encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter='§')
    righe_errate = []
    for i, row in enumerate(reader, start=2):
        for col in cols:  # oppure lista delle colonne obbligatorie
            if col not in row or row[col].strip() == "":
                righe_errate.append((i, col, row.get(col, None)))
if righe_errate:
    print("Righe con problemi trovate:")
    for r in righe_errate:
        print(f"Riga {r[0]} - Colonna '{r[1]}' = {r[2]}")
    righe_con_errori = set(r[0] for r in righe_errate)
    print(f"\nTotale errori trovati: {len(righe_errate)}")
    print(f"Totale righe con almeno un errore: {len(righe_con_errori)}")
    raise SystemExit
else:
    print("CSV ok, nessun problema rilevato! Proseguo")
