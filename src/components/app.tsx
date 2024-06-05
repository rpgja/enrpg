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
    (async () => {
      if (editor) {
        return;
      }

      const res = await fetch("/examples/sample-rpgmap.txt");

      if (!res.ok) {
        return;
      }

      const mapText = await res.text();

      if (!editor) {
        loadMapText(mapText);
      }
    })();
  });

  useEffectOnce(() => {
    (async () => {
      if (editor) {
        return;
      }

      const res = await fetch("/examples/sample-mylist.txt");

      if (!res.ok) {
        return;
      }

      const mylistText = await res.text();

      if (!editor) {
        if (mylistText.includes(Mylist.prefix)) {
          const mylistArray = `\n${mylistText}`
            .split(`\n${Mylist.prefix}`)
            .filter((v) => v)
            .map((v) => `${Mylist.prefix}${v}`)
            .map(Mylist.parse);
          console.log(mylistArray);
        }
      }
    })();
  });

  return <EditorView />;
}
