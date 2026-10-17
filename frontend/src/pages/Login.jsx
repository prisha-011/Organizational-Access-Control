import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // UI States for better UX
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true); // Start loading animation

        try {
            const response = await fetch('http://localhost:8080/api/login-new', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            // 1. Read the raw text first (safely)
            const text = await response.text(); 
            
            // 2. Try to parse it as JSON
            let data = {};
            try {
                data = JSON.parse(text);
            } catch (e) {
                // If parsing fails, it's just a text message from backend
                data = { message: text }; 
            }

            if (response.ok) { // Success (200 OK)
                // --- SAVE DATA ---
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId); 
                localStorage.setItem('userName', data.userName); 
                
                // Add a tiny delay so user sees the success state before redirect
                setTimeout(() => navigate('/dashboard'), 500);
            } else { // Failure (401 or 403)
                // Show the REAL error message from backend
                setError(data.message || 'Invalid Credentials'); 
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError('Network Error: Is the Backend running?');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full">
            
            {/* LEFT SIDE - DECORATIVE IMAGE (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img 
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                        alt="Background" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 p-12 text-white max-w-lg">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30">
                        <CheckCircle2 size={32} className="text-white" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">Manage Your Team Efficiently.</h1>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        Access your dashboard to manage users, permissions, and tasks in one seamless interface. Secure, fast, and reliable.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE - LOGIN FORM */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white px-8 md:px-16 lg:px-24">
                <div className="w-full max-w-md space-y-8">
                    
                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
                        <p className="mt-2 text-slate-500">Please enter your details to sign in.</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fade-in">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-red-700 font-medium">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        
                        {/* Username Input */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Username or Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                                    required 
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-slate-700">Password</label>
                                {/* Link to the Forgot Password page we made earlier */}
                                <a 
                                    href="/forgot-password" 
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                                    onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                                    required 
                                    placeholder="••••••••"
                                />
                                <div 
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>
                    
                    {/* Footer Text */}
                    <p className="text-center text-sm text-slate-500 mt-8">
                        Don't have an account? <span className="text-blue-600 font-medium cursor-pointer hover:underline">Contact Admin</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;