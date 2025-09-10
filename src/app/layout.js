import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chatbot-v1",
  description: "Made with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} bg-white text-black`}>
        <div className="flex flex-col h-screen">{children}</div>
      </body>
    </html>
  );
}
