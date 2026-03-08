import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Providers } from "./providers";
import ScrollToTop from "./components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Rosa - Pâtisserie & Glace Artisanale",
  description: "Découvrez La Rosa, votre pâtisserie artisanale en Tunisie. Gâteaux d'anniversaire, pâtisseries françaises, glaces artisanales et macarons de qualité supérieure. Livraison à domicile.",
  keywords: "pâtisserie, glace, gâteaux, macarons, Tunisie, Korba, Dar Chaâbene, artisanal, pâtisserie française, gâteau d'anniversaire",
  icons: {
    icon: '/img/logo-la-rosa.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Viewport for mobile responsiveness */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#d946a6" />
        {/* Apple mobile web app */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Bootstrap CSS */}
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
        />
        {/* Material Design Icons */}
        <link 
          href="https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css" 
          rel="stylesheet" 
        />
        {/* Font Awesome */}
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
          rel="stylesheet" 
        />
        {/* Custom Color Override - Replace Yellow/Orange with Pink */}
        <link href="/css/color-override.css" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <ScrollToTop />
          {children}
        </Providers>
        {/* Bootstrap JS */}
        <Script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
