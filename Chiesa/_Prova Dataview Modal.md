---
modificato: 2025/09/22 23:41:33
creato: 2025/06/06 11:58:11
---


```dataviewjs

// direct access to the "tp" templater API
const templater = app.plugins.plugins["templater-obsidian"].templater;
const tp = templater.current_functions_object;
// import { App, Modal, Setting } from "obsidian";
const Modal = tp.obsidian.Modal;
const Setting = tp.obsidian.Setting;

class openModal extends Modal {
	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h1", {
			text: 'Questa è una riga H1 del Modal'
		});

		var contatore = 1
		var numElementi = 12;

		while (contatore === numElementi) {
			const (containerDiv + contatore) = document.createElement("div");
			const (containerSpa + contatore) = document.createElement("span");
			const (containerPar + contatore) = document.createElement("p");
			
			(containerDiv + contatore).setAttribute("id",   "myDivId"      + contatore);
			(containerDiv + contatore).setAttribute("name", "myDivName"    + contatore);
			(containerDiv + contatore).setAttribute("class", "myDivClass");
			(containerDiv + contatore).style.marginTop = '10px';
			
			(containerSpa + contatore).setAttribute("id",		"mySpanId"		+ contatore);
			(containerSpa + contatore).setAttribute("name",	"mySpanName"	+ contatore);
			(containerSpa + contatore).setAttribute("class",	"BibleRef");
			(containerSpa + contatore).textContent = "Testo dello SPAN, id: mySpanId" + contatore + ", name: mySpanName" + contatore + ", class: BibleRef";

			(containerPar + contatore).setAttribute("id",    "myParId"     + contatore);
			(containerPar + contatore).setAttribute("name",  "myParName"   + contatore);
			(containerPar + contatore).setAttribute("class", "myParClass");
			(containerPar + contatore).textContent = "Testo del PAR, id: myParId" + contatore + ", name: myParName"  + contatore + ", class: myParClass";

			(containerSpa + contatore).appendChild(containerPar + contatore);
			(containerDiv + contatore).appendChild(containerSpa + contatore);
			contentEl.appendChild(containerDiv + contatore);

			contatore++;
		}

		new Setting(contentEl)
			.addButton((btn) =>
				btn
			.setButtonText("Chiudi")
			.setCta()
			.onClick(() => {
				this.close();
			}));
	}
	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
	async onChangeTags() {
		await app.fileManager.processFrontMatter(tfile, (fm) => {});
		this.textarea.inputEl.value += "End: " +new Date().toString() + "\n";
	}
}

new openModal(this.app).open();

return // Termina senza alcuna modifica alla nota ora

```



```dataviewjs
dv.el("b", "This is some bold text");


  // Add CSS class to Dataview div block.
  dv.container.className += " my-css-class";
  // Render a list.
  const div = dv.el("div", "Here is my list: ", {
    container: dv.container,
    cls: "my-class-for-list",
  });
  const ul = dv.el("ul", "", {
    container: div,
  });
  ul.innerText = ""; // a "bug" into Dataview add an extra span everywhere when there is an empty string, here we remove it.

  for (let index = 0; index < 10; index++)
    dv.el("li", index, { container: ul, cls: "my-class-for-item" });

dv.header(1, "Big!"); // alias of dv.el(h1, "Big!");
dv.header(6, "Tiny");// alias of dv.el(h6, "Tiny!");

dv.paragraph("This is some text"); // alias of dv.el(p, "This is some text");

dv.span("This is some text"); // alias of dv.el(span, "This is some text");

```
