"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const SimilarProducts = ({ productId }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produits/similaires/${productId}`);
        if (!res.ok) throw new Error('Échec du chargement des produits similaires');
        const data = await res.json();
        setSimilarProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [productId]);

  if (loading) return  <div className="text-center py-8">
          <span className="inline-block h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></span>
        </div>;
  if (error) return <div className="text-red-500 py-4">Erreur: {error}</div>;
  if (similarProducts.length === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {similarProducts.map((product) => (
          <Link 
            key={product.id} 
            href={`/product/${product.id}`}
            className="group flex gap-4 items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${product.Images?.[0]?.url || '/placeholder-product.jpg'}`}
                alt={product.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium line-clamp-1">{product.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                {product.newprice > 0 ? (
                  <>
                    <span className="text-gray-400 text-sm line-through">{product.price} DT</span>
                    <span className="text-red-600 font-bold">{product.newprice} DT</span>
                  </>
                ) : (
                  <span className="text-gray-500 font-bold">{product.price} DT</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
