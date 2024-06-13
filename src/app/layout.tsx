import ThemeProvider from "@/components/theme-provider";
import { primaryFont } from "@/utils/font";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import type { PropsWithChildren, ReactNode } from "react";

export const viewport = {
  themeColor: "#4152e6",
};

export { generateDefaultMetadata as generateMetadata } from "@/features/brand/utils/metadata";

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
