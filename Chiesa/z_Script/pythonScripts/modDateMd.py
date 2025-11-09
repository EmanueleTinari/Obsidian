# Questo script legge partendo dalla cartella indicata in ROOT tutti i file MD nella cartelle e nelle relative sottocartelle
# Se nel testo del file sono presenti il 'creato: ' oppure il 'modificato: ' oppure entrambi, cambia tale valore nelle
# proprietà del file stesso (modifica la data di creazione e la data di modifica del file) in base al valore letto. 
# Se il campo o i campi c'è (ci sono) ma non sono valorizzati, prende il valore leggendolo dalle proprietà
# e compila i campi vuoti. 

import os, re, time
import pywintypes, win32file, win32con

# ============== CONFIGURAZIONE ===========================================================
ROOT = r"D:\Documents\GitHub\EmanueleTinari\Obsidian\Chiesa\"     # <--- percorso di partenza
LOG = os.path.join(ROOT, "log_modifiche.txt")
# =========================================================================================

# regex: data opzionale + ora opzionale, / o - e spazio/T tra data e ora
re_creato = re.compile(r"^creato:\s*(\d{4}[/-]\d{2}[/-]\d{2}(?:[ T]\d{2}:\d{2}:\d{2})?)?$", re.IGNORECASE)
re_modif  = re.compile(r"^modificato:\s*(\d{4}[/-]\d{2}[/-]\d{2}(?:[ T]\d{2}:\d{2}:\d{2})?)?$", re.IGNORECASE)

def dt2epoch(s):
    s = s.replace('/', '-')
    if 'T' in s:
        date_part, time_part = s.split('T')
    elif ' ' in s:
        date_part, time_part = s.split(' ')
    else:
        date_part, time_part = s, "12:00:00"
    Y,M,D = date_part.split('-')
    h,m,sec = time_part.split(':')
    return time.mktime((int(Y),int(M),int(D),int(h),int(m),int(sec),0,0,-1))

def setFileTimes(path, creato, modificato):
    h = win32file.CreateFile(path, win32con.GENERIC_WRITE, win32con.FILE_SHARE_READ, None,
                             win32con.OPEN_EXISTING, 0, None)
    ctime = pywintypes.Time(dt2epoch(creato))       if creato     else None
    mtime = pywintypes.Time(dt2epoch(modificato))   if modificato else None
    win32file.SetFileTime(h, ctime, None, mtime)
    h.close()

with open(LOG,"a",encoding="utf-8") as flog:
    for root,dirs,files in os.walk(ROOT):
        for fn in files:
            if not fn.lower().endswith(".md"):
                continue

            full = os.path.join(root, fn)
            with open(full,"r",encoding="utf-8") as f:
                lines = f.readlines()

            dtCreato     = None
            dtModificato = None
            idx_creato   = None
            idx_modif    = None
            changed = False

            for i, ln in enumerate(lines):
                m1 = re_creato.match(ln.strip())
                if m1:
                    idx_creato = i
                    if m1.group(1):
                        dtCreato = m1.group(1)
                m2 = re_modif.match(ln.strip())
                if m2:
                    idx_modif = i
                    if m2.group(1):
                        dtModificato = m2.group(1)

            # leggi info FS se necessario
            stat = os.stat(full)
            fs_creato = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(stat.st_ctime))
            fs_modif  = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(stat.st_mtime))

            # riempi campi vuoti solo se presenti
            if idx_creato is not None and not dtCreato:
                lines[idx_creato] = f"creato: {fs_creato}\n"
                dtCreato = fs_creato
                changed = True
            if idx_modif is not None and not dtModificato:
                lines[idx_modif] = f"modificato: {fs_modif}\n"
                dtModificato = fs_modif
                changed = True

            # aggiorna FS solo se abbiamo valori
            if dtCreato or dtModificato:
                setFileTimes(full, dtCreato, dtModificato)
                if changed:
                    with open(full,"w",encoding="utf-8") as f:
                        f.writelines(lines)
                flog.write(f"{full} | creato:{dtCreato} modificato:{dtModificato}\n")
