"use client";

import { useState, useEffect } from "react";
import {
    Trash2,
    ChevronDown,
    ChevronUp,
    User,
    Image as ImageIcon,
    Search,
} from "lucide-react";
import { toast } from "react-toastify";

const AdminCommentsPage = () => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedComment, setExpandedComment] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [search, setSearch] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    useEffect(() => {

        fetchComments();
    }, [page, search]);

    const fetchComments = async () => {
        try {
            const params = new URLSearchParams({ page, search });
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/products?${params}`, {
                credentials: 'include'
            });

            const data = await response.json();

            console.log("Réponse API : ", data);

            if (response.ok && data.success) {
                setComments(data.comments || []);
                setTotalPages(data.totalPages || 1);
                
            } else {
                console.warn("Erreur API ou format inattendu :", data);
                setComments([]);
            }

            setLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération des commentaires :", error);
            setComments([]);
            setLoading(false);
        }
    };

    const confirmDelete = (id) => setConfirmDeleteId(id);
    const cancelDelete = () => setConfirmDeleteId(null);

    const handleDelete = async () => {
        if (!confirmDeleteId) return;
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${confirmDeleteId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );
            if (response.ok) {
                setComments((prev) =>
                    prev.filter((comment) => comment.id !== confirmDeleteId)
                );
                toast.success("Commentaire supprimé avec succès !");
                setConfirmDeleteId(null);
            }
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const toggleExpand = (id) =>
        setExpandedComment((prev) => (prev === id ? null : id));

    const filteredComments = comments.filter((comment) => {
        const content = `${comment.User?.user_name || ""} ${comment.Produit?.title || ""
            } ${comment.text}`.toLowerCase();
        return content.includes(searchTerm.toLowerCase());
    });

    const getFullImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http")) return url;
        return `${process.env.NEXT_PUBLIC_API_URL}/${url.replace(/^\/+/g, "")}`;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8  text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">Liste des Commentaires</h1>

            {/* Pop-up de confirmation */}
            {confirmDeleteId && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
                        <p className="mb-6 text-gray-600">
                            Voulez-vous vraiment supprimer ce commentaire ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-center mb-6">
        <div className="relative w-full sm:w-[34rem]">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par User_name"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="grid grid-cols-12 bg-gray-50 p-4 font-medium text-gray-700">
                        <div className="col-span-3 md:col-span-2">Utilisateur</div>
                        <div className="col-span-5 md:col-span-6">Commentaire</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {filteredComments.length > 0 ? (
                        filteredComments.map((comment) => (
                            <div key={comment.id} className="border-b border-gray-100">
                                <div className="grid grid-cols-12 p-4 items-center hover:bg-gray-50">
                                    <div className="col-span-3 md:col-span-2 flex items-center">
                                        <div className="bg-gray-200 rounded-full p-1 mr-3">
                                            {comment.User?.photo_url ? (
                                                <img
                                                    src={getFullImageUrl(comment.User.photo_url)}
                                                    alt="Avatar"
                                                    className="h-8 w-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-5 w-5 text-gray-600" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                {comment.User?.user_name || "Utilisateur"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-5 md:col-span-6 line-clamp-2">
                                        {comment.text}
                                        {comment.imageUrl && (
                                            <div className="mt-1 text-sm text-teal-500 flex items-center">
                                                <ImageIcon className="h-4 w-4 mr-1" />
                                                Image jointe
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-2 text-sm text-gray-500">
                                        {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
                                    </div>

                                    <div className="col-span-2 flex justify-end space-x-2">
                                        <button
                                            onClick={() => toggleExpand(comment.id)}
                                            className="p-2 text-gray-500 hover:text-teal-600"
                                            aria-label="Voir détails"
                                        >
                                            {expandedComment === comment.id ? (
                                                <ChevronUp className="h-5 w-5" />
                                            ) : (
                                                <ChevronDown className="h-5 w-5" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(comment.id)}
                                            className="p-2 text-gray-500 hover:text-red-600"
                                            aria-label="Supprimer"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {expandedComment === comment.id && (
                                    <div className="bg-gray-50 p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2">
                                            <div className="mb-4">
                                                <h4 className="font-medium mb-1">Commentaire</h4>
                                                <p className="text-gray-700 whitespace-pre-line">
                                                    {comment.text}
                                                </p>
                                            </div>
                                            {comment.imageUrl && (
                                                <div>
                                                    <h4 className="font-medium mb-2">Image</h4>
                                                    <img
                                                        src={getFullImageUrl(comment.imageUrl)}
                                                        alt="Commentaire"
                                                        className="max-w-full max-h-52 rounded border"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="mb-4">
                                                <h4 className="font-medium mb-1">Produit</h4>
                                                <p className="text-gray-700">
                                                    {comment.Produit?.title || "Produit inconnu"}
                                                </p>
                                                {comment.Produit?.Images?.[0]?.url && (
                                                    <img
                                                        src={getFullImageUrl(comment.Produit.Images[0].url)}
                                                        alt="Produit"
                                                        className="mt-2 h-20 object-contain border rounded"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            Aucun commentaire trouvé
                        </div>
                    )}
                </div>
            )}
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2 flex-wrap">
                    {page > 1 && (
                        <button onClick={() => setPage(page - 1)} className="px-4 py-2 rounded-md bg-teal-500 text-white">
                            ←
                        </button>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                        <button
                            key={pageNumber}
                            onClick={() => setPage(pageNumber)}
                            className={`px-4 py-2 rounded-md ${page === pageNumber ? "bg-teal-500 text-white" : "bg-gray-300 text-gray-700"}`}
                        >
                            {pageNumber}
                        </button>
                    ))}
                    {page < totalPages && (
                        <button onClick={() => setPage(page + 1)} className="px-4 py-2 rounded-md bg-teal-500 text-white">
                            →
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminCommentsPage;
