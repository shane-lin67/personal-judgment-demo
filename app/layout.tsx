import type { Metadata } from "next";

import "./globals.css";

import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "认知资产前台",
  description: "我在和系统聊天，它会把思考自动沉淀进认知资产网络。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
