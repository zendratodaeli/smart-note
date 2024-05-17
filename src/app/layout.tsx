import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FN - AI",
  description: "Finding Note with AI",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
          <body className={inter.className}>
            <ThemeProvider
              attribute="class" 
              defaultTheme="light" 
              disableTransitionOnChange
              enableSystem
            >
              {children}
            </ThemeProvider>
          </body>
      </html>
    </ClerkProvider>
  );
}