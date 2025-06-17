'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { LogOut, ShoppingCart, LayoutDashboard, Package, Users, Users2, Briefcase, MessageSquareMore } from 'lucide-react';
import Image from "next/image";
import Logo from "../images/logo.png";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      Cookies.remove("token");
      router.push("/");
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  };

  return (
    <aside className="w-80 h-screen bg-teal-400 text-white flex flex-col justify-between fixed">
      {/* Logo Section */}
      <div>
        <div className="flex items-center justify-center h-24 py-4 bg-teal-400">
          <Image src={Logo} alt="Logo" className="h-14 w-auto" priority />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col">
          <Link
            href="/admin"
            className="flex items-center gap-4 px-6 py-3 transition duration-200 hover:bg-teal-500 focus:bg-teal-500 focus:outline-none"
          >
            <LayoutDashboard size={20} />
            <span className="text-sm">Dashboard</span>
          </Link>
  <Link
            href="/admin/marque"
            className="flex items-center gap-4 px-6 py-3 transition duration-200 hover:bg-teal-500 focus:bg-teal-500 focus:outline-none"
          >
            <Briefcase size={20} />
            <span className="text-sm">Marques</span>
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center gap-4 px-6 py-3 transition duration-200 hover:bg-teal-500 focus:bg-teal-500 focus:outline-none"
          >
            <Package size={20} />
            <span className="text-sm">Produits</span>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-4 px-6 py-3 transition duration-200 hover:bg-teal-500 focus:bg-teal-500 focus:outline-none"
          >
            <ShoppingCart size={20} />
            <span className="text-sm">Commandes</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-4 px-6 py-3 transition duration-200 hover:bg-teal-500 focus:bg-teal-500 focus:outline-none"
          >
            <Users2 size={20} />
            <span className="text-sm">Utilisateurs</span>
          </Link>
          <Link
            href="/admin/comments"
            className="flex items-center gap-4 px-6 py-3 transition duration-200 hover:bg-teal-500 focus:bg-teal-500 focus:outline-none"
          >
            <MessageSquareMore size={20} />
            <span className="text-sm">Comments</span>
          </Link>
        </nav>
      </div>

      {/* Logout Section */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center h-16 bg-teal-400 cursor-pointer hover:bg-teal-500 focus:bg-teal-500 focus:outline-none"
        aria-label="Déconnexion"
      >
        <LogOut size={24} />
      </button>
    </aside>
  );
}
