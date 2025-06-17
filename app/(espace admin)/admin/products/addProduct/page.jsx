"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import TextAreaField from "@/components/TextAreaField";
import ImageUploader from "@/components/ImageUploader";
import { ArrowLeft } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { toast } from 'react-toastify';
export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [marques, setMarques] = useState([])
  const [errorState, setErrorState] = useState({
    title: '',
    title: '',
    stock: '',
    price: '',
    newprice: '',
    description: '',
    categorie: '',
    sousCategorie: '',
    images: '',
    marqurId: ''
  });
  const [formData, setFormData] = useState({
    title: "",
    stock: 0,
    price: 0,
    newprice: 0,
    description: "",
    categorieId: "",
    sousCategorieId: "",
    name_categorie: "",
    name_sousCategorie: "",
    categoryChoice: "existing", // 'existing' ou 'new'
    images: [],
    marqueId: ""
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marques`)
      .then(res => res.json())
      .then(data => setMarques(data.marques.rows))
      .catch(() => toast.error("Erreur lors du chargement des marques"))
  }, [])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data.map((cat) => ({
            id: cat.id,
            name: cat.name,
            subCategories: cat.SousCategories || [],
          })));
          setLoading(false);
        }
      })
      .catch((error) => console.error(" Erreur API :", error));
  }, []);

  const handleCategoryChange = (event) => {
    const selectedCategory = categories.find((cat) => cat.id === parseInt(event.target.value));
    setFormData({
      ...formData,
      categorieId: event.target.value,
      sousCategorieId: "",
    });
    setSubCategories(selectedCategory ? selectedCategory.subCategories : []);
  };
const handleMarqueChange = (event) => {
  setFormData({
    ...formData,
    marqueId: event.target.value
  });
};
  const handleRadioChange = (event) => {
    const choice = event.target.value;
    setFormData({
      ...formData,
      categoryChoice: choice,
      categorieId: choice === "new" ? "" : formData.categorieId,
      sousCategorieId: "",
      name_categorie: "",
      name_sousCategorie: "",
    });
  };

  const handleSubmit = async (e) => {

    setLoading(true);
    setErrorState({
      title: '',
      title: '',
      stock: '',
      price: '',
      newprice: '',
      marqurId: '',
      description: '',
      categorie: '',
      sousCategorie: '',
      images: '',
    });
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("newprice", formData.newprice);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("categorieId", formData.categorieId);
    formDataToSend.append("sousCategorieId", formData.sousCategorieId);
    formDataToSend.append("marqueId", formData.marqueId);
    formDataToSend.append("nameCategorie", formData.name_categorie);
    formDataToSend.append("nameSousCategorie", formData.name_sousCategorie || formData.sousCategorieId);

    formData.images.forEach((image) => {
      formDataToSend.append("images", image);
    });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produits/add`, {
        method: "POST",
        body: formDataToSend,
        credentials: "include"
      });
      const result = await response.json();

      if (response.ok) {
        toast.success("Produit ajouter avec succeé",
          { position: "top-right" }
        )
        router.push(`/admin/products/UpdateProduct/${result.produit.id}`);
      } else {
        setErrorState(result || {});
        setLoading(false);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };
  if (loading) return <div className="min-h-screen bg-white p-6">
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#14b8a6" loading={loading} size={50} />
      </div>
    </div>

  </div>;
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-start mb-4 ">
        <button onClick={() => router.back()} className="text-teal-500 hover:text-teal-700">
          <ArrowLeft className="w-8 h-8" />
        </button>
      </div>
      <div className="p-6 mx-auto px-4 border border-cyan-100  bg-white  rounded-lg shadow-lg">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600 p-6">Ajouter un Produit</h2>
        <form className="space-y-4" encType="multipart/form-data" onSubmit={handleSubmit}>
          <InputField label="Titre" name="title" type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          {errorState.title && <div className="text-red-500 text-sm">{errorState.title}</div>}
          <InputField label="Stock" name="stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
          {errorState.stock && <div className="text-red-500 text-sm">{errorState.stock}</div>}
          <InputField label="Prix" name="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
          {errorState.price && <div className="text-red-500 text-sm">{errorState.price}</div>}
          <InputField label="Prix de Promotion" name="newprice" type="number" value={formData.newprice} onChange={(e) => setFormData({ ...formData, newprice: e.target.value })} />
          {errorState.newprice && <div className="text-red-500 text-sm">{errorState.newprice}</div>}
          <TextAreaField label="Description" name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          {errorState.description && <div className="text-red-500 text-sm">{errorState.description}</div>}
          <div  >
            <label className="block text-gray-700 mb-2">Marque</label>
            <select
              value={formData.marqueId}
              onChange={handleMarqueChange}
              className="w-full p-2 border rounded-lg focus:border-teal-400 focus:bg-white focus:outline-none"
            >
              <option value="">Sélectionner une marque</option>
              {marques.map(marque => (
                <option key={marque.id} value={marque.id}>
                  {marque.name}
                </option>
              ))}
            </select>
            {errorState.marqueId && <div className="text-red-500 text-sm mt-1">{errorState.marqueId}</div>}
          </div>
          <div className="flex space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="existing"
                checked={formData.categoryChoice === "existing"}
                onChange={handleRadioChange}
                className="sr-only peer"
              />
              <span className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-teal-400">
                <span className="w-2.5 h-2.5 bg-teal-400 rounded-full peer-checked:block hidden"></span>
              </span>
              <span className="ml-2">Utiliser une catégorie existante</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="new"
                checked={formData.categoryChoice === "new"}
                onChange={handleRadioChange}
                className="sr-only peer"
              />
              <span className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-teal-400">
                <span className="w-2.5 h-2.5 bg-teal-400 rounded-full peer-checked:block hidden"></span>
              </span>
              <span className="ml-2">Créer une nouvelle catégorie</span>
            </label>
          </div>


          {formData.categoryChoice === "existing" && (
            <>
              <label className="block text-gray-700">Catégorie</label>
              <select onChange={handleCategoryChange} className="w-full p-2 border rounded-lg focus:border-teal-400 focus:bg-white focus:outline-none ">
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errorState.categorie && <div className="text-red-500 text-sm">{errorState.categorie}</div>}
            </>
          )}
          {formData.categorieId && (
            <>
              <label className="block text-gray-700">Sous-Catégorie</label>
              <select onChange={(e) => setFormData({ ...formData, sousCategorieId: e.target.value })} className="w-full p-2 border rounded-lg focus:border-teal-400 focus:bg-white focus:outline-none">
                <option value="">Sélectionner une sous-catégorie</option>
                {subCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {formData.categorieId && !formData.sousCategorieId && (<>
            <InputField label="Nouvelle Sous-Catégorie" name="name_sousCategorie" type="text" value={formData.name_sousCategorie} onChange={(e) => setFormData({ ...formData, name_sousCategorie: e.target.value })} />
            {errorState.sousCategorie && <div className="text-red-500 text-sm">{errorState.sousCategorie}</div>}</>
          )}

          {formData.categoryChoice === "new" && (
            <>
              <InputField label="Nouvelle Catégorie" name="name_categorie" type="text" value={formData.name_categorie} onChange={(e) => setFormData({ ...formData, name_categorie: e.target.value })} />
              {errorState.categorie && <div className="text-red-500 text-sm">{errorState.categorie}</div>}
              <InputField label="Nouvelle Sous-Catégorie" name="name_sousCategorie" type="text" value={formData.name_sousCategorie} onChange={(e) => setFormData({ ...formData, name_sousCategorie: e.target.value })} />
              {errorState.sousCategorie && <div className="text-red-500 text-sm">{errorState.sousCategorie}</div>}
            </>
          )}

          <ImageUploader images={formData.images} setImages={(images) => setFormData({ ...formData, images })} />
          {errorState.images && <div className="text-red-500 text-sm">{errorState.images}</div>}
          <button type="submit" className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600">
            {"Ajouter"}
          </button>
        </form>
      </div>
    </div>
  );
}
