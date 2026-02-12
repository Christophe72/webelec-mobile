import "./globals.css";
import BottomNav from "@/components/mobile/BottomNav";
import NetworkStatusIndicator from "@/components/NetworkStatusIndicator";
import { ThemeProvider } from "./providers";

export const metadata = {
  title: "WebElec",
  description: "Gestion PME électricité",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen flex flex-col transition-colors">
        <ThemeProvider>
          <BottomNav />
          <main className="flex-1 pt-16">{children}</main>
          <NetworkStatusIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
