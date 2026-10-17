import React, { useEffect, useState } from "react";

export default function UserProfile({ userId }) {
  // Use prop ID, or fallback to localStorage, or null
  const currentUserId = userId || localStorage.getItem("userId"); 
  const token = localStorage.getItem("token"); // <--- GET TOKEN

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", mobileNo: "", userName: "", password: "", address: ""
  });

  const [passState, setPassState] = useState({
    currentInput: "", newInput: "", confirmInput: ""
  });

  const [showPass, setShowPass] = useState({
    current: false, new: false, confirm: false
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // --- FIXED: FETCH WITH TOKEN ---
  useEffect(() => {
    if (!currentUserId || !token) {
        setLoading(false);
        return;
    }

    setLoading(true);
    fetch(`http://localhost:8080/api/byid/${currentUserId}`, {
        headers: {
            'Authorization': `Bearer ${token}` // <--- ADDED HEADER
        }
    })
      .then(async res => {
          if (!res.ok) throw new Error("Failed to fetch user data");
          return res.json();
      })
      .then(data => { 
          setForm(data); 
      })
      .catch(err => {
          console.error(err);
          setMessage({ type: "error", text: "Failed to load profile data." });
      })
      .finally(() => {
          setLoading(false); // <--- CRITICAL: Always stop loading
      });
  }, [currentUserId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "mobileNo") {
        if (value === "") {
            setForm({ ...form, [name]: value });
            return;
        }
        if (!/^[6-9]\d{0,9}$/.test(value)) {
            return;
        }
    }

    setForm({ ...form, [name]: value });
  };

  const handlePassChange = (e) => setPassState({ ...passState, [e.target.name]: e.target.value });
  
  const preventPaste = (e) => {
    e.preventDefault();
    alert("For security, please type your password.");
  };

  const toggleVis = (field) => setShowPass(prev => ({ ...prev, [field]: !prev[field] }));

  // --- FIXED: SAVE PROFILE WITH TOKEN ---
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
        const payload = { ...form, age: form.age ? parseInt(form.age) : 0 };
        const res = await fetch(`http://localhost:8080/api/update?id=${currentUserId}`, {
            method: "PUT", 
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // <--- ADDED HEADER
            }, 
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Update failed");
        setMessage({ type: "success", text: "Personal details updated successfully!" });
    } catch (err) { setMessage({ type: "error", text: "Failed to update profile." }); } finally { setSaving(false); }
  };

  // --- FIXED: SAVE PASSWORD WITH TOKEN ---
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    if (passState.currentInput !== form.password) {
        setMessage({ type: "error", text: "Incorrect current password." }); setSaving(false); return;
    }
    if (passState.newInput !== passState.confirmInput) {
        setMessage({ type: "error", text: "New passwords do not match." }); setSaving(false); return;
    }
    if (!passState.newInput) {
        setMessage({ type: "error", text: "New password cannot be empty." }); setSaving(false); return;
    }

    try {
        const payload = { ...form, password: passState.newInput, age: form.age ? parseInt(form.age) : 0 };
        const res = await fetch(`http://localhost:8080/api/update?id=${currentUserId}`, {
            method: "PUT", 
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // <--- ADDED HEADER
            }, 
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Update failed");
        
        setForm(prev => ({ ...prev, password: passState.newInput }));
        setPassState({ currentInput: "", newInput: "", confirmInput: "" });
        setShowPass({ current: false, new: false, confirm: false });
        setMessage({ type: "success", text: "Password changed successfully!" });
    } catch (err) { setMessage({ type: "error", text: "Failed to change password." }); } finally { setSaving(false); }
  };

  const EyeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
  const EyeSlashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>);

  if (loading) return <div className="flex h-64 items-center justify-center text-gray-400">Loading profile data...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h2>
        <p className="text-gray-500 mt-1">Manage your personal information and account security.</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm font-medium border animate-fade-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            <span className="text-lg">{message.type === 'success' ? '✓' : '⚠'}</span>
            {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <form onSubmit={handleProfileSave} className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><span>👤</span> Personal Details</h3>
                    <p className="text-xs text-gray-500 mt-1">This information will be displayed on your public profile.</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    <div className="space-y-1"><label className="text-sm font-medium text-gray-700">First Name</label><input name="firstName" value={form.firstName} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-2.5 text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-all sm:text-sm" /></div>
                    <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Last Name</label><input name="lastName" value={form.lastName} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-2.5 text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-all sm:text-sm" /></div>
                    <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Email Address</label><input name="email" value={form.email} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-2.5 text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-all sm:text-sm" /></div>
                    
                    {/* Mobile Input with Validation */}
                    <div className="space-y-1"><label className="text-sm font-medium text-gray-700">Mobile Number</label><input name="mobileNo" value={form.mobileNo} onChange={handleChange} placeholder="Starts with 6-9, 10 digits" className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-2.5 text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-all sm:text-sm" /></div>
                    
                    <div className="md:col-span-2 space-y-1"><label className="text-sm font-medium text-gray-700">Address</label><textarea name="address" value={form.address || ""} onChange={handleChange} rows="3" className="block w-full rounded-lg border-gray-300 bg-gray-50 border p-2.5 text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none transition-all sm:text-sm" /></div>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                    <button type="submit" disabled={saving} className="flex w-full justify-center rounded-lg bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-all">{saving ? "Saving..." : "Save Profile Changes"}</button>
                </div>
            </div>
        </form>

        {/* RIGHT COLUMN */}
        <form onSubmit={handlePasswordSave} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><span>🔒</span> Security</h3>
                    <p className="text-xs text-gray-500 mt-1">Manage your login credentials.</p>
                </div>
                <div className="p-6 flex-1 space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Current Password</label>
                        <div className="relative">
                            <input type={showPass.current ? "text" : "password"} onPaste={preventPaste} name="currentInput" value={passState.currentInput} onChange={handlePassChange} placeholder="Type current password" className="block w-full rounded-lg border-gray-300 bg-white border p-2.5 pr-10 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all sm:text-sm" />
                            <button type="button" onClick={() => toggleVis('current')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">{showPass.current ? <EyeIcon /> : <EyeSlashIcon />}</button>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">New Password</label>
                        <div className="relative">
                            <input type={showPass.new ? "text" : "password"} onPaste={preventPaste} name="newInput" value={passState.newInput} onChange={handlePassChange} placeholder="Type new password" className="block w-full rounded-lg border-gray-300 bg-white border p-2.5 pr-10 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all sm:text-sm" />
                            <button type="button" onClick={() => toggleVis('new')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">{showPass.new ? <EyeIcon /> : <EyeSlashIcon />}</button>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                        <div className="relative">
                            <input type={showPass.confirm ? "text" : "password"} onPaste={preventPaste} name="confirmInput" value={passState.confirmInput} onChange={handlePassChange} placeholder="Confirm new password" className="block w-full rounded-lg border-gray-300 bg-white border p-2.5 pr-10 text-gray-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all sm:text-sm" />
                            <button type="button" onClick={() => toggleVis('confirm')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">{showPass.confirm ? <EyeIcon /> : <EyeSlashIcon />}</button>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                    <button type="submit" disabled={saving} className="flex w-full justify-center rounded-lg bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-all">{saving ? "Updating..." : "Change Password"}</button>
                </div>
            </div>
        </form>
      </div>
    </div>
  );
}