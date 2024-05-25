import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { type ReactNode, useState } from "react";
import DisplayMenu from "./display-menu";
import { useEditorStore } from "./editor-view";
import FileMenu from "./file-menu";

export default function MenuBar(): ReactNode {
  const editor = useEditorStore((store) => store.editor);
  const [layerLevel, setLayerLevel] = useState(10);

  return (
    <AppBar sx={{ backgroundColor: "background.paper" }} position="static">
      <Toolbar variant="dense" disableGutters sx={{ minHeight: 0 }}>
        <Stack direction="row" spacing={4}>
          <Stack direction="row">
            <FileMenu />
            <DisplayMenu />
          </Stack>
          <FormControlLabel
            label="レイヤー"
            labelPlacement="start"
            control={
              <Slider
                min={0}
                max={10}
                value={layerLevel}
                size="small"
                sx={{ width: "10rem", marginLeft: "1rem" }}
                onChange={(_event, value) => {
                  if (typeof value !== "number") {
                    return;
                  }

                  setLayerLevel(value);
                  editor?.renderer.setLayerLevel(value);
                }}
              />
            }
          />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
