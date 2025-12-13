import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

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
        <body className="antialiased">
          {children}
          <Analytics />
        </body>
      </html>
    </>
  );
}
