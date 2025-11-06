import re

# === PARAMETRI DA PERSONALIZZARE ===
# numero da sommare
OFFSET = 2
# rinumera solo da ftn12 in poi
START_FROM = 5

editor.beginUndoAction()
text = editor.getText()

def aumenta_numero(m):
    prefisso = m.group(1)
    num = int(m.group(2))
    if num >= START_FROM:
        num += OFFSET
    return f"[^{prefisso}-ftn{num}]"

nuovo_testo = re.sub(r'\[\^([a-z-]+)-ftn(\d+)\]', aumenta_numero, text)
editor.setText(nuovo_testo)
editor.endUndoAction()
