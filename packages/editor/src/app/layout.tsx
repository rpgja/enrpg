import type { ReactNode, PropsWithChildren } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import ThemeProvider from "@/components/theme-provider";
import { primaryFont } from "@/utils/font";

export default function Layout({ children }: PropsWithChildren): ReactNode {
  return (
    <html lang="ja">
      <head />
      <body className={primaryFont.className}>
        <AppRouterCacheProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
