import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  weight: ["700"],
  subsets: ["latin", "cyrillic"],
});

const t = await getTranslations();

export const metadata: Metadata = {
  title: t("title"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${nunitoSans.className} antialiased selection:bg-black/10`}>
         <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
