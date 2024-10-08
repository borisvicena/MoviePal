import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const rubik = localFont({
  src: "./fonts/Rubik.ttf",
  variable: "--font-rubik",
  weight: "400 700",
});

export const metadata: Metadata = {
  title: "MoviePal.fun | Find your next movie to watch!",
  description: "MoviePal.fun helps you find your next movie to watch!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dim" className="dark">
      <body className={`${rubik.variable} antialiased`}>{children}</body>
    </html>
  );
}
