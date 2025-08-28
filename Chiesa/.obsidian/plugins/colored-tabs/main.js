import { Plugin } from 'obsidian';

export default class ColoredTabsPlugin extends Plugin {
	async onload() {
		console.log('Loading Colored Tabs plugin');

		this.app.workspace.on('active-leaf-change', (leaf) => {
			this.updateTabColor(leaf);
		});

		// Initial update when the plugin loads
		this.updateTabColor(this.app.workspace.activeLeaf);
	}

	onunload() {
		console.log('Unloading Colored Tabs plugin');
		// Remove the class when the plugin is unloaded
		document.body.classList.remove('nav-folder-from-specific-folder');
	}

	updateTabColor(leaf) {
		// Replace with your folder name
		const specificFolder = "Calendario";
		const body = document.body;

		if (leaf && leaf.view && leaf.view.file) {
			const file = leaf.view.file;
			const filePath = file.path;

			// Check if the file is in the specific folder AND doesn't start with "_"
			if (filePath.startsWith(specificFolder + "/") && !file.name.startsWith("_")) {
				if (!body.classList.contains('nav-folder-from-specific-folder')) {
					body.classList.add('nav-folder-from-specific-folder');
				}
			} else {
				body.classList.remove('nav-folder-from-specific-folder');
			}
		} else {
			body.classList.remove('nav-folder-from-specific-folder');
		}
	}
}