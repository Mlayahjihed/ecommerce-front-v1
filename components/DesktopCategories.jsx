"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DesktopCategories({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentCategory, setCurrentCategory] = useState(null);

  // Synchroniser la catégorie courante
  useEffect(() => {
    const categoryParam = decodeURIComponent(window.location.pathname.split('/').pop());
    setCurrentCategory(categoryParam);
  }, []);

  const navigateTo = (categoryName) => {
    const lowerCaseName = categoryName.toLowerCase();
    if (currentCategory === lowerCaseName) return; // Empêche le rechargement si déjà sur la même catégorie

    // Réinitialise tous les filtres avec des paramètres explicites
    const newUrl = `/products/all/${encodeURIComponent(lowerCaseName)}?minPrice=0&maxPrice=999999&page=1`;
    router.push(newUrl);
  };

  return (
    <nav className="hidden sm:block bg-teal-500 text-white">
      <div className="container mx-auto px-4">
        <ul className="flex justify-center space-x-8 h-16">
          {categories.map((category) => (
            <li key={category.name} className="h-full flex items-center">
              <button
                onClick={() => navigateTo(category.name)}
                className={`px-4 h-full hover:bg-teal-600 transition flex items-center ${
                  currentCategory === category.name.toLowerCase() ? 'bg-teal-700' : ''
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
