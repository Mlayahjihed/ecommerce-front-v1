'use client'
import { useState, useEffect } from 'react';
import InputField from '@/components/InputField';
import Logo from "../../../images/logo.png";
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useCartStore from '@/stores/cartStore';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export default function CommandePage() {
  const [loading, setLoading] = useState(true);
  const cart = useCartStore(state => state.cart);
  const router = useRouter();
  
 
  // Initialize error state with empty strings
  const [errorState, setErrorState] = useState({
    nom: '',
    prenom: '',
    city: '',
    country: '',
    rue: '',
    codePostal: '',
    telephone: ''
  });

  // Initialize all fields with empty strings or 0 for numbers
  const [userInfo, setUserInfo] = useState({
    nom: '',
    prenom: '',
    societe: '',
    city: '',
    country: '',
    rue: '',
    codePostal: '',
    telephone: '',
    total: 0,
    subtotal: 0
  });

  const shippingCost = parseInt(process.env.NEXT_PUBLIC_SHIPPING_COST); 
const totaal2 =userInfo.total+shippingCost
useEffect(() => {
  const subtotal = cart.reduce((sum, product) => {
    const itemPrice = product.newprice > 0 ? product.newprice : product.price;
    return sum + itemPrice * product.quantity;
  }, 0);

  const total = subtotal + shippingCost;

  setUserInfo(prev => ({
    ...prev,
    subtotal,
    total
  }));

  setLoading(false);
}, [cart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    try {
      // Reset errors
      setErrorState({
        nom: '',
        prenom: '',
        city: '',
        country: '',
        rue: '',
        codePostal: '',
        telephone: ''
      });
      
      setLoading(true);
      
      const failed = await useCartStore.getState().checkStockBeforeOrder();
      if (failed.length > 0) {
        toast.warning("Un ou plusieurs produits sont en rupture de stock et ont été supprimés du panier.");
        router.push('/');
        return;
      }
      const orderData = {
        customer: userInfo,
        products: cart
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/add`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        setLoading(false);
        
        setErrorState(result|| {});
       
      } else {
        toast.success("Commande effectuée avec succès !");
        useCartStore.getState().clearCart();
        setUserInfo({
          nom: '',
          prenom: '',
          societe: '',
          city: '',
          country: '',
          rue: '',
          codePostal: '',
          telephone: '',
          total: 0,
          subtotal: 0
        })
      }
    } catch (error) {
      setLoading(false);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    }
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto p-10">
        <ArrowLeft 
          onClick={() => router.back()} 
          className="flex items-center text-teal-500 hover:text-teal-600 mb-6 transition-colors w-5 h-5 mr-1" 
        />

        <div className="flex justify-center mb-10">
          <Image
            src={Logo}
            alt="Company Logo"
            width={200}
            height={100}
            className="object-contain"
            priority
          />
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Personal Information */}
            <div className="lg:w-1/2 bg-white p-6 sm:p-8 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-6 text-gray-700 text-center">
                Informations Personnelles
              </h2>

              <div className="space-y-5 max-w-md mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <InputField
                      label="Nom*"
                      type="text"
                      name="nom"
                      value={userInfo.nom || ''}
                      onChange={handleInputChange}
                      required
                    />
                    {errorState.nom && (
                      <div className="text-red-500 text-sm mt-1">{errorState.nom}</div>
                    )}
                  </div>

                  <div>
                    <InputField
                      label="Prénom*"
                      type="text"
                      name="prenom"
                      value={userInfo.prenom || ''}
                      onChange={handleInputChange}
                      required
                    />
                    {errorState.prenom && (
                      <div className="text-red-500 text-sm mt-1">{errorState.prenom}</div>
                    )}
                  </div>
                </div>

                <div>
                  <InputField
                    label="Nom de société (optionnel)"
                    type="text"
                    name="societe"
                    value={userInfo.societe || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <InputField
                      label="Ville*"
                      type="text"
                      name="city"
                      value={userInfo.city || ''}
                      onChange={handleInputChange}
                      required
                    />
                    {errorState.city && (
                      <div className="text-red-500 text-sm mt-1">{errorState.city}</div>
                    )}
                  </div>

                  <div>
                    <InputField
                      label="Pays*"
                      type="text"
                      name="country"
                      value={userInfo.country || ''}
                      onChange={handleInputChange}
                      required
                    />
                    {errorState.country && (
                      <div className="text-red-500 text-sm mt-1">{errorState.country}</div>
                    )}
                  </div>
                </div>

                <div>
                  <InputField
                    label="Adresse*"
                    type="text"
                    name="rue"
                    value={userInfo.rue || ''}
                    onChange={handleInputChange}
                    required
                  />
                  {errorState.rue && (
                    <div className="text-red-500 text-sm mt-1">{errorState.rue}</div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <InputField
                      label="Code Postal*"
                      type="text"
                      name="codePostal"
                      value={userInfo.codePostal || ''}
                      onChange={handleInputChange}
                      required
                    />
                    {errorState.codePostal && (
                      <div className="text-red-500 text-sm mt-1">{errorState.codePostal}</div>
                    )}
                  </div>

                  <div>
                    <InputField
                      label="Téléphone*"
                      type="tel"
                      name="telephone"
                      value={userInfo.telephone || ''}
                      onChange={handleInputChange}
                      required
                    />
                    {errorState.telephone && (
                      <div className="text-red-500 text-sm mt-1">{errorState.telephone}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

           {/* Right Column - Order Summary */}
<div className="lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-6 text-gray-700 text-center">
    Récapitulatif de Commande
  </h2>

  <div className="max-w-md mx-auto">
    <div className="border-b border-gray-200 pb-4 mb-4">
      <div className="grid grid-cols-3 font-medium text-gray-700 pb-2">
        <span className="col-span-2">Produit</span>
        <span className="text-right">Sous-total</span>
      </div>

      {cart.map((item, index) => {
        const itemPrice = item.newprice > 0 ? item.newprice : item.price;
        const totalItemPrice = itemPrice * item.quantity;
        
        return (
          <div key={index} className="grid grid-cols-3 py-3 border-b border-gray-100 items-center">
            <div className="col-span-2">
              <span className="font-medium">{item.title}</span>
              {item.newprice > 0 && (
                <span className="text-gray-400 text-xs line-through block">
                  {item.price.toFixed(2)} Dt
                </span>
              )}
              <span className="text-gray-500 text-sm block">Quantité: {item.quantity}</span>
            </div>
            <div className="text-right">
              {item.newprice > 0 ? (
                <span className="text-red-600">{totalItemPrice.toFixed(2)} Dt</span>
              ) : (
                <span>{totalItemPrice.toFixed(2)} Dt</span>
              )}
            </div>
          </div>
        );
      })}
    </div>

    <div className="space-y-3 mb-4">
      <div className="flex justify-between">
        <span className="text-gray-600">Sous-total</span>
        <span className="font-medium">
          {cart.reduce((sum, item) => {
            const itemPrice = item.newprice > 0 ? item.newprice : item.price;
            return sum + (itemPrice * item.quantity);
          }, 0).toFixed(2)} Dt
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Frais de livraison</span>
        <span className="font-medium">{shippingCost.toFixed(2)} Dt</span>
      </div>
    </div>

    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-4 mt-4">
      <span>Total TTC</span>
      <span className="text-teal-500">
        {(
          cart.reduce((sum, item) => {
            const itemPrice = item.newprice > 0 ? item.newprice : item.price;
            return sum + (itemPrice * item.quantity);
          }, 0) + shippingCost
        ).toFixed(2)} Dt
      </span>
    </div>

    <button
      type="submit"
      className="w-full bg-teal-500 text-white py-3 px-4 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 mt-8 transition duration-200 disabled:opacity-50"
      disabled={loading || cart.length === 0}
    >
      {loading ? 'Traitement...' : 'Confirmer la commande'}
    </button>
  </div>
</div>
          </div>
        </form>
      </div>
    </div>
  );
}