"use client";

import EditorView, {
  useEditorStore,
} from "@/features/editor/components/editor-view";
import { Mylist } from "@/features/mylist/utils/mylist";
import { useEffectOnce } from "@/hooks/once";
import type { ReactNode } from "react";

export default function App(): ReactNode {
  const { editor, loadMapText } = useEditorStore((store) => ({
    editor: store.editor,
    loadMapText: store.loadMapText,
  }));

  useEffectOnce(() => {
    if (editor) {
      return;
    }
    (async () => {
      const res = await fetch("/examples/rpgmap.dev.txt");
      if (res.ok && !editor) {
        const mapText = await res.text();
        loadMapText(mapText);
      }
    })();
  });

  useEffectOnce(() => {
    (async () => {
      const res = await fetch("/examples/mylist.dev.txt");
      if (res.ok) {
        const mylistText = await res.text();
        const mylist = Mylist.parse(mylistText);
        console.log(mylist);
      }
    })();
  });

  return <EditorView />;
}
