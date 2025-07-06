Il seguente JS estrae tutti i link senza documento collegato (Ghost notes) ognuno nelle rispettive cartelle di origine:


```dataviewjs
const {path} = this.app.workspace.getActiveFile()
console.log(
    this.app.metadataCache.getCache(path)
);
```

```dataviewjs
// dataviewjs
// Ergonomische, kontrastreiche Darstellung für Dark/Light Mode mit grünem Text im Dark Mode

const pages = dv.pages('!"99 Resources"')
    .where(p => !p.file.path.startsWith("99 Resources/"));

const grouped = {};
for (let page of pages) {
    const folder = page.file.folder || "/";
    if (!grouped[folder]) grouped[folder] = [];
    grouped[folder].push(page);
}

const sortedFolders = Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'de'));

// CSS für Dark/Light Mode und hohen Kontrast
dv.container.innerHTML = `
  <style>
    :root {
      --light-bg: #f9f9f9;
      --light-border: #bdbdbd;
      --light-header: #e0e0e0;
      --light-text: #1a1a1a;
      --light-accent: #007f00;
      --light-input-bg: #fff;
      --light-input-text: #222;
      --light-input-border: #007f00;
      --dark-bg: #181d1b;
      --dark-border: #3a4a3a;
      --dark-header: #263326;
      --dark-text: #aaffaa;
      --dark-accent: #00ff00;
      --dark-input-bg: #222;
      --dark-input-text: #aaffaa;
      --dark-input-border: #00ff00;
    }
    /* Light Mode Styles */
    @media (prefers-color-scheme: light) {
      .accordion {background: var(--light-bg); border: 1px solid var(--light-border);}
      .accordion-header {background: var(--light-header); color: var(--light-accent);}
      .accordion-header.open {background: var(--light-accent); color: #fff;}
      .accordion-content {color: var(--light-text);}
      .note-list {color: var(--light-text);}
      #filterInput {
        background: var(--light-input-bg);
        color: var(--light-input-text);
        border: 2px solid var(--light-input-border);
        border-radius: 6px;
        outline: none;
      }
      #filterInput:focus {border-color: var(--light-accent);}
    }
    /* Dark Mode Styles */
    @media (prefers-color-scheme: dark) {
      .accordion {background: var(--dark-bg); border: 1px solid var(--dark-border);}
      .accordion-header {background: var(--dark-header); color: var(--dark-accent);}
      .accordion-header.open {background: var(--dark-accent); color: #181d1b;}
      .accordion-content {color: var(--dark-text);}
      .note-list {color: var(--dark-text);}
      #filterInput {
        background: var(--dark-input-bg);
        color: var(--dark-input-text);
        border: 2px solid var(--dark-input-border);
        border-radius: 6px;
        outline: none;
      }
      #filterInput:focus {border-color: var(--dark-accent);}
    }
    /* Für Theme-Unabhängigkeit und maximale Lesbarkeit */
    .accordion, .accordion-header, .accordion-content, .note-list, #filterInput {
      font-size: 1em;
      font-family: inherit;
      transition: background 0.2s, color 0.2s, border-color 0.2s;
    }
    .accordion {margin-bottom: 1em;}
    .accordion-header {cursor: pointer; padding: 6px; border-radius: 4px; user-select: none;}
    .accordion-content {display: none; margin-left: 1em;}
    .accordion-header.open + .accordion-content {display: block;}
    .note-list {list-style-type: disc; padding-left: 1.5em;}
    #filterInput {margin-bottom: 1em; padding: 6px; width: 100%; box-sizing: border-box;}
  </style>
  <input type="text" id="filterInput" placeholder="Notizen filtern...">
  <div id="accordionContainer"></div>
`;

async function renderAccordion(filterText = "") {
    const container = dv.container.querySelector("#accordionContainer");
    container.innerHTML = "";

    for (let folder of sortedFolders) {
        let notes = grouped[folder].sort((a, b) => a.file.name.localeCompare(b.file.name, 'de'));
        if (filterText.trim() !== "") {
            notes = notes.filter(n => n.file.name.toLowerCase().includes(filterText.toLowerCase()));
            if (notes.length === 0) continue;
        }

        const folderDiv = document.createElement("div");
        folderDiv.className = "accordion";

        const header = document.createElement("div");
        header.className = "accordion-header";
        header.textContent = `📁 ${folder} (${notes.length})`;
        folderDiv.appendChild(header);

        const content = document.createElement("div");
        content.className = "accordion-content";

        let md = "";
        const maxShow = 50;
        for (let i = 0; i < notes.length; i++) {
            if (i === maxShow) {
                md += `- _...und ${notes.length - maxShow} weitere. Bitte Filter verwenden._\n`;
                break;
            }
            md += `- [[${notes[i].file.path}|${notes[i].file.name}]]\n`;
        }

        const ul = document.createElement("div");
        ul.className = "note-list";
        await dv.api.renderValue(md, ul, dv.component, dv.currentFilePath);
        content.appendChild(ul);
        folderDiv.appendChild(content);
        container.appendChild(folderDiv);
    }

    container.querySelectorAll(".accordion-header").forEach(header => {
        header.onclick = () => {
            header.classList.toggle("open");
            const content = header.nextElementSibling;
            if (content) {
                content.style.display = content.style.display === "block" ? "none" : "block";
            }
        };
    });
}

renderAccordion();

const filterInput = dv.container.querySelector("#filterInput");
filterInput.addEventListener("input", e => {
    renderAccordion(e.target.value);
});
```