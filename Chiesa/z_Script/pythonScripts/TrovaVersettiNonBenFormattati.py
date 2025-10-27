import os
import re
from datetime import datetime

# ---------------- CONFIG ----------------
vault_path = r"D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa"

# Nome file con data di esecuzione
resto_nome = " File con Rif non formattati.md"
pattern = os.path.join(vault_path, f"*{resto_nome}")
esistenti = [f for f in os.listdir(vault_path) if f.endswith(resto_nome)]
if esistenti:
    output_file = os.path.join(vault_path, datetime.now().strftime("%d-%m-%Y") + resto_nome)
    os.rename(os.path.join(vault_path, esistenti[0]), output_file)
else:
    output_file = os.path.join(vault_path, datetime.now().strftime("%d-%m-%Y") + resto_nome)

# ---------------- REGEX ----------------
import re

# ---------------- REGEX ----------------
verse_regex = re.compile(
    r'([ ]?[\(]?)'                          # gruppo 1: spazio o parentesi aperta opzionale
    r'((?:I{1,3}|[1-3])\s?[A-Za-z]{2,3})'  # gruppo 2: libro con numero romano o arabo
    r'\s?(\d{1,3})'                         # gruppo 3: capitolo
    r',\s?(\d{1,2})'                        # gruppo 4: versetto iniziale
    r'(?:-(\d{1,2}))?'                       # gruppo 5: intervallo opzionale
    r'([\)]?)'                               # gruppo 6: parentesi chiusa opzionale
)
# ---------------- FUNZIONI ----------------
def relative_path(full_path):
    return os.path.relpath(full_path, vault_path).replace("\\", "/")

def print_progress(current, total, bar_length=30):
    percent = float(current) / total
    arrow = '#' * int(round(percent * bar_length))
    spaces = '-' * (bar_length - len(arrow))
    print(f"\r[{arrow}{spaces}] {int(percent*100)}% ({current}/{total})", end='')

# ---------------- RACCOLTA FILE ----------------
md_files = []
for root, dirs, files in os.walk(vault_path):
    for file in files:
        if file.lower().endswith(".md"):
            md_files.append(os.path.join(root, file))

total_files = len(md_files)
print(f"Trovati {total_files} file .MD da scansionare.\nOutput file: {output_file}\n")
# ---------------- PROCESS ----------------
with open(output_file, "a", encoding="utf-8") as out_f:
    for idx, full_path in enumerate(md_files, start=1):
        print_progress(idx, total_files)
        try:
            with open(full_path, "r", encoding="utf-8") as f:
                for i, line in enumerate(f, start=1):
                    matches = list(verse_regex.finditer(line))  # usiamo finditer per indici
                    match_trovato = False
                    versetti_scritti = set()  # per evitare duplicati nella stessa riga

                    for match in matches:
                        # Unpack dei gruppi del regex
                        spazio_paren = match.group(1)
                        libro = match.group(2)
                        capitolo = match.group(3)
                        v1 = match.group(4)
                        intervallo = match.group(5) if match.group(5) else ''
                        paren_dx = match.group(6) if match.lastindex >= 6 and match.group(6) else ''

                        versetto_testo = f"{spazio_paren}{libro} {capitolo},{v1}"
                        if intervallo:
                            versetto_testo += f"-{intervallo}"
                        versetto_testo += paren_dx

                        # Controllo duplicati nella stessa riga
                        if versetto_testo in versetti_scritti:
                            continue
                        versetti_scritti.add(versetto_testo)

                        # Controllo stringa PRIMA
                        start_idx = match.start()
                        check_prima = '*<span class="BibleRef">[['
                        if start_idx >= len(check_prima) and line[start_idx-len(check_prima):start_idx] == check_prima:
                            continue  # salta versetti già formattati

                        # Controllo stringa DOPO
                        end_idx = match.end()
                        check_dopo = ']]</span>*'
                        if line[end_idx:end_idx+len(check_dopo)] == check_dopo:
                            continue  # salta versetti già formattati

                        # Scrittura nel file output
                        line_to_write = f"{full_path} [[{relative_path(full_path)}|{os.path.basename(full_path)}]] [{i}: {versetto_testo}]"
                        out_f.write(line_to_write + "\n")
                        match_trovato = True

                    # separatore tra file solo se ci sono match
                    if match_trovato:
                        out_f.write("\n***\n\n")

        except Exception as e:
            print(f"\nErrore con file {full_path}: {e}")

print_progress(total_files, total_files)
print("\n\nRicerca completata. Risultati aggiunti a:", output_file)
