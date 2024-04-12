import CheckboxStates from "../main";
import { Box, DEFAULT } from "../main";
import { App, PluginSettingTab, Setting, TextComponent, ToggleComponent } from "obsidian";


function get(box: Box, settings: Box[]): null|Box {
  return settings.find((b: Box) => b.interior === box.interior) || null;
}

function add(box: Box, settings: Box[]): Box[] {
  settings.push(box);
  settings = settings.sort();
  return settings;
}

function remove(box: Box, settings: Box[]): Box[] {
  settings = settings.filter(b => b.interior !== box.interior)
  settings = settings.sort();
  return settings;
}

export default class SettingTab extends PluginSettingTab {
  plugin: CheckboxStates;

  constructor(app: App, plugin: CheckboxStates) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    for (const box of DEFAULT) {
      new Setting(containerEl)
        .setName(box.represents)
        .setDesc(box.interior)
        .addText((component: TextComponent) => {
          component.setPlaceholder('icon');

          var icon_box = get(box, this.plugin.settings.boxSettings)?.icon;

          if (icon_box) {
            component.setValue(icon_box);
          }

          component.onChange(async (value: string) => {
            if (value) {
              this.plugin.settings.boxSettings = this.plugin.settings.boxSettings.map((b: Box) => {
                if (b.interior === box.interior) {
                  b.icon = value;
                  return b;
                }

                return b;
              });
              await this.plugin.saveSettings();
            }
          })
        })
        .addToggle((component: ToggleComponent) => {
          component.setValue(!! get(box, this.plugin.settings.boxSettings));
          component.onChange(async (value: boolean) => {
            if (value) {
              this.plugin.settings.boxSettings = add(box, this.plugin.settings.boxSettings);
            } else {
              this.plugin.settings.boxSettings = remove(box, this.plugin.settings.boxSettings);
            }

            await this.plugin.saveSettings();
          })
        })
    }
  }
}