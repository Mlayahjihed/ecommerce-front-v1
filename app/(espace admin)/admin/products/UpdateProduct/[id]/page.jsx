"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import InputField from "@/components/InputField";
import TextAreaField from "@/components/TextAreaField";
import ImageUploader from "@/components/ImageUploader";
import { ArrowLeft } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

export default function UpdateProduct() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [marques, setMarques] = useState([])
    const [errorState, setErrorState] = useState({
        title: '',
        title: '',
        stock: '',
        price: '',
        description: '',
        categorie: '',
        sousCategorie: '',
        images: '',
        newprice: '',
        marqueId: ""
    });
    const [formData, setFormData] = useState({
        title: "",
        stock: 0,
        price: 0,
        newprice: 0,
        marqueId: "",
        description: "",
        categorieId: "",
        sousCategorieId: "",
        name_categorie: "",
        name_sousCategorie: "",
        categoryChoice: "existing",
        images: [],
        existingImages: []
    });
useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marques`)
      .then(res => res.json())
      .then(data => setMarques(data.marques.rows))
      .catch(() => toast.error("Erreur lors du chargement des marques"))
  }, [])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, productRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produits/${id}`)
                ]);
                const categoriesData = await categoriesRes.json();
                const productData = await productRes.json();
                const formattedCategories = categoriesData.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    subCategories: cat.SousCategories || [],
                }));
                setCategories(formattedCategories);
                const selectedCategory = formattedCategories.find(cat => cat.id === productData.categorieId);
                setSubCategories(selectedCategory ? selectedCategory.subCategories : []);
                // Update formData state
                setFormData(prev => ({
                    ...prev,
                    title: productData.title,
                    stock: productData.stock,
                    price: productData.price,
                     newprice: productData.newprice,
                    description: productData.description,
                    categorieId: productData.categorieId || "",
                    marqueId: productData.marqueId || "",
                    sousCategorieId: productData.sousCategorieId || "",
                    existingImages: productData.Images || [],
                    categoryChoice: productData.categorieId ? "existing" : "new",
                }));

            } catch (error) {
                console.error("Error API:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleCategoryChange = (event) => {
        const selectedCategory = categories.find(cat => cat.id === parseInt(event.target.value));
        setFormData(prev => ({
            ...prev,
            categorieId: event.target.value,
            sousCategorieId: "",
        }));
        setSubCategories(selectedCategory ? selectedCategory.subCategories : []);
    };
const handleMarqueChange = (event) => {
  setFormData({
    ...formData,
    marqueId: event.target.value
  });
};
    const handleRadioChange = (event) => {
        setFormData(prev => ({
            ...prev,
            categoryChoice: event.target.value,
            categorieId: event.target.value === "new" ? "" : prev.categorieId,
            sousCategorieId: "",
            name_categorie: "",
            name_sousCategorie: "",
        }));
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        setErrorState({
            title: '',
            title: '',
            stock: '',
            price: '',
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
        formDataToSend.append("nameSousCategorie", formData.name_sousCategorie);
        formData.images.forEach(image => formDataToSend.append("images", image));

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produits/update/${id}`, {
                method: "PUT",
                body: formDataToSend,
                credentials: "include",
            });
            const result = await response.json();

            if (response.ok) {
                setFormData({
                    title: result.title,
                    stock: result.stock,
                    price: result.price,
                    newprice: result.newprice,
                    description: result.description,
                    categorieId: result.categorieId || "",
                    marqueId: result.marqueId || "",
                    sousCategorieId: result.sousCategorieId || "",
                    existingImages: result.Images || [],
                    categoryChoice: result.categorieId ? "existing" : "new",
                    images: []
                });
                toast.success("Produit Modifer avec succeé",
                    { position: "top-right" }
                )
                setLoading(false);
            } else {
                setErrorState(result || {});
                setLoading(false);
            }
        } catch (error) {
            console.error(" Erreur réseau :", error);
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
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600 p-6">Mettre à jour le Produit</h2>
                {formData.existingImages.length > 0 && (
                    <div className="mt-4 p-4">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Images existantes</h3>
                        <div className="grid grid-cols-5 gap-4">
                            {formData.existingImages.map((url, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${url.url}`}
                                        alt={`Produit ${index}`}
                                        className="w-full h-[250px] object-cover rounded-lg shadow-md"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <form className="space-y-4 p-4" onSubmit={handleSubmit}>
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
                                className="peer hidden"
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
                                className="peer hidden"
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
                            <select onChange={handleCategoryChange} value={formData.categorieId} className="w-full p-2 border rounded-lg  focus:border-teal-400 focus:bg-white focus:outline-none">
                                <option value="">Sélectionner une catégorie</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                            {errorState.categorie && <div className="text-red-500 text-sm">{errorState.categorie}</div>}

                            {formData.categorieId && (
                                <>
                                    <label className="block text-gray-700">Sous-Catégorie</label>
                                    <select value={formData.sousCategorieId} onChange={(e) => setFormData({ ...formData, sousCategorieId: e.target.value })} className="w-full p-2 border rounded-lg focus:border-teal-400 focus:bg-white focus:outline-none">
                                        <option value="">Sélectionner une sous-catégorie</option>
                                        {subCategories.map((sub) => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                        ))}
                                    </select>
                                </>
                            )}

                            {formData.categorieId && !formData.sousCategorieId && (<>
                                <InputField label="Nouvelle Sous-Catégorie" name="name_sousCategorie" type="text" value={formData.name_sousCategorie} onChange={(e) => setFormData({ ...formData, name_sousCategorie: e.target.value })} />
                                {errorState.sousCategorie && <div className="text-red-500 text-sm">{errorState.sousCategorie}</div>}</>

                            )}
                        </>
                    )}

                    {formData.categoryChoice === "new" && (
                        <div>
                            <InputField label="Nom de la nouvelle catégorie" name="name_categorie" type="text" value={formData.name_categorie} onChange={(e) => setFormData({ ...formData, name_categorie: e.target.value })} />
                            {errorState.categorie && <div className="text-red-500 text-sm">{errorState.categorie}</div>}
                            <InputField label="Nom de la nouvelle sous-catégorie" name="name_sousCategorie" type="text" value={formData.name_sousCategorie} onChange={(e) => setFormData({ ...formData, name_sousCategorie: e.target.value })} />
                            {errorState.sousCategorie && <div className="text-red-500 text-sm">{errorState.sousCategorie}</div>}
                        </div>
                    )}

                    <ImageUploader images={formData.images} setImages={(images) => setFormData({ ...formData, images })} />
                    {errorState.images && <div className="text-red-500 text-sm">{errorState.images}</div>}
                    <button type="submit" className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600">Mettre à jour</button>
                </form>
            </div>
        </div>
    );
}
