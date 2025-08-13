import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DemoProvider } from "@/src/demo/demo-provider";
import { DemoBar } from "@/app/components/DemoBar";
import { AuditDrawer } from "@/app/components/AuditDrawer";
import { RoleNavigation } from "@/app/components/RoleNavigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "iSponsor - Prototipo Demo",
  description: "Prototipo navegable de la plataforma iSponsor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        <DemoProvider>
          <DemoBar />
          <RoleNavigation />
          <main>
            {children}
          </main>
          <AuditDrawer />
        </DemoProvider>
      </body>
    </html>
  );
}
