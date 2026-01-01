# -*- coding: utf-8 -*-
"""
Script per estrarre tutti i Santi e Beati da https://www.santiebeati.it/
e generare file Markdown per ogni giorno dell'anno.
"""
import os
import time
import requests
from bs4 import BeautifulSoup
import csv
import re
from urllib.parse import urljoin

# --- CONFIGURAZIONI ---
# Array delle pagine
arrayIndirizziBase=[ 'https://www.santiebeati.it/01/01/', 'https://www.santiebeati.it/01/02/', 'https://www.santiebeati.it/01/03/', 'https://www.santiebeati.it/01/04/', 'https://www.santiebeati.it/01/05/', 'https://www.santiebeati.it/01/06/', 'https://www.santiebeati.it/01/07/', 'https://www.santiebeati.it/01/08/', 'https://www.santiebeati.it/01/09/', 'https://www.santiebeati.it/01/10/', 'https://www.santiebeati.it/01/11/', 'https://www.santiebeati.it/01/12/', 'https://www.santiebeati.it/01/13/', 'https://www.santiebeati.it/01/14/', 'https://www.santiebeati.it/01/15/', 'https://www.santiebeati.it/01/16/', 'https://www.santiebeati.it/01/17/', 'https://www.santiebeati.it/01/18/', 'https://www.santiebeati.it/01/19/', 'https://www.santiebeati.it/01/20/', 'https://www.santiebeati.it/01/21/', 'https://www.santiebeati.it/01/22/', 'https://www.santiebeati.it/01/23/', 'https://www.santiebeati.it/01/24/', 'https://www.santiebeati.it/01/25/', 'https://www.santiebeati.it/01/26/', 'https://www.santiebeati.it/01/27/', 'https://www.santiebeati.it/01/28/', 'https://www.santiebeati.it/01/29/', 'https://www.santiebeati.it/01/30/', 'https://www.santiebeati.it/01/31/', 'https://www.santiebeati.it/02/01/', 'https://www.santiebeati.it/02/02/', 'https://www.santiebeati.it/02/03/', 'https://www.santiebeati.it/02/04/', 'https://www.santiebeati.it/02/05/', 'https://www.santiebeati.it/02/06/', 'https://www.santiebeati.it/02/07/', 'https://www.santiebeati.it/02/08/', 'https://www.santiebeati.it/02/09/', 'https://www.santiebeati.it/02/10/', 'https://www.santiebeati.it/02/11/', 'https://www.santiebeati.it/02/12/', 'https://www.santiebeati.it/02/13/', 'https://www.santiebeati.it/02/14/', 'https://www.santiebeati.it/02/15/', 'https://www.santiebeati.it/02/16/', 'https://www.santiebeati.it/02/17/', 'https://www.santiebeati.it/02/18/', 'https://www.santiebeati.it/02/19/', 'https://www.santiebeati.it/02/20/', 'https://www.santiebeati.it/02/21/', 'https://www.santiebeati.it/02/22/', 'https://www.santiebeati.it/02/23/', 'https://www.santiebeati.it/02/24/', 'https://www.santiebeati.it/02/25/', 'https://www.santiebeati.it/02/26/', 'https://www.santiebeati.it/02/27/', 'https://www.santiebeati.it/02/28/', 'https://www.santiebeati.it/02/29/', 'https://www.santiebeati.it/03/01/', 'https://www.santiebeati.it/03/02/', 'https://www.santiebeati.it/03/03/', 'https://www.santiebeati.it/03/04/', 'https://www.santiebeati.it/03/05/', 'https://www.santiebeati.it/03/06/', 'https://www.santiebeati.it/03/07/', 'https://www.santiebeati.it/03/08/', 'https://www.santiebeati.it/03/09/', 'https://www.santiebeati.it/03/10/', 'https://www.santiebeati.it/03/11/', 'https://www.santiebeati.it/03/12/', 'https://www.santiebeati.it/03/13/', 'https://www.santiebeati.it/03/14/', 'https://www.santiebeati.it/03/15/', 'https://www.santiebeati.it/03/16/', 'https://www.santiebeati.it/03/17/', 'https://www.santiebeati.it/03/18/', 'https://www.santiebeati.it/03/19/', 'https://www.santiebeati.it/03/20/', 'https://www.santiebeati.it/03/21/', 'https://www.santiebeati.it/03/22/', 'https://www.santiebeati.it/03/23/', 'https://www.santiebeati.it/03/24/', 'https://www.santiebeati.it/03/25/', 'https://www.santiebeati.it/03/26/', 'https://www.santiebeati.it/03/27/', 'https://www.santiebeati.it/03/28/', 'https://www.santiebeati.it/03/29/', 'https://www.santiebeati.it/03/30/', 'https://www.santiebeati.it/03/31/', 'https://www.santiebeati.it/04/01/', 'https://www.santiebeati.it/04/02/', 'https://www.santiebeati.it/04/03/', 'https://www.santiebeati.it/04/04/', 'https://www.santiebeati.it/04/05/', 'https://www.santiebeati.it/04/06/', 'https://www.santiebeati.it/04/07/', 'https://www.santiebeati.it/04/08/', 'https://www.santiebeati.it/04/09/', 'https://www.santiebeati.it/04/10/', 'https://www.santiebeati.it/04/11/', 'https://www.santiebeati.it/04/12/', 'https://www.santiebeati.it/04/13/', 'https://www.santiebeati.it/04/14/', 'https://www.santiebeati.it/04/15/', 'https://www.santiebeati.it/04/16/', 'https://www.santiebeati.it/04/17/', 'https://www.santiebeati.it/04/18/', 'https://www.santiebeati.it/04/19/', 'https://www.santiebeati.it/04/20/', 'https://www.santiebeati.it/04/21/', 'https://www.santiebeati.it/04/22/', 'https://www.santiebeati.it/04/23/', 'https://www.santiebeati.it/04/24/', 'https://www.santiebeati.it/04/25/', 'https://www.santiebeati.it/04/26/', 'https://www.santiebeati.it/04/27/', 'https://www.santiebeati.it/04/28/', 'https://www.santiebeati.it/04/29/', 'https://www.santiebeati.it/04/30/', 'https://www.santiebeati.it/05/01/', 'https://www.santiebeati.it/05/02/', 'https://www.santiebeati.it/05/03/', 'https://www.santiebeati.it/05/04/', 'https://www.santiebeati.it/05/05/', 'https://www.santiebeati.it/05/06/', 'https://www.santiebeati.it/05/07/', 'https://www.santiebeati.it/05/08/', 'https://www.santiebeati.it/05/09/', 'https://www.santiebeati.it/05/10/', 'https://www.santiebeati.it/05/11/', 'https://www.santiebeati.it/05/12/', 'https://www.santiebeati.it/05/13/', 'https://www.santiebeati.it/05/14/', 'https://www.santiebeati.it/05/15/', 'https://www.santiebeati.it/05/16/', 'https://www.santiebeati.it/05/17/', 'https://www.santiebeati.it/05/18/', 'https://www.santiebeati.it/05/19/', 'https://www.santiebeati.it/05/20/', 'https://www.santiebeati.it/05/21/', 'https://www.santiebeati.it/05/22/', 'https://www.santiebeati.it/05/23/', 'https://www.santiebeati.it/05/24/', 'https://www.santiebeati.it/05/25/', 'https://www.santiebeati.it/05/26/', 'https://www.santiebeati.it/05/27/', 'https://www.santiebeati.it/05/28/', 'https://www.santiebeati.it/05/29/', 'https://www.santiebeati.it/05/30/', 'https://www.santiebeati.it/05/31/', 'https://www.santiebeati.it/06/01/', 'https://www.santiebeati.it/06/02/', 'https://www.santiebeati.it/06/03/', 'https://www.santiebeati.it/06/04/', 'https://www.santiebeati.it/06/05/', 'https://www.santiebeati.it/06/06/', 'https://www.santiebeati.it/06/07/', 'https://www.santiebeati.it/06/08/', 'https://www.santiebeati.it/06/09/', 'https://www.santiebeati.it/06/10/', 'https://www.santiebeati.it/06/11/', 'https://www.santiebeati.it/06/12/', 'https://www.santiebeati.it/06/13/', 'https://www.santiebeati.it/06/14/', 'https://www.santiebeati.it/06/15/', 'https://www.santiebeati.it/06/16/', 'https://www.santiebeati.it/06/17/', 'https://www.santiebeati.it/06/18/', 'https://www.santiebeati.it/06/19/', 'https://www.santiebeati.it/06/20/', 'https://www.santiebeati.it/06/21/', 'https://www.santiebeati.it/06/22/', 'https://www.santiebeati.it/06/23/', 'https://www.santiebeati.it/06/24/', 'https://www.santiebeati.it/06/25/', 'https://www.santiebeati.it/06/26/', 'https://www.santiebeati.it/06/27/', 'https://www.santiebeati.it/06/28/', 'https://www.santiebeati.it/06/29/', 'https://www.santiebeati.it/06/30/', 'https://www.santiebeati.it/07/01/', 'https://www.santiebeati.it/07/02/', 'https://www.santiebeati.it/07/03/', 'https://www.santiebeati.it/07/04/', 'https://www.santiebeati.it/07/05/', 'https://www.santiebeati.it/07/06/', 'https://www.santiebeati.it/07/07/', 'https://www.santiebeati.it/07/08/', 'https://www.santiebeati.it/07/09/', 'https://www.santiebeati.it/07/10/', 'https://www.santiebeati.it/07/11/', 'https://www.santiebeati.it/07/12/', 'https://www.santiebeati.it/07/13/', 'https://www.santiebeati.it/07/14/', 'https://www.santiebeati.it/07/15/', 'https://www.santiebeati.it/07/16/', 'https://www.santiebeati.it/07/17/', 'https://www.santiebeati.it/07/18/', 'https://www.santiebeati.it/07/19/', 'https://www.santiebeati.it/07/20/', 'https://www.santiebeati.it/07/21/', 'https://www.santiebeati.it/07/22/', 'https://www.santiebeati.it/07/23/', 'https://www.santiebeati.it/07/24/', 'https://www.santiebeati.it/07/25/', 'https://www.santiebeati.it/07/26/', 'https://www.santiebeati.it/07/27/', 'https://www.santiebeati.it/07/28/', 'https://www.santiebeati.it/07/29/', 'https://www.santiebeati.it/07/30/', 'https://www.santiebeati.it/07/31/', 'https://www.santiebeati.it/08/01/', 'https://www.santiebeati.it/08/02/', 'https://www.santiebeati.it/08/03/', 'https://www.santiebeati.it/08/04/', 'https://www.santiebeati.it/08/05/', 'https://www.santiebeati.it/08/06/', 'https://www.santiebeati.it/08/07/', 'https://www.santiebeati.it/08/08/', 'https://www.santiebeati.it/08/09/', 'https://www.santiebeati.it/08/10/', 'https://www.santiebeati.it/08/11/', 'https://www.santiebeati.it/08/12/', 'https://www.santiebeati.it/08/13/', 'https://www.santiebeati.it/08/14/', 'https://www.santiebeati.it/08/15/', 'https://www.santiebeati.it/08/16/', 'https://www.santiebeati.it/08/17/', 'https://www.santiebeati.it/08/18/', 'https://www.santiebeati.it/08/19/', 'https://www.santiebeati.it/08/20/', 'https://www.santiebeati.it/08/21/', 'https://www.santiebeati.it/08/22/', 'https://www.santiebeati.it/08/23/', 'https://www.santiebeati.it/08/24/', 'https://www.santiebeati.it/08/25/', 'https://www.santiebeati.it/08/26/', 'https://www.santiebeati.it/08/27/', 'https://www.santiebeati.it/08/28/', 'https://www.santiebeati.it/08/29/', 'https://www.santiebeati.it/08/30/', 'https://www.santiebeati.it/08/31/', 'https://www.santiebeati.it/09/01/', 'https://www.santiebeati.it/09/02/', 'https://www.santiebeati.it/09/03/', 'https://www.santiebeati.it/09/04/', 'https://www.santiebeati.it/09/05/', 'https://www.santiebeati.it/09/06/', 'https://www.santiebeati.it/09/07/', 'https://www.santiebeati.it/09/08/', 'https://www.santiebeati.it/09/09/', 'https://www.santiebeati.it/09/10/', 'https://www.santiebeati.it/09/11/', 'https://www.santiebeati.it/09/12/', 'https://www.santiebeati.it/09/13/', 'https://www.santiebeati.it/09/14/', 'https://www.santiebeati.it/09/15/', 'https://www.santiebeati.it/09/16/', 'https://www.santiebeati.it/09/17/', 'https://www.santiebeati.it/09/18/', 'https://www.santiebeati.it/09/19/', 'https://www.santiebeati.it/09/20/', 'https://www.santiebeati.it/09/21/', 'https://www.santiebeati.it/09/22/', 'https://www.santiebeati.it/09/23/', 'https://www.santiebeati.it/09/24/', 'https://www.santiebeati.it/09/25/', 'https://www.santiebeati.it/09/26/', 'https://www.santiebeati.it/09/27/', 'https://www.santiebeati.it/09/28/', 'https://www.santiebeati.it/09/29/', 'https://www.santiebeati.it/09/30/', 'https://www.santiebeati.it/10/01/', 'https://www.santiebeati.it/10/02/', 'https://www.santiebeati.it/10/03/', 'https://www.santiebeati.it/10/04/', 'https://www.santiebeati.it/10/05/', 'https://www.santiebeati.it/10/06/', 'https://www.santiebeati.it/10/07/', 'https://www.santiebeati.it/10/08/', 'https://www.santiebeati.it/10/09/', 'https://www.santiebeati.it/10/10/', 'https://www.santiebeati.it/10/11/', 'https://www.santiebeati.it/10/12/', 'https://www.santiebeati.it/10/13/', 'https://www.santiebeati.it/10/14/', 'https://www.santiebeati.it/10/15/', 'https://www.santiebeati.it/10/16/', 'https://www.santiebeati.it/10/17/', 'https://www.santiebeati.it/10/18/', 'https://www.santiebeati.it/10/19/', 'https://www.santiebeati.it/10/20/', 'https://www.santiebeati.it/10/21/', 'https://www.santiebeati.it/10/22/', 'https://www.santiebeati.it/10/23/', 'https://www.santiebeati.it/10/24/', 'https://www.santiebeati.it/10/25/', 'https://www.santiebeati.it/10/26/', 'https://www.santiebeati.it/10/27/', 'https://www.santiebeati.it/10/28/', 'https://www.santiebeati.it/10/29/', 'https://www.santiebeati.it/10/30/', 'https://www.santiebeati.it/10/31/', 'https://www.santiebeati.it/11/01/', 'https://www.santiebeati.it/11/02/', 'https://www.santiebeati.it/11/03/', 'https://www.santiebeati.it/11/04/', 'https://www.santiebeati.it/11/05/', 'https://www.santiebeati.it/11/06/', 'https://www.santiebeati.it/11/07/', 'https://www.santiebeati.it/11/08/', 'https://www.santiebeati.it/11/09/', 'https://www.santiebeati.it/11/10/', 'https://www.santiebeati.it/11/11/', 'https://www.santiebeati.it/11/12/', 'https://www.santiebeati.it/11/13/', 'https://www.santiebeati.it/11/14/', 'https://www.santiebeati.it/11/15/', 'https://www.santiebeati.it/11/16/', 'https://www.santiebeati.it/11/17/', 'https://www.santiebeati.it/11/18/', 'https://www.santiebeati.it/11/19/', 'https://www.santiebeati.it/11/20/', 'https://www.santiebeati.it/11/21/', 'https://www.santiebeati.it/11/22/', 'https://www.santiebeati.it/11/23/', 'https://www.santiebeati.it/11/24/', 'https://www.santiebeati.it/11/25/', 'https://www.santiebeati.it/11/26/', 'https://www.santiebeati.it/11/27/', 'https://www.santiebeati.it/11/28/', 'https://www.santiebeati.it/11/29/', 'https://www.santiebeati.it/11/30/', 'https://www.santiebeati.it/12/01/', 'https://www.santiebeati.it/12/02/', 'https://www.santiebeati.it/12/03/', 'https://www.santiebeati.it/12/04/', 'https://www.santiebeati.it/12/05/', 'https://www.santiebeati.it/12/06/', 'https://www.santiebeati.it/12/07/', 'https://www.santiebeati.it/12/08/', 'https://www.santiebeati.it/12/09/', 'https://www.santiebeati.it/12/10/', 'https://www.santiebeati.it/12/11/', 'https://www.santiebeati.it/12/12/', 'https://www.santiebeati.it/12/13/', 'https://www.santiebeati.it/12/14/', 'https://www.santiebeati.it/12/15/', 'https://www.santiebeati.it/12/16/', 'https://www.santiebeati.it/12/17/', 'https://www.santiebeati.it/12/18/', 'https://www.santiebeati.it/12/19/', 'https://www.santiebeati.it/12/20/', 'https://www.santiebeati.it/12/21/', 'https://www.santiebeati.it/12/22/', 'https://www.santiebeati.it/12/23/', 'https://www.santiebeati.it/12/24/', 'https://www.santiebeati.it/12/25/', 'https://www.santiebeati.it/12/26/', 'https://www.santiebeati.it/12/27/', 'https://www.santiebeati.it/12/28/', 'https://www.santiebeati.it/12/29/', 'https://www.santiebeati.it/12/30/', 'https://www.santiebeati.it/12/31/'] 

# Nome del file CSV di output
output_file = "santi.csv"
BASE_LINK = "https://www.santiebeati.it"
OUTPUT_ROOT = r"D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\Santi"
def estrai_mm_gg(url):
    m = re.search(r"/(\d{2})/(\d{2})/", url)
    return m.group(1), m.group(2)
def pulisci_testo(t):
    return " ".join(t.split())
rows = []
for url in arrayIndirizziBase:
    print(f"\n>>> APRO PAGINA: {url}")
    mm, gg = estrai_mm_gg(url)
    try:
      res = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
      res.raise_for_status()
    except Exception as e:
      print(f"❌ Errore su {url}: {e}")
      continue
    html = res.text
    soup = BeautifulSoup(html, "html.parser")
    page_rows = []
    # trovo la table principale dentro il body
    main_table = soup.body.find("table")
    # la terza table annidata contiene i santi
    table = main_table.find_all("table")[2]
    for p in table.find_all("p"):
        font_num = p.find("font", {"size": "-2", "color": "#999999"})
        if not font_num:
            continue
        numero = pulisci_testo(font_num.get_text())
        f_big = p.find("font", {"size": "-1"})
        if not f_big:
            continue
        a = f_big.find("a")
        if not a:
            continue
        link_dettaglio = BASE_LINK + a["href"]
        tipo_tag = a.find("font", {"size": "-2"})
        tipo = pulisci_testo(tipo_tag.get_text()) if tipo_tag else ""
        nome_tag = a.find("b")
        nome = pulisci_testo(nome_tag.get_text()) if nome_tag else ""
        info_tag = p.find("font", {"color": "#FFFFFF"})
        info = pulisci_testo(info_tag.get_text()) if info_tag else ""
        data_tag = p.find("font", {"color": "#FF3300"})
        if not data_tag:
            continue
        data_testo = pulisci_testo(data_tag.get_text())
        m2 = re.search(r"(\d+)\s+(\w+)", data_testo)
        if not m2:
            continue
        giorno = int(m2.group(1))
        mese_nome = m2.group(2).lower()
        mesi = {
            "gennaio":1,"febbraio":2,"marzo":3,"aprile":4,"maggio":5,"giugno":6,
            "luglio":7,"agosto":8,"settembre":9,"ottobre":10,"novembre":11,"dicembre":12
        }
        mese_num = mesi[mese_nome]
        if f"{mese_num:02d}" != mm or f"{giorno:02d}" != gg:
            continue
        festivita = ""
        possibles = data_tag.find_all_next("font", {"color": "#FF3300"}, limit=2)
        for ft in possibles:
            if "-" in ft.get_text():
                festivita = pulisci_testo(ft.get_text().replace("-", "").strip())
                break
        scheda = ""
        martirologio = ""
        for a2 in p.find_all("a"):
            t = a2.get("title", "")
            if t == "Scheda biografica":
                scheda = BASE_LINK + a2["href"]
            if t == "Presente nel Martirologio Romano":
                martirologio = BASE_LINK + a2["href"]
        riga = [
            numero, link_dettaglio, tipo, nome, info,
            festivita, scheda, martirologio
        ]
        print("   -> Riga trovata:")
        print(f"      Numero: {numero}")
        print(f"      Link dettaglio: {link_dettaglio}")
        print(f"      Tipo: {tipo}")
        print(f"      Nome: {nome}")
        print(f"      Info: {info}")
        print(f"      Festività: {festivita}")
        print(f"      Scheda: {scheda}")
        print(f"      Martirologio: {martirologio}\n")
        page_rows.append(riga)
    # Gestione dei font successivi al <p>
    for elem in p.parent.find_all("font"):
      if elem == font_num:  # salta il primo già processato
        continue
      if not getattr(elem, "name", None) == "font":
        continue  # salta tutto ciò che non è font
      # FONT con numero del santo
      if elem.get("size") == "-2" and elem.get("color") == "#999999":
          numero = pulisci_testo(elem.get_text())
          f_big = elem.find_next_sibling("font", {"size": "-1"})
          if not f_big:
              continue
          a = f_big.find("a")
          if not a:
              continue
          link_dettaglio = BASE_LINK + a["href"]
          tipo_tag = a.find("font", {"size": "-2"})
          tipo = pulisci_testo(tipo_tag.get_text()) if tipo_tag else ""
          nome_tag = a.find("b")
          nome = pulisci_testo(nome_tag.get_text()) if nome_tag else ""
          # font successivo bianco contiene info
          info_tag = f_big.find_next_sibling("font", {"color": "#FFFFFF"})
          info = pulisci_testo(info_tag.get_text()) if info_tag else ""
          # font successivo rosso contiene data
          data_tag = f_big.find_next_sibling("font", {"color": "#FF3300"})
          if not data_tag:
              continue
          data_testo = pulisci_testo(data_tag.get_text())
          m2 = re.search(r"(\d+)\s+(\w+)", data_testo)
          if not m2:
              continue
          giorno = int(m2.group(1))
          mese_nome = m2.group(2).lower()
          mese_num = mesi[mese_nome]
          if f"{mese_num:02d}" != mm or f"{giorno:02d}" != gg:
              continue
          festivita = ""
          possibles = data_tag.find_all_next("font", {"color": "#FF3300"}, limit=2)
          for ft in possibles:
              if "-" in ft.get_text():
                  festivita = pulisci_testo(ft.get_text().replace("-", "").strip())
                  break
          scheda = ""
          martirologio = ""
          for a2 in a.find_all_next("a"):
              t = a2.get("title", "")
              if t == "Scheda biografica":
                  scheda = BASE_LINK + a2["href"]
              if t == "Presente nel Martirologio Romano":
                  martirologio = BASE_LINK + a2["href"]
          riga = [numero, link_dettaglio, tipo, nome, info, festivita, scheda, martirologio]
          page_rows.append(riga)
          print(f"   -> Riga trovata dai font successivi: {riga}")
        # qui, subito dopo il for p
    if not page_rows:
        print(f"Nessun dato estratto da {url}")
    else:
        rows.extend(page_rows)
    print(f"<<< FINE PAGINA: {url}")
    # ... fine elaborazione della pagina corrente ...
    print("...pausa di 3 secondi prima della prossima pagina...")
    time.sleep(3)  # pausa di 3 secondi prima di passare alla prossima pagina
# --- SCRITTURA CSV ---
with open(f"{OUTPUT_ROOT}\\Santi.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow([
        "Numero", "Link dettaglio", "Tipo", "Nome",
        "Info", "Festività", "Scheda", "Martirologio"
    ])
    for riga in rows:
        writer.writerow(riga)
        print(f"CSV: scritta riga -> {riga}")
print("\n>>> CSV COMPLETO, FILE CHIUSO.\n")

