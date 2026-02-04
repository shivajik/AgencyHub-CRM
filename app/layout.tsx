import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgencyFlow - Digital Marketing CRM",
  description: "Comprehensive CRM and client portal for digital marketing agencies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
