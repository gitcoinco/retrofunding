import { MainLayout } from "@/layouts/MainLayout";
import { ThemeProvider, Web3Providers } from "@/providers";
import "@/styles/globals.css";
import { getMetadata } from "@/utils/getMetadata";

export const metadata = getMetadata({ title: "Retrofunding", description: "Powered by Gitcoin" });

const App = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <Web3Providers>
            <MainLayout>{children}</MainLayout>
          </Web3Providers>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default App;
