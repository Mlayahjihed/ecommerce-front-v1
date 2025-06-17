'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import useCartStore from '@/stores/cartStore';

function Buttonpanier({ p }) {
  const addToCart = useCartStore(state => state.addToCart);

  const handleClick = () => {
    const success = addToCart(p);
    if (success) {
      toast.success('Produit ajouté au panier', { position: 'top-right' });
    } 
  };

  return (
    <button
      onClick={handleClick}
      className="mt-4 w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg flex items-center justify-center gap-2 transition duration-300"
    >
      <ShoppingCart className="w-5 h-5" />
      Ajouter au panier
    </button>
  );
}

export default Buttonpanier;
