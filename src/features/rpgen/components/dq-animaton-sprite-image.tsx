import type { DQAnimationSpriteSurface } from "@/features/rpgen/types/sprite";
import type { Direction } from "@/features/rpgen/types/types";
import { getDQAnimationSpritePosition } from "@/features/rpgen/utils/sprite";
import { type ReactNode, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
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
	}, [timer,direction,surface]);

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
				src="https://rpgen.site/dq/img/dq/char.png"
				sx={{
					imageRendering: "pixelated",
					width: 16,
					height: 16,
					scale: `${width / 16}`,
					objectFit: "none",
					objectPosition: `-${position?.[0] ?? 0}px -${position?.[1] ?? 0}px`,
				}}
			/>
		</Stack>
	);
}
