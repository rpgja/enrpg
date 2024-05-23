"use client";

import { RPGMap } from "@/features/rpgen/utils/map";
import { useEffect, useState, type ReactNode } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button"
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import TimerProvider from "./timer-provider";
import UninitializedScreen from "./uninitialized-screen";
import CreateMapDialog from "./create-map-dialog";
import LoadMapDialog from "./load-map-dialog";
import { create } from "zustand";
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
        <Stack ref={setAppBar} direction="row">
          <Button>click</Button>
        </Stack>
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
