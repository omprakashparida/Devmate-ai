import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    // Added UI states for a better user experience
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error when user starts typing
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            await api.post("/auth/register", formData);
            
            setSuccess(true);
            
            // Wait a moment so the user sees the success message before redirecting
            setTimeout(() => {
                navigate("/");
            }, 1500);
            
        } catch (error) {
            setError(
                error.response?.data?.message || "Registration failed. Please try again."
            );
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 selection:bg-blue-500/30 font-sans text-zinc-300">
            
            {/* Logo/Brand Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm mb-2">
                    DevMate AI
                </h1>
                <p className="text-zinc-500 text-sm">
                    Create an account to join the workspace
                </p>
            </div>

            {/* Register Card */}
            <div className="w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success Alert */}
                    {success && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Registration successful! Redirecting...</span>
                        </div>
                    )}

                    {/* Username Input Group */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-400 ml-1">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                placeholder="johndoe"
                                onChange={handleChange}
                                required
                                disabled={success}
                                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-zinc-600 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Email Input Group */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-400 ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                placeholder="developer@example.com"
                                onChange={handleChange}
                                required
                                disabled={success}
                                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-zinc-600 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Password Input Group */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-400 ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                placeholder="••••••••"
                                onChange={handleChange}
                                required
                                disabled={success}
                                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-zinc-600 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={isLoading || success}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </>
                        ) : success ? (
                            "Account Created!"
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-6 text-center text-sm text-zinc-500">
                    Already have an account?{" "}
                    <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;