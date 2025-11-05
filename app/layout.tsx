import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
