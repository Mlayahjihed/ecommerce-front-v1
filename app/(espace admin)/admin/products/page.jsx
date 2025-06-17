"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Editortrush from "@/components/editortrush";
import { ClipLoader } from "react-spinners";
import { Plus } from "lucide-react";
export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedmarque, setSelectedmarque] = useState("");
  const [marques, setMarques] = useState([])
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marques`)
      .then(res => res.json())
      .then(data => setMarques(data.marques.rows))
      .catch(() => toast.error("Erreur lors du chargement des marques"))
  }, [])
  // Charger les catégories
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Erreur chargement des catégories", error));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/sousCategories?categorieId=${selectedCategory}`)
        .then((res) => res.json())
        .then((data) => {
          setSubCategories(data)
        })
        .catch((error) => console.error("Erreur chargement des sous-catégories", error));
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory]);

  // Charger les produits avec filtres
  useEffect(() => {
    const params = new URLSearchParams({ page, query });
    if (selectedmarque) params.append("marqueId", selectedmarque);
    if (selectedCategory) params.append("categorieId", selectedCategory);
    if (selectedSubCategory) params.append("sousCategorieId", selectedSubCategory);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produits?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.produits);
        console.log(data.produits)
        setTotalPages(data.totalPages);
        setLoading(false)
      })
      .catch((error) => console.error("Erreur chargement des produits", error));
  }, [page, query, selectedCategory, selectedSubCategory, selectedmarque]);

  if (loading) return <div className="min-h-screen bg-white p-6">
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#14b8a6" loading={loading} size={50} />
      </div>
    </div>

  </div>;
  return (
    <div className="p-4 mx-auto px-4">
       
      {/* Bouton ajouter produit */}
      <div className="flex justify-end mb-4">
        <Link href="/admin/products/addProduct" className="flex bg-teal-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-teal-600 transition">
          <Plus /> {"  Ajouter produit"}
        </Link>
      </div>


      <>
      
        {/* Filtres */}
        <div className="bg-white p-6 mb-4 ">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Rechercher"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full focus:border-teal-400 focus:bg-white focus:outline-none"
            />
            <select
              value={selectedmarque}
              onChange={(e) => { setSelectedmarque(e.target.value) }}
              className="w-full p-2 border rounded-lg focus:border-teal-400 focus:bg-white focus:outline-none"
            >
              <option value="">Sélectionner une marque</option>
              {marques.map(marque => (
                <option key={marque.id} value={marque.id}>
                  {marque.name}
                </option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory("");
              }}
              className="border rounded-lg px-4 py-2 w-full focus:border-teal-400 focus:bg-white focus:outline-none"
            >
              <option value="">catégories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full focus:border-teal-400 focus:bg-white focus:outline-none"
              disabled={!selectedCategory}
            >
              <option value="">sous-catégories</option>
              {subCategories.map((subCat) => (
                <option key={subCat.id} value={subCat.id}>
                  {subCat.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setQuery("");
                setSelectedCategory("");
                setSelectedSubCategory("");
              }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg w-full hover:bg-gray-200"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Tableau Produits */}
        <div className="bg-white shadow-lg rounded-md p-6 mb-6 border border-cyan-100 overflow-x-auto">
          {products.length === 0 ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <p className="text-center text-gray-600 text-lg">Aucun produit trouvé.</p>
            </div>
          ) : (
            <table className="w-full min-w-max border-collapse">
              <thead className="text-gray-600 border-t border-b border-gray-300 ">
                <tr>
                  <th className="p-3 text-left">Nom de Produit</th>
                  <th className="p-3 text-center">Marque</th>
                  <th className="p-3 text-center">Prix (DT)</th>
                  <th className="p-3 text-center">Promotion</th>
                  <th className="p-3 text-center">Catégorie</th>
                  <th className="p-3 text-center">Stock</th>
                  <th className="p-3 text-center">Disponibilité</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-300 hover:bg-gray-50 transition">
                    <td className="p-3 flex items-center space-x-3">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${product.Images?.[0]?.url}`}
                        alt={product.title}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-semibold truncate max-w-[150px]">{product.title}</p>
                      </div>
                    </td>
                    <td className="p-3 text-center">{product.marque.name}</td>
                    <td className="p-3 text-center ">
                      {product.newprice > 0 ? (
                        <span className="">{product.newprice}</span>
                      ) : (
                        <span>{product.price}</span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {product.newprice > 0 ? (
                        <span className="text-green-600 font-medium">Oui</span>
                      ) : (
                        <span className="text-gray-500">Non</span>
                      )}
                    </td>
                    <td className="p-3 text-center">{product.Categorie?.name}</td>
                    <td className="p-3 text-center">{product.stock}</td>
                    <td className="p-3 text-center">
                      {product.stock > 0 ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm">Disponible</span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm">Indisponible</span>
                      )}

                    </td>
                    <Editortrush id={product.id} products={products} setProducts={setProducts} />
                  </tr>
                ))}
              </tbody>
            </table>)}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2 flex-wrap">
            {page > 1 && (
              <button onClick={() => setPage(page - 1)} className="px-4 py-2 rounded-md bg-teal-500 text-white">
                ←
              </button>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`px-4 py-2 rounded-md ${page === pageNumber ? "bg-teal-500 text-white" : "bg-gray-300 text-gray-700"}`}
              >
                {pageNumber}
              </button>
            ))}

            {page < totalPages && (
              <button onClick={() => setPage(page + 1)} className="px-4 py-2 rounded-md bg-teal-500 text-white">
                →
              </button>
            )}
          </div>
        )}

      </>

    </div>
  );

}
