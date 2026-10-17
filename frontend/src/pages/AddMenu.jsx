import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { useNavigate } from 'react-router-dom';

const AddMenu = () => {
  const { addMenuItem } = useMenu();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !url) return alert("Please fill in both fields");
    
    // Add the new item to the global context
    addMenuItem(name, url);
    
    alert(`Menu "${name}" added successfully!`);
    navigate('/dashboard'); // Go back to dashboard after adding
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Sidebar Menu</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Menu Name</label>
          <input 
            type="text" 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="e.g. Products"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">URL Path</label>
          <input 
            type="text" 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="e.g. /products"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
          + Add Menu Item
        </button>
      </form>
    </div>
  );
};

export default AddMenu;