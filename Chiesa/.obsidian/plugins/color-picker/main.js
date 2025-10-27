'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const obsidian = require('obsidian');

class ColorInputModal extends obsidian.Modal {
    constructor(app, selectedText, onSubmit, history) {
        super(app);
        this.selectedText = selectedText;
        this.onSubmit = onSubmit;
        this.history = history || [];
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.style.fontFamily = "sans-serif";
        contentEl.style.padding = "20px";

        // Strip out any <span style="color:..."> but preserve all interior Markdown formatting
        const cleanText = this.selectedText.replace(
            /<span\s+style=["']color:\s*[^"']+["']\s*(?:[^>]*)>([\s\S]+?)<\/span>/gi,
            '$1'
        );

        // Title
        const title = contentEl.createEl("h2", { text: "🎨 Choose Text Color" });
        title.style.textAlign = "center";

        // Container row for preview + color picker side-by-side
        const row = contentEl.createEl("div");
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.justifyContent = "center";
        row.style.gap = "1em";

        // Preview: show the plain text (including Markdown symbols) with pre-wrap so newlines/dashes remain
        const preview = row.createEl("div");
        preview.style.whiteSpace = "pre-wrap";
        preview.style.color = "#6A5ACD";
        preview.style.fontWeight = "bold";
        preview.style.fontSize = "1.2em";
        preview.style.backgroundColor = "transparent";
        preview.innerText = cleanText; // keep literal Markdown (e.g. "**bold**", "- bullet")

        // Color input
        const colorInput = row.createEl("input", { type: "color" });
        colorInput.value = "#6A5ACD";
        colorInput.style.width = "60px";
        colorInput.style.height = "40px";
        colorInput.style.border = "none";
        colorInput.style.borderRadius = "6px";
        colorInput.style.boxShadow = "0 0 4px rgba(0,0,0,0.2)";
        colorInput.style.cursor = "pointer";

        colorInput.oninput = () => {
            preview.style.color = colorInput.value;
        };

        // Recent colors, aligned left
        if (this.history.length > 0) {
            const recentTitle = contentEl.createEl("h4", { text: "Recent Colors:" });
            recentTitle.style.textAlign = "left";
            recentTitle.style.marginBottom = "0.2em";

            const historyWrap = contentEl.createDiv();
            historyWrap.style.display = "flex";
            historyWrap.style.flexWrap = "wrap";
            historyWrap.style.gap = "6px";
            historyWrap.style.justifyContent = "flex-start";

            this.history.forEach((hex) => {
                const swatch = historyWrap.createEl("div");
                swatch.style.width = "24px";
                swatch.style.height = "24px";
                swatch.style.borderRadius = "4px";
                swatch.style.border = "1px solid #ccc";
                swatch.style.background = hex;
                swatch.style.cursor = "pointer";
                swatch.title = hex;
                swatch.onclick = () => {
                    colorInput.value = hex;
                    preview.style.color = hex;
                };
            });
        }

        // Apply button
        const btnContainer = contentEl.createEl("div");
        btnContainer.style.display = "flex";
        btnContainer.style.justifyContent = "center";
        btnContainer.style.marginTop = "1em";

        const applyBtn = new obsidian.ButtonComponent(btnContainer);
        applyBtn.setButtonText("Apply Color")
            .setCta()
            .onClick(() => {
                const color = colorInput.value;
                // Wrap the original Markdown in a span with color + pre-wrap
                // so that newlines, bullets, asterisks remain as-is.
                const result = `<span style="color: ${color}; white-space: pre-wrap;">${cleanText}</span>`;

                // Update history
                if (!this.history.includes(color)) {
                    this.history.unshift(color);
                }
                // Pass the final text back to caller
                this.onSubmit(result, this.history.slice(0, 6));
                this.close();
            });
    }

    onClose() {
        this.contentEl.empty();
    }
}

class ColorPickerPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.colorHistory = [];
    }

    onload() {
        this.registerEvent(
            this.app.workspace.on("editor-menu", (menu, editor) => {
                const selectedText = editor.getSelection();
                if (!selectedText) return;
                menu.addItem((item) => {
                    item.setTitle("Change Text Color")
                        .setIcon("palette")
                        .onClick(() => {
                            new ColorInputModal(
                                this.app,
                                selectedText,
                                (updated, hist) => {
                                    this.colorHistory = hist;
                                    editor.replaceSelection(updated);
                                },
                                this.colorHistory
                            ).open();
                        });
                });
            })
        );
    }
}
exports.default = ColorPickerPlugin;