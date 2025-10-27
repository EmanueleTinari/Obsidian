<%*
const callouts = {
	note:     '🔵 ✏ Note',
	info:     '🔵 ℹ Info',
	todo:     '🔵 🔳 Todo',
	tip:      '🌐 🔥 Tip / Hint / Important',
	abstract: '🌐 📋 Abstract / Summary / TLDR',
	question: '🟡 ❓ Question / Help / FAQ',
	quote:    '🔘 💬 Quote / Cite',
	example:  '🟣 📑 Example',
	success:  '🟢 ✔ Success / Check / Done',
	warning:  '🟠 ⚠ Warning / Caution / Attention',
	failure:  '🔴 ❌ Failure / Fail / Missing',
	danger:   '🔴 ⚡ Danger / Error',
	bug:      '🔴 🐞 Bug',
};

const type = await tp.system.suggester(Object.values(callouts), Object.keys(callouts), true, 'Seleziona un tipo di Callout.');

const fold = await tp.system.suggester(['Nessuno', 'Espanso', 'Chiuso'], ['', '+', '-'], true, 'Seleziona lo stato iniziale del Callout.');

const title = await tp.system.prompt('Titolo:', '', true);

let content = await tp.system.prompt('Contenuto (Nuova linea -> Shift + Enter):', '', true, true);

content = content.split('\n').map(line => `> ${line}`).join('\n')

const calloutHead = `> [!${type}]${fold} ${title}\n`;

tR += calloutHead + content

-%>