---
creato: 03/05/2025 16:46:19
modificato: 09/07/2025 00:16:22
---


> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">Lista Datawiew con <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">tutti i file</span> nel vault ed il relativo titolo, se presente:</div>
> ```dataview 
> TABLE file.frontmatter.titolo-doc as "Titolo"
> FROM ""
> SORT file.folder ASC
> ```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">Lista Datawiew con <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">tutti i file</span> nel vault ed i relativi valori del Frontmatter:</div>
> ```dataview
> TABLE WITHOUT ID
> 	file.folder AS "Cartella",
> 	file.link as "File",
> 	file.frontmatter AS "Proprietà"
> FROM ""
> WHERE
>	file.frontmatter
> 	AND !startswith(file.name, "_")
> 	AND !startswith(file.name, "Lista")
> 	AND !startswith(file.path, "z_")
> SORT
> 	file.name ASC
>```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">Lista Dataview con tutti i file nel vault presentandoli come <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">tabella</span>, divisi per cartella, uno di seguito all'altro sulla stessa riga:</div>
> ```dataview
> TABLE join(rows.file.link, " | ") as "File contenuti"
> GROUP BY file.folder as "Cartelle"
> ```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">Lista Dataview con tutti i file nel vault presentandoli come <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">tabella</span>, divisi per cartella, separati da un BR:</div>
> ```dataview 
> TABLE join(rows.file.link, "<br>") as "File contenuti"
> GROUP BY file.folder as "Cartelle"
> ```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">Lista DataviewJS con tutti i file nel vault presentandoli come <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">albero</span>, divisi per cartella, uno di seguito all'altro sulla stessa riga:</div>
> ```dataviewjs
>function listRecursive(folder, depth) {
// Tutte le pagine nell'ambito del percorso corrente
let pages = dv.pages('"' + folder + '"');
// elenco le sottodirectory dirette
let subfolders = [];
pages.forEach(page => {
let afolder = page.file.folder;
if (afolder == folder) return;
if (!afolder.startsWith(folder)) return;
let relpath = afolder.substring(folder.length);
if (relpath == "") return;
let sub = relpath.split("/")[0];
if (folder != "") sub = relpath.split("/")[1];
if (sub == "") return;
if (!subfolders.includes(sub)) {
subfolders.push(sub);
}
});
// elenchiamo i file nella directory corrente
let currentFiles = "";
pages.forEach(page => {
if (page.file.folder == folder || (folder=="" && page.file.folder == "/")) {
// La pagina si trova nella cartella corrente
currentFiles += page.file.link + " | ";
}
});
let indent = "\t".repeat(depth);
let rep = folder.substring(folder.lastIndexOf("/")+1);
// iniziamo con il nome della directory
let res = indent+"- ### "+rep+"</h3>";
if (folder == '') res = "- ### ALL NOTES</h3>";
//res += indent+currentFiles+"\n";
res += currentFiles+"\n";
// aggiungiamo le sottodirectory
for (let srep of subfolders) {
if (folder == "")
res += listRecursive(srep, depth+1);
else
res += listRecursive(folder+"/"+srep, depth+1);
}
return res;
}
// inserire la cartella che si desidera elencare
let files = listRecursive('', 0);
//let files = listRecursive('', 0);
dv.el("p",files)
>```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">Lista DataviewJS con tutti i file nel vault presentandoli come <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">albero</span>, divisi per cartella, uno di seguito all'altro sulla stessa riga: - incluse solo le cartelle che iniziano con "Documenti", - esclusi i file che iniziano con "\_":</div>
> ```dataviewjs 
>function listRecursive(folder, depth) {
// Inserire qui eventuali filtri per i nomi delle cartelle
var filterDir = "Documenti";
// Inserire qui eventuali filtri per i nomi dei file
var excludedStart = "_";
// Tutte le pagine nell'ambito del percorso corrente
let pages = ('"' + folder + '"');
// elenco le sottodirectory dirette
let subfolders = [];
pages.forEach(page => {
let afolder = page.file.folder;
if (afolder == folder) return;
// Escludo le cartelle il cui nome non inizia col filtro indicato nella variabile filterDir
if (!afolder.startsWith(filterDir)) return;
if (!afolder.startsWith(folder)) return;
let relpath = afolder.substring(folder.length);
if (relpath == "") return;
let sub = relpath.split("/")[0];
if (folder != "") sub = relpath.split("/")[1];
if (sub == "") return;
if (!subfolders.includes(sub)) {
subfolders.push(sub);
}
});
// elenchiamo i file nella directory corrente
let currentFiles = "";
pages.forEach(page => {
if (page.file.folder == folder || (folder=="" && page.file.folder == "/")) {
// Escludo i file che cominciano con il valore della variabile excludedStart
if (!page.file.name.startsWith(excludedStart)) {
console.log("page.file.name: " + page.file.name);
console.log("page.file.link: " + page.file.link);
// La pagina si trova nella cartella corrente
currentFiles += page.file.link + " | ";
console.log("currentFiles var value: " + currentFiles);
}
}
});
let indent = "\t".repeat(depth);
let rep = folder.substring(folder.lastIndexOf("/")+1);
// iniziamo con il nome della directory
let res = indent+"- ### "+rep+"</h3>";
if (folder == '') res = "- ### TUTTE LE NOTE :</h3>";
//res += indent+currentFiles+"\n";
res += currentFiles+"\n";
console.log("res var value: " + res);
// aggiungiamo le sottodirectory
for (let srep of subfolders) {
if (folder == "")
res += listRecursive(srep, depth+1);
else
res += listRecursive(folder+"/"+srep, depth+1);
}
return res;
}
// inserire la cartella da cui si desidera iniziare l'elenco ("" = root vault)
let files = listRecursive('', 0);
dv.el("p", files);
> ```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">Lista DataviewJS con tutti i file nel vault presentandoli come <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">albero</span>, divisi per cartella, uno x riga: - incluse solo le cartelle che iniziano con "Documenti", - esclusi i file che iniziano con "\_":</div>
> ```dataviewjs 
>function listRecursive(folder, depth) {
// Inserire qui eventuali filtri per i nomi delle cartelle
var filterDir = "Documenti";
// Inserire qui eventuali filtri per i nomi dei file
var excludedStart = "_";
// Inserire qui eventuali filtri per i nomi dei file
var sumFiles = 0;
// Tutte le pagine nell'ambito del percorso corrente
let pages = dv.pages('"' + folder + '"');
// elenco le sottodirectory dirette
let subfolders = [];
pages.forEach(page => {
let afolder = page.file.folder;
if (afolder == folder) return;
// Escludo le cartelle il cui nome non inizia col filtro indicato nella variabile filterDir
if (!afolder.startsWith(filterDir)) return;
if (!afolder.startsWith(folder)) return;
let relpath = afolder.substring(folder.length);
if (relpath == "") return;
let sub = relpath.split("/")[0];
if (folder != "") sub = relpath.split("/")[1];
if (sub == "") return;
if (!subfolders.includes(sub)) {
subfolders.push(sub);
}
});
// elenchiamo i file nella directory corrente
let currentFiles = "";
let indent = "\t".repeat(depth);
pages.forEach(page => {
if (page.file.folder == folder || (folder == "" && page.file.folder == "/")) {
// Escludo i file che cominciano con il valore della variabile excludedStart
if (!page.file.name.startsWith(excludedStart)) {
// La pagina si trova nella cartella corrente
currentFiles += "\n" + indent + "\t- " + page.file.link + "\n";
sumFiles++;
console.log("1° sumFiles: " + sumFiles);
console.log("currentFiles var value: " + currentFiles);
}
sumFiles++;
console.log("2° sumFiles: " + sumFiles);
}
sumFiles++;
console.log("3° sumFiles: " + sumFiles);
});
let rep = folder.substring(folder.lastIndexOf("/") + 1);
// iniziamo con il nome della directory
let res = indent + "- ### " + rep + "</h3>";
if (folder == '') res = "- ### TUTTE LE NOTE :</h3>";
//res += indent+currentFiles+"\n";
res += currentFiles + "\n";
// aggiungiamo le sottodirectory
for (let srep of subfolders) {
if (folder == "")
res += listRecursive(srep, depth + 1);
else
res += listRecursive(folder + "/" + srep, depth + 1);
}
return res;
}
// inserire la cartella da cui si desidera iniziare l'elenco ("" = root vault)
let files = listRecursive('', 0);
dv.el("p", files);
> ```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">Lista Datawiew con tutti gli elementi del Frontmatter dei file contenenti <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">tipo-doc = `[[Bolle|Bolla]]</span>:</div>
> ```dataview 
> TABLE file.frontmatter
> WHERE tipo-doc = [[Bolle|Bolla]]
> ```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">Lista DatawiewJS con tutti i file contenenti <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">tipo-doc = `[[Bolle|Bolla]]</span>, restituisce il nome del file:</div>
> ```dataviewjs
>const result = await dv.pages()
  .where(p => p['tipo-doc'] == "[[Bolle|Bolla]]")
  .map(p => [ p.file.name] )
if (result.successful) {
 dv.table(["File name"], result) 
} else
  dv.paragraph("~~~~\n" + result.error + "\n~~~~")
> ```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">Lista DatawiewJS con tutti i file contenenti <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">tipo-doc = `[[Bolle|Bolla]]</span>, restituisce il nome del file e il titolo del documento:</div>
> ```dataviewjs 
> const result = await dv.pages()
  .where(p => p['tipo-doc'] == "[[Bolle|Bolla]]")
  .map(p => [ p.file.name, p['titolo-doc']] )
if (result.successful) {
 dv.table(["File name", "Titolo documento"], result) 
} else
  dv.paragraph("~~~~\n" + result.error + "\n~~~~")
> ```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">Lista DatawiewJS con <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">tutte le estensioni installate,</span>nella quarta colonna se le stesse sono abilitate o disabilitate:</div>
> ```dataviewjs 
>// console.log(app.plugins)
// console.log(app.plugins.enabledPlugins)
const plugins = dv.array(Object.values(app.plugins.manifests))
  .sort(p => p.name)
  .map(p => [p.name, p.id, p.description, app.plugins.enabledPlugins.has(p.id) ])  
dv.table(["Nome", "ID", "Descrizione", "Abilitato"], plugins)
> ```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">Lista puntata DatawiewJS con <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">tutti i tag</span> usati nei documenti:</div>
> ```dataviewjs 
>const allTags = app.metadataCache.getTags()
dv.container.className += " multi-column-list-block"
dv.list(Object.keys(allTags).slice(0, 59))
> ```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">Lista DataviewJS con <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">tutti i comandi </span> di Obsidian, ordinati per codice comando:</div>
> ```dataviewjs 
>const getNestedObject = (nestedObj, pathArr) => {
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
dv.paragraph(cmds.length + " comandi di Obsidian trovati con le rispettive scorciatoie assegnate (hotkeys).<br>" + "Le scorciatoie non di default sono in <strong>grassetto</strong>.<br><br>");
dv.table(["ID Comando", "Nome del comando", "Scorciatoia"],
cmds.map(v => [
v[1].id,
v[1].name,
getHotkey(v[1]),
])
);
> ```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">Lista DataviewJS con <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">tutti i comandi </span> di Obsidian, ordinati per scorciatoia assegnata:</div>
> ```dataviewjs 
>const getNestedObject = (nestedObj, pathArr) => {
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
dv.table(["ID Comando","Nome del comando","Scorciatoia"],
cmds.map(v => [
v[1].id,
v[1].name,
getHotkey(v[1]),
])
);
> ```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">Lista DataviewJS con <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">tutti i comandi </span> di Obsidian, ordinati per nome del comando ed ottimizzazione della memoria:</div>
> ```dataviewjs  
>function Cache(config) {
config = config || {};
config.trim = config.trim || 600;
config.ttl = config.ttl || 3600;
var data = {};
var self = this;
var now = function() {
return new Date().getTime() / 1000;
};
// Object for holding a value and an expiration time
// @param expires the expiry time as a UNIX timestamp
// @param value the value of the cache entry
// @constructor ¯\(°_o)/¯
var CacheEntry = function(expires, value) {
this.expires = expires;
this.value = value;
};
// Creates a new cache entry with the current time + ttl as the expiry.
// @param value the value to set in the entry
// @returns {CacheEntry} the cache entry object
CacheEntry.create = function(value) {
return new CacheEntry(now() + config.ttl, value);
};
// Returns an Array of all currently set keys.
// @returns {Array} cache keys
this.keys = function() {
var keys = [];
for(var key in data)
if (data.hasOwnProperty(key))
keys.push(key);
return keys;
};
// Checks if a key is currently set in the cache.
// @param key the key to look for
// @returns {boolean} true if set, false otherwise
this.has = function(key) {
return data.hasOwnProperty(key);
};
// Clears all cache entries.
this.clear = function() {
for(var key in data)
if (data.hasOwnProperty(key))
self.remove(key);
};
// Gets the cache entry for the given key.
// @param key the cache key
// @returns {*} the cache entry if set, or undefined otherwise
this.get = function(key) {
return data[key].value;
};
// Returns the cache entry if set, or a default value otherwise.
// @param key the key to retrieve
// @param def the default value to return if unset
// @returns {*} the cache entry if set, or the default value provided.
this.getOrDefault = function(key, def) {
return self.has(key) ? data[key].value : def;
};
// TODO: Add JSDoc to this function
this.getOrCreate = function(key, fn) {
if (self.has(key)) {
return self.get(key);
}
const value = fn();
self.set(key, value);
return value;
}
// Sets a cache entry with the provided key and value.
// @param key the key to set
// @param value the value to set
this.set = function(key, value) {
data[key] = CacheEntry.create(value);
};
// Removes the cache entry for the given key.
// @param key the key to remove
this.remove = function(key) {
delete data[key];
};
// Checks if the cache entry has expired.
// @param entrytime the cache entry expiry time
// @param curr (optional) the current time
// @returns {boolean} true if expired, false otherwise
this.expired = function(entrytime, curr) {
if(!curr)
curr = now();
return entrytime < curr;
};
// Trims the cache of expired keys. This function is run periodically (see config.ttl).
this.trim = function() {
var curr = now();
for (var key in data)
if (data.hasOwnProperty(key))
if(self.expired(data[key].expires, curr))
self.remove(key);
};
// Periodical cleanup
setInterval(this.trim, config['trim'] * 1000);
//--------------------------------------------------------
// Events
var eventCallbacks = {};
this.on = function(event, callback) {
// TODO handle event callbacks
};
}
const cache = new Cache({ trim: 600, ttl: 3600 });
const getNestedObject = (nestedObj, pathArr) => {
const cacheKey = `nestedObject-${JSON.stringify({ nestedObj, pathArr })}`;
return cache.getOrCreate(cacheKey, () => {
return pathArr.reduce((obj, key) =>
(obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
});
}
function hilite(keys, how) {
if (keys && keys[1][0] !== undefined) {
return how + keys.flat(2).join('+').replace('Mod', 'Ctrl') + how;
} else {
return how + '–' + how;
}
}
function getHotkey(arr, highlight=true) {
const cacheKey = `hotkey-${JSON.stringify({ arr, highlight })}`;
return cache.getOrCreate(cacheKey, () => {
let hi = highlight ? '**' : '';
let defkeys = arr.hotkeys ? [[getNestedObject(arr.hotkeys, [0, 'modifiers'])],
[getNestedObject(arr.hotkeys, [0, 'key'])]] : undefined;
let ck = app.hotkeyManager.customKeys[arr.id];
var hotkeys = ck ? [[getNestedObject(ck, [0, 'modifiers'])], [getNestedObject(ck, [0, 'key'])]] : undefined;
return hotkeys ? hilite(hotkeys, hi) : hilite(defkeys, '');
});
}
let cmds = dv.array(Object.entries(app.commands.commands))
.sort(v => v[1].name, 'asc');
dv.paragraph(cmds.length + "  comandi di Obsidian trovati con le rispettive scorciatoie assegnate (hotkeys).<br>" +
"Le scorciatoie non di default sono in <strong>grassetto</strong>.<br><br>");
dv.table(["ID Comando","Nome del comando","Scorciatoia"],
cmds.map(v => [
v[1].id,
v[1].name,
getHotkey(v[1]),
])
);
> ```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">Lista DatawiewJS con <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">TUTTE LE ICONE</span>:</div>
> ```dataviewjs
> /**
>  * List all icons available to `obsidian.setIcon()`
> * 
>  * @author Ljavuras <ljavuras.py@gmail.com>
>  */
>
> dv.container.createEl("style", { attr: { scope: "" }, text: `
> .icon-table {
>     display: flex;
>     flex-wrap: wrap;
>     margin: 0 var(--size-4-6);
> }
>
> .icon-item {
>     padding: var(--size-4-2);
>     line-height: 0;
>     cursor: pointer;
> }
>
> .icon-item:hover {
>     background-color: var(--background-modifier-active-hover);
>     border-radius: var(--radius-s);
> }
> `});
>
> function renderIconTable(ids) {
>     const tableEl = dv.container.createDiv("icon-table");
>     ids.forEach((id) => {
>         let iconEl = tableEl.createDiv("icon-item");
>         obsidian.setIcon(iconEl, id);
>         obsidian.setTooltip(iconEl, id, { delay: 0 });
>         iconEl.onclick = () => {
>             navigator.clipboard.writeText(id);
>             new Notice("Copied to clipboard.");
>         }
>     });
> }
>
> let lucide_ids = obsidian.getIconIds()
>     .filter(id => id.startsWith("lucide-"))
>     .map(id => id.slice(7));
> dv.paragraph(`${lucide_ids.length} Lucide icons`);
> renderIconTable(lucide_ids);
>
> let other_ids = obsidian.getIconIds().filter(id => !id.startsWith("lucide-"));
> dv.paragraph(`${other_ids.length} other icons`);
> renderIconTable(other_ids);
> ```





<!--  Sono stati inseriti più Dataview di controllo sui documenti presenti in archivio
	per verificare la presenza in ognuno di essi di tutti i TAG -->

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> cssclasses:</div>
> ```dataview
> TABLE
> 	file.folder AS "Cartella",
> 	cssclasses AS "Classe Css"
> FROM ""
> WHERE
> 	cssclasses = null
> 	AND !startswith(file.name, "_")
> 	AND !startswith(file.name, "Lista")
> 	AND !startswith(file.path, "_")
> 	AND !startswith(file.path, "z_")
> SORT
> 	file.name ASC
>```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> autore-doc:</div>
> ```dataview
> TABLE
> 	file.folder AS "Cartella",
> 	autore-doc AS "Autore del documento"
> FROM ""
> WHERE
> 	autore-doc = null
> 	AND !startswith(file.name, "_")
> 	AND !startswith(file.name, "Lista")
> 	AND !startswith(file.path, "_")
> 	AND !startswith(file.path, "z_")
> SORT
> 	file.name ASC
>```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> tipo-doc:</div>
> ```dataview
> TABLE
> 	file.folder AS "Cartella",
> 	tipo-doc AS "Tipo di documento"
> FROM ""
> WHERE
> 	tipo-doc = null
> 	AND !startswith(file.name, "_")
> 	AND !startswith(file.name, "Lista")
> 	AND !startswith(file.path, "_")
> 	AND !startswith(file.path, "z_")
> SORT
> 	file.name ASC
>```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> titolo-doc:</div>
> ```dataview
> TABLE
> 	file.folder AS "Cartella",
> 	titolo-doc AS "Titolo del documento"
> FROM ""
> WHERE
> 	titolo-doc = null
> 	AND !startswith(file.name, "_")
> 	AND !startswith(file.name, "Lista")
> 	AND !startswith(file.path, "_")
> 	AND !startswith(file.path, "z_")
> SORT
> 	file.name ASC
>```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> anno-doc:</div>
> ```dataview
> TABLE
> 	file.folder AS "Cartella",
> 	anno-doc AS "Anno del documento"
> FROM ""
> WHERE
> 	anno-doc = null
> 	AND !startswith(file.name, "_")
> 	AND !startswith(file.name, "Lista")
> 	AND !startswith(file.path, "_")
> 	AND !startswith(file.path, "z_")
> SORT
> 	file.name ASC
>```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> data-doc:</div>
> ```dataview
> TABLE
> 	file.folder AS "Cartella",
> 	data-doc AS "Data del documento"
> FROM ""
> WHERE
> 	data-doc = null
> 	AND !startswith(file.name, "_")
> 	AND !startswith(file.name, "Lista")
> 	AND !startswith(file.path, "_")
> 	AND !startswith(file.path, "z_")
> SORT
> 	file.name ASC
>```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> tag:</div>
> ```dataview
> TABLE
> 	file.folder AS "Cartella",
> 	tags AS "Tag del documento"
> FROM ""
> WHERE
> 	tags = null
> 	AND !startswith(file.name, "_")
> 	AND !startswith(file.name, "Lista")
> 	AND !startswith(file.path, "_")
> 	AND !startswith(file.path, "z_")
> SORT
> 	file.name ASC
>```

> [!info]- <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> licenza:</div>
> ```dataview
> TABLE
> 	file.folder AS "Cartella",
> 	Licenza AS "Licenza documento"
> FROM ""
> WHERE
> 	Licenza = null
> 	AND !startswith(file.name, "_")
> 	AND !startswith(file.name, "Lista")
> 	AND !startswith(file.path, "_")
> 	AND !startswith(file.path, "z_")
> SORT
> 	file.name ASC
>```

> [!info] <div style="padding: 0px 10px 0px 10px; text-align:center; background-color: lightgrey; color:blue;">File <span style="text-transform: uppercase; text-decoration-line: underline; color:red;">Senza</span> :</div>
> ```dataview
>
>```



