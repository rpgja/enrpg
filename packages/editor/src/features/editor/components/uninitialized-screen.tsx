"use client";

import TimerProvider from "@/components/timer-provider";
import DQAnimationSpriteImage from "@/features/rpgen/components/dq-animaton-sprite-image";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import arrayShuffle from "array-shuffle";
import { arrayFrom, execPipe, map, take } from "iter-tools";
import { type ReactNode, useMemo } from "react";
import { DQAnimationSpriteSurface } from "@rpgja/rpgen-map";
import { Direction } from "@rpgja/rpgen-map";
import { ANIMATION_SPRITE_FLIP_INTERVAL } from "@rpgja/rpgen-map";
import { useCreateMapDialogStore } from "./create-map-dialog";
import { useLoadMapDialogStore } from "./load-map-dialog";

export default function UninitializedScreen(): ReactNode {
  const createMapDialogStore = useCreateMapDialogStore();
  const loadMapDialogStore = useLoadMapDialogStore();
  const surfaces = useMemo(
    () =>
      Object.values(DQAnimationSpriteSurface).filter(
        (v): v is DQAnimationSpriteSurface => typeof v === "number",
      ),
    [],
  );
  const party = useMemo(
    () => (
      <TimerProvider interval={ANIMATION_SPRITE_FLIP_INTERVAL}>
        <Stack direction="row">
          {execPipe(
            arrayShuffle(surfaces),
            take(4),
            map((surface) => (
              <DQAnimationSpriteImage
                width={64}
                height={64}
                key={surface}
                surface={surface}
                direction={Direction.West}
              />
            )),
            arrayFrom,
          )}
        </Stack>
      </TimerProvider>
    ),
    [surfaces],
  );

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      height="100%"
      spacing={3}
    >
      {party}
      <Typography variant="h6" component="span">
        RPGENマップエディタ「ENRPG」にようこそ！
      </Typography>
      <Stack justifyContent="center" alignItems="center">
        <Typography>……まだここにはなにもないようです</Typography>
        <Typography>作成するか、マップを読み込んでみましょう！</Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Button
          onClick={() => createMapDialogStore.setOpen(true)}
          variant="outlined"
        >
          新規作成
        </Button>
        <Button
          variant="outlined"
          onClick={() => loadMapDialogStore.setOpen(true)}
        >
          マップを読み込む
        </Button>
      </Stack>
    </Stack>
  );
}
