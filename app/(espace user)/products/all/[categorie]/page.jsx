"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import Link from "next/link";
import Shoppincart2 from "@/components/shoppincart";
import { ClipLoader } from "react-spinners";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
export default function CardsPage() {
  const [marques, setMarques] = useState([]);
  const [selectedMarques, setSelectedMarques] = useState([]);
  const { categorie } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [produits, setProduits] = useState([]);
  const [titres, setTitres] = useState([]);
  const [sousCategories, setSousCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(999999);
  const [prixMin, setPrixMin] = useState(0);
  const [prixMax, setPrixMax] = useState(999999);
  const [selectedTitles, setSelectedTitles] = useState([]);
  const [selectedSousCategorie, setSelectedSousCategorie] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  // Initialiser les états avec les paramètres d'URL
  useEffect(() => {
    const urlMarques = searchParams.getAll('marqueId');
    const urlMinPrice = searchParams.get('minPrice');
    const urlMaxPrice = searchParams.get('maxPrice');
    const urlTitles = searchParams.getAll('title');
    const urlSousCategorie = searchParams.get('sousCategorieId');
    const urlPage = searchParams.get('page');
    if (urlMarques.length > 0) setSelectedMarques(urlMarques);
    if (urlMinPrice) setMinPrice(parseFloat(urlMinPrice));
    if (urlMaxPrice) setMaxPrice(parseFloat(urlMaxPrice));
    if (urlPage) setPage(parseInt(urlPage));
    if (urlTitles.length > 0) setSelectedTitles(urlTitles);
    if (urlSousCategorie) setSelectedSousCategorie(urlSousCategorie);
  }, []);
  useEffect(() => {
    setMinPrice(prixMin);
    setMaxPrice(prixMax);
  }, [prixMin, prixMax]);


  useEffect(() => {
    const fetchData = async () => {

      const queryParams = new URLSearchParams({
        page: page.toString(),
        minPrice: minPrice.toString(),
        maxPrice: maxPrice.toString(),
        ...(selectedSousCategorie && { sousCategorieId: selectedSousCategorie.toString() }),
      });

      selectedTitles.forEach((t) => queryParams.append("title", t));
      selectedMarques.forEach((m) => queryParams.append("marqueId", m));
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produits/by-category/${categorie}?${queryParams.toString()}`);
      const data = await res.json();
      setMarques(data.marques || []);
      setProduits(data.produits || []);
      setTitres(data.titres || []);
      setSousCategories(data.sousCategories || []);
      setPrixMin(data.prixMin || 0);
      setPrixMax(data.prixMax || 999999);
      setTotalPages(data.totalPages || 1);
      updateURL();
      setLoading(false);
    };

    if (categorie) {
      fetchData();
    }
  }, [categorie, minPrice, maxPrice, selectedTitles, selectedMarques, selectedSousCategorie, page]);
  const toggleMarque = (id) => {
    setSelectedMarques(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };
  const toggleTitle = (title) => {
    setSelectedTitles((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleMinChange = (e) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val <= maxPrice) {
      setMinPrice(val);
    }
  };

  const handleMaxChange = (e) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val >= minPrice) {
      setMaxPrice(val);
    }
  };



  const handleSousCategorieChange = (id) => {
    setSelectedSousCategorie(id);
    setSelectedTitles([]);

  };

  // Construire le lien produit correctement formaté
  const buildProductLink = (productId) => {
    const params = new URLSearchParams();
    params.set('minPrice', minPrice);
    params.set('maxPrice', maxPrice);
    params.set('page', page);
    selectedMarques.forEach(m => params.append('marqueId', m));
    selectedTitles.forEach(t => params.append('title', t));
    if (selectedSousCategorie) params.set('sousCategorieId', selectedSousCategorie);

    return {
      pathname: `/product/${productId}`,
      query: {
        from: encodeURIComponent(`/products/all/${categorie}?${params.toString()}`),
        ...Object.fromEntries(params)
      }
    };
  };

  // Mettre à jour l'URL actuelle
  const updateURL = () => {
    const params = new URLSearchParams();
    params.set("minPrice", minPrice.toString());
    params.set("maxPrice", maxPrice.toString());
    params.set("page", page.toString());
    selectedTitles.forEach(t => params.append('title', t));
    selectedMarques.forEach(m => params.append('marqueId', m));
    if (selectedSousCategorie) params.set('sousCategorieId', selectedSousCategorie);

    router.replace(`/products/all/${categorie}?${params.toString()}`, { scroll: false });
  };
  if (loading) {
    return <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#14b8a6" loading={loading} size={50} />
        </div>
      </div>

    </div>;
  }
  return (
    <div className="flex flex-col sm:flex-row min-h-screen relative">
      {/* Sidebar Desktop */}
      <aside className="top-0 left-0 h-screen w-72 border bg-white hidden sm:flex flex-col p-4 space-y-6 z-20 sticky">
        <h2 className="leading-tight mt-12  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600 ">Filtres</h2>

        {/* Sous-catégories */}
        <div className="border rounded-lg border-teal-400 p-2">
          <h3 className="font-medium mb-1">Sous-catégories</h3>
          <div className="max-h-40 overflow-y-auto pr-2">
            {sousCategories.map((sc) => (
              <label key={sc.id} className="flex items-center cursor-pointer text-gray-700">
                <input
                  type="radio"
                  name="sousCategorie"
                  checked={selectedSousCategorie === sc.id}
                  onChange={() => handleSousCategorieChange(sc.id)}
                  className="peer hidden"
                />
                <span className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-teal-400">
                  <span className="w-2.5 h-2.5 bg-teal-400 rounded-full peer-checked:block hidden"></span>
                </span>
                <span className="ml-2">{sc.name}</span>

              </label>
            ))}
            <label className="flex items-center cursor-pointer text-gray-700">
              <input
                type="radio"
                name="sousCategorie"
                checked={selectedSousCategorie === null}
                onChange={() => handleSousCategorieChange(null)}
                className="peer hidden"
              />
              <span className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-teal-400">
                <span className="w-2.5 h-2.5 bg-teal-400 rounded-full peer-checked:block hidden"></span>
              </span>
              <span className="ml-2">Toutes</span>

            </label>
          </div>
        </div>
        <div className="border rounded-lg border-teal-400 p-2">
          <h3 className="font-medium mb-1">Marques</h3>
          <div className="max-h-40 overflow-y-auto pr-2">
            {marques.map((marque) => (
              <label key={marque.id} className="flex items-center text-sm text-gray-700 overflow-hidden">
                <input
                  type="checkbox"
                  checked={selectedMarques.includes(marque.id.toString())}
                  onChange={() => toggleMarque(marque.id.toString())}
                  className="accent-teal-500 mr-2 flex-shrink-0"
                />
                <span className="line-clamp-1">{marque.name}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Titres */}
        <div className="border rounded-lg border-teal-400 p-2">
          <h3 className="font-medium mb-1">Titres</h3>
          <div className="max-h-40 overflow-y-auto pr-2">
            {titres.map((title, i) => (
              <label key={i} className="flex items-center text-sm text-gray-700 overflow-hidden">
                <input
                  type="checkbox"
                  checked={selectedTitles.includes(title)}
                  onChange={() => toggleTitle(title)}
                  className="accent-teal-500 mr-2 flex-shrink-0"
                />
                <span className="line-clamp-1 ">  {/* Ensures single-line truncation */}
                  {title}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border rounded-lg border-teal-400 p-2">
          <h3 className="font-medium mb-2">Prix</h3>
          <Slider
            range
            min={prixMin}
            max={prixMax}
            defaultValue={[minPrice, maxPrice]}
            value={[minPrice, maxPrice]}
            onChange={(value) => {
  if (Array.isArray(value)) {
    const [min, max] = value;
    setMinPrice(min);
    setMaxPrice(max);
  }
}}
onChangeComplete={(value) => {
  if (Array.isArray(value)) {
    const [min, max] = value;
    setMinPrice(min);
    setMaxPrice(max);
  }
}}
            trackStyle={[{ backgroundColor: "#14b8a6" }]} // teal-500
            handleStyle={[
              { borderColor: "#14b8a6", backgroundColor: "#14b8a6" },
              { borderColor: "#14b8a6", backgroundColor: "#14b8a6" },
            ]}
          />
          <div className="flex justify-between text-sm text-gray-700 mt-2">
            <span>Min: {minPrice} €</span>
            <span>Max: {maxPrice} €</span>
          </div>
        </div>

      </aside>

      {/* Mobile Filter Button */}
      <div className="sm:hidden flex justify-end p-4">
        <button
          onClick={() => setShowMobileFilter(true)}
          className="text-teal-500 hover:text-teal-600"
        >
          <Filter className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Filter Sidebar */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 flex">
          <div className="bg-white w-72 p-4 space-y-6 shadow-md">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold mt-14  text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">Filtres</h2>
              <button onClick={() => setShowMobileFilter(false)}>
                <X className="text-teal-500" />
              </button>
            </div>


            {/* Sous-catégories */}
            <div className="border rounded-lg border-teal-400 p-2">
              <h3 className="font-medium mb-1">Sous-catégories</h3>
              <div className="max-h-40 overflow-y-auto pr-2">
                {sousCategories.map((sc) => (
                  <label key={sc.id} className="flex items-center cursor-pointer text-gray-700">
                    <input
                      type="radio"
                      name="sousCategorie"
                      checked={selectedSousCategorie === sc.id}
                      onChange={() => handleSousCategorieChange(sc.id)}
                      className="peer hidden"
                    />
                    <span className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-teal-400">
                      <span className="w-2.5 h-2.5 bg-teal-400 rounded-full peer-checked:block hidden"></span>
                    </span>
                    <span className="ml-2">{sc.name}</span>

                  </label>
                ))}
                <label className="flex items-center cursor-pointer text-gray-700">
                  <input
                    type="radio"
                    name="sousCategorie"
                    checked={selectedSousCategorie === null}
                    onChange={() => handleSousCategorieChange(null)}
                    className="peer hidden"
                  />
                  <span className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-teal-400">
                    <span className="w-2.5 h-2.5 bg-teal-400 rounded-full peer-checked:block hidden"></span>
                  </span>
                  <span className="ml-2">Toutes</span>

                </label>
              </div>
            </div>
            <div className="border rounded-lg border-teal-400 p-2">
              <h3 className="font-medium mb-1">Marques</h3>
              <div className="max-h-40 overflow-y-auto pr-2">
                {marques.map((marque) => (
                  <label key={marque.id} className="flex items-center text-sm text-gray-700 overflow-hidden">
                    <input
                      type="checkbox"
                      checked={selectedMarques.includes(marque.id.toString())}
                      onChange={() => toggleMarque(marque.id.toString())}
                      className="accent-teal-500 mr-2 flex-shrink-0"
                    />
                    <span className="line-clamp-1">{marque.name}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Titres */}
            <div className="border rounded-lg border-teal-400 p-2">
              <h3 className="font-medium mb-1">Titres</h3>
              <div className="max-h-40 overflow-y-auto pr-2">
                {titres.map((title, i) => (
                  <label key={i} className="flex items-center text-sm text-gray-700 overflow-hidden">
                    <input
                      type="checkbox"
                      checked={selectedTitles.includes(title)}
                      onChange={() => toggleTitle(title)}
                      className="accent-teal-500 mr-2 flex-shrink-0"
                    />
                    <span className="line-clamp-1 ">  {/* Ensures single-line truncation */}
                      {title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border rounded-lg border-teal-400 p-2">
              <h3 className="font-medium mb-2">Prix</h3>
              <Slider
                range
                min={prixMin}
                max={prixMax}
                defaultValue={[minPrice, maxPrice]}
                value={[minPrice, maxPrice]}
                onChange={([min, max]) => {
                  setMinPrice(min);
                  setMaxPrice(max);
                }}
                trackStyle={[{ backgroundColor: "#14b8a6" }]} // teal-500
                handleStyle={[
                  { borderColor: "#14b8a6", backgroundColor: "#14b8a6" },
                  { borderColor: "#14b8a6", backgroundColor: "#14b8a6" },
                ]}
              />
              <div className="flex justify-between text-sm text-gray-700 mt-2">
                <span>Min: {minPrice} €</span>
                <span>Max: {maxPrice} €</span>
              </div>
            </div>
          </div>
          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={() => setShowMobileFilter(false)}
          ></div>
        </div>
      )}

      {/* Affichage des Produits */}
      <main className="flex-1 p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {produits.map((p) => (
            <div
              key={p.id}

              className="bg-white  rounded-lg shadow-md overflow-hidden flex flex-col h-full transition hover:shadow-lg"
            ><div className="relative">
                <Link href={buildProductLink(p.id)}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${p.Images?.[0]?.url}` || "/placeholder.png"}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute bottom-2 right-2 px-2 py-1 text-xs rounded font-semibold shadow-md ${p.stock > 0 ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}
                  >
                    {p.stock > 0 ? "En stock" : "Hors stock"}
                  </div>
                </Link>
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <h3 className="text-lg font-semibold line-clamp-1 ">{p.title}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">  {/* Modifié ici */}
                    {p.newprice > 0 ? (
                      <>
                        <span className="text-gray-400 text-sm line-through">{p.price} DT</span>
                        <span className="text-red-600 font-bold">{p.newprice} DT</span>
                      </>
                    ) : (
                      <span className="text-gray-500 font-bold">{p.price} DT</span>
                    )}
                  </div>
                  <span className="text-teal-500">
                    <Shoppincart2 p={p} />
                  </span>
                </div>
              </div>
            </div>
          ))}
          {produits.length === 0 && (
            <p className="text-gray-600 col-span-full">Aucun produit trouvé.</p>
          )}
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
      </main>
    </div>
  );
}
