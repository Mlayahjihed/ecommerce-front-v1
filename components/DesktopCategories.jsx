"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useCallback, useEffect } from "react";

export default function DesktopCategories({ categories }) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [blockedUntil, setBlockedUntil] = useState(0);
  const navigationCount = useRef(0);
  const lastCategory = useRef(null);

  const navigateTo = useCallback((categoryName) => {
    const now = Date.now();
    
    // Vérifier si on est dans une période de blocage
    if (now < blockedUntil) {
      console.log(`Navigation bloquée jusqu'à ${new Date(blockedUntil).toLocaleTimeString()}`);
      return;
    }

    // Si c'est la même catégorie que la précédente, ignorer
    if (lastCategory.current === categoryName) {
      console.log('Navigation ignorée - même catégorie');
      return;
    }

    // Compter les navigations pour détecter les abus
    navigationCount.current++;
    
    // Si plus de 3 navigations en cours, bloquer pendant 5 secondes
    if (navigationCount.current > 3) {
      console.log('Trop de navigations détectées - blocage de 5 secondes');
      setBlockedUntil(now + 5000);
      navigationCount.current = 0;
      return;
    }

    console.log(`Navigation ${navigationCount.current} vers: ${categoryName}`);
    
    setIsNavigating(true);
    lastCategory.current = categoryName;
    
    // Naviguer
    router.push(`/products/all/${categoryName}`);
    
    // Réinitialiser après navigation
    setTimeout(() => {
      setIsNavigating(false);
      navigationCount.current = Math.max(0, navigationCount.current - 1);
    }, 1500);

  }, [router, blockedUntil]);

  // Réinitialiser le compteur périodiquement
  useEffect(() => {
    const interval = setInterval(() => {
      navigationCount.current = 0;
      setBlockedUntil(0);
    }, 10000); // Reset toutes les 10 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden sm:block bg-teal-500 text-white">
      <div className="container mx-auto px-4">
        <ul className="flex justify-center space-x-8 h-16">
          {categories.map((category, index) => {
            const isCurrentCategory = lastCategory.current === category.name;
            const isBlocked = Date.now() < blockedUntil;
            
            return (
              <li key={index} className="h-full flex items-center">
                <button
                  onClick={() => navigateTo(category.name)}
                  disabled={isNavigating || isBlocked}
                  className={`px-4 h-full transition flex items-center ${
                    isBlocked
                      ? 'opacity-30 cursor-not-allowed bg-red-600'
                      : isCurrentCategory
                        ? ' cursor-default'
                        : isNavigating
                          ? 'opacity-70 cursor-wait'
                          : 'hover:bg-teal-600'
                  }`}
                >
                  { category.name
                  }
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}