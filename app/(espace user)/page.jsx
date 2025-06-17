"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Shoppincart from '@/components/shoppincart'; // ajuste ce chemin selon ton projet
import { ClipLoader } from 'react-spinners';
import Banner from '@/components/Banner';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produits/by/categorie`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen bg-white p-6">
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#14b8a6" loading={loading} size={50} />
      </div>
    </div>

  </div>;
  if (!loading && categories.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 text-xl italic">Vide</p>
      </div>
    );
  }
  return (<div>

    <Banner />


    <div className="container mx-auto ">

      {categories.map((category) => (
        <div key={category.id} className="mb-12 mt-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end w-full mb-6">
            <div className='mt-4 px-6'>
              <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
              <div className="w-16 h-0.5 bg-teal-400 mb-4"></div>
            </div>

            <Link
              href={`products/all/${category.name}`}
              className="text-teal-600 hover:text-teal-800 font-medium hover:underline mt-2 md:mt-0 ml-auto transition-colors"
            >
              Voir tous &rarr;
            </Link>
          </div>


          {/* Conteneur produits avec système de défilement */}
          <div className="relative">
            {/* Liste produits - version mobile (défilement horizontal) */}
            <div className="md:hidden flex overflow-x-auto pb-4 space-x-4 scrollbar-hide px-6">
              {category.Produits.map((p) => (
                <div
                  key={p.id}
                  className="flex-none w-[70vw] bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transition hover:shadow-lg"
                >
                  <div className="relative">
                    <Link href={`/product/${p.id}`}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${p.Images?.[0]?.url}` || "/placeholder.png"}
                        alt={p.title}
                        className="w-full aspect-square object-cover"
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
                    <h3 className="text-lg font-semibold line-clamp-2">{p.title}</h3>
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
                        <Shoppincart p={p} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Liste produits - version desktop (grille fixe) */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
              {category.Produits.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transition hover:shadow-lg"
                >
                  <div className="relative">
                    <Link href={`/product/${p.id}`}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${p.Images?.[0]?.url}` || "/placeholder.png"}
                        alt={p.title}
                        className="w-full aspect-square object-cover"
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
                    <h3 className="text-lg font-semibold line-clamp-1">{p.title}</h3>
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
                        <Shoppincart p={p} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}
