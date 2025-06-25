// app/(product-panier)/product/[id]/page.jsx

import BackButtonWrapper from '@/components/url';
import ProductImages from '@/components/ProductImages';
import Buttonpanier from '@/components/Buttonpanier';
import BrandLogo from '@/components/BrandLogo';
import FavoriteButton from '@/components/FavoriteButton';
import ProductDetailsLayout from '@/components/ProductDetailsLayout';


// Fonction pour récupérer un produit par son ID
async function getProduct(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produits/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error(`Erreur ${res.status}: ${res.statusText}`);
    throw new Error('Erreur lors du chargement du produit');
  }

  return res.json();
}

// Génération dynamique des métadonnées (titre de la page)
export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  return {
    title: product.title,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <div className="bg-white min-h-screen p-6 md:p-14">
      <BackButtonWrapper />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          {/* Section images produit */}
          <div className="w-full md:w-1/2 px-2 mb-8">
            <ProductImages images={product.Images.map(img => img.url)} />
          </div>

          {/* Section infos produit */}
          <div className="w-full md:w-1/2 px-4 flex flex-col gap-4">
            <h2 className="text-4xl font-bold text-gray-800">{product.title}</h2>

            <span className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-lg w-fit ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'
              }`}>
              {product.stock > 0 ? 'En stock' : 'Hors stock'}
            </span>

            <p className="text-gray-700 leading-relaxed">{product.description}</p>

            {/* Brand logo component */}
            <BrandLogo
              logoUrl={`${process.env.NEXT_PUBLIC_API_URL}/${product.marque.logo}`}
            />

            {/* Single line price display */}
            <div className="mb-2 flex items-center gap-3 flex-wrap">
              {product.newprice > 0 ? (
                <>
                  <span className="text-sm text-gray-500 line-through">{product.price}DT</span>
                  <span className="text-3xl font-bold text-red-600">{product.newprice}DT</span>
                  {product.price > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {Math.round((1 - product.newprice / product.price) * 100)}% de réduction
                    </span>
                  )}
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-gray-100 px-4 py-2 rounded-md text-sm text-gray-700 font-medium shadow-inner">
                Quantité disponible : {product.stock}
              </div>

              <FavoriteButton productId={id} />
            </div>

            <Buttonpanier id={id} stock={product.stock} />
          </div>
        </div>
      </div>
      {/* Section commentaires et produits similaires */}
        <ProductDetailsLayout productId={id} />
    </div>
  );
}