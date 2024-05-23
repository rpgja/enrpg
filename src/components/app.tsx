"use client";

import { RPGMap } from "@/features/rpgen/utils/map";
import { useEffect, useState, type ReactNode } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import TimerProvider from "./timer-provider";
import UninitializedScreen from "./uninitialized-screen";
import CreateMapDialog, { useCreateMapDialogStore } from "./create-map-dialog";
import LoadMapDialog, { useLoadMapDialogStore } from "./load-map-dialog";
import { NestedDropdown } from "mui-nested-menu";
import { create } from "zustand";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Editor } from "@/features/editor/utils/editor";

export type RPGMapStore = {
  rpgMap?: RPGMap,
  setRPGMap: (rpgMap: RPGMap | undefined) => void
};

export const useRPGMapStore = create<RPGMapStore>(set => ({
  setRPGMap: rpgMap => set({ rpgMap })
}));

export default function App(): ReactNode {
  const { rpgMap, setRPGMap } = useRPGMapStore();
  const [appBar, setAppBar] = useState<HTMLDivElement | null>(null);
  const [editorContainer, setEditorContainer] = useState<HTMLDivElement | null>(null);
  const loadMapDialogStore = useLoadMapDialogStore();
  const createMapDialogStore = useCreateMapDialogStore();

  // HACK
  useEffect(() => {
    if (rpgMap) {
      return;
    }

    (async () => {
      setRPGMap(RPGMap.parse(await (await fetch("/examples/sample.dev.txt")).text()));
    })();
  }, []);

  useEffect(() => {
    if (!editorContainer || !rpgMap) {
      return;
    }

    const editor = new Editor(rpgMap);

    editor.mount(editorContainer);

    return () => {
      editor.unmount();
    };
  }, [editorContainer, rpgMap]);

  return (
    <TimerProvider interval={600}>
      <CreateMapDialog />
      <LoadMapDialog />
      <Stack height="100svh">
        <AppBar position="static">
          <Toolbar
            disableGutters
            variant="dense"
            sx={{ minHeight: 0 }}
          >
            <Stack ref={setAppBar} direction="row">
              <NestedDropdown
                menuItemsData={{
                  label: "ファイル",
                  items: [
                    {
                      label: "新規作成",
                      callback: () => createMapDialogStore.setOpen(true)
                    },
                    {
                      label: "マップを読み込み",
                      callback: () => loadMapDialogStore.setOpen(true)
                    },
                    {
                      disabled: !rpgMap,
                      label: "閉じる",
                      callback: () => setRPGMap(undefined)
                    }
                  ]
                }}
              />
            </Stack>
          </Toolbar>
        </AppBar>
        <noscript>
          <Alert severity="error">
            JavaScriptを有効にしてください
          </Alert>
        </noscript>
        <Box flex={1}>
          {!rpgMap && <UninitializedScreen />}
          {!!rpgMap && (
            <Box
              ref={setEditorContainer}
              width="100%"
              height={appBar ? `calc(100svh - ${appBar.offsetHeight}px)` : "100%"}
            />
          )}
        </Box>
      </Stack>
    </TimerProvider>
  );
}
