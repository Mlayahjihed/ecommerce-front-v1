'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, X, Trash, Plus, Minus } from 'lucide-react';
import useCartStore from '@/stores/cartStore';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function CartIcon() {
  const cart = useCartStore(state => state.cart);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);

  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setCount(cart.length);
    }
  }, [cart, isClient]);

  const handleOrder = async () => {
    const failed = await useCartStore.getState().checkStockBeforeOrder();

    if (failed.length > 0) {
      toast.warning("Un ou plusieurs produits sont en rupture de stock et ont été supprimés du panier.");
      return;
    }

    router.push('/commander');
  };

  // Calcul du total en prenant en compte newprice si disponible
  const totalPrice = cart.reduce((sum, item) => {
    const itemPrice = item.newprice > 0 ? item.newprice : item.price;
    return sum + item.quantity * itemPrice;
  }, 0);

  const shipping = parseInt(process.env.NEXT_PUBLIC_SHIPPING_COST);
  const grandTotal = totalPrice + shipping;

  return (
    <>
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="relative"
          aria-label="Voir le panier"
        >
          <ShoppingCart className="text-gray-700 w-6 h-6 sm:w-7 sm:h-7" />
          {isClient && count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Slide-over */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="relative ml-auto w-full max-w-md bg-white shadow-xl flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center px-4 py-4 border-b">
              <h2 className="text-lg font-medium">Panier</h2>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 px-4 py-2 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">Votre panier est vide.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cart.map((item, index) => {
                    const displayPrice = item.newprice > 0 ? item.newprice : item.price;
                    const originalPrice = item.newprice > 0 ? item.price : null;

                    return (
                      <li key={index} className="flex py-4 gap-3">
                        <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border">
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}${item.image}`}
                            alt={item.title}
                            className="object-cover w-full h-full"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between min-w-0"> {/* Added min-w-0 */}
                          <div className="min-w-0"> {/* Added min-w-0 */}
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3 className="truncate pr-2"> {/* Added truncate and padding */}
                                {item.title}
                              </h3>
                              <div className="flex flex-col items-end flex-shrink-0"> {/* Added flex-shrink-0 */}
                                {originalPrice && (
                                  <span className="text-xs text-gray-400 line-through">
                                    {originalPrice} DT
                                  </span>
                                )}
                                <span className={originalPrice ? "text-red-600" : ""}>
                                  {displayPrice} DT
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <button
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                  disabled={item.quantity <= 1}
                                  className="p-1 border rounded"
                                >
                                  <Minus size={16} />
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, Math.min(item.quantity + 1, item.stock))}
                                  disabled={item.quantity >= item.stock}
                                  className="p-1 border rounded"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>

                              <button onClick={() => removeFromCart(item.id)}>
                                <Trash className="text-red-500 hover:text-red-600 w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="border-t px-4 py-4">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total</p>
                <p>{totalPrice} DT</p>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <p>Livraison</p>
                <p>{shipping} DT</p>
              </div>
              <div className="flex justify-between text-lg font-bold mt-2">
                <p>Total TTC</p>
                <p>{grandTotal} DT</p>
              </div>
              <button
                onClick={handleOrder}
                className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md text-base"
              >
                Commander
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}