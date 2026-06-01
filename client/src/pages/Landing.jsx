import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Landing() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    // Auto-redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    // Your exact Google Success Handler
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await api.post("/auth/google", {
                credential: credentialResponse.credential,
            });

            login(
                {
                    _id: response.data._id,
                    username: response.data.username,
                    email: response.data.email,
                },
                response.data.token
            );

            navigate("/dashboard");
        } catch (error) {
            console.error("Authentication Error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-indigo-500/30 overflow-hidden relative">

            {/* Background Grid & Glow */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>

            {/* Clean Navigation (No extra login buttons) */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-lg rounded-md">D</div>
                    <span className="text-xl font-bold text-white tracking-tight">DevMate</span>
                </div>
                
            </nav>

            {/* Spatial Hero Section */}
            <header className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-32 text-center group perspective-1000">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
                    Multiplayer coding. <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600">
                        AI supercharged.
                    </span>
                </h1>
                <p className="text-lg text-zinc-500 max-w-xl mx-auto mb-10">
                    Drop into a collaborative workspace in seconds. Sync logic, review architecture with AI, and ship faster together.
                </p>

                {/* THE GOOGLE LOGIN BUTTON */}
                {/* Primary Google Auth CTA - Added z-50 and relative positioning */}
                <div className="relative z-50 flex justify-center mb-12 mt-2">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.log("Login Failed")}
                        theme="filled_black"
                        shape="pill"
                        size="large"
                        text="continue_with"
                    />
                </div>
                {/* Floating 3D Cards Visual */}
                <div className="relative w-full max-w-4xl mx-auto h-[400px] flex items-center justify-center cursor-default">

                    {/* Left Card: Raw Code (Rotated Left) */}
                    <div className="absolute hidden md:block w-72 h-80 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-5 shadow-2xl transition-all duration-700 ease-out transform -translate-x-48 rotate-[-12deg] translate-y-8 opacity-60 group-hover:rotate-[-16deg] group-hover:-translate-x-56 group-hover:opacity-40">
                        <div className="flex gap-1.5 mb-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                        </div>
                        <div className="font-mono text-xs text-indigo-300 space-y-2 opacity-70 text-left">
                            <p>function calculate() {"{"}</p>
                            <p className="pl-4">let x = 10;</p>
                            <p className="pl-4 text-rose-400">return x * y; // Error</p>
                            <p>{"}"}</p>
                        </div>
                    </div>

                    {/* Right Card: AI Insights (Rotated Right) */}
                    <div className="absolute hidden md:block w-72 h-80 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-5 shadow-2xl transition-all duration-700 ease-out transform translate-x-48 rotate-[12deg] translate-y-12 opacity-60 group-hover:rotate-[16deg] group-hover:translate-x-56 group-hover:opacity-40">
                        <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3 text-emerald-400">
                            <span className="text-sm">✨ AI Suggestion</span>
                        </div>
                        <div className="text-sm text-zinc-400 leading-relaxed text-left">
                            Variable <code className="bg-zinc-800 px-1 rounded text-rose-300">y</code> is not defined. Consider passing it as a parameter to the function.
                        </div>
                    </div>

                    {/* Center Card: The Main Room (Front & Center) */}
                    <div className="absolute z-10 w-full max-w-md h-96 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 rounded-2xl p-1 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-700 ease-out transform group-hover:scale-105 group-hover:-translate-y-4">
                        <div className="w-full h-full border border-zinc-800/50 rounded-xl bg-zinc-950 flex flex-col overflow-hidden">
                            {/* Fake Editor Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-b border-zinc-800">
                                <div className="text-xs font-mono text-zinc-500">Room: x8q-2p1</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-indigo-500 border border-zinc-900 z-10"></div>
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 border border-zinc-900 -ml-3"></div>
                                </div>
                            </div>
                            {/* Fake Editor Body */}
                            <div className="flex-1 p-4 font-mono text-sm leading-loose relative text-left">
                                <div className="text-zinc-400"><span className="text-indigo-400">export const</span> <span className="text-blue-300">Room</span> = () <span className="text-indigo-400">=&gt;</span> {"{"}</div>
                                <div className="pl-6 text-zinc-400">
                                    <span className="text-indigo-400">const</span> [code, setCode] = <span className="text-emerald-300">useState</span>(<span className="text-amber-300">""</span>);
                                </div>
                                <div className="pl-6 mt-4 text-zinc-500">// Your cursor is here</div>
                                <div className="text-zinc-400">{"}"}</div>

                                {/* Fake Cursor */}
                                <div className="absolute top-[102px] left-[48px] w-0.5 h-4 bg-indigo-500 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </header>

            {/* "Command Palette" Features Section */}
            <section className="relative z-10 max-w-3xl mx-auto px-6 py-24">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-semibold text-white">Everything at your fingertips</h2>
                </div>

                {/* The Palette UI */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Search Bar */}
                    <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-800 bg-zinc-950/50">
                        <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="text-zinc-500 text-sm">Discover DevMate features...</span>
                    </div>

                    {/* Feature List */}
                    <div className="p-2 space-y-1">
                        {/* Feature 1 */}
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/50 transition-colors group cursor-default">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded bg-zinc-800 text-zinc-400 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-zinc-200">Real-time WebSocket Sync</h4>
                                    <p className="text-xs text-zinc-500 mt-0.5">Sub-millisecond latency code sharing.</p>
                                </div>
                            </div>
                            <div className="hidden sm:flex text-xs font-mono text-zinc-600 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">Available Now</div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/50 transition-colors group cursor-default">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded bg-zinc-800 text-zinc-400 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-zinc-200">AI Code Reviewer</h4>
                                    <p className="text-xs text-zinc-500 mt-0.5">Spot bugs and get refactoring tips instantly.</p>
                                </div>
                            </div>
                            <div className="hidden sm:flex text-xs font-mono text-zinc-600 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">Powered by LLM</div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/50 transition-colors group cursor-default">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded bg-zinc-800 text-zinc-400 flex items-center justify-center group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-zinc-200">Monaco Editor Integration</h4>
                                    <p className="text-xs text-zinc-500 mt-0.5">The exact same core engine that powers VS Code.</p>
                                </div>
                            </div>
                            <div className="hidden sm:flex text-xs font-mono text-zinc-600 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">JS, PY, C++</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-zinc-900 bg-zinc-950 py-8 text-center text-sm text-zinc-600">
                <p>&copy; {new Date().getFullYear()} DevMate. Built for the modern web.</p>
            </footer>

        </div>
    );
}

export default Landing;