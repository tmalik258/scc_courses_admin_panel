import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
// import NextTopLoader from "nextjs-toploader";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // adjust weights as needed
  variable: "--font-dm-sans", // Tailwind custom property
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // adjust weights as needed
  variable: "--font-manrope", // Tailwind custom property
});

export const metadata: Metadata = {
  title: "Smart Coding Admin Dashboard",
  description: "Admin dashboard for Smart Coding platform",
};

if (typeof process !== 'undefined') {
  // Increase max listeners for Firebase Functions environment
  process.setMaxListeners(20);
  
  // Handle uncaught exceptions to prevent memory leaks
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
}

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
