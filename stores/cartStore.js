'use client';

import { create } from 'zustand';

const CART_EXPIRATION_TIME = 60 * 60 * 1000;

const loadCartFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('cart');
    if (!stored) return [];

    const { cart, timestamp } = JSON.parse(stored);
    const now = Date.now();
    if (now - timestamp > CART_EXPIRATION_TIME) {
      localStorage.removeItem('cart');
      return [];
    }

    return cart || [];
  }
  return [];
};

const saveCartToLocalStorage = (cart) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify({ cart, timestamp: Date.now() }));
  }
};

const useCartStore = create((set, get) => ({
  cart: loadCartFromLocalStorage(),

  addToCart: (product) => {
    const cart = get().cart;
    const existingIndex = cart.findIndex(item => item.id === product.id);
    let updatedCart = [...cart];

    if (existingIndex !== -1) {
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart.push({
        id: product.id,
        title: product.title,
        stock: product.stock,
        quantity: 1,
        image: product.Images?.[0]?.url || '',
        price: product.price,
        newprice : product.newprice
      });
    }

    saveCartToLocalStorage(updatedCart);
    set({ cart: updatedCart });
  },

  removeFromCart: (id) => {
    const cart = get().cart.filter(item => item.id !== id);
    saveCartToLocalStorage(cart);
    set({ cart });
  },

  getTotalCount: () => get().cart.length,

  updateQuantity: (id, quantity) => {
    const cart = get().cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    saveCartToLocalStorage(cart);
    set({ cart });
  },
  clearCart: () => {
    localStorage.removeItem('cart'); // Supprime le panier du localStorage
    set({ cart: [] }); // Vide le panier dans le state
  },
  // ✅ Vérifie le stock en temps réel avant la commande
  checkStockBeforeOrder: async () => {
    const cart = get().cart;
    const failed = [];

    for (const item of cart) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produits/${item.id}`);
        const data = await res.json();

        if ( data.stock < item.quantity) {
          failed.push(item.id);
        }
      } catch (error) {
        failed.push(item.id);
      }
    }

    if (failed.length > 0) {
      const updatedCart = cart.filter(item => !failed.includes(item.id));
      saveCartToLocalStorage(updatedCart);
      set({ cart: updatedCart });
    }

    return failed; // Liste des IDs supprimés
  },
}));

export default useCartStore;
