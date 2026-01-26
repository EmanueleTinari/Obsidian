// Importa i componenti fondamentali dell'API di Obsidian per estendere le funzionalità dell'editor.
// Imports core components from the Obsidian API to extend editor functionality.
import { Plugin, PluginSettingTab, Setting, App, Notice, Modal, TFolder, MarkdownRenderer } from 'obsidian';
// Importa la funzione di gestione delle traduzioni dal file locale.
// Imports the translation management function from the local file.
import { getTranslations } from './translations';
// Richiede il modulo 'crypto' di Node.js per calcolare gli hash SHA-512
// Requires Node.js 'crypto' module to calculate SHA-512 hashes
import * as crypto from 'crypto';
// Rileva la lingua impostata in Obsidian
// Detect the language set in Obsidian
const obsidianLang = window.localStorage.getItem('language');
// Carica in memoria SOLO il blocco di lingua necessario
// Load ONLY the required language block into memory
const t = getTranslations(obsidianLang);