"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Users,
  ShoppingCart,
  Package,
  UserRoundCheck,
} from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function Stats() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashbord/stats`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="min-h-screen bg-white p-6">
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#14b8a6" size={50} />
      </div>
    </div>

  </div>;

  const statsCards = [
    {
      title: "Utilisateurs ",
      value: data.nbUsers,
      icon: <Users className="h-8 w-8 text-gray-500" />, // Augmenté la taille de l'icône
      color: "bg-blue-50"
    },
    {
      title: "Utilisateurs ayant commandé",
      value: data.nbUtilisateursAyantCommande,
      icon: <UserRoundCheck className="h-8 w-8 text-gray-500" />, // Augmenté la taille de l'icône
      color: "bg-green-50"
    },
    {
      title: "Commandes totales",
      value: data.nbCommandes,
      icon: <Package className="h-8 w-8 text-gray-500" />, // Augmenté la taille de l'icône
      color: "bg-purple-50"
    },

  ];

  return (
    <div className="space-y-40 p-6"> {/* Augmenté l'espacement et le padding */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"> {/* Augmenté l'espace entre les cartes */}
        {statsCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow h-48 flex flex-col justify-between`}
          // Augmenté le padding, le border-radius et la hauteur fixe
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-500">{card.title}</h3> {/* Texte plus grand */}
              <div className="p-3 rounded-full bg-white shadow-sm"> {/* Padding augmenté */}
                {card.icon}
              </div>
            </div>
            <p className="text-4xl font-semibold text-gray-900"> {/* Texte beaucoup plus grand */}
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="w-full h-96 mt-12"> {/* Espacement augmenté */}
        <h2 className="text-xl text-center font-semibold mb-6 flex items-center justify-center"> {/* Marge augmentée */}
          <ShoppingCart className="h-6 w-6 mr-2" />
          Quantité commandée par produit
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.histogramme}>
            <XAxis
              dataKey="produit"
              tickFormatter={(value) => value.length > 8 ? value.slice(0, 8) + "..." : value}
              interval={0}
              tickLine={false} // Désactive la ligne de l'axe pour un meilleur rendu
            margin={{ bottom: 60 }} 
            />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="quantite"
              fill="#14b8a6"
              label={{ position: "top", fill: "#374151", fontSize: 12 }}
            />
          </BarChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}