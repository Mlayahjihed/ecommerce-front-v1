"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Pour la redirection
import Logo from "./../../../../images/register.png";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // État pour les valeurs des champs de saisie
  const [inputState, setInputState] = useState({
    user_name: "",
    email: "",
    password: "",
    confirm: "",
  });

  // État pour les erreurs
  const [errorState, setErrorState] = useState({
    user_name: "",
    email: "",
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
    setErrorState({ user_name: "", email: "", password: "", confirm: "", general: "" });

    const { user_name, email, password, confirm } = inputState;
    const data = { user_name, email, password, confirm };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
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
        toast.success("Inscription réussie !",
          { position: "top-right" }
        )
        router.push("/auth"); // Redirection après inscription
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
          <h1 className=" leading-tight mt-12 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">Créer un compte</h1>

          <form className="mt-6" onSubmit={handleSubmit}>
            {/* Champ Nom et Prénom */}
            <div>
              <label htmlFor="user_name" className="block text-gray-700">Nom et prénom</label>
              <input
                type="text"
                id="user_name"
                name="user_name"
                value={inputState.user_name}
                onChange={handleChange}
                placeholder="Votre nom et prénom"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-teal-400 focus:bg-white focus:outline-none"
              />
              {errorState.user_name && <div className="text-red-500 text-sm">{errorState.user_name}</div>}
            </div>

            {/* Champ Email */}
            <div className="mt-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={inputState.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-teal-400 focus:bg-white focus:outline-none"
              />
              {errorState.email && <div className="text-red-500 text-sm">{errorState.email}</div>}
            </div>

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

          {/* Lien vers la connexion */}
          <p className="mt-8">
            <a href="/auth" className="text-teal-500 hover:text-teal-600 font-semibold">
              J'ai déjà un compte !
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
