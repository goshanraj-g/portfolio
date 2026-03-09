import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Instrument_Serif, Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata = {
  title: "Portfolio - Goshanraj Govindaraj",
  description: "Goshanraj Govindaraj's Developer Portfolio",
  icons: {
    icon: "images/favicon.png",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body
          className={`${inter.variable} ${instrumentSerif.variable} antialiased`}
        >
          {children}
          <Analytics />
        </body>
      </html>
    </>
  );
}
