import os
from bs4 import BeautifulSoup

BASE_ROOT = r"D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\Santi"
OUTPUT_FILE = os.path.join(BASE_ROOT, "Santi.html")

with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
    # intestazione
    out.write("<!DOCTYPE html>\n<html>\n<head>\n<meta charset='utf-8'>\n"
              "<title>Elenco completo di tutti i Santi</title>\n</head>\n<body>\n")
    for month in [f"{i:02d}" for i in range(1, 13)]:
        month_dir = os.path.join(BASE_ROOT, month)
        if not os.path.isdir(month_dir):
            continue
        for fname in sorted(os.listdir(month_dir)):
            if fname.lower().endswith(".html"):
                fpath = os.path.join(month_dir, fname)
                with open(fpath, "r", encoding="utf-8") as f:
                    soup = BeautifulSoup(f, "html.parser")
                    body = soup.body
                    if body:
                        out.write(body.decode_contents())
                        out.write("\n\n")  # separatore leggero
    # chiusura
    out.write("</body>\n</html>")
