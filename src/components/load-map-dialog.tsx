import { type ReactNode, useState } from "react";
import { create } from "zustand";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { useEditorStore } from "./app";
import Button from "@mui/material/Button";
import { RPGMap } from "@/features/rpgen/utils/map";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { decompressFromEncodedURIComponent } from "lz-string";
import { Editor } from "@/features/editor/utils/editor";

export type LoadMapDialogStore = {
	open: boolean;
	setOpen: (open: boolean) => void;
};

export const useLoadMapDialogStore = create<LoadMapDialogStore>((set) => ({
	open: false,
	setOpen: (open) => set({ open }),
}));

const COMPRESSED_PLACEHOLDER =
	"MQCQogSg8gUAzAGgOzDAOQCIxsAQgcQFkYALAFzIAcBnALgHp6B3FgOg...";

const PLACEHOLDER = `\
#HERO
3,7#END

#BGM
...
`;

export default function LoadMapDialog(): ReactNode {
	const { open, setOpen } = useLoadMapDialogStore();
	const [loadCompressed, setLoadCompressed] = useState(false);
	const setEditor = useEditorStore((store) => store.setEditor);
	const [disabled, setDisabled] = useState(false);
	const [mapData, setMapData] = useState("");

	return (
		<Dialog onClose={() => setOpen(false)} open={open}>
			<DialogTitle>マップを読み込む</DialogTitle>
			<DialogContent>
				<Stack spacing={1}>
					<FormControlLabel
						control={<Checkbox checked={loadCompressed} />}
						label="圧縮されたマップを読み込む"
						onChange={(_event, checked) => setLoadCompressed(checked)}
					/>
					<TextField
						sx={{
							width: "500px",
						}}
						multiline
						rows={5}
						placeholder={loadCompressed ? COMPRESSED_PLACEHOLDER : PLACEHOLDER}
						value={mapData}
						onChange={(event) => setMapData(event.currentTarget.value)}
					/>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button
					disabled={disabled}
					onClick={() => {
						setDisabled(true);

						const actualMapData = loadCompressed
							? decompressFromEncodedURIComponent(mapData.replace(/^L1/, ""))
							: mapData;

						const rpgMap = RPGMap.parse(actualMapData);

						setEditor(new Editor(rpgMap));
						setDisabled(false);
						setOpen(false);
					}}
				>
					読み込む
				</Button>
			</DialogActions>
		</Dialog>
	);
}
