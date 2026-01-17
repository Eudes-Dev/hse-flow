import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HSE-Flow - Calcul TF/TG",
  description: "Saisie et calcul en temps réel du Taux de Fréquence (TF) et du Taux de Gravité (TG)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <meta name="theme-color" content="#F2E41C" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="HSE Flow" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="bg-ui-gray text-deep-black">{children}</body>
    </html>
  );
}
