import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import Providers from "@/app/providers";
import { cn } from "@/lib/utils";
import { themeScript } from "@/utils/theme-script";
import "@/styles/globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets : ["latin"],
  weight  : ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets : ["latin"],
});

export const metadata: Metadata = {
  title      : "AxisDev",
  description: "Personal developer dashboard for Google workspace",
};

const ThemeScript = () => (
  <script dangerouslySetInnerHTML={{ __html: themeScript }} />
);

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-theme="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>

      <body className={cn(poppins.variable, geistMono.variable, "min-h-full flex flex-col antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
