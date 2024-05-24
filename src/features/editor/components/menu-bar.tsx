import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import type { ReactNode } from "react";
import DisplayMenu from "./display-menu";
import FileMenu from "./file-menu";

export default function MenuBar(): ReactNode {
  return (
    <AppBar position="static">
      <Toolbar variant="dense" disableGutters sx={{ minHeight: 0 }}>
        <FileMenu />
        <DisplayMenu />
      </Toolbar>
    </AppBar>
  );
}
