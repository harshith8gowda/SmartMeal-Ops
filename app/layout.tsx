import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: {
    default: "MealMap",
    template: "%s | MealMap"
  },
  description: "Decide dinner. Build the cart. Swiggy handles the rest."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <Script
          id="reduced-motion"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                  document.documentElement.dataset.reducedMotion = 'true';
                }
              })();
            `,
          }}
        />
        <ClerkProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ClerkProvider>
      </body>
    </html>
  );
}
