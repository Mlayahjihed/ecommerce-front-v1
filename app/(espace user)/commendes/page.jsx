'use client';

import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';

export default function OrdersPage() {
 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const shippingCost = parseInt(process.env.NEXT_PUBLIC_SHIPPING_COST || '0');
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const params = new URLSearchParams({ page });
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/my-orders?${params}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
          setTotalPages(data.totalPages || 1);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [page]);

  const calculateOrderTotal = (order) => {
    if (!order.Produits) return 0;

    return order.Produits.reduce((total, product) => {
      const price = product.OrderProduct?.priceproduct || 0;
      const quantity = product.OrderProduct?.quantity || 0;
      return total + price * quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center items-center h-screen">
            <ClipLoader color="#14b8a6" size={50} />
          </div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="p-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">
          Mes commandes
        </h1>
        <p className="text-gray-500">Aucune commande trouvée.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">
        Mes commandes
      </h1>
      <div className="space-y-8">
        {orders.map(order => {
          const orderTotal = calculateOrderTotal(order);
          const grandTotal = orderTotal + shippingCost;

          return (
            <div key={order.id} className="border rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row justify-between mb-6">
                <div className="flex flex-col space-y-2">
                  <p className="font-semibold text-lg">Commande #{order.id}</p>
                  <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">{order.nom} {order.prenom}</p>
                  <p className="text-sm text-gray-600">{order.city}, {order.country}</p>
                  <p className="text-sm text-gray-600">{order.rue}, {order.codePostal}</p>
                  <p className="text-sm text-gray-600">Téléphone: {order.telephone}</p>
                </div>
                <div className="text-right mt-4 sm:mt-0">
                  <p className="font-bold text-xl">Total Commande</p>
                  <p className="text-xl font-semibold">{orderTotal.toFixed(2)} DT</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(order.Produits || []).map(product => {
                  const price = product.OrderProduct?.priceproduct || 0;
                  const quantity = product.OrderProduct?.quantity || 0;
                  const totalProductPrice = price * quantity;

                  return (
                    <div key={product.id} className="flex flex-col sm:flex-row space-x-4 border-b pb-4">
                      {product.Images && product.Images.length > 0 && (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${product.Images[0].url}`}
                          alt={product.title}
                          className="w-20 h-20 object-cover rounded mb-4 sm:mb-0"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{product.title}</p>
                        <p className="text-sm text-gray-500">Quantité : {quantity}</p>
                        <span className="text-sm text-gray-700">{price.toFixed(2)} DT</span>
                      </div>
                      <div className="text-right font-semibold mt-4 sm:mt-0">
                        {totalProductPrice.toFixed(2)} DT
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-6 text-xl font-bold">
                <div className="text-left">
                  <p className={`text-sm ${
                    order.status === 'en attente' ? 'text-gray-500' :
                    order.status === 'accepté' ? 'text-teal-500' :
                    'text-red-500'
                  }`}>
                    {order.status}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Frais de livraison : {shippingCost} DT</p>
                  <p>Total : {grandTotal.toFixed(2)} DT</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2 flex-wrap">
          {page > 1 && (
            <button 
              onClick={() => setPage(page - 1)} 
              className="px-4 py-2 rounded-md bg-teal-500 text-white"
            >
              ←
            </button>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`px-4 py-2 rounded-md ${
                page === pageNumber ? "bg-teal-500 text-white" : "bg-gray-300 text-gray-700"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          {page < totalPages && (
            <button 
              onClick={() => setPage(page + 1)} 
              className="px-4 py-2 rounded-md bg-teal-500 text-white"
            >
              →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
