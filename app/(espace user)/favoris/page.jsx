// app/favoris/page.jsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart} from 'lucide-react';
import Shoppincart2 from "@/components/shoppincart";

import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

export default function FavorisPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites/fav`, {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        } else if (res.status === 401) {
          toast.error('Veuillez vous connecter pour voir vos favoris');
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur lors du chargement des favoris');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (productId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/favorites/${productId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (res.ok) {
        setFavorites(favorites.filter(item => item.productId !== productId));
        toast.success('Produit retiré des favoris');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
     <div className="min-h-screen bg-white p-6">
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#14b8a6" loading={loading} size={50} />
      </div>
    </div>

  </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className=" min-h-screen bg-white p-6">
        <div className="flex items-center mb-8 p-4">
          
          <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">Mes Favoris</h1>
        </div>
        
        <div className="flex justify-center items-center min-h-[60vh]">
  <div className="bg-white  p-8 text-center">
    <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
    <h2 className="text-xl font-medium mb-2">Votre liste de favoris est vide</h2>
    <p className="text-gray-500 mb-6">
      Ajoutez des produits à vos favoris pour les retrouver facilement plus tard
    </p>
  </div>
</div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex items-center mb-8 p-4">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">Mes Favoris ({favorites.length})</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {favorites.map((favorite) => (
            //link isi 
          <div key={favorite.id} className="bg-white  rounded-lg shadow-md overflow-hidden flex flex-col h-full transition hover:shadow-lg">
           
            <Link href={`/product/${favorite.product.id}`} className="block">
              <div className="relative aspect-square">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${favorite.product.Images?.[0]?.url}` || '/placeholder-product.jpg'}
                  alt={favorite.product.title}
                  className="w-full h-full object-cover"
                /><div
                    className={`absolute bottom-2 right-2 px-2 py-1 text-xs rounded font-semibold shadow-md ${favorite.product.stock > 0 ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}
                  >
                    {favorite.product.stock > 0 ? "En stock" : "Hors stock"}
                  </div>
              </div>
            </Link>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 line-clamp-2">
                    {favorite.product.title}
                  </h3>
                </div>
                <button
                  onClick={() => removeFavorite(favorite.product.id)}
                  className="text-teal-500 hover:text-teal-600 ml-2"
                  aria-label="Retirer des favoris"
                >
                  <Heart className="h-5 w-5 fill-current" />
                </button>
              </div>

            

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">  {/* Modifié ici */}
                    {favorite.product.newprice > 0 ? (
                      <>
                        <span className="text-gray-400 text-sm line-through">{favorite.product.price} DT</span>
                        <span className="text-red-600 font-bold">{favorite.product.newprice} DT</span>
                      </>
                    ) : (
                      <span className="text-gray-500 font-bold">{favorite.product.price} DT</span>
                    )} 

                </div>
<span className="text-teal-500">
                    <Shoppincart2 p={favorite.product} />
                  </span>
                
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}