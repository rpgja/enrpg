"use client";

import { RPGMap } from "@/features/rpgen/utils/map";
import { useEffect, useState, type ReactNode } from "react";
import Stack from "@mui/material/Stack";
import CheckIcon from "@mui/icons-material/Check";
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
import { Editor, RPGENGrid } from "@/features/editor/utils/editor";

export type EditorStore = {
  editor?: Editor,
  setEditor: (editor: Editor | undefined) => void
};

export const useEditorStore = create<EditorStore>(set => ({
  setEditor: editor => set({ editor })
}));

export default function App(): ReactNode {
  const [_updater, setUpdater] = useState(0n);
  const editorStore = useEditorStore();
  const [appBar, setAppBar] = useState<HTMLDivElement | null>(null);
  const [editorContainer, setEditorContainer] = useState<HTMLDivElement | null>(null);
  const loadMapDialogStore = useLoadMapDialogStore();
  const createMapDialogStore = useCreateMapDialogStore();

  // HACK
  useEffect(() => {
    if (editorStore.editor) {
      return;
    }

    (async () => {
      const rpgMap = RPGMap.parse(await (await fetch("/examples/sample.dev.txt")).text());

      editorStore.setEditor(new Editor(rpgMap));
    })();
  }, []);

  useEffect(() => {
    if (!editorContainer || !editorStore.editor) {
      return;
    }

    editorStore.editor.mount(editorContainer);

    return () => {
      editorStore.editor?.unmount();
    };
  }, [editorContainer, editorStore.editor]);

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
                      disabled: !editorStore.editor,
                      label: "閉じる",
                      callback: () => editorStore.setEditor(undefined)
                    }
                  ]
                }}
              />
              <NestedDropdown
                menuItemsData={{
                  label: "表示",
                  items: [
                    {
                      disabled: !editorStore.editor?.camera,
                      label: "カメラ",
                      items: [
                        {
                          label: "位置をリセット",
                          callback: () => {
                            const camera = editorStore.editor?.camera;

                            if (!camera) {
                              return;
                            }

                            camera.x = 0;
                            camera.y = 0;
                          }
                        },
                        {
                          label: "拡大率をリセット",
                          callback: () => {
                            const camera = editorStore.editor?.camera;

                            if (!camera) {
                              return;
                            }

                            camera.scale = 1;
                          }
                        }
                      ]
                    },
                    {
                      disabled: !editorStore.editor,
                      label: "RPGENグリッド",
                      items: ([
                        ["なし", undefined],
                        ["通常", RPGENGrid.Medium],
                        ["大きい", RPGENGrid.Large],
                        ["最大", RPGENGrid.Largest]
                      ] as const).map(([label, value]) => ({
                        label,
                        rightIcon: editorStore.editor?.rpgenGrid === value ? <CheckIcon /> : undefined,
                        callback: () => {
                          editorStore.editor?.setRPGENGrid(value);
                          setUpdater(prev => prev + 1n);
                        }
                      }))
                    },
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
          {!editorStore.editor && <UninitializedScreen />}
          {!!editorStore.editor && (
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
