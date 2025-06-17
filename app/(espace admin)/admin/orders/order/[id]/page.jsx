'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const shippingCost = parseInt(process.env.NEXT_PUBLIC_SHIPPING_COST || '0');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/order/${id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        setOrder(data.order || null);
      } catch (error) {
        console.error('Erreur lors du chargement de la commande:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  const calculateTotal = () => {
    if (!order?.Produits) return 0;

    return order.Produits.reduce((total, product) => {
      const price = product.OrderProduct?.priceproduct || 0;
      const quantity = product.OrderProduct?.quantity || 0;
      return total + price * quantity;
    }, 0);
  };

  const total = calculateTotal();
  const grandTotal = total + shippingCost;

  const handleAccept = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/order/${id}/accept`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();

      if (data.success) {
        const updatedProduits = order.Produits.map(prod => ({
          ...prod,
          stock: prod.stock - prod.OrderProduct.quantity,
        }));

        setOrder(prev => ({
          ...prev,
          status: 'accepté',
          Produits: updatedProduits,
        }));

        toast.success('Commande acceptée avec succès !');
      } else {
        toast.error('Erreur lors de l\'acceptation');
      }
    } catch (error) {
      console.error('Erreur acceptation commande:', error);
      toast.error('Erreur serveur');
    }
  };

  const handleRefuse = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/order/${id}/refuse`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();

      if (data.success) {
        let updatedProduits = order.Produits;
        if (order.status === 'accepté') {
          updatedProduits = order.Produits.map(prod => ({
            ...prod,
            stock: prod.stock + prod.OrderProduct.quantity,
          }));
        }

        setOrder(prev => ({
          ...prev,
          status: 'refusé',
          Produits: updatedProduits,
        }));

        toast.success('Commande refusée avec succès !');
      } else {
        toast.error('Erreur lors du refus');
      }
    } catch (error) {
      console.error('Erreur refus commande:', error);
      toast.error('Erreur serveur');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <ClipLoader color="#14b8a6" size={50} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Commande introuvable.
      </div>
    );
  }

  const hasStockProblem = order.Produits?.some(product => product.stock < product.OrderProduct?.quantity);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-teal-500 hover:text-teal-600 font-semibold"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-md p-8 max-w-7xl mx-auto space-y-12">
        {/* Infos Utilisateur */}
        <div>
          <h1 className="text-2xl font-bold mb-4">Détails Client</h1>
          <div className="flex items-center space-x-6">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/${order.User?.photo_url}`}
              alt={order.User?.user_name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-lg">{order.User?.user_name}</p>
              <p className="text-gray-500">{order.User?.email}</p>
              <p className="text-gray-400 text-sm">ID : {order.User?.id}</p>
            </div>
          </div>
        </div>

        {/* Infos Commande */}
        <div>
          <h1 className="text-2xl font-bold mb-4">Détails de la Commande</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600">Nom :</p>
              <p className="font-semibold">{order.nom}</p>
            </div>
            <div>
              <p className="text-gray-600">Prénom :</p>
              <p className="font-semibold">{order.prenom}</p>
            </div>
            <div>
              <p className="text-gray-600">Téléphone :</p>
              <p className="font-semibold">{order.telephone}</p>
            </div>
            <div>
              <p className="text-gray-600">Adresse :</p>
              <p className="font-semibold">{order.rue}, {order.city}, {order.country} {order.codePostal}</p>
            </div>
            <div>
              <p className="text-gray-600">Statut :</p>
              <p className={`font-bold capitalize ${
                order.status === 'en attente' ? 'text-orange-500' :
                order.status === 'accepté' ? 'text-green-600' :
                order.status === 'refusé' ? 'text-red-500' : 'text-gray-600'
              }`}>
                {order.status}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total + Frais de livraison :</p>
              <p className="font-bold">{grandTotal.toFixed(2)} DT</p>
            </div>
          </div>
        </div>

        {/* Produits Commandés */}
        <div>
          <h1 className="text-2xl font-bold mb-4">Produits Commandés</h1>
          <div className="space-y-4">
            {order.Produits?.map((product) => {
              const quantity = product.OrderProduct?.quantity || 0;
              const price = product.OrderProduct?.priceproduct || 0;
              const totalPrice = price * quantity;
              const stockInsuffisant = product.stock < quantity;

              return (
                <div
                  key={product.id}
                  className={`flex items-center p-4 rounded-md shadow-sm ${
                    stockInsuffisant ? 'bg-red-100' : 'bg-gray-100'
                  }`}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${product.Images?.[0]?.url}`}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{product.title}</p>
                    <span className="text-sm text-gray-700">
                      {price.toFixed(2)} DT
                    </span>
                    <p className="text-sm text-gray-600">
                      Quantité commandée : {quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Stock disponible : {product.stock}
                    </p>
                  </div>
                  <div className="font-bold">{totalPrice.toFixed(2)} DT</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center space-x-6 mt-8">
          {(order.status === 'en attente' || order.status === 'refusé') && (
            <button
              disabled={hasStockProblem}
              onClick={handleAccept}
              className={`py-2 px-6 rounded font-semibold ${
                hasStockProblem
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-teal-500 hover:bg-teal-600 text-white'
              }`}
            >
              Accepter
            </button>
          )}
          {(order.status === 'en attente' || order.status === 'accepté') && (
            <button
              onClick={handleRefuse}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded"
            >
              Refuser
            </button>
          )}
          {order.status === 'accepté' && (
            <button
              onClick={() => router.push(`/facture/${id}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded"
            >
              Voir Facture
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
