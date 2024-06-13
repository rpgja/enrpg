import { pixelFont } from "@/utils/font";
import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import type { ReactNode } from "react";

export { generateNotFoundMetadata as generateMetadata } from "@/features/brand/utils/metadata";

export default function NotFound(): ReactNode {
  return (
    <Stack
      padding={2}
      position="relative"
      height="100svh"
      className={pixelFont.className}
    >
      <Typography variant="h6" {...pixelFont.style} position="absolute">
        なぞのばしょ
      </Typography>
      <Stack
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Stack spacing={2}>
          <Typography variant="h5" component="h1" {...pixelFont.style}>
            ページが見つかりませんでした
          </Typography>
          <Box>
            <Typography {...pixelFont.style}>
              なぞのばしょに迷い込んでしまったようです……
            </Typography>
            <MuiLink component={NextLink} href="/" {...pixelFont.style}>
              ▶ホームにもどる
            </MuiLink>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
