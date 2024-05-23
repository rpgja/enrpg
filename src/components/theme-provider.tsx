"use client";

import type { PropsWithChildren, ReactNode } from "react";
import {
	Experimental_CssVarsProvider as CssVarsProvider,
	experimental_extendTheme as extendTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { primaryFont } from "@/utils/font";

export default function ThemeProvider({
	children,
}: PropsWithChildren): ReactNode {
	const theme = extendTheme({
		typography: {
			fontFamily: [
				primaryFont.style.fontFamily,
				"Helvetica",
				"Arial",
				"sans-serif",
			].join(","),
		},
	});

	return (
		<CssVarsProvider defaultMode="dark" theme={theme}>
			<CssBaseline />
			{children}
		</CssVarsProvider>
	);
}
