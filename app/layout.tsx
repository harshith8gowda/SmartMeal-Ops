import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "SmartMeal Ops",
    template: "%s | SmartMeal Ops"
  },
  description: "Your AI food operations copilot for cooking, ordering, and dining out."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
