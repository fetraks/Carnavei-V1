import type { Metadata } from "next";
import { Cormorant, Hanken_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CustomCursor } from "@/components/store/CustomCursor";

const isProd = process.env.NODE_ENV === "production";

const hanken = Hanken_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Carnavei — Acessórios Artesanais",
  description:
    "Acessórios artesanais femininos feitos à mão. Bolsas, chokers, broches e muito mais.",
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      translate="no"
      className={`${hanken.variable} ${cormorant.variable} antialiased notranslate`}
    >
      {isProd && (
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NSDV489X');
        `}</Script>
      )}
      {/* min-h-dvh (não h-full) — html/body com altura natural permitem o
          scroll de documento que faz o Safari/Chrome esconderem a barra no mobile */}
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        {isProd && (
          <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NSDV489X" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />
        )}
        <CustomCursor />
        {children}
        {isProd && (
          <Script id="hotjar" strategy="afterInteractive">{`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:6732885,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}</Script>
        )}
      </body>
    </html>
  );
}
