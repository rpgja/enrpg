import { PropsWithChildren, ReactNode } from "react";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export default function ThemeProvider({ children }: PropsWithChildren): ReactNode {
  return (
    <CssVarsProvider defaultMode="dark">
      <CssBaseline />
      {children}
    </CssVarsProvider>
  );
}
