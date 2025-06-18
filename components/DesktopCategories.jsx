"use client";

import { useRouter } from "next/navigation";

export default function DesktopCategories({ categories }) {
  const router = useRouter();

  const navigateTo = (categoryName) => {
    // Réinitialiser tous les filtres en naviguant vers la nouvelle catégorie
    router.push(`/products/all/${encodeURIComponent(categoryName.toLowerCase())}?minPrice=0&maxPrice=999999&page=1`);
  };

  return (
    <nav className="hidden sm:block bg-teal-500 text-white">
      <div className="container mx-auto px-4">
        <ul className="flex justify-center space-x-8 h-16">
          {categories.map((category) => (
            <li key={category.name} className="h-full flex items-center">
              <button
                onClick={() => navigateTo(category.name)}
                className="px-4 h-full hover:bg-teal-600 transition flex items-center"
                aria-label={`Voir les ${category.name}`}
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
