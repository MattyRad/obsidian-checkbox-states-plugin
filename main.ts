import {
	type Editor,
	type MarkdownView,
	Plugin,
	type Menu,
	type MarkdownFileInfo,
	type EditorPosition,
	type MenuItem,
} from 'obsidian';
import SettingsTab from './src/settings-tab';

export class Box {
	interior: string;
	represents: string;
	icon: null | string;
}

/**
 * https://github.com/colineckert/obsidian-things
 */
export const DEFAULT = [
	{interior: '/', represents: 'incomplete', icon: null},
	{interior: 'x', represents: 'done', icon: null},
	{interior: '-', represents: 'canceled', icon: null},
	{interior: '>', represents: 'forwarded', icon: null},
	{interior: '<', represents: 'scheduling', icon: null},
	{interior: '?', represents: 'question', icon: null},
	{interior: '!', represents: 'important', icon: null},
	{interior: '*', represents: 'star', icon: null},
	{interior: '"', represents: 'quote', icon: null},
	{interior: 'l', represents: 'location', icon: null},
	{interior: 'b', represents: 'bookmark', icon: null},
	{interior: 'i', represents: 'information', icon: null},
	{interior: 'S', represents: 'savings', icon: null},
	{interior: 'I', represents: 'idea', icon: null},
	{interior: 'p', represents: 'pros', icon: null},
	{interior: 'c', represents: 'cons', icon: null},
	{interior: 'f', represents: 'fire', icon: null},
	{interior: 'k', represents: 'key', icon: null},
	{interior: 'w', represents: 'win', icon: null},
	{interior: 'u', represents: 'up', icon: null},
	{interior: 'd', represents: 'down', icon: null},
	{interior: 'D', represents: 'draft pull request', icon: null},
	{interior: 'P', represents: 'open pull request', icon: null},
	{interior: 'M', represents: 'merged pull request', icon: null},
];

type CheckboxStatesSettings = {
	boxSettings: Box[];
};

const defaultSettings: CheckboxStatesSettings = {
	boxSettings: DEFAULT,
};

export default class CheckboxStates extends Plugin {
	settings: CheckboxStatesSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SettingsTab(this.app, this));

		this.registerEvent(this.app.workspace.on('editor-menu', this.onEditorMenu));
	}

	private readonly onEditorMenu = (menu: Menu, editor: Editor, info: MarkdownView | MarkdownFileInfo): void => {
		const selections = editor.listSelections();

		const selection = selections[0];

		const position: EditorPosition | undefined = selection?.anchor;

		const line = editor.getLine(position.line);

		if (line.contains('- [ ]')) {
			for (const box of this.settings.boxSettings) {
				menu.addItem((item: MenuItem) => {
					item.setTitle(box.represents);
					if (box.icon) {
						item.setIcon(box.icon);
					}

					item.onClick(() => {
						const replacement = line.replace(
							'- [ ]',
							`- [${box.interior}]`,
						);

						if (!position) {
							return;
						}

						const p1: EditorPosition = {line: position.line, ch: 0};
						const p2: EditorPosition = {
							line: position.line,
							ch: line.length,
						};

						editor.replaceRange(replacement, p1, p2);
					});
				});
			}
		}
	};

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, defaultSettings, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
