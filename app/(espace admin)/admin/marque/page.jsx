'use client'

import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function Page() {
  const [marques, setMarques] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newMarque, setNewMarque] = useState({ name: '', file: null })
  const [preview, setPreview] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marques`)
      .then(res => res.json())
      .then(data => setMarques(data.marques.rows))
      .catch(() => toast.error("Erreur lors du chargement des marques"))
  }, [])

  const handleAddMarque = async () => {
    if (!newMarque.name || !newMarque.file) {
      toast.error("Nom et logo requis")
      return
    }

    const formData = new FormData()
    formData.append("name", newMarque.name)
    formData.append("logo", newMarque.file)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marques`, {
        method: "POST",
        credentials: "include",
        body: formData
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Erreur inconnue")

      toast.success("Marque ajoutée avec succès")
      setMarques(prev => [data.marque, ...prev])
      setNewMarque({ name: '', file: null })
      setPreview(null)
      setShowModal(false)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marques/${confirmDelete}`, {
        method: "DELETE",
        credentials: "include"
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Erreur lors de la suppression")

      toast.success("Marque supprimée")
      setMarques(prev => prev.filter(m => m.id !== confirmDelete))
      setConfirmDelete(null)
    } catch (err) {
      toast.error(err.message)
      setConfirmDelete(null)
    }
  }

  return (
    <div className="p-6 max-w-6x2 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-8  text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">Liste des marques</h1>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Ajouter une marque
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {marques.map((marque, index) => (
          <div key={marque.id || index} className="relative group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <button
              onClick={() => setConfirmDelete(marque.id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              &times;
            </button>
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <img 
                src={`${process.env.NEXT_PUBLIC_API_URL}/${marque.logo}`} 
                alt={marque.name} 
                className="w-full h-full object-contain p-4" 
              />
            </div>
            <div className="p-4 border-t border-gray-100">
              <p className="text-center font-medium text-gray-800 truncate">{marque.name}</p>
            </div>
          </div>
        ))}
      </div>

      {marques.length === 0 && (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-600">Aucune marque ajoutée</h3>
          <p className="mt-1 text-gray-500">Commencez par ajouter votre première marque</p>
        </div>
      )}

      {/* Modale d'ajout */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajouter une marque</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la marque</label>
                  <input
                    type="text"
                    placeholder="Ex: Nike, Adidas..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    value={newMarque.name}
                    onChange={(e) => setNewMarque({ ...newMarque, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg cursor-pointer transition">
                      <div className="flex flex-col items-center justify-center pt-7">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="pt-1 text-sm text-gray-600">
                          {newMarque.file ? newMarque.file.name : 'Cliquez pour télécharger'}
                        </p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="opacity-0" 
                        onChange={(e) => {
                          const file = e.target.files[0]
                          setNewMarque({ ...newMarque, file })
                          setPreview(file ? URL.createObjectURL(file) : null)
                        }}
                      />
                    </label>
                  </div>
                </div>
                {preview && (
                  <div className="border rounded-lg overflow-hidden">
                    <img src={preview} alt="Preview" className="w-full h-40 object-contain" />
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button 
                onClick={() => { setShowModal(false); setPreview(null) }} 
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleAddMarque} 
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
              >
                Ajouter la marque
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de suppression personnalisée */}
{confirmDelete !== null && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 text-center space-y-6 border border-gray-100">
      <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100">
        <Trash2 className="h-6 w-6 text-red-600" />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">Supprimer cette marque</h2>
        <p className="text-gray-500 text-base">Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?</p>
      </div>
      
      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={() => setConfirmDelete(null)}
          className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium w-full max-w-[150px]"
        >
          Annuler
        </button>
        <button
          onClick={handleDelete}
          className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 font-medium w-full max-w-[180px] flex items-center justify-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          Supprimer
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}
