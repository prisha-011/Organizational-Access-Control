import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react"; // Import Icons

export default function AddUser2({ onSuccess, user, onCancel }) {
  const initialForm = { 
    firstName: "", middleName: "", lastName: "", age: "", 
    email: "", userName: "", password: "", address: "", 
    task: "", mobileNo: "", role: "USER" 
  };
  
  const [form, setForm] = useState(user || initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  
  // State for toggling password visibility (only for Create Mode)
  const [showPassword, setShowPassword] = useState(false);

  // Update form when user prop changes (Edit Mode)
  useEffect(() => {
    if (user) {
      setForm({
        ...user,
        password: user.plainPassword || user.password || "", // Keep password in state
        role: user.role || "USER"
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobileNo" && (!/^\d*$/.test(value) || value.length > 10)) return;
    if (name === "age" && (!/^\d*$/.test(value) || value.length > 3)) return;
    if ((name === "address" || name === "task") && value.length > 1000) return;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, age: form.age ? parseInt(form.age) : 0 };

    // --- GET TOKEN ---
    const token = localStorage.getItem("token");

    try {
      const url = user ? `http://localhost:8080/api/update?id=${user.id}` : "http://localhost:8080/api/create";
      const method = user ? "PUT" : "POST";
      
      const res = await fetch(url, { 
          method, 
          headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
          }, 
          body: JSON.stringify(payload) 
      });

      if (!res.ok) throw new Error(await res.text());
      
      setSaving(false);
      if (onSuccess) onSuccess();
    } catch (err) { 
        setSaving(false); 
        setError(err.message || "Server error"); 
    }
  };

  const inputClass = "w-full p-2 border rounded focus:ring-2 focus:ring-blue-100 outline-none";
  const textAreaClass = "w-full p-2 pb-7 border rounded focus:ring-2 focus:ring-blue-100 outline-none resize-none"; 
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm w-full h-full border border-gray-100 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {user ? `Edit User (ID: ${user.id})` : "New User Details"}
          </h2>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={submit} className="space-y-4">
        {/* Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>First Name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} required placeholder="Enter First Name" />
          </div>
          <div>
            <label className={labelClass}>Middle Name</label>
            <input name="middleName" value={form.middleName} onChange={handleChange} className={inputClass} placeholder="Enter Middle Name" />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} required placeholder="Enter Last Name" />
          </div>
        </div>

        {/* Contact Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Age</label>
            <input name="age" value={form.age} onChange={handleChange} type="text" className={inputClass} placeholder="Enter Age" />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input name="email" value={form.email} onChange={handleChange} type="email" className={inputClass} required placeholder="Enter Email Address" />
          </div>
          <div>
            <label className={labelClass}>Mobile No</label>
            <input name="mobileNo" value={form.mobileNo} onChange={handleChange} type="text" placeholder="Enter 10 digits" className={inputClass} />
          </div>
        </div>

        {/* Credentials & Role Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Username</label>
            <input name="userName" value={form.userName} onChange={handleChange} className={inputClass} required placeholder="Enter Username" />
          </div>
          
          {/* --- PASSWORD FIELD: HIDDEN IN EDIT MODE, VISIBLE IN CREATE MODE --- */}
          {!user && (
            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  type={showPassword ? "text" : "password"} // Dynamic type
                  className={`${inputClass} pr-10`} 
                  required 
                  placeholder="Enter Password" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* Role Dropdown */}
          <div>
            <label className={labelClass}>Assign Role</label>
            <select 
                name="role" 
                value={form.role} 
                onChange={handleChange} 
                className={inputClass}
                disabled={form.role === 'SUPER_ADMIN'}
            >
                <option value="USER">User (Standard)</option>
                <option value="ADMIN">Admin (Manager)</option>
                {form.role === 'SUPER_ADMIN' && <option value="SUPER_ADMIN">⚡ Super Admin</option>}
            </select>
          </div>
        </div>

        {/* Address Field */}
        <div>
          <label className={labelClass}>Address</label>
          <div className="relative">
            <textarea 
                name="address" 
                value={form.address} 
                onChange={handleChange} 
                maxLength={1000} 
                className={textAreaClass} 
                rows="3" 
                placeholder="Enter full address here..." 
            />
            <span className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-1 rounded pointer-events-none">
                {form.address?.length || 0}/1000
            </span>
          </div>
        </div>
        
        {/* Task Field */}
        <div>
          <label className={labelClass}>Task</label>
          <div className="relative">
            <textarea 
                name="task" 
                value={form.task} 
                onChange={handleChange} 
                maxLength={1000} 
                className={textAreaClass} 
                rows="3" 
                placeholder="Enter task or notes here..." 
            />
            <span className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-1 rounded pointer-events-none">
                {form.task?.length || 0}/1000
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
           <button type="button" onClick={onCancel} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
           <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">
             {saving ? "Processing..." : user ? "Update User" : "Create User"}
           </button>
        </div>
      </form>
    </div>
  );
}