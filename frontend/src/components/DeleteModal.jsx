import React from "react";

export default function DeleteModal({ user, onClose, onConfirm, title, message, confirmText, confirmColor }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in relative">
        
        {/* NEW: Cross Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <h3 className="text-lg font-bold text-gray-900 mb-2 pr-8">
            {title || "Confirm Action"}
        </h3>
        
        <p className="text-gray-500 text-sm mb-6">
            {message || `Are you sure you want to proceed with user ${user.firstName} ${user.lastName}?`}
        </p>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          
          <button 
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors shadow-sm ${confirmColor || "bg-red-600 hover:bg-red-700"}`}
          >
            {confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}