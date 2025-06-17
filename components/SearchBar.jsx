"use client";

import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recherche avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 0) {
        fetchResults();
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/produits/title/e?q=${encodeURIComponent(query)}`
      );



      const produits = await response.json();
      setResults(produits);
      setIsOpen(true);

    } catch (error) {
      console.error("Erreur recherche:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="w-full sm:w-[34rem] mt-4 sm:mt-0 relative z-10" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          className="w-full px-5 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 pr-12 text-lg"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length > 0 && setIsOpen(true)}
        />
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6 cursor-pointer" />

        {isLoading && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3">
            Recherche en cours...
          </div>
        )}

        {/* Menu des résultats */}
        {isOpen && !isLoading && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto z-20">
            {results.length > 0 ? (
              results.map((produit) => (
                <div
                  key={produit.id}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    window.location.href = `/product/${produit.id}`;
                  }}
                >
                  <div className="flex items-center">
                    {produit.Images?.length > 0 && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${produit.Images[0].url}`}
                        alt={produit.title}
                        className="w-10 h-10 object-cover rounded mr-3"
                      />
                    )}
                    <div>
                      <p className="font-medium">{produit.title}</p>
                      <p className="text-sm text-gray-600">
                        {produit.Categorie?.name} • {produit.SousCategorie?.name}
                      </p>
                      <p className="text-sm font-semibold">
                        {produit.newprice > 0 ? (
                          <>
                            <span className="text-gray-400 line-through mr-2">{produit.price} DT</span>
                            <span className="text-teal-600 mr-2">{produit.newprice} DT</span>
                            <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                              -{Math.round((1 - produit.newprice / produit.price) * 100)}%
                            </span>
                          </>
                        ) : (
                          <span className="text-teal-600">{produit.price} DT</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500">
                {query.trim() === ""
                  ? "Commencez à taper pour rechercher"
                  : `Aucun résultat pour "${query}"`}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}