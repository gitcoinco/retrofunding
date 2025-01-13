import "@rainbow-me/rainbowkit/styles.css";
import "gitcoin-ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { MainLayout } from "@/layouts/MainLayout";
import { Providers } from "@/providers";

export const metadata: Metadata = {
  title: "Retrofunding",
  description: "Powered by Gitcoin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
