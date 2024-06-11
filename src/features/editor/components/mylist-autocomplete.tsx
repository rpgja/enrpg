import type { Mylist } from "@/features/mylist/utils/mylist";
import { Autocomplete, TextField } from "@mui/material";
import { create } from "zustand";

export type MylistStore = {
  mylists?: Mylist[];
  setMylists: (mylists: Mylist[] | undefined) => void;
};

export const useMylistStore = create<MylistStore>((set) => ({
  setMylists: (mylists) => set({ mylists }),
}));

export default function MylistAutocomplete() {
  const { mylists } = useMylistStore();
  if (!mylists) {
    return;
  }
  const options = mylists.flatMap((mylist) =>
    mylist.presets.map((preset) => ({
      mylistName: mylist.name,
      name: preset.name,
      value: `${mylist.name}_${preset.name}`,
    })),
  );

  return (
    <Autocomplete
      id="grouped-demo"
      options={options}
      groupBy={(option) => option.mylistName}
      getOptionLabel={(option) => option.name}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="With categories" />
      )}
    />
  );
}
