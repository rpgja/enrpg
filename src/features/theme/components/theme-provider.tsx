import type { PropsWithChildren, ReactNode } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material";

export default function ThemeProvider({ children }: PropsWithChildren): ReactNode {
  return (
    <CssVarsProvider defaultMode="light">
      <CssBaseline />
      {children}
    </CssVarsProvider>
  );
}
