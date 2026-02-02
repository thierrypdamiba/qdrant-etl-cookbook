import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qdrant ETL Cookbook",
  description:
    "Your one-stop resource for loading any data type into Qdrant. ETL recipes, agent patterns, and configuration guides.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
