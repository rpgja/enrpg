import type { Preset } from "./preset";

export type MylistInit = {
  name: string;
  presets: Preset[];
};

export class Mylist {
  name: string;
  presets: Preset[];

  constructor(init: MylistInit) {
    this.name = init.name;
    this.presets = init.presets;
  }

  serialize(): string {
    let serialized = "";

    serialized += `# ${this.name}`;

    for (const preset of this.presets) {
      serialized += `\n\n${preset.serialize()}`;
    }

    return serialized;
  }
}
