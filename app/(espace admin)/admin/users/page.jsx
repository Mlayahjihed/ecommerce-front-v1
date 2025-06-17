'use client';

import { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { Search } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import { toast } from 'react-toastify';


export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [confirmData, setConfirmData] = useState({ isOpen: false, userId: null });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ user_name: '', email: '', password: '', confirm: '' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    const params = new URLSearchParams({ page, search });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users?${params}`, {
        credentials: 'include',
      });
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const openConfirmDialog = (id) => {
    setConfirmData({ isOpen: true, userId: id });
  };

  const confirmToggleBan = async () => {
    const { userId } = confirmData;
    setConfirmData({ isOpen: false, userId: null });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/ban/${userId}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        toast.success('Utilisateur banni avec succès');
      } else {
        toast.error('Erreur lors du bannissement');
      }
    } catch (error) {
      console.error('Erreur bannissement:', error);
    }
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormErrors(data);
      } else {
        toast.success('Utilisateur ajouté avec succès');
        setUsers((prev) => [data.user, ...prev]);
        setShowAddUserModal(false);
        setNewUserData({ user_name: '', email: '', password: '', confirm: '' });
      }
    } catch (err) {
      setFormErrors({ general: 'Erreur serveur' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 flex justify-center items-center">
        <ClipLoader color="#14b8a6" loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">Liste des Utilisateurs</h1>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md flex items-center gap-2"
        ><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Ajouter Utilisateur
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative w-full sm:w-[34rem]">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par ID, Nom ou Email..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="bg-white shadow rounded p-6 border border-cyan-100 overflow-x-auto">
        {users.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">Aucun utilisateur trouvé.</div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="text-gray-600 border-t border-b border-gray-300">
              <tr>
                <th className="p-3 text-left">#ID</th>
                <th className="p-3 text-left">Photo</th>
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-300 hover:bg-gray-50 transition">
                  <td className="p-3 font-semibold">#{user.id}</td>
                  <td className="p-3">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${user.photo_url}`}
                      alt={user.user_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="p-3">{user.user_name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => openConfirmDialog(user.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      Bloquer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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

      <ConfirmDialog
        isOpen={confirmData.isOpen}
        title="Bloquer l'utilisateur"
        message="Êtes-vous sûr de vouloir bloquer cet utilisateur ?"
        onConfirm={confirmToggleBan}
        onCancel={() => setConfirmData({ isOpen: false, userId: null })}
      />

       {showAddUserModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 backdrop-blur-sm">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Ajouter un utilisateur</h2>
      </div>
      
      <form onSubmit={handleAddUser}>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input 
              name="user_name" 
              value={newUserData.user_name} 
              onChange={handleNewUserChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
            />
            {formErrors.user_name && <p className="mt-1 text-red-500 text-sm">{formErrors.user_name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              name="email" 
              type="email" 
              value={newUserData.email} 
              onChange={handleNewUserChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
            />
            {formErrors.email && <p className="mt-1 text-red-500 text-sm">{formErrors.email}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input 
              name="password" 
              type="password" 
              value={newUserData.password} 
              onChange={handleNewUserChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
            />
            {formErrors.password && <p className="mt-1 text-red-500 text-sm">{formErrors.password}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer</label>
            <input 
              name="confirm" 
              type="password" 
              value={newUserData.confirm} 
              onChange={handleNewUserChange} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
            />
            {formErrors.confirm && <p className="mt-1 text-red-500 text-sm">{formErrors.confirm}</p>}
          </div>
        </div>
        
        {formErrors.general && (
          <p className="text-red-500 text-sm mb-4 text-center">{formErrors.general}</p>
        )}
        
        <div className="flex justify-center space-x-3">
          <button 
            onClick={() => setShowAddUserModal(false)} 
            type="button" 
            className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="px-5 py-2.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors duration-200 font-medium flex items-center justify-center"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}
