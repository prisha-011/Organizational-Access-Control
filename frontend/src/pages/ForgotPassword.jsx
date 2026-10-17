import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowLeft, Loader2 } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            // Call the backend endpoint
            const response = await fetch(`http://localhost:8080/api/forgot-password?email=${encodeURIComponent(email)}`, {
                method: 'POST'
            });
            const text = await response.text();
            setMessage(text); // Shows: "If an account exists, a link has been sent."
        } catch (err) {
            setMessage("Network Error. Is the backend running?");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-slate-50 justify-center items-center px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <button onClick={() => navigate('/login')} className="flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to login
                </button>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Forgot Password</h2>
                <p className="text-slate-500 mb-6">Enter your email address and we'll send you a link to reset your password.</p>

                {message && <div className="p-3 mb-4 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg">{message}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                        <input 
                            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            required placeholder="name@company.com"
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-70 flex justify-center items-center">
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Send Reset Link"}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default ForgotPassword;