"use client";

import EditorView, {
  useEditorStore,
} from "@/features/editor/components/editor-view";
import { useEffectOnce } from "@/hooks/once";
import type { ReactNode } from "react";

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

      const mapTextResponse = await fetch("/examples/sample-rpgmap.txt");

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
}
