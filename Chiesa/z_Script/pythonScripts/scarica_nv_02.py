import os
import requests
from bs4 import BeautifulSoup
from pathlib import Path

# === CONFIG ===
book_code = "exodus"  # es: 'genesis', 'exodus', 'leviticus'
book_abbr = "Es"       # italiano: 'Gn', 'Es', ...
book_lat = "Exodus"    # latino completo
book_number = "02"     # 2 cifre, es: '01' per Genesi
version_abbr = "NV"    # NV = Nova Vulgata

# === Percorsi ===
root = Path(r"D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\_08 - tmpPythonNV")
html_dir = root / "HTML"
md_dir = root / "MD"

html_dir.mkdir(parents=True, exist_ok=True)
md_dir.mkdir(parents=True, exist_ok=True)

# === 1. Scarica HTML ===
html_url = f"https://www.vatican.va/archive/bible/nova_vulgata/documents/nova-vulgata_vt_{book_code}_lt.html"
html_path = html_dir / f"nova-vulgata_vt_{book_code}_lt.html"

if not html_path.exists():
    print(f"Scarico {html_url}...")
    r = requests.get(html_url)
    html_path.write_bytes(r.content)
    print("✔ HTML scaricato.")
else:
    print("✔ HTML già presente in locale.")

# === 2. Parsing e generazione MD ===
with open(html_path, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

# Trova tutti i <a name="X"> per determinare l’inizio dei capitoli
chapters = {}
for a in soup.find_all("a", attrs={"name": True}):
    name = a["name"]
    if name.isdigit():
        chapters[int(name)] = a

sorted_chapters = sorted(chapters.items())

for idx, (cap, a_start) in enumerate(sorted_chapters):
    a_end = sorted_chapters[idx+1][1] if idx + 1 < len(sorted_chapters) else None

    # Estrai tutto il contenuto tra <a name="cap"> e il prossimo
    content = []
    node = a_start.next_sibling
    while node and node != a_end:
        if node.name == "p":
            txt = node.get_text(" ", strip=True)
            if txt and txt[0].isdigit():
                try:
                    verse_num, verse_txt = txt.split(" ", 1)
                    content.append((verse_num, verse_txt))
                except ValueError:
                    pass
        node = node.next_sibling

    # === Genera il contenuto MD ===
    cap_str = f"{cap:02d}"
    filename = f"{version_abbr} {book_abbr} {cap_str}.md"
    filepath = md_dir / filename

    # === Frontmatter ===
    aliases = [
        f"{version_abbr} {book_abbr} {cap_str}",
        f"{version_abbr} {book_lat} {cap}",
        f"{book_lat} {cap}",
        f"{book_abbr} {cap}",
        f"{book_lat} {cap}".upper(),
        f"{book_lat} {cap}".lower(),
        f"{book_abbr} {cap}".upper(),
        f"{book_abbr} {cap}".lower(),
        f"{book_abbr}{cap}",
        f"{book_abbr}{cap_str}",
        f"{book_lat}{cap}",
        f"{book_lat}{cap_str}"
    ]

    tags = [
        f"Antico_Testamento/Pentateuco/Esodo/Capitolo_{cap}",
        f"Vecchio_Testamento/Pentateuco/Esodo/Capitolo_{cap}",
        "Antico_Testamento",
        "Vecchio_Testamento",
        "Il_Pentateuco",
        "Pentateuco",
        "Esodo",
        f"Esodo_Capitolo_{cap}"
    ]
    # Aggiungi tag in latino solo per Nova Vulgata e Vulgata Latina
    tags += ["Exudus", f"Exodus_{cap}"]

    frontmatter = "---\n"
    frontmatter += f'aliases:\n'
    for alias in aliases:
        frontmatter += f'  - {alias}\n'
    frontmatter += f'tags:\n'
    for tag in tags:
        frontmatter += f'  - {tag}\n'
    frontmatter += f'url-testo: "[Link al testo]({html_url})"\n'
    frontmatter += "---\n\n"

    # === Menu superiore (esempio base, da adattare a seconda del capitolo) ===
    menu_top = f"""> [[La Sacra Bibbia/Nova Vulgata/AT - 01 Genesi/NV Genesi|↑ Genesis]] | [[La Sacra Bibbia/Nova Vulgata/AT - {book_number} {book_abbr}/NV {book_lat}| ← {book_lat}]] <span class="bianco">| {book_lat} {cap} |</span> [[La Sacra Bibbia/Nova Vulgata/AT - {book_number} {book_abbr}/NV {book_abbr} {cap+1:02d}|{book_lat} {cap+1} →]]\n>> <span class="verde">Altre versioni:</span>\n>> Vulgata Latina, [[La Sacra Bibbia/Vulgata Latina/AT - {book_number} {book_abbr}/VL {book_abbr} {cap_str}|{book_lat} {cap}]]\n"""

    # === Versetti ===
    verses = ""
    verses += f"# {book_lat} {cap}\n\n"
    for num, txt in content:
        verses += f"###### {num}\n"
        verses += f"<span class='vrs'>{num}</span> {txt}\n\n"

    # === Menu inferiore ===
    menu_bottom = f"[[La Sacra Bibbia/Nova Vulgata/AT - {book_number} {book_abbr}/NV {book_lat}|{book_lat}]] | {book_lat} {cap} | [[La Sacra Bibbia/Nova Vulgata/AT - {book_number} {book_abbr}/NV {book_abbr} {cap+1:02d}|{book_lat} {cap+1} →]]"

    # === Scrivi il file ===
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(frontmatter)
        f.write(menu_top)
        f.write("\n---\n\n")
        f.write(verses)
        f.write("---\n\n")
        f.write(menu_bottom)

    print(f"✔ Creato: {filename}")