import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  icons: {
    icon: "/mtv.png",
  },
  title: "Medal Bypass - Download Medal Clips Without Watermark",
  description: "Bypass the premium requirement and download your favorite Medal.tv clips directly to MP4 without watermarks. Fast, free, and easy to use.",
  keywords: ["medal.tv", "medal bypass", "medal clip downloader", "download medal clips", "no watermark medal", "medal downloader"],
  openGraph: {
    title: "Medal Bypass - Download Medal Clips Without Watermark",
    description: "Bypass the premium requirement and download your favorite Medal.tv clips directly to MP4 without watermarks.",
    url: "https://medal-bypass-nine.vercel.app/",
    siteName: "Medal Bypass",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medal Bypass",
    description: "Download Medal clips without watermarks for free.",
  },
  verification: {
    google: "jLBHF_r5-stLvqmugNDjv0-DeZtZjioBRsDjJWr2Kzw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-9D4DPF1S6G"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9D4DPF1S6G');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen antialiased bg-[#09090b]`}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
          {children}
        </div>
      </body>
    </html>
  );
}
