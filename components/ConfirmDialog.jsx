'use client';

import { Trash2 } from 'lucide-react';
import { ScaleLoader } from 'react-spinners';

export default function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  isDeleting = false 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 border border-gray-100">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-red-50 rounded-full mb-4">
            <Trash2 className="text-red-500" size={24} />
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {title}
          </h2>
          
          <p className="text-gray-600 mb-6 px-2">
            {message}
          </p>
          
          <div className="flex justify-center gap-3 w-full">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200 font-medium flex-1 max-w-[120px]"
            >
              Annuler
            </button>
            
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors duration-200 font-medium flex items-center justify-center gap-2 flex-1 max-w-[160px]"
            >
              {isDeleting ? (
                <>
                  <ScaleLoader color="#fff" height={16} width={2} />
                  <span>Suppression</span>
                </>
              ) : (
                'Confirmer'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}