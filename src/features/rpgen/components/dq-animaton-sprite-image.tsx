import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { type ReactNode, useEffect, useState } from "react";
import type { DQAnimationSpriteSurface } from "@rpgja/rpgen-map";
import type { Direction } from "@rpgja/rpgen-map";
import { RPGEN_CHIP_SIZE, getDQAnimationSpritePosition } from "@rpgja/rpgen-map";
import { useTimer } from "../../../components/timer-provider";

export type DQAnimationSpriteImageProps = {
  surface: DQAnimationSpriteSurface;
  direction: Direction;
  width: number;
  height: number;
};

export default function DQAnimationSpriteImage({
  surface,
  direction,
  width,
  height,
}: DQAnimationSpriteImageProps): ReactNode {
  const timer = useTimer();
  const [position, setPosition] = useState<[number, number]>();

  useEffect(() => {
    const { x, y } = getDQAnimationSpritePosition(
      surface,
      direction,
      Number(timer % 2n),
    );

    setPosition([x, y]);
  }, [timer, direction, surface]);

  return (
    <Stack
      visibility={position === undefined ? "hidden" : "visible"}
      width={width}
      height={height}
      justifyContent="center"
      alignItems="center"
    >
      <Box
        component="img"
        src="https://rpgen.org/dq/img/dq/char.png"
        sx={{
          imageRendering: "pixelated",
          width: RPGEN_CHIP_SIZE,
          height: RPGEN_CHIP_SIZE,
          scale: `${width / RPGEN_CHIP_SIZE}`,
          objectFit: "none",
          objectPosition: `-${position?.[0] ?? 0}px -${position?.[1] ?? 0}px`,
        }}
      />
    </Stack>
  );
}
