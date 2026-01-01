# -*- coding: utf-8 -*-
"""
Script per estrarre tutti i Santi e Beati da https://www.santiebeati.it/
e generare un CSV con i dati estratti.
"""

import os
import time
import requests
from bs4 import BeautifulSoup
from bs4 import Tag
import csv
import re

OUTPUT_ROOT = r"D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\Santi"

# Array delle pagine
arrayIndirizziBase=[ 'https://www.santiebeati.it/01/01/', 'https://www.santiebeati.it/01/02/', 'https://www.santiebeati.it/01/03/', 'https://www.santiebeati.it/01/04/', 'https://www.santiebeati.it/01/05/', 'https://www.santiebeati.it/01/06/', 'https://www.santiebeati.it/01/07/', 'https://www.santiebeati.it/01/08/', 'https://www.santiebeati.it/01/09/', 'https://www.santiebeati.it/01/10/', 'https://www.santiebeati.it/01/11/', 'https://www.santiebeati.it/01/12/', 'https://www.santiebeati.it/01/13/', 'https://www.santiebeati.it/01/14/', 'https://www.santiebeati.it/01/15/', 'https://www.santiebeati.it/01/16/', 'https://www.santiebeati.it/01/17/', 'https://www.santiebeati.it/01/18/', 'https://www.santiebeati.it/01/19/', 'https://www.santiebeati.it/01/20/', 'https://www.santiebeati.it/01/21/', 'https://www.santiebeati.it/01/22/', 'https://www.santiebeati.it/01/23/', 'https://www.santiebeati.it/01/24/', 'https://www.santiebeati.it/01/25/', 'https://www.santiebeati.it/01/26/', 'https://www.santiebeati.it/01/27/', 'https://www.santiebeati.it/01/28/', 'https://www.santiebeati.it/01/29/', 'https://www.santiebeati.it/01/30/', 'https://www.santiebeati.it/01/31/', 'https://www.santiebeati.it/02/01/', 'https://www.santiebeati.it/02/02/', 'https://www.santiebeati.it/02/03/', 'https://www.santiebeati.it/02/04/', 'https://www.santiebeati.it/02/05/', 'https://www.santiebeati.it/02/06/', 'https://www.santiebeati.it/02/07/', 'https://www.santiebeati.it/02/08/', 'https://www.santiebeati.it/02/09/', 'https://www.santiebeati.it/02/10/', 'https://www.santiebeati.it/02/11/', 'https://www.santiebeati.it/02/12/', 'https://www.santiebeati.it/02/13/', 'https://www.santiebeati.it/02/14/', 'https://www.santiebeati.it/02/15/', 'https://www.santiebeati.it/02/16/', 'https://www.santiebeati.it/02/17/', 'https://www.santiebeati.it/02/18/', 'https://www.santiebeati.it/02/19/', 'https://www.santiebeati.it/02/20/', 'https://www.santiebeati.it/02/21/', 'https://www.santiebeati.it/02/22/', 'https://www.santiebeati.it/02/23/', 'https://www.santiebeati.it/02/24/', 'https://www.santiebeati.it/02/25/', 'https://www.santiebeati.it/02/26/', 'https://www.santiebeati.it/02/27/', 'https://www.santiebeati.it/02/28/', 'https://www.santiebeati.it/02/29/', 'https://www.santiebeati.it/03/01/', 'https://www.santiebeati.it/03/02/', 'https://www.santiebeati.it/03/03/', 'https://www.santiebeati.it/03/04/', 'https://www.santiebeati.it/03/05/', 'https://www.santiebeati.it/03/06/', 'https://www.santiebeati.it/03/07/', 'https://www.santiebeati.it/03/08/', 'https://www.santiebeati.it/03/09/', 'https://www.santiebeati.it/03/10/', 'https://www.santiebeati.it/03/11/', 'https://www.santiebeati.it/03/12/', 'https://www.santiebeati.it/03/13/', 'https://www.santiebeati.it/03/14/', 'https://www.santiebeati.it/03/15/', 'https://www.santiebeati.it/03/16/', 'https://www.santiebeati.it/03/17/', 'https://www.santiebeati.it/03/18/', 'https://www.santiebeati.it/03/19/', 'https://www.santiebeati.it/03/20/', 'https://www.santiebeati.it/03/21/', 'https://www.santiebeati.it/03/22/', 'https://www.santiebeati.it/03/23/', 'https://www.santiebeati.it/03/24/', 'https://www.santiebeati.it/03/25/', 'https://www.santiebeati.it/03/26/', 'https://www.santiebeati.it/03/27/', 'https://www.santiebeati.it/03/28/', 'https://www.santiebeati.it/03/29/', 'https://www.santiebeati.it/03/30/', 'https://www.santiebeati.it/03/31/', 'https://www.santiebeati.it/04/01/', 'https://www.santiebeati.it/04/02/', 'https://www.santiebeati.it/04/03/', 'https://www.santiebeati.it/04/04/', 'https://www.santiebeati.it/04/05/', 'https://www.santiebeati.it/04/06/', 'https://www.santiebeati.it/04/07/', 'https://www.santiebeati.it/04/08/', 'https://www.santiebeati.it/04/09/', 'https://www.santiebeati.it/04/10/', 'https://www.santiebeati.it/04/11/', 'https://www.santiebeati.it/04/12/', 'https://www.santiebeati.it/04/13/', 'https://www.santiebeati.it/04/14/', 'https://www.santiebeati.it/04/15/', 'https://www.santiebeati.it/04/16/', 'https://www.santiebeati.it/04/17/', 'https://www.santiebeati.it/04/18/', 'https://www.santiebeati.it/04/19/', 'https://www.santiebeati.it/04/20/', 'https://www.santiebeati.it/04/21/', 'https://www.santiebeati.it/04/22/', 'https://www.santiebeati.it/04/23/', 'https://www.santiebeati.it/04/24/', 'https://www.santiebeati.it/04/25/', 'https://www.santiebeati.it/04/26/', 'https://www.santiebeati.it/04/27/', 'https://www.santiebeati.it/04/28/', 'https://www.santiebeati.it/04/29/', 'https://www.santiebeati.it/04/30/', 'https://www.santiebeati.it/05/01/', 'https://www.santiebeati.it/05/02/', 'https://www.santiebeati.it/05/03/', 'https://www.santiebeati.it/05/04/', 'https://www.santiebeati.it/05/05/', 'https://www.santiebeati.it/05/06/', 'https://www.santiebeati.it/05/07/', 'https://www.santiebeati.it/05/08/', 'https://www.santiebeati.it/05/09/', 'https://www.santiebeati.it/05/10/', 'https://www.santiebeati.it/05/11/', 'https://www.santiebeati.it/05/12/', 'https://www.santiebeati.it/05/13/', 'https://www.santiebeati.it/05/14/', 'https://www.santiebeati.it/05/15/', 'https://www.santiebeati.it/05/16/', 'https://www.santiebeati.it/05/17/', 'https://www.santiebeati.it/05/18/', 'https://www.santiebeati.it/05/19/', 'https://www.santiebeati.it/05/20/', 'https://www.santiebeati.it/05/21/', 'https://www.santiebeati.it/05/22/', 'https://www.santiebeati.it/05/23/', 'https://www.santiebeati.it/05/24/', 'https://www.santiebeati.it/05/25/', 'https://www.santiebeati.it/05/26/', 'https://www.santiebeati.it/05/27/', 'https://www.santiebeati.it/05/28/', 'https://www.santiebeati.it/05/29/', 'https://www.santiebeati.it/05/30/', 'https://www.santiebeati.it/05/31/', 'https://www.santiebeati.it/06/01/', 'https://www.santiebeati.it/06/02/', 'https://www.santiebeati.it/06/03/', 'https://www.santiebeati.it/06/04/', 'https://www.santiebeati.it/06/05/', 'https://www.santiebeati.it/06/06/', 'https://www.santiebeati.it/06/07/', 'https://www.santiebeati.it/06/08/', 'https://www.santiebeati.it/06/09/', 'https://www.santiebeati.it/06/10/', 'https://www.santiebeati.it/06/11/', 'https://www.santiebeati.it/06/12/', 'https://www.santiebeati.it/06/13/', 'https://www.santiebeati.it/06/14/', 'https://www.santiebeati.it/06/15/', 'https://www.santiebeati.it/06/16/', 'https://www.santiebeati.it/06/17/', 'https://www.santiebeati.it/06/18/', 'https://www.santiebeati.it/06/19/', 'https://www.santiebeati.it/06/20/', 'https://www.santiebeati.it/06/21/', 'https://www.santiebeati.it/06/22/', 'https://www.santiebeati.it/06/23/', 'https://www.santiebeati.it/06/24/', 'https://www.santiebeati.it/06/25/', 'https://www.santiebeati.it/06/26/', 'https://www.santiebeati.it/06/27/', 'https://www.santiebeati.it/06/28/', 'https://www.santiebeati.it/06/29/', 'https://www.santiebeati.it/06/30/', 'https://www.santiebeati.it/07/01/', 'https://www.santiebeati.it/07/02/', 'https://www.santiebeati.it/07/03/', 'https://www.santiebeati.it/07/04/', 'https://www.santiebeati.it/07/05/', 'https://www.santiebeati.it/07/06/', 'https://www.santiebeati.it/07/07/', 'https://www.santiebeati.it/07/08/', 'https://www.santiebeati.it/07/09/', 'https://www.santiebeati.it/07/10/', 'https://www.santiebeati.it/07/11/', 'https://www.santiebeati.it/07/12/', 'https://www.santiebeati.it/07/13/', 'https://www.santiebeati.it/07/14/', 'https://www.santiebeati.it/07/15/', 'https://www.santiebeati.it/07/16/', 'https://www.santiebeati.it/07/17/', 'https://www.santiebeati.it/07/18/', 'https://www.santiebeati.it/07/19/', 'https://www.santiebeati.it/07/20/', 'https://www.santiebeati.it/07/21/', 'https://www.santiebeati.it/07/22/', 'https://www.santiebeati.it/07/23/', 'https://www.santiebeati.it/07/24/', 'https://www.santiebeati.it/07/25/', 'https://www.santiebeati.it/07/26/', 'https://www.santiebeati.it/07/27/', 'https://www.santiebeati.it/07/28/', 'https://www.santiebeati.it/07/29/', 'https://www.santiebeati.it/07/30/', 'https://www.santiebeati.it/07/31/', 'https://www.santiebeati.it/08/01/', 'https://www.santiebeati.it/08/02/', 'https://www.santiebeati.it/08/03/', 'https://www.santiebeati.it/08/04/', 'https://www.santiebeati.it/08/05/', 'https://www.santiebeati.it/08/06/', 'https://www.santiebeati.it/08/07/', 'https://www.santiebeati.it/08/08/', 'https://www.santiebeati.it/08/09/', 'https://www.santiebeati.it/08/10/', 'https://www.santiebeati.it/08/11/', 'https://www.santiebeati.it/08/12/', 'https://www.santiebeati.it/08/13/', 'https://www.santiebeati.it/08/14/', 'https://www.santiebeati.it/08/15/', 'https://www.santiebeati.it/08/16/', 'https://www.santiebeati.it/08/17/', 'https://www.santiebeati.it/08/18/', 'https://www.santiebeati.it/08/19/', 'https://www.santiebeati.it/08/20/', 'https://www.santiebeati.it/08/21/', 'https://www.santiebeati.it/08/22/', 'https://www.santiebeati.it/08/23/', 'https://www.santiebeati.it/08/24/', 'https://www.santiebeati.it/08/25/', 'https://www.santiebeati.it/08/26/', 'https://www.santiebeati.it/08/27/', 'https://www.santiebeati.it/08/28/', 'https://www.santiebeati.it/08/29/', 'https://www.santiebeati.it/08/30/', 'https://www.santiebeati.it/08/31/', 'https://www.santiebeati.it/09/01/', 'https://www.santiebeati.it/09/02/', 'https://www.santiebeati.it/09/03/', 'https://www.santiebeati.it/09/04/', 'https://www.santiebeati.it/09/05/', 'https://www.santiebeati.it/09/06/', 'https://www.santiebeati.it/09/07/', 'https://www.santiebeati.it/09/08/', 'https://www.santiebeati.it/09/09/', 'https://www.santiebeati.it/09/10/', 'https://www.santiebeati.it/09/11/', 'https://www.santiebeati.it/09/12/', 'https://www.santiebeati.it/09/13/', 'https://www.santiebeati.it/09/14/', 'https://www.santiebeati.it/09/15/', 'https://www.santiebeati.it/09/16/', 'https://www.santiebeati.it/09/17/', 'https://www.santiebeati.it/09/18/', 'https://www.santiebeati.it/09/19/', 'https://www.santiebeati.it/09/20/', 'https://www.santiebeati.it/09/21/', 'https://www.santiebeati.it/09/22/', 'https://www.santiebeati.it/09/23/', 'https://www.santiebeati.it/09/24/', 'https://www.santiebeati.it/09/25/', 'https://www.santiebeati.it/09/26/', 'https://www.santiebeati.it/09/27/', 'https://www.santiebeati.it/09/28/', 'https://www.santiebeati.it/09/29/', 'https://www.santiebeati.it/09/30/', 'https://www.santiebeati.it/10/01/', 'https://www.santiebeati.it/10/02/', 'https://www.santiebeati.it/10/03/', 'https://www.santiebeati.it/10/04/', 'https://www.santiebeati.it/10/05/', 'https://www.santiebeati.it/10/06/', 'https://www.santiebeati.it/10/07/', 'https://www.santiebeati.it/10/08/', 'https://www.santiebeati.it/10/09/', 'https://www.santiebeati.it/10/10/', 'https://www.santiebeati.it/10/11/', 'https://www.santiebeati.it/10/12/', 'https://www.santiebeati.it/10/13/', 'https://www.santiebeati.it/10/14/', 'https://www.santiebeati.it/10/15/', 'https://www.santiebeati.it/10/16/', 'https://www.santiebeati.it/10/17/', 'https://www.santiebeati.it/10/18/', 'https://www.santiebeati.it/10/19/', 'https://www.santiebeati.it/10/20/', 'https://www.santiebeati.it/10/21/', 'https://www.santiebeati.it/10/22/', 'https://www.santiebeati.it/10/23/', 'https://www.santiebeati.it/10/24/', 'https://www.santiebeati.it/10/25/', 'https://www.santiebeati.it/10/26/', 'https://www.santiebeati.it/10/27/', 'https://www.santiebeati.it/10/28/', 'https://www.santiebeati.it/10/29/', 'https://www.santiebeati.it/10/30/', 'https://www.santiebeati.it/10/31/', 'https://www.santiebeati.it/11/01/', 'https://www.santiebeati.it/11/02/', 'https://www.santiebeati.it/11/03/', 'https://www.santiebeati.it/11/04/', 'https://www.santiebeati.it/11/05/', 'https://www.santiebeati.it/11/06/', 'https://www.santiebeati.it/11/07/', 'https://www.santiebeati.it/11/08/', 'https://www.santiebeati.it/11/09/', 'https://www.santiebeati.it/11/10/', 'https://www.santiebeati.it/11/11/', 'https://www.santiebeati.it/11/12/', 'https://www.santiebeati.it/11/13/', 'https://www.santiebeati.it/11/14/', 'https://www.santiebeati.it/11/15/', 'https://www.santiebeati.it/11/16/', 'https://www.santiebeati.it/11/17/', 'https://www.santiebeati.it/11/18/', 'https://www.santiebeati.it/11/19/', 'https://www.santiebeati.it/11/20/', 'https://www.santiebeati.it/11/21/', 'https://www.santiebeati.it/11/22/', 'https://www.santiebeati.it/11/23/', 'https://www.santiebeati.it/11/24/', 'https://www.santiebeati.it/11/25/', 'https://www.santiebeati.it/11/26/', 'https://www.santiebeati.it/11/27/', 'https://www.santiebeati.it/11/28/', 'https://www.santiebeati.it/11/29/', 'https://www.santiebeati.it/11/30/', 'https://www.santiebeati.it/12/01/', 'https://www.santiebeati.it/12/02/', 'https://www.santiebeati.it/12/03/', 'https://www.santiebeati.it/12/04/', 'https://www.santiebeati.it/12/05/', 'https://www.santiebeati.it/12/06/', 'https://www.santiebeati.it/12/07/', 'https://www.santiebeati.it/12/08/', 'https://www.santiebeati.it/12/09/', 'https://www.santiebeati.it/12/10/', 'https://www.santiebeati.it/12/11/', 'https://www.santiebeati.it/12/12/', 'https://www.santiebeati.it/12/13/', 'https://www.santiebeati.it/12/14/', 'https://www.santiebeati.it/12/15/', 'https://www.santiebeati.it/12/16/', 'https://www.santiebeati.it/12/17/', 'https://www.santiebeati.it/12/18/', 'https://www.santiebeati.it/12/19/', 'https://www.santiebeati.it/12/20/', 'https://www.santiebeati.it/12/21/', 'https://www.santiebeati.it/12/22/', 'https://www.santiebeati.it/12/23/', 'https://www.santiebeati.it/12/24/', 'https://www.santiebeati.it/12/25/', 'https://www.santiebeati.it/12/26/', 'https://www.santiebeati.it/12/27/', 'https://www.santiebeati.it/12/28/', 'https://www.santiebeati.it/12/29/', 'https://www.santiebeati.it/12/30/', 'https://www.santiebeati.it/12/31/'] 

# Blocchi commentati da eliminare
BLOCCHI_COMMENTATI = [
    ("<!-- Tag TM Footer o Slide-in -->", "<!-- Fine Tag TM -->"),
    ("<!-- Google Tag Manager -->", "<!-- End Google Tag Manager -->"),
    ("<!-- Ezoic Script di Privacy -->", "<!-- Fine Ezoic Script di Privacy -->"),
    ("<!-- Ezoic Header Script -->", "<!-- Fine Ezoic Header Script -->"),
    ("<!-- Modulo Newsletter -->", "<!-- Fine Modulo Newsletter -->")
]

def elimina_blocchi_commentati(html):
    for inizio, fine in BLOCCHI_COMMENTATI:
        pattern = re.compile(
            re.escape(inizio) + r".*?" +
            re.escape(fine),
            re.DOTALL | re.IGNORECASE
        )
        html = pattern.sub("", html)
    return html

def pulisci_html(html):
    # Elimina blocchi commentati via regex prima
    html = elimina_blocchi_commentati(html)
    soup = BeautifulSoup(html, "html.parser")     # BeautifulSoup rileva UTF-8 correttamente
    # Elimina <script>, <style>, <iframe>, <link>, <center>
    for tag in soup(["script", "style", "iframe", "link", "center"]):
        tag.decompose()
    # Elimina la penultima e l'ultima <table>…</table>
    tabelle = soup.find_all("table")
    # Loop su tutte le tabelle principali
    for parent_table in tabelle:
        # Trova il primo <td> all'interno della tabella padre
        td = parent_table.find("td")
        if td:
            # Prendi tutte le tabelle figlie dirette del td
            child_tables = td.find_all("table", recursive=False)
            # Applica solo se ci sono almeno 4 figlie
            if len(child_tables) > 3:
                # Indici da eliminare
                indices_to_remove = [0, 1, 3]
                # Elimina solo se esistono, dall'indice più alto al più basso
                for i in sorted(indices_to_remove, reverse=True):
                    if i < len(child_tables):
                        child_tables[i].decompose()
    # Ricostruisci soup aggiornato
    html = str(soup)
    soup = BeautifulSoup(html, "html.parser")
    tabelle = soup.find_all("table")
    # Elimina TD specifici nella tabella interna
    for parent_table in tabelle:
        td = parent_table.find("td")
        if td:
            # Trova la prima tabella figlia diretta dentro il td
            child_table = td.find("table", recursive=False)
            if child_table:
                # Trova la prima riga della tabella interna
                first_tr = child_table.find("tr")
                if first_tr:
                    # Prendi tutti i td diretti della riga
                    tds = first_tr.find_all("td", recursive=False)
                    # Indici da eliminare
                    indices_to_remove = [0, 3, 4]
                    # Elimina dall'indice più alto al più basso
                    for k in sorted(indices_to_remove, reverse=True):
                        if k < len(tds):
                            tds[k].decompose()
    # Elimina il TD con background="/images/blu.jpg"
    for td in soup.find_all("td"):
        if td.get("background") == "/images/blu.jpg":
            td.decompose()
    # Elimina le tabelle annidate
    # Collassa tutte le table annidate lasciando solo la più interna
    while True:
        changed = False
        # Cerca una table che contenga altre table (cioè una "esterna")
        for outer in soup.find_all("table"):
            # trova la lista di tutte le table discendenti (incluse quelle annidate)
            descendants = outer.find_all("table")
            # se non ci sono discendenti, questa outer non è annidata -> continua
            if len(descendants) <= 1:
                continue
            # prendi l'ultima table discendente (la più interna)
            inner = descendants[-1]
            # estrai la inner dal DOM e sostituisci l'outer con la inner
            inner_extracted = inner.extract()
            outer.replace_with(inner_extracted)
            changed = True
            break   # ricomincia il while con DOM aggiornato
        if not changed:
            break
    # Elimina tutti i paragrafi vuoti
    for p in soup.find_all("p"):
        if not p.get_text(strip=True):
            p.decompose()
    # Riduce sequenze di <br> consecutivi a uno solo
    br = soup.find("br")
    while br:
        nxt = br.next_sibling
        # Salta spazi o newline tra i <br>
        while nxt and isinstance(nxt, str) and nxt.strip() == "":
            nxt = nxt.next_sibling
        # Rimuovi tutti i <br> consecutivi dopo il primo
        while nxt and getattr(nxt, "name", None) == "br":
            to_remove = nxt
            nxt = nxt.next_sibling
            if getattr(to_remove, "decompose", None):
                to_remove.decompose()
        # Passa al prossimo <br>
        br = br.find_next("br")
    # Elimina <font> vuoti
    for font in soup.find_all("font"):
        if not font.get_text(strip=True):
            font.decompose()
    # Elimina <p> vuoti o con solo spazi/newline
    for p in soup.find_all("p"):
        if not p.get_text(strip=True):
            p.decompose()
    for table in soup.find_all("table"):
        # Trova tutti i td discendenti
        tds = table.find_all("td", recursive=True)
        # Inserisci i td al posto della table
        for td in reversed(tds):  # reversed per non rompere l'ordine
            table.insert_after(td.extract())
        # Elimina table, tbody e tr
        for tag_name in ["table", "tbody", "tr"]:
            for tag in table.find_all(tag_name, recursive=True):
                tag.decompose()
        # Infine elimina la table stessa
        table.decompose()
    for tag in soup.find_all(attrs={"bgcolor": True}):
        if tag["bgcolor"].strip().lower() == "#cccccc":
            tag["bgcolor"] = "white"
    for f in soup.find_all("font"):
        # Se color="#999999" e size="-2"
        if f.get("color") and f["color"].strip().lower() == "#999999" and f.get("size") == "-2":
            f["size"] = "+2"
            del f["color"]
            continue
        # Se size="-2" e non ha color
        if f.get("size") == "-2" and not f.get("color"):
            f["size"] = "+2"
        # Se color="#ffffff" → "#000000"
        if f.get("color") and f["color"].strip().lower() == "#ffffff":
            f["color"] = "#000000"
        # Nuova regola: qualunque size="-2" → "+2"
        if f.get("size") == "-2":
            f["size"] = "+2"
        # Nuova regola: qualunque size="-1" → "+1"
        if f.get("size") == "-1":
            f["size"] = "+1"
    # Rimuovi tutti gli attributi dal tag <body>
    body = soup.find("body")
    if body:
        body.attrs = {}

    html = str(soup)
    # Normalizza fine riga: sostituisci \r\n → \n e poi elimina linee vuote
    html = html.replace("\r\n", "\n")
    html = re.sub(r'^\s*\n', '', html, flags=re.MULTILINE)
    return html

for url in arrayIndirizziBase:
    print(f"Processing: {url}")
    # Estrai mese/giorno dal link
    parts = url.strip("/").split("/")[-2:]
    mese = parts[0]  # "01".."12"
    # cartella di destinazione
    mese_dir = os.path.join(OUTPUT_ROOT, mese)
    os.makedirs(mese_dir, exist_ok=True)
    try:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
    except Exception as e:
        print(f"Errore nel download {url}: {e}")
        time.sleep(3)
        continue
    time.sleep(3)
    html = r.content    # byte raw
    html = r.content.decode("utf-8")   # ora html è stringa
    html = pulisci_html(html)
    soup = BeautifulSoup(html, "html.parser")
    titolo = soup.title.string.strip() if soup.title else "pagina_senza_titolo"
    # Nome file (sanifica caratteri non validi)
    safe_title = re.sub(r'[<>:"/\\|?*]', '_', titolo)
    base_path = os.path.join(mese_dir, safe_title + ".html")
    file_path = base_path
    # Se esiste già, aggiungi _numero incrementale
    if os.path.exists(file_path):
        n = 1
        # cerca pattern _X già esistenti e usa il massimo+1
        pattern = re.compile(re.escape(safe_title) + r'_(\d+)\.html$')
        existing_nums = []
        for fname in os.listdir(mese_dir):
            m = pattern.match(fname)
            if m:
                existing_nums.append(int(m.group(1)))
        if existing_nums:
            n = max(existing_nums) + 1
        file_path = os.path.join(mese_dir, f"{safe_title}_{n}.html")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Salvato: {file_path}")
