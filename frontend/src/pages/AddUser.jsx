import React, { useState, useEffect } from "react";
// 1. Import Icons, Navigation, and Toast
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddUser({ onSuccess, updateUserId, onCancel }) {
  // 2. Add 'role' to initial state
  const initialForm = { 
    firstName: "", middleName: "", lastName: "", age: "", 
    email: "", userName: "", password: "", address: "", 
    task: "", mobileNo: "", role: "USER" 
  };
  
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  // 3. Initialize Navigation
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (updateUserId) {
      setLoading(true);
      fetch(`http://localhost:8080/api/byid/${updateUserId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch user");
            return res.json();
        })
        .then(data => {
            setForm({
                firstName: data.firstName || "", middleName: data.middleName || "", lastName: data.lastName || "",
                age: data.age ? String(data.age) : "", email: data.email || "", userName: data.userName || "",
                password: data.password || "", address: data.address || "", task: data.task || "", mobileNo: data.mobileNo || "",
                role: data.role || "USER" // Load existing role
            });
            setLoading(false);
        }).catch(() => { setError("Failed to load user data"); setLoading(false); });
    } else { setForm(initialForm); }
  }, [updateUserId, token]);

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
    
    try {
      const url = updateUserId ? `http://localhost:8080/api/update?id=${updateUserId}` : "http://localhost:8080/api/create";
      const method = updateUserId ? "PUT" : "POST";
      
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

      // 4. Success Toast & Redirect
      toast.success(updateUserId ? "User updated successfully!" : "New user added successfully!");
      
      if (onSuccess) {
          onSuccess(); // If used in Modal
      } else {
          navigate('/view-users'); // If used as Page
      }

    } catch (err) { 
        setSaving(false); 
        setError(err.message || "Server error"); 
        toast.error(err.message || "Failed to save user");
    }
  };

  if (loading) return <div>Loading...</div>;

  const inputClass = "w-full p-2 border rounded focus:ring-2 focus:ring-blue-100 outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm w-full h-full border border-gray-100 overflow-y-auto">
      <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {updateUserId ? `Edit User (ID: ${updateUserId})` : "New User Details"}
          </h2>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={submit} className="space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className={labelClass}>First Name</label><input name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} required placeholder="Enter First Name" /></div>
          <div><label className={labelClass}>Middle Name</label><input name="middleName" value={form.middleName} onChange={handleChange} className={inputClass} placeholder="Enter Middle Name" /></div>
          <div><label className={labelClass}>Last Name</label><input name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} required placeholder="Enter Last Name" /></div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className={labelClass}>Age</label><input name="age" value={form.age} onChange={handleChange} type="text" className={inputClass} required placeholder="Enter Age" /></div>
          <div><label className={labelClass}>Email</label><input name="email" value={form.email} onChange={handleChange} type="email" className={inputClass} required placeholder="Enter Email Address" /></div>
          <div><label className={labelClass}>Mobile No</label><input name="mobileNo" value={form.mobileNo} onChange={handleChange} type="text" placeholder="Enter 10 digits" className={inputClass} /></div>
        </div>

        {/* Row 3: Username, Password & Role */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Username</label>
            <input name="userName" value={form.userName} onChange={handleChange} className={inputClass} required placeholder="Enter Username" />
          </div>
          
          {/* 5. Password Field: Only show if Creating New User (updateUserId is null) */}
          {!updateUserId && (
            <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                <input 
                    name="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    type={showPassword ? "text" : "password"} 
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

          {/* 6. Role Dropdown */}
          <div>
            <label className={labelClass}>Assign Role</label>
            <select name="role" value={form.role} onChange={handleChange} className={inputClass} disabled={form.role === 'SUPER_ADMIN'}>
                <option value="USER">User (Standard)</option>
                <option value="ADMIN">Admin (Manager)</option>
                {form.role === 'SUPER_ADMIN' && <option value="SUPER_ADMIN">⚡ Super Admin</option>}
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className={labelClass}>Address</label>
          <div className="relative">
             <textarea name="address" value={form.address} onChange={handleChange} maxLength={1000} className={inputClass} rows="2" placeholder="Enter full address here..." />
             <span className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-1 rounded pointer-events-none">{form.address?.length || 0}/1000</span>
          </div>
        </div>

        {/* Task */}
        <div>
          <label className={labelClass}>Task</label>
           <div className="relative">
              <textarea name="task" value={form.task} onChange={handleChange} maxLength={1000} className={inputClass} rows="2" placeholder="Enter task or notes here..." />
              <span className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-1 rounded pointer-events-none">{form.task?.length || 0}/1000</span>
           </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
           <button type="button" onClick={onCancel || (() => navigate('/view-users'))} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
           <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">{saving ? "Processing..." : updateUserId ? "Update User" : "Create User"}</button>
        </div>
      </form>
    </div>
  );
}