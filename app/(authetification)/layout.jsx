import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Connection",
};

export default function RootLayout({ children }) {
  return (<html>
    <body  className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
    <main>
          {children}
          </main>
          <ToastContainer />
    </body>
  </html>
          
  );
}
