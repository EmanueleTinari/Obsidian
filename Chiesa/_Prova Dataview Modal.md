

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

		var numElementi = 12;
		var contatore = 1
			const containerDiv = document.createElement("div");
			const containerSpa = document.createElement("span");
			const containerPar = document.createElement("p");
			
			containerDiv.setAttribute("id",   "myDivId"      + contatore);
			containerDiv.setAttribute("name", "myDivName"    + contatore);
			containerDiv.setAttribute("class", "myDivClass");
			
			containerSpa.setAttribute("id",   "mySpanId"     + contatore);
			containerSpa.setAttribute("name", "mySpanName"   + contatore);
			containerSpa.setAttribute("class", "BibleRef");
			containerSpa.textContent = "Testo dello SPAN";

			containerPar.setAttribute("id",    "myParId"     + contatore);
			containerPar.setAttribute("name",  "myParName"   + contatore);
			containerPar.setAttribute("class", "myParClass");

			containerSpa.appendChild(containerPar);
			containerDiv.appendChild(containerSpa);
			contentEl.appendChild(containerDiv);
		
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


<span class="BibleRef">[[Matteo 01|Matteo 1]]</span>


<div class="BibleRef">
[[Matteo 01|Matteo 1]]
</div>


<p class="BibleRef">[[Matteo 01|Matteo 1]]</p>


[[Matteo 01|Matteo 1]]

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