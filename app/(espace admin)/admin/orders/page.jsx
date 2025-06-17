'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';
import { Search } from 'lucide-react'; // Icône de recherche

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const shippingCost = parseInt(process.env.NEXT_PUBLIC_SHIPPING_COST);

  useEffect(() => {
    async function fetchOrders() {
      const params = new URLSearchParams({ page, search });
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/all?${params}`, {
          credentials: 'include',
        });
        const data = await res.json();
        setOrders(data.orders || []);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
      }
    }

    fetchOrders();
  }, [page, search]);

  const handleViewOrder = (id) => {
    router.push(`/admin/orders/order/${id}`);
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8  text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">Liste des Commandes</h1>

      <div className="flex justify-center mb-6">
        <div className="relative w-full sm:w-[34rem]">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par ID, Nom ou Prénom..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>


      <div className="bg-white shadow-lg rounded-md p-6 mb-6 border border-cyan-100 overflow-x-auto">
        {orders.length === 0 ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <p className="text-center text-gray-600 text-lg">Aucune commande trouvée.</p>
          </div>
        ) : (
          <table className="w-full min-w-max border-collapse">
            <thead className="text-gray-600 border-t border-b border-gray-300">
              <tr>
                <th className="p-3 text-center">#ID</th>
                <th className="p-3 text-center">Nom</th>
                <th className="p-3 text-center">Prénom</th>
                <th className="p-3 text-center">Statut</th>
                <th className="p-3 text-center">Produits</th>
                <th className="p-3 text-center">Total (DT)</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-300 hover:bg-gray-50 transition">
                  <td className="p-3 text-center font-semibold">#{order.id}</td>
                  <td className="p-3 text-center">{order.nom}</td>
                  <td className="p-3 text-center">{order.prenom}</td>
                  <td className="p-3 text-center capitalize">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm 
      ${order.status === 'en attente' ? 'bg-orange-300 text-orange-800' : ''}
      ${order.status === 'accepté' ? 'bg-green-300 text-green-700' : ''}
      ${order.status === 'refusé' ? 'bg-red-300 text-white' : ''}
    `}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex items-center -space-x-3">
                      {order.Produits?.slice(0, 4).map((product, index) => (
                        <img
                          key={index}
                          src={`${process.env.NEXT_PUBLIC_API_URL}${product.Images?.[0]?.url}`}
                          alt={product.title}
                          className="w-10 h-10 rounded-full border-2 border-white object-cover"
                          title={product.title}
                        />
                      ))}

                      {order.Produits?.length > 4 && (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 text-sm font-semibold border-2 border-white"
                          title={`+${order.Produits.length - 4} autres produits`}
                        >
                          +{order.Produits.length - 4}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-3 text-center">{order.total + shippingCost} DT</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleViewOrder(order.id)}
                      className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded"
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}
