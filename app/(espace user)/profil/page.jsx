'use client'
import InputField from '@/components/InputField';
import { toast } from "react-toastify";
import { useEffect, useState } from 'react';

export default function UserProfileForms() {
  const [selectedAvatar, setSelectedAvatar] = useState(null); // Pour stocker le fichier sélectionné
  const [previewAvatar, setPreviewAvatar] = useState(''); // Pour afficher le preview
  
  const [user, setUser] = useState({
    id: '',
    photo_url: '',
    user_name: '',
    email: '',

  });
  const [pass, setPass] = useState({
    password: '',
    confirm: '',


  });
  const [errorState, setErrorState] = useState({
    id: '',
    photo_url: '',
    user_name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };
  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setPass(prev => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);
  const updateProfile = async () => {
    setErrorState({id: '',
      photo_url: '',
      user_name: '',
      email: '',
      password: '',
      confirm: '',});
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/updateprofile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: user.email,
          user_name: user.user_name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profil mis à jour !");
      } else {
        setErrorState(data);
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };
  const resetPassword = async () => {
    try {
      setErrorState({
        id: '',
        photo_url: '',
        user_name: '',
        email: '',
        password: '',
        confirm: '',
      });
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset2`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: pass.password,
          confirm: pass.confirm,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Mot de passe modifié avec succès !");
        setPass({ password: "", confirm: "" }); // Reset le form
      } else {
        setErrorState(data);
      }

    } catch (error) {
      toast.error("Erreur lors de la mise à jour du mot de passe");
    }
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Vérification du type de fichier
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image valide");
      return;
    }

    // Vérification de la taille du fichier (ex: max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error("L'image ne doit pas dépasser 2MB");
      return;
    }

    // Si tout est bon ➔ Prévisualiser l'image
    setSelectedAvatar(file);
    setPreviewAvatar(URL.createObjectURL(file)); // Montre la preview
  };
  const uploadAvatar = async () => {
    if (!selectedAvatar) {
      toast.error("Veuillez sélectionner une image d'abord !");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedAvatar);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/update-avatar`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Avatar mis à jour !");
      } else {
        toast.error("Erreur lors de l'upload de l'avatar");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur réseau lors de l'upload de l'avatar");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Colonne de gauche - Avatar et ID */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <div className="relative mb-4">
            <img
              src={previewAvatar ? previewAvatar : `${process.env.NEXT_PUBLIC_API_URL}/${user.photo_url}`}
              alt="User Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-teal-100"
            />

            <button
              type="button"
              onClick={() => document.getElementById('avatar-upload').click()} // ➔ Ici on clique sur l'input caché
              className="absolute bottom-0 right-0 bg-teal-500 text-white rounded-full p-2 hover:bg-teal-600 transition shadow-md"
              aria-label="Modifier l'avatar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>

          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">ID Utilisateur</p>
            <p className="text-lg font-semibold text-gray-800">#{user.id}</p>
          </div>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange} // ➔ Ici tu appelles ta fonction
          />

          {selectedAvatar && (
            <div className="pt-2">
              <button
                type="button"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg transition duration-200"
                onClick={uploadAvatar}
              >
                Mettre à jour l'avatar
              </button>
            </div>
          )}


        </div>

        {/* Colonne de droite - Formulaires */}
        <div className="w-full md:w-2/3 space-y-8">
          {/* Premier formulaire - Email et Username */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations de base</h2>

            <form className="space-y-4">
              <InputField
                label="Adresse Email"
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
              />
              {errorState.email && <div className="text-red-500 text-sm">{errorState.email}</div>}
              <InputField
                label="Nom d'utilisateur"
                type="text"
                name="user_name"
                value={user.user_name}
                onChange={handleInputChange}
              />
              {errorState.user_name && <div className="text-red-500 text-sm">{errorState.user_name}</div>}
              <div className="pt-2">
                <button
                  type="button"
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg transition duration-200"
                  onClick={updateProfile}
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>

          {/* Deuxième formulaire - Password et Confirmation */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sécurité</h2>

            <form className="space-y-4">
              <InputField
                label="Nouveau mot de passe"
                type="password"
                name="password"
                value={pass.password}
                onChange={handleInputChange2}
              />
              {errorState.password && <div className="text-red-500 text-sm">{errorState.password}</div>}

              <InputField
                label="Confirmation du mot de passe"
                type="password"
                name="confirm"
                value={pass.confirm}
                onChange={handleInputChange2}
              />
              {errorState.confirm && <div className="text-red-500 text-sm">{errorState.confirm}</div>}

              <div className="pt-2">
                <button
                  type="button"
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg transition duration-200"
                  onClick={resetPassword}
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}