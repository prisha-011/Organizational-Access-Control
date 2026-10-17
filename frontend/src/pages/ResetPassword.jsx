import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Grab the token from the URL!
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/api/reset-password?token=${token}&newPassword=${encodeURIComponent(newPassword)}`, {
                method: 'POST'
            });
            const text = await response.text();
            setMessage(text);
            
            if (response.ok) {
                setTimeout(() => navigate('/login'), 2000); // Send them to login after success
            }
        } catch (err) {
            setMessage("Network Error.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) return <div className="text-center mt-20 text-red-500 font-bold">Error: No reset token provided in URL.</div>;

    return (
        <div className="min-h-screen flex w-full bg-slate-50 justify-center items-center px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New Password</h2>
                <p className="text-slate-500 mb-6">Your new password must be different from previous used passwords.</p>

                {message && <div className={`p-3 mb-4 text-sm font-medium rounded-lg ${message.includes('successfully') ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                        <input 
                            type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            required placeholder="New Password"
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-70 flex justify-center items-center">
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default ResetPassword;