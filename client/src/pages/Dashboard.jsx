import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState("");
    const [rooms, setRooms] = useState([]);
    
    // UI states
    const [error, setError] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, []);
      
    const fetchRooms = async () => {
        try {
            const response = await api.get("/rooms/my-rooms");
            setRooms(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateRoom = async () => {
        setIsCreating(true);
        setError("");
        
        try {
            const response = await api.post("/rooms/create");
            navigate(`/room/${response.data.roomId}`);
        } catch (error) {
            console.error(error);
            setError("Failed to create a new room. Please try again.");
            setIsCreating(false);
        }
    };

    const handleJoinRoom = async () => {
        if (!roomId.trim()) {
            setError("Please enter a Room ID to join.");
            return;
        }

        setIsJoining(true);
        setError("");
        
        try {
            await api.post("/rooms/join", { roomId });
            navigate(`/room/${roomId}`);
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to join room. Please check the ID."
            );
            setIsJoining(false);
        }
    };

    const handleDeleteRoom = async (idToDelete) => {
        try {
            // Optimistically update UI for a snappier feel (optional but good UX)
            setRooms(rooms.filter(room => room._id !== idToDelete && room.roomId !== idToDelete));
            
            await api.delete(`/rooms/${idToDelete}`);
            fetchRooms(); // Refresh the list from the server to be safe
        } catch (error) {
            console.error(error);
            setError("Failed to delete room.");
            fetchRooms(); // Revert UI if it failed
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-indigo-500/30 overflow-hidden flex flex-col relative">
            
            {/* Background Grid & Glow */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[400px] w-[600px] rounded-full bg-indigo-500 opacity-10 blur-[120px] pointer-events-none"></div>

            {/* Dashboard Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-zinc-900/50 bg-zinc-950/80 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-lg rounded-md">D</div>
                    <span className="text-xl font-bold text-white tracking-tight">DevMate</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-400 shadow-inner">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        {user?.username || "Developer"}
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* Main Content Area (Scrollable) */}
            <main className="relative z-10 flex-1 overflow-y-auto px-4 py-12">
                <div className="w-full max-w-2xl mx-auto pb-12">
                    
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
                            Welcome to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Terminal.</span>
                        </h1>
                        <p className="text-zinc-500 text-lg">
                            Create a new workspace or jump into an existing session.
                        </p>
                    </div>

                    {/* Global Error Banner */}
                    {error && (
                        <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg text-sm flex items-center gap-3 justify-center shadow-lg animate-in fade-in slide-in-from-top-2">
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* The Command Center UI */}
                    <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-2 mb-12">
                        
                        {/* Option 1: Create Room */}
                        <div className="p-4 sm:p-6 rounded-xl hover:bg-zinc-800/50 transition-colors group">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 shrink-0 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors shadow-inner">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Initialize Workspace</h3>
                                        <p className="text-sm text-zinc-500 mt-0.5">Start a fresh environment and invite collaborators.</p>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleCreateRoom}
                                    disabled={isCreating || isJoining}
                                    className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-white text-zinc-950 font-medium py-2.5 px-6 rounded-lg hover:bg-zinc-200 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                >
                                    {isCreating ? (
                                        <svg className="animate-spin h-5 w-5 text-zinc-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        "Create Room"
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-2"></div>

                        {/* Option 2: Join Room */}
                        <div className="p-4 sm:p-6 rounded-xl hover:bg-zinc-800/50 transition-colors group">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 shrink-0 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-colors shadow-inner">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    </div>
                                    <div className="w-full">
                                        <h3 className="text-lg font-semibold text-white mb-2">Connect to Workspace</h3>
                                        <div className="relative max-w-xs">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                                                <span className="text-xs font-mono border border-zinc-700 bg-zinc-800 px-1.5 rounded">ID</span>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="e.g. a7b2-9x1p"
                                                value={roomId}
                                                onChange={(e) => {
                                                    setRoomId(e.target.value);
                                                    if (error) setError("");
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleJoinRoom();
                                                }}
                                                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-zinc-700 font-mono text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleJoinRoom}
                                    disabled={isCreating || isJoining || !roomId.trim()}
                                    className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-6 rounded-lg transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 mt-2 sm:mt-0"
                                >
                                    {isJoining ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        "Connect"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- NEW: Your Workspaces Section --- */}
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            Your Workspaces 
                            <span className="bg-zinc-800 text-zinc-400 text-xs py-0.5 px-2 rounded-full font-mono">
                                {rooms.length}
                            </span>
                        </h2>
                    </div>

                    {rooms.length === 0 ? (
                        <div className="bg-zinc-900/30 border border-zinc-800/50 border-dashed rounded-2xl p-8 text-center">
                            <p className="text-zinc-500 text-sm">No active workspaces found. Create one above to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {rooms.map((room) => (
                                <div 
                                    key={room._id || room.roomId}
                                    onClick={() => navigate(`/room/${room.roomId}`)}
                                    className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 transition-colors shadow-inner">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-zinc-200">
                                                Room <span className="font-mono text-indigo-300 ml-1">{room.roomId}</span>
                                            </h4>
                                            <p className="text-xs text-zinc-500 mt-0.5">Click to join session</p>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                          
                                            handleDeleteRoom(
                                              room.roomId
                                            );
                                          }}
                                        className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete Room"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;