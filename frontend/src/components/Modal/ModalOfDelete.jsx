import React from 'react';

const ModalOfDelete = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Arkaplan overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel}></div>
      
      {/* Modal içeriği */}
      <div className="bg-white rounded-lg p-6 shadow-xl z-10 w-[90%] max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Dersi Silmek İstediğinize Emin misiniz?
        </h3>
        <p className="text-gray-600 mb-6">
          Bu işlem geri alınamaz.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalOfDelete; 