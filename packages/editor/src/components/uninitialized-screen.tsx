import DQAnimationSpriteImage from "@/features/rpgen/components/dq-animaton-sprite-image";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import arrayShuffle from "array-shuffle";
import { arrayFrom, execPipe, map, take } from "iter-tools";
import { type ReactNode, useMemo } from "react";
import { DQAnimationSpriteSurface, Direction } from "rpgen-map";
import { useCreateMapDialogStore } from "../features/editor/components/create-map-dialog";
import { useLoadMapDialogStore } from "../features/editor/components/load-map-dialog";
import TimerProvider from "./timer-provider";

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
    ),
    [surfaces],
  );

  return (
    <TimerProvider interval={600}>
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
    </TimerProvider>
  );
}
