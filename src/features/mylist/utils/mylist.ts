import { HumanPreset } from "./human-preset";
import { Preset } from "./preset";
import { SoundPreset } from "./sound-preset";
import { TilePreset } from "./tile-preset";

export type MylistInit = {
  name: string;
  presets: TilePreset[] | HumanPreset[] | SoundPreset[];
};

export class Mylist {
  name: string;
  presets: TilePreset[] | HumanPreset[] | SoundPreset[];

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
    for (const chunk of body.split(Preset.prefix)) {
      const index = chunk.indexOf("\n");
      const name = chunk.slice(Preset.prefix.length, index);
      const body = chunk.slice(index + 1);
      let preset: Preset | undefined;
      if (TilePreset.lookLike(body)) {
        preset = TilePreset.parse(body);
      } else if (HumanPreset.lookLike(body)) {
        preset = HumanPreset.parse(body);
      } else if (SoundPreset.lookLike(body)) {
        preset = SoundPreset.parse(body);
      }
      if (preset) {
        preset.name = name;
        presets.push(preset);
      }
    }
    return new Mylist({ name, presets });
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
