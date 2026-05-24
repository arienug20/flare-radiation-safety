import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flare Radiation & Safety Radius",
  description: "Professional flare radiation, noise and safety radius calculation software for oil & gas industry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
