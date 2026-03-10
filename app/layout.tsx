import "./globals.css";
import localFont from "next/font/local";

const inter = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  fallback: ["system-ui", "Arial", "sans-serif"],
  display: "swap",
});

export const metadata = {
  title: "Meme Chat",
  description: "bla bla blaaaa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
