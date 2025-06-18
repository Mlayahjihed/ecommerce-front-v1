"use client";

import { useRouter } from "next/navigation";

export default function DesktopCategories({ categories }) {
  const router = useRouter();

  const navigateTo = (categoryName) => {
    router.push(`/products/all/${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="hidden sm:block bg-teal-500 text-white">
      <div className="container mx-auto px-4">
        <ul className="flex justify-center space-x-8 h-16">
          {categories.map((category, index) => (
            <li key={index} className="h-full flex items-center">
              <button
                onClick={() => navigateTo(category.name) } key={c.name}
                className="px-4 h-full hover:bg-teal-600 transition flex items-center"
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
