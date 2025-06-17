"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MobileCategories({ categories, isOpen, onClose }) {
  const router = useRouter();

  const navigateTo = (categoryName) => {
    router.push(`/products/all/${categoryName.toLowerCase()}`);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="sm:hidden fixed top-0 right-0 h-full w-64 bg-white text-gray-800 shadow-lg z-40">
          <div className="p-4 bg-teal-600 text-white flex justify-between items-center">
            <h2 className="text-xl font-semibold">Catégories</h2>
            <button onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          <ul className="py-2 overflow-y-auto h-full">
            {categories.map((category, index) => (
              <li key={index} className="border-b border-gray-200">
                <button
                  onClick={() => navigateTo(category.name)}
                  className="block w-full px-4 py-3 text-left hover:bg-gray-100"
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
