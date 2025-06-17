"use client"
import { useState } from "react";
import Image from "next/image";
import Logo from "./../../../../images/forget.png";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
export default function forget() {
    const [loading, setLoading] = useState(false);
  // État pour les valeurs des champs de saisie
  const [inputState, setInputState] = useState({
    email: '',
  });
  // État pour les erreurs
  const [errorState, setErrorState] = useState({
    email: '',
    general: ''
  });
  // Gérer le changement de valeur des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  const router = useRouter();
  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    // Réinitialisation des erreurs
    setErrorState({
      email: '',
      general: ''
    });
    // Récupérer les valeurs des champs
    const { email } = inputState;
    const data = { email };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        // Si l'API renvoie des erreurs, les mettre dans errorState
        setErrorState(result|| {});
        setLoading(false)
      } else {
        setLoading(false)
        toast.success("Email envoyé avec succès !",
            {position : "top-right"}
          )
        router.push("/auth");
      }
    } catch (error) {
        setLoading(false)
      setErrorState({ general: 'Une erreur est survenue. Veuillez réessayer.' });
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
        <Image src={Logo} alt="Paysage décoratif" width={700} height={700} priority={true}/>
      </div>

      {/* Section droite */}
      <div className="w-full md:w-1/2 xl:w-1/3 h-full px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className=" leading-tight mt-12 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">Mot de passe oubliée</h1>

          <form onSubmit={handleSubmit} className="mt-6">
            {/* Champ email */}
            <div>
              <label htmlFor="email" className="block text-gray-700">
                Email 
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={inputState.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-teal-400 focus:bg-white focus:outline-none"
              />
              {errorState.email && <div className="text-red-500 text-sm">{errorState.email}</div>}
            </div>
            {/* Message d'erreur général */}
            {errorState.general && <div className="text-red-500 text-sm mt-2">{errorState.general}</div>}

            {/* Bouton de connexion */}
            <button
              type="submit"
              className="w-full block bg-teal-500 hover:bg-teal-600 focus:bg-teal-600 text-white font-semibold rounded-lg px-4 py-3 mt-6"
            >
              Envoyer
            </button>
          </form>

          <hr className="my-6 border-gray-300 w-full" />
        </div>
      </div>
    </section>
  );
}
