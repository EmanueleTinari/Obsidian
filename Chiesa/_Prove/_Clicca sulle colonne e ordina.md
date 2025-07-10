---
creato: 16/05/2025 00:20:26
modificato: 09/07/2025 00:16:15
---

Preso [Qui](https://forum.obsidian.md/t/dataviewjs-snippet-showcase/17847/78)

```dataviewjs
// Render the table
dv.table(["Paper","Title", "Year", "📚", "✒️","🧠","Updated"], dv.pages("#LiteratureNote")
	.where(b=>b.file.folder == ("Documenti pontifici"))
    .sort(b => b.file.mtime, 'desc')
    .map(b => [
	"[[" + b.file.name + "|" + (b.file.aliases[1] || b.file.aliases[0]) + "]]",
	
b.file.aliases[0],
b.Year,
b.completion_reading,
b.completion_note,
b.paper_understanding,
b.file.mtime.toFormat('yyyy-LL-dd T')
]))
	
// Sort Script	
	
// Source https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript
const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2,undefined, {numeric: true})
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

// do the work...
document.querySelectorAll('th').forEach(th => th.style.cursor = "pointer");

document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
  const table = th.closest('table');
  const tbody = table.querySelector('tbody');
  Array.from(tbody.querySelectorAll('tr'))
    .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
    .forEach(tr => tbody.appendChild(tr) );
})));
```