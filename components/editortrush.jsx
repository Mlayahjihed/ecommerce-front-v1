'use client'

import { Edit2, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';import { toast } from 'react-toastify';
;


function editortrush(props) {
    const router = useRouter();
    const { products, setProducts } = props;
  // Fonction de navigation vers la page d'édition
  const handleEdit = () => {
    router.push(`/admin/products/UpdateProduct/${props.id}`);
  };
  const handleDelete = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produits/delete/${props.id}`, {
        method: 'DELETE',
        credentials: "include",
      });
      if (response.ok) {
        setProducts(products.filter(product => product.id !== props.id));
         toast.success("Produit supprimer avec succeé",
                                  {position : "top-right"}
                                )
      } else {
        toast.error("Error serveur! ",
          {position : "top-right"}
        )
      }
    }
    return (
        <td className="p-3 space-x-2 text-center">

                  <button onClick={handleEdit} className=" items-center space-x-2 text-white bg-teal-500 px-4 py-2 rounded-md hover:bg-teal-600">
                    <Edit2 className="w-5 h-5" />
                  </button>

                  {/* Bouton Supprimer avec icône */}
                  <button   onClick={handleDelete} className="items-center space-x-2 text-white bg-red-400 px-4 py-2 rounded-md hover:bg-red-500">
                    <Trash className="w-5 h-5" />
                  </button>

                </td>
    );
}

export default editortrush;