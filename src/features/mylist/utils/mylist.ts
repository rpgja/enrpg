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

  static prefix = "# ";

  static parse(input: string): Mylist {
    const index = input.indexOf("\n");
    const name = input.slice(Mylist.prefix.length, index);
    const presets = input
      .split(Preset.prefix)
      .map((v) => Preset.parse(Preset.prefix + v));
    return new Mylist({ name, presets });
  }

  static stringify(mylist: Mylist): string {
    let str = "";
    str += Mylist.prefix + mylist.name;
    for (const preset of mylist.presets) {
      str += `\n\n${Preset.stringify(preset)}`;
    }
    return str;
  }
}
