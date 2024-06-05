import { Preset } from "./preset";

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

  static parse(input: string): Mylist {
    return new Mylist({ name: "test", presets: [] });
  }

  static stringify(mylist: Mylist): string {
    let str = "";
    str += `# ${mylist.name}`;
    for (const preset of mylist.presets) {
      str += `\n\n${Preset.stringify(preset)}`;
    }
    return str;
  }
}
