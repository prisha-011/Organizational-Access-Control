import React, { useEffect, useState } from "react";

export default function UpdateUser({ id, onSuccess }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    mobileNo: "",
    password: "", // Include password if you want to allow changing it, or keep it hidden
    age: "",
    address: "",
    task: ""
    // Add middleName if needed
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 1. FETCH DATA: Load the user details when the component mounts or ID changes
  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        // Matches @GetMapping("byid/{id}")
        const res = await fetch(`http://localhost:8080/api/byid/${id}`);
        if (!res.ok) throw new Error("Could not fetch user details");
        
        const data = await res.json();
        
        // Fill the form with existing data
        // We use || "" to ensure the input doesn't become "uncontrolled" if data is null
        setForm({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            userName: data.userName || "",
            email: data.email || "",
            mobileNo: data.mobileNo || "",
            password: data.password || "", // Be careful showing passwords
            age: data.age || "",
            address: data.address || "",
            task: data.task || ""
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 2. SAVE DATA: Send the updates to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Convert age to number safely
    const payload = {
        ...form,
        age: form.age ? parseInt(form.age) : 0
    };

    try {
      // Matches @PutMapping("update") which expects ?id= parameter
      const res = await fetch(`http://localhost:8080/api/update?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("User Updated Successfully!");
      if (onSuccess) onSuccess(); // Go back to the table

    } catch (err) {
      console.error(err);
      setError("Server error: Could not update user.");
    } finally {
      setSaving(false);
    }
  };

  if (!id) return <div className="text-gray-500">Please select a user from the 'View Users' table first.</div>;
  if (loading) return <div>Loading user details...</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm w-full h-full border border-gray-100 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Update User (ID: {id})</h2>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* First Name */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
           <input required name="firstName" value={form.firstName} onChange={handleChange} 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {/* Last Name */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
           <input required name="lastName" value={form.lastName} onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {/* Username */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
           <input required name="userName" value={form.userName} onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {/* Mobile */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No</label>
           <input required name="mobileNo" value={form.mobileNo} onChange={handleChange} placeholder="10 digits"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {/* Email */}
        <div className="md:col-span-2">
           <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
           <input required type="email" name="email" value={form.email} onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

         {/* Extra Fields (Optional) */}
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
           <input type="number" name="age" value={form.age} onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
           <input type="text" name="address" value={form.address} onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {/* Password (Usually hidden or required to change) */}
        <div className="md:col-span-2">
           <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
           <input required type="text" name="password" value={form.password} onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
           <button 
             type="button" 
             onClick={onSuccess} 
             className="px-4 py-2 border rounded hover:bg-gray-50 text-gray-600"
           >
             Cancel
           </button>
           <button 
             type="submit" 
             disabled={saving}
             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
           >
             {saving ? "Updating..." : "Update User"}
           </button>
        </div>

      </form>
    </div>
  );
}