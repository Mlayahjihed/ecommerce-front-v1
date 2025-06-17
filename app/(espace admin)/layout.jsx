
import Sidebar from "@/components/SideBar";
import "../globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from 'react-toastify';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "admin",
};

export default function RootLayout({ children }) {
  return (<html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      {/* Conteneur principal avec flex pour la sidebar + contenu */}
      <div className="flex h-screen">
        {/* Sidebar (fixe sur la gauche) */}
        <Sidebar />
        
        {/* Contenu principal qui s'affiche à droite */}
        <main className="flex-grow p-4 ml-80">
          {children}
        </main>
        <ToastContainer />
      </div>
    </body>
  </html>
  );
}
