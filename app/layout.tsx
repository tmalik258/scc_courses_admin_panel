import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
// import NextTopLoader from "nextjs-toploader";

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // adjust weights as needed
  variable: '--font-dm-sans', // Tailwind custom property
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // adjust weights as needed
  variable: '--font-manrope', // Tailwind custom property
});

export const metadata: Metadata = {
  title: "Smart Coding Admin Dashboard",
  description: "Admin dashboard for Smart Coding platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${manrope.variable} font-dm-sans antialiased`}
      >
        {/* <NextTopLoader /> */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
