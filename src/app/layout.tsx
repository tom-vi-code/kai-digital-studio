import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kai Digital Studio",
  description:
    "Customized websites by a software developer/architect. Visually stunning, user-friendly, and tailored to your unique goals.",
  icons: { icon: "/images/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
