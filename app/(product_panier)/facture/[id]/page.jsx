'use client';
import Logo from "@/images/logo.png";
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import { ArrowLeft } from "lucide-react";
import { ClipLoader } from "react-spinners";

export default function FacturePage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const factureRef = useRef(null);
  const shippingCost = parseInt(process.env.NEXT_PUBLIC_SHIPPING_COST || '0');

  useEffect(() => {
    async function fetchOrder() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/order/${id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      setOrder(data.order);
    }
    fetchOrder();
  }, [id]);

  const handleDownloadPDF = async () => {
    const element = factureRef.current;

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
    });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`facture-${id}.pdf`);
  };

  if (!order) {
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

  // ✅ Use priceproduct from OrderProduct for real unit prices
  const totalProduits = order.Produits.reduce((sum, prod) => {
    const unitPrice = prod.OrderProduct?.priceproduct || 0;
    return sum + unitPrice * prod.OrderProduct.quantity;
  }, 0);

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow" ref={factureRef}>
        <button
          onClick={handleGoBack}
          className="flex py-3 px-8 items-center text-teal-500 hover:text-teal-600 font-semibold absolute top-4 left-4"
        >
          <ArrowLeft className="w-10 h-5 mr-2" />
        </button>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <Image
            src={Logo}
            alt="Logo"
            width={150}
            height={50}
            className="w-48 h-auto object-contain"
          />
          <div className="text-right text-sm text-gray-700 space-y-1">
            <p><strong>Ma Société SARL</strong></p>
            <p>123 Rue de Commerce</p>
            <p>75000 Paris, France</p>
            <p>contact@masociete.com</p>
            <p>+33 1 23 45 67 89</p>
          </div>
        </div>

        {/* Infos Commande */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Détails de la Commande</h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div><span className="font-semibold">Commande ID :</span> {order.id}</div>
            <div><span className="font-semibold">Date :</span> {new Date(order.createdAt).toLocaleDateString()}</div>
            <div><span className="font-semibold">Nom :</span> {order.nom} </div>
            <div><span className="font-semibold">Prénom :</span> {order.prenom}</div>
            <div><span className="font-semibold">Adresse :</span> {order.rue}, {order.city}, {order.codePostal}, {order.country}</div>
            <div><span className="font-semibold">Téléphone :</span> {order.telephone}</div>
          </div>
        </div>

        {/* Produits */}
        <div className="overflow-x-auto mb-8">
          <h2 className="text-xl font-bold mb-2">Produits</h2>
          <table className="w-full text-left border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4 border">Produit</th>
                <th className="p-4 border">Prix unitaire</th>
                <th className="p-4 border">Quantité</th>
                <th className="p-4 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.Produits.map((prod) => {
                const unitPrice = prod.OrderProduct?.priceproduct || 0;
                const quantity = prod.OrderProduct.quantity;
                const totalPrice = unitPrice * quantity;
                return (
                  <tr key={prod.id} className="align-middle">
                    <td className="p-4 border">{prod.title}</td>
                    <td className="p-4 border">{unitPrice.toFixed(2)} DT</td>
                    <td className="p-4 border">{quantity}</td>
                    <td className="p-4 border">{totalPrice.toFixed(2)} DT</td>
                  </tr>
                );
              })}
              <tr className="font-bold">
                <td colSpan={3} className="p-4 border text-right">Sous-total</td>
                <td className="p-4 border">{totalProduits.toFixed(2)} DT</td>
              </tr>
              <tr className="font-bold">
                <td colSpan={3} className="p-4 border text-right">Livraison</td>
                <td className="p-4 border">{shippingCost.toFixed(2)} DT</td>
              </tr>
              <tr className="font-bold bg-gray-100">
                <td colSpan={3} className="p-4 border text-right">Total TTC</td>
                <td className="p-4 border">{(totalProduits + shippingCost).toFixed(2)} DT</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signature */}
        <div className="mt-8 text-right">
          <p className="italic text-sm text-gray-700">Signature : ___________________</p>
        </div>
      </div>

      {/* Télécharger PDF */}
      <div className="text-center mt-6">
        <button
          onClick={handleDownloadPDF}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded"
        >
          Télécharger la Facture
        </button>
      </div>
    </div>
  );
}
