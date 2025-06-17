// components/FavoriteButton.jsx
"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'react-toastify';


export default function FavoriteButton({ productId }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification et l'état favori
  useEffect(() => {
    const checkAuthAndFavorite = async () => {
      try {
        // Vérifier d'abord l'authentification
        const authRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: 'include',
        });

        if (!authRes.ok) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);

        // Si authentifié, vérifier l'état favori
        const favoriteRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/favorites/check?productId=${productId}`,
          { credentials: 'include' }
        );

        if (favoriteRes.ok) {
          const data = await favoriteRes.json();
          setIsFavorite(data.isFavorite);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFavorite();
  }, [productId]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const url = isFavorite
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/favorites/${productId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/favorites`;

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: !isFavorite ? JSON.stringify({ productId }) : undefined,
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
        toast.success(
          isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris'
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  // Ne rien afficher si non connecté
  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="p-2">
        <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className={`
        p-2 rounded-full transition-all duration-200
        ${isFavorite
          ? 'text-teal-500 hover:bg-teal-50'
          : 'text-gray-400 hover:text-teal-500 hover:bg-gray-50'
        }
        focus:outline-none focus:ring-2 focus:ring-teal-200
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <Heart 
        size={20} 
        className={isFavorite ? 'fill-current' : ''} 
        strokeWidth={isFavorite ? 1.8 : 2}
      />
    </button>
  );
}