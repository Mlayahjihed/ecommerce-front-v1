"use client";

import { useEffect, useState, useRef } from 'react';
import { User, Image as ImageIcon, Send, ChevronDown, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductComments = ({ productId }) => {
  const [visibleComments, setVisibleComments] = useState(6);
  const [comment, setComment] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); 
  const fileInputRef = useRef(null);

  const getUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}/${url.replace(/^\/+/, '')}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || data);
        } else {
          setUser(false);
        }
      } catch (error) {
        console.error("Erreur auth:", error);
        setUser(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/product/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Erreur chargement commentaires:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [productId]);

  const showMoreComments = () => setVisibleComments(prev => prev + 6);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setImage(file);
    setImagePreview(preview);
  };

  const resetImageInput = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    const formData = new FormData();
    formData.append('text', comment);
    formData.append('productId', productId);
    if (image) formData.append('image', image);

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setComments(prev => [{ ...data.comment, User: user }, ...prev]);
        setComment('');
        resetImageInput();
        toast.success("Commentaire ajouté !");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Erreur lors de l'ajout.");
      }
    } catch (err) {
      toast.error("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${confirmDeleteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setComments(prev => prev.filter(c => c.id !== confirmDeleteId));
        toast.success("Commentaire supprimé !");
      } else {
        toast.error("Erreur lors de la suppression.");
      }
    } catch (err) {
      toast.error("Erreur réseau.");
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h3 className="text-xl font-bold mb-6">Commentaires ({comments.length})</h3>

      {!user && user !== null && (
        <p className="text-gray-500 italic mb-6">Connectez-vous pour commenter.</p>
      )}

      {user && (
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-shrink-0">
              {user.photo_url ? (
                <img 
                  src={getUrl(user.photo_url)}
                  alt="Avatar"
                  className="h-10 w-10 rounded-full object-cover bg-gray-200"
                />
              ) : (
                <User className="h-5 w-5 text-gray-600" />
              )}
            </div>

            <div className="w-full">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-teal-500 "
                rows="3"
              />

              <input
                type="file"
                id="comment-image"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                ref={fileInputRef}
              />

              {imagePreview && (
                <div className="mt-3 relative bg-gray-100 rounded-lg p-3 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Image à publier :</p>
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="max-w-full max-h-52 rounded-md object-contain mx-auto"
                    />
                    <button
                      type="button"
                      onClick={resetImageInput}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all"
                      aria-label="Supprimer l'image"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-3 flex-wrap gap-3">
                <label
                  htmlFor="comment-image"
                  className="text-gray-600 hover:text-teal-600 flex items-center cursor-pointer transition-colors text-sm"
                >
                  <ImageIcon className="h-4 w-4 mr-1.5" />
                  {imagePreview ? "Changer d'image" : 'Ajouter une image'}
                </label>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Publier
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {loading && comments.length === 0 ? (
        <div className="text-center py-8">
          <span className="inline-block h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.slice(0, visibleComments).map(comment => (
            <div key={comment.id} className="border-b border-gray-200 pb-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  {comment.User?.photo_url ? (
                    <img
                      src={getUrl(comment.User.photo_url)}
                      alt="Avatar"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{comment.User?.user_name || 'Utilisateur'}</h4>
                    <div className="flex gap-2 items-center text-sm text-gray-500">
                      <span>
                        {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {user?.id === comment.User?.id && (
                        <button onClick={() => setConfirmDeleteId(comment.id)} className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 whitespace-pre-line">{comment.text}</p>
                  {comment.imageUrl && (
                    <div className="mt-3 bg-gray-50 rounded-lg p-3 border">
                      <img
                        src={getUrl(comment.imageUrl)}
                        alt="Illustration"
                        className="max-h-60 mx-auto object-contain rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {visibleComments < comments.length && (
        <button
          onClick={showMoreComments}
          className="mt-6 w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-teal-600 font-medium"
        >
          Voir plus ({comments.length - visibleComments})
          <ChevronDown className="ml-2 h-4 w-4" />
        </button>
      )}

      {/*  Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h4 className="text-lg font-semibold mb-4">Confirmer la suppression</h4>
            <p className="text-gray-600 mb-6">Voulez-vous vraiment supprimer ce commentaire ?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductComments;
