"use client";

import EditorView, {
  useEditorStore,
} from "@/features/editor/components/editor-view";
import { Editor } from "@/features/editor/utils/editor";
import { RPGMap } from "@/features/rpgen/utils/map";
import { useEffectOnce } from "@/hooks/once";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { NestedDropdown } from "mui-nested-menu";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { create } from "zustand";

export default function App(): ReactNode {
  const { editor, loadMapText } = useEditorStore((store) => ({
    editor: store.editor,
    loadMapText: store.loadMapText,
  }));

  useEffectOnce(() => {
    (async () => {
      if (editor) {
        return;
      }

      const mapTextResponse = await fetch("/examples/sample.dev.txt");

      if (!mapTextResponse.ok) {
        return;
      }

      const mapText = await mapTextResponse.text();

      if (!editor) {
        loadMapText(mapText);
      }
    })();
  });

  return <EditorView />;
  // const [_updater, setUpdater] = useState(0n);
  // const {editor,setEditor} = useEditorStore();
  // const [appBar, setAppBar] = useState<HTMLDivElement | null>(null);
  // const [editorContainer, setEditorContainer] = useState<HTMLDivElement | null>(
  //   null,
  // );
  // const loadMapDialogStore = useLoadMapDialogStore();
  // const createMapDialogStore = useCreateMapDialogStore();
  // const loadedExample = useRef(false);
  // // HACK
  // useEffect(() => {
  //   if (editor || loadedExample.current) {
  //     return;
  //   }
  //   loadedExample.current = true;
  // //   (async () => {
  // //     const rpgMap = RPGMap.parse(
  // //       await (await fetch("/examples/sample.dev.txt")).text(),
  // //     );
  // //     editorStore.setEditor(new Editor(rpgMap));
  // //   })();
  // // }, [editorStore.editor, editorStore.setEditor]);
  // useEffect(() => {
  //   if (!editorContainer || !editor) {
  //     return;
  //   }
  //   editorContainer.append(editorStore.editor.renderer);
  //   editorStore.editor.mount(editorContainer);
  //   return () => {
  //     editorStore.editor?.unmount();
  //   };
  // }, [editorContainer, editorStore.editor]);
  // return (
  //   <TimerProvider interval={600}>
  //     <CreateMapDialog />
  //     <LoadMapDialog />
  //     <Stack height="100svh">
  //       <AppBar position="static">
  //         <Toolbar disableGutters variant="dense" sx={{ minHeight: 0 }}>
  //           <Stack ref={setAppBar} direction="row">
  //             <NestedDropdown
  //               menuItemsData={{
  //                 label: "ファイル",
  //                 items: [
  //                   {
  //                     label: "新規作成",
  //                     callback: () => createMapDialogStore.setOpen(true),
  //                   },
  //                   {
  //                     label: "マップを読み込み",
  //                     callback: () => loadMapDialogStore.setOpen(true),
  //                   },
  //                   {
  //                     disabled: !editorStore.editor,
  //                     label: "閉じる",
  //                     callback: () => editorStore.setEditor(undefined),
  //                   },
  //                 ],
  //               }}
  //             />
  //             <NestedDropdown
  //               menuItemsData={{
  //                 label: "表示",
  //                 items: [
  //                   {
  //                     disabled: !editorStore.editor?.camera,
  //                     label: "カメラ",
  //                     items: [
  //                       {
  //                         label: "位置をリセット",
  //                         callback: () => {
  //                           const camera = editorStore.editor?.camera;
  //                           if (!camera) {
  //                             return;
  //                           }
  //                           camera.x = 0;
  //                           camera.y = 0;
  //                         },
  //                       },
  //                       {
  //                         label: "拡大率をリセット",
  //                         callback: () => {
  //                           const camera = editorStore.editor?.camera;
  //                           if (!camera) {
  //                             return;
  //                           }
  //                           camera.scale = 1;
  //                         },
  //                       },
  //                     ],
  //                   },
  //                   {
  //                     disabled: !editorStore.editor,
  //                     label: "RPGENグリッド",
  //                     items: [
  //                       {
  //                         label: "サイズ",
  //                         items: (
  //                           [
  //                             ["なし", undefined],
  //                             ["通常", RPGENGrid.Medium],
  //                             ["大きい", RPGENGrid.Large],
  //                             ["最大", RPGENGrid.Largest],
  //                           ] as const
  //                         ).map(([label, value]) => ({
  //                           label,
  //                           rightIcon:
  //                             editorStore.editor?.rpgenGrid === value ? (
  //                               <CheckIcon />
  //                             ) : undefined,
  //                           callback: () => {
  //                             editorStore.editor?.setRPGENGrid(value);
  //                             setUpdater((prev) => prev + 1n);
  //                           },
  //                         })),
  //                       },
  //                       {
  //                         label: "色",
  //                         items: (
  //                           [
  //                             ["ゲーミング", RPGENGridColor.Gaming],
  //                             ["反転", RPGENGridColor.Invert],
  //                           ] as const
  //                         ).map(([label, value]) => ({
  //                           label,
  //                           rightIcon:
  //                             editorStore.editor?.rpgenGridColor === value ? (
  //                               value === RPGENGridColor.Gaming ? (
  //                                 <StarIcon />
  //                               ) : (
  //                                 <CheckIcon />
  //                               )
  //                             ) : undefined,
  //                           callback: () => {
  //                             editorStore.editor?.setRPGENGridColor(value);
  //                             setUpdater((prev) => prev + 1n);
  //                           },
  //                         })),
  //                       },
  //                     ],
  //                   },
  //                 ],
  //               }}
  //             />
  //           </Stack>
  //         </Toolbar>
  //       </AppBar>
  //       <noscript>
  //         <Alert severity="error">JavaScriptを有効にしてください</Alert>
  //       </noscript>
  //       <Box flex={1}>
  //         {!editorStore.editor && <UninitializedScreen />}
  //         {!!editorStore.editor && (
  //           <Box
  //             ref={setEditorContainer}
  //             width="100%"
  //             height={
  //               appBar ? `calc(100svh - ${appBar.offsetHeight}px)` : "100%"
  //             }
  //           />
  //         )}
  //       </Box>
  //     </Stack>
  //   </TimerProvider>
  // );
}
