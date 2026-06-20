import { Metadata } from "next";

import AppProvider from "@/components/app-provider";
import { LayoutProps } from "@/types";

import "./globals.css";

export const metadata: Metadata = {
  title: "Anywhere Fitness",
};

export default function Layout(props: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <AppProvider>{props.children}</AppProvider>
      </body>
    </html>
  );
}
