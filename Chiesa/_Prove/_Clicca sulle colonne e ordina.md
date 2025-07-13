---
creato: 2025/05/16 00:20:26
modificato: 2025/07/13 00:22:45
---

Preso [Qui](https://forum.obsidian.md/t/dataviewjs-snippet-showcase/17847/78)



```dataviewjs

// Render the table
dv.table(['File','Creato', '✒️'], dv.pages('')
	.where(b => b.file.folder == (""))
	.sort(b => b.file.mtime, 'desc')
	.map(b => [
		"[[" + b.file.path + "]]",
		b.file.ctime.toFormat('dd MMMM yyyy T'),
		b.file.mtime.toFormat('dd MMMM yyyy T')
	])
)

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
