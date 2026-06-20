"use client";

import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ReactNode } from "react";

import AppContextProvider from "@/components/app-context";
import AppShell from "@/components/app-shell";
import theme from "@/theme";

export default function AppProvider(props: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContextProvider>
          <AppShell>{props.children}</AppShell>
        </AppContextProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
