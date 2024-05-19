"use client";

import { useState, type ReactNode } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function App(): ReactNode {
  const [greeting, setGreeting] = useState(false);

  return (
    <Box padding={1}>
      <Button variant="outlined" onClick={() => setGreeting((prev) => !prev)}>
        Hello
      </Button>
      {greeting && <Typography>Hello, inyume world! 114514</Typography>}
    </Box>
  );
}
