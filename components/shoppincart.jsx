'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import useCartStore from '@/stores/cartStore';

function Shoppincart({ p }) {
  const addToCart = useCartStore(state => state.addToCart);

  const handleAddToCart = () => {
    const success = addToCart(p);
    if (success) {
      toast.success('Produit ajouté au panier', { position: 'top-right' });
    }
  };

  return (
    <div onClick={handleAddToCart} className="cursor-pointer">
      <ShoppingCart className="w-6 h-6" />
    </div>
  );
}

export default Shoppincart;
