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
import { decompressFromEncodedURIComponent } from "lz-string";
import { loadImage } from "@/utils/image";
import { SpriteType } from "@/features/rpgen/types/sprite";
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

    const maptext = decompressFromEncodedURIComponent("MQCQogSg8gUAzAGgOzDAOQCIxsAQgcQFkYALAFzIAcBnALgHp6B3FgOgE8B7AVzO4CMApqwDGnALbMAhmREkA-ADcAvAA4mEAGYAtAIyqAUvygBzVJmx58ASUL5SFGg3oBLVi-EnuAJ1ET6AI4uaLrcAHYAJqwAVpRm6Fg4AGIAMlBQEDAADAD6qgAEuQVFhXmlxWUlVZU1FXXlDdX1TY21rc1tLV2dPR197QPd-UODvaPDYyNTkzN12bPji9MTK0sLy2urG9vru1t7m4c7+6rzJ0cHxxfnV7eX9zcP1893j6evL08f31+-b5--H6Av7jM4A8FAiEgyEw6Fw4EIgFggBsZVRBXR+UxmNhiNxULx8IJxPxpLyKIWOKJZMJtJJ1IZdJpoJKVP6bPpTMZnJ5zL53NeYP5XJFvIF4tFws5QolYslsqlioVyrmSvl6rlmrVWpV7RlGu1ht1RoNxtm+p1pqtlptJttDwtdqdZutztdjMdLvt7p93r9as9vrd-q9wbD5vDQdD0ajsaRkZDcYTyZj5UDiYzKaTqbd6azmZzhezVrzRYLxfLlYD+ZrZdrFaBpYbdZbzbb8dbVc79a7tKbvYHPaH3fJw-bY8HI76-Yns6nk59M-nc-Hy5dS9Xm4X26zG53a63K8te6Pp4P+4RJ-PZ8P17+V9vj4vz+FD5fd6fN+ub6-v4-79Vf8-0-ID4R-UCQMggDNnAqDgOgm9YIQiDkLg2okPgzCUMjDDsLwtDH1wgjUJIlciNI-CKM3cisOI2jExoyj6OYiVGLopiONjNiqJ4ljFz43jONQ7iBNEoTBTE9ipKokTxLk6SaVkhT5ME9UlNUjTJIJdStN0lSmh0-SjOUt5DJMzTjI7cy9Os1szIs2zHKshyXJs8t7LczzOI8yyvMcnynL81zR180LAvXILIrC5yovCuK5QC4L4psxLYqS1TUuitKyOyrK8tM3LkvymLisK9LjkyoqqocyrytK-DarKpqY0a+rqpytq6vasDmu6vqYN6rqhokzrBti1r+rGotzESYBCAAQQABWwbB8jW-Qcl0ABWFaYDW-IACZUQAFn2taDoAThyA7VvyXRcmRO6HqenJkRmywQAAVQWtAYH0BBVAQY6ECyBBdCB0H3pwL6fpgABacHdERsGUeO0HABmtQADBih0Bvvm375sR4HkfBtGEEAKoZABuGQBnhkADoZACcgnGABVcCgAANeAEEQQBc7UARu9McAIQZAB+GQBAf5xwhFqgaw0CZmBAaQIGLuO8HEBQBJLAAZUl6XZfBraQYQQB1BkASIZAE8GQB9BhxrWpZlmB9f10HAAA5QAyvUAWQZACiGE2Lat7XbYV-XwcAGnNAGV9HGwF9pn8jIAAPWhEDIdhaAuhAcEWkAsij8RaFBnBCA1+ws-BnAwCwYBFpSHJ8BSLBFFoIvUFLtOEiyVOQF0TPs4QagmFoBATDrlO5vzmAs4OweS9bhJdFbg6O9B7ve-7sfc+HrPEGLxvwEwG6y5AOA567nu+7jwe84L2hgY3yfMDgYuLGLiOo9j4GE7r+u04zshC9P1faEAVQZADxDMbQAVgyABEGQA5gzj03s3O+iQgA");
    setRPGMap(RPGMap.parse(maptext));
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
