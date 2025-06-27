"use client";
import Image from "next/image";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Pour la redirection
import Logo from "./../../../../../images/reset.png";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

export default function Reset() {
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const router = useRouter();
    // État pour les valeurs des champs de saisie
    const [inputState, setInputState] = useState({
        password: "",
        confirm: "",
    });

    // État pour les erreurs
    const [errorState, setErrorState] = useState({
        password: "",
        confirm: "",
        general: "",
    });

    // Gérer le changement de valeur des champs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        setErrorState({ password: "", confirm: "", general: "" });
        const { password, confirm } = inputState;
        const data = { password, confirm };
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (!response.ok) {
                setLoading(false)
                setErrorState(result || {});
            } else {
                setLoading(false)
                setInputState({password: "",
        confirm: "",})
                toast.success("Mot de passe modifié avec succès !",
                    { position: "top-right" }
                )
            }
        } catch (error) {
            setLoading(false)
            setErrorState({ general: "Une erreur est survenue. Veuillez réessayer." });
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
        <section className="flex flex-col md:flex-row h-screen">
            {/* Section gauche */}
            <div className="bg-teal-200 hidden lg:flex w-full h-screen items-center justify-center">
                <Image src={Logo} alt={Logo} width={800} height={800} priority={true} />
            </div>

            {/* Section droite */}
            <div className="w-full md:w-1/2 xl:w-1/3 h-full px-6 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <h1 className=" leading-tight mt-12 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">nouvaux mot de passe</h1>

                    <form className="mt-6" onSubmit={handleSubmit}>

                        {/* Champ Mot de passe */}
                        <div className="mt-4">
                            <label htmlFor="password" className="block text-gray-700">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={inputState.password}
                                onChange={handleChange}
                                placeholder="**********"
                                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-teal-400 focus:bg-white focus:outline-none"
                            />
                            {errorState.password && <div className="text-red-500 text-sm">{errorState.password}</div>}
                        </div>

                        {/* Champ Confirmation du mot de passe */}
                        <div className="mt-4">
                            <label htmlFor="confirm" className="block text-gray-700">Confirmer Mot de passe</label>
                            <input
                                type="password"
                                id="confirm"
                                name="confirm"
                                value={inputState.confirm}
                                onChange={handleChange}
                                placeholder="**********"
                                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-teal-400 focus:bg-white focus:outline-none"
                            />
                            {errorState.confirm && <div className="text-red-500 text-sm">{errorState.confirm}</div>}
                        </div>

                        {/* Message d'erreur général */}
                        {errorState.general && <div className="text-red-500 text-sm mt-2">{errorState.general}</div>}

                        {/* Bouton d'inscription */}
                        <button
                            type="submit"
                            className="w-full block bg-teal-500 hover:bg-teal-600 focus:bg-teal-600 text-white font-semibold rounded-lg px-4 py-3 mt-6"
                        >
                            Enregistrer
                        </button>
                    </form>

                    <hr className="my-6 border-gray-300 w-full" />

                </div>
            </div>
        </section>
    );
}
