import "./globals.css";

export const metadata = {
  title: "Portfolio - Goshanraj Govindaraj",
  description: "Goshanraj Govindaraj Portfolio",
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
        <body>{children}</body>
      </html>
    </>
  );
}
