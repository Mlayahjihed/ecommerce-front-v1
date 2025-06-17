"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include", // ✅ très important pour envoyer les cookies
        });
 
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Utilisateur non connecté", err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      Cookies.remove("token"); // supprime le cookie
      setUser(null);
      router.push("/"); 
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  };

  const router = useRouter();
  if (!user) {
    return (
      <button
        onClick={() => router.push("/auth")}
        className="bg-teal-500 text-white px-4 py-2 rounded-l-full rounded-r-full hover:bg-teal-600"
      >
        Login
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}${'/' + user.photo_url}`}
        alt={user.photo_url}
        className="w-12 h-12 sm:w-10 sm:h-10 rounded-full cursor-pointer border-2 border-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="absolute right-0 sm:mt-2 top-full rounded-md w-48 bg-white border text-center shadow-lg z-20">
          <ul className="py-2 text-gray-800">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                router.push("/profil");
                setIsOpen(false);
              }}
            >
              Mon Profil
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                router.push("/commendes");
                setIsOpen(false);
              }}
            >
              Mes Commandes
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                router.push("/favoris");
                setIsOpen(false);
              }}
            >
              mes favoris
            </li>
            <li
              className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              Déconnexion
            </li>

          </ul>
        </div>
      )}
    </div>
  );
}