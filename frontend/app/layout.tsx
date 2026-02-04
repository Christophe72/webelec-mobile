import "./globals.css";

import { AuthProvider } from "../lib/auth/AuthProvider";
import { ThemeProvider } from "../components/theme-provider";
import GlobalNav from "../components/global-nav";
import { ClientThemeToggle } from "../components/client-theme-toggle";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <GlobalNav />
            {children}
            <ClientThemeToggle />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}