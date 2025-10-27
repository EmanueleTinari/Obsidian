

<%_*
/*
@2023-04-05 12:00:00

Obsidian Templater - Change tags of multiple notes at once.

1. Make a table with dataviewjs.

```dataviewjs
dv.table(["✓", "File", "mtime", "ctime", "tags", "folder"], dv.pages("")
  .sort(b => b.file.mtime, "desc")
  .map(b => ["<input type='checkbox'>", b.file.link, b.file.mtime, b.file.ctime, b.tags, b.file.folder]))
```

2. Check the files to change tags.

3. Run Templater.
*/

let files = [];
let trs = Array.from(app.workspace.activeLeaf.containerEl.querySelectorAll("tr"));
for(var ti = 0; ti < trs.length; ti++) {
  let tr = trs[ti];
  if(tr.querySelector("input")?.checked) {
    let href = tr.querySelector("a")?.getAttribute("href");
    if(href) {
      let path = tp.obsidian.normalizePath(href);
      files.push(path);
    }
  }
}

// import { App, Modal, Setting } from "obsidian";
const Modal = tp.obsidian.Modal;
const Setting = tp.obsidian.Setting;

if(files.length < 1) {
  let modal = new Modal(app);
  modal.titleEl.setText("⚠ ERRORE - Nessun file selezionato.");
  modal.contentEl.setText("dataviewjs L'apparecchio non è compatibile con l'apparecchio.");
  modal.open();
 
  return; // Finisci senza fare niente
}

class TagsModal extends Modal {

  constructor(app, onSubmit) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: "Change Tags of Notes" });
    contentEl.createDiv({ text: `Tags must be separated by ",".` });

    new Setting(contentEl)
      .setName("Tags to add")
      .addText((text) => {
        text.inputEl.setAttribute("style", "width:100%");
        text.onChange((value) => {
          this.tags_add = value
        })
      });

    new Setting(contentEl)
      .setName("Tags to delete")
      .addText((text) => {
        text.inputEl.setAttribute("style", "width:100%");
        text.onChange((value) => {
          this.tags_del = value
        })
      });

    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText("Cancel")
          .setCta()
          .onClick(() => {
            this.close();
          }))
      .addButton((btn) =>
        btn
          .setButtonText("Change Tags")
          .setCta()
          .onClick(() => {
            this.onChangeTags();
          }));
 
    contentEl.createEl("h3", { text: "selected files: " + files.length });
   
    let dropDown = new tp.obsidian.DropdownComponent(contentEl);
    dropDown.selectEl.setAttribute("style", "width:100%");
    for(var fi = 0; fi < files.length; fi++) {
      dropDown.addOption(fi, (fi + 1) + " " + files[fi]);
    }
    this.dropDown = dropDown;

    this.progress = contentEl.createEl("progress", {attr: {style:"width:100%", value:0, max: files.length}});

    let textarea = new tp.obsidian.TextAreaComponent(contentEl);
    console.log("textarea");
    console.dir(textarea);
    textarea.inputEl.setAttribute("style", "width:100%;height:5em;");
    this.textarea = textarea;
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }

  async onChangeTags() {
    if(!this?.tags_add && !this?.tags_del) {
      new Notice(`Input tags!`);
      return;
    }
 
    let tags_add = [];
    if(this?.tags_add) {
      tags_add = this.tags_add.split(",").map(tag => tag.trim());
    }
 
    let tags_del = [];
    if(this?.tags_del) {
      tags_del = this.tags_del.split(",").map(tag => tag.trim());
    }

    let log = "====================\n";
    log += "tags add: " + tags_add.join(", ") + "\n";
    log += "tags del: " + tags_del.join(", ") + "\n";
    log += "--------------------\n"
    log += "Start: " +new Date().toString() + "\n";
   
    this.textarea.inputEl.value += log;
   
    for(var fi = 0; fi < files.length; fi++) {
      this.dropDown.setValue(fi);
      let path = files[fi];
      let tfile = app.vault.getAbstractFileByPath(path);
     
      await app.fileManager.processFrontMatter(tfile, (fm) => {
        let tags = fm["tags"] ? fm["tags"] : [];
        let tags_changed = false;
 
        // Aggiungi tag.
        tags_add.forEach(tag => {
          if (!tags.includes(tag)) {
            tags.push(tag);
            tags_changed = true;
          }
        });
 
        // Cancella i tag.
        tags_del.forEach(tag => {
          let index = tags.indexOf(tag);
          if (index > -1) {
            tags.splice(index, 1);
            tags_changed = true;
          }
        });
 
        if (tags_changed) {
          fm["tags"] = tags;
        }
      });
      this.progress.value = fi + 1;
      // await sleep(1000);
    }

    this.textarea.inputEl.value += "End: " +new Date().toString() + "\n";
  }
}

new TagsModal(this.app, async (result) => {
  return;
}).open();

return // Termina senza alcuna modifica alla nota ora
-%>
