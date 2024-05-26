import { MouseButton, isMouseDown } from "@/utils/mouse";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { type PropsWithChildren, type ReactNode, useState } from "react";

export type PopupWindowProps = PropsWithChildren<{
  title: string;
  width: number;
  height: number;
  onClose: () => void;
}>;

export default function PopupWindow({
  width,
  height,
  title,
  children,
  onClose,
}: PopupWindowProps): ReactNode {
  const [minimzed, setMinimized] = useState(false);
  const [target, setTarget] = useState<HTMLDivElement | null>(null);

  return (
    <Paper
      ref={setTarget}
      sx={{
        width,
        height: minimzed ? undefined : height,
        position: "fixed",
        top: `calc(50svh - ${height / 2}px)`,
        left: `calc(50svw - ${width / 2}px)`,
      }}
    >
      <Stack height="100%">
        <Stack
          padding={1}
          width="100%"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            cursor: "grab",
            ":active": {
              cursor: "grabbing",
            },
          }}
          onPointerDown={(event) => {
            if (isMouseDown(event, MouseButton.Primary)) {
              event.currentTarget.setPointerCapture(event.pointerId);
            }
          }}
          onPointerMove={(event) => {
            if (target && isMouseDown(event, MouseButton.Primary)) {
              target.style.left = `${target.offsetLeft + event.movementX}px`;
              target.style.top = `${target.offsetTop + event.movementY}px`;
            }
          }}
        >
          <Typography color="text.primary" sx={{ userSelect: "none" }}>
            {title}
          </Typography>
          <Stack spacing={1} direction="row" alignItems="center">
            <Tooltip title={minimzed ? "戻す" : "最小化する"}>
              <IconButton
                size="small"
                disableTouchRipple
                onClick={() => setMinimized((prev) => !prev)}
              >
                <MinimizeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="閉じる">
              <IconButton
                onClick={() => onClose()}
                disableTouchRipple
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
        <Divider />
        <Box
          padding={1}
          display={minimzed ? "none" : undefined}
          overflow="auto"
          flex={1}
        >
          {children}
        </Box>
      </Stack>
    </Paper>
  );
}
