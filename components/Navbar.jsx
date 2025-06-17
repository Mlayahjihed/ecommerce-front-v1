"use client";

import { useEffect, useState } from "react";
import Logo from "../images/logo.png";
import Image from "next/image";
import DesktopCategories from "./DesktopCategories";
import MobileCategories from "./MobileCategories";
import UserMenu from "./UserMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import { Menu, X } from "lucide-react";
import Link from "next/link";



const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const MobileMenuButton = ({ isOpen, onClick }) => (
    <button className=" text-gray-700 sm:hidden mr-4" onClick={onClick}>
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formattedCategories = data.map(cat => ({
            name: cat.name,
          }));
          setCategories(formattedCategories);
        }
        
        
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    };
  
    fetchCategories();
  }, []);
  return (
    <div className="sticky top-0 z-50 bg-white">
      <nav className="p-4 flex flex-col sm:flex-row items-center sm:justify-between relative">
        {/* Logo & Mobile actions */}
        <div className="w-full  sm:w-auto flex items-center justify-between sm:justify-start">
          <MobileMenuButton
          
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />

          <Link href="/" className="flex items-center">
            <Image src={Logo} alt="Logo" className="h-14 w-auto" priority />
          </Link>

          <div className="flex items-center space-x-6 sm:hidden relative z-20">
            <CartIcon count={3} />
            <UserMenu />
          </div>
        </div>

        {/* Barre de recherche */}
        <SearchBar />

        {/* Actions desktop */}
        <div className="hidden sm:flex items-center space-x-14">
          <CartIcon count={3} />
          <UserMenu />
        </div>
      </nav>

      {/* Catégories */}
      <DesktopCategories categories={categories } />
      <MobileCategories
        categories={categories}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
};

export default Navbar;
