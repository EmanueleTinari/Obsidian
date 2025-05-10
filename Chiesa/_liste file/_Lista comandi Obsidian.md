---
date: 2021-06-26
author: Matthias C. Hormann a.k.a. Moonbase59
tags:
  - obsidian
  - commands
  - hotkeys
creato: 10-05-2025_06:46:09
aggiornato: 10-05-2025_07:07:58
---

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">Comandi Obsidian ordinati in base alla relativa <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">scorciatoia</span>:</div>
> ```dataview
>\
>```


```dataviewjs
const getNestedObject = (nestedObj, pathArr) => {
return pathArr.reduce((obj, key) =>
(obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}
function hilite(keys, how) {
// need to check if existing key combo is overridden by undefining it
if (keys && keys[1][0] !== undefined) {
return how + keys.flat(2).join('+').replace('Mod', 'Ctrl') + how;
} else {
return how + '–' + how;
}
}
function getHotkey(arr, highlight=true) {
let hi = highlight ? '**' : '';
let defkeys = arr.hotkeys ? [[getNestedObject(arr.hotkeys, [0, 'modifiers'])],
[getNestedObject(arr.hotkeys, [0, 'key'])]] : undefined;
let ck = app.hotkeyManager.customKeys[arr.id];
var hotkeys = ck ? [[getNestedObject(ck, [0, 'modifiers'])], [getNestedObject(ck, [0, 'key'])]] : undefined;
return hotkeys ? hilite(hotkeys, hi) : hilite(defkeys, '');
}
let cmds = dv.array(Object.entries(app.commands.commands))
.where(v => getHotkey(v[1]) != '–')
.sort(v => v[1].id, 'asc')
.sort(v => getHotkey(v[1], false), 'asc');
dv.paragraph(cmds.length + " comandi di Obsidian trovati con le rispettive scorciatoie assegnate (hotkeys).<br>" +
"Le scorciatoie non di default sono in <strong>grassetto</strong>.<br><br>");
dv.table(["ID Comando", "Nome del comando", "Scorciatoia"],
cmds.map(v => [
v[1].id,
v[1].name,
getHotkey(v[1]),
])
);
```

### Commands sorted by Command ID

```dataviewjs

const getNestedObject = (nestedObj, pathArr) => {
    return pathArr.reduce((obj, key) =>
        (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}

function hilite(keys, how) {
    // need to check if existing key combo is overridden by undefining it
    if (keys && keys[1][0] !== undefined) {
        return how + keys.flat(2).join('+').replace('Mod', 'Ctrl') + how;
    } else {
        return how + '–' + how;
    }
}

function getHotkey(arr, highlight=true) {
    let hi = highlight ? '**' : '';
    let defkeys = arr.hotkeys ? [[getNestedObject(arr.hotkeys, [0, 'modifiers'])],
    [getNestedObject(arr.hotkeys, [0, 'key'])]] : undefined;
    let ck = app.hotkeyManager.customKeys[arr.id];
    var hotkeys = ck ? [[getNestedObject(ck, [0, 'modifiers'])], [getNestedObject(ck, [0, 'key'])]] : undefined;
    return hotkeys ? hilite(hotkeys, hi) : hilite(defkeys, '');
}

let cmds = dv.array(Object.entries(app.commands.commands))
    .sort(v => v[1].id, 'asc');

dv.paragraph(cmds.length + " commands currently enabled; " +
    "non-default hotkeys <strong>bolded</strong>.<br><br>");

dv.table(["Command ID", "Name in current locale", "Hotkeys"],
  cmds.map(v => [
    v[1].id,
    v[1].name,
    getHotkey(v[1]),
    ])
  );
```