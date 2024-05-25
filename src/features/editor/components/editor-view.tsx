import UninitializedScreen from "@/components/uninitialized-screen";
import { RPGMap } from "@/features/rpgen/utils/map";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { type ReactNode, useEffect, useState } from "react";
import { create } from "zustand";
import { Editor } from "../utils/editor";
import CreateMapDialog from "./create-map-dialog";
import LoadMapDialog from "./load-map-dialog";
import MenuBar from "./menu-bar";
import SaveMapDialog from "./save-map-dialog";

export type EditorStore = {
  editor?: Editor;
  setEditor: (editor: Editor | undefined) => void;
  loadMapText: (mapText: string) => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  setEditor: (editor) => set({ editor }),
  loadMapText: (mapText) =>
    set({
      editor: new Editor(RPGMap.parse(mapText)),
    }),
}));

export default function EditorView(): ReactNode {
  const [canvasContainer, setCanvasContainer] = useState<HTMLDivElement | null>(
    null,
  );
  const { editor } = useEditorStore();

  useEffect(() => {
    if (!editor || !canvasContainer) {
      return;
    }

    editor.mount(canvasContainer);

    return () => {
      editor.unmount();
    };
  }, [editor, canvasContainer]);

  return (
    <>
      <CreateMapDialog />
      <LoadMapDialog />
      <SaveMapDialog />
      <Stack height="100svh" overflow="hidden">
        <MenuBar />
        <Box flex={1} height="100%">
          {!editor && <UninitializedScreen />}
          {editor && <Box height="100%" ref={setCanvasContainer} />}
        </Box>
      </Stack>
    </>
  );
}
