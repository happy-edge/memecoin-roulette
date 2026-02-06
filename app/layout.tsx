import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🎰 Memecoin Roulette",
  description: "Spin the wheel, ape into a random memecoin. Powered by Jupiter.",
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
