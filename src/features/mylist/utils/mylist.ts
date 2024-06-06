import { HumanPreset } from "./human-preset";
import { Preset } from "./preset";
import { SoundPreset } from "./sound-preset";
import { TilePreset } from "./tile-preset";

export type MylistInit = {
  name: string;
  presets: (TilePreset | HumanPreset | SoundPreset)[];
};

export class Mylist {
  name: string;
  presets: (TilePreset | HumanPreset | SoundPreset)[];

  constructor(init: MylistInit) {
    this.name = init.name;
    this.presets = init.presets;
  }

  static prefix = "# ";

  static parse(input: string): Mylist {
    const index = input.indexOf("\n");
    const name = input.slice(Mylist.prefix.length, index);
    const body = input.slice(index + 1);
    const presets = [];
    for (const chunk of `\n${body}`.split(`\n${Preset.prefix}`).slice(1)) {
      const index = chunk.indexOf("\n");
      const name = chunk.slice(0, index);
      const body = chunk.slice(index + 1);
      let preset: Preset | undefined;
      if (TilePreset.lookLike(body)) {
        const init = TilePreset.parseInit(body);
        if (init.floor || init.objects) {
          const { floor, objects } = init;
          preset = new TilePreset({ name, floor, objects });
        }
      } else if (HumanPreset.lookLike(body)) {
        const init = HumanPreset.parseInit(body);
        if (init.humans) {
          const { humans } = init;
          preset = new HumanPreset({ name, humans });
        }
      } else if (SoundPreset.lookLike(body)) {
        const init = SoundPreset.parseInit(body);
        if (init.sounds) {
          const { sounds } = init;
          preset = new SoundPreset({ name, sounds });
        }
      }
      if (preset) {
        preset.name = name;
        presets.push(preset);
      }
    }
    return new Mylist({ name, presets });
  }

  static parseToArray(input: string): Mylist[] {
    if (input.includes(Mylist.prefix)) {
      return `\n${input.trim()}`
        .split(`\n${Mylist.prefix}`)
        .slice(1)
        .map((v) => `${Mylist.prefix}${v}`)
        .map(Mylist.parse);
    }
    return [];
  }

  static stringify(mylist: Mylist): string {
    let str = "";
    str += Mylist.prefix + mylist.name;
    for (const preset of mylist.presets) {
      let str2: string | undefined;
      if (preset instanceof TilePreset) {
        str2 = TilePreset.stringify(preset);
      } else if (preset instanceof HumanPreset) {
        str2 = HumanPreset.stringify(preset);
      } else if (preset instanceof SoundPreset) {
        str2 = SoundPreset.stringify(preset);
      }
      if (str) {
        str += `\n\n${str2}`;
      }
    }
    return str;
  }
}
