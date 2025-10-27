

```dataviewjs

// direct access to the "tp" templater API
// https://forum.obsidian.md/t/js-using-the-template-tp-object-outside-of-templater-scripts-like-in-the-console-or-customjs/71485
const templater = app.plugins.plugins["templater-obsidian"].templater;
const tp = templater.current_functions_object;
// import { App, Modal, Setting } from "obsidian";
const Modal = tp.obsidian.Modal;
const Setting = tp.obsidian.Setting;

let modal = new Modal(app);
modal.titleEl.setText("Qui il titolo");
modal.contentEl.setText("Qui il contenuto");
modal.open();

```


