
const { Plugin, Notice } = require("obsidian");

const includeFolders = [
	"Documenti pontifici",
	"Documenti vari"];

const excludePrefix = "_";

const excludeFolders = [
	"Calendario",
	"La Sacra Bibbia",
	"Lezionari",
	"Messaggi",
	"Papi",
	"Santi",
	"Vocaboli",
	"z_Modelli",
	"z_Script"];

const excludedWords = [
	"il", "lo", "la",
	"i", "gli", "le",
	"un", "uno", "una",
	"di", "a", "da",
	"in", "con", "su", 
	"per", "tra", "fra",
	"al", "alla", "ai",
	"agli", "alle", "coi",
	"sui", "sugli", "dei",
	"degli", "dal", "dai",
	"mio", "tuo", "suo",
	"nostro", "vostro", "loro",
	"l", "altro", "altra"];

// PRIMA del plugin: definizione visibile in anticipo
function removeFrontmatter(content) {
	if (content.startsWith("---")) {
		const lines = content.split(/\r?\n/);
		let endIndex = -1;
		for (let i = 1; i < lines.length; i++) {
			if (lines[i].trim() === "---") {
				endIndex = i;
				break;
			}
		}
		if (endIndex !== -1) {
			return lines.slice(endIndex + 1).join("\n");
		}
	}
	return content;
}

function normalizeWord(word) {
	const parts = word
		.toLowerCase()
		.split("'")
		.map(p => p.replace(/[^a-zàèéìòù]/gi, ''))
		.filter(Boolean);

	return parts;
}

async function createFolderIfNotExists(folderPath) {
	const folders = folderPath.split("/");
	let currentPath = "";

	for (const folder of folders) {
		currentPath = currentPath ? `${currentPath}/${folder}` : folder;
		try {
			await app.vault.createFolder(currentPath);
		}
		catch (e) {
		// folder may already exist, ignore error
		}
	}
}





module.exports = class VocabolarioIndexerPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: "indicizza-vocabolario",
			name: "Indicizza Vocabolario",
			callback: () => this.indicizzaVocabolario()
		});
	}

	async indicizzaVocabolario() {
		const vault = app.vault;
		const files = vault.getMarkdownFiles();
		const wordMap = {};

		for (const file of files) {
			const relativePath = file.path;

			// ESCLUSIONI CARTELLE
			if (excludeFolders.some(folder => relativePath.startsWith(folder + "/"))) continue;

			// ESCLUSIONE FILE CHE INIZIANO CON IL PREFISSO DI ESCLUSIONE
			if (file.name.startsWith(excludePrefix)) continue;

			// ESCLUSIONE INCLUSIONE CARTELLE
			if (includeFolders.length > 0 && !includeFolders.some(folder => relativePath.startsWith(folder + "/"))) continue;

			let content = await vault.read(file);
			// RIMUOVI FRONTMATTER YAML
			content = removeFrontmatter(content);

			const lines = content.split(/\r?\n/);
			lines.forEach((line, lineIndex) => {
				const rawWords = line.split(/\s+/);

				for (let word of rawWords) {
					const normalizedParts = normalizeWord(word);

					for (const part of normalizedParts) {
						if (!part || excludedWords.includes(part)) continue;

						const initial = part[0].toUpperCase();
						if (!/^[A-Z]$/.test(initial)) continue;

						if (!wordMap[initial]) wordMap[initial] = [];
							wordMap[initial].push(`${part} → ${file.name} (riga ${lineIndex + 1})`);
					}
				}
			});
		}

		const vocaboliFolder = "Vocaboli";
		await createFolderIfNotExists(vocaboliFolder);

		for (const letter in wordMap) {
			const wordList = wordMap[letter].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }));
			const filePath = `${vocaboliFolder}/Vocaboli_${letter}.md`;
			await vault.adapter.write(filePath, `# Vocabolario - Lettera ${letter}\n\n${wordList.join("\n")}`);
		}

		new Notice("⚙️ Vocabolario indicizzato con successo!");
	}
};